/**
 * `BreadcrumbList` — TS-011 D4 / DEC-071: exactly the five second-level
 * pages, and no other page, emits one.
 */

import { canonicalUrl, ROUTES, trail } from "@/src/lib/routes/routes";

import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";

/** D4's exact five — every route with a `parent` in the route table. */
export const BREADCRUMB_ROUTES: readonly RouteId[] = (
  Object.keys(ROUTES) as RouteId[]
).filter((route) => ROUTES[route].parent !== undefined);

export interface BreadcrumbListNode {
  readonly "@type": "BreadcrumbList";
  readonly itemListElement: ReadonlyArray<{
    readonly "@type": "ListItem";
    readonly position: number;
    readonly name: string;
    readonly item: string;
  }>;
}

/**
 * `titleFor` supplies each trail item's visible name (content, D5) — this
 * builder only knows the path structure, never the copy.
 */
export function breadcrumbListNode(
  route: RouteId,
  locale: Locale,
  titleFor: (route: RouteId) => string,
): BreadcrumbListNode | undefined {
  if (!BREADCRUMB_ROUTES.includes(route)) return undefined;

  const items = trail(route);
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: titleFor(item),
      item: canonicalUrl(item, locale),
    })),
  };
}
