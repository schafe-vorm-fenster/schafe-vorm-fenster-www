/**
 * The stage model — SRC-001 §6 "Assumptions, not switches", TS-010 D1 and D7.
 *
 * **There is no `stage` variable in the render path.** Nothing branches on
 * "stage 2". The resolver fills one flat object; a field is either known or
 * `null`, and the stages are the names for how much of it happened to be
 * filled. The label exists for observability and for the documentation —
 * which is why `stageOf()` is a *derivation*, not an input.
 *
 * What a higher stage may do is one line long: **change which elements are
 * selected and in which order**. Everything else is invariant, and the single
 * exception on the whole website is the empty place calendar (WEB-F-044,
 * owned by TS-008), which is triggered by *data*, not by a stage.
 */

import { hasGeo } from "../relevance/geo";

import type { EntryTrait, GeoScope, PersonalizationStage } from "../relevance/types";

/** The only two things a stage is allowed to move (SRC-001 §6, WEB-F-052). */
export const MAY_CHANGE = ["selection", "order"] as const;

/** TS-010 D7's table, as data — the list a reviewer checks a page against. */
export const MAY_NEVER_CHANGE = [
  {
    invariant: "page structure",
    meaning:
      "the set of sections, their order, their headings and their CTAs are a pure function of route + language",
  },
  {
    invariant: "focus job",
    meaning:
      "fixed per page by the IA; the entry trait may reorder within the page, never redefine what the page is for (DEC-059)",
  },
  { invariant: "conversion", meaning: "the page's primary conversion is the same at every stage" },
  { invariant: "navigation", meaning: "header and footer are identical at every stage" },
  {
    invariant: "URL and canonical",
    meaning: "no stage produces a redirect, a different URL or a different canonical",
  },
] as const;

export interface StageDescription {
  readonly stage: PersonalizationStage;
  readonly knows: string;
  readonly source: string;
  readonly effect: string;
  readonly mayChange: typeof MAY_CHANGE;
}

/** SRC-001 §6, verbatim in substance. */
export const STAGE_MODEL: readonly StageDescription[] = [
  {
    stage: 0,
    knows: "nothing",
    source: "direct visit, a blocked lookup, a crawler",
    effect:
      "the default case: the prerendered shell itself — place search present, proof widely spread, most recent first, every slot filled",
    mayChange: MAY_CHANGE,
  },
  {
    stage: 1,
    knows: "an approximate location, county-level at best",
    source: "IP geolocation; browser geolocation only after an interaction",
    effect: "proof and live data start nearby",
    mayChange: MAY_CHANGE,
  },
  {
    stage: 2,
    knows: "the entry context",
    source: "referrer, campaign parameter, deep link",
    effect:
      "the proof type the stream opens with is preselected, and the scenes are emphasised in the trait's order — never the focus job (DEC-059)",
    mayChange: MAY_CHANGE,
  },
  {
    stage: 3,
    knows: "a stated place",
    source: "the place search, or `?ort=`",
    effect: "modules reorder around the visitor's own place; the context band adapts",
    mayChange: MAY_CHANGE,
  },
];

/**
 * The stage label of a resolved object — the highest one whose condition
 * holds. Observability only: no caller may branch on it (D1).
 */
export function stageOf(resolved: {
  readonly geo: GeoScope;
  readonly trait: EntryTrait;
}): PersonalizationStage {
  if (resolved.geo.community !== null) return 3;
  if (resolved.trait !== "direct") return 2;
  if (hasGeo(resolved.geo)) return 1;
  return 0;
}
