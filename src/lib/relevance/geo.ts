/**
 * Geo proximity — TS-005 D1, axis one of the concept's two axes.
 *
 * **Administrative containment is the only measure** in phase 1. A visitor
 * 8 km away across a Kreisgrenze scores as *same state*; the spec records
 * that mismatch and accepts it, because a distance tier needs coordinates on
 * every element and on the visitor. Neighbourhood tiers are likewise absent
 * (geo-api issue 165).
 *
 * The level rule is **coverage, not venue**: an element is recorded at the
 * most specific level that covers what it is about. The NØRD Award is an MV
 * award held in Rostock and scores as `state`; the KfW Award is nationwide
 * and scores as `country` regardless of the ceremony's city.
 */

import { GEO_LEVELS, type GeoScope } from "./types";

/** Tier 0 (same community) … tier 6 (no match, or the element has no geo). */
export type GeoTier = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** The D1 table, indexed by tier. */
export const GEO_TIER_WEIGHTS = [1.0, 0.8, 0.6, 0.45, 0.3, 0.15, 0.1] as const;

/**
 * The tier of an element against a viewer.
 *
 * Containment, not name equality: a level counts only when every coarser
 * level above it matches too, so a `flechtorf` in Bayern is not the
 * `flechtorf` in Gemeinde Lehre. Unknown levels on either side end the walk —
 * which is why a county-level viewer (TS-010 D4's honest ceiling) can never
 * reach tiers 0 and 1 before she has searched for a place.
 */
export function geoTier(element: GeoScope, viewer: GeoScope): GeoTier {
  let matched = -1;
  for (let i = 0; i < GEO_LEVELS.length; i += 1) {
    const level = GEO_LEVELS[i];
    const a = element[level];
    const b = viewer[level];
    if (a === null || b === null || a !== b) break;
    matched = i;
  }

  // matched: 4 community → 0 · 3 municipality → 1 · 2 county → 2 · 1 state → 3 · 0 country → 4
  if (matched >= 0) return (GEO_LEVELS.length - 1 - matched) as GeoTier;

  // Tier 5 carries the other country domains and appearances abroad: both
  // sides state a country and the two differ. Anything else is tier 6.
  if (element.country !== null && viewer.country !== null) return 5;
  return 6;
}

/** `geo_proximity(e, p)` of the scoring block — 1.0 same community … 0.1 no match. */
export function geoProximity(element: GeoScope, viewer: GeoScope): number {
  return GEO_TIER_WEIGHTS[geoTier(element, viewer)];
}

/** True when the viewer carries any location at all — the stage-0 predicate. */
export function hasGeo(scope: GeoScope): boolean {
  return GEO_LEVELS.some((level) => scope[level] !== null);
}
