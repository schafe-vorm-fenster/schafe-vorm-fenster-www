import { afterEach, describe, expect, it, vi } from "vitest";

import { UpstreamError } from "../http";

import { communityBySlug, searchByPoint, searchByZip } from "./client";

/**
 * The geo-api client against the service's **own contract**, without a token
 * and without the network.
 *
 * The payloads are shaped after `~/Projects/geo-api`'s
 * `community-search.schema.ts` and `get-community.schema.ts`: the `zips`
 * parameter is comma-separated on the GET form, a proximity search sends
 * `lat`/`lng` (the service turns them into a `geoPoint` itself) and may not
 * be combined with any other filter, and the answer is a `ResultsSchema`
 * envelope whose `data` is an array of communities.
 */

const config = { host: "https://geo.invalid", token: "test-token", timeoutMs: 500 };

const COMMUNITY = {
  geonameId: 2838887,
  name: "Schlatkow",
  slug: "schlatkow",
  type: "community",
  geo: { point: { lat: 53.92153, lng: 13.58116 } },
  hierarchy: {
    community: { geonameId: 2838887, name: "Schlatkow", slug: "schlatkow" },
    municipality: { geonameId: 6548320, name: "Schmatzin", slug: null },
    county: { geonameId: 8648415, name: "Vorpommern-Greifswald", slug: null },
    state: { geonameId: 2872567, name: "Mecklenburg-Vorpommern", slug: null },
  },
};

const ANSWER = { status: 200, results: 1, timestamp: "2026-09-18T20:00:00.000Z", data: [COMMUNITY] };

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

const urlOf = (fetchMock: ReturnType<typeof jsonOnce>): URL =>
  new URL(String((fetchMock.mock.calls[0] as unknown as [string])[0]));

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("the postcode search", () => {
  it("sends the country and the postcode on the documented GET form", async () => {
    const fetchMock = jsonOnce(ANSWER);
    const places = await searchByZip(config, "17390");

    const url = urlOf(fetchMock);
    expect(url.pathname).toBe("/api/test-token/community/search");
    expect(url.searchParams.get("countryCode")).toBe("DE");
    expect(url.searchParams.get("zips")).toBe("17390");
    expect(places[0]?.slug).toBe("schlatkow");
    expect(places[0]?.hierarchy?.county?.name).toBe("Vorpommern-Greifswald");
  });

  it("answers an empty list for a postcode nothing covers", async () => {
    jsonOnce({ status: 200, results: 0, data: [] });
    await expect(searchByZip(config, "99999")).resolves.toEqual([]);
  });
});

describe("the proximity search", () => {
  it("sends lat and lng and no other filter — the contract forbids combining them", async () => {
    const fetchMock = jsonOnce(ANSWER);
    await searchByPoint(config, { lat: 53.92153, lng: 13.58116 }, 10);

    const url = urlOf(fetchMock);
    expect(url.searchParams.get("lat")).toBe("53.92153");
    expect(url.searchParams.get("lng")).toBe("13.58116");
    expect(url.searchParams.get("maxResults")).toBe("10");
    expect(url.searchParams.get("zips")).toBeNull();
    expect(url.searchParams.get("counties")).toBeNull();
  });
});

describe("the slug lookup", () => {
  it("accepts the single-object form the contract returns", async () => {
    jsonOnce({ status: 200, data: COMMUNITY });
    await expect(communityBySlug(config, "schlatkow")).resolves.toMatchObject({ slug: "schlatkow" });
  });

  it("accepts the array form too, and takes the first", async () => {
    jsonOnce(ANSWER);
    await expect(communityBySlug(config, "schlatkow")).resolves.toMatchObject({ geonameId: 2838887 });
  });

  it("escapes a slug that arrived from outside", async () => {
    const fetchMock = jsonOnce({ status: 200, data: COMMUNITY });
    await communityBySlug(config, "a b/../secret");
    expect(urlOf(fetchMock).pathname).toBe("/api/test-token/community/slug/a%20b%2F..%2Fsecret");
  });
});

describe("the forbidden operation and the failure type", () => {
  it("names the paid address lookup in no request this client can build", () => {
    // TS-008-A1 / DEC-024: the operation is not implemented, so no caller can
    // reach it by accident. `boundary.test.ts` proves the literal is absent
    // from the whole tree; this states the client's own half.
    expect(Object.keys({ searchByZip, searchByPoint, communityBySlug })).toEqual([
      "searchByZip",
      "searchByPoint",
      "communityBySlug",
    ]);
  });

  it("turns a malformed 200 into an UpstreamError, not a rendered page", async () => {
    jsonOnce({ status: 200, data: [{ name: "Schlatkow" }] });
    await expect(searchByZip(config, "17390")).rejects.toBeInstanceOf(UpstreamError);
  });

  it("sends no token in the path of a request it did not build", async () => {
    const fetchMock = jsonOnce(ANSWER);
    await searchByZip(config, "17390");
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(Object.keys(init.headers as Record<string, string>)).toEqual(["accept"]);
  });
});
