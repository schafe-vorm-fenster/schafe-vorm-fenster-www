import { describe, expect, it } from "vitest";

import { DATA_STATES, DECLARED_STATES, isMocked, isPending } from "./data-state";

describe("TS-008-A: the four states are one vocabulary", () => {
  it("names exactly the five cases, `ready` plus the four declared ones", () => {
    expect(DATA_STATES).toEqual(["ready", "loading", "empty", "degraded", "mocked"]);
    for (const state of DECLARED_STATES) expect(DATA_STATES).toContain(state);
  });

  it("keeps emptiness, staleness, failure and mock data apart", () => {
    expect(DECLARED_STATES).toHaveLength(4);
    expect(new Set(DECLARED_STATES).size).toBe(4);
  });

  it("marks only the mocked state and reserves geometry only while loading", () => {
    expect(isMocked("mocked")).toBe(true);
    expect(isMocked("degraded")).toBe(false);
    expect(isMocked(undefined)).toBe(false);
    expect(isPending("loading")).toBe(true);
    expect(isPending("empty")).toBe(false);
  });
});
