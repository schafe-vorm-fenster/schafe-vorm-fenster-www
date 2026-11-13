/**
 * Where a request this site cannot serve goes, and which language its 404
 * speaks — TS-WEB-0004-A4, TS-WEB-0004 D6, TS-WEB-0001 D4 (F-2-70).
 *
 * ### The bug this module exists to remove
 *
 * `app/[lang]/**` matches *any* first segment, so `/dies-gibt-es-nicht` and
 * `/uk/mitmachen` land **inside** the route tree with a `lang` that is not a
 * language. The page then calls `notFound()` (`_locale.ts`, TS-WEB-0001 D4), which
 * is the right decision one render too late: with Cache Components every
 * route resumes from a postponed prerender, and an error thrown during the
 * resume can no longer replace the document that is already being written.
 * Next serialises it into the flight payload instead, so the response is a
 * correct **404 status with an `<html id="__next_error__">` body of zero
 * rendered characters** — measured on `next start` and on the preview, with
 * JavaScript disabled (F-2-70). `app/global-not-found.tsx` renders the same
 * surface *completely*, server-side, whenever Next's own routing — not a
 * page — decides the URL is unknown.
 *
 * So the decision has to move in front of the route, which is what
 * `proxy.ts` is for (`redirect.md`: "if you'd like to redirect before the
 * render process, use `next.config.js` or Proxy"). This module is the
 * predicate and the two constants that decision needs.
 *
 * ### Where the target is (DEC-0164)
 *
 * Until DEC-0164 the target was one path that matched nothing in the tree,
 * so Next fell through to `app/global-not-found.tsx`, and that file read the
 * language off a request header this module named — which made the 404 the
 * one HTML surface still rendered per request. The target is now
 * **per language**: `notFoundVariantPath(locale)` in `static-variants.ts`, a
 * page prerendered as a 404 at build time. The proxy computes the language
 * here and only picks the file.
 */

import { isServableAssetPath } from "./landing-domain";
import { internalPath, normalisePath, ROUTE_IDS } from "./routes";
import { notFoundVariantPath } from "./static-variants";
import { everyD1Path } from "./url-inventory";
import { DEFAULT_LOCALE, isLocale, PREFIXED_LOCALES } from "../i18n/locales";

import type { Locale } from "../i18n/locales";

/** The rewrite target for an unservable URL: the prerendered 404 of its language. */
export function notFoundPathFor(pathname: string, tldDefault?: string): string {
  return notFoundVariantPath(notFoundLocale(pathname, tldDefault));
}

/**
 * App paths that are not D1 rows and must never be mistaken for unknown
 * URLs: the BFF, the framework's own output, the well-known surface, and the
 * platform's own.
 *
 * `/_vercel/` is F-3-8, and it costs three strings rather than a defect
 * later: `/_vercel/insights/view`, `/_vercel/speed-insights/vitals` and
 * `/_vercel/image` were classified unservable and rewritten to the 404
 * surface. Nothing breaks today — neither `@vercel/analytics` nor
 * `@vercel/speed-insights` is a dependency — but TS-WEB-0003 D7 names "RUM: Vercel
 * Speed Insights (cookieless)" as the production mechanism, and switching it
 * on from the dashboard would silently break the beacon with nothing in this
 * repository to explain why.
 */
const RESERVED_PREFIXES = ["/api/", "/_next/", "/.well-known/", "/_vercel/"] as const;

/**
 * The component gallery is a development tool, not a page of this site. It
 * answers for itself everywhere it exists and `notFound()`s itself in a
 * production build — which is the one shape this module exists to prevent, so
 * there the proxy sends it the same way as every other unservable URL.
 */
const DEV_PREFIX = "/dev/";

let servedPaths: Set<string> | undefined;

/**
 * Every public path of TS-WEB-0004 D1, normalised, plus the internal
 * `app/[lang]` path of every route in a prefixed language
 * (`/en/dein-ort` beside `/en/your-place`). Those internal paths render a
 * page today and always did; classifying them as unknown would change an
 * answer this module has no mandate to change. Computed once per process.
 */
function served(): Set<string> {
  servedPaths ??= new Set(
    [
      ...everyD1Path(),
      ...ROUTE_IDS.flatMap((route) => PREFIXED_LOCALES.map((locale) => internalPath(route, locale))),
    ].map(normalisePath),
  );
  return servedPaths;
}

/**
 * The language a 404 for this URL is written in (TS-WEB-0001 D1/D4).
 *
 * A served language prefix wins; otherwise the domain's TLD default, and
 * where that is a language this phase does not ship (`pl`), the default.
 */
export function notFoundLocale(pathname: string, tldDefault?: string): Locale {
  const first = normalisePath(pathname).split("/")[1] ?? "";
  if (isLocale(first)) return first;
  return isLocale(tldDefault) ? tldDefault : DEFAULT_LOCALE;
}

/**
 * Would this path land on `app/[lang]` with a `lang` that is not a language?
 *
 * True for every URL the site does not serve, and for nothing else:
 *
 *  - every **D1 path**, every asset that is really on disk and the reserved
 *    prefixes are served and answer for themselves; `/dev/**` answers for
 *    itself too, except in a production build, where it `notFound()`s itself
 *    inside the tree — the one shape that renders an empty 404 (F-2-70);
 *  - a **prefixed language** (`/en/anything`) is unservable unless it is a
 *    D1 path or the internal path of a route. Until DEC-0164 these fell
 *    through to `global-not-found`, which read the language off a request
 *    header; now they take the prerendered English 404 like any other
 *    unknown URL, so the 404 never renders per request;
 *  - `/de/…` is left alone: the redundant-prefix redirect of `next.config.ts`
 *    (which runs *before* the proxy) has its turn.
 *
 * A `/variants/…` path is in no D1 row, so a direct request for a build-time
 * variant is unservable too: only the proxy's own rewrite reaches one.
 */
export function isUnservablePath(pathname: string): boolean {
  const path = normalisePath(pathname);
  if (RESERVED_PREFIXES.some((prefix) => path.startsWith(prefix))) return false;
  if (isServableAssetPath(path)) return false;
  if (path.startsWith(DEV_PREFIX)) return process.env.VERCEL_ENV === "production";

  if (path === `/${DEFAULT_LOCALE}` || path.startsWith(`/${DEFAULT_LOCALE}/`)) return false;

  return !served().has(path);
}
