import { expect, test } from "@playwright/test";

import { ALLOWLIST } from "../src/lib/security/csp";
import { SHOWCASE_CALENDAR } from "../src/lib/embed/portalize";
import { href } from "../src/lib/routes/routes";

/**
 * TS-008 D6 / `state/open.md` row 82 — the real Portalize calendar on
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
 *  - every host the embed contacts is in the TS-014 D1 allowlist, and the
 *    console stays clean — a CSP refusal would show up as both.
 */

const CALENDAR = href("calendar", "de");
const ALLOWED_HOSTS = new Set(Object.values(ALLOWLIST).map((url) => new URL(url).host));
const VERCEL_PREVIEW_HOST = /\.vercel\.app$/;

test.describe("the embed frame", () => {
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
      if (isPreview && url.host === "vercel.live") return;
      if (!ALLOWED_HOSTS.has(url.host)) offenders.add(`${url.host} (${request.url()})`);
    });
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

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

  test("the page explains what is configured", async ({ page }) => {
    await page.goto(CALENDAR);
    const block = page.locator("[data-block='embed-demo']");

    // The copy names the places the calendar is filtered to, and the
    // configuration list names every setting the embed actually has.
    await expect(block).toContainText("Schlatkow");
    for (const key of ["Orte", "Kategorien", "Zeitraum", "Darstellung", "Aktualisierung"]) {
      await expect(block.locator("dt", { hasText: new RegExp(`^${key}$`, "u") })).toBeVisible();
    }
    // And the values, not only the labels — a list of empty keys explains
    // nothing.
    await expect(block.locator("dd").first()).toContainText("Schmatzin");
  });
});
