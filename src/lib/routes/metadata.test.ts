import { describe, expect, it } from "vitest";

import { pageSeo } from "@/src/lib/content/page-seo";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { pageDescription, pageMetadata, pageTitle } from "@/src/lib/routes/metadata";
import { everyRoute, ROUTES } from "@/src/lib/routes/routes";

/**
 * TS-011 D5 and TS-021-A11: a page's title and description are **content**.
 * They come from the `seo` block of the page's own artifact, per route and
 * per language, and never from a template in code.
 *
 * F-2-72 is why this file exists: every route in both languages served
 * `… — Platzhalter aus dem Routing-Gerüst (M2). Titel und Beschreibung
 * kommen in M3 aus dem Content-Frontmatter (TS-011 D5).` as its meta
 * description — a work-package name and a spec-clause id in the one string
 * search engines index and link previews show. The guard is the same shape
 * `e2e/content-compliance.spec.ts` uses for visible copy, moved onto the
 * indexed surface, where `innerText` cannot see it.
 */

/** The id shapes this repository uses, plus the milestone names of the plan. */
const INTERNAL_IDS = [
  /\bTS-0\d{2}\b/,
  /TS-0/,
  /\bDEC-/,
  /\bQ-0\d{2}\b/,
  /\bSRC-0\d{2}\b/,
  /\bWEB-[A-Z]-?\d/,
  /\bF-\d-\d{1,2}\b/,
  /\bM[23]\b/,
  /Platzhalter/i,
  /Placeholder/i,
  /Routing-Gerüst/i,
  /routing skeleton/i,
];

describe("TS-011 D5: titles and descriptions come from the content frontmatter", () => {
  it.each(everyRoute())(
    "$route/$locale carries no internal identifier in title or description",
    ({ route, locale }) => {
      for (const value of [pageTitle(route, locale), pageDescription(route, locale)]) {
        for (const pattern of INTERNAL_IDS) {
          expect(pattern.exec(value)?.[0], `${route}/${locale}: "${value}"`).toBeUndefined();
        }
      }
    },
  );

  it.each(everyRoute())("$route/$locale has a non-empty title and description", ({ route, locale }) => {
    expect(pageTitle(route, locale).trim().length).toBeGreaterThan(0);
    expect(pageDescription(route, locale).trim().length).toBeGreaterThan(0);
  });

  it("reads the values a route's own artifact carries, not a template", () => {
    // Two routes that share one artifact still get two different documents:
    // `/deine-region/angebot` is specified together with `/deine-region` and
    // lives in its file, so the `seo` block is keyed per route.
    expect(pageTitle("region", "de")).not.toBe(pageTitle("regionQuote", "de"));
    expect(pageDescription("region", "de")).not.toBe(pageDescription("regionQuote", "de"));
  });

  it("emits the description into the metadata object and into OpenGraph", () => {
    const metadata = pageMetadata("takePart", "de");
    expect(metadata.description).toBe(pageDescription("takePart", "de"));
    expect(metadata.openGraph?.description).toBe(pageDescription("takePart", "de"));
  });

  it.each(everyRoute())(
    "$route/$locale writes its title in the language of the route",
    ({ route, locale }) => {
      // A German title on an English route is the failure DEC-026 forbids.
      expect(ROUTES[route].path[locale]).toBeTruthy();
      expect(pageTitle(route, locale)).not.toBe(
        locale === "de" ? pageTitle(route, "en") : pageTitle(route, "de"),
      );
    },
  );

  it.each(everyRoute())(
    "$route/$locale leaves room for the brand suffix the layout appends",
    ({ route, locale }) => {
      // D5 reads the 60-character title budget as including the suffix,
      // TS-011-A7 measures the page's own title alone, and
      // `scripts/check-seo-budget.ts` implements the criterion as written.
      // The stricter half is asserted here so both readings hold at once.
      // `/` is exempt by D5's own row: it carries the brand itself and the
      // layout template is bypassed (`title: { absolute }`).
      const suffix = ` — ${dictionary(locale).siteName}`;
      const rendered =
        route === "home" ? pageTitle(route, locale) : pageTitle(route, locale) + suffix;
      expect(rendered.length, `<title> of ${route}/${locale}: "${rendered}"`).toBeLessThanOrEqual(60);
    },
  );

  it.each(everyRoute())(
    "$route/$locale marks its generated title and description as such",
    ({ route, locale }) => {
      // The dummy-content rule (plan/guardrails.md): a slot without a source
      // gets generated copy, and the artifact metadata is what registers it.
      expect(pageSeo(route, locale)?.provenance).toBe("generated");
    },
  );
});
