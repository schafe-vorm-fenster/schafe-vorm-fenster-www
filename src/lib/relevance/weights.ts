/**
 * The weight profiles — TS-005 D5, DEC-048.
 *
 * Weights are **a profile per focus job**, not one set for the whole site.
 * That is what settles the relevance model's open point "whether `w_job` may
 * outrank geo proximity": it may, and where is a property of the page. On
 * `/dein-ort` everything starts at the visitor's own place; on the sell pages
 * a mayor from Baden-Württemberg is better served by Rubkow than by an
 * arbitrary local clipping.
 *
 * The numbers are [PROPOSED] (TS-005 D5) — the shape is fixed, the values are
 * revised from measurement (H1–H6), which is why `selectRelevant()` accepts an
 * override instead of making a caller fork this table.
 */

import { FOCUS_JOBS, type FocusJob } from "./types";

export interface Weights {
  readonly w_geo: number;
  readonly w_ctx: number;
  readonly w_job: number;
  readonly w_time: number;
}

/** D5's table. */
export const FOCUS_JOB_WEIGHTS: Record<FocusJob, Weights> = {
  "know-what-is-on": { w_geo: 0.45, w_ctx: 0.2, w_job: 0.15, w_time: 0.2 },
  "publish-our-dates": { w_geo: 0.35, w_ctx: 0.25, w_job: 0.25, w_time: 0.15 },
  "run-our-own-calendar": { w_geo: 0.2, w_ctx: 0.25, w_job: 0.4, w_time: 0.15 },
  "understand-who-is-behind-it": { w_geo: 0.25, w_ctx: 0.25, w_job: 0.35, w_time: 0.15 },
};

/**
 * DEC-048 fixes the stage-0 split for a `w_geo` of 0.35: 0.20 to time, 0.15 to
 * job. That is a ratio of 4 : 3, and this module generalises it to the other
 * three profiles, whose `w_geo` is not 0.35. The generalisation is
 * [PROPOSED] — DEC-048 decided one profile, not four (state/open.md).
 */
const STAGE_ZERO_TIME_SHARE = 4 / 7;

/**
 * The profile for a page and a viewer. `geoKnown: false` is stage 0: `w_geo`
 * is 0 and its share moves to time and job, because without geo the job is the
 * only relevance axis left.
 */
export function weightsFor(job: FocusJob, viewer: { readonly geoKnown: boolean }): Weights {
  const base = FOCUS_JOB_WEIGHTS[job];
  if (viewer.geoKnown) return base;

  const freed = base.w_geo;
  return {
    w_geo: 0,
    w_ctx: base.w_ctx,
    w_time: base.w_time + freed * STAGE_ZERO_TIME_SHARE,
    w_job: base.w_job + freed * (1 - STAGE_ZERO_TIME_SHARE),
  };
}

/** Every profile, for the record and for the weight table in the README. */
export const ALL_PROFILES = FOCUS_JOBS.map((job) => ({ job, ...FOCUS_JOB_WEIGHTS[job] }));
