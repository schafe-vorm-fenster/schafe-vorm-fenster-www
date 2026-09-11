import { href } from "@/src/lib/routes/routes";

import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";

/**
 * Query and fragment on top of the route facade.
 *
 * The route table and `href()` live in `src/lib/routes/routes.ts` — one
 * source for every path on this website (TS-004 D3a). This module adds
 * nothing to it but the two parts a link may carry beyond the path, so that
 * no component builds a query string by hand and none of them ever types a
 * path (TS-001 D5).
 */
export interface LinkOptions {
  /** The language of the current page. Defaults to the TLD default. */
  readonly locale?: Locale;
  /** Query parameters, in insertion order. Empty values are dropped. */
  readonly query?: Readonly<Record<string, string | number | undefined>>;
  /** Fragment, without the leading `#`. */
  readonly hash?: string;
}

export function linkHref(route: RouteId, options: LinkOptions = {}): string {
  const { locale = "de", query, hash } = options;
  const path = href(route, locale);

  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const queryString = search.toString();

  return `${path}${queryString ? `?${queryString}` : ""}${hash ? `#${hash}` : ""}`;
}
