import { describe, expect, it } from "vitest";

import { checkRhythm, type RhythmEntry } from "@/src/components/section-shell/rhythm";

/**
 * TS-WEB-0027-A2 / SRC-0014 §Page Rhythm — the page's full section sequence, own
 * blocks plus the two `PageFrame` appends.
 *
 * Since DEC-0081 §6 the page has a conversion of its own, so `PageFrame` renders
 * the band (`surface`) and the closing CTA (`paper`) as two sections instead of
 * the merged three-job block. The counter section is gone (D4), and the archive
 * link stands in a tight block of its own (D6, D2 block 3). The newsletter is
 * not in the list because it does not render while no sending system is named
 * (TS-WEB-0016-A21, DEC-0122 §3); the contact section is never a rhythm entry
 * (SRC-0014, DEC-0117).
 *
 * The list is declared, not read off the render, so it can drift from
 * `page.tsx`. Its counterpart in `e2e/pages/ueber-uns.spec.ts` (A2) reads the
 * `data-surface` sequence off the served DOM, so a composition change this file
 * did not follow fails there.
 */
describe("TS-WEB-0027-A2: /ueber-uns page rhythm", () => {
  it("has no rhythm violation and exactly one photo section", () => {
    const sections: RhythmEntry[] = [
      "photo", // 1a hero — the h1 on the photograph
      "paper", // 1b the village argument, the portrait, the honorary-mayor proof
      "lime-100", // 1c the story, the anecdotes, the founder quote
      "surface", // 2 proof stream
      "paper", // 3 the archive link, tight
      "lime-100", // 4 team
      "surface", // PageFrame: context band
      "paper", // PageFrame: closing CTA — the page's one primary
    ];
    expect(checkRhythm(sections)).toEqual([]);
    expect(sections.filter((section) => section === "photo")).toHaveLength(1);
    // D4: no dark ink section here either — this page carries no live module.
    expect(sections.filter((section) => section === "ink")).toHaveLength(0);
  });
});
