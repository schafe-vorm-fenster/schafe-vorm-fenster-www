/**
 * The BFF boundary itself — TS-WEB-0004 D5, TS-WEB-0008 D10, TS-WEB-0013 D3, TS-WEB-0017 D4.
 *
 * Everything every `app/api/*` handler does before and after it calls an
 * interface module, so no handler re-derives it:
 *
 *  - **GET only.** TS-WEB-0017 D4's "read-only by construction" is a property of
 *    the route files (they export `GET` and nothing else) and is checked
 *    statically by `scripts/check-api-routes.ts` (TS-WEB-0017-A10).
 *  - **Origin check.** A cross-origin `Origin` header is refused (CON-WEB-0044 · CON-WEB-0045):
 *    these routes exist for this site's own pages, not as a public API. A
 *    request with no `Origin` (a plain navigation, a server-side call, curl)
 *    passes — the header is advisory, not an authentication.
 *  - **Rate limit.** A small fixed-window counter per client bucket. It is
 *    per instance, which on serverless means per region and per warm lambda —
 *    honest about what it is (`state/open.md`), and enough to keep the
 *    prototype's BFF from being trivially hammered.
 *  - **No visitor identity anywhere.** The bucket key is a coarse hash, never
 *    a stored IP, and nothing about the caller reaches an upstream (TS-WEB-0013
 *    D3/D6, the client IP never leaves `callUpstream`'s closed header set).
 *  - **One response shape.** `{ data, tier, fetchedAt, stale, demo }` plus
 *    the `Cache-Control` of TS-WEB-0003 D5 for that data kind.
 */

import { cacheControlFor, type CacheKind } from "./cache-profiles";

import type { LiveEnvelope } from "./types";

/** The site's own origins (TS-WEB-0013 D2 first-party row) plus the dev host. */
const ALLOWED_ORIGIN_HOSTS = [
  "schafe-vorm-fenster.de",
  "sheepoutside.com",
  "localhost",
  "127.0.0.1",
] as const;

export function isAllowedOrigin(origin: string | null, requestUrl: string): boolean {
  if (origin === null || origin === "null") return true; // no Origin: not a cross-site fetch
  let host: string;
  try {
    host = new URL(origin).hostname;
  } catch {
    return false;
  }
  if (host === new URL(requestUrl).hostname) return true;
  return ALLOWED_ORIGIN_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
}

export interface RateLimitState {
  readonly hits: number;
  readonly resetAt: number;
}

const WINDOW_MS = 60_000;
/**
 * 600 per minute per bucket. It was 60 while only the typeahead called these
 * routes; since DEC-0163 every page view loads its live modules from here
 * (2–5 calls), and a region bucket of one warm instance is shared by every
 * visitor of that region whose request misses the CDN. The limit is still
 * what it was for — a bound on one client hammering a warm instance — not a
 * quota on ordinary page views.
 */
export const MAX_REQUESTS_PER_WINDOW = 600;

const buckets = new Map<string, RateLimitState>();

/**
 * A coarse bucket key. It uses the platform's own geo headers and the route,
 * never the IP itself: TS-WEB-0013 D6 forbids an address in a key, and a region
 * plus a route is enough to bound one client's share of a warm instance.
 */
export function rateLimitKey(request: Request, route: string): string {
  const region =
    request.headers.get("x-vercel-ip-country-region") ??
    request.headers.get("x-vercel-ip-country") ??
    "local";
  return `${route}:${region}`;
}

export function checkRateLimit(key: string, now = Date.now()): boolean {
  const state = buckets.get(key);
  if (state === undefined || now >= state.resetAt) {
    buckets.set(key, { hits: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (state.hits >= MAX_REQUESTS_PER_WINDOW) return false;
  buckets.set(key, { hits: state.hits + 1, resetAt: state.resetAt });
  return true;
}

/** Test seam — the counter is module state, so a suite has to be able to clear it. */
export function resetRateLimits(): void {
  buckets.clear();
}

export interface GuardResult {
  readonly rejected?: Response;
}

/**
 * Whether the rate limit applies: on every Vercel deployment, and wherever
 * `BFF_RATE_LIMIT=on` asks for it. Off a platform there is no region header,
 * so every caller shares the one `local` bucket — and since DEC-0163 every
 * page view calls the BFF, so a local production build under the e2e suite
 * (one machine, ~1 200 page loads) trips it and removes live modules
 * mid-test (measured: 20 × 429 in 650 calls). The limit is a property of a
 * deployed instance, not of a developer's `next start`.
 */
export function rateLimitActive(env: Record<string, string | undefined> = process.env): boolean {
  return Boolean(env.VERCEL) || env.BFF_RATE_LIMIT === "on";
}

/** Runs both gates. A handler calls this first and returns `rejected` if set. */
export function guard(request: Request, route: string): GuardResult {
  if (!isAllowedOrigin(request.headers.get("origin"), request.url)) {
    return { rejected: problem(403, "cross-origin request refused") };
  }
  if (rateLimitActive() && !checkRateLimit(rateLimitKey(request, route))) {
    return { rejected: problem(429, "too many requests") };
  }
  return {};
}

/**
 * An error answer. It carries no upstream detail: a failing upstream is a
 * tier decision inside the module, and what reaches the browser is the
 * module's fallback, never a message about a service (TS-WEB-0009 D9).
 */
export function problem(status: number, message: string): Response {
  return Response.json(
    { error: message },
    { status, headers: { "cache-control": "no-store", "content-type": "application/json" } },
  );
}

/** The one success shape, with the cache lifetime of its data kind. */
export function envelopeResponse<T>(envelope: LiveEnvelope<T>, kind: CacheKind): Response {
  return Response.json(
    {
      data: envelope.data,
      tier: envelope.tier,
      fetchedAt: envelope.fetchedAt,
      stale: envelope.stale,
      demo: envelope.demo,
    },
    {
      status: 200,
      headers: {
        "cache-control": cacheControlFor(kind),
        "content-type": "application/json",
      },
    },
  );
}

/** The BFF's own JSON shape, so a page can type what it reads back. */
export interface BffResponse<T> {
  readonly data: T;
  readonly tier: LiveEnvelope<T>["tier"];
  readonly fetchedAt: string;
  readonly stale: boolean;
  readonly demo: boolean;
}
