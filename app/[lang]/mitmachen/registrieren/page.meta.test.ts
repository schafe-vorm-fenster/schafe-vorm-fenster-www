import { describe, expect, it } from "vitest";

import { checkPageMeta } from "@/src/lib/pages/page-meta";

import { pageMeta } from "./page.meta";

describe("TS-WEB-0023-A1 (via TS-WEB-0006-A1): /mitmachen/registrieren manifest", () => {
  it("passes the TS-WEB-0006 D1 structural check", () => {
    expect(checkPageMeta(pageMeta)).toEqual([]);
  });

  it("declares no proof slot — the argument was made on /mitmachen (D1)", () => {
    expect(pageMeta.proofSlots).toEqual([]);
  });
});
