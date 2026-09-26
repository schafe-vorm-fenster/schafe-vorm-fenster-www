import { expect, test } from "@playwright/test";

import { everyRoute, href } from "../src/lib/routes/routes";

/**
 * The **rendered** halves of two rows whose static half lives in
 * `src/lib/content/validate.ts` (TS-WEB-0007 D12 rows 11/13, DEC-0136).
 *
 * The static lint reads a content artifact, which is a text file: it knows a
 * field's label and not whether the page sets that field as an `h2` or as a
 * paragraph. That gap cost copy once — `dein-ort-starten-5-search` carried the
 * polish brief's quiet line (*„Falsch getippt? Nochmal suchen"*, page 3 fix 3)
 * under a `Überschrift` label, the lint read the label, and the first repair
 * cut the owner's question instead of correcting the label. Here the render is
 * the instrument:
 *
 * - `CG-005` / TS-WEB-0006-A8 — no `h2` a visitor reads is a question. The
 *   hero `h1` is exempt (`CG-020`), and a form step's own question to the
 *   reader is that step's `h1` (`CG-006`, `/dein-kalender/bestellen`).
 * - TS-WEB-0018-A7 — header, footer and context band of every TS-WEB-0004 D1
 *   route render without the product name in `de` and `en`; `/dein-kalender`
 *   is the only route whose body may carry it, at most once. `checkProductName`
 *   counts the fields of the artifacts; the chrome is not in an artifact, so
 *   only a rendered route can answer this half.
 */

/** `CG-038` — the one product name, counted as it is written (DEC-0106). */
const PRODUCT_NAME = "Portalize";

/** The one route whose body may carry the name, in its tier block. */
const PRODUCT_NAME_ROUTE = "calendar";

/**
 * `/rechtliches` carries the name seven times and is exempt here — measured,
 * not assumed: `content/legal/{privacy-policy,terms-of-use,dpa}.md` name
 * „Portalize" as the contractual product („Wenn du unseren eingebetteten
 * Kalender siehst („Portalize")", privacy-policy.md:91; terms-of-use.md:99;
 * dpa.md:54). Those five bodies are imported verbatim from the legal texts
 * (DEC-0012, DEC-0027) and are not page artifacts, which is why the same route
 * is the one exemption of the register row (TS-WEB-0029 D6a/A15,
 * `REGISTER_EXEMPT_ROUTES`). TS-WEB-0018-A7's wording — "`/dein-kalender` is
 * the only route whose body may contain one" — does not carry that exemption,
 * so **A7 is not met on the render** and this exemption does not make it met:
 * the contradiction is registered as CONF-0027 (with DEC-0136 §10 as its
 * decision record) for the spec owner, and the exemption keeps the other
 * twenty-two route/locale pairs under guard in the meantime.
 */
const PRODUCT_NAME_EXEMPT_ROUTES = ["legal"];

/**
 * The chrome of a page: what every route repeats around its own copy. Each
 * selector must resolve, or the assertion under it would pass by reading
 * nothing — a renamed id has to fail this test, not silence it.
 *
 * The order flow is the one documented exception: `/dein-kalender/bestellen`
 * and `/en/your-calendar/order` render no context band (TS-WEB-0025 D2 — the
 * form is the page), measured as 0 occurrences of `#context-band` against 1 on
 * every other route.
 */
const CHROME = ["header", "footer", "#context-band"];

/** Routes that render no `#context-band`, with the reason above. */
const NO_CONTEXT_BAND_ROUTES = ["order"];

/**
 * Routes that render no `h2` at all, listed for the same reason the context
 * band has a list: the `CG-005` loop below reads the section titles of a page,
 * and a route that renders none would satisfy it by reading an empty list. The
 * list is asserted in both directions — a route named here must render zero
 * `h2`, every other route at least one — so a page whose titles drift to `h3`
 * fails this test instead of quietly leaving the rule unexercised.
 */
const NO_SECTION_TITLE_ROUTES: string[] = [];

const ROUTES = everyRoute().map(({ route, locale }) => ({
  path: href(route, locale),
  route,
  locale,
}));

for (const { path, route, locale } of ROUTES) {
  test(`copy structure: ${path} (${route}/${locale}) states its titles and keeps the product name out of the chrome`, async ({
    page,
  }) => {
    await page.goto(path);

    // CG-005's rendered half: a section title is a statement. The titles are
    // counted before they are read, so a route that renders none — or one whose
    // titles drift to `h3` — fails here instead of passing on an empty list.
    const sectionTitles = await page.locator("h2").allInnerTexts();
    if (NO_SECTION_TITLE_ROUTES.includes(route)) {
      expect(
        sectionTitles.length,
        `${path} renders a section title the exception list denies it`,
      ).toBe(0);
    } else {
      expect(
        sectionTitles.length,
        `${path} renders no \`h2\` — no section title would be read`,
      ).toBeGreaterThan(0);
    }
    for (const heading of sectionTitles) {
      expect(
        heading.includes("?"),
        `${path} renders the section title "${heading.trim()}" as a question — CG-005 puts the question in the kicker above it`,
      ).toBe(false);
    }

    // TS-WEB-0018-A7, first half: the chrome names no product. The selector is
    // asserted before it is read, so a renamed id fails here instead of
    // reading an empty list and passing.
    for (const selector of CHROME) {
      const found = await page.locator(selector).count();
      if (selector === "#context-band" && NO_CONTEXT_BAND_ROUTES.includes(route)) {
        // The documented exception, asserted rather than skipped: if the order
        // flow ever gains a context band, this list is what needs updating.
        expect(found, `${path} renders a \`${selector}\` the exception list denies it`).toBe(0);
      } else {
        expect(found, `${path} resolves no \`${selector}\` — nothing would be read`).toBeGreaterThan(
          0,
        );
      }
      for (const text of await page.locator(selector).allInnerTexts()) {
        expect(
          text.includes(PRODUCT_NAME),
          `${path} renders "${PRODUCT_NAME}" in \`${selector}\``,
        ).toBe(false);
      }
    }

    // TS-WEB-0018-A7, second half: the body count, per route and locale.
    if (!PRODUCT_NAME_EXEMPT_ROUTES.includes(route)) {
      const body = await page.locator("body").innerText();
      const occurrences = body.split(PRODUCT_NAME).length - 1;
      expect(
        occurrences,
        `${path} renders "${PRODUCT_NAME}" ${occurrences}×`,
      ).toBeLessThanOrEqual(route === PRODUCT_NAME_ROUTE ? 1 : 0);
    }
  });
}

/**
 * The quiet line the lint's label reading nearly deleted. It is a question on
 * purpose — the visitor who mistyped her place is asked, under the closing CTA
 * and never as a section of its own (plan/polish-brief.md page 3, fix 3) — so
 * it is authored as a `Frage` / `Question` field and rendered as a paragraph.
 */
for (const { locale, line } of [
  { locale: "de", line: "Falsch getippt?" },
  { locale: "en", line: "Mistyped?" },
] as const) {
  const path = href("placeStart", locale);
  test(`copy structure: ${path} keeps the mistyped-search line as a question in a paragraph`, async ({
    page,
  }) => {
    await page.goto(path);
    const quietLine = page.locator("#search-again p").first();
    await expect(quietLine).toContainText(line);
    // Not an `h2`: the render is what makes the question legal here.
    await expect(page.locator("#search-again h2")).toHaveCount(0);
  });
}
