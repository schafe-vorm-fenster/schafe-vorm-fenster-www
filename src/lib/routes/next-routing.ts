/**
 * The URL mapping, derived from the route table — TS-004 D3 and D3a.
 *
 * Public URL → internal App Router path, as a pure function of the path.
 * Three rules, in the order Next.js evaluates them (redirects before
 * rewrites):
 *
 *   0. the legacy redirect map (TS-011 D1) — before any locale rule;
 *   1. `/de/…` requested literally → 301 to the bare path (TS-004 D3.1);
 *   2. a bare path → invisible rewrite to `/de/…` (TS-004 D3.2);
 *      an `/en/…` path → invisible rewrite to its German-segment twin,
 *      because the app tree's directory names are the German segments.
 *
 * Everything else falls through to `app/[lang]/[...rest]`, which answers the
 * localized 404 (TS-004 D3.4). The host-dependent rules of D3 — landing-only
 * domains, the apex/`app.*` phasing, `/:community` forwarding — are M4 and
 * belong in `proxy.ts`, which has the request host.
 */

import { DEFAULT_LOCALE, LOCALES } from "../i18n/locales";
import { LEGACY_REDIRECTS } from "./redirect-map";
import { href, internalPath, ROUTE_IDS } from "./routes";

export interface NextRewrite {
  readonly source: string;
  readonly destination: string;
}

export interface NextRedirect {
  readonly source: string;
  readonly destination: string;
  /**
   * **301, not 308.** TS-001 D4, TS-004-A2 and TS-011 D1 all name 301, and
   * Next.js `permanent: true` emits 308 — a different status with different
   * method-rewriting semantics. `statusCode` states the one the specs fixed.
   */
  readonly statusCode: 301;
}

/**
 * Rule 2 — every public path of the inventory, mapped onto its internal
 * route. Explicit rows, not a catch-all regex: the inventory is finite and
 * a table that lists it cannot accidentally swallow `/robots.txt`.
 */
export function localeRewrites(): NextRewrite[] {
  const rewrites: NextRewrite[] = [];
  for (const route of ROUTE_IDS) {
    for (const locale of LOCALES) {
      const source = href(route, locale);
      const destination = internalPath(route, locale);
      if (source !== destination) rewrites.push({ source, destination });
    }
  }
  return rewrites;
}

/** Rule 1 — the redundant default prefix is not a second URL for a page. */
export function localeRedirects(): NextRedirect[] {
  return [
    { source: `/${DEFAULT_LOCALE}`, destination: "/", statusCode: 301 },
    {
      source: `/${DEFAULT_LOCALE}/:path*`,
      destination: "/:path*",
      statusCode: 301,
    },
  ];
}

/** Rule 0 — the legacy map, as Next.js redirect rows (TS-011 D1). */
export function legacyRedirects(): NextRedirect[] {
  return LEGACY_REDIRECTS.flatMap((row) => {
    const target = { destination: row.to, statusCode: 301 } as const;
    // A wildcard row also catches the bare path itself (`/hilfe`).
    return row.wildcard
      ? [
          { source: row.from, ...target },
          { source: `${row.from}/:path*`, ...target },
        ]
      : [{ source: row.from, ...target }];
  });
}

/** Everything `next.config.ts` needs, in evaluation order. */
export function redirectTable(): NextRedirect[] {
  return [...legacyRedirects(), ...localeRedirects()];
}
