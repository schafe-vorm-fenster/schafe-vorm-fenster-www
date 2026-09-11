import { describe, expect, it } from "vitest";

import { checkPageMeta } from "@/src/lib/pages/page-meta";

import { pageMeta } from "./page.meta";

describe("TS-022-A1: /mitmachen manifest", () => {
  it("passes the TS-006 D1 structural check", () => {
    expect(checkPageMeta(pageMeta)).toEqual([]);
  });

  it("declares D1 exactly: focus job, conversion, audiences, no equal-weight goal", () => {
    expect(pageMeta.focusJob).toBe("publish-our-dates");
    expect(pageMeta.primaryConversion).toBe("register-as-publisher");
    expect(pageMeta.equalWeightConversion).toBeUndefined();
    expect(pageMeta.audiences).toEqual(["actors", "municipalities"]);
    expect(pageMeta.proofSlots).toHaveLength(3);
  });
});
