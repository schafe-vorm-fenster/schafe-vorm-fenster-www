/**
 * Segmentation — TS-005 D8.
 *
 * The engine never renders per visitor. Two axes: **geo** (community, per the
 * 2026-09-10 correction — municipality made tier 0 unreachable) and the
 * **entry trait**, from which the focus job derives. The ISO-week seed joins
 * them so a week boundary invalidates cleanly (D7).
 *
 * These values are what a cached component takes **as props**, resolved
 * outside the `use cache` boundary because `headers()` and `cookies()` may not
 * be read inside it. Props become the cache key automatically, giving one
 * entry per segment rather than per visitor.
 */

import type { RotationSeed } from "./rotation";
import type { EntryTrait, FocusJob, ViewerContext } from "./types";

export interface SegmentKey {
  /** `null` is stage 0 — a real segment, not a missing value. */
  readonly community: string | null;
  readonly trait: EntryTrait;
  readonly job: FocusJob;
  readonly isoWeek: RotationSeed;
}

export interface SegmentOptions {
  /**
   * DEC-055 keeps the fallback to `municipality` as a **parameter change**:
   * if the production cache figures demand it, this is the one line that
   * moves, and tier 0 becomes unreachable again as the price.
   */
  readonly geoAxis?: "community" | "municipality";
}

export function segmentKey(
  viewer: ViewerContext,
  seed: RotationSeed,
  options: SegmentOptions = {},
): SegmentKey {
  const axis = options.geoAxis ?? "community";
  return {
    community: viewer.geo[axis],
    trait: viewer.trait,
    job: viewer.job,
    isoWeek: seed,
  };
}

/** The same key as one string — for `cacheTag`, a log line or a test. */
export function segmentCacheKey(
  viewer: ViewerContext,
  seed: RotationSeed,
  options: SegmentOptions = {},
): string {
  const key = segmentKey(viewer, seed, options);
  return `relevance:${key.community ?? "none"}:${key.trait}:${key.job}:${key.isoWeek}`;
}
