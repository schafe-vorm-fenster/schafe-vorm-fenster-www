import { LOCALES } from "@/src/lib/i18n/locales";
import {
  alternateUrls,
  canonicalUrl,
  ROUTE_IDS,
} from "@/src/lib/routes/routes";

import type { MetadataRoute } from "next";

/**
 * The sitemap — TS-WEB-0004 D1/A5, TS-WEB-0011.
 *
 * Built from the route registry, so it cannot list a URL that does not exist
 * and cannot miss one that does — one entry **per route, per locale**
 * (`ROUTE_IDS × LOCALES`), each carrying the full hreflang-equivalent set as
 * its `alternates.languages` from the same row TS-WEB-0001 D6's `<link
 * rel="alternate">` set comes from, so the two can never drift apart. No
 * entry carries a query parameter (TS-WEB-0011 D9/D6 last row: `etcc_*` never
 * appears here).
 *
 * ### M4 domain-matrix decision, recorded
 *
 * TS-WEB-0004 D1's per-domain narrowing (landing-only domains list `/`, the
 * legal routes and the machine surfaces only) is **not** built here. Two
 * reasons hold it back, not just one missing input:
 *
 *   1. `sitemap.ts` is a cached, static route (no per-request host) —
 *      reading the request host here would make the sitemap
 *      per-request, which contradicts the same cacheability argument
 *      DEC-0038/TS-WEB-0001 D3 make for pages.
 *   2. `robots.ts` (TS-WEB-0015 D3, not owned by this work package) hard-links
 *      the single canonical `/sitemap.xml` URL; splitting this file with
 *      `generateSitemaps()` moves the output to `/sitemap/[id].xml` and
 *      would silently break that reference and its test.
 *
 * The landing-only domains (`.pl`, `.at`, `.com`) also have no distinct page
 * content of their own yet in this app tree (`src/lib/routes/host-matrix.ts`
 * documents the same gap for `proxy.ts`'s locale logic) — narrowing the
 * sitemap ahead of that content would just omit real, currently-identical
 * pages. Recorded as an open point (`state/open.md`) rather than built
 * partially.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTE_IDS.flatMap((route) =>
    LOCALES.map((locale) => ({
      url: canonicalUrl(route, locale),
      alternates: { languages: alternateUrls(route) },
    })),
  );
}
