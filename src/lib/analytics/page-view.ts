/**
 * Page names and areas — DEC-0218 §2, TS-WEB-0012 D2.
 *
 * eTracker groups page views by `et_pagename` and `et_areas`. Left to itself
 * the loader names a page after its URL, which splits one page into two rows
 * (`/dein-ort` and `/en/your-place`) and renames it whenever a path segment
 * changes. The names here are built from the **route id** and the language
 * instead, so they are stable across URL changes and the two languages of a
 * page sit side by side:
 *
 * | Route            | `et_pagename`         | `et_areas`     |
 * | ---------------- | --------------------- | -------------- |
 * | `/`              | `de/home`             | `de/home`      |
 * | `/dein-kalender/bestellen` | `de/calendar/order` | `de/calendar` |
 * | `/en/about/archive` | `en/about/archive` | `en/about`     |
 * | anything that answers 404 | `de/not-found` | `de/not-found` |
 *
 * The name is the route's breadcrumb trail (`trail()`, the route table's own
 * parent chain), so a child page always nests under its parent's area.
 */

import { trail, type RouteId } from "@/src/lib/routes/routes";

import type { Locale } from "@/src/lib/i18n/locales";

/** The segment a page without a route — the 404 body — is counted under. */
export const NOT_FOUND_PAGE = "not-found";

export interface PageView {
  /** `undefined` for the 404 body. */
  readonly route: RouteId | undefined;
  readonly locale: Locale;
  /** `et_pagename` — `<lang>/<trail>`. */
  readonly pageName: string;
  /** `et_areas` — `<lang>/<top-level section>`. */
  readonly areas: string;
}

export function pageView(route: RouteId | undefined, locale: Locale): PageView {
  const segments: readonly string[] = route ? trail(route) : [NOT_FOUND_PAGE];
  return {
    route,
    locale,
    pageName: `${locale}/${segments.join("/")}`,
    areas: `${locale}/${segments[0]}`,
  };
}
