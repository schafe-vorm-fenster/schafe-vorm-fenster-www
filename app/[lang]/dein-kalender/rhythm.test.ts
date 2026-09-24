import { describe, expect, it } from "vitest";

import { checkRhythm } from "@/src/components/section-shell/rhythm";

/**
 * TS-WEB-0024 — the page's full section sequence: own blocks (D2) plus the two
 * `PageFrame` always appends (context band `surface`, closing `paper`).
 * `himbeereCount = 1`: the one Pulse button, in `focus` (D3).
 */
describe("TS-WEB-0024: /dein-kalender section rhythm", () => {
  it("has no rhythm violations, own blocks plus the frame's band and closing", () => {
    const sections = [
      "photo", // focus (hero)
      "paper", // contrast
      "violet-500", // embed-demo — the real embedded calendar, alone
      // The settings that produce it, on their own light ground (G-4): the
      // two together measured 1772 px, a screen and a half over budget.
      "surface-2", // embed-config
      "lime-100", // tiers
      "paper", // proof
      "lime-100", // trust
      "surface", // PageFrame: context band
      "paper", // PageFrame: closing CTA
    ] as const;
    expect(checkRhythm(sections, 1)).toEqual([]);
  });
});
