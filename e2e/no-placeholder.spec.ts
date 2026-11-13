import { expect, test } from "@playwright/test";

import { everyRoute, href } from "../src/lib/routes/routes";

/**
 * TS-WEB-0007-A19 — a placeholder for missing proof never reaches the website
 * (DEC-0175 §3, owner's review of 2026-10-27, issue 105).
 *
 * Until that review `/ueber-uns` rendered a hatched card "Beleg fehlt — Hier
 * steht die Stimme einer Veröffentlichenden oder eines Bürgermeisters, sobald
 * eine Freigabe dafür vorliegt." in its proof stream, and four other pages
 * rendered a flat panel where no proof cleared. The rule is now that a missing
 * proof renders **nothing**. This walk holds it on every route the registry
 * knows, in both languages, against whatever build the suite runs on — in CI
 * that is the production build.
 *
 * Three readings, so that neither a new marker nor a new component slips by:
 *
 *  1. no element carries the missing-proof marker `data-empty-proof`;
 *  2. the served HTML carries neither the label nor the sentence the stand-in
 *     used, in either language — hidden text counts, a crawler reads it too;
 *  3. no element in `#main` carries a placeholder hatch class of a proof
 *     position (`empty-proof`, `proof-slot`, `missing-proof`).
 */

const ROUTES = everyRoute().map(({ route, locale }) => ({ path: href(route, locale), locale }));

/** The stand-in's words, both locales — the label and the opening of the sentence. */
const PLACEHOLDER_TEXT = [
  /Beleg fehlt/i,
  /Proof missing/i,
  /Hier steht die Stimme einer/i,
  /own voice stands here as soon as/i,
  /noch kein freigegebener Beleg/i,
];

test.describe("TS-WEB-0007-A19: no missing-proof placeholder on any route", () => {
  for (const { path } of ROUTES) {
    test(`TS-WEB-0007-A19: ${path} renders no placeholder for a missing proof`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status(), `${path} answers`).toBeLessThan(400);

      await expect(page.locator("[data-empty-proof]"), `${path}: data-empty-proof`).toHaveCount(0);

      const html = await page.content();
      for (const pattern of PLACEHOLDER_TEXT) {
        expect(html, `${path}: ${pattern}`).not.toMatch(pattern);
      }

      const hatched = await page
        .locator("#main [class]")
        .evaluateAll((nodes) =>
          nodes.filter((node) => /empty-?proof|proof-?slot|missing-?proof/i.test(node.getAttribute("class") ?? ""))
            .length,
        );
      expect(hatched, `${path}: a proof placeholder class`).toBe(0);
    });
  }
});
