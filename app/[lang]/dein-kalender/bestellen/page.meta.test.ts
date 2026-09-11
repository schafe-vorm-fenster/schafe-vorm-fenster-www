import { describe, expect, it } from "vitest";

import { checkPageMeta } from "@/src/lib/pages/page-meta";

import { pageMeta } from "./page.meta";

/**
 * TS-025-A1, with the documented TS-006/TS-025 contradiction (see
 * `page.meta.ts`'s docblock and `state/open.md`): D1 fixes an empty
 * `liveModules` list; `checkPageMeta` fixes TS-006 D1's own "≥ 1 live
 * module" floor. Both are correct readings of their own spec — this test
 * names the resulting violation instead of asserting a green check that
 * would hide the disagreement.
 */
describe("TS-025-A1: /dein-kalender/bestellen manifest", () => {
  it("matches D1 field for field", () => {
    expect(pageMeta.focusJob).toBe("run-our-own-calendar");
    expect(pageMeta.primaryConversion).toBe("buy-calendar-licence");
    expect(pageMeta.equalWeightConversion).toBeUndefined();
    expect(pageMeta.audiences).toEqual(["municipalities", "institutions"]);
    expect(pageMeta.liveModules).toEqual([]);
    expect(pageMeta.proofSlots).toEqual([]);
  });

  it("fails only the live-module floor — the TS-006/TS-025 D1 contradiction, not a defect here", () => {
    expect(checkPageMeta(pageMeta)).toEqual(["no live module declared"]);
  });
});
