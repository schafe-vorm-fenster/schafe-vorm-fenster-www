/**
 * The `robots.txt` body — TS-015 D3, surface 2 of 3.
 *
 * Kept beside the predicate rather than inside `app/robots.ts` so the rule is
 * one pure function: the route is the wiring, this is the decision.
 */

import type { MetadataRoute } from "next";

import { isIndexable } from "@/src/lib/seo/indexable";

export function robotsFor(
  vercelEnv: string | undefined,
  host: string | null | undefined,
): MetadataRoute.Robots {
  if (!isIndexable(vercelEnv, host)) {
    // Non-production: disallow everything, and no sitemap reference.
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `https://${normalise(host)}/sitemap.xml`,
  };
}

function normalise(host: string | null | undefined): string {
  return (host ?? "").toLowerCase().split(":")[0] ?? "";
}
