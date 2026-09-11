/**
 * Response headers, and the TS-001 locale logic, for every request —
 * TS-014 D4/D5, TS-015 D3, TS-001 D2/D3.
 *
 * Three things live here rather than in `next.config.ts` `headers()`/
 * `redirects()`:
 *
 *  - the **CSP**, because it varies per environment (TS-014 D5) and because
 *    TS-014 D4 names exactly one source per header;
 *  - the **`X-Robots-Tag`**, because TS-015 D3 puts it on *all* routes
 *    including assets, and its predicate needs the request host;
 *  - the **locale detection algorithm's host-dependent half** (TS-001 D1/D2):
 *    the canonical-host redirect and the Accept-Language suggestion signal
 *    both need the request host, which only the proxy has. The
 *    *path*-dependent half (D3's segment check, D4's URL grammar) is
 *    `next.config.ts`'s `redirects()`/`rewrites()` (`next-routing.ts`) and
 *    stays there — this file does not duplicate it.
 *
 * Execution order (Next's own doc, `proxy.md`): `next.config.js` `redirects`
 * run *before* this file, so the legacy map and the `/de/…` redundant-prefix
 * redirect (`next-routing.ts`) have already had their turn by the time the
 * canonical-host redirect below runs — the two never race.
 *
 * There is deliberately **no matcher**: D3 (TS-015) says "all routes incl.
 * assets", and the canonical-host redirect must catch every path on a
 * non-canonical host, assets included. A `vercel.json` `headers` block would
 * silently take precedence over both this file and `next.config.ts` and is
 * forbidden (TS-014 D4).
 */

import { NextResponse } from "next/server";

import { canonicalHostFor, domainConfigFor, normaliseHost } from "@/src/lib/routes/host-matrix";
import { suggestedLanguage, suggestionServerTiming } from "@/src/lib/routes/locale-suggestion";
import { CSP_HASHES_ASSET_PATH, scriptHashes } from "@/src/lib/security/csp-hashes";
import {
  contentSecurityPolicy,
  strictTransportSecurity,
} from "@/src/lib/security/csp";
import { environmentFrom, isIndexable, NOINDEX } from "@/src/lib/seo/indexable";

import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const host = normaliseHost(request.headers.get("host"));

  // TS-001 D2 — the canonical-host redirect. One hop, before anything else:
  // a non-canonical host never reaches CSP/robots computation for a URL it
  // is about to leave anyway. See `host-matrix.ts` for the `.de`-apex
  // phasing note this carries.
  const canonicalHost = canonicalHostFor(host);
  if (canonicalHost && canonicalHost !== host) {
    const target = new URL(
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
      `https://${canonicalHost}`,
    );
    const redirect = NextResponse.redirect(target, 301);
    const hsts = strictTransportSecurity(environmentFrom(process.env.VERCEL_ENV));
    if (hsts) redirect.headers.set("Strict-Transport-Security", hsts);
    return redirect;
  }

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

  // TS-001 D3 note / DEC-038/053 — the suggestion signal. This never
  // changes what renders (D3's cacheability rule holds: no `Vary`, no
  // cookie) and the deferred client-side banner (Q-011) is not built here;
  // the proxy only exposes what it already knows.
  const domain = domainConfigFor(host);
  const suggestion = suggestedLanguage(
    request.headers.get("accept-language"),
    domain,
    request.nextUrl.pathname,
  );
  if (suggestion) {
    response.headers.set("Server-Timing", suggestionServerTiming(suggestion));
  }

  return response;
}
