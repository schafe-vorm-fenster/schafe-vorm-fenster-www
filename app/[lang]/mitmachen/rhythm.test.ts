import { describe, expect, it } from "vitest";

import { checkRhythm } from "@/src/components/section-shell/rhythm";

/**
 * TS-WEB-0022 D10 — the page's full section sequence, own blocks plus the two
 * `PageFrame` always appends (context band `surface`, closing `paper`), run
 * through the shared rhythm predicate: no two photo sections adjacent, at
 * most two consecutive of one colour family, the dark `ink` section exactly
 * once (the live example, D10's anchor).
 */
describe("TS-WEB-0022-A16: /mitmachen section rhythm", () => {
  it("has no rhythm violations, own blocks plus the frame's band and closing", () => {
    const sections = [
      "photo", // hero (scene)
      // One objection block, two sections (DEC-0124): together the two
      // halves measure 1627 px at 390 px, and G-4 caps a section at 1270
      // (`e2e/section-budget.spec.ts`). The archive ground is its own colour
      // family, so `paper → archive → paper` is three families and not a run
      // (DEC-0117).
      "paper", // objections — headline, the three people, the proof slot
      "archive", // archiv — the usual channels, problem content only
      // The `wege` slot is one slot on three grounds (DEC-0124). Three
      // sections, because one would be 2.4 phone screens and
      // `e2e/section-budget.spec.ts` caps a section at 1.5; `paper` and
      // `lime-100` rather than the sober greys, because "grey-green never
      // carries positive content" (SRC-0014 §Section grounds).
      "paper", // wege · path 1 — WhatsApp, and the slot's kicker and heading
      "lime-100", // wege · path 2 — calendar connection
      "paper", // wege · path 3 — website import, and the hint banner (D11)
      // The `/dein-kalender` cross-reference, at the end of slot 3 where D9
      // puts it, in a quiet `aside` of its own rather than as a fourth step
      // of "your website as the source" (polish brief, page 4, item 5).
      "lime-100", // verweis
      "ink", // live example — the page's single dark section
      // Lime, not a grey: `PageFrame` appends `surface` and `paper` after
      // this, and three neutral sections in a row is the violation.
      "lime-100", // beleg
      "surface", // PageFrame: context band
      "paper", // PageFrame: closing CTA
    ] as const;
    expect(checkRhythm(sections, 0)).toEqual([]);
  });
});
