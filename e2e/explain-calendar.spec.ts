import { expect, test, type Page } from "@playwright/test";

/**
 * TS-WEB-0017-A44 — the explain module's calendar picture is at least square
 * and never cuts a row off (owner's decision of 2026-10-13, DEC-0153
 * amendment 3).
 *
 * The picture (`StageCalendar`, the module's third state on `/` and on
 * `/mitmachen`) draws three live event rows with the stacked meta. As a fixed
 * square with `overflow: hidden` it cut the third row: 371 px of rows in a
 * 269 px square at 360 px, 439 px in a 224 px square at 768 px. The square is
 * now a minimum: the picture grows where its rows need it, the module's
 * panes stretch to the tallest one, and the rows' reserve fixes that height
 * before the dates arrive.
 *
 * Deterministic: the test answers the place's dates itself, each with a
 * title longer than the two-line clamp and the long meta ("Wolgast · 19 km ·
 * 16:00"), and holds the answer back until the prerendered geometry has been
 * read, so the reading before and after the rows land can be compared.
 */

const WIDTHS = [360, 390, 428, 640, 768, 800, 900, 1024, 1100, 1200, 1280, 1920] as const;

const TITLE = "Testtermin mit einem sehr langen Titel, der über zwei Zeilen läuft und noch weiter";

async function holdPlaceDates(page: Page): Promise<() => void> {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => (release = resolve));
  await page.route(/\/api\/places\/[^/]+\/events/, async (route) => {
    await gate;
    await route.fulfill({
      json: {
        data: {
          place: { communityId: "geoname.2838887", name: "Schlatkow", slug: "schlatkow", lat: 53.92153, lng: 13.58116 },
          events: [0, 1, 2].map((index) => {
            const day = new Date(Date.now() + (index + 1) * 86_400_000);
            day.setUTCHours(14, 0, 0, 0);
            return {
              id: `calendar-${index}`,
              title: TITLE,
              startsAt: day.toISOString(),
              placeName: "Wolgast",
              categoryId: "education-health",
              communityId: "geoname.2814270",
              distanceKm: 19,
            };
          }),
          publishInvitation: false,
        },
        tier: "live",
        fetchedAt: new Date().toISOString(),
        stale: false,
        demo: false,
      },
    });
  });
  return release;
}

async function readPicture(page: Page) {
  return page.evaluate(() => {
    const picture = document.querySelector('[data-stage="calendar"]')!;
    const explainModule = picture.closest("[data-explain-module]")!;
    const box = picture.getBoundingClientRect();
    return {
      width: box.width,
      height: box.height,
      rowBottoms: [...picture.querySelectorAll("article")].map((row) => row.getBoundingClientRect().bottom - box.top),
      rowTitles: [...picture.querySelectorAll("article h3")].map((title) => (title.textContent ?? "").trim()),
      paneHeights: [...explainModule.querySelectorAll("[data-explain-pane]")].map((pane) => pane.getBoundingClientRect().height),
      graphicHeights: [...explainModule.querySelectorAll("[data-explain-pane]")].map(
        (pane) => pane.firstElementChild!.getBoundingClientRect().height,
      ),
      moduleHeight: explainModule.getBoundingClientRect().height,
      sidewaysScroll: document.documentElement.scrollWidth > window.innerWidth + 1,
    };
  });
}

for (const width of WIDTHS) {
  test(`TS-WEB-0017-A44: the explain module's calendar picture on / is at least square and cuts no row at ${width} px`, async ({
    page,
  }) => {
    const release = await holdPlaceDates(page);
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator('[data-stage="calendar"]')).toBeAttached();
    const before = await readPicture(page);

    release();
    await expect(page.locator('[data-stage="calendar"] article h3').first()).toHaveText(TITLE);
    await page.waitForLoadState("networkidle");
    const after = await readPicture(page);

    // Three rows at every width — no width-dependent count.
    expect(after.rowBottoms, "three rows").toHaveLength(3);
    // At least square, and every row inside the picture.
    expect(after.height, "the picture is at least square").toBeGreaterThanOrEqual(after.width - 0.5);
    for (const [index, bottom] of after.rowBottoms.entries())
      expect(bottom, `row ${index + 1} ends inside the picture`).toBeLessThanOrEqual(after.height + 0.5);
    // The tallest pane sets the height of all three.
    expect(new Set(after.paneHeights.map(Math.round)).size, "the panes share one height").toBe(1);
    // Every graphic fills its pane: no square ends short of the calendar (DEC-0182).
    for (const [index, height] of after.graphicHeights.entries())
      expect(height, `graphic ${index + 1} fills its pane`).toBeCloseTo(after.paneHeights[index] ?? 0, 0);
    // Reserved before paint: nothing moves when the rows land.
    expect(after.height, "the picture's height is reserved").toBeCloseTo(before.height, 0);
    expect(after.moduleHeight, "the module's height is reserved").toBeCloseTo(before.moduleHeight, 0);
    // Growing never widens anything.
    expect(after.sidewaysScroll, "no horizontal scroll").toBe(false);
  });
}
