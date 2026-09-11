import { expect, test } from "@playwright/test";

import { everyRoute, href } from "../src/lib/routes/routes";
import { d1Inventory } from "../src/lib/routes/url-inventory";

/**
 * The route walk — the browser half of TS-004-A1, against the **served**
 * site.
 *
 * F-2-55: this file used to walk `everyRoute()`, the page registry. The
 * registry cannot be missing a row it defines, so `/start` and `/llms.txt`
 * were absent from the site while this suite was green. It now walks
 * `d1Inventory()` — TS-004 D1's table — and every row is requested over
 * HTTP, with the status D1 gives it.
 *
 * `<html lang>`, the hreflang set and the URL tables are integration tests in
 * Vitest (`src/lib/routes/routing.integration.test.ts`); what needs a real
 * browser is that every public URL actually renders and that no page scrolls
 * sideways on a phone (TS-017-A9, the 360 px reference viewport of DEC-067).
 */

const ROUTES = everyRoute().map(({ route, locale }) => ({
  path: href(route, locale),
  locale,
  route,
}));

const NON_PAGE_ROWS = d1Inventory().filter((row) => row.kind !== "page");

test("TS-004-A1: the inventory has both languages of every page", () => {
  expect(ROUTES).toHaveLength(24);
});

test("TS-004-A1: D1 has four rows that are not pages, and they are walked too", () => {
  expect(NON_PAGE_ROWS.map((row) => row.path)).toEqual([
    "/sitemap.xml",
    "/robots.txt",
    "/llms.txt",
    "/start",
  ]);
});

for (const row of NON_PAGE_ROWS.filter((candidate) => candidate.kind === "machine")) {
  test(`TS-004-A5: ${row.path} answers 200 as a machine surface`, async ({ request }) => {
    const response = await request.get(row.path);
    expect(response.status(), `status of ${row.path}`).toBe(200);
    expect((await response.text()).length).toBeGreaterThan(0);
  });
}

test("TS-004-A5: /llms.txt lists this domain's D1 pages, and only this domain", async ({
  request,
  baseURL,
}) => {
  const body = await (await request.get("/llms.txt")).text();
  expect(body.startsWith("# ")).toBe(true);
  // The origin the body names is the site's own canonical host, never
  // another domain of the matrix.
  expect(body).toContain("/mitmachen");
  expect(body).toContain("/en/take-part");
  expect(body).not.toContain("owcezaoknem.pl");
  expect(body).not.toContain("sheepoutside.com");
  expect(baseURL).toBeTruthy();
});

test("TS-004-A1/TS-016 D6: /start redirects to the lead form and is noindex", async ({
  request,
}) => {
  const response = await request.get("/start", { maxRedirects: 0 });
  expect(response.status()).toBe(302);
  const location = response.headers()["location"] ?? "";
  expect(location.startsWith("https://")).toBe(true);
  // D1: the row carries `noindex`.
  expect(response.headers()["x-robots-tag"]).toContain("noindex");
});

test("TS-004-A5: /start is absent from the sitemap", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("<loc>https://www.schafe-vorm-fenster.de/start</loc>");
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
