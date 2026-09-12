import { expect, test } from "@playwright/test";

/**
 * F-3-14 — step 1 of the registration flow must answer a search that finds
 * nothing.
 *
 * The boundary-tester persona clicked "Suchen" with the field empty, and
 * separately with 80 characters of junk in it: in both cases the page
 * silently re-rendered itself with `?ort=` appended (empty, or the junk
 * string) and nothing else changed. No validation message, no "not found"
 * state, no visible difference at all — on step 1 of a conversion path
 * (C3-B-2).
 *
 * The answer already exists one click away: the same value on
 * `/dein-ort/starten?ort=99999` gets a designed empty state — "99999 steht
 * noch nicht im Dorfkalender." plus a call to action. This wires that answer
 * in; it does not design a new one.
 */

test("F-3-14: an empty field does not submit at all", async ({ page }) => {
  await page.goto("/mitmachen/registrieren");
  const before = page.url();

  await page.getByRole("search").getByRole("button").click();
  await page.waitForTimeout(400);

  expect(page.url(), "an empty search must not navigate").toBe(before);
  expect(
    await page.locator("#ort-suche").evaluate((el: HTMLInputElement) => el.validationMessage),
    "the browser's own validation message",
  ).not.toBe("");
});

test("F-3-14: an uncovered postcode gets the founding page's empty state", async ({
  page,
}) => {
  await page.goto("/mitmachen/registrieren?ort=99999");

  const empty = page.locator("[data-place-not-found]");
  await expect(empty).toBeVisible();
  await expect(empty).toContainText("Dorfkalender");
  // TS-023-A5: an unresolvable value is echoed **only** in the search field.
  // So the empty state names no place, and the typed value travels in the
  // call to action's URL — to the founding page, which TS-021 D6 does let
  // name it.
  await expect(empty).not.toContainText("99999");
  await expect(empty.getByRole("link")).toHaveAttribute(
    "href",
    /dein-ort\/starten\?.*ort=99999/,
  );
});

test("F-3-14: junk input gets the placeless empty state, not silence", async ({ page }) => {
  await page.goto(`/mitmachen/registrieren?ort=${"x".repeat(80)}`);

  const empty = page.locator("[data-place-not-found]");
  await expect(empty).toBeVisible();
  await expect(empty).toContainText("Dorfkalender");
});

test("F-3-14: the empty state is English on the English flow", async ({ page }) => {
  await page.goto("/en/take-part/register?ort=99999");

  const empty = page.locator("[data-place-not-found]");
  await expect(empty).toBeVisible();
  await expect(empty).toContainText("village calendar");
  await expect(empty).not.toContainText("99999");
});

test("F-3-14: a resolved place still advances, untouched", async ({ page }) => {
  await page.goto("/mitmachen/registrieren?ort=beispielwalde");
  await expect(page.locator("[data-place-not-found]")).toHaveCount(0);
});
