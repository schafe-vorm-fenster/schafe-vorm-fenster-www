import { expect, test } from "@playwright/test";

import { everyRoute, href } from "../src/lib/routes/routes";

/**
 * The route walk — the browser half of TS-004-A1.
 *
 * Status codes, redirects, `<html lang>` and the hreflang set are integration
 * tests in Vitest (`src/lib/routes/routing.integration.test.ts`); what needs a
 * real browser is that every public URL of the inventory actually renders and
 * that no page scrolls sideways on a phone (TS-017-A9, the 360 px reference
 * viewport of DEC-067).
 */

const ROUTES = everyRoute().map(({ route, locale }) => ({
  path: href(route, locale),
  locale,
  route,
}));

test("TS-004-A1: the inventory has both languages of every page", () => {
  expect(ROUTES).toHaveLength(24);
});

for (const { path, locale, route } of ROUTES) {
  test(`TS-004-A1: ${path} (${route}/${locale}) renders and stays within the viewport`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    const response = await page.goto(path);

    expect(response?.status(), `status of ${path}`).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();

    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflows, `horizontal scroll at 360px on ${path}`).toBe(false);
  });
}

/**
 * TS-004-A4 / TS-001-A3. The 404 body speaks the TLD default on every URL:
 * `app/global-not-found.tsx` is the only 404 surface Next.js 16.3 renders,
 * and it sits above the language segment. The limitation is recorded in
 * `state/open.md`; the status and the `noindex` are right on every path.
 */
for (const path of ["/gibt-es-nicht", "/en/does-not-exist", "/uk/mitmachen"]) {
  test(`TS-004-A4: ${path} answers a rendered 404`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Seite nicht gefunden",
    );
    // Next.js emits its own `noindex` for a 404 response; the page adds the
    // `follow` half of DEC-032. Assert the page's tag is present rather than
    // that it is the only one.
    await expect(
      page.locator('meta[name="robots"][content="noindex, follow"]'),
    ).toHaveCount(1);
  });
}

test("TS-001-A3: the redundant /de prefix redirects to the bare path", async ({
  page,
}) => {
  const response = await page.goto("/de/mitmachen");
  expect(response?.status()).toBe(200);
  expect(new URL(page.url()).pathname).toBe("/mitmachen");
});
