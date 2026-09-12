import { expect, test } from "@playwright/test";

/**
 * F-3-11 — the footer newsletter mock must not throw the page away.
 *
 * The block stands in the footer of all 24 routes and was the only `<form>`
 * on the site with neither `action` nor `onSubmit`, so "Anmelden" performed a
 * real full-page GET navigation to the current path with the current query
 * **replaced** by the serialized form fields. Three manifestations, one
 * defect (C3-A-01/02/03): every other form on the page comes back empty, the
 * URL-is-the-state flows lose `?orte=` / `?ort=` / `?wer=` and fall back to
 * step 1, and the "submission" itself says nothing at all.
 *
 * The pattern to hold it to is `envoy-form-mount`'s, one directory away:
 * cancel the default and swap in a `role="status"` confirmation. The input
 * keeps its missing `name`, so no address leaves the browser in any branch —
 * Q-020 (`state/open.md` row 22) stays open and untouched.
 */

const NEWSLETTER_SUBMIT = '[data-newsletter] button[type="submit"]';

test.describe("F-3-11: the newsletter mock confirms, and keeps the page", () => {
  test("keeps an unsent quote form and the URL, and confirms in a live region", async ({
    page,
  }) => {
    await page.goto("/deine-region/angebot");
    const urlBefore = page.url();

    const firstQuoteField = page.locator('form[data-envoy-state] input[type="text"]').first();
    await firstQuoteField.fill("Beispielgemeinde Musterdorf");

    await page.locator("#newsletter-email").fill("jemand@beispiel.de");
    await page.locator(NEWSLETTER_SUBMIT).click();

    // No navigation: the quote form still holds what was typed into it, and
    // the address bar is untouched.
    await expect(page.locator('[data-newsletter] [role="status"]')).toBeVisible();
    expect(page.url()).toBe(urlBefore);
    await expect(firstQuoteField).toHaveValue("Beispielgemeinde Musterdorf");
  });

  test("does not reset a flow route's step", async ({ page }) => {
    await page.goto("/mitmachen/registrieren?ort=beispielwalde&wer=gemeinde");
    const urlBefore = page.url();

    await page.locator("#newsletter-email").fill("jemand@beispiel.de");
    await page.locator(NEWSLETTER_SUBMIT).click();

    await expect(page.locator('[data-newsletter] [role="status"]')).toBeVisible();
    expect(page.url()).toBe(urlBefore);
  });

  test("confirms in English on the English pages", async ({ page }) => {
    await page.goto("/en/take-part");
    await page.locator("#newsletter-email").fill("someone@example.com");
    await page.locator(NEWSLETTER_SUBMIT).click();

    const status = page.locator('[data-newsletter] [role="status"]');
    await expect(status).toBeVisible();
    await expect(status).toContainText("Thank you");
  });

  test("no address can leave the browser: the input stays unnamed", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#newsletter-email")).not.toHaveAttribute("name", /.*/);
  });
});
