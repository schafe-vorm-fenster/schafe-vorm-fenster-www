import { expect, test } from "@playwright/test";

import { href } from "../src/lib/routes/routes";

/**
 * TS-WEB-0008 D7 — the place search, end to end.
 *
 * Two things only a browser can establish, which is why they are here and not
 * in the BFF's integration tests:
 *
 *  1. the typeahead is a **real enhancement** — typing a name reaches
 *     `/api/places/search`, a suggestion appears, and following it lands on
 *     the place's own page;
 *  2. the plain GET form still works **with JavaScript disabled**, which is
 *     the guarantee the enhancement is not allowed to cost.
 */

const SEARCH = "Schlat";
const PLACE = "Schlatkow";

/**
 * `/dein-ort` renders the module twice, so each instance carries its own DOM
 * id (`place-search`'s `id` prop). The focus block's is the one the page's
 * primary conversion sits on.
 */
const FIELD = "#ort-suche-fokus";

test.describe("the typeahead suggests a covered place by name", () => {
  test("type → suggestion → the place's page", async ({ page }) => {
    await page.goto(href("place", "de"));

    const field = page.locator(FIELD);
    await field.fill(SEARCH);

    const suggestion = page.getByRole("option", { name: PLACE });
    await expect(suggestion).toBeVisible({ timeout: 10_000 });

    // The input is a combobox only once the popup is open — the enhancement
    // adds the role, it is not in the prerendered markup.
    await expect(field).toHaveAttribute("aria-expanded", "true");

    await suggestion.click();
    await expect(page).toHaveURL(/[?&]ort=schlatkow\b/u);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("asks nothing below two characters", async ({ page }) => {
    const calls: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/places/search")) calls.push(request.url());
    });

    await page.goto(href("place", "de"));
    await page.locator(FIELD).fill("S");
    await page.waitForTimeout(600);

    expect(calls, "a single letter must not reach the BFF").toEqual([]);
    await expect(page.getByRole("listbox")).toHaveCount(0);
  });
});

test.describe("the search works without the enhancement", () => {
  test.use({ javaScriptEnabled: false });

  test("the plain GET form still resolves a place", async ({ page }) => {
    await page.goto(href("place", "de"));
    await page.locator(FIELD).fill(PLACE);
    await page.locator(FIELD).press("Enter");

    await expect(page).toHaveURL(/[?&]ort=/u);
    // No listbox can exist here, and the page still answers 200 with its own
    // shell — TS-WEB-0020 D2's "never an error page".
    await expect(page.getByRole("listbox")).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
