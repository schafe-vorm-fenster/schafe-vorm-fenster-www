/**
 * The BFF boundary itself — TS-004 D5, TS-008 D10, TS-013 D3, TS-017 D4.
 *
 * Everything every `app/api/*` handler does before and after it calls an
 * interface module, so no handler re-derives it:
 *
 *  - **GET only.** TS-017 D4's "read-only by construction" is a property of
 *    the route files (they export `GET` and nothing else) and is checked
 *    statically by `scripts/check-api-routes.ts` (TS-017-A10).
 *  - **Origin check.** A cross-origin `Origin` header is refused (WEB-Q-038):
 *    these routes exist for this site's own pages, not as a public API. A
 *    request with no `Origin` (a plain navigation, a server-side call, curl)
 *    passes — the header is advisory, not an authentication.
 *  - **Rate limit.** A small fixed-window counter per client bucket. It is
 *    per instance, which on serverless means per region and per warm lambda —
 *    honest about what it is (`state/open.md`), and enough to keep the
 *    prototype's BFF from being trivially hammered.
 *  - **No visitor identity anywhere.** The bucket key is a coarse hash, never
 *    a stored IP, and nothing about the caller reaches an upstream (TS-013
 *    D3/D6, the client IP never leaves `callUpstream`'s closed header set).
 *  - **One response shape.** `{ data, tier, fetchedAt, stale, demo }` plus
 *    the `Cache-Control` of TS-003 D5 for that data kind.
 */

import { cacheControlFor, type CacheKind } from "./cache-profiles";

import type { LiveEnvelope } from "./types";

/** The site's own origins (TS-013 D2 first-party row) plus the dev host. */
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
const MAX_REQUESTS_PER_WINDOW = 60;

const buckets = new Map<string, RateLimitState>();

/**
 * A coarse bucket key. It uses the platform's own geo headers and the route,
 * never the IP itself: TS-013 D6 forbids an address in a key, and a region
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

/** Runs both gates. A handler calls this first and returns `rejected` if set. */
export function guard(request: Request, route: string): GuardResult {
  if (!isAllowedOrigin(request.headers.get("origin"), request.url)) {
    return { rejected: problem(403, "cross-origin request refused") };
  }
  if (!checkRateLimit(rateLimitKey(request, route))) {
    return { rejected: problem(429, "too many requests") };
  }
  return {};
}

/**
 * An error answer. It carries no upstream detail: a failing upstream is a
 * tier decision inside the module, and what reaches the browser is the
 * module's fallback, never a message about a service (TS-009 D9).
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
