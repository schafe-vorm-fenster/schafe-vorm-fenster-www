import { describe, expect, it } from "vitest";

import { REFERENCE_PLACE, selectExamplePlace } from "./example-place";

import type { ExamplePlaceCandidate } from "./example-place";

describe("TS-022-A7: example-place selection", () => {
  it("returns the configured reference place with no anchor", () => {
    expect(selectExamplePlace(undefined)).toBe(REFERENCE_PLACE);
  });

  it("returns the nearest active covered place with dates when an anchor is given", () => {
    const candidates: ExamplePlaceCandidate[] = [
      { slug: "a", name: "A", active: true, upcomingDates: 2 },
      { slug: "b", name: "B", active: true, upcomingDates: 5 },
    ];
    expect(selectExamplePlace("anchor", candidates)).toBe(candidates[0]);
  });

  it("skips a candidate with zero dates rather than rendering it", () => {
    const candidates: ExamplePlaceCandidate[] = [
      { slug: "zero", name: "Zero", active: true, upcomingDates: 0 },
      { slug: "has-dates", name: "Has dates", active: true, upcomingDates: 1 },
    ];
    expect(selectExamplePlace("anchor", candidates)).toBe(candidates[1]);
  });

  it("skips an inactive candidate even with dates", () => {
    const candidates: ExamplePlaceCandidate[] = [
      { slug: "inactive", name: "Inactive", active: false, upcomingDates: 4 },
    ];
    expect(selectExamplePlace("anchor", candidates)).toBe(REFERENCE_PLACE);
  });

  it("falls back to the reference place when no candidate qualifies", () => {
    expect(selectExamplePlace("anchor", [])).toBe(REFERENCE_PLACE);
  });
});
