import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resetRateLimits } from "./bff";

import { GET } from "@/app/api/places/search/route";

/**
 * Integration level: the actual route handler, in-process, against the mock
 * backend (`LIVE_DATA=mock`) — TS-WEB-0008 D7/D10, TS-WEB-0013 D2.
 */

const call = (url: string, headers?: Record<string, string>) =>
  GET(new Request(url, { headers }));

beforeEach(() => {
  resetRateLimits();
  vi.stubEnv("LIVE_DATA", "mock");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("TS-WEB-0008-A14: place search classifies, and never answers a bare nothing", () => {
  it("classifies a covered ZIP and returns the resolved place with its slug", async () => {
    const response = await call("http://localhost:3100/api/places/search?q=17509");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.outcome.kind).toBe("covered");
    expect(body.data.outcome.place.slug).toMatch(/^[a-z0-9-]+$/);
  });

  it("classifies a ZIP from an uncovered region as 'uncovered', not as an empty answer", async () => {
    const response = await call("http://localhost:3100/api/places/search?q=99999");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.outcome).toEqual({ kind: "uncovered", query: "99999" });
    expect(body.data.suggestions).toEqual([]);
  });

  it("answers a typed name from the mocked name search while Q-0025 is open", async () => {
    const response = await call("http://localhost:3100/api/places/search?q=Schlat");
    const body = await response.json();

    expect(body.data.outcome.kind).toBe("covered");
    expect(body.demo).toBe(true);
  });

  it("accepts `zip` as well as `q` — both parameters TS-WEB-0004 D5 names", async () => {
    const response = await call("http://localhost:3100/api/places/search?zip=17509");
    expect(response.status).toBe(200);
  });

  it("rejects an empty query with 400 rather than searching for nothing", async () => {
    expect((await call("http://localhost:3100/api/places/search?q=")).status).toBe(400);
  });
});

describe("TS-WEB-0008-A1 / TS-WEB-0013-A5: the route is the browser's only reachable surface", () => {
  it("marks every mocked payload demo:true so the Demo-Daten badge renders", async () => {
    const body = await (await call("http://localhost:3100/api/places/search?q=17509")).json();
    expect(body.demo).toBe(true);
    expect(body).toHaveProperty("tier");
    expect(body).toHaveProperty("fetchedAt");
    expect(body).toHaveProperty("stale");
  });

  it("names no upstream host, token or upstream error in the response body", async () => {
    const text = await (await call("http://localhost:3100/api/places/search?q=17509")).text();
    expect(text).not.toContain("geo.api-v2");
    expect(text).not.toContain("token");
  });

  it("refuses a cross-origin request (NFR-WEB-0038)", async () => {
    const response = await call("http://localhost:3100/api/places/search?q=17509", {
      origin: "https://not-our-site.example",
    });
    expect(response.status).toBe(403);
  });

  it("admits a request from the site's own origin", async () => {
    const response = await call("http://localhost:3100/api/places/search?q=17509", {
      origin: "https://www.schafe-vorm-fenster.de",
    });
    expect(response.status).toBe(200);
  });

  it("rate-limits a caller that hammers the route", async () => {
    let last = 200;
    for (let attempt = 0; attempt < 70; attempt += 1) {
      last = (await call("http://localhost:3100/api/places/search?q=17509")).status;
    }
    expect(last).toBe(429);
  });
});

describe("TS-WEB-0003 D5 / TS-WEB-0009-A5: the route carries its data kind's cache lifetime", () => {
  it("sends the active-places TTL and serve-stale window as Cache-Control", async () => {
    const response = await call("http://localhost:3100/api/places/search?q=17509");
    expect(response.headers.get("cache-control")).toBe(
      "public, s-maxage=3600, stale-while-revalidate=604800",
    );
  });
});

/**
 * The same route in `auto` — the mode a real deployment runs in. Since
 * 2026-09-18 the name half of it answers from the committed community index,
 * so a typed name is a **real** answer even with no read token anywhere, and
 * that is what the typeahead fetches.
 */
describe("auto mode: the typeahead's upstream, without a credential", () => {
  beforeEach(() => {
    vi.stubEnv("LIVE_DATA", "auto");
    vi.stubEnv("GEOAPI_READ_TOKEN", "");
    vi.stubEnv("EVENTSAPI_READ_TOKEN", "");
  });

  it("answers a typed name with real, covered communities and no demo flag", async () => {
    const response = await call("http://localhost:3100/api/places/search?q=Schlat");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.demo, "a committed index of real places is not demo data").toBe(false);
    expect(body.data.outcome.kind).toBe("covered");
    expect(body.data.outcome.place.name).toBe("Schlatkow");
    expect(body.data.suggestions.map((place: { name: string }) => place.name)).toContain("Schlatkow");
  });

  it("caps the suggestion list at what a chip row can carry", async () => {
    const body = await (await call("http://localhost:3100/api/places/search?q=er")).json();
    expect(body.data.suggestions.length).toBeLessThanOrEqual(6);
  });

  it("classifies a name nothing covers as uncovered, not as an error", async () => {
    const body = await (await call("http://localhost:3100/api/places/search?q=Oberammergau")).json();
    expect(body.data.outcome).toMatchObject({ kind: "uncovered" });
    expect(body.data.suggestions).toEqual([]);
  });

  it("still sends the cache lifetime of its data kind (TS-WEB-0003 D5)", async () => {
    const response = await call("http://localhost:3100/api/places/search?q=Schlat");
    expect(response.headers.get("cache-control")).toMatch(/s-maxage=3600/u);
  });

  it("carries no ecosystem host and no token in the answer", async () => {
    const text = await (await call("http://localhost:3100/api/places/search?q=Schlat")).text();
    expect(text).not.toMatch(/geo\.api|events\.api|READ_TOKEN/u);
  });
});
