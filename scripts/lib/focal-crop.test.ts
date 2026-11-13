import { describe, expect, it } from "vitest";

import { anchoredCropWindow, cropWindow } from "./focal-crop.mjs";

describe("DEC-0153: the focal point lands where the box is clear", () => {
  // Brietzig, the bakery story's photograph: 2889 × 1929, church foot at ~62 %.
  const SOURCE = { width: 2889, height: 1929 };
  const STAGE = { width: 1200, height: 960 }; // 5:4
  const FOCAL = { x: 55, y: 62 };

  it("centring keeps a low motif low — the defect", () => {
    const window = cropWindow(SOURCE, STAGE, FOCAL);
    const landed = (FOCAL.y / 100 * SOURCE.height - window.top) / window.height;
    expect(landed).toBeGreaterThan(0.55);
  });

  it("puts the focal point at the anchor, inside the reading band's clear part", () => {
    const window = anchoredCropWindow(SOURCE, STAGE, FOCAL, { x: 50, y: 28 });
    expect(window.anchored).toBe(true);
    expect(window.landed.y).toBeCloseTo(28, 0);
    expect(window.width / window.height).toBeCloseTo(1.25, 2);
    expect(window.top + window.height).toBeLessThanOrEqual(SOURCE.height);
    expect(window.left + window.width).toBeLessThanOrEqual(SOURCE.width);
  });

  it("never zooms below the resolution floor, and says where the focal point landed instead", () => {
    const window = anchoredCropWindow({ width: 1400, height: 1000 }, STAGE, FOCAL, { x: 50, y: 28 });
    expect(window.width).toBeGreaterThanOrEqual(1200);
    expect(window.anchored).toBe(false);
    expect(window.landed.y).toBeGreaterThan(28);
  });
});
