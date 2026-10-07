import { expect, test, type Page } from "@playwright/test";

/**
 * The layout grid as the browser lays it out — SRC-0014 §Layout Grid, DEC-0150.
 *
 * Round 4's F-4-1 measured the defect this answers: at 1280 × 800 the hero
 * `h1` spanned 1214px and the search field 1091px, because the hero's text
 * stack stood outside the page container. Every assertion here is a width or
 * an edge read off `getBoundingClientRect()`, at the desktop tier, against
 * values the guide writes down — nothing is compared against a screenshot.
 *
 *  TS-WEB-0017-A23  header logo, hero `h1` and the first section's content
 *                   share one left edge; the content box is 1200px once the
 *                   viewport allows it, and the margin is at least 48px.
 *  TS-WEB-0017-A24  the hero `h1` is no wider than 7 of 12 columns, the hero
 *                   search no wider than 6.
 *  TS-WEB-0017-A25  the hero is `min(80vh, 680px)` tall on `/` and
 *                   `min(70vh, 560px)` elsewhere, unless its copy needs more.
 *  TS-WEB-0017-A27  on `/` the live dates stand head 1–4, list 5–12.
 *
 * A26 (the CTA row) lives in `e2e/photo-surface.spec.ts`, beside the
 * below-`xl` stacking it replaces.
 */

const HERO_PAGES = ["/", "/dein-kalender", "/mitmachen", "/deine-region", "/ueber-uns", "/dein-ort"];
const DESKTOP = [
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];
const GAP = 24;
const MARGIN_MIN = 48;
const MEASURE_PAGE = 1200;

/** N of 12 columns of a content box `content` px wide. */
const span = (content: number, n: number) => ((content - 11 * GAP) / 12) * n + (n - 1) * GAP;

async function readGrid(page: Page) {
  return page.evaluate(() => {
    const box = (element: Element | null) => element?.getBoundingClientRect() ?? null;
    const hero = document.querySelector('[data-hero="true"]');
    const stack = hero?.querySelector(".container") ?? null;
    const stackStyle = stack ? getComputedStyle(stack) : null;
    const section = [...document.querySelectorAll("main .container")].find(
      (element) => !element.closest('[data-hero="true"]'),
    );
    const sectionStyle = section ? getComputedStyle(section) : null;
    const searchInput = hero?.querySelector("input") ?? null;
    return {
      logo: box(document.querySelector("header a"))?.left ?? null,
      h1: box(hero?.querySelector("h1") ?? document.querySelector("h1")),
      search: searchInput ? box(searchInput.closest("form") ?? searchInput.parentElement) : null,
      stackLeft: stack ? box(stack)!.left + parseFloat(stackStyle!.paddingLeft) : null,
      sectionLeft: section ? box(section)!.left + parseFloat(sectionStyle!.paddingLeft) : null,
      content: section
        ? box(section)!.width - parseFloat(sectionStyle!.paddingLeft) - parseFloat(sectionStyle!.paddingRight)
        : null,
      heroHeight: box(hero)?.height ?? null,
      heroSize: hero?.getAttribute("data-hero-size") ?? null,
    };
  });
}

for (const path of HERO_PAGES) {
  for (const viewport of DESKTOP) {
    test(`TS-WEB-0017-A23 / TS-WEB-0017-A24 / TS-WEB-0017-A25: the desktop grid holds on ${path} at ${viewport.width}×${viewport.height}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      const grid = await readGrid(page);

      // A23 — one left edge, and the content box.
      expect(grid.content, `${path}: a section container`).not.toBeNull();
      const expected = Math.min(MEASURE_PAGE, viewport.width - 2 * MARGIN_MIN);
      expect(grid.content!, "content box").toBeCloseTo(expected, 0);
      expect(grid.sectionLeft!, "margin at least 48px").toBeGreaterThanOrEqual(MARGIN_MIN - 0.5);
      expect(grid.logo!, "header logo on the section's left edge").toBeCloseTo(grid.sectionLeft!, 0);
      expect(grid.stackLeft!, "hero text stack on the same edge").toBeCloseTo(grid.sectionLeft!, 0);
      expect(grid.h1!.left, "hero h1 on the same edge").toBeCloseTo(grid.sectionLeft!, 0);

      // A24 — the spans.
      expect(grid.h1!.width, "hero h1 at most 7 columns").toBeLessThanOrEqual(span(grid.content!, 7) + 1);
      if (grid.search)
        expect(grid.search.width, "hero search at most 6 columns").toBeLessThanOrEqual(
          span(grid.content!, 6) + 1,
        );

      // A25 — the capped hero height; a stack taller than the box may grow it.
      const cap =
        grid.heroSize === "home"
          ? Math.min(0.8 * viewport.height, 680)
          : Math.min(0.7 * viewport.height, 560);
      expect(grid.heroHeight!, "hero at least its capped height").toBeGreaterThanOrEqual(cap - 1);
      if (viewport.width >= 1280)
        expect(grid.heroHeight!, "hero no taller than its cap").toBeLessThanOrEqual(cap + 1);
    });
  }
}

test("TS-WEB-0017-A27: on / the live dates stand head 1–4, list 5–12 at 1440×900", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const section = page.locator("#place-dates");
  await expect(section).toBeAttached();
  const heading = section.locator("header").first();
  const body = section.locator("header + div").first();
  await expect(body).toBeVisible();
  const [head, list, grid] = await Promise.all([heading.boundingBox(), body.boundingBox(), readGrid(page)]);
  const contentLeft = grid.sectionLeft!;
  expect(head!.x, "head in column 1").toBeCloseTo(contentLeft, 0);
  expect(head!.width, "head at most 4 columns").toBeLessThanOrEqual(span(1200, 4) + 1);
  expect(list!.x, "list starts at column 5").toBeCloseTo(contentLeft + span(1200, 4) + GAP, 0);
  expect(list!.width, "list spans columns 5–12").toBeCloseTo(span(1200, 8), 0);
});
