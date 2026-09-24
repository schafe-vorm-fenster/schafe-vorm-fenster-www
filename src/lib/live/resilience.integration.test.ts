import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { liveCounters } from "./counters";
import { memoryStore, type LastGoodEntry } from "./last-good";
import { EMPTY_DEMO_SLUG } from "./mocks/fixtures";
import { nearbyEvents } from "./nearby";
import { placeEvents } from "./places";
import { regionExamples } from "./region";

/**
 * Integration level: the interface modules with a **failing upstream**, so
 * the three-tier chain of TS-WEB-0009 D4 is exercised end to end rather than only
 * in `resilient()`'s own unit test.
 *
 * The failure is a real one: a real backend pointed at an unroutable host.
 * Nothing is stubbed inside the chain, so what these assert is the behaviour
 * a genuine outage produces.
 */

const outage = () => {
  vi.stubEnv("LIVE_DATA", "real");
  vi.stubEnv("EVENTSAPI_HOST", "http://127.0.0.1:1");
  vi.stubEnv("GEOAPI_HOST", "http://127.0.0.1:1");
  // The public village-calendar site is a real source too since 2026-09-18,
  // so an "everything is down" fixture has to take it down as well — and a
  // test must never reach the network to find that out.
  vi.stubEnv("COMMUNITYSITE_HOST", "http://127.0.0.1:1");
  vi.stubEnv("LIVE_HTML_TIMEOUT_MS", "200");
  vi.stubEnv("GEOAPI_READ_TOKEN", "not-a-real-token");
  vi.stubEnv("EVENTSAPI_READ_TOKEN", "not-a-real-token");
  vi.stubEnv("LIVE_TIMEOUT_MS", "200");
};

const silent = { now: () => new Date("2026-09-11T12:00:00.000Z") };

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("TS-WEB-0008-A5 / TS-WEB-0009-A6: upstream down, cache warm — tier 2 with a freshness label", () => {
  it("serves the last good dates and says how old they are", async () => {
    const store = memoryStore(
      new Map<string, LastGoodEntry<unknown>>([
        [
          "dates:geoname.2838887:upcoming",
          {
            data: {
              place: { communityId: "geoname.2838887", name: "Schlatkow", slug: "schlatkow", lat: 53.92153, lng: 13.58116 },
              events: [{ id: "cached-1", title: "Zwischengespeicherter Termin (Beispiel)", startsAt: "2026-09-12T16:00:00.000Z" }],
              publishInvitation: false,
            },
            fetchedAt: "2026-09-11T09:00:00.000Z",
          },
        ],
      ]),
    );
    outage();

    const envelope = await placeEvents({ slug: "schlatkow", store, ...silent });

    expect(envelope?.tier).toBe("stale");
    expect(envelope?.stale).toBe(true);
    expect(envelope?.fetchedAt).toBe("2026-09-11T09:00:00.000Z");
    expect(envelope?.data.events).toHaveLength(1);
  });
});

describe("TS-WEB-0008-A5 / TS-WEB-0009-A7: upstream down, cache cold — the tier-3 snapshot, labelled", () => {
  it("serves the committed snapshot for the place module", async () => {
    outage();
    const envelope = await placeEvents({ slug: "schlatkow", store: memoryStore(), ...silent });

    expect(envelope?.tier).toBe("snapshot");
    expect(envelope?.stale).toBe(true);
    expect(envelope?.data.events.length).toBeGreaterThan(0);
    // Tier 3 has no segment: the snapshot is re-anchored on the place asked for.
    expect(envelope?.data.place.slug).toBe("schlatkow");
  });

  it("serves the committed snapshot for the nearby module", async () => {
    outage();
    const nearby = await nearbyEvents({ lat: 54, lng: 13.4, store: memoryStore(), ...silent });

    expect(nearby.tier).toBe("snapshot");
    expect(nearby.data.events.length).toBeGreaterThan(0);
  });

  it("serves the committed snapshot for the region module", async () => {
    // The county activity ranking still has no upstream operation (Q-0015
    // residue), but the ranking is now derived from a real, tokenless source,
    // so this module *can* lose an upstream and degrades like the others.
    outage();
    const region = await regionExamples({ county: "geoname.8648415", store: memoryStore(), ...silent });

    expect(region.tier).toBe("snapshot");
    expect(region.data.examples.length).toBeGreaterThan(0);
  });

  it("keeps a fully mocked module at tier 1 through an outage — it has no upstream to lose", async () => {
    // With every backend forced to the mock there is nothing to lose, so the
    // module stays tier 1 and is labelled `demo` rather than stale.
    outage();
    vi.stubEnv("LIVE_DATA", "mock");
    const region = await regionExamples({ county: "geoname.8648415", store: memoryStore(), ...silent });

    expect(region.tier).toBe("live");
    expect(region.demo).toBe(true);
    expect(region.data.examples.length).toBeGreaterThan(0);
  });

  it("removes the counter band instead of snapshotting it", async () => {
    outage();
    await expect(liveCounters({ store: memoryStore(), ...silent })).resolves.toBeUndefined();
  });
});

describe("TS-WEB-0009-A11: a failing module degrades one module, not the page", () => {
  it("lets a tier-3 module, a tier-2 module and a tier-1 module stand side by side", async () => {
    const store = memoryStore(
      new Map<string, LastGoodEntry<unknown>>([
        [
          "dates:geoname.2838887:upcoming",
          {
            data: {
              place: { communityId: "geoname.2838887", name: "Schlatkow", slug: "schlatkow", lat: 53.92153, lng: 13.58116 },
              events: [{ id: "cached-1", title: "Zwischengespeicherter Termin (Beispiel)", startsAt: "2026-09-12T16:00:00.000Z" }],
              publishInvitation: false,
            },
            fetchedAt: "2026-09-11T11:59:00.000Z",
          },
        ],
      ]),
    );
    outage();

    const dates = await placeEvents({ slug: "schlatkow", store, ...silent });
    const nearby = await nearbyEvents({ lat: 54, lng: 13.4, store, ...silent });

    expect(dates?.tier).toBe("stale");
    expect(nearby.tier).toBe("snapshot");
  });

  it("never throws into the caller for a module that has a fallback", async () => {
    outage();
    await expect(nearbyEvents({ lat: 54, lng: 13.4, store: memoryStore(), ...silent })).resolves.toBeDefined();
  });
});

describe("TS-WEB-0008-A4 / FUN-WEB-0045: an empty answer is tier 1, not a degradation", () => {
  it("keeps the covered place with no dates at tier 1 and sets the publish invitation", async () => {
    vi.stubEnv("LIVE_DATA", "mock");
    const envelope = await placeEvents({ slug: EMPTY_DEMO_SLUG, store: memoryStore(), ...silent });

    expect(envelope?.tier).toBe("live");
    expect(envelope?.stale).toBe(false);
    expect(envelope?.data.publishInvitation).toBe(true);
  });
});
