/**
 * Response headers for every request — TS-014 D4/D5, TS-015 D3.
 *
 * Two things live here rather than in `next.config.ts` `headers()`:
 *
 *  - the **CSP**, because it varies per environment (TS-014 D5) and because
 *    TS-014 D4 names exactly one source per header;
 *  - the **`X-Robots-Tag`**, because TS-015 D3 puts it on *all* routes
 *    including assets, and its predicate needs the request host.
 *
 * There is deliberately **no matcher**: D3 says "all routes incl. assets".
 * A `vercel.json` `headers` block would silently take precedence over both
 * this file and `next.config.ts` and is forbidden (TS-014 D4).
 */

import { NextResponse } from "next/server";

import { CSP_HASHES_ASSET_PATH, scriptHashes } from "@/src/lib/security/csp-hashes";
import {
  contentSecurityPolicy,
  strictTransportSecurity,
} from "@/src/lib/security/csp";
import { environmentFrom, isIndexable, NOINDEX } from "@/src/lib/seo/indexable";

import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.next();
  const vercelEnv = process.env.VERCEL_ENV;
  const environment = environmentFrom(vercelEnv);

  // DEC-045: per-build hashes, no per-request nonce — the shell stays static.
  // `scriptHashes()` fetches a build artifact from this deployment's own
  // static assets once per server instance (module scope caches the
  // in-flight promise), not per request, so this stays a pure function of
  // hostname + path (TS-004 D3). The one exception: the hash asset's own
  // request must not try to compute a hash-dependent policy for itself —
  // that would recurse into the same fetch this proxy has no matcher to
  // skip (TS-015 D3 runs it on "all routes incl. assets" on purpose).
  // `next dev` never produces the asset, so the set is `[]` there and
  // `csp.ts` falls back to `'unsafe-inline'` (dev only) instead of leaving
  // the inline scripts with nothing to trust — see `csp.ts` for why
  // `'strict-dynamic'` is not part of the policy at all (state/open.md rows
  // 21, 31).
  const hashes =
    request.nextUrl.pathname === CSP_HASHES_ASSET_PATH
      ? []
      : await scriptHashes(request.nextUrl.origin);

  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicy({ environment, scriptHashes: hashes }),
  );

  const hsts = strictTransportSecurity(environment);
  if (hsts) response.headers.set("Strict-Transport-Security", hsts);

  if (!isIndexable(vercelEnv, request.headers.get("host"))) {
    response.headers.set("X-Robots-Tag", NOINDEX);
  }

  return response;
}
