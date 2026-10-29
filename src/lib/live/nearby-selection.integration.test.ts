import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { memoryStore } from "./last-good";
import { nearbyEvents } from "./nearby";
import { nearestPlace } from "./place-index";

/**
 * DEC-0185: position 2 on the token path asks the events-api for its own
 * `region` scope around the anchor's community — one call, the fortnight —
 * and picks a varied week out of the answer. geo-api is not asked.
 *
 * The upstream is stubbed at `fetch`; the answer is shaped by the
 * measurement of 2026-10-28 for Anklam (23 dates, five organisers, two
 * categories, the vhs courses all on one evening).
 */

const EVENTS_HOST = "https://events.test";
const GEO_HOST = "https://geo.test";
const ANCHOR = { lat: 53.92153, lng: 13.58116 };
const NOW = new Date("2026-10-28T12:00:00Z");
const DAY = 24 * 60 * 60 * 1000;

const seed = nearestPlace(ANCHOR)!;

interface Row {
  readonly id: string;
  readonly days: number;
  readonly organizer: string;
  readonly category: string;
  readonly occurrence?: string;
  readonly community?: string;
}

const upstreamEvent = ({ id, days, organizer, category, occurrence = "once", community = "geoname.2900001" }: Row) => ({
  id,
  summary: `Termin ${id}`,
  start: NOW.getTime() + days * DAY,
  end: NOW.getTime() + days * DAY + 3_600_000,
  categories: [category],
  tags: [],
  "community.id": community,
  "community.name": "Nachbardorf",
  "organizer.id": organizer,
  occurrence,
});

function stubEvents(rows: readonly Row[], delayMs = 0) {
  const urls: URL[] = [];
  const geo: URL[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn((input: string | URL, init?: RequestInit) => {
      const url = new URL(String(input));
      if (url.origin === GEO_HOST) geo.push(url);
      else urls.push(url);
      return new Promise<Response>((resolve, reject) => {
        const timer = setTimeout(
          () =>
            resolve(
              new Response(JSON.stringify({ status: 200, results: rows.length, data: rows.map(upstreamEvent) }), {
                status: 200,
                headers: { "content-type": "application/json" },
              }),
            ),
          delayMs,
        );
        init?.signal?.addEventListener("abort", () => {
          clearTimeout(timer);
          reject(init.signal?.reason);
        });
      });
    }),
  );
  return { urls, geo };
}

const run = () => nearbyEvents({ ...ANCHOR, store: memoryStore(), now: () => NOW });

beforeEach(() => {
  vi.stubEnv("LIVE_DATA", "real");
  vi.stubEnv("GEOAPI_HOST", GEO_HOST);
  vi.stubEnv("EVENTSAPI_HOST", EVENTS_HOST);
  vi.stubEnv("GEOAPI_READ_TOKEN", "test-token");
  vi.stubEnv("EVENTSAPI_READ_TOKEN", "test-token");
  vi.stubEnv("LIVE_TIMEOUT_MS", "");
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("DEC-0185: the request", () => {
  it("asks the events-api's region scope around the anchor's community, for the fortnight, and never geo-api", async () => {
    const { urls, geo } = stubEvents([]);
    await run();

    expect(geo).toHaveLength(0);
    expect(urls).toHaveLength(1);
    expect(urls[0]?.pathname).toBe(`/api/test-token/events/search/${seed.communityId}/region`);
    expect(urls[0]?.searchParams.get("after")).toBe(NOW.toISOString());
    expect(urls[0]?.searchParams.get("before")).toBe(new Date(NOW.getTime() + 14 * DAY).toISOString());
  });

  it("answers the service's own radius, 20 km", async () => {
    stubEvents([]);
    expect((await run()).data.radiusKm).toBe(20);
  });
});

describe("DEC-0185: the selection on the token path", () => {
  const vhs = (days: number, n: number): Row => ({
    id: `vhs${n}`,
    days,
    organizer: "vhs",
    category: "education-health",
  });

  it("shows the week's five from different organisers and categories, not the first five by start", async () => {
    stubEvents([
      vhs(5, 1),
      vhs(5, 2),
      vhs(5, 3),
      vhs(5, 4),
      { id: "hw", days: 3, organizer: "budden", category: "culture-tourism" },
      { id: "sp", days: 4, organizer: "sv", category: "sports" },
      { id: "fw", days: 6, organizer: "feuerwehr", category: "community" },
      { id: "ma", days: 2, organizer: "markt", category: "culture-tourism", occurrence: "recurring" },
    ]);
    const { data } = await run();

    expect(data.events.map((event) => event.id)).toEqual(["ma", "hw", "sp", "vhs1", "fw"]);
    expect(data.events.filter((event) => event.id.startsWith("vhs"))).toHaveLength(1);
    expect(data.window).toBe("week");
  });

  it("keeps at most two recurring dates", async () => {
    stubEvents(
      ["a", "b", "c", "d"].map((id, n) => ({
        id,
        days: 1 + n,
        organizer: id,
        category: id,
        occurrence: "recurring",
      })),
    );
    const { data } = await run();
    expect(data.events).toHaveLength(2);
  });

  it("widens to the fortnight, and the heading follows, where the week is thin", async () => {
    stubEvents([
      { id: "w1", days: 1, organizer: "o1", category: "c1" },
      { id: "w2", days: 2, organizer: "o2", category: "c2" },
      { id: "f1", days: 9, organizer: "o3", category: "c3" },
      { id: "f2", days: 11, organizer: "o4", category: "c4" },
      { id: "f3", days: 13, organizer: "o5", category: "c5" },
    ]);
    const { data } = await run();
    expect(data.events.map((event) => event.id)).toEqual(["w1", "w2", "f1", "f2", "f3"]);
    expect(data.window).toBe("upcoming");
  });

  it("leaves out the anchor's own community — position 1 shows those", async () => {
    stubEvents([
      { id: "own", days: 1, organizer: "o1", category: "c1", community: seed.communityId },
      { id: "other", days: 2, organizer: "o2", category: "c2" },
    ]);
    expect((await run()).data.events.map((event) => event.id)).toEqual(["other"]);
  });

  it("is an empty week, not an error, when nothing is on", async () => {
    stubEvents([]);
    const envelope = await run();
    expect(envelope.tier).toBe("live");
    expect(envelope.data.events).toEqual([]);
  });
});

describe("DEC-0185: resilience", () => {
  it("degrades at the events-api's 800 ms", async () => {
    stubEvents([], 1500);
    const envelope = await run();
    expect(envelope.tier).toBe("snapshot");
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("events-api: timeout after 800 ms"));
  });
});
