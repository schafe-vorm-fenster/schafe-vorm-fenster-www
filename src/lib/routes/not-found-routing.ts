/**
 * Where a request this site cannot serve goes, and which language its 404
 * speaks — TS-004-A4, TS-004 D6, TS-001 D4 (F-2-70).
 *
 * ### The bug this module exists to remove
 *
 * `app/[lang]/**` matches *any* first segment, so `/dies-gibt-es-nicht` and
 * `/uk/mitmachen` land **inside** the route tree with a `lang` that is not a
 * language. The page then calls `notFound()` (`_locale.ts`, TS-001 D4), which
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
 * ### Why the target is two segments
 *
 * `NOT_FOUND_PATH` must match **nothing** in the App Router tree, because a
 * rewrite onto Next's own `/_not-found` is served with status 200 on Vercel
 * (`next.config.ts` records that trap). A *one*-segment path is not enough:
 * it matches `app/[lang]` and produces exactly the empty document described
 * above — which is why `landing-domain.ts`'s one-segment
 * `/__landing-only` answered 404 with a blank body until this round
 * (measured: 11 584 bytes of error shell, zero rendered characters). Two
 * segments match no `[lang]` page and no nested route, so Next falls through
 * to its own 404 handling and `global-not-found` renders in full.
 */

import { isAssetPath } from "./landing-domain";
import { normalisePath } from "./routes";
import { everyD1Path } from "./url-inventory";
import { DEFAULT_LOCALE, isLocale } from "../i18n/locales";

import type { Locale } from "../i18n/locales";

/**
 * The rewrite target for a URL this site does not serve. Two segments, and
 * no route in the tree has this shape — see the module note.
 */
export const NOT_FOUND_PATH = "/__not-found/404";

/**
 * The request header `proxy.ts` puts the 404's language on, and
 * `app/global-not-found.tsx` reads.
 *
 * The 404 surface sits above `[lang]`, so it has no language parameter and no
 * request path of its own (`state/open.md` row 37). The language is a pure
 * function of the URL the visitor asked for — the path prefix first, the
 * domain's TLD default second (TS-001 D1/D4) — so the proxy, which is the
 * only place that still has the URL, computes it and hands it down. Nothing
 * client-side is involved, which is what DEC-038 requires.
 */
export const NOT_FOUND_LOCALE_HEADER = "x-svf-not-found-locale";

/**
 * App paths that are not D1 rows and must never be mistaken for unknown
 * URLs: the BFF, the framework's own output and the well-known surface.
 */
const RESERVED_PREFIXES = ["/api/", "/_next/", "/.well-known/"] as const;

/**
 * The component gallery is a development tool, not a page of this site. It
 * answers for itself everywhere it exists and `notFound()`s itself in a
 * production build — which is the one shape this module exists to prevent, so
 * there the proxy sends it the same way as every other unservable URL.
 */
const DEV_PREFIX = "/dev/";

let servedPaths: Set<string> | undefined;

/** Every public path of TS-004 D1, normalised. Computed once per process. */
function served(): Set<string> {
  servedPaths ??= new Set(everyD1Path().map(normalisePath));
  return servedPaths;
}

/**
 * The language a 404 for this URL is written in (TS-001 D1/D4).
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
 * True for exactly the URLs that produce the empty 404 document, and for
 * nothing else:
 *
 *  - a **served language prefix** (`/en/anything`) already falls through to
 *    Next's own 404 handling, because `app/[lang]/anything` matches no route
 *    — that surface is complete today and is left alone here;
 *  - every **D1 path**, every asset and the three reserved prefixes are
 *    served and answer for themselves; `/dev/**` answers for itself too,
 *    except in a production build, where it is the one URL that would
 *    otherwise reproduce the very defect this module removes;
 *  - `/de/…` carries a language prefix too, so the redundant-prefix redirect
 *    of `next.config.ts` (which runs *before* the proxy) keeps its turn.
 */
export function isUnservablePath(pathname: string): boolean {
  const path = normalisePath(pathname);
  if (path === normalisePath(NOT_FOUND_PATH)) return false;
  if (isAssetPath(path)) return false;
  if (RESERVED_PREFIXES.some((prefix) => path.startsWith(prefix))) return false;
  if (path.startsWith(DEV_PREFIX)) return process.env.VERCEL_ENV === "production";

  const first = path.split("/")[1] ?? "";
  if (isLocale(first)) return false;

  return !served().has(path);
}
