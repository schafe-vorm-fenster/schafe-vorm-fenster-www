import { expect, test } from "@playwright/test";

import { everyRoute, href } from "../src/lib/routes/routes";

/**
 * TS-WEB-0017-A33 — no rendered page links to the retired app host (DEC-0177).
 *
 * `app.schafe-vorm-fenster.de` has no DNS record. The owner's answer of
 * 2026-10-28: until the app has a domain of its own, every link "to the app"
 * is `APP_URL` (`src/lib/live/app-handover.ts`), the Schlatkow village
 * calendar. `pnpm check:api-routes` (A11) keeps the hostname out of the
 * source; this sweep reads what the browser actually got, after hydration and
 * after the live modules answered, so a link assembled from data or from an
 * environment value is caught as well.
 *
 * Every route of the TS-WEB-0004 D1 inventory, both languages, plus `/dein-ort`
 * with a chosen place (the page that renders the most calendar links). Every
 * attribute that can send the browser somewhere is read: `a[href]`,
 * `area[href]`, `form[action]`, `iframe[src]`, `link[href]`.
 */

const RETIRED_APP_HOST = "app.schafe-vorm-fenster.de";

const ROUTES = [
  ...everyRoute().map(({ route, locale }) => ({ path: href(route, locale), name: `${route} (${locale})` })),
  { path: `${href("place", "de")}?ort=schlatkow`, name: "place (de) with a chosen place" },
];

for (const route of ROUTES) {
  test(`TS-WEB-0017-A33: ${route.name} links nowhere on the retired app host`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route.path);
    await page.waitForLoadState("networkidle");

    const targets = await page.evaluate(() =>
      [
        ...[...document.querySelectorAll("a[href], area[href], link[href]")].map((el) => el.getAttribute("href") ?? ""),
        ...[...document.querySelectorAll("form[action]")].map((el) => el.getAttribute("action") ?? ""),
        ...[...document.querySelectorAll("iframe[src]")].map((el) => el.getAttribute("src") ?? ""),
      ].filter((value) => value !== ""),
    );
    expect(targets.length, `${route.path}: nothing measured`).toBeGreaterThan(0);
    const offenders = targets.filter((value) => value.includes(RETIRED_APP_HOST));
    expect(offenders, `${route.path} links the retired app host (DEC-0177)`).toEqual([]);
  });
}
