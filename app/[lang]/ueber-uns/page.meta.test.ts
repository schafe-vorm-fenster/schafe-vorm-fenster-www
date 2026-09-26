import { describe, expect, it } from "vitest";

import { pageMeta } from "./page.meta";

import { CONVERSION_MAP, NO_LIVE_MODULE } from "@/src/lib/pages/manifests";
import { AUDIENCE_IDS, checkPageMeta } from "@/src/lib/pages/page-meta";

/**
 * TS-WEB-0027-A1, the static half — "`page.meta.ts` of `/ueber-uns` matches D1".
 *
 * The cross-page half (every route has a manifest, and the set validates both
 * ways against the SRC-0003 conversion map) is `src/lib/pages/manifests.test.ts`;
 * this file asserts the four values D1 fixes for this one route, which no
 * cross-page test can see.
 */
describe("TS-WEB-0027-A1: the /ueber-uns manifest matches D1", () => {
  it("declares the focus job of the trust surface", () => {
    expect(pageMeta.route).toBe("about");
    // "understand who is behind it" is SRC-0001's phrase for the job; `why-us`
    // is its id in TS-WEB-0006 D1's closed four-job set (`JOB_IDS`).
    expect(pageMeta.focusJob).toBe("why-us");
  });

  it("declares the booking as its primary conversion (DEC-0081 §6)", () => {
    expect(pageMeta.primaryConversion).toBe("request-product-briefing");
    expect(pageMeta.equalWeightConversion).toBeUndefined();
    expect(CONVERSION_MAP["request-product-briefing"]).toContain("about");
  });

  it("names its audiences in priority order, none repeated", () => {
    expect(pageMeta.audiences).toEqual([
      "municipalities",
      "institutions",
      "counties",
      "actors",
      "rural-residents",
    ]);
    for (const audience of pageMeta.audiences) expect(AUDIENCE_IDS).toContain(audience);
  });

  it("declares no live module at all, as a named sender surface (D4, DEC-0084 §3)", () => {
    expect(pageMeta.liveModules).toEqual([]);
    expect(NO_LIVE_MODULE.about).toMatch(/TS-WEB-0027 D4/);
    // The live-module floor is the only thing `checkPageMeta` can object to
    // here, and TS-WEB-0006 D1 exempts this route from it by name.
    expect(checkPageMeta(pageMeta)).toEqual(["no live module declared"]);
  });

  it("declares the one proof stream of seven positions (DEC-0048)", () => {
    expect(pageMeta.proofSlots).toEqual(["ueber-uns-3-proof-stream"]);
  });
});
