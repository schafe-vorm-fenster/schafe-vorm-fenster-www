import { expect, test } from "@playwright/test";

/**
 * The event row's meta may never be starved by its category — polish brief
 * G-2, the shared-component pass.
 *
 * G-2 moved the category badge off the title's line and onto the meta's, and
 * the title stopped truncating. The badge then took the width from the meta
 * instead: it sat in an `auto` grid column, and "BILDUNG & GESUNDHEIT" is
 * 244 px of a 358 px row at 390 px wide. After 52 px of date and two 16 px
 * gaps the meta had **30 px** and rendered "An…" — the place and the time,
 * the two facts a visitor scans a list for, gone. Three of the nine rows on
 * `/dein-ort?ort=17390` measured 94 px against the specified 76.
 *
 * Below `md` the row now renders the brand package's own list-row form of a
 * category (`categoryDisplay.listRow`, "bare 24px icon in the category
 * colour") with the label read rather than drawn; from `md` the badge
 * returns. So the assertions below are about **widths and clipping**, never
 * about which category a live row happens to carry — the rows come from the
 * public source and their categories are not this suite's to fix.
 *
 * The label's presence in the markup is a unit contract and lives in
 * `src/components/event-row/event-row.test.tsx`.
 */

const ROW = "article[class*='event-row']";

/** DEC-0067's phone reference, and the narrowest width the brief reviewed. */
const PHONE_WIDTHS = [390, 360] as const;

/** `src/lib/live/mocks/fixtures.ts` — a covered place that always has dates. */
const WITH_DATES = "/dein-ort?ort=schlatkow";

interface RowFacts {
  readonly meta: string;
  readonly metaClipped: boolean;
  readonly categoryWidth: number;
  readonly categoryLabel: string;
}

async function readRows(page: import("@playwright/test").Page): Promise<RowFacts[]> {
  return page.$$eval(ROW, (rows) =>
    rows
      .filter((row) => row.getBoundingClientRect().height > 0)
      .map((row) => {
        const meta = row.querySelector("p");
        const category = row.querySelector("[data-tone]");
        return {
          meta: (meta?.textContent ?? "").trim(),
          metaClipped: meta ? meta.scrollWidth > meta.clientWidth + 1 : false,
          categoryWidth: category ? category.getBoundingClientRect().width : 0,
          categoryLabel: (category?.textContent ?? "").trim(),
        };
      }),
  );
}

for (const width of PHONE_WIDTHS) {
  for (const path of ["/", WITH_DATES]) {
    test(`G-2: no event row on ${path} loses its meta at ${width} px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(path);
      await expect(page.locator(ROW).first()).toBeVisible();

      const rows = await readRows(page);
      expect(rows.length, "rows to measure").toBeGreaterThan(0);

      for (const row of rows) {
        // The place and the time are readable in full.
        expect(row.metaClipped, `meta clipped: "${row.meta}"`).toBe(false);
        // The category costs one glyph, whatever it is called. 40 px leaves
        // room for the 24 px icon and its own box without admitting a pill.
        expect(row.categoryWidth, `category width for "${row.categoryLabel}"`).toBeLessThanOrEqual(
          40,
        );
        // …and it still says what it is, in words, for anyone listening.
        expect(row.categoryLabel.length, "the category label is present").toBeGreaterThan(0);
      }
    });
  }
}

test("G-2: from `md` the category is the badge SRC-0014 §Event row specifies", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(WITH_DATES);
  await expect(page.locator(ROW).first()).toBeVisible();

  const rows = await readRows(page);
  expect(rows.length).toBeGreaterThan(0);
  // The pill is wider than a glyph and the label is drawn — and the meta is
  // still whole, because the desktop row always had the room.
  for (const row of rows) {
    expect(row.categoryWidth, `category width for "${row.categoryLabel}"`).toBeGreaterThan(40);
    expect(row.metaClipped, `meta clipped: "${row.meta}"`).toBe(false);
  }
});
