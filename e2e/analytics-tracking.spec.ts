import { expect, test } from "@playwright/test";

import { pageView } from "../src/lib/analytics/page-view";
import { everyRoute, href } from "../src/lib/routes/routes";

import type { Page } from "@playwright/test";

/**
 * DEC-0218 (issue 194): eTracker page views on every page, the secure code
 * from `NEXT_PUBLIC_ETRACKER_SECURE_CODE`, and one click event per CTA.
 *
 * **Two modes, chosen by the variable the dev server was started with.** Pass
 * the same value to this process (`NEXT_PUBLIC_ETRACKER_SECURE_CODE=… pnpm
 * exec playwright test e2e/analytics-tracking.spec.ts`):
 *
 * - **set** — the loader must be on every page. The vendor script is never
 *   fetched: `code.etracker.com` is answered by a stub that records what the
 *   adapter hands it (`et_eC_Wrapper`, `_etracker.sendEvent`). No request
 *   leaves the machine.
 * - **unset** (CI's build) — no loader, no request to eTracker, and the mock
 *   tracker's console lines stand in for the vendor.
 *
 * The CTA walk runs in both modes: it records clicks from the stub or from
 * the mock, whichever answers.
 */

const SECURE_CODE = process.env.NEXT_PUBLIC_ETRACKER_SECURE_CODE?.trim() || undefined;

const STUB = `
  window.__et = window.__et || { views: [], wrapper: [] };
  window.__et.views.push({ pageName: window.et_pagename, areas: window.et_areas, initial: true });
  window._etracker = {
    sendEvent: function (event) {
      if (event && event.action === "click") window.__ctaEvents.push(event);
      else window.__conversions.push(event);
    },
  };
  window.et_UserDefinedEvent = function (object, category, action, type) {
    this.object = object; this.category = category; this.action = action; this.type = type;
  };
  window.et_eC_Wrapper = function (parameters) { window.__et.wrapper.push(parameters); };
`;

/** Collect what the tracker emits, from the stub or from the mock's console lines. */
async function instrument(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const w = window as unknown as Record<string, unknown[]>;
    w.__ctaEvents = [];
    w.__conversions = [];
    w.__mockViews = [];
    const original = console.info.bind(console);
    console.info = (label?: unknown, payload?: unknown, ...rest: unknown[]) => {
      if (label === "[analytics:mock] cta") w.__ctaEvents!.push(payload);
      if (label === "[analytics:mock] pageview") w.__mockViews!.push(payload);
      original(label, payload, ...rest);
    };
  });
  await page.route("https://code.etracker.com/**", (route) =>
    route.request().url().endsWith("/code/e.js")
      ? route.fulfill({ status: 200, contentType: "text/javascript", body: STUB })
      : route.abort(),
  );
}

/** The analytics effects have run once the page is named (stub) or logged (mock). */
async function analyticsReady(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const w = window as unknown as { et_pagename?: string; __mockViews?: unknown[] };
    return typeof w.et_pagename === "string" || (w.__mockViews?.length ?? 0) > 0;
  });
}

const PAGES = [
  ...everyRoute().map(({ route, locale }) => ({ path: href(route, locale), expected: pageView(route, locale) })),
  { path: "/gibt-es-nicht", expected: pageView(undefined, "de") },
  { path: "/en/does-not-exist", expected: pageView(undefined, "en") },
];

test.describe("TS-WEB-0012-A12: page tracking on every page (secure code set)", () => {
  test.skip(!SECURE_CODE, "NEXT_PUBLIC_ETRACKER_SECURE_CODE is not set for this run");

  for (const { path, expected } of PAGES) {
    test(`${path}: one loader with the secure code, the page counted as ${expected.pageName}`, async ({ page }) => {
      await instrument(page);
      await page.goto(path);
      const loader = page.locator("script#_etLoader");
      await expect(loader).toHaveCount(1);
      await expect(loader).toHaveAttribute("data-secure-code", SECURE_CODE!);
      await expect(loader).toHaveAttribute("data-block-cookies", "true");
      await expect(loader).toHaveAttribute("data-page-changed-detection", "off");
      await expect
        .poll(() => page.evaluate(() => (window as unknown as { __et?: { views: unknown[] } }).__et?.views ?? []))
        .toEqual([{ pageName: expected.pageName, areas: expected.areas, initial: true }]);
    });
  }

  test("a client-side navigation sends exactly one virtual page view, named after the new route", async ({ page }) => {
    await instrument(page);
    await page.goto("/");
    await analyticsReady(page);
    await expect.poll(() => page.evaluate(() => (window as unknown as { __et?: object }).__et !== undefined)).toBe(true);
    // Soft navigation through the router, the way every RouteLink navigates.
    await page.locator(`a[href="${href("about", "de")}"]`).first().click();
    await page.waitForURL(`**${href("about", "de")}`);
    const target = pageView("about", "de");
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { __et: { wrapper: unknown[] } }).__et.wrapper))
      .toEqual([{ et_et: SECURE_CODE, et_pagename: target.pageName, et_areas: target.areas }]);
    // The document was not reloaded: the first view is still the only initial one.
    const views = await page.evaluate(() => (window as unknown as { __et: { views: unknown[] } }).__et.views);
    expect(views).toHaveLength(1);
  });

  test("/start mounts no loader (TS-WEB-0016 D15)", async ({ page }) => {
    await instrument(page);
    await page.goto("/start");
    await expect(page.locator("script#_etLoader")).toHaveCount(0);
  });
});

test.describe("TS-WEB-0012-A12: without the variable nothing is loaded and nothing fails", () => {
  test.skip(Boolean(SECURE_CODE), "NEXT_PUBLIC_ETRACKER_SECURE_CODE is set for this run");

  test("no loader, no request to eTracker, no page error — and the page view still reaches the mock", async ({ page }) => {
    const errors: string[] = [];
    const etrackerRequests: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      if (request.url().includes("etracker")) etrackerRequests.push(request.url());
    });
    await instrument(page);
    await page.goto(href("calendar", "de"));
    await analyticsReady(page);
    await expect(page.locator("script#_etLoader")).toHaveCount(0);
    const views = await page.evaluate(() => (window as unknown as { __mockViews: unknown[] }).__mockViews);
    expect(views[0]).toEqual({ pageName: "de/calendar", areas: "de/calendar" });
    expect(etrackerRequests).toEqual([]);
    expect(errors).toEqual([]);
  });
});

const CTA_SAMPLE = [
  href("home", "de"),
  href("place", "de"),
  href("takePart", "de"),
  href("calendar", "de"),
  href("region", "de"),
  href("about", "de"),
  href("calendar", "en"),
];

const CATEGORIES = new Set([
  "register-as-publisher",
  "save-calendar-to-homescreen",
  "buy-calendar-licence",
  "request-licence-quote",
  "request-product-briefing",
  "make-contact",
  "navigation",
  "outbound",
]);

const CTA_SELECTOR = [
  "a[data-cta]",
  "button[data-cta]:not(:disabled)",
  "a[data-new-tab]",
  'a[href^="tel:"]',
  'a[href^="mailto:"]',
].join(", ");

test.describe("TS-WEB-0012-A14: every CTA on the sampled pages reports one click event", () => {
  for (const path of CTA_SAMPLE) {
    test(`${path}: each CTA emits exactly one click event named by the DEC-0218 scheme`, async ({ page }) => {
      await instrument(page);
      // Nothing navigates while the walk runs: a capture listener on the
      // window runs before the document's, so the tracker's listener still
      // sees every click, and Next's Link and the browser both see a
      // prevented default.
      await page.addInitScript(() => {
        window.addEventListener("click", (event) => event.preventDefault(), { capture: true });
      });
      await page.goto(path);
      await analyticsReady(page);
      const expectedPage = await page.evaluate(() => {
        const w = window as unknown as { et_pagename?: string; __mockViews?: { pageName: string }[] };
        return w.et_pagename ?? w.__mockViews?.[0]?.pageName;
      });

      const results = await page.evaluate((selector) => {
        const w = window as unknown as { __ctaEvents: Record<string, string>[] };
        return [...document.querySelectorAll<HTMLElement>(selector)].map((element) => {
          const before = w.__ctaEvents.length;
          element.click();
          return {
            element: `${element.tagName.toLowerCase()} ${element.getAttribute("href") ?? element.getAttribute("name") ?? ""}`.trim(),
            events: w.__ctaEvents.slice(before),
          };
        });
      }, CTA_SELECTOR);

      test.info().annotations.push({ type: "ctas", description: `${path}: ${results.length}` });
      console.log(`[ctas] ${path}: ${results.length} — ${results.map((r) => r.events[0]?.object).join(", ")}`);
      expect(results.length, `no CTA found on ${path}`).toBeGreaterThan(0);
      for (const { element, events } of results) {
        expect(events, `${element} on ${path}`).toHaveLength(1);
        const [event] = events;
        expect(event!.action, element).toBe("click");
        expect(CATEGORIES.has(event!.category!), `${element}: category ${event!.category}`).toBe(true);
        expect(event!.object, element).toMatch(/^\S+\.[a-z-]+$/);
        expect(event!.type, element).toBe(expectedPage);
      }
    });
  }
});
