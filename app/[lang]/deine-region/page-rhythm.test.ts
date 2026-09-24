import { describe, expect, it } from "vitest";

import { checkRhythm, type RhythmEntry } from "@/src/components/section-shell/rhythm";

/**
 * TS-WEB-0026 / SRC-0014 §Page Rhythm — the section surface sequence of both
 * routes, checked the way `src/components/README.md` prescribes: "no two
 * photo sections adjacent, at most two consecutive sections of one colour
 * family, one `ink` section per page". `PageFrame` always appends `surface`
 * (the context band) then `paper` (the closing block) after a page's own
 * blocks (`app/[lang]/_page-frame.tsx`), so both lists include that tail.
 */

describe("TS-WEB-0026: /deine-region page rhythm", () => {
  it("has no rhythm violation across focus, argument blocks, band and closing", () => {
    const sections: RhythmEntry[] = [
      "photo", // 1 focus (hero-block)
      "paper", // 2 the territory question
      "ink", // 3 what is already live here (the one ink anchor)
      "surface-2", // 4 the product (embed demo)
      "paper", // 5 what it adds (feature-benefit's own contained media, not a photo section)
      "lime-100", // 6 proof
      // Block 7 — the inline quote form — is gone (polish brief page 8,
      // item 2): `/deine-region/angebot` is the form, this page is the
      // argument, and the two of them showed "Absenden" and "Angebot
      // anfragen" one under the other for a single action. Removing it also
      // removes the two adjacent `lime-100` sections the brief measured.
      "surface", // PageFrame block 3 — context band
      "paper", // PageFrame block 4 — closing CTA
    ];
    expect(checkRhythm(sections)).toEqual([]);
    expect(sections.filter((section) => section === "photo")).toHaveLength(1);
  });
});

describe("TS-WEB-0026: /deine-region/angebot page rhythm", () => {
  it("has no rhythm violation across hero, form, band and closing", () => {
    const sections: RhythmEntry[] = [
      // No hero photograph: `/deine-region/angebot` is a form page, and the
      // violet wash over an office interior read as a rendering error
      // rather than as art direction (brief page 9, item 1).
      "violet-500", // the headline
      "lime-100", // the quote form
      "surface", // PageFrame block 3 — context band
      "paper", // PageFrame block 4 — closing CTA
    ];
    expect(checkRhythm(sections)).toEqual([]);
  });
});
