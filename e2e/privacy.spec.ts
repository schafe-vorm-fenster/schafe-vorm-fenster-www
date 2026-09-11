import { expect, test } from "@playwright/test";

import { ALLOWLIST } from "../src/lib/security/csp";
import { everyRoute, href } from "../src/lib/routes/routes";

/**
 * TS-013 — the closed client-request set. TS-013 D2's own words: "The CSP
 * allowlist (WEB-Q-030) and this table are the same set seen from two
 * sides. If they diverge, one of them is wrong." — so the allowed-host set
 * here is built from `src/lib/security/csp.ts`'s `ALLOWLIST`, the one typed
 * structure TS-014 D7 names as the single source, rather than a second,
 * independently maintained list that could quietly drift from it.
 *
 * Own-origin covers everything D2 lists as same-origin, including
 * `/_vercel/speed-insights/*` — a path, not a separate host.
 */

const ALLOWED_HOSTS = new Set<string>(
  Object.values(ALLOWLIST).map((url) => new URL(url).host),
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

test.describe("TS-013-A1: the client-request inventory is closed (D2)", () => {
  for (const { path, route, locale } of ROUTES) {
    test(`${path} (${route}/${locale}): every request host is in the D2 allowlist`, async ({
      page,
      baseURL,
    }) => {
      const ownHost = baseURL ? new URL(baseURL).host : "";
      const isVercelPreview = VERCEL_PREVIEW_HOST.test(ownHost);
      const offenders = new Set<string>();

      page.on("request", (request) => {
        let url: URL;
        try {
          url = new URL(request.url());
        } catch {
          return; // non-http(s) requests (e.g. data:) carry no host to check.
        }
        if (url.protocol !== "http:" && url.protocol !== "https:") return;
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
});

test.describe("TS-013-A2: no analytics identifier survives a full session", () => {
  test("home → calendar → legal carries no tracking cookie or storage identifier", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 640 });

    await page.goto(href("home", "de"));
    await page.goto(href("calendar", "de"));
    await page.goto(href("legal", "de"));

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
  });
});
