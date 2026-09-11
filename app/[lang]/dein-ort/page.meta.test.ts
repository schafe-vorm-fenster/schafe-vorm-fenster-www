import { describe, expect, it } from "vitest";

import { checkPageMeta } from "@/src/lib/pages/page-meta";

import { PLACE_META } from "./page.meta";

/**
 * TS-020-A1 (static): "`page.meta.ts` of `/dein-ort` declares exactly D1's
 * values including `emptyState`; conversion ids resolve in
 * `@schafe-vorm-fenster/goals`; both audiences resolve, in that order."
 *
 * The id resolution itself runs once, in `src/lib/pages/page-meta.test.ts`;
 * this asserts the values TS-020 D1 fixes.
 */
describe("TS-020-A1: the page manifest of `/dein-ort`", () => {
  it("declares exactly D1's values", () => {
    expect(PLACE_META.route).toBe("place");
    expect(PLACE_META.focusJob).toBe("know-what-is-on");
    expect(PLACE_META.primaryConversion).toBe("save-calendar-to-homescreen");
    expect(PLACE_META.equalWeightConversion).toBeUndefined();
    expect(PLACE_META.audiences).toEqual(["rural-residents", "actors"]);
    expect(PLACE_META.proofSlots).toHaveLength(4);
    expect(checkPageMeta(PLACE_META)).toEqual([]);
  });

  it("declares the three live modules of D1, each with an empty state", () => {
    expect(PLACE_META.liveModules.map((module) => module.id)).toEqual([
      "position-1-dates-in-the-place",
      "position-2-this-week-nearby",
      "place-search",
    ]);
    for (const declared of PLACE_META.liveModules) {
      expect(declared.emptyState.length).toBeGreaterThan(0);
    }
  });

  /**
   * TS-006-A10 / TS-020 D2: the one registered runtime focus-job change on
   * the website. The register is this field.
   */
  it("is the one page that declares an emptyState", () => {
    expect(PLACE_META.emptyState).toEqual({
      focusJob: "publish-our-dates",
      primaryConversion: "register-as-publisher",
    });
  });
});
