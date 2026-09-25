import { expect, test } from "@playwright/test";

import { ALLOWLIST } from "../src/lib/security/csp";
import { everyRoute, href } from "../src/lib/routes/routes";

import type { Page, Request } from "@playwright/test";

/**
 * TS-WEB-0013 — the closed client-request set. TS-WEB-0013 D2's own words: "The CSP
 * allowlist (CON-WEB-0030) and this table are the same set seen from two
 * sides. If they diverge, one of them is wrong." — so the allowed-host set
 * here is built from `src/lib/security/csp.ts`'s `ALLOWLIST`, the one typed
 * structure TS-WEB-0014 D7 names as the single source, rather than a second,
 * independently maintained list that could quietly drift from it.
 *
 * Own-origin covers everything D2 lists as same-origin, including
 * `/_vercel/speed-insights/*` — a path, not a separate host.
 *
 * **The form host is scoped to one route.** D2's row for it (2026-09-25,
 * DEC-0121) admits the registration form's host on `/start` alone
 * (TS-WEB-0016 D15), and TS-WEB-0012-A2 is stricter than D2 on every other
 * route: there "no request goes to a host outside the D7 collectors". So the
 * host is taken **out** of the set the 24 page rows are walked against, and
 * asserted **in** — as the only extra origin — on `/start` (DEC-0108 §3).
 */

const FORM_HOST = new URL(ALLOWLIST.googleForms).host;

const ALLOWED_HOSTS = new Set<string>(
  Object.values(ALLOWLIST)
    .map((url) => new URL(url).host)
    .filter((host) => host !== FORM_HOST),
);

/**
 * `vercel.live` is Vercel's own preview-deployment toolbar (feedback,
 * comments, the deployment badge) — injected by the platform into every
 * `*.vercel.app` response, not a host this application ever requests
 * itself. It is not, and must not become, part of `csp.ts`'s D2 allowlist
 * (that list is the *application's* closed request set, and the toolbar is
 * gone in production, where the domain is never a `*.vercel.app` one) —
 * this is a smoke-test environment accommodation, scoped to exactly the
 * hosts where the platform can inject it, so a real unlisted-host
 * regression on a real domain still fails the suite.
 */
const VERCEL_PREVIEW_HOST = /\.vercel\.app$/;
const VERCEL_TOOLBAR_HOST = "vercel.live";

const ROUTES = everyRoute().map(({ route, locale }) => ({
  path: href(route, locale),
  route,
  locale,
}));

/** The http(s) URL of a request, or nothing for `data:` and friends. */
function httpUrl(request: Request): URL | undefined {
  let url: URL;
  try {
    url = new URL(request.url());
  } catch {
    return undefined; // non-http(s) requests carry no host to check.
  }
  return url.protocol === "http:" || url.protocol === "https:" ? url : undefined;
}

function ownHostOf(baseURL: string | undefined): string {
  return baseURL ? new URL(baseURL).host : "";
}

test.describe("TS-WEB-0013-A1: the client-request inventory is closed (D2)", () => {
  for (const { path, route, locale } of ROUTES) {
    test(`${path} (${route}/${locale}): every request host is in the D2 allowlist`, async ({
      page,
      baseURL,
    }) => {
      const ownHost = ownHostOf(baseURL);
      const isVercelPreview = VERCEL_PREVIEW_HOST.test(ownHost);
      const offenders = new Set<string>();

      page.on("request", (request) => {
        const url = httpUrl(request);
        if (!url) return;
        if (url.host === ownHost) return; // own origin — D2's first row, and the
        // `/_vercel/speed-insights/*` path lives on it.
        if (isVercelPreview && url.host === VERCEL_TOOLBAR_HOST) return;
        if (!ALLOWED_HOSTS.has(url.host)) offenders.add(`${url.host} (${request.url()})`);
      });

      await page.setViewportSize({ width: 360, height: 640 });
      await page.goto(path);
      // Give deferred/async scripts (the eTracker loader, D9) their chance
      // to fire a request before asserting the trace is complete.
      await page.waitForTimeout(500);

      expect([...offenders], `unlisted hosts contacted on ${path}`).toEqual([]);
    });
  }

  /**
   * The 25th row of the D1 inventory, and the exception TS-WEB-0012-A2 names:
   * on `/start` "the configured form host is the **only** origin contacted
   * beyond D7 and our own, and no analytics call site of ours runs there".
   *
   * What counts as contacted (DEC-0121 §6): every request **our document**
   * issues — the main frame's — and the navigation of the one frame it
   * embeds. What the framed document then loads on its own is Google's
   * document's business, outside the CSP's reach (`frame-src` governs the
   * frame's navigation, not its subresources) and outside this trace: the
   * page contacted one third party, and that third party's page is not this
   * site's request set.
   */
  test("/start: the form host is the only origin beyond our own, and no analytics runs there (TS-WEB-0012-A2)", async ({
    page,
    baseURL,
  }) => {
    const ownHost = ownHostOf(baseURL);
    const isVercelPreview = VERCEL_PREVIEW_HOST.test(ownHost);
    const offenders = new Set<string>();
    const framedHosts = new Set<string>();

    page.on("request", (request) => {
      const url = httpUrl(request);
      if (!url) return;
      if (url.host === ownHost) return;
      if (isVercelPreview && url.host === VERCEL_TOOLBAR_HOST) return;
      const ours = request.frame() === page.mainFrame();
      if (ours) {
        // Our own document requests nothing off-origin here: no eTracker
        // (D15 "Measurement: nothing"), no Portalize, no envoy.
        offenders.add(`${url.host} (${request.url()})`);
        return;
      }
      // A frame's own navigation is the request our document caused. Its
      // subresources are the third party's.
      if (request.isNavigationRequest()) framedHosts.add(url.host);
    });

    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto("/start");
    await page.waitForTimeout(500);

    expect([...offenders], "hosts our document contacted on /start").toEqual([]);
    expect([...framedHosts], "the framed navigation's host").toEqual([FORM_HOST]);
    await expect(page.locator('script[src*="etracker"]')).toHaveCount(0);

    await expectNoIdentifier(page);
  });
});

/** TS-WEB-0012-A2's storage clause, on our origin. */
async function expectNoIdentifier(page: Page) {
  const cookies = await page.context().cookies();
  const trackingCookies = cookies.filter((cookie) =>
    /track|analytic|_ga|_gid|_et|_fbp/i.test(cookie.name),
  );
  expect(trackingCookies, "tracking cookie present").toEqual([]);

  const storageKeys = await page.evaluate(() => ({
    local: Object.keys(localStorage),
    session: Object.keys(sessionStorage),
  }));
  expect(storageKeys.local, "localStorage carries a key").toEqual([]);
  expect(storageKeys.session, "sessionStorage carries a key").toEqual([]);
}

test.describe("TS-WEB-0013-A2: no analytics identifier survives a full session", () => {
  test("home → calendar → legal carries no tracking cookie or storage identifier", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 640 });

    await page.goto(href("home", "de"));
    await page.goto(href("calendar", "de"));
    await page.goto(href("legal", "de"));

    await expectNoIdentifier(page);
  });
});
