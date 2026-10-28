import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GEO_POINT_TIMEOUT_MS } from "./config";
import { cachedCommunityBySlug, communitiesNearPoint, pointSegment, quantisePoint } from "./geo-lookup";
import { memoryStore } from "./last-good";
import { UPSTREAM_TIMEOUT_MS } from "./resilient";

/**
 * DEC-0181: geo-api's point search is cached apart from the dates, on the
 * quantised point, and the one ask that fills the cache runs on its own 3 s
 * budget. Since DEC-0185 position 2 no longer asks it (the events-api's own
 * scope does the radius), so these tests drive the lookup directly; the
 * module's own timeouts are `nearby-selection.integration.test.ts`.
 *
 * The upstreams are stubbed at `fetch`, with real delays that honour the
 * abort signal, so the budgets under test are the real `AbortSignal.timeout`s
 * of `callUpstream`, not a simulation of them.
 */

const GEO_HOST = "https://geo.test";
const EVENTS_HOST = "https://events.test";

const community = (geonameId: number, name: string, lat: number, lng: number) => ({
  geonameId,
  name,
  slug: name.toLowerCase(),
  type: "community",
  geo: { point: { lat, lng } },
});

const AROUND_SCHLATKOW = {
  status: 200,
  data: [community(2838887, "Schlatkow", 53.92153, 13.58116), community(2900001, "Nachbardorf", 53.95, 13.62)],
};

const NO_EVENTS = { status: 200, results: 0, data: [] };

interface Upstream {
  readonly delayMs: number;
  readonly status?: number;
  readonly body: unknown;
}

interface Calls {
  geo: URL[];
  events: number;
}

/** A fetch whose answer arrives after `delayMs` — or is aborted by the caller's own timeout signal. */
function stubUpstreams(answer: { geo: () => Upstream; events: () => Upstream }): Calls {
  const calls: Calls = { geo: [], events: 0 };
  vi.stubGlobal(
    "fetch",
    vi.fn((input: string | URL, init?: RequestInit) => {
      const url = new URL(String(input));
      const upstream = url.origin === GEO_HOST ? answer.geo() : answer.events();
      if (url.origin === GEO_HOST) calls.geo.push(url);
      else calls.events += 1;

      return new Promise<Response>((resolve, reject) => {
        const timer = setTimeout(
          () =>
            resolve(
              new Response(JSON.stringify(upstream.body), {
                status: upstream.status ?? 200,
                headers: { "content-type": "application/json" },
              }),
            ),
          upstream.delayMs,
        );
        init?.signal?.addEventListener("abort", () => {
          clearTimeout(timer);
          reject(init.signal?.reason);
        });
      });
    }),
  );
  return calls;
}

async function timed<T>(run: () => Promise<T>): Promise<{ value: T; ms: number }> {
  const started = performance.now();
  const value = await run();
  return { value, ms: performance.now() - started };
}

let warn: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.stubEnv("LIVE_DATA", "real");
  vi.stubEnv("GEOAPI_HOST", GEO_HOST);
  vi.stubEnv("EVENTSAPI_HOST", EVENTS_HOST);
  vi.stubEnv("GEOAPI_READ_TOKEN", "test-token");
  vi.stubEnv("EVENTSAPI_READ_TOKEN", "test-token");
  vi.stubEnv("LIVE_TIMEOUT_MS", "");
  warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const ANCHOR = { lat: 53.92153, lng: 13.58116 };

describe("DEC-0181: the budgets — 3 s for the geo point search, 800 ms for everything else", () => {
  it("names the two numbers the decision records", () => {
    expect(GEO_POINT_TIMEOUT_MS).toBe(3000);
    expect(UPSTREAM_TIMEOUT_MS).toBe(800);
  });

  it("a 1.5 s geo answer arrives inside the point search's own budget", async () => {
    const calls = stubUpstreams({ geo: () => ({ delayMs: 1500, body: AROUND_SCHLATKOW }), events: () => ({ delayMs: 0, body: NO_EVENTS }) });

    const { value: found, ms } = await timed(() => communitiesNearPoint(ANCHOR, 10, { store: memoryStore() }));

    expect(found.map((place) => place.name)).toEqual(["Schlatkow", "Nachbardorf"]);
    expect(ms).toBeGreaterThanOrEqual(1400);
    expect(ms).toBeLessThan(GEO_POINT_TIMEOUT_MS);
    expect(calls.geo).toHaveLength(1);
    expect(warn).not.toHaveBeenCalled();
  });

  it("the second request is a cache hit: no geo call, and well inside 800 ms", async () => {
    const calls = stubUpstreams({ geo: () => ({ delayMs: 1500, body: AROUND_SCHLATKOW }), events: () => ({ delayMs: 0, body: NO_EVENTS }) });
    const store = memoryStore();

    await communitiesNearPoint(ANCHOR, 10, { store });
    // A different exact coordinate inside the same two-decimal cell.
    const { value: second, ms } = await timed(() => communitiesNearPoint({ lat: 53.9187, lng: 13.5791 }, 10, { store }));

    expect(second).toHaveLength(2);
    expect(calls.geo).toHaveLength(1);
    expect(ms).toBeLessThan(UPSTREAM_TIMEOUT_MS);
  });

  it("a geo answer slower than 3 s still fails — the budget is longer, not gone", async () => {
    const store = memoryStore();
    stubUpstreams({ geo: () => ({ delayMs: 3600, body: AROUND_SCHLATKOW }), events: () => ({ delayMs: 0, body: NO_EVENTS }) });

    await expect(communitiesNearPoint(ANCHOR, 10, { store })).rejects.toThrow(/geo-api: timeout after 3000 ms/);
    expect(store.entries.size).toBe(0);
  }, 10_000);
});

describe("DEC-0181: what is cached, and under which key", () => {
  it("asks geo-api for the quantised point and keys the entry on it", async () => {
    const calls = stubUpstreams({ geo: () => ({ delayMs: 0, body: AROUND_SCHLATKOW }), events: () => ({ delayMs: 0, body: NO_EVENTS }) });
    const store = memoryStore();

    await communitiesNearPoint(ANCHOR, 10, { store });

    expect(calls.geo[0]?.searchParams.get("lat")).toBe("53.92");
    expect(calls.geo[0]?.searchParams.get("lng")).toBe("13.58");
    expect([...store.entries.keys()]).toEqual(["point:53.92:13.58:10"]);
    expect(pointSegment(quantisePoint({ lat: 53.9187, lng: 13.5791 }))).toBe("53.92:13.58");
  });

  it("never caches a failure — the next request asks again", async () => {
    let first = true;
    const calls = stubUpstreams({
      geo: () => {
        const failing = first;
        first = false;
        return failing ? { delayMs: 0, status: 503, body: {} } : { delayMs: 0, body: AROUND_SCHLATKOW };
      },
      events: () => ({ delayMs: 0, body: NO_EVENTS }),
    });
    const store = memoryStore();

    await expect(communitiesNearPoint(ANCHOR, 10, { store })).rejects.toThrow();
    expect(await communitiesNearPoint(ANCHOR, 10, { store })).toHaveLength(2);
    expect(calls.geo).toHaveLength(2);
  });

  it("caches a slug geo-api knows, and not one it does not", async () => {
    let known = true;
    const calls = stubUpstreams({
      geo: () => ({ delayMs: 0, body: known ? { status: 200, data: AROUND_SCHLATKOW.data[0] } : { status: 200, data: [] } }),
      events: () => ({ delayMs: 0, body: NO_EVENTS }),
    });
    const store = memoryStore();

    expect((await cachedCommunityBySlug("schlatkow", { store }))?.geonameId).toBe(2838887);
    expect((await cachedCommunityBySlug("schlatkow", { store }))?.geonameId).toBe(2838887);
    known = false;
    expect(await cachedCommunityBySlug("kein-ort", { store })).toBeUndefined();
    expect(await cachedCommunityBySlug("kein-ort", { store })).toBeUndefined();

    expect(calls.geo).toHaveLength(3);
    expect([...store.entries.keys()]).toEqual(["slug:schlatkow"]);
  });
});
