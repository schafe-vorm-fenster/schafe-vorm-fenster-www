import { afterEach, describe, expect, it, vi } from "vitest";

import { UpstreamError } from "../http";

import { fetchStats, searchEvents, MAX_EVENTS_LIMIT } from "./client";

/**
 * The events-api client against the service's **own contract**, without a
 * token and without the network.
 *
 * The payloads below are shaped after
 * `~/Projects/events-api/src/events/types/localized-event.types.ts` and
 * `src/app/api/[token]/events/search/events-search.schema.ts` — the
 * `PaginatedResults` envelope, the dotted event keys, and the absence of
 * `community.slug`, which is the field this repository used to read and which
 * does not exist. The `/api/stats` fixture is the production answer of
 * 2026-09-18 (it is the one tokenless operation, so it could be recorded).
 */

const config = { host: "https://events.invalid", token: "test-token", timeoutMs: 500 };

const EVENT = {
  id: "b60c74ff-2e1e-54b7-860d-0599f8c41358",
  summary: "Volleyball",
  description: "",
  link: "",
  image: "",
  "image.exists": false,
  document: "",
  "document.exists": false,
  categories: ["community-life"],
  tags: [],
  start: 1_758_474_000,
  end: 1_758_481_200,
  allday: false,
  occurrence: "once",
  "series.id": "",
  "location.raw": "Sporthalle Schlatkow",
  "location.name": "Sporthalle",
  "location.localname": "Sporthalle Schlatkow",
  "location.address": "",
  scope: "community",
  "community.id": "geoname.2838887",
  "community.name": "Schlatkow",
  "municipality.id": "geoname.6548320",
  "municipality.name": "Schmatzin",
  "county.id": "geoname.8648415",
  "county.name": "Vorpommern-Greifswald",
  "organizer.id": "5f3745f3-845d-4bbc-84e3-4d9a00883bf8",
  "organizer.name": "Dorfgemeinschaft",
  created: 0,
  changed: 0,
  deleted: 0,
};

const SEARCH_ANSWER = {
  status: 200,
  timestamp: "2026-09-18T20:00:00.000Z",
  results: 87,
  pagination: { page: 1, limit: 3, totalPages: 29 },
  data: [EVENT],
};

/** Recorded from `GET https://events.api.schafe-vorm-fenster.de/api/stats`. */
const STATS_ANSWER = {
  status: 200,
  timestamp: "2026-09-18T20:50:41.020Z",
  data: {
    totalEvents: 8889,
    earliestEventDate: "+058221-02-05",
    latestEventDate: "+058929-10-05",
    eventsWithUnknownCategory: 39,
    eventsWithUnknownScope: 0,
    eventsWithImage: 394,
    eventsWithDocument: 14,
  },
};

function jsonOnce(body: unknown, init: ResponseInit = {}) {
  const fetchMock = vi.fn(
    async () =>
      new Response(JSON.stringify(body), {
        status: 200,
        headers: { "content-type": "application/json" },
        ...init,
      }),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("the search body is the contract's, not a guess", () => {
  it("sends the id list, the window, the row count and the sort", async () => {
    const fetchMock = jsonOnce(SEARCH_ANSWER);

    await searchEvents(config, {
      communities: ["geoname.2838887"],
      after: "now",
      before: "7d",
      limit: 3,
    });

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://events.invalid/api/test-token/events/search");
    expect(init.method).toBe("POST");

    const body = JSON.parse(String(init.body)) as Record<string, unknown>;
    expect(body).toMatchObject({
      communities: ["geoname.2838887"],
      after: "now",
      before: "7d",
      language: "de",
      country: "DE",
      sort: "start:asc",
      limit: 3,
      page: 1,
    });
    // A three-row module must not fetch a hundred rows and slice them.
    expect(body.limit).toBe(3);
  });

  it("clamps a row count past the upstream maximum instead of earning a 400", async () => {
    const fetchMock = jsonOnce(SEARCH_ANSWER);
    await searchEvents(config, { counties: ["geoname.8648415"], limit: 10_000 });
    const body = JSON.parse(String((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body));
    expect(body.limit).toBe(MAX_EVENTS_LIMIT);
  });

  it("omits an empty id list rather than sending one", async () => {
    const fetchMock = jsonOnce(SEARCH_ANSWER);
    await searchEvents(config, { communities: ["geoname.1"], counties: [] });
    const body = JSON.parse(String((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body));
    expect(body).not.toHaveProperty("counties");
  });

  it("refuses a query with no location filter — the contract would 400 it", async () => {
    const fetchMock = jsonOnce(SEARCH_ANSWER);
    await expect(searchEvents(config, { after: "now" })).rejects.toBeInstanceOf(UpstreamError);
    expect(fetchMock, "and spends no request on it").not.toHaveBeenCalled();
  });
});

describe("the answer is read as the paginated envelope it is", () => {
  it("returns the rows and how many there were in total", async () => {
    jsonOnce(SEARCH_ANSWER);
    const result = await searchEvents(config, { communities: ["geoname.2838887"] });

    expect(result.events).toHaveLength(1);
    expect(result.total).toBe(87);
    expect(result.totalPages).toBe(29);
    expect(result.events[0]?.["community.name"]).toBe("Schlatkow");
    // The field this repository used to rank by, and which does not exist.
    expect(result.events[0]).not.toHaveProperty("community.slug");
  });

  it("rejects a malformed 200 rather than letting it reach a page", async () => {
    jsonOnce({ status: 200, data: [{ summary: 5 }] });
    await expect(searchEvents(config, { communities: ["geoname.1"] })).rejects.toThrow(/schema/u);
  });

  it("turns a non-2xx into one error type", async () => {
    jsonOnce(SEARCH_ANSWER, { status: 401 });
    await expect(searchEvents(config, { communities: ["geoname.1"] })).rejects.toThrow(/HTTP 401/u);
  });
});

describe("/api/stats — the one operation that needs no token", () => {
  it("reads the counted figure and ignores the ones that are not fields", async () => {
    const fetchMock = jsonOnce(STATS_ANSWER);
    const stats = await fetchStats({ host: config.host, timeoutMs: 500 });

    const [url] = fetchMock.mock.calls[0] as unknown as [string];
    expect(url).toBe("https://events.invalid/api/stats");
    expect(url).not.toContain(config.token);
    expect(stats.totalEvents).toBe(8889);
    // Q-0037: no places count and no updates-today count exist upstream.
    expect(stats).not.toHaveProperty("places");
    expect(stats).not.toHaveProperty("updatesToday");
  });
});
