import { expect, test } from "@playwright/test";

import type { Page } from "@playwright/test";

/**
 * TS-WEB-0019-A20 and A21 — the two scene photographs on `/` after the owner's
 * review of 2026-10-12 (issues #32 and #35, DEC-0162 §5 and §6).
 *
 * A20: the town-hall photograph of the embed scene carries the calendar graphic
 * (issue 145, DEC-0191). The graphic is fully visible on the phone and on the
 * desktop, overlaps the photograph's lower edge, covers neither the
 * photograph's declared focal point nor runs past the viewport; the photograph
 * is a fixed band (240 px phone, 500 px desktop) and its `alt` names the
 * photograph — the graphic has its own label.
 *
 * A24: the graphic's behaviour — the prerender shows "Gemeindeleben", the
 * filter advances every 3.5 s, a click stops it, `prefers-reduced-motion`
 * never starts it.
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

/** The embed photograph's declared focal point (`home-scene-embed`, `focal: {x: 42, y: 30}`). */
const EMBED_FOCAL = { x: 0.42, y: 0.3 };

async function noHorizontalScroll(page: Page): Promise<boolean> {
  return page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
}

for (const viewport of VIEWPORTS) {
  test(`TS-WEB-0019-A20: the calendar graphic lies on the town hall without covering it, ${viewport.width} px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const graphic = page.locator("#scene-2 [data-web-calendar-overlay]");
    await expect(graphic).toHaveCount(1);
    const image = page.locator("#scene-2 figure img");
    await expect(image).toHaveCount(1);
    // The photograph's alt names the town hall; the graphic carries its own label.
    await expect(image).toHaveAttribute("alt", /Rathaus/);
    await expect(graphic).toHaveAttribute("aria-label", /Kalender/);

    await graphic.scrollIntoViewIfNeeded();
    const box = await graphic.boundingBox();
    const frame = await image.boundingBox();
    expect(box).not.toBeNull();
    expect(frame).not.toBeNull();
    // The photograph is a fixed band: 500 px from `lg`, 240 px on the phone.
    expect(Math.round(frame!.height)).toBe(viewport.width >= 768 ? 500 : 240);
    // Fully visible: inside the viewport's width, with the gutter.
    expect(box!.x).toBeGreaterThanOrEqual(15);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width - 15);
    // It overlaps the photograph's lower edge — and reaches below it.
    expect(box!.y).toBeLessThan(frame!.y + frame!.height);
    expect(box!.y + box!.height).toBeGreaterThan(frame!.y + frame!.height);
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

/** The graphic's filter buttons and the title of the first row shown. */
const FILTERS = "#scene-2 [data-web-calendar-overlay] button";
const FIRST_ROW = { de: "Sitzung der Gemeindevertretung", third: "Bäckerauto" } as const;

async function pressed(page: Page): Promise<(string | null)[]> {
  return page.locator(FILTERS).evaluateAll((buttons) => buttons.map((b) => b.getAttribute("aria-pressed")));
}

test.describe("TS-WEB-0019-A24: the calendar graphic's behaviour", () => {
  test("the prerender is Gemeindeleben, with real buttons and a polite list", async ({ browser }) => {
    // No JavaScript: what a crawler gets is the first category.
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("#scene-2 [data-web-calendar-overlay] ul li")).toHaveCount(3);
    await expect(page.locator("#scene-2 [data-web-calendar-overlay] ul")).toContainText(FIRST_ROW.de);
    await expect(page.locator("#scene-2 [data-web-calendar-overlay]")).toHaveAttribute("data-demo", "true");
    expect(await pressed(page)).toEqual(["true", "false", "false", "false"]);
    await expect(page.locator("#scene-2 [data-web-calendar-overlay] ul")).toHaveAttribute("aria-live", "polite");
    for (const name of ["Gemeindeleben", "Bildung & Gesundheit", "Versorgung", "Kultur & Tourismus"]) {
      await expect(page.locator(`${FILTERS}[aria-label="${name}"]`)).toHaveCount(1);
    }
    await context.close();
  });

  test("it advances every 3.5 s and a click stops it", async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto("/");
    await page.locator("#scene-2").scrollIntoViewIfNeeded();
    // Hydrated, the next category shows within a few seconds.
    await expect(page.locator(FILTERS).nth(1)).toHaveAttribute("aria-pressed", "true", { timeout: 15_000 });
    await expect(page.locator("#scene-2 [data-web-calendar-overlay] ul")).toContainText("Erste-Hilfe-Kurs");

    // A click shows that category and stops the advance for good.
    await page.locator(FILTERS).nth(2).click();
    await page.mouse.move(0, 0);
    await expect(page.locator("#scene-2 [data-web-calendar-overlay] ul")).toContainText(FIRST_ROW.third);
    await page.waitForTimeout(4_500);
    expect(await pressed(page)).toEqual(["false", "false", "true", "false"]);
  });

  test.describe("prefers-reduced-motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("nothing advances by itself", async ({ page }) => {
      test.setTimeout(60_000);
      await page.goto("/");
      await page.locator("#scene-2").scrollIntoViewIfNeeded();
      await page.waitForTimeout(5_000);
      expect(await pressed(page)).toEqual(["true", "false", "false", "false"]);
      // A click still works.
      await page.locator(FILTERS).nth(3).click();
      expect(await pressed(page)).toEqual(["false", "false", "false", "true"]);
    });
  });
});
