/**
 * The share image of a page — TS-WEB-0011 D6, FUN-WEB-0078.
 *
 * One image per (route, language), 1200 x 630, drawn at build time by
 * `app/api/og/[lang]/[route]/route.tsx` from the page's own `seo.title` and the
 * brand tokens. This module is the address and the alt text only, so that the
 * page metadata (`src/lib/routes/metadata.ts`), the image route and the tests
 * name the same URL.
 *
 * The path sits under `/api/` because that prefix is the one the proxy
 * (`not-found-routing.ts`, `RESERVED_PREFIXES`) lets through untouched; a file
 * convention path such as `/opengraph-image-<hash>` would be an unknown
 * asset-shaped URL to it and be answered with the 404.
 */

import { dictionary } from "@/src/lib/i18n/dictionary";
import { SITE_ORIGIN } from "@/src/lib/routes/routes";

import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";

export const SHARE_IMAGE_SIZE = { width: 1200, height: 630 } as const;
export const SHARE_IMAGE_TYPE = "image/png";

/** The absolute URL of a page's share image (scrapers need an absolute one). */
export function shareImageUrl(route: RouteId, locale: Locale): string {
  return `${SITE_ORIGIN}/api/og/${locale}/${route}`;
}

/**
 * The image's alt text: it shows the page title under the brand mark, so the
 * alt says exactly that, in the language of the page.
 */
export function shareImageAlt(title: string, locale: Locale): string {
  const brand = dictionary(locale).siteName;
  return title.includes(brand) ? title : `${brand} — ${title}`;
}
