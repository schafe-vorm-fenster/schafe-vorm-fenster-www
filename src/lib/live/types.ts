/**
 * The vocabulary every live module speaks — TS-008 D5, TS-009 D4/D5.
 *
 * One envelope, four facts about the payload inside it, and the shell
 * components read all four off it: which tier answered, when the data was
 * fetched, whether it is past its fresh TTL, and whether a mock produced it.
 * No component re-derives any of that (`live-module-frame` takes `state`,
 * `tier` and `updatedAt`; `src/lib/live/README.md` maps envelope → props).
 */

/** Tier 1/2/3 of TS-009 D4, by name rather than by number. */
export const LIVE_TIERS = ["live", "stale", "snapshot"] as const;
export type LiveTier = (typeof LIVE_TIERS)[number];

/** Which backend produced the payload — the mock rule's switch (plan/guardrails.md). */
export type LiveSource = "real" | "mock";

export interface LiveEnvelope<T> {
  readonly data: T;
  readonly tier: LiveTier;
  /** ISO-8601. Tier 3 carries the snapshot's build time (TS-009 D5). */
  readonly fetchedAt: string;
  /** `true` where the freshness label must render (TS-009 D5's four conditions). */
  readonly stale: boolean;
  /**
   * `true` for every mocked payload — the `Demo-Daten` badge's only input
   * (plan/guardrails.md). It travels in the JSON of every BFF response, so a
   * page cannot forget it.
   */
  readonly demo: boolean;
  readonly source: LiveSource;
}

/** A covered place, as the website knows it. Never more than the modules need. */
export interface Place {
  /** geo-api `geonameId`, as a string — the id the events search takes. */
  readonly communityId: string;
  readonly name: string;
  /** The geo-api slug — the app handover's only contract (DEC-029). */
  readonly slug: string;
  readonly lat: number;
  readonly lng: number;
  readonly county?: { readonly id?: string; readonly name?: string };
}

/** One date, flattened out of the upstream's dotted keys. */
export interface LiveEvent {
  readonly id: string;
  readonly title: string;
  /** ISO-8601 start, in `Europe/Berlin` terms (TS-008 D3). */
  readonly startsAt: string;
  readonly placeName?: string;
  readonly categoryId?: string;
}

/** Position 1 and 1′ — the dates of one place, plus the empty-state verdict. */
export interface PlaceEvents {
  readonly place: Place;
  readonly events: readonly LiveEvent[];
  /**
   * TS-008 D4: a **covered** place with zero dates in its window. Not an
   * error, not a widening failure — the conversion moment.
   */
  readonly publishInvitation: boolean;
}

/** Position 2 — this week within the approximated ~15 km (TS-008 D3 step 2). */
export interface NearbyEvents {
  readonly events: readonly LiveEvent[];
  readonly radiusKm: number;
  /** The upstream result cap hit before the radius did — the module claims no completeness. */
  readonly truncated: boolean;
}

/** Position 3 — a designed set of active example places, never a place list (DEC-034). */
export interface RegionExamples {
  readonly county: string;
  readonly examples: readonly { readonly name: string; readonly slug: string; readonly eventCount: number }[];
}

/**
 * Position 4 — only figures that were counted (WEB-F-041). `places` and
 * `updatesToday` are absent from `/api/stats` (Q-037) and are therefore
 * `undefined` unless the mock backend supplies them.
 */
export interface LiveCounters {
  readonly dates?: number;
  readonly places?: number;
  readonly updatesToday?: number;
}

/** The three outcomes of TS-008 D7, as a discriminated union. */
export type PlaceSearchOutcome =
  | { readonly kind: "covered"; readonly place: Place }
  | { readonly kind: "uncovered"; readonly query: string }
  | { readonly kind: "unsupported"; readonly query: string; readonly hint: "zip-only" };

export interface PlaceSearchResult {
  readonly query: string;
  readonly outcome: PlaceSearchOutcome;
  /** Typeahead candidates; empty for every outcome but `covered` with several hits. */
  readonly suggestions: readonly Place[];
}
