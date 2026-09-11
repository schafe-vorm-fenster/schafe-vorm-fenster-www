/**
 * The `WebPage` node — TS-011 D4, emitted on every page: `inLanguage`,
 * `isPartOf` → `WebSite`, `primaryImageOfPage`, `description`.
 *
 * Title and description are content (D5) — this builder takes them as
 * input, it never invents them.
 */

import { WEBSITE_ID } from "./website";

import { HTML_LANG } from "@/src/lib/i18n/locales";
import { canonicalUrl } from "@/src/lib/routes/routes";

import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";

export interface WebPageNode {
  readonly "@type": "WebPage";
  readonly "@id": string;
  readonly url: string;
  readonly name: string;
  readonly description: string;
  readonly inLanguage: string;
  readonly isPartOf: { readonly "@id": string };
  readonly primaryImageOfPage?: { readonly "@type": "ImageObject"; readonly url: string };
}

export interface WebPageInput {
  readonly route: RouteId;
  readonly locale: Locale;
  readonly title: string;
  readonly description: string;
  /** D6: the page's own OG image, absolute — reused here per D4. */
  readonly imageUrl?: string;
}

export function webPageNode({
  route,
  locale,
  title,
  description,
  imageUrl,
}: WebPageInput): WebPageNode {
  const url = canonicalUrl(route, locale);
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: HTML_LANG[locale],
    isPartOf: { "@id": WEBSITE_ID },
    ...(imageUrl
      ? { primaryImageOfPage: { "@type": "ImageObject", url: imageUrl } }
      : {}),
  };
}
