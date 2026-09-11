import { describe, expect, it } from "vitest";

import { checkPageMeta } from "@/src/lib/pages/page-meta";

import { PLACE_START_META } from "./page.meta";

/**
 * TS-021-A1 (static): "`page.meta.ts` matches D1 exactly: focus job
 * 'publish our dates', `primaryConversion` `register-as-publisher`,
 * audiences in the order `actors`, `municipalities`, `rural-residents`, both
 * live modules declared, no proof slot, no `equalWeightConversion`."
 */
describe("TS-021-A1: the page manifest of `/dein-ort/starten`", () => {
  it("matches D1 exactly", () => {
    expect(PLACE_START_META.route).toBe("placeStart");
    expect(PLACE_START_META.focusJob).toBe("publish-our-dates");
    expect(PLACE_START_META.primaryConversion).toBe("register-as-publisher");
    expect(PLACE_START_META.equalWeightConversion).toBeUndefined();
    expect(PLACE_START_META.audiences).toEqual([
      "actors",
      "municipalities",
      "rural-residents",
    ]);
    expect(PLACE_START_META.proofSlots).toEqual([]);
    expect(PLACE_START_META.liveModules.map((entry) => entry.id)).toEqual([
      "place-search",
      "position-3-active-places-in-the-county",
    ]);
    expect(checkPageMeta(PLACE_START_META)).toEqual([]);
  });

  /** D1: "The focus job is **static**" — this page is not the TS-008 D4 shift. */
  it("declares no runtime focus-job change", () => {
    expect(PLACE_START_META.emptyState).toBeUndefined();
  });
});
