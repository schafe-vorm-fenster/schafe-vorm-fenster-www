/**
 * The widening chain — TS-008 D3, as a resolution procedure.
 *
 * The chain turns an **anchor** (a community, a county from IP geolocation,
 * or nothing at all) into which of the four module positions may render and
 * at which radius each of them stands. Two things it deliberately is not:
 *
 *  - It is **not a relevance ranking.** Which elements a widened module picks
 *    and in which order is TS-005. This file decides the candidate set.
 *  - It is **not a distance query.** events-api takes administrative id lists
 *    and no radius (TS-008 D2.1), so a step is "which id list is sent". The
 *    ~15 km of step 2 is cut here, on the `geo` positions geo-api returns,
 *    because upstream searches a fixed 20 km and caps the result count
 *    (TS-008 D2.2, D3 rule 2) — the approximation is ours and is labelled.
 */

import type { Place } from "./types";

export const CHAIN_STEPS = [1, 2, 3, 4] as const;
export type ChainStep = (typeof CHAIN_STEPS)[number];

/** SRC-002's "~15 km" for step 2, approximated on our side (TS-008 D3). */
export const NEARBY_RADIUS_KM = 15;

/** What the resolver handed the chain (TS-009 D2 reads it; this file only uses it). */
export type ChainAnchor =
  | { readonly kind: "community"; readonly place: Place }
  | { readonly kind: "county"; readonly countyId: string; readonly countyName?: string }
  | { readonly kind: "none" };

/** What a position renders. `absent` means: not in the DOM at all. */
export type PositionState = "dates" | "invitation" | "examples" | "counters" | "absent";

export interface ChainPlan {
  /** Where the chain starts: community → 1, county → 3, stage-0 → 4 (TS-008 D3). */
  readonly startStep: ChainStep;
  readonly position1: PositionState;
  readonly position2: PositionState;
  readonly position3: PositionState;
  readonly position4: PositionState;
  /** `true` for the empty state of TS-008 D4 — a covered place with no dates. */
  readonly publishInvitation: boolean;
}

/** Step 1/3/4 per anchor precision. Stage-0 has no anchor and no chain. */
export function chainStart(anchor: ChainAnchor): ChainStep {
  switch (anchor.kind) {
    case "community":
      return 1;
    case "county":
      return 3;
    case "none":
      return 4;
  }
}

export interface ChainCounts {
  /** Dates found in the anchor community's window (step 1). */
  readonly placeEvents: number;
  /** Dates found within the ~15 km cut (step 2). */
  readonly nearbyEvents: number;
  /** Active example places found in the county (step 3). */
  readonly countyExamples: number;
}

/**
 * Which positions render, given the anchor and what each step returned.
 *
 * The chain never skips silently: a filled position 2 beside an empty
 * position 1 is exactly the widened case, and `live-module-frame`'s title
 * names its own radius, so a widened module never presents itself as the
 * narrower one (TS-008 D1).
 */
export function planChain(anchor: ChainAnchor, counts: ChainCounts): ChainPlan {
  const startStep = chainStart(anchor);
  const covered = anchor.kind === "community";
  const publishInvitation = covered && counts.placeEvents === 0;

  return {
    startStep,
    // Position 1 is never left blank: with no dates its slot carries the
    // publish offer (TS-008 D4, "Position 1 is not left blank").
    position1: !covered ? "absent" : counts.placeEvents > 0 ? "dates" : "invitation",
    // Step 2 needs coordinates, so it needs a community anchor.
    position2: covered && counts.nearbyEvents > 0 ? "dates" : "absent",
    // Step 3 fires from a community's county as well as from an IP county.
    position3:
      anchor.kind === "none" || counts.countyExamples === 0 ? "absent" : "examples",
    // Position 4 renders at every stage, including stage 0 (TS-005 D8).
    position4: "counters",
    publishInvitation,
  };
}

const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

/** Great-circle distance in kilometres — the step-2 cut's only arithmetic. */
export function haversineKm(
  from: { readonly lat: number; readonly lng: number },
  to: { readonly lat: number; readonly lng: number },
): number {
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

export interface NearbySelection {
  readonly places: readonly Place[];
  /**
   * `true` when the upstream result cap, not the radius, ended the list —
   * every returned candidate was inside the radius, so there may be more
   * places within 15 km that upstream never sent. The module then shows what
   * it has and claims no completeness (TS-008 D3 rule 2).
   */
  readonly truncated: boolean;
}

/**
 * The ~15 km cut of step 2, applied to what geo-api returned.
 *
 * `maxResults` is what the caller asked upstream for; when the response is
 * that long *and* nothing was cut, the cap truncated before the radius did.
 */
export function selectNearby(
  anchor: { readonly lat: number; readonly lng: number },
  candidates: readonly Place[],
  { radiusKm = NEARBY_RADIUS_KM, maxResults }: { readonly radiusKm?: number; readonly maxResults?: number } = {},
): NearbySelection {
  const withinRadius = candidates.filter((place) => haversineKm(anchor, place) <= radiusKm);
  const truncated =
    maxResults !== undefined && candidates.length >= maxResults && withinRadius.length === candidates.length;
  return { places: withinRadius, truncated };
}

/**
 * The windows of TS-008 D3, in `Europe/Berlin`: position 1 asks `after=now`,
 * position 2 `after=now&before=7d`. "Today" is the local calendar day, not a
 * rolling 24 h — expressed with the upstream's own relative words where they
 * exist, so the two systems cut the day the same way. [PROPOSED]
 */
export const EVENT_WINDOWS = {
  today: { after: "now", before: "tomorrow" },
  week: { after: "now", before: "7d" },
  upcoming: { after: "now", before: undefined },
} as const;

export type EventWindow = keyof typeof EVENT_WINDOWS;

export const EVENT_WINDOW_IDS = ["today", "week", "upcoming"] as const;

export function isEventWindow(value: string): value is EventWindow {
  return (EVENT_WINDOW_IDS as readonly string[]).includes(value);
}
