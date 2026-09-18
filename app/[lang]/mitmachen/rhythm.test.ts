import { describe, expect, it } from "vitest";

import { checkRhythm } from "@/src/components/section-shell/rhythm";

/**
 * TS-022 D10 — the page's full section sequence, own blocks plus the two
 * `PageFrame` always appends (context band `surface`, closing `paper`), run
 * through the shared rhythm predicate: no two photo sections adjacent, at
 * most two consecutive of one colour family, the dark `ink` section exactly
 * once (the live example, D10's anchor).
 */
describe("TS-022-A16: /mitmachen section rhythm", () => {
  it("has no rhythm violations, own blocks plus the frame's band and closing", () => {
    const sections = [
      "photo", // hero (scene)
      "paper", // objections
      // One path per section (polish brief G-4) — the single 2035 px block
      // the three of them used to share was 2.4 phone screens. The lime
      // ground between them is not decoration: three neutral sections in a
      // row would break the very rule this test checks.
      "surface-2", // path 1 — WhatsApp
      "lime-100", // path 2 — calendar connection
      "surface-2", // path 3 — website import
      "ink", // live example — the page's single dark section
      "lime-100", // proof
      "surface", // PageFrame: context band
      "paper", // PageFrame: closing CTA
    ] as const;
    expect(checkRhythm(sections, 0)).toEqual([]);
  });
});
