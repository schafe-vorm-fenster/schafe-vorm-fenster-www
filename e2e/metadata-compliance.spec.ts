import { expect, test } from "@playwright/test";

import { everyRoute, href } from "../src/lib/routes/routes";

/**
 * Metadata compliance — the indexed surface, TS-011 D5 and TS-021-A11.
 *
 * F-2-72: `e2e/content-compliance.spec.ts` greps what a visitor can read, and
 * it was green while every route in both languages served
 * "Schafe vorm Fenster — Platzhalter aus dem Routing-Gerüst (M2). Titel und
 * Beschreibung kommen in M3 aus dem Content-Frontmatter (TS-011 D5)." as its
 * meta description. `innerText` cannot see the head, so the work-package name
 * and the spec-clause id sat in the one string search engines index and link
 * previews display, on 24 of 24 routes, unseen by every check in the repo.
 *
 * This file is that grep, moved onto the head: `<title>`, the meta
 * description, and the two OpenGraph strings a link preview actually renders.
 * The route list is the inventory in `src/lib/routes/routes.ts`, never a typed
 * list of paths — a route added there is walked here the same day.
 *
 * The static half of the same rule is `src/lib/routes/metadata.test.ts`, which
 * checks the values without a server. Both exist on purpose: the unit test
 * catches the copy, this one catches the wiring, and only this one proves what
 * the server actually put in the document.
 */

/**
 * The id shapes this repository uses, plus the milestone names of the plan.
 *
 * Deliberately wider than the strings F-2-72 reported: `TS-0` matches with no
 * word boundary, because a metadata string has no business carrying the
 * prefix in any form.
 */
const INTERNAL_MARKERS = [
  /TS-0/,
  /DEC-/,
  /\bQ-0\d{2}\b/,
  /\bSRC-0\d{2}\b/,
  /\bWEB-[A-Z]-?\d/,
  /\bF-\d-\d{1,2}\b/,
  /\bM[23]\b/,
  /Platzhalter/i,
  /Placeholder/i,
  /Routing-Gerüst/i,
  /routing skeleton/i,
  /state\/open\.md/,
  /plan\/guardrails\.md/,
];

const ROUTES = everyRoute().map(({ route, locale }) => ({
  path: href(route, locale),
  route,
  locale,
}));

/** The head strings a search engine indexes and a link preview displays. */
async function indexedStrings(page: import("@playwright/test").Page) {
  const attribute = async (selector: string) =>
    await page.locator(selector).first().getAttribute("content");

  return {
    "<title>": await page.title(),
    'meta[name="description"]': await attribute('head meta[name="description"]'),
    'meta[property="og:title"]': await attribute('head meta[property="og:title"]'),
    'meta[property="og:description"]': await attribute('head meta[property="og:description"]'),
  };
}

for (const { path, route, locale } of ROUTES) {
  test(`TS-011 D5: ${path} (${route}/${locale}) indexes no internal identifier`, async ({
    page,
  }) => {
    await page.goto(path);
    const strings = await indexedStrings(page);

    for (const [where, value] of Object.entries(strings)) {
      // An absent tag is a different defect from a leaking one; the
      // non-empty assertion below is what reports it.
      if (value === null) continue;
      for (const pattern of INTERNAL_MARKERS) {
        const hit = pattern.exec(value);
        expect(
          hit,
          hit === null
            ? ""
            : `${path} ${where} carries the internal identifier "${hit[0]}": "${value}"`,
        ).toBeNull();
      }
    }
  });

  test(`TS-011 D5: ${path} (${route}/${locale}) has a title and a description of its own`, async ({
    page,
  }) => {
    await page.goto(path);
    const strings = await indexedStrings(page);

    for (const [where, value] of Object.entries(strings)) {
      expect(value, `${path} ${where}`).toBeTruthy();
      expect((value ?? "").trim().length, `${path} ${where} is blank`).toBeGreaterThan(0);
    }
  });
}

test("TS-011-A7: the walk covers both languages of every route", () => {
  expect(ROUTES).toHaveLength(24);
});
