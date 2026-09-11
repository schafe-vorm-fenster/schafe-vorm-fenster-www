import { NextResponse } from "next/server";

import { leadFallbackUrl } from "@/src/lib/routes/lead-fallback";
import { NOINDEX } from "@/src/lib/seo/indexable";

/**
 * `/start` — TS-004 D1's one redirect-only row, TS-016 D6.
 *
 * "Redirect only, renders nothing": the lead fallback's indirection target,
 * so no lead surface hard-codes a third-party URL. The redirect is
 * **temporary** on purpose — D6 says the target changes when the envoy widget
 * lands, and a 301 would be cached in visitors' browsers past that swap.
 *
 * D1: the row carries `noindex` and is absent from the sitemap. The sitemap
 * is built from the page registry, which this path is not in, so the second
 * half holds by construction.
 */
export function GET(): NextResponse {
  const response = NextResponse.redirect(leadFallbackUrl(), 302);
  response.headers.set("X-Robots-Tag", NOINDEX);
  return response;
}
