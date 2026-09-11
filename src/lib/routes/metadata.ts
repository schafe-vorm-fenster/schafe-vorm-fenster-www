/**
 * Canonical and hreflang, derived from the route table — TS-001 D6, the
 * third consumer named by TS-004 D3a.
 *
 * Because both sides come out of one row, the alternate sets of the German
 * and the English variant of a page are symmetric by construction: there is
 * no second list that could fall out of step.
 *
 * Titles and descriptions come from the page's own content frontmatter
 * (TS-011 D5, TS-021-A11), through `src/lib/content/page-seo.ts`. This module
 * owns the *shape* of a page's metadata, never its copy — which is the point
 * of F-2-72: while the copy lived here, every route in both languages served
 * the routing skeleton's own note as its meta description, work-package name
 * and spec-clause id included.
 */

import { pageSeo } from "@/src/lib/content/page-seo";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { LOCALES, OG_LOCALE } from "@/src/lib/i18n/locales";
import {
  alternateUrls,
  canonicalUrl,
  SITE_ORIGIN,
} from "@/src/lib/routes/routes";

import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";
import type { Metadata } from "next";

/**
 * The page's own title (TS-011 D5).
 *
 * The fallback is the route's navigation name — real copy in the right
 * language, and the one string on this page that is guaranteed to exist
 * without the content tree. It is deliberately *not* a sentence assembled in
 * code: a page missing its `seo` block is a build failure
 * (`pnpm check:seo-budget`, TS-011-A7), not a shape the site is meant to
 * serve.
 */
export function pageTitle(route: RouteId, locale: Locale): string {
  return pageSeo(route, locale)?.title ?? dictionary(locale).pages[route];
}

/**
 * The page's own meta description (TS-011 D5), or the empty string where the
 * artifact carries none.
 *
 * Empty, not a generated stand-in: D5 forbids deriving a description from
 * body copy, so the honest answer to a missing one is no `<meta>` tag at all
 * plus a red A7 check — never a sentence about the state of the codebase.
 */
export function pageDescription(route: RouteId, locale: Locale): string {
  return pageSeo(route, locale)?.description ?? "";
}

/**
 * The metadata of one page in one language: title, description, the
 * self-canonical and the full hreflang set including `x-default`.
 */
export function pageMetadata(route: RouteId, locale: Locale): Metadata {
  const title = pageTitle(route, locale);
  // An absent description is omitted rather than emitted empty — see
  // `pageDescription`. Next drops an `undefined` field from the head.
  const description = pageDescription(route, locale) || undefined;
  const url = canonicalUrl(route, locale);

  return {
    metadataBase: new URL(SITE_ORIGIN),
    // The home page carries the brand itself, so the layout's
    // `%s — Schafe vorm Fenster` template would say it twice (TS-011 D5).
    title: route === "home" ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: alternateUrls(route),
    },
    openGraph: {
      type: "website",
      siteName: dictionary(locale).siteName,
      title,
      description,
      url,
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((other) => other !== locale).map(
        (other) => OG_LOCALE[other],
      ),
    },
  };
}
