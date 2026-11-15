import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { HERO_ANCHOR, anchoredCropWindow } from "../../../scripts/lib/focal-crop.mjs";

describe("TS-WEB-0006-A23: the hero is cut on the system-wide anchors (issue 255, DEC-0223)", () => {
  // Lübbenow, the calendar hero's original: 3604 × 2229, focal 45 / 55.
  const SOURCE = { width: 3604, height: 2229 };
  const FOCAL = { x: 45, y: 55 };
  const PHONE = { width: 800, height: 900 };
  const WIDE = { width: 1400, height: 600 };

  it("puts the focal point on the phone anchor", () => {
    const window = anchoredCropWindow(SOURCE, PHONE, FOCAL, HERO_ANCHOR.phone);
    expect(window.anchored).toBe(true);
    expect(window.landed.x).toBeCloseTo(50, 0);
    expect(window.landed.y).toBeCloseTo(28, 0);
    expect(window.width / window.height).toBeCloseTo(800 / 900, 2);
    expect(window.left + window.width).toBeLessThanOrEqual(SOURCE.width);
    expect(window.top + window.height).toBeLessThanOrEqual(SOURCE.height);
  });

  it("puts the focal point on the wide anchor", () => {
    const window = anchoredCropWindow(SOURCE, WIDE, FOCAL, HERO_ANCHOR.wide);
    expect(window.anchored).toBe(true);
    expect(window.landed.x).toBeCloseTo(68, 0);
    expect(window.landed.y).toBeCloseTo(32, 0);
    expect(window.width / window.height).toBeCloseTo(1400 / 600, 2);
  });

  it("reaches the phone anchor on a low master once the floor allows a 600 px window", () => {
    // The /mitmachen master: 2400 × 1018, focal 45 / 52.
    const window = anchoredCropWindow(
      { width: 2400, height: 1018 },
      PHONE,
      { x: 45, y: 52 },
      HERO_ANCHOR.phone,
      { minWidth: 600 },
    );
    expect(window.anchored).toBe(true);
  });

  it("keeps the generator's anchors and the stylesheet's tokens on one pair", () => {
    const css = readFileSync(join(process.cwd(), "app/styles/components.css"), "utf8");
    const token = (name: string) =>
      css.match(new RegExp(`--hero-anchor-${name}:\\s*([^;]+);`))?.[1].trim();
    expect(token("phone")).toBe(`${HERO_ANCHOR.phone.x}% ${HERO_ANCHOR.phone.y}%`);
    expect(token("wide")).toBe(`${HERO_ANCHOR.wide.x}% ${HERO_ANCHOR.wide.y}%`);
  });
});
