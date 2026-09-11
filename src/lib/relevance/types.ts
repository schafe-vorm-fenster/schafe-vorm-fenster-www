/**
 * The relevance vocabulary — TS-005, the concept's two axes
 * (`go-to-market-os/concept/website-relevance-model.concept.md`).
 *
 * This module is the **shared vocabulary layer**: the geo levels, the four
 * focus jobs, the eight entry traits, the item facets and the viewer context.
 * `src/lib/personalization/` builds a `ViewerContext`; this folder scores
 * against it. The dependency runs one way only — personalization → relevance
 * — so the entry-trait ids are literally one constant (TS-010 D3: "two
 * vocabularies would silently produce two segmentations").
 *
 * Nothing here reads a clock, a request, a file or the network. Every input
 * the engine needs is an argument.
 */

import type { Locale } from "../i18n/locales";

/**
 * TS-005 D1, corrected 2026-09-10: five levels, coarsest first. `place` is
 * finer than the website needs and is deliberately not carried; the geo-api
 * hierarchy (`place? > community > municipality > county > state > country`)
 * is truncated to these five.
 */
export const GEO_LEVELS = ["country", "state", "county", "municipality", "community"] as const;

export type GeoLevel = (typeof GEO_LEVELS)[number];

/**
 * A location as far as it is known. Unknown levels are `null` rather than
 * absent, so an element always states how precisely it is located (concept,
 * "Required Data").
 */
export type GeoScope = { readonly [Level in GeoLevel]: string | null };

/** Nothing known — the stage-0 location and the "element has no geo" case. */
export const NO_GEO: GeoScope = Object.freeze({
  country: null,
  state: null,
  county: null,
  municipality: null,
  community: null,
});

/** A partial geo literal, completed to a full `GeoScope`. */
export function geo(scope: Partial<GeoScope>): GeoScope {
  return { ...NO_GEO, ...scope };
}

/** The four jobs of the IA. A page declares exactly one (TS-006 D1). */
export const FOCUS_JOBS = [
  "know-what-is-on",
  "publish-our-dates",
  "run-our-own-calendar",
  "understand-who-is-behind-it",
] as const;

export type FocusJob = (typeof FOCUS_JOBS)[number];

/**
 * TS-005 D3. `peripheral` was renamed from `alien`, which read as a verdict
 * rather than an absence. A job left unassessed takes the lowest step *and*
 * stays countable — see `unassessedJobs()`.
 */
export const JOB_RELATIONS = ["supports", "neutral", "peripheral"] as const;

export type JobRelation = (typeof JOB_RELATIONS)[number];

/** An element's profile over all four jobs; a missing key is unassessed. */
export type JobRelationProfile = Partial<Record<FocusJob, JobRelation>>;

/**
 * The entry contexts of the SRC-002 context matrix, as TS-010 D3 names them.
 * `direct` is the matrix's documented default case, not a degraded one.
 */
export const ENTRY_TRAITS = [
  "social",
  "professional",
  "purchase-intent",
  "reader-search",
  "print-qr",
  "press",
  "activated",
  "direct",
] as const;

export type EntryTrait = (typeof ENTRY_TRAITS)[number];

/**
 * What a selectable element *is*. The proof types come from
 * `@schafe-vorm-fenster/proof` (`proof.schema.ts`), the publication types from
 * `@schafe-vorm-fenster/media-echo`, and the live types from the concept's
 * "Live Content" table. One union, because the context matrix scores across
 * all three (TS-005 D2: "no type is without a relation").
 */
export const ITEM_TYPES = [
  // proof (packages/evidence/proof)
  "testimonial",
  "award",
  "funding",
  "metric",
  "partner",
  "reference-case",
  // media echo (packages/evidence/media-echo/verified)
  "press",
  "podcast",
  "conference",
  "portrait",
  "social-media",
  "recognition",
  // live and activation (concept, "Live Content"; matrix rows 4, 5, 7)
  "live-dates",
  "live-nearby",
  "live-places",
  "live-counters",
  "place-calendar",
  "embed-demo",
  "save-to-homescreen",
  "publishing-path",
  "promotion-material",
] as const;

export type ItemType = (typeof ITEM_TYPES)[number];

/** `usage_rights` of the proof schema. Only `cleared` passes the gate. */
export const CLEARANCES = ["cleared", "unverified", "internal-only"] as const;

export type Clearance = (typeof CLEARANCES)[number];

/**
 * One selectable element, normalised. The engine consumes this and nothing
 * else — it never opens a package, a content file or an API.
 *
 * `payload` carries whatever the calling page renders (proof-card props, an
 * event row, a live module descriptor). The engine treats it as opaque.
 */
export interface RelevanceItem<Payload = unknown> {
  /** Stable id — the tie-break of TS-005 D6 and the rotation key of D7. */
  readonly id: string;
  readonly type: ItemType;
  /** The **coverage** level, not the venue (TS-005 D1). */
  readonly geo: GeoScope;
  readonly jobRelation: JobRelationProfile;
  /** The stated reason of D3, carried for review; never scored. */
  readonly jobRelationReason?: string;
  /** `YYYY`, `YYYY-MM` or `YYYY-MM-DD`; `null` for an undated element. */
  readonly date: string | null;
  /** TS-005 D4, default 1.0 — multiplies freshness, never replaces it. */
  readonly editorialWeight?: number;
  readonly clearance: Clearance;
  /** Labelled dummy content (plan/guardrails.md, the mock rule). */
  readonly demo?: boolean;
  /** WEB-F-024: the element names a place and may only be shown for a covered one. */
  readonly placeBound?: boolean;
  /** The community the element names, when `placeBound`. */
  readonly place?: string | null;
  readonly payload?: Payload;
}

/** SRC-001 §6. Observability and documentation only — nothing branches on it. */
export type PersonalizationStage = 0 | 1 | 2 | 3;

/**
 * The resolver output of TS-010 D1: **one flat object**, a field is either
 * known or `null`. The engine reads `geo`, `trait` and `job`; `stage` and
 * `locale` travel with it so a page carries one object, not four.
 *
 * There is no `stage` branch anywhere in the render path — the label exists
 * for observability and for the documentation (TS-010 D1).
 */
export interface ViewerContext {
  readonly geo: GeoScope;
  readonly trait: EntryTrait;
  /** Fixed per page by the IA. A trait may reorder within it, never redefine it (DEC-059). */
  readonly job: FocusJob;
  readonly stage: PersonalizationStage;
  readonly locale: Locale;
}
