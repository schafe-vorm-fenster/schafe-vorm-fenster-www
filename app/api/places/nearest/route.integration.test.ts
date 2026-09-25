import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

import { resetRateLimits } from "@/src/lib/live/bff";
import { NEAREST_PLACE_RADIUS_KM } from "@/src/lib/live/places";
import { SHOWCASE_COMMUNITY } from "@/src/lib/live/showcase";

/**
 * Integration level: `GET /api/places/nearest?lat=&lng=` in-process — the
 * geolocation control's one upstream (DEC-0119, TS-WEB-0010 D5, TS-WEB-0008
 * D7's coordinates row, D10).
 */

const call = (url: string, headers?: Record<string, string>) =>
  GET(new Request(url, { headers }));

const nearest = (lat: string, lng: string) =>
  call(`http://localhost:3100/api/places/nearest?lat=${lat}&lng=${lng}`);

beforeEach(() => {
  resetRateLimits();
  vi.stubEnv("LIVE_DATA", "mock");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("DEC-0119: a point answers the covered community it sits in or next to", () => {
  it("resolves the nearest demo place under the mock backend, flagged demo", async () => {
    const response = await nearest("54.001", "13.401");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.place.slug).toBe("schlatkow");
    expect(body.data.place.name).toBe("Schlatkow");
    expect(body.demo).toBe(true);
    expect(body).toHaveProperty("tier");
    expect(body).toHaveProperty("fetchedAt");
  });

  it("answers the place only — the visitor's coordinates do not come back", async () => {
    const text = await (await nearest("54.0123", "13.4567")).text();
    expect(text).not.toContain("54.0123");
    expect(text).not.toContain("13.4567");
  });

  it("answers 404 for a point with no covered community within the radius (DEC-0119 §7)", async () => {
    // Tokyo: the mock's demo places are all in one county, none within 15 km.
    const response = await nearest("35.6", "139.7");
    expect(response.status).toBe(404);
    expect(NEAREST_PLACE_RADIUS_KM).toBe(15);
  });

  it("is never cacheable: the URL carries a visitor's coordinates (TS-WEB-0010 D5)", async () => {
    const response = await nearest("54.001", "13.401");
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("refuses a missing or malformed point with 400, before any backend is asked", async () => {
    expect((await call("http://localhost:3100/api/places/nearest")).status).toBe(400);
    expect((await call("http://localhost:3100/api/places/nearest?lat=54.0")).status).toBe(400);
    expect((await nearest("north", "13.4")).status).toBe(400);
    expect((await nearest("91", "13.4")).status).toBe(400);
  });
});

describe("TS-WEB-0008-A1 / TS-WEB-0013-A5: the route is the browser's only reachable surface", () => {
  it("names no upstream host or token in the response body", async () => {
    const text = await (await nearest("54.001", "13.401")).text();
    expect(text).not.toMatch(/geo\.api|events\.api|READ_TOKEN|token/u);
  });

  it("refuses a cross-origin request (CON-WEB-0044 · CON-WEB-0045)", async () => {
    const response = await call("http://localhost:3100/api/places/nearest?lat=54.001&lng=13.401", {
      origin: "https://not-our-site.example",
    });
    expect(response.status).toBe(403);
  });

  it("rate-limits a caller that hammers the route", async () => {
    let last = 200;
    for (let attempt = 0; attempt < 70; attempt += 1) {
      last = (await nearest("54.001", "13.401")).status;
    }
    expect(last).toBe(429);
  });
});

/**
 * `auto` without a credential — the mode a real deployment runs in. geo-api's
 * proximity search is token-scoped, so the committed index answers, with
 * every community's own coordinate and no demo flag.
 */
describe("auto mode: the committed index answers, without a credential", () => {
  beforeEach(() => {
    vi.stubEnv("LIVE_DATA", "auto");
    vi.stubEnv("GEOAPI_READ_TOKEN", "");
    vi.stubEnv("EVENTSAPI_READ_TOKEN", "");
  });

  it("answers the showcase community for its own coordinate, as real data", async () => {
    const response = await nearest(String(SHOWCASE_COMMUNITY.lat), String(SHOWCASE_COMMUNITY.lng));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.demo, "a committed index of real places is not demo data").toBe(false);
    expect(body.data.place.slug).toBe(SHOWCASE_COMMUNITY.slug);
    expect(body.data.place.municipality).toBe("Schmatzin");
  });

  it("answers a place for a point a few kilometres from a covered community", async () => {
    // ~5 km north of the showcase community: whichever community is nearest,
    // it is within the radius, and the answer is a place.
    const response = await nearest(String(SHOWCASE_COMMUNITY.lat + 0.045), String(SHOWCASE_COMMUNITY.lng));
    expect(response.status).toBe(200);
    expect((await response.json()).data.place.slug).toMatch(/^[a-z0-9-]+$/u);
  });

  it("answers 404 far outside the region rather than the region's edge (DEC-0119 §7)", async () => {
    // Somewhere in the Alps, and Tokyo: the index holds ~1,760 communities of
    // one region; the globally nearest of them is not "nearby".
    expect((await nearest("47.5", "11.0")).status).toBe(404);
    expect((await nearest("35.6", "139.7")).status).toBe(404);
  });

  it("stays uncacheable in auto mode too", async () => {
    const response = await nearest(String(SHOWCASE_COMMUNITY.lat), String(SHOWCASE_COMMUNITY.lng));
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
});
