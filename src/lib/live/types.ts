/**
 * The vocabulary every live module speaks — TS-WEB-0008 D5, TS-WEB-0009 D4/D5.
 *
 * One envelope, four facts about the payload inside it, and the shell
 * components read all four off it: which tier answered, when the data was
 * fetched, whether it is past its fresh TTL, and whether a mock produced it.
 * No component re-derives any of that (`live-module-frame` takes `state`,
 * `tier` and `updatedAt`; `src/lib/live/README.md` maps envelope → props).
 */

/** Tier 1/2/3 of TS-WEB-0009 D4, by name rather than by number. */
export const LIVE_TIERS = ["live", "stale", "snapshot"] as const;
export type LiveTier = (typeof LIVE_TIERS)[number];

/** Which backend produced the payload — the mock rule's switch (plan/guardrails.md). */
export type LiveSource = "real" | "mock";

export interface LiveEnvelope<T> {
  readonly data: T;
  readonly tier: LiveTier;
  /** ISO-8601. Tier 3 carries the snapshot's build time (TS-WEB-0009 D5). */
  readonly fetchedAt: string;
  /** `true` where the freshness label must render (TS-WEB-0009 D5's four conditions). */
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
  /** The geo-api slug — the app handover's only contract (DEC-0029). */
  readonly slug: string;
  readonly lat: number;
  readonly lng: number;
  /**
   * The municipality the community belongs to — what the typeahead prints in
   * brackets so two villages of one name are told apart ("Ort (Gemeinde)",
   * TS-WEB-0008 D7a). Absent where the source carries no hierarchy.
   */
  readonly municipality?: string;
  readonly county?: { readonly id?: string; readonly name?: string };
}

/** One date, flattened out of the upstream's dotted keys. */
export interface LiveEvent {
  readonly id: string;
  readonly title: string;
  /** ISO-8601 start, in `Europe/Berlin` terms (TS-WEB-0008 D3). */
  readonly startsAt: string;
  readonly placeName?: string;
  readonly categoryId?: string;
}

/** Position 1 and 1′ — the dates of one place, plus the empty-state verdict. */
export interface PlaceEvents {
  readonly place: Place;
  readonly events: readonly LiveEvent[];
  /**
   * TS-WEB-0008 D4: a **covered** place with zero dates in its window. Not an
   * error, not a widening failure — the conversion moment.
   */
  readonly publishInvitation: boolean;
}

/** Position 2 — this week within the approximated ~15 km (TS-WEB-0008 D3 step 2). */
export interface NearbyEvents {
  readonly events: readonly LiveEvent[];
  readonly radiusKm: number;
  /** The upstream result cap hit before the radius did — the module claims no completeness. */
  readonly truncated: boolean;
}

/** Position 3 — a designed set of active example places, never a place list (DEC-0034). */
export interface RegionExamples {
  readonly county: string;
  readonly examples: readonly { readonly name: string; readonly slug: string; readonly eventCount: number }[];
}

/**
 * Position 4 — only figures that were counted (FUN-WEB-0041). `places` and
 * `updatesToday` are absent from `/api/stats` (Q-0037) and are therefore
 * `undefined` unless the mock backend supplies them.
 */
export interface LiveCounters {
  readonly dates?: number;
  readonly places?: number;
  readonly updatesToday?: number;
}

/**
 * The outcomes of TS-WEB-0008 D7, as a discriminated union. Two, since DEC-0079:
 * a name either matched a covered place or it did not. The interim third
 * outcome (`unsupported`, "type a postcode instead") is gone with the postcode
 * mode itself — the search never tells a visitor to type something else.
 */
export type PlaceSearchOutcome =
  | { readonly kind: "covered"; readonly place: Place }
  | { readonly kind: "uncovered"; readonly query: string };

export interface PlaceSearchResult {
  readonly query: string;
  readonly outcome: PlaceSearchOutcome;
  /** Typeahead candidates — at most `MAX_SUGGESTIONS` (D7a: 3–4 rows); empty when nothing matched. */
  readonly suggestions: readonly Place[];
}

/** `GET /api/places/nearest` — the covered community a coordinate sits in or next to (DEC-0119). */
export interface NearestPlace {
  readonly place: Place;
}
