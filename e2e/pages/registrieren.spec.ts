import { expect, test } from "@playwright/test";

import { leadFormEmbedUrl } from "../../src/lib/routes/lead-fallback";
import { href } from "../../src/lib/routes/routes";
import { ALLOWLIST } from "../../src/lib/security/csp";

import type { Page } from "@playwright/test";

/**
 * TS-WEB-0023 D10 (DEC-0176, issue 109) — `/mitmachen/registrieren` embeds the
 * Google Form the live site uses, for the launch.
 *
 * The three-step flow this file walked until DEC-0176 is not rendered; its
 * criteria A1–A11, A13 and A15 are suspended with it (D10), and its walk is in
 * git history at the commit DEC-0176 names. A12 and A14 still hold and are
 * asserted below, A16 is `e2e/a11y.spec.ts`'s.
 *
 * Two of the tests stub the form host (`page.route`): what they assert is our
 * page's behaviour around the frame — its box before the third party answers,
 * and what a navigation inside it fires — and neither should depend on
 * Google's servers. The test that measures the real form's page 1 against the
 * reserved height does load Google.
 */

const ROUTE = "/mitmachen/registrieren";
const FORM_ORIGIN = ALLOWLIST.googleForms;
const FRAME = "iframe[data-register-form]";

/** A stand-in for the form: one page whose button navigates the frame. */
async function stubForm(page: Page): Promise<void> {
  await page.route(`${FORM_ORIGIN}/**`, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: `<!doctype html><title>Formular</title><body style="margin:0;height:600px">
        <form method="get" action=""><input name="p" value="2"><button type="submit">Weiter</button></form>
      </body>`,
    }),
  );
}

function conversions(page: Page): string[] {
  const seen: string[] = [];
  page.on("console", (message) => {
    const text = message.text();
    if (text.includes("[analytics:mock] conversion")) seen.push(text);
  });
  return seen;
}

test.describe("TS-WEB-0023 D10: the registration route embeds the live site's Google Form", () => {
  for (const locale of ["de", "en"] as const) {
    test(`TS-WEB-0023-A17: exactly one frame, of the configured form, titled and visible (${locale})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      const response = await page.goto(href("register", locale));
      expect(response?.status()).toBe(200);

      const frames = page.locator("iframe");
      await expect(frames).toHaveCount(1);
      const frame = page.locator(FRAME);
      await expect(frame).toHaveAttribute("src", leadFormEmbedUrl());
      const src = new URL((await frame.getAttribute("src")) ?? "");
      expect(src.origin).toBe(FORM_ORIGIN);
      expect(src.searchParams.get("embedded")).toBe("true");
      await expect(frame).toHaveAttribute("title", /\S/);
      await expect(frame).toBeVisible();

      // Visible and immediate (TS-WEB-0016 D15 "Shape"): no `details`, no
      // `hidden` ancestor, no click-to-load control in front of it.
      const wrapped = await frame.evaluate((element) => element.closest("details, [hidden], [aria-hidden='true']") !== null);
      expect(wrapped).toBe(false);
      await expect(page.locator("#register-form").locator("button, summary, dialog, [role='dialog']")).toHaveCount(0);
      // Responsive width: the container's width on a phone, never wider than the viewport.
      const box = await frame.boundingBox();
      expect(box?.width ?? 0).toBeGreaterThan(300);
      expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(390);
    });
  }

  for (const viewport of [
    { width: 390, height: 844, reserved: 2300 },
    { width: 1280, height: 800, reserved: 1900 },
  ]) {
    test(`TS-WEB-0023-A18: the frame's height is reserved before the form answers, and holds the form without an inner scrollbar (${viewport.width})`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      // Before: the form host never answers, so the box is what the page reserved.
      await page.route(`${FORM_ORIGIN}/**`, () => {});
      await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
      const frame = page.locator(FRAME);
      const reserved = await frame.boundingBox();
      expect(reserved?.height).toBe(viewport.reserved);
      const bandBefore = await page.locator("#context-band").boundingBox();
      await page.unroute(`${FORM_ORIGIN}/**`);

      // After: the real form, loaded — the same box, nothing below it moved,
      // and the form's first page fits inside it.
      await page.goto(ROUTE);
      const formFrame = page.frameLocator(FRAME);
      await expect(formFrame.locator("body")).toBeVisible({ timeout: 20_000 });
      const loaded = await frame.boundingBox();
      expect(loaded?.height).toBe(viewport.reserved);
      expect((await page.locator("#context-band").boundingBox())?.y).toBe(bandBefore?.y);
      const inner = page.frames().find((candidate) => candidate.url().startsWith(FORM_ORIGIN));
      expect(inner, "the framed form").toBeDefined();
      const scrollHeight = await inner!.evaluate(() => document.documentElement.scrollHeight);
      expect(scrollHeight, "the form's page 1 fits the reserved height").toBeLessThanOrEqual(viewport.reserved);
    });
  }

  test("TS-WEB-0023-A22: moving on inside the form fires register-as-publisher once; loading the page fires nothing", async ({
    page,
  }) => {
    const fired = conversions(page);
    await stubForm(page);
    await page.goto(ROUTE);
    const frame = page.locator(FRAME);
    await expect(frame).toHaveAttribute("data-hydrated", "true");
    const form = page.frameLocator(FRAME);
    await expect(form.getByRole("button", { name: "Weiter" })).toBeVisible();
    // The initial load is nobody's action.
    await page.waitForTimeout(500);
    expect(fired).toEqual([]);

    // Two navigations inside the frame: the first is the handover, the second is not counted again.
    for (let step = 0; step < 2; step += 1) {
      const navigated = page.waitForEvent("framenavigated", (navigatedFrame) => navigatedFrame !== page.mainFrame());
      await form.getByRole("button", { name: "Weiter" }).click();
      await navigated;
      await expect(form.getByRole("button", { name: "Weiter" })).toBeVisible();
    }
    await expect.poll(() => fired.length).toBe(1);
    expect(fired[0]).toContain("register-as-publisher");
    expect(fired[0]).toContain("handover");
    expect(fired.some((text) => text.includes("publish-first-event"))).toBe(false);
  });

  test("TS-WEB-0023-A12: no envoy element, no POST route, no server action on this route", async ({ page }) => {
    // Our document's own requests: the framed form's are Google's (DEC-0121 §6).
    const requests: string[] = [];
    page.on("request", (request) => {
      if (request.frame() === page.mainFrame() && request.method() !== "GET") {
        requests.push(`${request.method()} ${request.url()}`);
      }
    });
    await stubForm(page);
    await page.goto(ROUTE);
    await expect(page.locator(FRAME)).toHaveAttribute("data-hydrated", "true");
    expect(requests).toEqual([]);
    // Scoped to `main`: the footer's contact widget is site-wide chrome.
    await expect(page.locator("main [data-envoy-form-kind]")).toHaveCount(0);
  });

  test("TS-WEB-0023-A14: the route canonicalises to the parameter-free path", async ({ page }) => {
    await stubForm(page);
    await page.goto(`${ROUTE}?ort=schlatkow`);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toMatch(new RegExp(`${ROUTE}$`));
  });
});
