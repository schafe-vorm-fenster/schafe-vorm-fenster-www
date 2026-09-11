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

import {
  contentSecurityPolicy,
  strictTransportSecurity,
} from "@/src/lib/security/csp";
import { environmentFrom, isIndexable, NOINDEX } from "@/src/lib/seo/indexable";

import type { NextRequest } from "next/server";

export function proxy(request: NextRequest): NextResponse {
  const response = NextResponse.next();
  const vercelEnv = process.env.VERCEL_ENV;
  const environment = environmentFrom(vercelEnv);

  // DEC-045: per-build hashes, no per-request nonce — the shell stays static.
  // The hash set is empty until the build-time extraction step lands
  // (state/open.md); `'strict-dynamic'` plus the CSP2 host fallback carry the
  // policy until then.
  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicy({ environment, scriptHashes: [] }),
  );

  const hsts = strictTransportSecurity(environment);
  if (hsts) response.headers.set("Strict-Transport-Security", hsts);

  if (!isIndexable(vercelEnv, request.headers.get("host"))) {
    response.headers.set("X-Robots-Tag", NOINDEX);
  }

  return response;
}
