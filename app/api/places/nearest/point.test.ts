import { describe, expect, it } from "vitest";

import { readPoint } from "./point";

/**
 * DEC-0119 — what `/api/places/nearest` accepts as a point, before any
 * backend is asked. A rejected pair is a 400 in the route; nothing about
 * the visitor's coordinates is inferred, rounded or kept.
 */
describe("readPoint: the route's one input", () => {
  it("reads a well-formed WGS-84 pair", () => {
    expect(readPoint("54.0", "13.4")).toEqual({ lat: 54, lng: 13.4 });
    expect(readPoint(" -33.9 ", " 151.2 ")).toEqual({ lat: -33.9, lng: 151.2 });
  });

  it("refuses a missing or empty half", () => {
    expect(readPoint(null, "13.4")).toBeUndefined();
    expect(readPoint("54.0", null)).toBeUndefined();
    expect(readPoint("", "13.4")).toBeUndefined();
    expect(readPoint("54.0", "   ")).toBeUndefined();
  });

  it("refuses what is not a finite number", () => {
    expect(readPoint("north", "13.4")).toBeUndefined();
    expect(readPoint("54.0", "NaN")).toBeUndefined();
    expect(readPoint("Infinity", "13.4")).toBeUndefined();
  });

  it("refuses a point off the globe", () => {
    expect(readPoint("90.1", "13.4")).toBeUndefined();
    expect(readPoint("54.0", "-180.5")).toBeUndefined();
    expect(readPoint("90", "180")).toEqual({ lat: 90, lng: 180 });
  });
});
