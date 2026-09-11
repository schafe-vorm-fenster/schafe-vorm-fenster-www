import { describe, expect, it } from "vitest";

import { checkRhythm, type RhythmEntry } from "@/src/components/section-shell/rhythm";

/**
 * TS-026 / SRC-014 §Page Rhythm — the section surface sequence of both
 * routes, checked the way `src/components/README.md` prescribes: "no two
 * photo sections adjacent, at most two consecutive sections of one colour
 * family, one `ink` section per page". `PageFrame` always appends `surface`
 * (the context band) then `paper` (the closing block) after a page's own
 * blocks (`app/[lang]/_page-frame.tsx`), so both lists include that tail.
 */

describe("TS-026: /deine-region page rhythm", () => {
  it("has no rhythm violation across focus, argument blocks, band and closing", () => {
    const sections: RhythmEntry[] = [
      "photo", // 1 focus (hero-block)
      "paper", // 2 the territory question
      "ink", // 3 what is already live here (the one ink anchor)
      "surface-2", // 4 the product (embed demo)
      "paper", // 5 what it adds (feature-benefit's own contained media, not a photo section)
      "lime-100", // 6 proof
      "lime-100", // 7 quote CTA
      "surface", // PageFrame block 3 — context band
      "paper", // PageFrame block 4 — closing CTA
    ];
    expect(checkRhythm(sections)).toEqual([]);
    expect(sections.filter((section) => section === "photo")).toHaveLength(1);
  });
});

describe("TS-026: /deine-region/angebot page rhythm", () => {
  it("has no rhythm violation across hero, form, band and closing", () => {
    const sections: RhythmEntry[] = [
      "photo", // hero-block
      "lime-100", // the quote form
      "surface", // PageFrame block 3 — context band
      "paper", // PageFrame block 4 — closing CTA
    ];
    expect(checkRhythm(sections)).toEqual([]);
  });
});
