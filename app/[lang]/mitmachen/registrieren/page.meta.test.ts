import { describe, expect, it } from "vitest";

import { checkPageMeta } from "@/src/lib/pages/page-meta";

import { pageMeta } from "./page.meta";

describe("TS-023-A1 (via TS-006-A1): /mitmachen/registrieren manifest", () => {
  it("passes the TS-006 D1 structural check", () => {
    expect(checkPageMeta(pageMeta)).toEqual([]);
  });

  it("declares no proof slot — the argument was made on /mitmachen (D1)", () => {
    expect(pageMeta.proofSlots).toEqual([]);
  });
});
