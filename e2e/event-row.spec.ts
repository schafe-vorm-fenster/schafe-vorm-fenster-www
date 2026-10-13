import { expect, test, type Page } from "@playwright/test";

/**
 * The event row's meta is never starved by its category — polish brief G-2,
 * and since 2026-10-13 TS-WEB-0017-A43.
 *
 * G-2 moved the category badge off the title's line and onto the meta's. The
 * badge then took the width from the meta: "BILDUNG & GESUNDHEIT" is 234 px,
 * and a 358 px phone row rendered the meta as "An…". The answer was a second
 * form of the category — the brand package's `categoryDisplay.listRow`, a
 * bare 24 px glyph with the label read rather than drawn — switched on by the
 * **viewport** (`md`). That held until the story stage (DEC-0153) put a row
 * into a 439 px panel on a 1280 px screen: the viewport said "badge", the row
 * had no room for one, and "Wolgast · 19 km · 16:00" lost 15 of its 157 px.
 *
 * The form now follows the row's own width (a container query, 30 rem,
 * measured in `event-row.module.css`). What this file asserts is the
 * criterion, not the mechanism: at every width, in every list and in the
 * story stage's panel, the meta is whole; a row of at least 30 rem shows the badge,
 * a narrower one the glyph; and the label is always in the markup.
 *
 * **Deterministic by construction.** The rows come from `/api/*` in the
 * browser (DEC-0163), so the test answers those routes itself: every date
 * carries the longest category label the site has ("Bildung & Gesundheit")
 * and the long meta the threshold was measured with ("Wolgast · 19 km ·
 * 16:00"), and the three story examples carry their own categories. The live
 * public calendar answers differently from run to run, and the old test
 * passed or failed with it.
 */

const ROW = "main article:has(> time)";

/** 30 rem — the container threshold `event-row.module.css` measured. */
const BADGE_MIN_ROW_PX = 480;

const WIDTHS = [360, 390, 428, 640, 768, 1024, 1280, 1920] as const;

const PLACE = {
  communityId: "geoname.2838887",
  name: "Schlatkow",
  slug: "schlatkow",
  lat: 53.92153,
  lng: 13.58116,
  municipality: "Schmatzin",
};

/** `offsetDays` from now at 14:00 UTC — 16:00 in Berlin in summer, 15:00 in winter; the meta reads either. */
function startsAt(offsetDays: number): string {
  const day = new Date(Date.now() + offsetDays * 86_400_000);
  day.setUTCHours(14, 0, 0, 0);
  return day.toISOString();
}

/** Obviously fictitious dates, each with the longest label and the long meta. */
function longest(count: number, prefix: string) {
  return Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${index}`,
    title: `Testtermin ${index + 1} mit einem Titel, der zwei Zeilen braucht`,
    startsAt: startsAt(index + 1),
    placeName: "Wolgast",
    categoryId: "education-health",
    communityId: "geoname.2814270",
    distanceKm: 19,
  }));
}

/** One fictitious date per story, each of the story's own category and topic (DEC-0152). */
const STORY_POOL = [
  { id: "pool-bread", title: "Testtermin Bäckerwagen", categoryId: "everyday-supply" },
  { id: "pool-council", title: "Testtermin Sitzung der Gemeindevertretung", categoryId: "community-life" },
  { id: "pool-culture", title: "Testtermin Konzert im Schloss", categoryId: "culture-tourism" },
].map((event, index) => ({
  ...event,
  startsAt: startsAt(index + 1),
  placeName: "Wolgast",
  communityId: "geoname.2814270",
  distanceKm: 19,
}));

function envelope<T>(data: T) {
  return { data, tier: "live", fetchedAt: new Date().toISOString(), stale: false, demo: false };
}

async function answerLiveRoutes(page: Page): Promise<void> {
  await page.route(/\/api\/places\/[^/]+\/events/, (route) =>
    route.fulfill({
      json: envelope({ place: PLACE, events: longest(3, "place"), publishInvitation: false }),
    }),
  );
  await page.route(/\/api\/places\/[^/]+\/examples/, (route) =>
    route.fulfill({ json: envelope({ place: PLACE, events: STORY_POOL }) }),
  );
  await page.route(/\/api\/nearby/, (route) =>
    route.fulfill({ json: envelope({ events: longest(5, "nearby"), radiusKm: 15, truncated: false }) }),
  );
}

interface RowFacts {
  readonly meta: string;
  readonly metaClipped: boolean;
  readonly rowWidth: number;
  readonly categoryWidth: number;
  readonly categoryLabel: string;
  readonly inStage: boolean;
}

async function readRows(page: Page): Promise<RowFacts[]> {
  return page.$$eval(ROW, (rows) =>
    rows
      .filter((row) => {
        const box = row.getBoundingClientRect();
        // An unpicked story is `visibility: hidden` (DEC-0153 §3) — it is
        // laid out all the same, and its row is measured like any other.
        // The explain module's calendar picture (`StageCalendar`, DEC-0115)
        // is a fixed drawing of the app, three rows in a 192–352 px square.
        // Even the glyph form does not fit "Wolgast · 19 km · 16:00" there
        // (52 + 16 + 157 + 16 + 24 = 265 px); A43 names lists and the story
        // stage, and the picture is an open point of its own.
        if (row.closest('[data-stage="calendar"]')) return false;
        return box.height > 0 && box.width > 0;
      })
      .map((row) => {
        const meta = row.querySelector("p");
        const category = row.querySelector("[data-tone]");
        return {
          meta: (meta?.textContent ?? "").trim(),
          metaClipped: meta ? meta.scrollWidth > meta.clientWidth + 1 : false,
          rowWidth: row.getBoundingClientRect().width,
          categoryWidth: category ? category.getBoundingClientRect().width : 0,
          categoryLabel: (category?.textContent ?? "").trim(),
          inStage: row.closest('[data-block="story-stage"]') !== null,
        };
      }),
  );
}

for (const path of ["/", "/dein-ort?ort=schlatkow"]) {
  for (const width of WIDTHS) {
    test(`TS-WEB-0017-A43: no event row on ${path} loses its meta at ${width} px`, async ({ page }) => {
      await answerLiveRoutes(page);
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await expect(page.locator(ROW).first()).toBeVisible();
      await page.waitForLoadState("networkidle");

      const rows = await readRows(page);
      expect(rows.length, "rows to measure").toBeGreaterThan(0);

      for (const row of rows) {
        const where = `"${row.meta}" in a ${Math.round(row.rowWidth)} px row`;
        // The place, the distance and the time are readable in full.
        expect(row.metaClipped, `meta clipped: ${where}`).toBe(false);
        // The label is in the markup in both forms (SRC-0014 §Event row).
        expect(row.categoryLabel.length, `category label present: ${where}`).toBeGreaterThan(0);
        // The form follows the row, not the viewport.
        if (row.rowWidth >= BADGE_MIN_ROW_PX) {
          expect(row.categoryWidth, `badge for "${row.categoryLabel}": ${where}`).toBeGreaterThan(40);
        } else {
          expect(row.categoryWidth, `glyph for "${row.categoryLabel}": ${where}`).toBeLessThanOrEqual(40);
        }
      }
    });
  }
}

test("TS-WEB-0017-A43: in the story stage's panel at 1280 px the row keeps its whole meta", async ({ page }) => {
  await answerLiveRoutes(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/dein-ort?ort=schlatkow");
  const stageRows = page.locator(`[data-block="story-stage"] article:has(> time)`);
  await expect(stageRows.first()).toBeAttached();
  await page.waitForLoadState("networkidle");

  const rows = (await readRows(page)).filter((row) => row.inStage);
  expect(rows.length, "story examples to measure").toBeGreaterThan(0);
  for (const row of rows) {
    // The panel is narrower than the badge needs (DEC-0153's 7 : 5 split).
    expect(row.rowWidth, "the panel row is the narrow case").toBeLessThan(BADGE_MIN_ROW_PX);
    expect(row.metaClipped, `meta clipped: "${row.meta}"`).toBe(false);
    expect(row.meta, "the meta carries place, distance and time").toMatch(/Wolgast · 19 km · \d\d:\d\d/);
  }
});
