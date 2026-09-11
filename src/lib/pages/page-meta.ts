/**
 * `page.meta.ts` in typed form — TS-006 D1.
 *
 * "Each route carries one `page.meta.ts` next to its `page.tsx`. It is the
 * page brief in typed form — the layout reads it, the checks read it, and no
 * second place states the same fact."
 *
 * This module is the *shape* and the *vocabulary*; the values live in each
 * route's own `page.meta.ts`. Three consumers read it:
 *
 *   1. the page frame (`app/[lang]/_page-frame.tsx`), which renders blocks 3
 *      and 4 — context band and closing CTA — from `focusJob`, so neither is
 *      hand-placed per page (TS-006 D2/D5/D6);
 *   2. `page-meta.test.ts`, which resolves every declared id against the
 *      installed hub packages — the static half of TS-006-A1 and A11;
 *   3. the page itself, which never re-states a value the manifest carries.
 *
 * **The four job ids are a closed set** (TS-006 D1) and they resolve onto the
 * one job registry the header and the context band already use
 * (`HEADER_JOBS`, TS-004 D4) — a second list of jobs is exactly what D5
 * forbids, so this module maps rather than repeats.
 *
 * Ids are typed as unions rather than imported from
 * `@schafe-vorm-fenster/goals` / `-audiences`: both are devDependencies
 * (content tooling), and importing one into a rendered page would make it a
 * runtime dependency needing the stack-harmony ADR (plan/guardrails.md,
 * state/open.md #54). The unions are checked against the installed packages
 * by the test, which is where the packages are legitimately available.
 */

import { HEADER_JOBS } from "@/src/lib/routes/navigation";

import type { NavEntry } from "@/src/lib/routes/navigation";
import type { RouteId } from "@/src/lib/routes/routes";

/** The four jobs of SRC-001 §1 — the closed set of TS-006 D1. */
export const JOB_IDS = [
  "know-what-is-on",
  "publish-our-dates",
  "run-our-own-calendar",
  "why-us",
] as const;

export type JobId = (typeof JOB_IDS)[number];

/**
 * job id → the registry entry that owns its label and its target.
 *
 * The right-hand side is `HEADER_JOBS` itself, so a job's target can only
 * ever be changed in `src/lib/routes/navigation.ts` (TS-004 D4).
 */
export const JOB_REGISTRY: Readonly<Record<JobId, NavEntry>> = Object.freeze({
  "know-what-is-on": HEADER_JOBS[0],
  "publish-our-dates": HEADER_JOBS[1],
  "run-our-own-calendar": HEADER_JOBS[2],
  "why-us": HEADER_JOBS[3],
});

/** The dictionary key the context band and the closing block filter on. */
export function jobLabelKey(job: JobId): NavEntry["label"] {
  return JOB_REGISTRY[job].label;
}

/** The route a job leads to — never typed at a call site (TS-004 D4). */
export function jobRoute(job: JobId): RouteId {
  return JOB_REGISTRY[job].route;
}

/**
 * The conversion goals of `@schafe-vorm-fenster/goals@0.3.0`
 * (`conversion-goals/*.conversion-goal.md`), as a closed union. The test
 * fails if the package and this list disagree in either direction.
 */
export const CONVERSION_GOAL_IDS = [
  "buy-calendar-licence",
  "direct-contact-qualified-leads",
  "linkedin-company-trust",
  "linkedin-personal-awareness",
  "order-promotion-material",
  "publish-events-regularly",
  "publish-first-event",
  "register-as-publisher",
  "request-ad-placement",
  "request-licence-quote",
  "request-product-briefing",
  "save-calendar-to-homescreen",
  "workshop-signup-or-trial",
] as const;

export type ConversionGoalId = (typeof CONVERSION_GOAL_IDS)[number];

/** The audiences of `@schafe-vorm-fenster/audiences@0.3.3`. */
export const AUDIENCE_IDS = [
  "actors",
  "companies",
  "counties",
  "institutions",
  "municipalities",
  "rural-residents",
  "tech-leaders",
] as const;

export type AudienceId = (typeof AUDIENCE_IDS)[number];

/** The live modules of TS-008 D1 — four positions plus the place search. */
export const LIVE_MODULE_IDS = [
  "place-search",
  "position-1-dates-in-the-place",
  "position-1b-embed-demo",
  "position-2-this-week-nearby",
  "position-3-active-places-in-the-county",
  "position-4-live-counters",
] as const;

export type LiveModuleId = (typeof LIVE_MODULE_IDS)[number];

/**
 * A live module as the manifest declares it: the module id **and its empty
 * state**, because TS-006 D1 requires "≥ 1 module ID, each with its empty
 * state declared (TS-005)". The empty state is a sentence naming what the
 * module renders when it has no rows — it is a declaration, not copy: the
 * visible wording comes from the content artifact (TS-007).
 */
export interface LiveModuleDeclaration {
  readonly id: LiveModuleId;
  /** What stands in the module's place when it has nothing to show. */
  readonly emptyState: string;
}

/** The runtime focus-job shift of `/dein-ort` — the one registered exception (TS-020 D1, TS-006-A10). */
export interface EmptyStateManifest {
  readonly focusJob: JobId;
  readonly primaryConversion: ConversionGoalId;
}

/** The page brief of one route, in typed form (TS-006 D1). */
export interface PageMeta {
  /** The route this manifest belongs to — its `page.tsx` sits beside it. */
  readonly route: RouteId;
  /** Exactly one; no page has zero or two (TS-006 D1). */
  readonly focusJob: JobId;
  /** `null` only where SRC-003 gives the focus job no conversion of its own. */
  readonly primaryConversion: ConversionGoalId | null;
  /** Rendered as an adjacent *secondary* action in the same block (TS-006 D3). */
  readonly equalWeightConversion?: ConversionGoalId;
  /** Priority order per SRC-003; the first one is the primary audience. */
  readonly audiences: readonly AudienceId[];
  /** At least one, each with its empty state declared. */
  readonly liveModules: readonly LiveModuleDeclaration[];
  /** Slot ids; a slot with no cleared proof stays empty (SRC-001 §4). */
  readonly proofSlots: readonly string[];
  /** Only `/dein-ort` fills this (TS-020 D1). */
  readonly emptyState?: EmptyStateManifest;
}

/**
 * The structural rules of TS-006 D1, as a predicate — used by the test and
 * available to any later check that wants the same answer without importing
 * a test file. Returns the violations; an empty array is a valid manifest.
 */
export function checkPageMeta(meta: PageMeta): string[] {
  const problems: string[] = [];

  if (!JOB_IDS.includes(meta.focusJob)) {
    problems.push(`focusJob "${meta.focusJob}" is not one of the four job ids`);
  }
  if (
    meta.primaryConversion !== null &&
    !CONVERSION_GOAL_IDS.includes(meta.primaryConversion)
  ) {
    problems.push(`primaryConversion "${meta.primaryConversion}" is not a conversion goal`);
  }
  if (
    meta.equalWeightConversion !== undefined &&
    !CONVERSION_GOAL_IDS.includes(meta.equalWeightConversion)
  ) {
    problems.push(
      `equalWeightConversion "${meta.equalWeightConversion}" is not a conversion goal`,
    );
  }
  if (meta.audiences.length === 0) problems.push("audiences is empty");
  for (const audience of meta.audiences) {
    if (!AUDIENCE_IDS.includes(audience)) {
      problems.push(`audience "${audience}" does not resolve`);
    }
  }
  if (meta.liveModules.length === 0) problems.push("no live module declared");
  for (const declared of meta.liveModules) {
    if (!LIVE_MODULE_IDS.includes(declared.id)) {
      problems.push(`live module "${declared.id}" is not a TS-008 D1 module`);
    }
    if (declared.emptyState.trim() === "") {
      problems.push(`live module "${declared.id}" declares no empty state`);
    }
  }

  return problems;
}
