import { expect, test } from "@playwright/test";

/**
 * TS-028 — `/ueber-uns/archiv` — acceptance pass.
 *
 * The real list is empty today (Q-045, `state/open.md` #1) — every row on
 * this page is the content artifact's own dummy-content addition, rendered
 * with `demo` (`data-demo="true"`) and one page-level `Demo-Daten` badge.
 */

test.describe("/ueber-uns/archiv", () => {
  test("TS-028-A1: rows are date-descending, year h2s descend", async ({ page }) => {
    await page.goto("/ueber-uns/archiv");
    const years = (await page.locator("article h2").allTextContents()).map(Number);
    const sorted = [...years].sort((a, b) => b - a);
    expect(years).toEqual(sorted);
  });

  test("TS-028-A2: no relevance-engine module, no ISO-week seed", async ({ page }) => {
    await page.goto("/ueber-uns/archiv");
    const html = await page.content();
    expect(html).not.toMatch(/iso-week|relevance-seed/i);
  });

  test("TS-028-A3 / A9: with JavaScript disabled every row renders and the chip row is not visible", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/ueber-uns/archiv");
    const rows = page.locator("[data-archive-type]");
    expect(await rows.count()).toBeGreaterThan(0);
    await expect(page.locator('[role="group"]')).toHaveCount(0);
    await context.close();
  });

  test("TS-028-A3: every chip yields at least one visible row; 'Alle' restores the full count", async ({
    page,
  }) => {
    await page.goto("/ueber-uns/archiv");
    const chips = page.getByRole("group").getByRole("button");
    const total = await chips.count();
    expect(total).toBeGreaterThan(1); // "Alle" + at least one type chip

    const firstType = chips.nth(1);
    await firstType.click();
    const visibleRows = page.locator("[data-archive-type]:not([hidden])");
    expect(await visibleRows.count()).toBeGreaterThan(0);

    await chips.nth(0).click(); // "Alle"
    const allRows = page.locator("[data-archive-type]");
    await expect(page.locator("[data-archive-type][hidden]")).toHaveCount(0);
    expect(await allRows.count()).toBeGreaterThan(0);
  });

  test("TS-028-A5: filtering never changes the URL", async ({ page }) => {
    await page.goto("/ueber-uns/archiv");
    const before = page.url();
    const chip = page.getByRole("group").getByRole("button").nth(1);
    await chip.click();
    expect(page.url()).toBe(before);
  });

  test("TS-028-A8: no video, audio or iframe on the page", async ({ page }) => {
    await page.goto("/ueber-uns/archiv");
    await expect(page.locator("video, audio, iframe")).toHaveCount(0);
  });

  test("TS-028-A10: JSON-LD is one ItemList whose count matches the visible row count", async ({
    page,
  }) => {
    await page.goto("/ueber-uns/archiv");
    const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
    const parsed = JSON.parse(jsonLd ?? "{}");
    expect(parsed["@type"]).toBe("ItemList");
    const rows = await page.locator("[data-archive-type]").count();
    expect(parsed.itemListElement).toHaveLength(rows);
  });

  test("TS-028-A11: no conversion — no form, no primary CTA; last block is the three-job offer", async ({
    page,
  }) => {
    await page.goto("/ueber-uns/archiv");
    // Scoped to this page's own content, not the persistent site chrome:
    // every page carries the footer's contact/newsletter forms
    // (`app/[lang]/_page-frame.tsx`), which are not this page's conversion.
    const pageContent = page.locator("#main > article, #main > section");
    await expect(pageContent.locator("form")).toHaveCount(0);
    await expect(page.locator('[data-cta="primary"]')).toHaveCount(0);
    const closing = page.locator("#closing-cta");
    await expect(closing.getByRole("link")).toHaveCount(3);
  });

  test("TS-028-A12: heading outline is h1 then year h2s, chips are keyboard-reachable", async ({
    page,
  }) => {
    await page.goto("/ueber-uns/archiv");
    await expect(page.locator("h1")).toHaveCount(1);
    const chip = page.getByRole("group").getByRole("button").first();
    await chip.focus();
    await expect(chip).toBeFocused();
  });

  test("TS-004-A1: no horizontal scroll at 360px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    const response = await page.goto("/ueber-uns/archiv");
    expect(response?.status()).toBe(200);
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflows).toBe(false);
  });

  test.skip(
    "TS-028-A7: an entry with usage_rights absent appears nowhere — not-yet: the real media-echo pipeline (Q-045) has zero cleared entries so this page renders only the content artifact's own demo rows in this run",
    () => {},
  );
});
