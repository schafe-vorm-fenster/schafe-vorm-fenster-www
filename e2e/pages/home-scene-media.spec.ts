import { expect, test } from "@playwright/test";

import type { Page } from "@playwright/test";

/**
 * TS-WEB-0019-A20 and A21 — the two scene photographs on `/` after the owner's
 * review of 2026-10-12 (issues #32 and #35, DEC-0162 §5 and §6).
 *
 * A20: the town-hall photograph of the embed scene carries a drawing of the
 * website calendar. The drawing is fully visible on the phone and on the
 * desktop, covers neither the photograph's declared focal point nor runs past
 * the viewport, and the photograph's `alt` names both the photograph and the
 * drawing.
 *
 * A21: the provenance scene's photograph runs edge to edge — "Images inside a
 * colour section run full-bleed" (SRC-0014 §Section grounds) — at 360 to 640 px
 * and on the desktop, with its ratio reserved and no horizontal scroll.
 */

const VIEWPORTS = [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 640, height: 900 },
  { width: 1280, height: 800 },
] as const;

/** The embed photograph's declared focal point (`home-scene-embed`, `focal: {x: 42, y: 50}`). */
const EMBED_FOCAL = { x: 0.42, y: 0.5 };

async function noHorizontalScroll(page: Page): Promise<boolean> {
  return page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
}

for (const viewport of VIEWPORTS) {
  test(`TS-WEB-0019-A20: the web-calendar drawing lies on the town hall without covering it, ${viewport.width} px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const stage = page.locator("#scene-2 [data-web-calendar-overlay]");
    await expect(stage).toHaveCount(1);
    const image = stage.locator("img");
    await expect(image).toHaveCount(1);
    // The alt names the photograph and the drawing.
    await expect(image).toHaveAttribute("alt", /Rathaus/);
    await expect(image).toHaveAttribute("alt", /Webseite/);

    const drawing = stage.locator('[aria-hidden="true"]').first();
    await drawing.scrollIntoViewIfNeeded();
    const box = await drawing.boundingBox();
    const frame = await image.boundingBox();
    expect(box).not.toBeNull();
    expect(frame).not.toBeNull();
    // Fully visible: inside the viewport's width, with the gutter.
    expect(box!.x).toBeGreaterThanOrEqual(15);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width - 15);
    // It overlaps the photograph — it is an overlay, not a figure below it.
    expect(box!.y).toBeLessThan(frame!.y + frame!.height);
    // And it leaves the motif's focal point clear.
    const focal = { x: frame!.x + frame!.width * EMBED_FOCAL.x, y: frame!.y + frame!.height * EMBED_FOCAL.y };
    const coversFocal =
      focal.x >= box!.x && focal.x <= box!.x + box!.width && focal.y >= box!.y && focal.y <= box!.y + box!.height;
    expect(coversFocal).toBe(false);
    expect(await noHorizontalScroll(page)).toBe(true);
  });

  test(`TS-WEB-0019-A21: the provenance scene's photograph runs edge to edge, ${viewport.width} px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const figure = page.locator("#scene-3 figure").first();
    await figure.scrollIntoViewIfNeeded();
    const box = await figure.boundingBox();
    expect(box).not.toBeNull();
    const innerWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(box!.x).toBeLessThanOrEqual(0.5);
    expect(Math.abs(box!.width - innerWidth)).toBeLessThanOrEqual(1);
    // The ratio is reserved on the box (16:9), not taken from the image.
    const ratio = await figure
      .locator("div")
      .first()
      .evaluate((node) => getComputedStyle(node).aspectRatio);
    expect(ratio).toMatch(/16\s*\/\s*9/);
    expect(await noHorizontalScroll(page)).toBe(true);
  });
}
