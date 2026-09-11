/**
 * The formula — TS-005 D5, SRC-002's scoring block:
 *
 * ```text
 * score(e) = w_geo · geo(e) + w_ctx · ctx(e) + w_job · job(e)
 *          + w_time · (freshness(e) · editorial_weight(e))
 * ```
 *
 * Pure, and free of I/O. The clearance and coverage filters run **before**
 * this (`gate.ts`) — an uncleared element is never scored at all.
 */

import { geoProximity, geoTier, hasGeo, type GeoTier } from "./geo";
import { contextProximity } from "./context-matrix";
import { jobFit } from "./job-fit";
import { timeScore } from "./freshness";
import { weightsFor, type Weights } from "./weights";

import type { RelevanceItem, ViewerContext } from "./types";

export interface ScoreComponents {
  readonly geo: number;
  readonly ctx: number;
  readonly job: number;
  readonly time: number;
}

export interface ScoredItem<Payload = unknown> {
  readonly id: string;
  readonly item: RelevanceItem<Payload>;
  readonly score: number;
  readonly tier: GeoTier;
  /** The four terms before weighting — the only honest way to explain a rank. */
  readonly components: ScoreComponents;
  readonly weights: Weights;
}

export interface ScoreOptions {
  /** The reference date for freshness. The engine reads no clock (D7). */
  readonly now: Date;
  /** Overrides the D5 profile of the viewer's focus job — the numbers are [PROPOSED]. */
  readonly weights?: Weights;
}

/**
 * Six decimals. Two elements whose facets are equal must produce one *equal*
 * score, or the tie-break of D6 and the rotation of D7 would silently never
 * fire — floating-point noise is not a ranking signal.
 */
const PRECISION = 1e6;

export function scoreItem<Payload = unknown>(
  item: RelevanceItem<Payload>,
  viewer: ViewerContext,
  options: ScoreOptions,
): ScoredItem<Payload> {
  const weights = options.weights ?? weightsFor(viewer.job, { geoKnown: hasGeo(viewer.geo) });

  const components: ScoreComponents = {
    geo: geoProximity(item.geo, viewer.geo),
    ctx: contextProximity(item.type, viewer.trait),
    job: jobFit(item.jobRelation, viewer.job),
    time: timeScore(item, options.now),
  };

  const raw =
    weights.w_geo * components.geo +
    weights.w_ctx * components.ctx +
    weights.w_job * components.job +
    weights.w_time * components.time;

  return {
    id: item.id,
    item,
    score: Math.round(raw * PRECISION) / PRECISION,
    tier: geoTier(item.geo, viewer.geo),
    components,
    weights,
  };
}

/** Scores a pool and returns it in score order, ties by id ascending. */
export function scoreAll<Payload = unknown>(
  items: readonly RelevanceItem<Payload>[],
  viewer: ViewerContext,
  options: ScoreOptions,
): readonly ScoredItem<Payload>[] {
  return items
    .map((item) => scoreItem(item, viewer, options))
    .toSorted((a, b) => b.score - a.score || (a.id < b.id ? -1 : 1));
}
