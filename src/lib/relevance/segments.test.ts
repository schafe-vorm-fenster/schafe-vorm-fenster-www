import { describe, expect, it } from "vitest";

import { segmentCacheKey, segmentKey } from "./segments";
import { geo, NO_GEO, type ViewerContext } from "./types";

const viewer: ViewerContext = {
  geo: geo({
    country: "de",
    state: "niedersachsen",
    county: "helmstedt",
    municipality: "lehre",
    community: "flechtorf",
  }),
  trait: "professional",
  job: "run-our-own-calendar",
  stage: 3,
  locale: "de",
};

describe("TS-005-A8: the engine never renders per visitor — it renders per segment", () => {
  it("keys on community, entry trait, focus job and the ISO week", () => {
    expect(segmentKey(viewer, "2026-W37")).toEqual({
      community: "flechtorf",
      trait: "professional",
      job: "run-our-own-calendar",
      isoWeek: "2026-W37",
    });
  });

  it("gives two visitors of one community, trait and job the same key", () => {
    const other: ViewerContext = { ...viewer, locale: "en", stage: 2 };
    expect(segmentCacheKey(viewer, "2026-W37")).toBe(segmentCacheKey(other, "2026-W37"));
  });

  it("falls back to municipality when DEC-055's parameter change is applied", () => {
    expect(segmentKey(viewer, "2026-W37", { geoAxis: "municipality" }).community).toBe("lehre");
  });

  it("carries a stage-0 viewer as an explicit none, never as an empty string", () => {
    const key = segmentKey({ ...viewer, geo: NO_GEO, stage: 0 }, "2026-W37");
    expect(key.community).toBeNull();
    expect(segmentCacheKey({ ...viewer, geo: NO_GEO, stage: 0 }, "2026-W37")).toContain("none");
  });

  it("changes at the week boundary, so a cached segment cannot serve last week's order", () => {
    expect(segmentCacheKey(viewer, "2026-W37")).not.toBe(segmentCacheKey(viewer, "2026-W38"));
  });
});
