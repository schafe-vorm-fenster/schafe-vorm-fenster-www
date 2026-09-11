import { describe, expect, it } from "vitest";

import { checkPageMeta } from "@/src/lib/pages/page-meta";

import { pageMeta } from "./page.meta";

describe("TS-024-A1: /dein-kalender manifest", () => {
  it("passes the TS-006 D1 structural check", () => {
    expect(checkPageMeta(pageMeta)).toEqual([]);
  });

  it("declares D1 exactly: the four audiences in order, the equal-weight briefing goal", () => {
    expect(pageMeta.audiences).toEqual(["municipalities", "institutions", "actors", "counties"]);
    expect(pageMeta.equalWeightConversion).toBe("request-product-briefing");
    expect(pageMeta.proofSlots).toEqual(["tiers-480", "contrast", "trust"]);
  });

  it("never declares request-licence-quote — that goal belongs to /deine-region", () => {
    expect(pageMeta.primaryConversion).not.toBe("request-licence-quote");
    expect(pageMeta.equalWeightConversion).not.toBe("request-licence-quote");
  });
});
