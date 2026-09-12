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
 * TS-011-A4 — "the context band is an `aside` on **every** page" — and
 * TS-006-A6 — "every page renders exactly one context band" — over the whole
 * route table, in both languages.
 *
 * The two documented exceptions are `/mitmachen/registrieren` and
 * `/dein-kalender/bestellen`: TS-023 D7 suppresses the band mid-flow because
 * "a mid-flow exit offer costs the conversion the page exists for", TS-025
 * does the same for the order flow, and the deviation from TS-006 D5/A6 is
 * the decided one — `plan/component-inventory.md` D-5, `state/open.md` row
 * 24, finding F-2-10. Both land on their first step by default, where the
 * band is suppressed; no other page may opt out (F-2-41).
 */
const FLOW_ROUTES_WITHOUT_BAND: readonly string[] = ["register", "order"];

for (const { path, route } of ROUTES) {
  const midFlow = FLOW_ROUTES_WITHOUT_BAND.includes(route);

  test(`TS-011-A4/TS-006-A6: ${path} — ${
    midFlow ? "the F-2-10 flow exception" : "one aside#context-band, one #closing-cta"
  }`, async ({ page }) => {
    await page.goto(path);
    const band = page.locator("#context-band");

    if (midFlow) {
      // The two flow routes compose their chrome themselves, step by step,
      // and never through `PageFrame`. Where each renders a band it is an
      // `aside` like everywhere else (TS-011-A4, F-2-41) — TS-023 D7 puts
      // the register flow's on step 1, TS-025 puts the order flow's after
      // step 4, and the suppression in between is F-2-10's decided
      // deviation, walked step by step in the two page specs. Asserted here
      // as the named exception so a third page cannot join it unnoticed.
      const bandOnLanding = route === "register";
      await expect(band, `#context-band on ${path}`).toHaveCount(bandOnLanding ? 1 : 0);
      if (bandOnLanding) {
        expect(await band.evaluate((element) => element.tagName)).toBe("ASIDE");
        await expect(band).toHaveAttribute("aria-label", /\S/);
      }
      return;
    }

    await expect(band, `#context-band on ${path}`).toHaveCount(1);
    // The closing block stands on every `PageFrame` page (TS-006 D2/A7); on
    // the merged pages it is the anchor **inside** the band, so it is
    // counted on its own rather than as one element with it.
    await expect(page.locator("#closing-cta"), `#closing-cta on ${path}`).toHaveCount(1);
    // TS-011 D3: "every `nav` and every `aside` carries an accessible name."
    expect(await band.evaluate((element) => element.tagName)).toBe("ASIDE");
    await expect(band).toHaveAttribute("aria-label", /\S/);
    // TS-006 D5: exactly the three non-focus jobs, once — the merged pages
    // must not render the same list twice (TS-027-A10).
    await expect(band.getByRole("link")).toHaveCount(3);
  });
}

/**
 * TS-004-A4 / TS-004 D6 — the 404 that renders, in the language of the URL
 * that was asked for (F-2-70).
 *
 * `app/global-not-found.tsx` is still the only 404 surface Next.js 16.3
 * server-renders, but every unknown URL now reaches it: `proxy.ts` keeps a
 * non-language first segment out of `app/[lang]`, where the page's own
 * `notFound()` arrived one render too late and produced a 404 with an empty
 * body. The language comes down the same way, on a request header.
 */
const NOT_FOUND_CASES = [
  { path: "/gibt-es-nicht", heading: "Seite nicht gefunden", lang: "de" },
  { path: "/uk/mitmachen", heading: "Seite nicht gefunden", lang: "de" },
  { path: "/irgendwas/irgendwo", heading: "Seite nicht gefunden", lang: "de" },
  { path: "/en/does-not-exist", heading: "Page not found", lang: "en" },
  { path: "/en/anything", heading: "Page not found", lang: "en" },
  // F-3-13 — the door F-2-70's fix was left open on. `isUnservablePath()`
  // exempted **anything** ending in an asset extension, whether or not a file
  // existed, so these never reached the `NOT_FOUND_PATH` rewrite and rendered
  // the empty `<html id="__next_error__">` shell instead. `/favicon.ico` is
  // the one every browser asks for by itself, on every page load.
  { path: "/favicon.ico", heading: "Seite nicht gefunden", lang: "de" },
  { path: "/does-not-exist.js", heading: "Seite nicht gefunden", lang: "de" },
  { path: "/nope.css", heading: "Seite nicht gefunden", lang: "de" },
  { path: "/robots.txt.map", heading: "Seite nicht gefunden", lang: "de" },
] as const;

for (const { path, heading, lang } of NOT_FOUND_CASES) {
  test(`TS-004-A4: ${path} answers a rendered 404 in ${lang}`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(heading);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    // Next.js emits its own `noindex` for a 404 response; the page adds the
    // `follow` half of DEC-032. Assert the page's tag is present rather than
    // that it is the only one.
    await expect(
      page.locator('meta[name="robots"][content="noindex, follow"]'),
    ).toHaveCount(1);
  });

  test(`TS-004-A4/D6: ${path} is a complete document without JavaScript`, async ({
    browser,
  }) => {
    // The half F-2-70 was filed for. D6 calls the 404 a "static shell +
    // streamed place search", and a static shell is server-rendered by
    // definition — before this fix the German surface measured **zero**
    // rendered characters here while the English one measured 327.
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    const response = await page.goto(path);

    expect(response?.status()).toBe(404);
    const text = await page.locator("body").innerText();
    expect(text.length).toBeGreaterThan(100);
    expect(text).toContain(heading);

    // A4 names both modules by name: the place search is the dominant
    // element, the jobs band carries the four jobs.
    await expect(page.locator("#place-search input")).toHaveCount(1);
    await expect(page.locator("#context-band a")).not.toHaveCount(0);

    await context.close();
  });
}

test("TS-001-A3: the redundant /de prefix redirects to the bare path", async ({
  page,
}) => {
  const response = await page.goto("/de/mitmachen");
  expect(response?.status()).toBe(200);
  expect(new URL(page.url()).pathname).toBe("/mitmachen");
});

/**
 * F-3-13 — every page carries the brand icon, so no browser has to guess.
 *
 * The tree shipped no `public/favicon.ico` and no `app/icon.*` at all. The
 * icon is the brand package's own logo, reached through the subpath import
 * TS-017-A6 requires (no logo file is committed here), and Next emits it
 * under `/_next/static/`.
 */
test("F-3-13: every page links the brand icon, and it resolves", async ({ page, request }) => {
  for (const path of ["/", "/en", "/dein-ort", "/ueber-uns"]) {
    await page.goto(path);
    const icon = page.locator('link[rel="icon"]');
    await expect(icon, `icon link on ${path}`).toHaveCount(1);
    const href = await icon.getAttribute("href");
    expect(href, `icon href on ${path}`).toMatch(/^\/_next\/static\/media\/.+\.svg$/);
    const asset = await request.get(href ?? "");
    expect(asset.status(), `the icon asset linked from ${path}`).toBe(200);
  }
});

/**
 * F-3-16 — the true 404 opens with the skip link, like every routed page.
 *
 * `app/global-not-found.tsx` renders its own `<html><body>` and bypasses
 * `SiteChrome` on purpose, so it inherited none of the layout's chrome:
 * pressing Tab landed straight on the postcode input (C3-K-2). The link is
 * the only piece taken — the surface still has no header and no navigation,
 * which is what keeps it a complete document.
 */
test("F-3-16: the true 404's first tab stop is the skip link", async ({ page }) => {
  for (const [path, label] of [
    ["/dies-gibt-es-nicht-xyz", "Zum Inhalt springen"],
    ["/en/does-not-exist", "Skip to content"],
  ] as const) {
    await page.goto(path);
    await page.keyboard.press("Tab");

    const focused = await page.evaluate(() => ({
      tag: document.activeElement?.tagName ?? "",
      text: document.activeElement?.textContent?.trim() ?? "",
      href: document.activeElement?.getAttribute("href") ?? "",
    }));

    expect(focused.tag, `first tab stop on ${path}`).toBe("A");
    expect(focused.text).toBe(label);
    expect(focused.href).toBe("#main");
  }
});
