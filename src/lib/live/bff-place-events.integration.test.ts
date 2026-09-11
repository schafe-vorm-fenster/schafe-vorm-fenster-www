import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resetRateLimits } from "./bff";
import { EMPTY_DEMO_SLUG } from "./mocks/fixtures";

import { GET } from "@/app/api/places/[slug]/events/route";

const call = (slug: string, query = "") =>
  GET(new Request(`http://localhost:3100/api/places/${slug}/events${query}`), {
    params: Promise.resolve({ slug }),
  });

beforeEach(() => {
  resetRateLimits();
  vi.stubEnv("LIVE_DATA", "mock");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("TS-008-A4: an empty upstream result is 200 and a conversion, not an error", () => {
  it("answers 200 with an empty list and the publish invitation for a covered place with no dates", async () => {
    const response = await call(EMPTY_DEMO_SLUG);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.events).toEqual([]);
    expect(body.data.publishInvitation).toBe(true);
    expect(body.tier).toBe("live");
  });

  it("carries no error, no retry affordance and no warning anywhere in the payload", async () => {
    const text = await (await call(EMPTY_DEMO_SLUG)).text();
    expect(text).not.toMatch(/error|retry|erneut|Fehler/i);
  });

  it("answers the place's dates and no invitation when the window has dates", async () => {
    const body = await (await call("beispielgemeinde-musterdorf")).json();
    expect(body.data.publishInvitation).toBe(false);
    expect(body.data.events.length).toBeGreaterThan(0);
    expect(body.data.place.name).toBe("Beispielgemeinde Musterdorf");
  });

  it("keeps the uncovered place a 404 — a different fact from an empty list (TS-008 D7)", async () => {
    expect((await call("gibt-es-hier-nicht")).status).toBe(404);
  });

  it("rejects an unknown window rather than silently widening it", async () => {
    expect((await call("beispielgemeinde-musterdorf", "?window=letztes-jahr")).status).toBe(400);
  });

  it("serves the today window as its own cut of the calendar day", async () => {
    const response = await call("beispielgemeinde-musterdorf", "?window=today");
    expect(response.status).toBe(200);
  });
});

describe("TS-009-A5: the dates route carries the dates cache lifetime of TS-003 D5", () => {
  it("sends s-maxage=300 with a three-day serve-stale window", async () => {
    const response = await call("beispielgemeinde-musterdorf");
    expect(response.headers.get("cache-control")).toBe(
      "public, s-maxage=300, stale-while-revalidate=259200",
    );
  });
});

describe("TS-017-A10: the route is read-only by construction", () => {
  it("exports GET and nothing else", async () => {
    const handlers = await import("@/app/api/places/[slug]/events/route");
    expect(Object.keys(handlers)).toEqual(["GET"]);
  });
});
