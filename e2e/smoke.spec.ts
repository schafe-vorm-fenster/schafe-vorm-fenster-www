import { expect, test } from "@playwright/test";

import { ROUTE_IDS, href } from "../src/lib/routes/routes";

/**
 * The M1 smoke suite. It proves the delivery chain end to end: the shell
 * renders, the layout law holds at the three sampled widths, and the
 * non-production noindex regime is on every response.
 *
 * The three widths are DEC-0067's: 360 and 428 are where the breakpoint scale
 * is dense, 1280 is the desktop reference viewport. A suite that samples only
 * 360 and 1280 cannot see whether the small range does anything.
 *
 * ── Why the layout-law cases walk every route ─────────────────────────────
 *
 * Both criteria are site-wide sentences and both were asserted on `/` alone
 * until 2026-09-26: TS-WEB-0017-A8 is *"identical … on **every page**"* and
 * TS-WEB-0017-A9 is *"at 320 px **no page** scrolls horizontally"* plus the
 * same at 360 and 428. `/` is the one page with no place data, no filter row,
 * no embed and no form, so it is the least likely page to break either — which
 * is what made the pair read as covered while the pages that actually compose
 * something were never measured. They now loop over the twelve `TS-WEB-0004`
 * D1 routes. The German paths only: the English mirrors share every component
 * and every stylesheet, so a locale sweep would double the run without
 * reaching a different class of defect — the same reasoning
 * `e2e/layout-stability.spec.ts` records for its own walk.
 */

/**
 * The visible text of the rendered DOM, in document order — **the page**, not
 * the header.
 *
 * TS-WEB-0017 D2(d)'s single-tree rule is what this checks, and it still holds for
 * everything a page composes: no block appears, disappears or reorders between
 * 360, 428 and 1280. The site header is the one named exception, on Jan's
 * round-3 decision (point 3, `state/open.md` rows 35 and 201): below `md` the
 * logo shows the mark alone and the four job labels move behind a burger into
 * a full-screen overlay, because the previous single-tree form — four labels
 * in a sideways-scrolling row — showed one and a half of them on a phone and
 * hid the rest behind a gesture nobody discovers.
 *
 * The exception is scoped to the header element and named here rather than
 * loosened in the criterion: every destination, label and control still exists
 * in the markup at every width, and `e2e/site-header.spec.ts` asserts that the
 * whole D4 inventory is reachable at 360 and at 1280. Aligning D2(d) and D4
 * with this is a spec-session row, not a test-side edit.
 */
async function visibleTextOrder(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const banner = document.querySelector("body > header");
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) =>
          banner?.contains(node)
            ? NodeFilter.FILTER_REJECT
            : NodeFilter.FILTER_ACCEPT,
      },
    );
    const out: string[] = [];
    let node = walker.nextNode();
    while (node) {
      const text = (node.textContent ?? "").replace(/\s+/g, " ").trim();
      const element = node.parentElement;
      if (text && element) {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        const visible =
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          rect.width > 0 &&
          rect.height > 0;
        if (visible) out.push(text);
      }
      node = walker.nextNode();
    }
    return out;
  });
}

test("the shell renders and declares its language", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.locator("html")).toHaveAttribute("lang", "de");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();
});

/** The twelve German paths of the TS-WEB-0004 D1 registry. */
const PATHS = ROUTE_IDS.map((routeId) => href(routeId, "de"));

/**
 * The widths the two criteria name between them, mobile-first: the load width
 * (360, the reference viewport and the base case of TS-WEB-0017 D2), then A9's
 * floor, the second sampled width, the desktop reference and A9's ceiling.
 * `order: true` marks the three widths A8 compares the text order at.
 */
const WIDTHS = [
  { name: "360x640 (xs, reference — the load width)", width: 360, height: 640, order: true },
  { name: "320x640 (A9 floor)", width: 320, height: 640, order: false },
  { name: "428x926 (sm)", width: 428, height: 926, order: true },
  { name: "1280x800 (2xl, reference)", width: 1280, height: 800, order: true },
  { name: "1920x1080 (A9 ceiling)", width: 1920, height: 1080, order: false },
] as const;

/** measure.page is 75rem = 1200px; only the outer margin grows beyond it. */
const MEASURE_PAGE_PX = 1200;

/**
 * Three navigations per route — one per width A8 names — plus a resize walk
 * across all five for A9.
 *
 * **A8 is a statement about loading at a width, so the test loads at each of
 * them.** D2(d)'s single-tree rule says the markup does not branch on width,
 * and it is true that the server cannot see the viewport: five responses for
 * one route are therefore identical HTML. That is exactly why reloading is the
 * sharper instrument rather than the wasteful one — the only way two loads of
 * one route can differ is a client-side decision taken **at mount**, which is
 * the defect class A8 exists to catch, and the site has one today:
 * `src/components/explain-module/explain-module.tsx` reads
 * `window.matchMedia(SIDE_BY_SIDE)` once in a mount effect and never listens
 * for `change` (measured 2026-09-26 on `/mitmachen`: loaded at 360 and resized
 * to 1280, `data-advance` is `1/armed`; loaded at 1280 it is `1/static`). A
 * page resized from 360 keeps its 360 decision, so a resize walk is blind to
 * that branch by construction. It happens not to move visible text order
 * today; the instrument must not depend on that.
 *
 * **The resize walk stays, and buys two other things.** A9 names five widths
 * and only asks whether anything scrolls sideways, which a live reflow answers
 * as well as a load; and the walk is a second, independent comparison — a tree
 * that reorders *while* the window changes size is also a page that is not one
 * tree, which no per-width reload can see. So the order captured by resizing to
 * 428 and 1280 and the order of a fresh load at 428 and at 1280 are all
 * compared against the 360 load: five readings, one expected value.
 *
 * What this costs is thirty-six cold navigations instead of twelve. That is the
 * trade, and it is the honest way round: breadth and a development server that
 * survives the run were what resizing bought (`state/open.md` row 281 — sixty
 * navigations over five workers produced dev-overlay 500s), not a stronger
 * detector. Sixty is what a full five-width matrix costs; A8 names three
 * widths, so three loads per route is the criterion as written and no more.
 *
 * The first load happens at 360 so that the mobile-first base case is the
 * reference the other readings are compared against.
 */
for (const path of PATHS) {
  test(`TS-WEB-0017-A8 / TS-WEB-0017-A9: the layout law holds on ${path} at every sampled width`, async ({
    page,
  }) => {
    const [load] = WIDTHS;
    const scrollsSideways = () =>
      page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);

    await page.setViewportSize({ width: load.width, height: load.height });
    const response = await page.goto(path);
    expect(response?.status(), `status of ${path}`).toBe(200);
    await page.waitForLoadState("networkidle");

    /** Every visible-text-order reading, with where it was taken. */
    const orders: { where: string; order: string[] }[] = [];

    for (const viewport of WIDTHS) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      // A9: nothing scrolls sideways, at any of the five.
      expect(await scrollsSideways(), `horizontal scroll on ${path} at ${viewport.name}`).toBe(
        false,
      );

      // A8, reflow half: the order the live tree has after resizing to one of
      // the three widths D2(d) samples.
      if (viewport.order) {
        orders.push({
          where: `${viewport.name}, resized from ${load.width}`,
          order: await visibleTextOrder(page),
        });
      }
    }

    // A9's ceiling — the last width set. Every section brings its own
    // `.container` now that the pages are composed (`section-shell` is
    // full-bleed and contains only its content), so every one is measured
    // rather than the page's first. `evaluateAll` does not auto-wait, so the
    // first container is awaited explicitly.
    const containers = page.locator("main .container");
    await containers.first().waitFor({ state: "attached" });
    // The content box, not the padded one: since DEC-0150 the outer margin is
    // padding *outside* measure.page, so the padded box is 1200px plus two
    // margins and only the content is held to measure.page.
    const widths = await containers.evaluateAll((elements) =>
      elements.map((element) => {
        const style = getComputedStyle(element);
        return (
          element.getBoundingClientRect().width -
          parseFloat(style.paddingLeft) -
          parseFloat(style.paddingRight)
        );
      }),
    );
    expect(widths.length, `${path} has no container in main`).toBeGreaterThan(0);
    expect(Math.max(...widths), `widest container on ${path} at 1920px`).toBeLessThanOrEqual(
      MEASURE_PAGE_PX,
    );

    // A8, mount half: a fresh load at each of the other two widths it names.
    // This is the reading a resize cannot produce — the page decides at mount
    // and a resized page has already decided.
    for (const viewport of WIDTHS.filter(
      (candidate) => candidate.order && candidate.width !== load.width,
    )) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const reloaded = await page.goto(path);
      expect(reloaded?.status(), `status of ${path} loaded at ${viewport.name}`).toBe(200);
      await page.waitForLoadState("networkidle");
      expect(
        await scrollsSideways(),
        `horizontal scroll on ${path} loaded at ${viewport.name}`,
      ).toBe(false);
      orders.push({
        where: `${viewport.name}, loaded at that width`,
        order: await visibleTextOrder(page),
      });
    }

    // A8: identical, not merely non-empty — every reading against the 360 load.
    expect(orders[0]?.order.length, `${path} rendered no visible text`).toBeGreaterThan(0);
    expect(orders.length, `${path}: readings taken`).toBe(5);
    for (const later of orders.slice(1)) {
      expect(later.order, `${path} at ${later.where} differs from ${orders[0]?.where}`).toEqual(
        orders[0]?.order,
      );
    }
  });
}

test("TS-WEB-0015-A1: a non-production deployment is noindex on all three surfaces", async ({
  page,
  request,
}) => {
  const response = await page.goto("/");
  expect(response?.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Disallow: /");
});

/**
 * TS-WEB-0014-A2: "Every production response carries the D2 CSP and all D4
 * headers with exactly the specified values."
 *
 * F-1-1 (round 1): the previous version of this test asserted four of the
 * D4 headers and two CSP substrings — real, but a fraction of the AC. This
 * asserts the full D4 header table and the full D2 directive set.
 *
 * Two things are deliberately environment-aware rather than a single fixed
 * expectation, both per TS-WEB-0014 D5 (three environments, not one):
 *
 *  - `Strict-Transport-Security` is absent in local development and
 *    present with a different `max-age` in preview vs. production — its
 *    *absence* here is correct when this suite runs against `next dev`
 *    (the README default), so the assertion checks the header's value only
 *    when the header is present at all, against either allowed value.
 *  - `script-src` and `connect-src` carry extra, environment-specific
 *    tokens (`'unsafe-eval'`, dev's `ws:`/`localhost` entries, the D3
 *    hash set or its `'unsafe-inline'` fallback) that D5 and DEC-0045
 *    deliberately vary and that `src/lib/security/csp.ts` is under active
 *    revision on this round (state/open.md rows 21/31) — this asserts the
 *    D1 allowlist hosts and `'self'` are present in each, per the spec's
 *    required directive members, rather than pinning the exact directive
 *    string another developer's file is still changing.
 *
 * Every other D2 directive is fixed by the spec regardless of environment
 * and is asserted on its exact value.
 */
test("TS-WEB-0014-A2: the security headers of TS-WEB-0014 D4 are on the response", async ({
  page,
}) => {
  const response = await page.goto("/");
  const headers = response?.headers() ?? {};

  // D4 — the static header set, every route, every environment.
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["permissions-policy"]).toBe(
    [
      "accelerometer=()",
      "autoplay=()",
      "browsing-topics=()",
      "camera=()",
      "display-capture=()",
      "encrypted-media=()",
      "fullscreen=(self)",
      "geolocation=(self)",
      "gyroscope=()",
      "idle-detection=()",
      "magnetometer=()",
      "microphone=()",
      "midi=()",
      "payment=()",
      "picture-in-picture=()",
      "publickey-credentials-get=()",
      "screen-wake-lock=()",
      "serial=()",
      "usb=()",
      "xr-spatial-tracking=()",
    ].join(", "),
  );
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["cross-origin-opener-policy"]).toBe("same-origin");
  expect(headers["cross-origin-resource-policy"]).toBe("same-origin");
  expect(headers["reporting-endpoints"]).toBe('csp="/api/csp-report"');

  // D5 — HSTS varies by environment; only its value (when present) is fixed.
  const hsts = headers["strict-transport-security"];
  if (hsts !== undefined) {
    expect([
      "max-age=63072000; includeSubDomains", // production
      "max-age=86400; includeSubDomains", // preview
    ]).toContain(hsts);
  }

  // D2 — the CSP, directive by directive. Every directive not named below
  // as environment-varying is fixed by the spec regardless of environment.
  const csp = headers["content-security-policy"] ?? "";
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("base-uri 'self'");
  expect(csp).toContain("style-src 'self' 'unsafe-inline'");
  expect(csp).toContain("img-src 'self' data: https://code.etracker.com");
  expect(csp).toContain("font-src 'self'");
  expect(csp).toContain("media-src 'self'");
  expect(csp).toContain("manifest-src 'self'");
  expect(csp).toContain("worker-src 'self'");
  expect(csp).toContain("object-src 'none'");
  // The fifth D1 origin (DEC-0121): the registration form's host, framed on
  // `/start` (TS-WEB-0016 D15) — the one `frame-src` source, and it appears in
  // no other directive.
  expect(csp).toContain("frame-src https://docs.google.com;");
  expect(csp).not.toContain("frame-src 'none'");
  expect(csp).toContain("child-src 'none'");
  expect(csp).toContain("form-action 'self'");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toContain("report-to csp");
  expect(csp).toContain("report-uri /api/csp-report");

  // D1's three active external hosts (a fourth, `app.…`, is reserved —
  // "none today", TS-WEB-0014 D1) must be reachable in both directives that
  // govern them, in every environment — the environment-specific extras
  // (D5, DEC-0045) are additions, never a substitute for the allowlist.
  const scriptSrcMatch = /script-src ([^;]+);/.exec(csp);
  const connectSrcMatch = /connect-src ([^;]+);/.exec(csp);
  const scriptSrc = scriptSrcMatch?.[1] ?? "";
  const connectSrc = connectSrcMatch?.[1] ?? "";
  for (const directive of [scriptSrc, connectSrc]) {
    expect(directive).toContain("'self'");
    expect(directive).toContain("https://code.etracker.com");
    expect(directive).toContain("https://portalize.schafe-vorm-fenster.de");
    expect(directive).toContain(
      "https://envoy-api.api.schafe-vorm-fenster.de",
    );
  }
});

/**
 * F-2-36, on the served response rather than in a unit test: every
 * `script-src` token that is not `'self'`, a D1 host or a documented
 * environment concession must be a well-formed `'sha256-<44 base64>'`
 * source. The hash set reaches the header from a build artifact the proxy
 * fetches, so this is the one assertion that covers the whole path —
 * generator, fetch, validation, serialisation — against a real deployment.
 */
test("TS-WEB-0014-A2 / F-2-36: script-src carries no token that is not a real hash", async ({
  page,
}) => {
  const response = await page.goto("/");
  const csp = response?.headers()["content-security-policy"] ?? "";
  const scriptSrc = /script-src ([^;]+)/.exec(csp)?.[1] ?? "";
  expect(scriptSrc.length).toBeGreaterThan(0);

  const allowed = new Set([
    "'self'",
    "'unsafe-eval'", // TS-WEB-0014 D5, local development only
    "'unsafe-inline'", // state/open.md rows 21/31, dev + preview only
    "https://code.etracker.com",
    "https://portalize.schafe-vorm-fenster.de",
    "https://envoy-api.api.schafe-vorm-fenster.de",
  ]);

  for (const token of scriptSrc.trim().split(/\s+/)) {
    if (allowed.has(token)) continue;
    expect(token, `unexpected script-src token: ${token}`).toMatch(
      /^'sha256-[A-Za-z0-9+/]{43}='$/,
    );
  }
});
