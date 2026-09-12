import { expect, test } from "@playwright/test";

/**
 * F-3-12 — an impatient second click must not empty the postcode.
 *
 * `search-field` is a plain GET form, which is what makes it work without
 * JavaScript. It also means two clicks on "Suchen" are two submissions, and
 * the second one is issued while the first navigation is already under way:
 * the chaos hasty-clicker persona measured the result as
 * `/dein-ort?ort=` — the parameter present and **empty**, the typed value
 * gone (C3-H-2). 100 % on the 404 page's recovery widget, reproduced on `/`
 * and `/dein-ort` too. A single clean click on the same widget preserves the
 * value, so it is a double-submit race rather than a general defect.
 *
 * The gesture is reproduced the way it actually happens — two real clicks
 * with nothing awaited between them.
 *
 * Recorded honestly: this file did **not** reproduce the finding against
 * `next dev`, in any of four gestures tried (two synchronous `click()`s in one
 * task, `dblclick`, two Playwright clicks with and without a beat between
 * them). The finding was measured on the production build and on the preview,
 * where `/dein-ort` is a dynamic route and the window between the two
 * submissions is wider. So this is a regression net that is green both before
 * and after the fix locally, and the fix itself is the guard the finding asks
 * for rather than something this file proved red.
 */

const CASES = [
  { path: "/dies-gibt-es-nicht-xyz", id: "ort-suche-404", expected: "/dein-ort" },
  { path: "/", id: "ort-suche-fokus", expected: "/dein-ort" },
  { path: "/dein-ort", id: "ort-suche-fokus", expected: "/dein-ort" },
  { path: "/dein-kalender/bestellen", id: "ort-suche", expected: undefined },
] as const;

for (const { path, id, expected } of CASES) {
  test(`F-3-12: a double click on ${path} keeps the typed postcode`, async ({ page }) => {
    await page.goto(path);
    await page.locator(`#${id}`).fill("10115");

    const submit = page.locator(`#${id}`).locator("xpath=ancestor::form").locator(
      'button[type="submit"]',
    );
    await Promise.all([
      submit.click({ noWaitAfter: true }).catch(() => {}),
      submit.click({ noWaitAfter: true }).catch(() => {}),
    ]);

    await page.waitForURL(/[?&]ort=/);
    const url = new URL(page.url());
    expect(url.searchParams.get("ort"), `?ort= after a double click on ${path}`).toBe(
      "10115",
    );
    if (expected !== undefined) expect(url.pathname).toBe(expected);
  });
}
