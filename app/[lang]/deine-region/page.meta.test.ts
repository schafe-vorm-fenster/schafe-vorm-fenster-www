import { describe, expect, it } from "vitest";

import { checkPageMeta } from "@/src/lib/pages/page-meta";

import { pageMeta } from "./page.meta";

/**
 * TS-026-A15 (static): "`page.meta.ts` for `/deine-region` matches D1 field
 * by field."
 *
 * F-2-50: this was the only one of seven manifests with no test, which is
 * why its `liveModules` list drifted to a single entry where D1 names four
 * and nothing caught it. The id resolution itself runs once, in
 * `src/lib/pages/page-meta.test.ts`; this asserts the values D1 fixes.
 */
describe("TS-026-A15: the page manifest of `/deine-region`", () => {
  it("declares exactly D1's values", () => {
    expect(pageMeta.route).toBe("region");
    expect(pageMeta.focusJob).toBe("run-our-own-calendar");
    expect(pageMeta.primaryConversion).toBe("request-licence-quote");
    expect(pageMeta.equalWeightConversion).toBe("request-product-briefing");
    expect(pageMeta.audiences).toEqual(["counties", "institutions", "municipalities"]);
    expect(pageMeta.proofSlots).toEqual(["deine-region-6-proof"]);
    expect(pageMeta.emptyState).toBeUndefined();
    expect(checkPageMeta(pageMeta)).toEqual([]);
  });

  /**
   * D1's `liveModules` row names four: county examples (position 3),
   * counters (position 4), the place search, and the embed demo
   * (position 1′). Three of them render; the embed demo is **deliberately
   * undeclared** while F-2-15 is open — it is not wired, and declaring a
   * module the page does not run would make the manifest agree with D1 by
   * saying something untrue. The gap is `state/open.md`'s, not this file's.
   */
  it("declares the three live modules that run, each with an empty state", () => {
    expect(pageMeta.liveModules.map((module) => module.id)).toEqual([
      "position-3-active-places-in-the-county",
      "position-4-live-counters",
      "place-search",
    ]);
    for (const declared of pageMeta.liveModules) {
      expect(declared.emptyState.trim().length).toBeGreaterThan(0);
    }
  });

  it("does not declare the embed demo while it is unwired (F-2-15)", () => {
    expect(pageMeta.liveModules.map((module) => module.id)).not.toContain(
      "position-1b-embed-demo",
    );
  });
});
