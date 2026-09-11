import { describe, expect, it, vi } from "vitest";

import { cacheProfile } from "./cache-profiles";
import { memoryStore, type LastGoodEntry } from "./last-good";
import { NoFallbackError, resilient, withFreshness } from "./resilient";

const NOW = new Date("2026-09-11T12:00:00.000Z");
const at = (isoOffsetSeconds: number) => new Date(NOW.getTime() - isoOffsetSeconds * 1000);

const seeded = (key: string, entry: LastGoodEntry<string>) =>
  memoryStore(new Map<string, LastGoodEntry<unknown>>([[key, entry]]));

const silent = () => undefined;

describe("TS-009-A4: resilient() decides the tier per call", () => {
  it("answers tier 1 and writes last-good when the upstream answers", async () => {
    const store = memoryStore();
    const envelope = await resilient(async () => "live payload", {
      key: "dates:x",
      kind: "dates",
      store,
      now: () => NOW,
      onDegrade: silent,
    });

    expect(envelope).toMatchObject({ data: "live payload", tier: "live", stale: false });
    expect(store.entries.get("dates:x")).toEqual({ data: "live payload", fetchedAt: NOW.toISOString() });
  });

  it("keeps an empty valid answer at tier 1 — emptiness is not a failure", async () => {
    const envelope = await resilient(async () => [] as string[], {
      key: "dates:empty",
      kind: "dates",
      store: memoryStore(),
      now: () => NOW,
      onDegrade: silent,
    });
    expect(envelope.tier).toBe("live");
    expect(envelope.data).toEqual([]);
  });

  it("falls to tier 2 from last-good on an upstream error, and carries its fetchedAt", async () => {
    const fetchedAt = at(600).toISOString();
    const store = seeded("dates:x", { data: "cached", fetchedAt });

    const envelope = await resilient<string>(
      async () => {
        throw new Error("HTTP 500");
      },
      { key: "dates:x", kind: "dates", store, now: () => NOW, onDegrade: silent },
    );

    expect(envelope).toMatchObject({ data: "cached", tier: "stale", stale: true, fetchedAt });
  });

  it("treats a schema failure exactly like a network failure", async () => {
    const store = seeded("dates:x", { data: "cached", fetchedAt: at(60).toISOString() });
    const envelope = await resilient<string>(
      async () => {
        throw new Error("events-api: schema: expected number");
      },
      { key: "dates:x", kind: "dates", store, now: () => NOW, onDegrade: silent },
    );
    expect(envelope.tier).toBe("stale");
  });

  it("falls to tier 3 when last-good is past its serve-stale window", async () => {
    const beyond = cacheProfile("dates").staleWindowSeconds + 60;
    const store = seeded("dates:x", { data: "far too old", fetchedAt: at(beyond).toISOString() });

    const envelope = await resilient<string>(
      async () => {
        throw new Error("HTTP 503");
      },
      {
        key: "dates:x",
        kind: "dates",
        store,
        now: () => NOW,
        snapshot: () => "snapshot payload",
        onDegrade: silent,
      },
    );

    expect(envelope).toMatchObject({ data: "snapshot payload", tier: "snapshot", stale: true });
  });

  it("falls to tier 3 when there is no last-good entry at all", async () => {
    const envelope = await resilient<string>(
      async () => {
        throw new Error("network error");
      },
      {
        key: "dates:cold",
        kind: "dates",
        store: memoryStore(),
        now: () => NOW,
        snapshot: () => "snapshot payload",
        onDegrade: silent,
      },
    );
    expect(envelope.tier).toBe("snapshot");
  });

  it("makes one attempt only — a failing upstream is never retried in-request", async () => {
    const fetcher = vi.fn(async () => {
      throw new Error("HTTP 500");
    });
    await resilient(fetcher, {
      key: "dates:x",
      kind: "dates",
      store: seeded("dates:x", { data: "cached", fetchedAt: NOW.toISOString() }),
      now: () => NOW,
      onDegrade: silent,
    }).catch(() => undefined);

    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("reports every degradation as an event, never as a message to the visitor", async () => {
    const events: unknown[] = [];
    await resilient<string>(
      async () => {
        throw new Error("HTTP 500");
      },
      {
        key: "dates:x",
        kind: "dates",
        store: seeded("dates:x", { data: "cached", fetchedAt: NOW.toISOString() }),
        now: () => NOW,
        onDegrade: (event) => events.push(event),
      },
    );
    expect(events).toEqual([{ key: "dates:x", tier: "stale", reason: "HTTP 500" }]);
  });
});

describe("TS-009-A4 / TS-009 D6: the counters have no tier 3", () => {
  it("throws NoFallbackError when no snapshot is offered and no last-good survives", async () => {
    await expect(
      resilient<string>(
        async () => {
          throw new Error("HTTP 500");
        },
        { key: "stats", kind: "counters", store: memoryStore(), now: () => NOW, onDegrade: silent },
      ),
    ).rejects.toBeInstanceOf(NoFallbackError);
  });
});

describe("TS-009-A10: the freshness label's conditions", () => {
  it("stays absent for a tier-1 answer inside its fresh TTL", () => {
    const envelope = {
      data: 1,
      tier: "live" as const,
      fetchedAt: at(60).toISOString(),
      stale: false,
      demo: false,
      source: "real" as const,
    };
    expect(withFreshness(envelope, "dates", NOW).stale).toBe(false);
  });

  it("appears for a tier-1 answer served past its fresh TTL", () => {
    const envelope = {
      data: 1,
      tier: "live" as const,
      fetchedAt: at(cacheProfile("dates").freshTtlSeconds + 30).toISOString(),
      stale: false,
      demo: false,
      source: "real" as const,
    };
    expect(withFreshness(envelope, "dates", NOW).stale).toBe(true);
  });

  it("never unsets a label a tier-2 or tier-3 answer already carries", () => {
    const envelope = {
      data: 1,
      tier: "stale" as const,
      fetchedAt: NOW.toISOString(),
      stale: true,
      demo: false,
      source: "real" as const,
    };
    expect(withFreshness(envelope, "dates", NOW).stale).toBe(true);
  });
});

describe("TS-003 D5: the cache table is the only place these numbers exist", () => {
  it("carries TS-003 D5's fresh TTL and serve-stale window per data kind", () => {
    expect(cacheProfile("dates")).toEqual({ freshTtlSeconds: 300, staleWindowSeconds: 259_200 });
    expect(cacheProfile("activePlaces")).toEqual({ freshTtlSeconds: 3600, staleWindowSeconds: 604_800 });
    expect(cacheProfile("counters")).toEqual({ freshTtlSeconds: 900, staleWindowSeconds: 259_200 });
  });
});
