import { describe, expect, it } from "vitest";

import { checkPageMeta } from "@/src/lib/pages/page-meta";

import { pageMeta } from "./page.meta";

/**
 * The manifest as DEC-0176 leaves it. The flow's one live module — the place
 * search of step 1 — is not rendered while the Google Form is embedded, so
 * `liveModules` is empty, and `checkPageMeta`'s TS-WEB-0006 D1 floor ("≥ 1 live
 * module") names that, as it does for `/dein-kalender/bestellen`. The test
 * names the violation instead of declaring a module the page does not render.
 */
describe("TS-WEB-0006-A1 for TS-WEB-0023 D1: /mitmachen/registrieren manifest", () => {
  it("fails only the live-module floor — no live module while the form is embedded (DEC-0176)", () => {
    expect(checkPageMeta(pageMeta)).toEqual(["no live module declared"]);
    expect(pageMeta.liveModules).toEqual([]);
  });

  it("declares no proof slot — the argument was made on /mitmachen (D1)", () => {
    expect(pageMeta.proofSlots).toEqual([]);
  });
});
