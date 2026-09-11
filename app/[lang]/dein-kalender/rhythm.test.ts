import { describe, expect, it } from "vitest";

import { checkRhythm } from "@/src/components/section-shell/rhythm";

/**
 * TS-024 — the page's full section sequence: own blocks (D2) plus the two
 * `PageFrame` always appends (context band `surface`, closing `paper`).
 * `himbeereCount = 1`: the one Pulse button, in `focus` (D3).
 */
describe("TS-024: /dein-kalender section rhythm", () => {
  it("has no rhythm violations, own blocks plus the frame's band and closing", () => {
    const sections = [
      "photo", // focus (hero)
      "paper", // contrast
      "violet-500", // embed-demo
      "lime-100", // tiers
      "paper", // proof
      "lime-100", // trust
      "surface", // PageFrame: context band
      "paper", // PageFrame: closing CTA
    ] as const;
    expect(checkRhythm(sections, 1)).toEqual([]);
  });
});
