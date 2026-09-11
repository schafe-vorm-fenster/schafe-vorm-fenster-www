/**
 * Job fit — TS-005 D3. `job_fit(e, j)` of the scoring block.
 *
 * Every selectable element carries a **profile over all four jobs**, set as an
 * assessment at generation time with a stated reason — never derived from the
 * audience table. ADR-003 splits the hub's model into audience (durable
 * identity) and relation (posture towards us); `actors` alone holds reader,
 * publisher, customer and multiplier, so an audience-derived mapping would
 * mark such an element as supporting everything and spend a quarter of the
 * score on a constant.
 */

import { FOCUS_JOBS, type FocusJob, type JobRelation, type JobRelationProfile } from "./types";

/** D3's scale. `peripheral` is an absence, not a verdict. */
export const JOB_RELATION_WEIGHTS: Record<JobRelation, number> = {
  supports: 1.0,
  neutral: 0.5,
  peripheral: 0.2,
};

/** The lowest step — what an unassessed job takes (D3). */
const UNASSESSED = JOB_RELATION_WEIGHTS.peripheral;

export function jobFit(profile: JobRelationProfile, job: FocusJob): number {
  const relation = profile[job];
  return relation === undefined ? UNASSESSED : JOB_RELATION_WEIGHTS[relation];
}

/**
 * The jobs this element never had assessed. D3 requires the gap to stay
 * **countable**; a content report reads it off here rather than off the score.
 */
export function unassessedJobs(profile: JobRelationProfile): readonly FocusJob[] {
  return FOCUS_JOBS.filter((job) => profile[job] === undefined);
}
