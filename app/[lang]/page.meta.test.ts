import { describe, expect, it } from "vitest";

import { checkPageMeta } from "@/src/lib/pages/page-meta";

import { HOME_META } from "./page.meta";

/**
 * TS-019-A1 (static): "The manifest of `/` carries exactly the D1 values:
 * `focusJob` = `know-what-is-on`, `primaryConversion` =
 * `save-calendar-to-homescreen`, no `equalWeightConversion`, four live
 * modules, `proofSlots` = 5."
 *
 * The vocabulary itself (do these ids exist in the hub packages?) is checked
 * once, in `src/lib/pages/page-meta.test.ts`.
 */
describe("TS-019-A1: the page manifest of `/`", () => {
  it("declares exactly the D1 values", () => {
    expect(HOME_META.route).toBe("home");
    expect(HOME_META.focusJob).toBe("know-what-is-on");
    expect(HOME_META.primaryConversion).toBe("save-calendar-to-homescreen");
    expect(HOME_META.equalWeightConversion).toBeUndefined();
    expect(HOME_META.liveModules).toHaveLength(4);
    expect(HOME_META.proofSlots).toHaveLength(5);
  });

  it("names the four live modules of TS-019 D5, each with an empty state", () => {
    expect(HOME_META.liveModules.map((module) => module.id)).toEqual([
      "place-search",
      "position-1-dates-in-the-place",
      "position-2-this-week-nearby",
      "position-4-live-counters",
    ]);
    expect(checkPageMeta(HOME_META)).toEqual([]);
  });

  it("orders its audiences, reader first", () => {
    expect(HOME_META.audiences[0]).toBe("rural-residents");
    expect(HOME_META.audiences.length).toBeGreaterThan(0);
  });
});

/**
 * TS-006-A10: "Stage-0 render and stage-3 render of the same page have
 * identical block structure and identical `focusJob`." The manifest is the
 * static half of that — `/` declares no `emptyState`, so no stage can shift
 * its focus job; `/dein-ort` is the one registered exception (TS-020 D1).
 */
describe("TS-006-A10: `/` declares no runtime focus-job change", () => {
  it("has no emptyState manifest", () => {
    expect(HOME_META.emptyState).toBeUndefined();
  });
});
