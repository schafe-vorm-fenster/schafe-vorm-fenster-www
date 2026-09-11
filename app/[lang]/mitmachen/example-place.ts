/**
 * TS-022 D5 — the live example's place selection.
 *
 * No source assigns `/mitmachen` a row in TS-008 D1's module-to-page table
 * (D5 is [PROPOSED] against that gap, `state/open.md` rows 17 and 194), and no
 * geo-api ranking operation exists yet to resolve "nearest active place"
 * (TS-008 D1's own open point). Until both land, this is a pure, unit-tested
 * decision function over a small candidate list the page supplies — the
 * mocked upstream behind the real interface the mock rule asks for
 * (plan/guardrails.md).
 */

export interface ExamplePlaceCandidate {
  readonly slug: string;
  readonly name: string;
  readonly active: boolean;
  readonly upcomingDates: number;
}

/**
 * Stage 0's configured reference place (`state/content-map.md` #44,
 * `content/pages/mitmachen/de.md` slot 6a): a real, currently-covered place
 * with documented activity. Not an invented place.
 */
export const REFERENCE_PLACE: ExamplePlaceCandidate = {
  slug: "gross-kiesow",
  name: "Groß Kiesow",
  active: true,
  upcomingDates: 3,
};

/**
 * Selects the place the live example shows.
 *
 * - No anchor (stage 0) → the configured reference place, always.
 * - An anchor (stage 1–3) → the nearest **active** covered place that has
 *   dates, in the caller-supplied (distance-ordered) candidate list; a
 *   candidate with zero dates is skipped, never rendered (D5 "Zero dates").
 * - No candidate qualifies → the reference place, so the module never goes
 *   empty on this route (D5 "Zero dates": this is not the empty-state page).
 */
export function selectExamplePlace(
  anchorSlug: string | undefined,
  candidates: readonly ExamplePlaceCandidate[] = [],
): ExamplePlaceCandidate {
  if (!anchorSlug) return REFERENCE_PLACE;
  const nearest = candidates.find(
    (candidate) => candidate.active && candidate.upcomingDates > 0,
  );
  return nearest ?? REFERENCE_PLACE;
}
