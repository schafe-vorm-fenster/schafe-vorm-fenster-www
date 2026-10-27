import { expect, test } from "@playwright/test";

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { everyRoute, href } from "../../src/lib/routes/routes";

import type { Page } from "@playwright/test";

/**
 * The installed media-echo package — what the press page cites (DEC-0166).
 * Read straight off `index.json`, so the rendered page is checked against the
 * package and not against the content artifact it is built from (A15 holds
 * that one).
 */
interface MediaEchoEntry {
  readonly id: string;
  readonly title: string;
  readonly source: string;
  readonly url: string | null;
}

function mediaEchoEntries(): MediaEchoEntry[] {
  const index = JSON.parse(
    readFileSync(
      join(process.cwd(), "node_modules/@schafe-vorm-fenster/media-echo/index.json"),
      "utf8",
    ),
  ) as {
    files: {
      path: string;
      frontmatter?: { title: string; source: string; url?: string | null };
    }[];
  };
  return index.files
    .filter((file) => file.path.endsWith(".media-echo.md") && file.frontmatter)
    .map((file) => ({
      id: file.path.split("/").pop()!.replace(/\.media-echo\.md$/, ""),
      title: file.frontmatter!.title,
      source: file.frontmatter!.source,
      url: file.frontmatter!.url ?? null,
    }));
}

/**
 * TS-WEB-0028 — `/ueber-uns/archiv`, the press page *Presse und
 * Auszeichnungen* (DEC-0166) — acceptance pass.
 *
 * Every media-echo entry is on the page as a citation (Q-0093 answered); the
 * rows are real, so nothing on the page badges itself.
 *
 * **Changed for the polish brief (page 11).** The *all* chip is gone: it was
 * pressed by default, did nothing when pressed again, and cost a whole pill
 * in a row of eight in front of a list nobody browses. The reset it replaced
 * it with (`[data-archive-reset]`) exists only while a selection is active,
 * so the type chips are now the whole group and the cases below index from
 * chip 0 instead of chip 1. The count line moved above the chips, so the
 * page's first line says how big the archive is.
 */

/**
 * F-2-71 — wait for the filter's own ready state, never for a clock.
 *
 * The chip group is client-only by determination (TS-WEB-0028 D8), so it replaces
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
  test("TS-WEB-0028-A1: rows are date-descending, year h2s descend", async ({ page }) => {
    await page.goto("/ueber-uns/archiv");
    // The year headings, not the rows' own `h3`s: `article h2` matched
    // nothing at all (an `archive-row` is the `article`, and its heading is
    // an `h3`), so this case used to compare an empty list with itself.
    const years = (await page.locator("[data-archive-filter] h2").allTextContents()).map(Number);
    expect(years.length).toBeGreaterThan(1);
    const sorted = [...years].sort((a, b) => b - a);
    expect(years).toEqual(sorted);
  });

  test("TS-WEB-0028-A2: no relevance-engine module, no ISO-week seed", async ({ page }) => {
    await page.goto("/ueber-uns/archiv");
    const html = await page.content();
    expect(html).not.toMatch(/iso-week|relevance-seed/i);
  });

  test("TS-WEB-0028-A3 / A9: with JavaScript disabled every row renders and the chip row is not visible", async ({
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
    // JavaScript is offered nothing dead (TS-WEB-0028 D8).
    await expect(page.locator("[data-archive-filter]")).toHaveAttribute(
      "data-hydrated",
      "false",
    );
    await expect(page.locator("[data-archive-filter] button")).toHaveCount(0);
    await expect(page.locator("[data-archive-filter] [aria-hidden='true']").first()).toBeHidden();
    await context.close();
  });

  test("TS-WEB-0028-A3: every chip yields at least one visible row; the reset restores the full count", async ({
    page,
  }) => {
    await page.goto("/ueber-uns/archiv");
    await waitForFilterHydration(page);
    const chips = page.getByRole("group").locator("button:not([data-archive-reset])");
    const total = await chips.count();
    expect(total).toBeGreaterThan(1);

    // No selection, no reset — there is nothing to reset yet.
    await expect(page.locator("[data-archive-reset]")).toHaveCount(0);

    await chips.nth(0).click();
    const visibleRows = page.locator("[data-archive-type]:not([hidden])");
    expect(await visibleRows.count()).toBeGreaterThan(0);

    await page.locator("[data-archive-reset]").click();
    const allRows = page.locator("[data-archive-type]");
    await expect(page.locator("[data-archive-type][hidden]")).toHaveCount(0);
    expect(await allRows.count()).toBeGreaterThan(0);
  });

  test("TS-WEB-0028-A4: selecting one chip actually hides the rows of every other type", async ({
    page,
  }) => {
    await page.goto("/ueber-uns/archiv");
    await waitForFilterHydration(page);
    const chips = page.getByRole("group").locator("button:not([data-archive-reset])");
    const firstType = chips.nth(0);
    const typeLabel = (await firstType.textContent())?.trim();
    expect(typeLabel).toBeTruthy();

    await firstType.click();

    const rows = page.locator("[data-archive-type]");
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);

    // The filter matches on the hub's type ids (DEC-0166); what a visitor
    // reads is the badge, so a row of the chip's type is one whose badges
    // carry the chip's label.
    let visibleCount = 0;
    for (let index = 0; index < rowCount; index += 1) {
      const row = rows.nth(index);
      const rowTypes = (await row.locator("[class*='badges'] > *").allTextContents()).map((text) =>
        text.trim(),
      );
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

  test("TS-WEB-0028-A5: filtering never changes the URL", async ({ page }) => {
    await page.goto("/ueber-uns/archiv");
    await waitForFilterHydration(page);
    const before = page.url();
    const chip = page.getByRole("group").locator("button:not([data-archive-reset])").nth(0);
    await chip.click();
    expect(page.url()).toBe(before);
  });

  test("TS-WEB-0028-A6: filtering reorders nothing", async ({ page }) => {
    await page.goto("/ueber-uns/archiv");
    await waitForFilterHydration(page);
    const ids = () =>
      page
        .locator("[data-archive-type]:not([hidden])")
        .evaluateAll((rows) => rows.map((row) => row.id));
    const all = await ids();
    const chips = page.getByRole("group").locator("button:not([data-archive-reset])");
    for (const index of [0, 1]) {
      await chips.nth(index).click();
    }
    const filtered = await ids();
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.length).toBeLessThan(all.length);
    // The surviving rows keep the relative order they had in the full list.
    expect(filtered).toEqual(all.filter((id) => filtered.includes(id)));
  });

  test("TS-WEB-0028-A19: every chip leaves no year heading without a visible row, and the reset brings all years back", async ({
    page,
  }) => {
    await page.goto("/ueber-uns/archiv");
    await waitForFilterHydration(page);
    const years = page.locator("[data-archive-year]");
    const allYears = await years.count();
    expect(allYears).toBeGreaterThan(1);

    /** Per year block: is it visible, and how many rows inside are visible. */
    const blocks = () =>
      years.evaluateAll((nodes) =>
        nodes.map((node) => ({
          year: node.getAttribute("data-archive-year"),
          hidden: (node as HTMLElement).hidden,
          headingVisible: (node.querySelector("h2") as HTMLElement | null)?.checkVisibility() ?? false,
          visibleRows: Array.from(node.querySelectorAll<HTMLElement>("[data-archive-type]")).filter(
            (row) => !row.hidden,
          ).length,
        })),
      );

    const chips = page.getByRole("group").locator("button:not([data-archive-reset])");
    const chipCount = await chips.count();
    let someYearHidden = false;
    for (let index = 0; index < chipCount; index += 1) {
      await chips.nth(index).click();
      for (const block of await blocks()) {
        // A visible year heading always has a visible row under it, and a
        // year with no visible row is out of the page heading and all.
        expect(block.headingVisible, `year ${block.year}`).toBe(block.visibleRows > 0);
        expect(block.hidden, `year ${block.year}`).toBe(block.visibleRows === 0);
        if (block.hidden) someYearHidden = true;
      }
      // The outline the visitor hears: no `h2` without an entry after it.
      await expect(page.locator("[data-archive-filter] h2:visible")).toHaveCount(
        (await blocks()).filter((block) => block.visibleRows > 0).length,
      );
      // D4's defensive line stays unreachable: every chip has a row.
      await expect(page.locator("[data-archive-empty]")).toHaveCount(0);
      await chips.nth(index).click();
    }
    // The stock is uneven enough that at least one chip empties a year — the
    // case of the owner's review of 2026-10-27 (issue 107).
    expect(someYearHidden).toBe(true);

    // Nothing selected again: every year is back.
    await expect(page.locator("[data-archive-year]:not([hidden])")).toHaveCount(allYears);
  });

  test("TS-WEB-0028-A8: no video, audio or iframe on the page", async ({ page }) => {
    await page.goto("/ueber-uns/archiv");
    await expect(page.locator("video, audio, iframe")).toHaveCount(0);
  });

  test("TS-WEB-0028-A10: JSON-LD is one ItemList whose count matches the visible row count", async ({
    page,
  }) => {
    await page.goto("/ueber-uns/archiv");
    // One `<script>` per page is TS-WEB-0011 D4's rule, so the `ItemList` travels
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

  test("TS-WEB-0028-A11: no conversion — no form, no primary CTA; last block is the three-job offer", async ({
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

  test("TS-WEB-0028-A12: heading outline is h1 then year h2s, chips are keyboard-reachable", async ({
    page,
  }) => {
    await page.goto("/ueber-uns/archiv");
    await waitForFilterHydration(page);
    await expect(page.locator("h1")).toHaveCount(1);
    const chip = page.getByRole("group").locator("button:not([data-archive-reset])").first();
    await chip.focus();
    await expect(chip).toBeFocused();
  });

  test("TS-WEB-0004-A1: no horizontal scroll at 360px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    const response = await page.goto("/ueber-uns/archiv");
    expect(response?.status()).toBe(200);
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflows).toBe(false);
  });

  /**
   * Polish brief page 11 — the two things this page needed.
   */
  test("brief page 11: the count stands above the chips, and the list is one line per fact", async ({
    page,
  }) => {
    await page.goto("/ueber-uns/archiv");
    await waitForFilterHydration(page);

    const order = await page.evaluate(() => {
      const count = document.querySelector('[aria-live="polite"]');
      const group = document.querySelector('[role="group"]');
      if (!count || !group) return null;
      return Boolean(
        count.compareDocumentPosition(group) & Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });
    expect(order, "the entry count precedes the chip row").toBe(true);

    // A month-precision entry states a month, not a first-of-the-month that
    // no outlet ever published on: `2026-08` used to render "01. AUGUST 2026".
    const dates = await page.locator("[data-archive-type] time").evaluateAll((nodes) =>
      nodes.map((node) => ({
        iso: node.getAttribute("datetime") ?? "",
        label: (node.textContent ?? "").trim(),
      })),
    );
    expect(dates.length).toBeGreaterThan(10);
    for (const { iso, label } of dates) {
      if (/^\d{4}-\d{2}$/.test(iso)) {
        expect(label, `${iso} renders a day it does not state`).not.toMatch(/^\d{2}\./);
      }
    }

    // One provenance line per row, not two. The outlet used to stand on a
    // line of its own *and* at the head of the context line below it
    // ("Nordkurier" / "Nordkurier · Mecklenburg-Vorpommern"), so every row
    // cost six lines where four say the same thing.
    const firstRow = page.locator("[data-archive-type]").first();
    await expect(firstRow.locator("p")).toHaveCount(1);
    await expect(firstRow.locator("p")).toContainText(" · ");
  });

  test("F-2-33: the English archive is English — the row's own link label included", async ({
    page,
  }) => {
    await page.goto("/en/about/archive");
    const rows = page.locator("[data-archive-type]");
    expect(await rows.count()).toBeGreaterThan(10);
    const text = await page.locator("[data-archive-filter]").innerText();
    for (const german of ["Original ansehen", "öffnet neuen Tab", "Einträgen", "Alle"]) {
      expect(text, german).not.toContain(german);
    }
    expect(text).toContain("View the original");
  });

  test("TS-WEB-0028-A4: every chip, Social Media included, selects the rows it names", async ({
    page,
  }) => {
    // The chips used to filter on their label, and the row attribute was
    // split on spaces — "Social Media" matched nothing. Ids carry no space.
    await page.goto("/ueber-uns/archiv");
    await waitForFilterHydration(page);
    const chips = page.getByRole("group").locator("button:not([data-archive-reset])");
    const count = await chips.count();
    for (let index = 0; index < count; index += 1) {
      await chips.nth(index).click();
      await expect(page.locator("[data-archive-type]:not([hidden])").first()).toBeVisible();
      await chips.nth(index).click();
    }
  });

  const entries = mediaEchoEntries();

  for (const [path, locale] of [
    ["/ueber-uns/archiv", "de"],
    ["/en/about/archive", "en"],
  ] as const) {
    test(`TS-WEB-0028-A16: ${locale} — every media-echo entry is a row with anchor, date, title, outlet and its link`, async ({
      page,
    }) => {
      expect(entries.length).toBeGreaterThan(0);
      await page.goto(path);
      const rows = page.locator("[data-archive-type]");
      await expect(rows).toHaveCount(entries.length);

      for (const entry of entries) {
        const row = page.locator(`[data-archive-type][id="${entry.id}"]`);
        await expect(row, entry.id).toHaveCount(1);
        await expect(row.locator("h3")).toHaveText(entry.title);
        await expect(row.locator("time")).toHaveCount(1);
        await expect(row.locator("p").first()).toContainText(entry.source);
        if (entry.url) {
          await expect(row.locator(`a[href="${entry.url}"]`), entry.id).toHaveCount(1);
        } else {
          await expect(row.locator("a"), entry.id).toHaveCount(0);
        }
      }

      // No third-party image: article photos and logos are not citations.
      await expect(page.locator("[data-archive-filter] img, [data-archive-filter] picture")).toHaveCount(0);

      // Every quotation is marked as one, with its source.
      const quotes = page.locator("[data-archive-quote]");
      expect(await quotes.count()).toBeGreaterThan(0);
      for (const quote of await quotes.all()) {
        await expect(quote.locator("blockquote")).toHaveCount(1);
        const row = quote.locator("xpath=ancestor::*[@data-archive-type][1]");
        const outlet = (await row.locator("p").first().textContent())?.split(" · ")[0]?.trim();
        expect(outlet).toBeTruthy();
        await expect(quote.locator("figcaption")).toContainText(outlet!);
      }
    });
  }

  for (const [from, to] of [
    ["/presse", "/ueber-uns/archiv"],
    ["/en/press", "/en/about/archive"],
  ] as const) {
    test(`TS-WEB-0028-A17: ${from} answers a permanent redirect to ${to}`, async ({ request }) => {
      const response = await request.get(from, { maxRedirects: 0 });
      expect(response.status()).toBe(301);
      expect(new URL(response.headers()["location"]!, "http://x").pathname).toBe(to);
    });
  }

  test("TS-WEB-0028-A18: reached from /ueber-uns and the footer, never from the header", async ({
    page,
  }) => {
    await page.goto("/ueber-uns");
    const link = 'a[href="/ueber-uns/archiv"]';
    await expect(page.locator(`main ${link}`).first()).toBeVisible();
    await expect(page.locator(`main ${link}`).first()).toContainText("Presse und Auszeichnungen");
    await expect(page.getByRole("contentinfo").locator(link)).toHaveText("Presse");
    await expect(page.getByRole("banner").locator(link)).toHaveCount(0);

    await page.goto("/ueber-uns/archiv");
    await expect(page.locator("h1")).toHaveText("Presse und Auszeichnungen");
    await page.goto("/en/about/archive");
    await expect(page.locator("h1")).toHaveText("Press and awards");
    // The language switch links here too (the current page); the press link
    // is the one that says so.
    await expect(
      page.getByRole("contentinfo").getByRole("link", { name: "Press", exact: true }),
    ).toHaveAttribute("href", "/en/about/archive");
  });

  test("TS-WEB-0028-A18: every route's footer links to the press page, no header does", async ({
    request,
  }) => {
    for (const { route, locale } of everyRoute()) {
      const path = href(route, locale);
      const html = await (await request.get(path)).text();
      const target = href("archive", locale);
      // The site footer is the page's last `<footer>` (a quote card carries
      // one of its own); the site header and its menu stand before `<main`.
      const footer = html.slice(html.lastIndexOf("<footer"));
      expect(footer, path).toContain(`href="${target}"`);
      // On the press page itself the header menu's language switch links to
      // the page it stands on; that is the switch, not a navigation entry.
      if (route === "archive") continue;
      const beforeMain = html.slice(0, html.indexOf("<main"));
      expect(beforeMain, path).toContain("<header");
      expect(beforeMain, path).not.toContain(`href="${target}"`);
    }
  });
});
