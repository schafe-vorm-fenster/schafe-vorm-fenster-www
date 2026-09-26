import { describe, expect, it } from "vitest";

import { checkRhythm } from "@/src/components/section-shell/rhythm";

/**
 * TS-WEB-0024 — the page's full section sequence: own blocks (D2 as amended by
 * DEC-0131 §1 — seven blocks) plus the two `PageFrame` always appends (context
 * band `surface`, closing `paper`). `himbeereCount = 1`: the one Pulse button,
 * in `focus` (D3). The contact section is not a rhythm entry (DEC-0117).
 */
describe("TS-WEB-0024: /dein-kalender section rhythm", () => {
  it("has no rhythm violations, own blocks plus the frame's band and closing", () => {
    const sections = [
      "photo", // focus (hero)
      "paper", // contrast
      "violet-500", // embed-demo — the real embedded calendar, alone
      // The settings that produce it, on their own fresh ground: grey-green
      // never carries positive content (SRC-0014 §Page Rhythm), and the
      // review reads `surface-2` as "angestaubt" for exactly that reason.
      "paper", // embed-config
      "paper", // tiers — one paper section with the lime-500 band (DEC-0118)
      // Proof moves off `paper`: `embed-config` and `tiers` are two neutral
      // grounds already, and a third in a row is the family rule.
      "lime-100", // proof
      "lime-100", // trust
      "surface", // PageFrame: context band
      "paper", // PageFrame: closing CTA
    ] as const;
    expect(checkRhythm(sections, 1)).toEqual([]);
  });
});
