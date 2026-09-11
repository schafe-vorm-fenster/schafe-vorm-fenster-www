import { LOCALES } from "@/src/lib/i18n/locales";
import {
  alternateUrls,
  canonicalUrl,
  ROUTE_IDS,
} from "@/src/lib/routes/routes";

import type { MetadataRoute } from "next";

/**
 * The sitemap — TS-004 D1/A5, TS-011.
 *
 * Built from the route registry, so it cannot list a URL that does not exist
 * and cannot miss one that does. Every entry carries its language alternates
 * from the same row the page's hreflang set comes from (TS-001 D6).
 *
 * Skeleton state: the full site (`.de`) in both its languages. The per-domain
 * narrowing of TS-004 D1 — landing-only domains list `/`, the legal routes
 * and the machine surfaces only — needs the request host and lands with the
 * domain matrix in M4. `/start` and the reserved `/deine-termine` are absent
 * by rule (TS-004 D1, D7).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTE_IDS.flatMap((route) =>
    LOCALES.map((locale) => ({
      url: canonicalUrl(route, locale),
      alternates: { languages: alternateUrls(route) },
    })),
  );
}
