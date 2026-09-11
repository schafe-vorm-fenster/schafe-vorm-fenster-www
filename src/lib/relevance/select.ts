/**
 * The engine's one entry point — gate · score · rotate · order · count.
 *
 * A page calls this and nothing else. Everything impure (fetching, caching,
 * segmenting) sits around it: `selectRelevant()` reads no clock, no request
 * and no file, and returns the same result for the same arguments forever.
 *
 * The pipeline, in order:
 *
 *   1. **gate**   clearance and place coverage — hard filters before scoring
 *                 (TS-005 D5, WEB-F-033, WEB-F-024)
 *   2. **score**  the D5 formula with the weight profile of the page's focus
 *                 job, stage-0 redistribution included (DEC-048)
 *   3. **rotate** the ISO-week seed shifts equal-score groups, nothing else
 *                 (D7)
 *   4. **order**  the sequence rule of the concept (D6, `order.ts`)
 *   5. **count**  the surface's element count (DEC-048), padded with empty
 *                 slots rather than shortened
 */

import { gate, type GateOptions, type GateReason } from "./gate";
import { orderBySequenceRule } from "./order";
import { rotateTies, type RotationSeed } from "./rotation";
import { scoreAll, type ScoreComponents } from "./score";

import type { GeoTier } from "./geo";
import type { RelevanceItem, ViewerContext } from "./types";
import type { Weights } from "./weights";

/** DEC-048. Three is the minimum the sequence rule needs; seven carries the full pattern. */
export const SURFACE_COUNTS = { inline: 3, home: 5, stream: 7 } as const;

export type Surface = keyof typeof SURFACE_COUNTS;

/**
 * A filled position, or an honest gap. An unfilled position **weakens the
 * claim** rather than shortening the stream (SRC-001 §4, TS-019 D4): the page
 * renders an `empty-proof-slot` in its place, never one child fewer.
 */
export type SelectionEntry<Payload = unknown> =
  | {
      readonly kind: "item";
      readonly id: string;
      readonly item: RelevanceItem<Payload>;
      readonly score: number;
      readonly tier: GeoTier;
      readonly components: ScoreComponents;
      /** `mocked` carries the `Demo-Daten` badge; it maps onto `src/components/data-state.ts`. */
      readonly state: "ready" | "mocked";
    }
  | { readonly kind: "empty"; readonly id: null; readonly reason: "no-candidate" };

export interface RelevanceSelection<Payload = unknown> {
  /** Exactly `count` entries, in the order the page renders them. */
  readonly entries: readonly SelectionEntry<Payload>[];
  readonly count: number;
  /** How many positions carry a real element — the countable gap. */
  readonly filled: number;
  readonly weights: Weights;
  readonly seed: RotationSeed;
  readonly stage: ViewerContext["stage"];
  readonly dropped: readonly { readonly id: string; readonly reason: GateReason }[];
}

export interface SelectionRequest<Payload = unknown> extends GateOptions {
  readonly items: readonly RelevanceItem<Payload>[];
  readonly viewer: ViewerContext;
  /** A named surface of DEC-048, or an explicit count. */
  readonly surface: Surface | { readonly count: number };
  /** The reference date for freshness — the page's clock, never the engine's. */
  readonly now: Date;
  /** The ISO-week rotation seed (`isoWeekSeed(now)`), an explicit input (D7). */
  readonly seed: RotationSeed;
  readonly weights?: Weights;
}

function countOf(surface: Surface | { readonly count: number }): number {
  return typeof surface === "string" ? SURFACE_COUNTS[surface] : Math.max(0, surface.count);
}

export function selectRelevant<Payload = unknown>(
  request: SelectionRequest<Payload>,
): RelevanceSelection<Payload> {
  const count = countOf(request.surface);
  const gated = gate(request.items, { coveredPlaces: request.coveredPlaces });

  const scored = scoreAll(gated.items, request.viewer, {
    now: request.now,
    weights: request.weights,
  });
  const rotated = rotateTies(scored, request.seed);
  const ordered = orderBySequenceRule(rotated).slice(0, count);

  const entries: SelectionEntry<Payload>[] = ordered.map((scoredItem) => ({
    kind: "item",
    id: scoredItem.id,
    item: scoredItem.item,
    score: scoredItem.score,
    tier: scoredItem.tier,
    components: scoredItem.components,
    state: scoredItem.item.demo === true ? "mocked" : "ready",
  }));

  while (entries.length < count) {
    entries.push({ kind: "empty", id: null, reason: "no-candidate" });
  }

  return {
    entries,
    count,
    filled: ordered.length,
    weights: scored[0]?.weights ?? request.weights ?? weightsOf(request),
    seed: request.seed,
    stage: request.viewer.stage,
    dropped: gated.dropped,
  };
}

/** The profile an empty pool would have used — so `weights` is never a lie. */
function weightsOf<Payload>(request: SelectionRequest<Payload>): Weights {
  return scoreAll(
    [
      {
        id: "__probe__",
        type: "testimonial",
        geo: request.viewer.geo,
        jobRelation: {},
        date: null,
        clearance: "cleared",
      } as RelevanceItem<Payload>,
    ],
    request.viewer,
    { now: request.now, weights: request.weights },
  )[0].weights;
}
