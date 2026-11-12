import { describe, expect, it } from "vitest";

import { checkRhythm } from "@/src/components/section-shell/rhythm";

/**
 * TS-WEB-0022 D10 — the page's full section sequence, own blocks plus the two
 * `PageFrame` places, run through the shared rhythm predicate: no two photo
 * sections adjacent, at most two consecutive of one colour family, the dark
 * `ink` section exactly once.
 *
 * Since DEC-0196 (issue #154) the frame's closing CTA stands directly after
 * the third path, on `ink` — it took over the dark anchor from the live
 * example, which left the page — and the page's proof block follows it
 * (`closing.followedBy`), then the band.
 *
 * This list is declared, not read off the render, so it can drift from
 * `page.tsx`. Its counterpart in `e2e/pages/mitmachen.spec.ts`
 * (`TS-WEB-0022-A16`) reads the `data-surface` sequence off the served DOM and
 * asserts the clauses that can be read there — no two adjacent photo sections,
 * exactly one `ink` section and it being the closing CTA, and the reserved
 * boxes — so a composition change this file did not follow fails there
 * (T-12 review).
 */
describe("TS-WEB-0022-A16: /mitmachen section rhythm", () => {
  it("has no rhythm violations, own blocks plus the frame's closing and band", () => {
    const sections = [
      "photo", // hero (scene)
      // One objection block, one section since DEC-0203 (issue #159): the
      // comparison module, its pairs on `surface` and `lime-500` on the
      // section's `paper` ground. The `archiv` section is gone, so this and
      // path 1 below are two `paper` sections in a row, which is the most the
      // rule allows.
      "paper", // objections — the comparison module, the proof slot
      // The `wege` slot is one slot on three grounds (DEC-0124). Three
      // sections, because one would be 2.4 phone screens and
      // `e2e/section-budget.spec.ts` caps a section at 1.5; `paper` and
      // `lime-100` rather than the sober greys, because "grey-green never
      // carries positive content" (SRC-0014 §Section grounds).
      "paper", // wege · path 1 — WhatsApp, and the slot's kicker and heading
      "lime-100", // wege · path 2 — calendar connection
      "paper", // wege · path 3 — website import, and the hint banner (D11)
      "ink", // PageFrame: closing CTA — the page's single dark section (DEC-0196)
      "lime-100", // beleg — handed to the frame as `closing.followedBy`
      "surface", // PageFrame: context band, last (DEC-0174 §4)
    ] as const;
    expect(checkRhythm(sections, 0)).toEqual([]);
  });

  it("keeps exactly one ink section", () => {
    // D10: the dark anchor appears once. Before DEC-0196 it was the live
    // example; a second `ink` before the end would be the `inkClosingLast`
    // violation.
    const withLiveExample = [
      "photo",
      "paper",
      "archive",
      "paper",
      "lime-100",
      "paper",
      "ink",
      "ink",
      "lime-100",
      "surface",
    ] as const;
    expect(checkRhythm(withLiveExample, 0)).not.toEqual([]);
  });
});
