import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resetRateLimits } from "./bff";
import { DEMO_PLACES } from "./mocks/fixtures";
import { haversineKm } from "./widening";

import { GET } from "@/app/api/nearby/route";

const anchor = DEMO_PLACES[0]!;

const call = (query: string) => GET(new Request(`http://localhost:3100/api/nearby${query}`));

beforeEach(() => {
  resetRateLimits();
  vi.stubEnv("LIVE_DATA", "mock");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("TS-008-A3: the ~15 km cut happens in the BFF, on geo positions", () => {
  it("returns only dates from places inside the radius, and states the radius it used", async () => {
    const body = await (await call(`?lat=${anchor.lat}&lng=${anchor.lng}`)).json();

    expect(body.data.radiusKm).toBe(15);
    const admitted = DEMO_PLACES.filter((place) => haversineKm(anchor, place) <= 15).map((place) => place.name);
    for (const event of body.data.events) expect(admitted).toContain(event.placeName);
  });

  it("never claims completeness — the truncation flag travels with the payload", async () => {
    const body = await (await call(`?lat=${anchor.lat}&lng=${anchor.lng}`)).json();
    expect(body.data).toHaveProperty("truncated");
    expect(typeof body.data.truncated).toBe("boolean");
  });

  it("honours a caller radius the upstream has no parameter for", async () => {
    const narrow = await (await call(`?lat=${anchor.lat}&lng=${anchor.lng}&radius=5`)).json();
    const wide = await (await call(`?lat=${anchor.lat}&lng=${anchor.lng}&radius=40`)).json();

    expect(narrow.data.radiusKm).toBe(5);
    expect(wide.data.radiusKm).toBe(40);
    expect(narrow.data.events.length).toBeLessThanOrEqual(wide.data.events.length);
  });

  it("falls back to the specified ~15 km for a nonsense radius rather than failing", async () => {
    const body = await (await call(`?lat=${anchor.lat}&lng=${anchor.lng}&radius=-3`)).json();
    expect(body.data.radiusKm).toBe(15);
  });

  it("rejects a missing or impossible coordinate with 400", async () => {
    expect((await call("")).status).toBe(400);
    expect((await call("?lat=999&lng=13")).status).toBe(400);
  });
});

describe("TS-013-A5 / TS-013 D6: the nearby key is a segment, never a visitor", () => {
  it("marks the mocked answer demo:true and exposes no coordinate back to the caller", async () => {
    const response = await call(`?lat=${anchor.lat}&lng=${anchor.lng}`);
    const body = await response.json();
    expect(body.demo).toBe(true);

    // Not `toContain(String(anchor.lat))`: the anchor's latitude is `54`, and
    // `fetchedAt` is an ISO timestamp — so the assertion failed whenever the
    // minute or the second happened to be 54, which is a little over 3 % of
    // renders. What it means to assert is that **no coordinate** travels back,
    // so it asserts that: no coordinate-shaped field, and no coordinate-shaped
    // value.
    const payload = JSON.stringify(body.data);
    expect(payload).not.toContain('"lat"');
    expect(payload).not.toContain('"lng"');
    expect(payload).not.toContain(anchor.lat.toFixed(2));
    expect(payload).not.toContain(anchor.lng.toFixed(2));
  });
});
