/**
 * The `WebSite` node — TS-011 D4, emitted only on `/` alongside the
 * `Organization` full node.
 */

import { ORGANIZATION_ID } from "./organization";

import { dictionary } from "@/src/lib/i18n/dictionary";
import { HTML_LANG } from "@/src/lib/i18n/locales";
import { SITE_ORIGIN } from "@/src/lib/routes/routes";

import type { Locale } from "@/src/lib/i18n/locales";

export const WEBSITE_ID = `${SITE_ORIGIN}/#website`;

export interface WebSiteNode {
  readonly "@type": "WebSite";
  readonly "@id": string;
  readonly url: string;
  readonly name: string;
  readonly inLanguage: string;
  readonly publisher: { readonly "@id": string };
}

export function websiteNode(locale: Locale): WebSiteNode {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_ORIGIN,
    name: dictionary(locale).siteName,
    inLanguage: HTML_LANG[locale],
    publisher: { "@id": ORGANIZATION_ID },
  };
}
