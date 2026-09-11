import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resetRateLimits } from "./bff";

import { GET } from "@/app/api/places/search/route";

/**
 * Integration level: the actual route handler, in-process, against the mock
 * backend (`LIVE_DATA=mock`) — TS-008 D7/D10, TS-013 D2.
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

describe("TS-008-A14: place search classifies, and never answers a bare nothing", () => {
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

  it("answers a typed name from the mocked name search while Q-025 is open", async () => {
    const response = await call("http://localhost:3100/api/places/search?q=Muster");
    const body = await response.json();

    expect(body.data.outcome.kind).toBe("covered");
    expect(body.demo).toBe(true);
  });

  it("accepts `zip` as well as `q` — both parameters TS-004 D5 names", async () => {
    const response = await call("http://localhost:3100/api/places/search?zip=17509");
    expect(response.status).toBe(200);
  });

  it("rejects an empty query with 400 rather than searching for nothing", async () => {
    expect((await call("http://localhost:3100/api/places/search?q=")).status).toBe(400);
  });
});

describe("TS-008-A1 / TS-013-A5: the route is the browser's only reachable surface", () => {
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

  it("refuses a cross-origin request (WEB-Q-038)", async () => {
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

describe("TS-003 D5 / TS-009-A5: the route carries its data kind's cache lifetime", () => {
  it("sends the active-places TTL and serve-stale window as Cache-Control", async () => {
    const response = await call("http://localhost:3100/api/places/search?q=17509");
    expect(response.headers.get("cache-control")).toBe(
      "public, s-maxage=3600, stale-while-revalidate=604800",
    );
  });
});
