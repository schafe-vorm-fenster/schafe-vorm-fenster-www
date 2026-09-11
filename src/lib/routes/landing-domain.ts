/**
 * TS-004 D1's landing-only domain rule, TS-004-A3 — the consumer
 * `host-matrix.ts`'s `kind: "landing"` never had (F-2-45).
 *
 * D1: the landing-only domains (`.pl`, `.at`, `sheepoutside.com`) "serve `/`,
 * the three legal routes, and the machine surfaces; every other path 404s."
 * Until this module existed the flag sat on the matrix with nothing reading
 * it, and `/mitmachen` answered 200 on all three.
 *
 * The rule lives here rather than in `next.config.ts` for the reason
 * `next-routing.ts` gives: it is host-dependent, and only `proxy.ts` has the
 * request host.
 *
 * ### What is deliberately *not* blocked
 *
 * The proxy has no matcher (TS-015 D3 runs it on "all routes incl. assets"),
 * so this predicate has to let the landing page's own assets through or the
 * one page the domain does serve would render unstyled. Two exemptions, both
 * narrow:
 *
 *  - `/_next/…` — the framework's own build output;
 *  - a path whose last segment ends in a static-asset extension, i.e. a file
 *    in `public/`. The extension list is closed; `/mitmachen` and
 *    `/anything-else` are not files and are blocked.
 *
 * Everything else — pages, `/api/…`, `/start` — 404s, which is what D1 says.
 */

import { servedOnLandingDomain } from "./url-inventory";

import type { DomainConfig } from "./host-matrix";

/** Extensions a file in `public/` can carry. Closed by intent. */
const ASSET_EXTENSIONS = [
  ".avif",
  ".css",
  ".gif",
  ".ico",
  ".jpeg",
  ".jpg",
  ".js",
  ".json",
  ".map",
  ".mjs",
  ".png",
  ".svg",
  ".webmanifest",
  ".webp",
  ".woff",
  ".woff2",
] as const;

/** True for a path the landing-only rule must let through regardless. */
export function isAssetPath(pathname: string): boolean {
  if (pathname.startsWith("/_next/")) return true;
  const lowered = pathname.toLowerCase();
  return ASSET_EXTENSIONS.some((extension) => lowered.endsWith(extension));
}

/**
 * TS-004-A3: does this domain refuse this path? False for every full-site
 * domain, for the landing set, and for assets.
 */
export function landingDomainBlocks(
  domain: DomainConfig,
  pathname: string,
): boolean {
  if (domain.kind !== "landing") return false;
  if (isAssetPath(pathname)) return false;
  return !servedOnLandingDomain(pathname);
}

/**
 * Where a blocked request is sent so Next answers with a **real** 404.
 *
 * Not `/_not-found`: that is a route, and a rewrite onto it is served with
 * status 200 on Vercel — the same trap `next.config.ts`'s `afterFiles`
 * comment records from M4. This path matches nothing in the tree
 * (`[lang]` runs with `dynamicParams = false` and there is no catch-all), so
 * Next falls through to its own 404 handling and `global-not-found` renders
 * with status 404.
 */
export const LANDING_NOT_FOUND_PATH = "/__landing-only";
