/**
 * TS-003 D5's cache table, as one typed structure — the only place these
 * numbers exist in code.
 *
 * Two numbers per kind, answering two different questions (TS-003 D5's own
 * note): the **fresh TTL** decides how fast a correction reaches the page,
 * the **serve-stale window** decides only what happens while the upstream is
 * unreachable. Three consumers read this table and nobody else types a
 * number:
 *
 *  1. `resilient()` — how long a `last-good` entry may still answer as tier 2,
 *     and when a tier-1 answer starts carrying the freshness label;
 *  2. the BFF route handlers — the `Cache-Control` they send, in the Vercel
 *     SWR semantics DEC-019 fixes (`s-maxage` + `stale-while-revalidate`);
 *  3. the page-level `use cache` islands — `cacheLife()` takes the same two
 *     numbers, and `app/[lang]/_islands.tsx` passes `cacheLifeProfile(kind)`
 *     straight into it, so an island and its BFF route cannot disagree about
 *     what "5 minutes" means.
 */

/** The data kinds TS-003 D5 distinguishes. Modules map onto these, not the reverse. */
export const CACHE_KINDS = ["dates", "activePlaces", "counters"] as const;
export type CacheKind = (typeof CACHE_KINDS)[number];

export interface CacheProfile {
  /** Seconds after which a correction is expected to have arrived. */
  readonly freshTtlSeconds: number;
  /** Seconds a `last-good` entry may still answer while upstream is down. */
  readonly staleWindowSeconds: number;
}

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** TS-003 D5, verbatim. Counters' window is also the cut-off after which D6 hides them. */
export const CACHE_PROFILES: Readonly<Record<CacheKind, CacheProfile>> = {
  dates: { freshTtlSeconds: 5 * MINUTE, staleWindowSeconds: 3 * DAY },
  activePlaces: { freshTtlSeconds: 1 * HOUR, staleWindowSeconds: 7 * DAY },
  counters: { freshTtlSeconds: 15 * MINUTE, staleWindowSeconds: 3 * DAY },
};

export function cacheProfile(kind: CacheKind): CacheProfile {
  return CACHE_PROFILES[kind];
}

/**
 * The BFF response's `Cache-Control`. `s-maxage` is the fresh TTL,
 * `stale-while-revalidate` the window — the shared-cache half only, because
 * a BFF answer is never a private one and `private` would defeat the point.
 */
export function cacheControlFor(kind: CacheKind): string {
  const { freshTtlSeconds, staleWindowSeconds } = cacheProfile(kind);
  return `public, s-maxage=${freshTtlSeconds}, stale-while-revalidate=${staleWindowSeconds}`;
}

/**
 * The same two numbers in the shape `cacheLife()` takes. `stale` is the
 * client-router hint, `revalidate` the server refresh, `expire` the point
 * past which a request waits for fresh content — mapped so an island and its
 * BFF route cannot disagree about what "5 minutes" means.
 */
export function cacheLifeProfile(kind: CacheKind): {
  readonly stale: number;
  readonly revalidate: number;
  readonly expire: number;
} {
  const { freshTtlSeconds, staleWindowSeconds } = cacheProfile(kind);
  return { stale: freshTtlSeconds, revalidate: freshTtlSeconds, expire: staleWindowSeconds };
}

/** `cacheTag()` names, per TS-009 D3. One function so a tag is never typed twice. */
export const cacheTags = {
  dates: (community: string) => `dates:${community}`,
  places: () => "places",
  placesInCounty: (county: string) => `places:${county}`,
  stats: () => "stats",
} as const;
