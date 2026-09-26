import { expect, test } from "@playwright/test";

import { ALLOWLIST } from "../src/lib/security/csp";
import { SHOWCASE_CALENDAR } from "../src/lib/embed/portalize";
import { href } from "../src/lib/routes/routes";

/**
 * TS-WEB-0008 D6 / `state/open.md` row 82 — the real Portalize calendar on
 * `/dein-kalender`.
 *
 * What a browser has to establish, and nothing else can:
 *
 *  - the mount is in the page and carries the attributes the loader needs
 *    (`data-portalize-widget` **and** an `id` — without the id the loader
 *    logs and skips);
 *  - the box reserves its height **before** the loader runs, so the two
 *    round trips the widget makes move nothing below it;
 *  - the loader is lazy: it is not in the document until the block is
 *    approached;
 *  - every host the embed contacts is in the TS-WEB-0014 D1 allowlist, and the
 *    console stays clean — a CSP refusal would show up as both.
 */

const CALENDAR = href("calendar", "de");
const ALLOWED_HOSTS = new Set(Object.values(ALLOWLIST).map((url) => new URL(url).host));
const VERCEL_PREVIEW_HOST = /\.vercel\.app$/;

/**
 * Vercel's preview toolbar (`vercel.live`) is injected by the platform into
 * every `*.vercel.app` response and is refused by the application's own CSP,
 * which logs a console error the application did not cause. `privacy.spec.ts`
 * makes the same exception for the same host and the same reason.
 */
const PLATFORM_NOISE = /vercel\.live/;

const BYPASS = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

/**
 * Whether the widget host answers at all.
 *
 * Three of the four checks below are about this page and hold offline. The
 * fourth mounts the **real** calendar, so it depends on a third-party
 * service being up, and a gate that goes red because someone else's
 * deployment is restarting reports nothing useful. That one is skipped when
 * the host does not answer — the same guard, for the same reason, as
 * `src/lib/live/upstream-live.integration.test.ts`.
 */
async function widgetHostReachable(): Promise<boolean> {
  try {
    const response = await fetch(`${ALLOWLIST.portalize}/api/health`, {
      signal: AbortSignal.timeout(8000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

test.describe("the embed frame", () => {
  /**
   * **No bypass header on this context**, and the reason is the embed itself.
   *
   * Vercel's Deployment Protection is normally passed with
   * `x-vercel-protection-bypass`, which Playwright then sends on *every*
   * request — including the cross-origin module the Portalize loader fetches.
   * That turns a simple request into a preflighted one, the widget host does
   * not list the header in `Access-Control-Allow-Headers`, and the module is
   * refused. A real visitor sends no such header, so the failure would be the
   * harness's and not the product's.
   *
   * The cookie form of the same bypass has no such effect: it is set once, on
   * this site's own origin, and travels with same-origin requests only.
   */
  test.use({ extraHTTPHeaders: {} });

  test.beforeEach(async ({ page, baseURL }) => {
    if (BYPASS === undefined || baseURL === undefined) return;
    if (!VERCEL_PREVIEW_HOST.test(new URL(baseURL).host)) return;
    await page.goto(
      `/?x-vercel-protection-bypass=${encodeURIComponent(BYPASS)}&x-vercel-set-bypass-cookie=true`,
    );
  });

  test("the mount carries what the loader needs, and reserves its height", async ({ page }) => {
    await page.goto(CALENDAR);

    const mount = page.locator("[data-portalize-widget]");
    await expect(mount).toHaveCount(1);
    await expect(mount).toHaveAttribute("id", /\S/u);

    const box = page.locator("[data-block='embed-demo'] [data-portalize-widget]").locator("..");
    const before = await box.boundingBox();
    expect(before?.height ?? 0, "the box reserves height before the loader runs").toBeGreaterThan(300);
  });

  test("the loader is not requested until the block is approached", async ({ page }) => {
    const loaders: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/load.js")) loaders.push(request.url());
    });

    await page.setViewportSize({ width: 390, height: 700 });
    await page.goto(CALENDAR);
    await page.waitForTimeout(500);
    expect(loaders, "the loader must not run above the fold").toEqual([]);

    await page.locator("[data-portalize-widget]").scrollIntoViewIfNeeded();
    await expect
      .poll(() => loaders.length, { timeout: 15_000 })
      .toBeGreaterThan(0);
    expect(loaders[0]).toContain(SHOWCASE_CALENDAR.organizerId);
  });

  test("loads a real calendar without contacting an unlisted host or logging an error", async ({
    page,
    baseURL,
  }) => {
    test.skip(!(await widgetHostReachable()), "the Portalize host does not answer");
    const ownHost = baseURL ? new URL(baseURL).host : "";
    const isPreview = VERCEL_PREVIEW_HOST.test(ownHost);
    const offenders = new Set<string>();
    const errors: string[] = [];

    page.on("request", (request) => {
      let url: URL;
      try {
        url = new URL(request.url());
      } catch {
        return;
      }
      if (url.protocol !== "http:" && url.protocol !== "https:") return;
      if (url.host === ownHost) return;
      if (isPreview && PLATFORM_NOISE.test(url.host)) return;
      if (!ALLOWED_HOSTS.has(url.host)) offenders.add(`${url.host} (${request.url()})`);
    });
    page.on("console", (message) => {
      if (message.type() === "error" && !PLATFORM_NOISE.test(message.text())) {
        errors.push(message.text());
      }
    });
    page.on("pageerror", (error) => {
      if (!PLATFORM_NOISE.test(error.message)) errors.push(error.message);
    });

    await page.goto(CALENDAR);
    await page.locator("[data-portalize-widget]").scrollIntoViewIfNeeded();

    // The widget mounts a custom element with an open shadow root — that is
    // the proof the real loader ran, not a stub.
    await expect
      .poll(
        async () =>
          page.locator("[data-portalize-widget] portalize-widget").count(),
        { timeout: 20_000 },
      )
      .toBe(1);

    expect([...offenders], "unlisted hosts contacted by the embed").toEqual([]);
    expect(errors, "console errors while the embed loads").toEqual([]);
  });

  /**
   * What this case protects is unchanged: a visitor can read which places the
   * real calendar above is filtered to, and what every one of its settings is
   * set to.
   *
   * **Where she reads it moved.** The polish brief split the section in two:
   * `embed-demo` is now the widget and its introduction alone ("it gets the
   * room it deserves and nothing else in its section"), and the settings list
   * stands one section lower under its own `WARUM DAS ZÄHLT` heading, in a new
   * `embed-config` block — because together they measured 1772 px and the list
   * read as fine print under the picture rather than as the answer to "but can
   * we decide what is in it?" (`app/[lang]/dein-kalender/page.tsx`). Asserting
   * both halves against `embed-demo` is what failed; the split is the product
   * decision, so the case follows it rather than the other way round.
   */
  test("the page explains what is configured", async ({ page }) => {
    await page.goto(CALENDAR);
    const demo = page.locator("[data-block='embed-demo']");
    const config = page.locator("[data-block='embed-config']");

    // The demo's own copy names the places the calendar is filtered to, next
    // to the widget that shows them.
    await expect(demo).toContainText("Schlatkow");

    // And the configuration block names every setting the embed actually
    // has. The keys are asserted by name rather than by count: a list that
    // grows a row is not a regression — one that loses one is.
    //
    // T-13 turned the `<dl>` into `setting-row`s (DEC-0118, DEC-0131 §1), so
    // a key is an `h3` and its explanation is the row's own copy, not a
    // `<dd>`. The `Zeitraum` row carries its placeholder badge inside the
    // heading, so the match is a prefix rather than the whole string.
    for (const key of [
      "Orte",
      "Veranstalter",
      "Kategorien",
      "Zeitraum",
      "Darstellung",
      "Aktualisierung",
    ]) {
      await expect(
        config.locator("h3", { hasText: new RegExp(`^\\s*${key}`, "u") }),
      ).toBeVisible();
    }
    // And the explanations, not only the labels — a list of bare keys
    // explains nothing.
    await expect(config.locator("li p").first()).not.toBeEmpty();
  });
});
