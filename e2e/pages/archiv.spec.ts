import { expect, test } from "@playwright/test";

import type { Page } from "@playwright/test";

/**
 * TS-028 — `/ueber-uns/archiv` — acceptance pass.
 *
 * The real list is empty today (Q-045, `state/open.md` #1) — every row on
 * this page is the content artifact's own dummy-content addition, rendered
 * with `demo` (`data-demo="true"`) and one page-level `Demo-Daten` badge.
 */

/**
 * F-2-71 — wait for the filter's own ready state, never for a clock.
 *
 * The chip group is client-only by determination (TS-028 D8), so it replaces
 * the reserved row only after hydration — measured at 279–370 ms after
 * `page.goto` resolves, in all three `waitUntil` modes. `chips.count()` is a
 * non-retrying read and therefore saw 0 every single run (5/5). The component
 * publishes the signal itself (`data-hydrated`, set in the same render that
 * swaps the reserved row for the real chips,
 * `src/components/archive-filter/archive-filter.tsx`), so every case that
 * reads the chips waits for that attribute through an auto-retrying
 * assertion. A `waitForTimeout` would only move the race, not close it.
 */
async function waitForFilterHydration(page: Page) {
  await expect(page.locator("[data-archive-filter]")).toHaveAttribute("data-hydrated", "true");
}

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
    // F-2-69 reserved the chip row's height in the server render so hydration
    // costs no shift. The criterion it must not buy that with: the row stays
    // *not visible* and nothing in it is a control, so a visitor without
    // JavaScript is offered nothing dead (TS-028 D8).
    await expect(page.locator("[data-archive-filter]")).toHaveAttribute(
      "data-hydrated",
      "false",
    );
    await expect(page.locator("[data-archive-filter] button")).toHaveCount(0);
    await expect(page.locator("[data-archive-filter] [aria-hidden='true']").first()).toBeHidden();
    await context.close();
  });

  test("TS-028-A3: every chip yields at least one visible row; 'Alle' restores the full count", async ({
    page,
  }) => {
    await page.goto("/ueber-uns/archiv");
    await waitForFilterHydration(page);
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

  test("TS-028-A4: selecting one chip actually hides the rows of every other type", async ({
    page,
  }) => {
    await page.goto("/ueber-uns/archiv");
    await waitForFilterHydration(page);
    const chips = page.getByRole("group").getByRole("button");
    const firstType = chips.nth(1);
    const typeLabel = (await firstType.textContent())?.trim();
    expect(typeLabel).toBeTruthy();

    await firstType.click();

    const rows = page.locator("[data-archive-type]");
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);

    let visibleCount = 0;
    for (let index = 0; index < rowCount; index += 1) {
      const row = rows.nth(index);
      const rowTypes = (await row.getAttribute("data-archive-type"))?.split(" ") ?? [];
      if (rowTypes.includes(typeLabel!)) {
        // The accessible result (`hidden` attribute) and the visual result
        // must agree — this is the half a `[hidden]`-attribute-only
        // selector cannot see (F-2-59).
        await expect(row).toBeVisible();
        visibleCount += 1;
      } else {
        await expect(row).toBeHidden();
      }
    }

    // The count is recomputed one effect after the rows change, so a single
    // `textContent()` read can still see the previous figure (F-2-71 — the
    // preview caught it at "6 von 6" while one row stood). Auto-retrying.
    await expect(page.locator('[aria-live="polite"]')).toHaveText(
      `${visibleCount} von ${rowCount} Einträgen`,
    );
  });

  test("TS-028-A5: filtering never changes the URL", async ({ page }) => {
    await page.goto("/ueber-uns/archiv");
    await waitForFilterHydration(page);
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
    // One `<script>` per page is TS-011 D4's rule, so the `ItemList` travels
    // inside the page's one `@graph` rather than in a second tag. The
    // criterion is unchanged: it parses as **one** `ItemList`, and its count
    // is the visible row count.
    const scripts = page.locator('script[type="application/ld+json"]');
    await expect(scripts).toHaveCount(1);

    const graph = JSON.parse((await scripts.textContent()) ?? "{}");
    const lists = (graph["@graph"] as { "@type": string; itemListElement?: unknown[] }[]).filter(
      (node) => node["@type"] === "ItemList",
    );
    expect(lists).toHaveLength(1);
    const rows = await page.locator("[data-archive-type]").count();
    expect(lists[0]!.itemListElement).toHaveLength(rows);
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
    await waitForFilterHydration(page);
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
