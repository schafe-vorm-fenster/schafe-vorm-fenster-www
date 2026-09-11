/**
 * Context proximity — TS-005 D2, axis two. The matrix itself is the concept's
 * ("Context Matrix: the Entry Decides the Starting Type"); this module is that
 * table **as data**, plus the two values the source leaves open.
 *
 *   starting type        1.0   SRC-002, verbatim
 *   named widening type  0.6   this spec — one value, not a gradient, because
 *                              the matrix carries no ordering to rank by
 *   any other type       0.3   SRC-002's "widest widening", extended to types
 *                              the matrix names for neither role
 *
 * The floor applies to everything: a type named nowhere still scores, which is
 * what keeps a stream from running dry when nothing better is cleared.
 */

import type { EntryTrait, ItemType } from "./types";
import { ITEM_TYPES } from "./types";

/**
 * The matrix's "time window first" column. The engine does not score against
 * it — freshness is TS-005 D4 — it is the window a live module queries and
 * the preference an editor reads off the row (A14).
 */
export type TimeWindow =
  | "today"
  | "today-this-week"
  | "last-90-days"
  | "last-12-months"
  | "current"
  | "timeless";

export interface ContextRow {
  /** The assumption the matrix states about this entry, for the record. */
  readonly assumption: string;
  /** Scores 1.0. Empty for `direct`, whose row is "widest spread". */
  readonly startingTypes: readonly ItemType[];
  /** Scores 0.6. `"all"` is the `direct` row's "widens into: all". */
  readonly wideningTypes: readonly ItemType[] | "all";
  readonly timeWindow: TimeWindow;
}

/**
 * Two types the evidence packages carry that the matrix does not name by that
 * word. Reading them as their synonym is a [PROPOSED] determination of this
 * module: an award and a recognition are the same argument, and the matrix row
 * for `press` names "press article **or podcast** link" in its entry column.
 */
const TYPE_ALIASES: Partial<Record<ItemType, ItemType>> = {
  recognition: "award",
  podcast: "press",
};

/** SRC-002's context matrix, row by row, keyed by the TS-010 D3 trait id. */
export const CONTEXT_MATRIX: Record<EntryTrait, ContextRow> = {
  social: {
    assumption: "impulsive, event-driven, private",
    startingTypes: ["conference", "social-media", "live-dates"],
    wideningTypes: ["press", "testimonial"],
    timeWindow: "last-90-days",
  },
  professional: {
    assumption: "professional, institutional, evaluating",
    startingTypes: ["reference-case", "testimonial", "award"],
    wideningTypes: ["press", "conference"],
    timeWindow: "last-12-months",
  },
  "purchase-intent": {
    assumption: "purchase intent, comparing",
    startingTypes: ["reference-case", "metric", "partner"],
    wideningTypes: ["testimonial", "award"],
    timeWindow: "timeless",
  },
  "reader-search": {
    assumption: "a reader looking for a date",
    startingTypes: ["live-dates", "save-to-homescreen"],
    wideningTypes: ["testimonial"],
    timeWindow: "today-this-week",
  },
  "print-qr": {
    assumption: "physically in the place",
    startingTypes: ["live-dates", "place-calendar"],
    wideningTypes: ["testimonial", "conference"],
    timeWindow: "today",
  },
  press: {
    assumption: "curious, informed, supra-regional",
    startingTypes: ["press", "podcast", "award", "portrait"],
    wideningTypes: ["reference-case", "live-dates"],
    timeWindow: "last-12-months",
  },
  activated: {
    assumption: "already a publisher or customer",
    startingTypes: ["publishing-path", "promotion-material"],
    wideningTypes: ["reference-case"],
    timeWindow: "current",
  },
  direct: {
    assumption: "the default case — widest spread, most recent first",
    startingTypes: [],
    wideningTypes: "all",
    timeWindow: "last-12-months",
  },
};

/** The matrix row of an entry trait. */
export function contextRow(trait: EntryTrait): ContextRow {
  return CONTEXT_MATRIX[trait];
}

/**
 * `context_proximity(e, p)` — 1.0 starting type · 0.6 named widening ·
 * 0.3 everything else.
 */
export function contextProximity(type: ItemType, trait: EntryTrait): number {
  const row = CONTEXT_MATRIX[trait];
  const resolved = TYPE_ALIASES[type] ?? type;

  if (row.startingTypes.includes(type) || row.startingTypes.includes(resolved)) return 1.0;
  if (row.wideningTypes === "all") return 0.6;
  if (row.wideningTypes.includes(type) || row.wideningTypes.includes(resolved)) return 0.6;
  return 0.3;
}

/** Every type the matrix relates to a trait, starting types first (A14, review aid). */
export function relatedTypes(trait: EntryTrait): readonly ItemType[] {
  const row = CONTEXT_MATRIX[trait];
  const widening = row.wideningTypes === "all" ? ITEM_TYPES : row.wideningTypes;
  return [...row.startingTypes, ...widening.filter((type) => !row.startingTypes.includes(type))];
}
