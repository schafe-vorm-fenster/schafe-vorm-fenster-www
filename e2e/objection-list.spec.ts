import { expect, test } from "@playwright/test";

import type { Page } from "@playwright/test";

/**
 * SRC-0014 §Archive block, rendered — the browser facts behind the
 * `objection-list` rewrite (DEC-0117), measured on `/mitmachen`, the one page
 * that composes the block (TS-WEB-0022 D3). The page-level criteria stay in
 * `e2e/pages/mitmachen.spec.ts` (A6, A16); this file holds what only a
 * rendered page can show: the ground, the ink, the glyphs, the weight.
 *
 * No colour is written here (TS-WEB-0017 D3): every expected value is the
 * token itself, resolved by the browser from the loaded stylesheet.
 *
 * CHANGED (T-12, DEC-0124) — selectors only, no assertion: the objection
 * block's two halves are two sections on `/mitmachen` now, because together
 * they measured 1627 px at 390 px and G-4 caps a section at 1270
 * (`e2e/section-budget.spec.ts`). The archive half is `data-block="archiv"`;
 * the archive block itself is unchanged and is still the only
 * `[data-archive-block="own"]` on the page.
 */

/** The computed colour a token resolves to in the running document. */
async function tokenColour(page: Page, token: string): Promise<string> {
  return page.evaluate((name) => {
    const probe = document.createElement("span");
    probe.style.color = `var(${name})`;
    document.body.append(probe);
    const colour = getComputedStyle(probe).color;
    probe.remove();
    return colour;
  }, token);
}

test.describe("DEC-0117: the objection block's lower half is an archive block", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/mitmachen");
  });

  test("stands on the archive ground, edge to edge on the phone, with archive ink and archive hairlines", async ({
    page,
  }) => {
    const [ground, ink, line] = await Promise.all([
      tokenColour(page, "--color-archive-ground"),
      tokenColour(page, "--color-archive-ink"),
      tokenColour(page, "--color-archive-line"),
    ]);
    expect(new Set([ground, ink, line]).size).toBe(3);

    const archive = page.locator('[data-archive-block="own"]');
    await expect(archive).toHaveCount(1);
    await expect(archive).toHaveCSS("background-color", ground);

    const box = await archive.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.x).toBe(0);
      expect(box.width).toBe(360);
    }

    const rows = archive.locator("li");
    await expect(rows).toHaveCount(3);
    await expect(rows.nth(0).locator("p").first()).toHaveCSS("color", ink);
    await expect(rows.nth(1)).toHaveCSS("border-top-color", line);
    await expect(rows.nth(0).locator("svg")).toHaveCSS("color", ink);
  });

  test("carries the channel's neutral glyph at 24 px — never circle-x, never the error colour", async ({
    page,
  }) => {
    const block = page.locator('[data-block="archiv"]');
    await expect(block.locator("svg.lucide-circle-x")).toHaveCount(0);
    const glyphs = block.locator("[data-archive-block] li svg");
    await expect(glyphs).toHaveCount(3);
    for (const name of ["megaphone", "clock", "users"]) {
      await expect(block.locator(`[data-archive-block] svg.lucide-${name}`)).toHaveCount(1);
    }
    await expect(glyphs.first()).toHaveAttribute("width", "24");

    const error = await tokenColour(page, "--color-status-error");
    const errorColoured = await block.evaluate(
      (root, colour) =>
        [...root.querySelectorAll<HTMLElement>("*")].filter(
          (element) => getComputedStyle(element).color === colour,
        ).length,
      error,
    );
    expect(errorColoured).toBe(0);
  });

  test("sets the closing sentence larger than the rows", async ({ page }) => {
    const archive = page.locator('[data-archive-block="own"]');
    const core = archive.locator("li p").first();
    const closing = archive.locator("ul + p");
    await expect(closing).toHaveCount(1);
    const [coreSize, closingSize] = await Promise.all([
      core.evaluate((element) => parseFloat(getComputedStyle(element).fontSize)),
      closing.evaluate((element) => parseFloat(getComputedStyle(element).fontSize)),
    ]);
    expect(closingSize).toBeGreaterThan(coreSize);
  });
});
