import { describe, expect, it } from "vitest";

import { DEFAULT_FOCAL, cropWindow } from "./lib/focal-crop.mjs";

/**
 * DEC-0105 §2 — the crop follows the motif's declared focal point.
 *
 * `scripts/generate-images.mjs` cuts a photograph to a ratio box with this
 * window, and `photo-surface` positions the same photograph with the same
 * pair; the cases below are the ones the imagery round actually ran into:
 * a sky-heavy landscape into the 21:9 hero band (the sky has to go), the same
 * landscape into the 8:9 phone hero (nothing vertical left to choose), and a
 * square portrait asset into the 4:5 box (nothing horizontal left to choose).
 */
describe("cropWindow: the largest window of the target ratio, centred on the focal point", () => {
  const landscape = { width: 5073, height: 2817 };

  it("drops the sky when the focal point sits low in a wide band", () => {
    const window = cropWindow(landscape, { width: 1400, height: 600 }, { x: 50, y: 55 });

    expect(window.width, "the full width — the band is wider than the frame").toBe(5073);
    expect(window.height).toBe(Math.round(5073 / (1400 / 600)));
    // Centred on 55 % of the height, so more of the sky goes than of the ground.
    expect(window.top).toBe(Math.round(2817 * 0.55 - window.height / 2));
    expect(window.top).toBeGreaterThan(0);
  });

  it("keeps the whole height when the box is taller than the frame, and chooses the column", () => {
    const window = cropWindow(landscape, { width: 800, height: 900 }, { x: 30, y: 55 });

    expect(window.height, "nothing vertical left to choose").toBe(2817);
    expect(window.width).toBe(Math.round(2817 * (800 / 900)));
    expect(window.left).toBe(Math.round(5073 * 0.3 - window.width / 2));
  });

  it("pushes a window back inside the frame instead of hanging over an edge", () => {
    const window = cropWindow(landscape, { width: 800, height: 900 }, { x: 2, y: 50 });

    expect(window.left, "clamped at the left edge, never negative").toBe(0);
    expect(cropWindow(landscape, { width: 800, height: 900 }, { x: 99, y: 50 }).left).toBe(
      5073 - Math.round(2817 * (800 / 900)),
    );
  });

  it("cuts a square asset to the portrait box on the horizontal only", () => {
    const window = cropWindow({ width: 1717, height: 1717 }, { width: 1152, height: 1440 }, {
      x: 48,
      y: 45,
    });

    expect(window.height).toBe(1717);
    expect(window.width).toBe(Math.round(1717 * (1152 / 1440)));
    expect(window.top).toBe(0);
  });

  it("falls back to the surface's own default when no focal point is declared", () => {
    expect(DEFAULT_FOCAL).toEqual({ x: 50, y: 40 });
    expect(cropWindow(landscape, { width: 1400, height: 600 })).toEqual(
      cropWindow(landscape, { width: 1400, height: 600 }, DEFAULT_FOCAL),
    );
  });

  it("never scales the window past the frame", () => {
    const window = cropWindow({ width: 900, height: 900 }, { width: 1400, height: 600 }, {
      x: 50,
      y: 50,
    });

    expect(window.width).toBeLessThanOrEqual(900);
    expect(window.height).toBeLessThanOrEqual(900);
    expect(window.left + window.width).toBeLessThanOrEqual(900);
    expect(window.top + window.height).toBeLessThanOrEqual(900);
  });

  it("refuses a focal point that is not a percentage pair, and a frame that is not pixels", () => {
    expect(() => cropWindow(landscape, { width: 800, height: 900 }, { x: 120, y: 40 })).toThrow(
      /percentage/,
    );
    expect(() => cropWindow(landscape, { width: 800, height: 900 }, { x: 50, y: -1 })).toThrow(
      /percentage/,
    );
    expect(() =>
      cropWindow({ width: 0, height: 100 }, { width: 800, height: 900 }, DEFAULT_FOCAL),
    ).toThrow(/pixel count/);
  });
});
