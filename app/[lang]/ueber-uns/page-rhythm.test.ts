import { describe, expect, it } from "vitest";

import { checkRhythm, type RhythmEntry } from "@/src/components/section-shell/rhythm";

/**
 * TS-WEB-0027-A2 / SRC-0014 §Page Rhythm — the page's full section sequence, own
 * blocks plus the two `PageFrame` appends.
 *
 * Since DEC-0081 §6 the page has a conversion of its own, so `PageFrame` renders
 * the closing CTA (`paper`) and the band (`surface`) — in that order since
 * DEC-0174 §4 — as two sections instead of
 * the merged three-job block. The counter section is gone (D4), and the archive
 * link stands in a tight block of its own (D6, D2 block 3). The newsletter is
 * not in the list because it does not render while no sending system is named
 * (TS-WEB-0016-A21, DEC-0122 §3); the contact section is never a rhythm entry
 * (SRC-0014, DEC-0117).
 *
 * Since DEC-0162 the page follows the owner's design of 2026-10-12: three
 * chapters, a quote band as the second photo section, the person, the
 * principles and the award block.
 *
 * The list is declared, not read off the render, so it can drift from
 * `page.tsx`. Its counterpart in `e2e/pages/ueber-uns.spec.ts` (A2) reads the
 * `data-surface` sequence off the served DOM, so a composition change this file
 * did not follow fails there.
 */
describe("TS-WEB-0027-A2: /ueber-uns page rhythm", () => {
  it("has no rhythm violation, two photo sections and none adjacent", () => {
    // DEC-0162: the owner's design of 2026-10-12, chapter by chapter.
    const sections: RhythmEntry[] = [
      "photo", // 1 stage — kicker and the h1 on the photograph
      "paper", // 2 chapter 01
      "photo", // 3 the quote band, the founder portrait
      "lime-100", // 4 chapter 02, the honorary-mayor proof
      "paper", // 5 chapter 03, the stories
      "lime-100", // 6 who is behind it
      "paper", // 7 the principles
      "violet-500", // 8 the award
      "paper", // PageFrame: closing CTA — the page's one primary
      "surface", // PageFrame: context band, last (DEC-0174 §4)
    ];
    expect(checkRhythm(sections)).toEqual([]);
    expect(sections.filter((section) => section === "photo")).toHaveLength(2);
    // D4: no dark ink section here either — this page carries no live module.
    expect(sections.filter((section) => section === "ink")).toHaveLength(0);
  });
});
