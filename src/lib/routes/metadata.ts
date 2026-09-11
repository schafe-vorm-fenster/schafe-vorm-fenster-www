/**
 * Canonical and hreflang, derived from the route table — TS-001 D6, the
 * third consumer named by TS-004 D3a.
 *
 * Because both sides come out of one row, the alternate sets of the German
 * and the English variant of a page are symmetric by construction: there is
 * no second list that could fall out of step.
 *
 * Titles and descriptions are placeholders until M3, when they come from the
 * page's content frontmatter (TS-011 D5). This module owns the *shape* of a
 * page's metadata, never its copy.
 */

import { dictionary, placeholderDescription } from "@/src/lib/i18n/dictionary";
import { LOCALES, OG_LOCALE } from "@/src/lib/i18n/locales";
import {
  alternateUrls,
  canonicalUrl,
  SITE_ORIGIN,
} from "@/src/lib/routes/routes";

import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";
import type { Metadata } from "next";

export function pageTitle(route: RouteId, locale: Locale): string {
  return dictionary(locale).pages[route];
}

export function pageDescription(route: RouteId, locale: Locale): string {
  return placeholderDescription(locale, pageTitle(route, locale));
}

/**
 * The metadata of one page in one language: title, description, the
 * self-canonical and the full hreflang set including `x-default`.
 */
export function pageMetadata(route: RouteId, locale: Locale): Metadata {
  const title = pageTitle(route, locale);
  const description = pageDescription(route, locale);
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
