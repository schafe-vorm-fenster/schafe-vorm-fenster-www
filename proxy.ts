/**
 * Response headers, and the TS-WEB-0001 locale logic, for every request —
 * TS-WEB-0014 D4/D5, TS-WEB-0015 D3, TS-WEB-0001 D2/D3.
 *
 * Three things live here rather than in `next.config.ts` `headers()`/
 * `redirects()`:
 *
 *  - the **CSP**, because it varies per environment (TS-WEB-0014 D5) and because
 *    TS-WEB-0014 D4 names exactly one source per header;
 *  - the **`X-Robots-Tag`**, because TS-WEB-0015 D3 puts it on *all* routes
 *    including assets, and its predicate needs the request host;
 *  - the **locale detection algorithm's host-dependent half** (TS-WEB-0001 D1/D2):
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
 * There is deliberately **no matcher**: D3 (TS-WEB-0015) says "all routes incl.
 * assets", and the canonical-host redirect must catch every path on a
 * non-canonical host, assets included. A `vercel.json` `headers` block would
 * silently take precedence over both this file and `next.config.ts` and is
 * forbidden (TS-WEB-0014 D4).
 */

import { NextResponse } from "next/server";

import {
  ENTRY_CONTEXT_HEADER,
  encodeEntryHandover,
} from "@/src/lib/personalization/entry-handover";
import { canonicalHostFor, domainConfigFor, normaliseHost } from "@/src/lib/routes/host-matrix";
import { landingDomainBlocks } from "@/src/lib/routes/landing-domain";
import {
  isUnservablePath,
  notFoundLocale,
  NOT_FOUND_LOCALE_HEADER,
  NOT_FOUND_PATH,
} from "@/src/lib/routes/not-found-routing";
import { placeHop } from "@/src/lib/routes/place-hop";
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

  // TS-WEB-0001 D2 — the canonical-host redirect. One hop, before anything else:
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

  const domain = domainConfigFor(host);

  // TS-WEB-0004 D1/A3 — the landing-only domain rule. `.pl`, `.at` and
  // `sheepoutside.com` serve `/`, the legal route and the machine surfaces;
  // every other path 404s. Before M4 the `kind: "landing"` flag sat on the
  // matrix with no consumer and all three domains answered 200 on every path
  // (F-2-45). The predicate, its asset exemptions and the reason this
  // rewrites rather than returns a bodyless 404 are in `landing-domain.ts`.
  const blocked = landingDomainBlocks(domain, request.nextUrl.pathname);

  // TS-WEB-0021-A7 / TS-WEB-0020 D2 row 5 — DEC-0070's re-resolution hop (F-2-49).
  // `redirect()` inside the page produces a 200 with an empty document on a
  // production build, because Cache Components resumes every route from a
  // postponed prerender and the status line is long gone by then. Next's own
  // answer is this file (`redirect.md`: "if you'd like to redirect before the
  // render process, use `next.config.js` or Proxy") — `next.config.ts` cannot,
  // because the decision needs a geo lookup. `place-hop.ts` carries the rule
  // and the reason; here it is one awaited call that answers `undefined` for
  // every path that is not one of the two `?ort=` routes. An upstream that
  // cannot answer must never cost a visitor her page, so a throw falls
  // through to the render, which has the same logic one layer down.
  let hop: string | undefined;
  if (!blocked) {
    try {
      hop = await placeHop(request.nextUrl.pathname, request.nextUrl.searchParams);
    } catch (error) {
      hop = undefined;
      // F-3-9: the fall-through is correct and stays — what was missing is
      // that nothing anywhere said it happened. This arm is hard to reach
      // (`resolvePlace` swallows its own errors, `searchPlaces` has a tier-3
      // snapshot), and its failure mode is the defect it exists to fix: the
      // request falls through to the render, whose own `redirect()` then
      // produces a 200 with an empty document on a production build — exactly
      // the state F-2-49 described. If that is ever the answer a visitor
      // gets, the log is the only place it will be visible.
      console.error("[proxy] placeHop failed; falling through to the render", {
        // The pathname only. `?ort=` is attacker-controlled text, and a log
        // line is not a place to echo it.
        pathname: request.nextUrl.pathname,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // TS-WEB-0004-A4 / TS-WEB-0004 D6 — the 404 that renders (F-2-70). A URL this site
  // does not serve must not enter `app/[lang]` at all: the page's own
  // `notFound()` is correct but arrives after the document has been committed,
  // and the visitor gets a blank 404. `not-found-routing.ts` says which paths
  // those are and why the target has two segments.
  const unservable = !blocked && isUnservablePath(request.nextUrl.pathname);

  // The 404's language, computed where the URL still exists (row 37): the
  // surface itself sits above `[lang]` and has neither a language parameter
  // nor a path. Set on every request, so the fall-through 404 of an unknown
  // `/en/…` sub-path reads it too.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(
    NOT_FOUND_LOCALE_HEADER,
    notFoundLocale(request.nextUrl.pathname, domain.tldDefault),
  );
  // TS-WEB-0010 D2 step 2 — the entry-context handover (DEC-0140). The `Referer`
  // header is a request value only this file sees before the render, and
  // TS-WEB-0019 D3a orders block 2a of `/` by the trait derived from it. What
  // travels is the referrer's **host** and, when it is one of the three tokens
  // D3 recognises, the campaign medium — never the referrer's path and never a
  // geo or IP value (TS-WEB-0010-A11; `entry-handover.ts` has no field for one).
  //
  // Set on **every** request, empty value included: a client that sends this
  // header itself must not be able to choose its own segment, and `set()`
  // overwrites what arrived. Reading it makes its reader dynamic, so the page
  // reads it inside a `<Suspense>` boundary whose fallback is the `direct`
  // order — the shell stays prerendered (TS-WEB-0010 D8, DEC-0045).
  requestHeaders.set(
    ENTRY_CONTEXT_HEADER,
    encodeEntryHandover({
      referrer: request.headers.get("referer"),
      searchParams: request.nextUrl.searchParams,
    }),
  );

  const passthrough = { request: { headers: requestHeaders } };

  // The blocked, the unknown and the redirected request all still get the full
  // header set: TS-WEB-0014 D4 makes the CSP one source for *every* route and
  // TS-WEB-0015 D3 runs the robots rule on "all routes incl. assets", so neither a
  // 404 nor a 307 is an exception to either.
  const response = hop
    ? NextResponse.redirect(new URL(hop, request.url), 307)
    : blocked || unservable
      ? NextResponse.rewrite(new URL(NOT_FOUND_PATH, request.url), passthrough)
      : NextResponse.next(passthrough);
  const vercelEnv = process.env.VERCEL_ENV;
  const environment = environmentFrom(vercelEnv);

  // DEC-0045: per-build hashes, no per-request nonce — the shell stays static.
  // `scriptHashes()` fetches a build artifact from this deployment's own
  // static assets once per deployment (`csp-hashes.ts` caches the in-flight
  // promise per deployment id), not per request, so this stays a pure
  // function of hostname + path (TS-WEB-0004 D3).
  //
  // F-2-36: the origin below is a *hint*, not the target. `csp-hashes.ts`
  // resolves the fetch origin from the deployment's own environment
  // (`VERCEL_URL`), and only falls back to this request-derived origin off
  // Vercel and only for a host this site actually answers on — without the
  // Deployment Protection bypass secret. A spoofed `Host` therefore neither
  // receives the secret nor selects the asset. The one exception: the hash asset's own
  // request must not try to compute a hash-dependent policy for itself —
  // that would recurse into the same fetch this proxy has no matcher to
  // skip (TS-WEB-0015 D3 runs it on "all routes incl. assets" on purpose).
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

  // TS-WEB-0001 D3 note / DEC-0038/053 — the suggestion signal. This never
  // changes what renders (D3's cacheability rule holds: no `Vary`, no
  // cookie) and the deferred client-side banner (Q-0011) is not built here;
  // the proxy only exposes what it already knows.
  const suggestion = blocked || unservable || hop
    ? undefined
    : suggestedLanguage(
        request.headers.get("accept-language"),
        domain,
        request.nextUrl.pathname,
      );
  if (suggestion) {
    response.headers.set("Server-Timing", suggestionServerTiming(suggestion));
  }

  return response;
}
