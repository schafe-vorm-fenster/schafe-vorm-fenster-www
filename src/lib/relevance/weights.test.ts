import { describe, expect, it } from "vitest";

import { FOCUS_JOB_WEIGHTS, weightsFor } from "./weights";
import { FOCUS_JOBS } from "./types";

const sum = (w: { w_geo: number; w_ctx: number; w_job: number; w_time: number }) =>
  Number((w.w_geo + w.w_ctx + w.w_job + w.w_time).toFixed(6));

describe("TS-005-A5: the weights are a profile per focus job, and stage 0 zeroes w_geo", () => {
  it("carries the D5 profile of every focus job, each summing to 1", () => {
    expect(FOCUS_JOB_WEIGHTS["know-what-is-on"]).toEqual({
      w_geo: 0.45,
      w_ctx: 0.2,
      w_job: 0.15,
      w_time: 0.2,
    });
    expect(FOCUS_JOB_WEIGHTS["publish-our-dates"]).toEqual({
      w_geo: 0.35,
      w_ctx: 0.25,
      w_job: 0.25,
      w_time: 0.15,
    });
    expect(FOCUS_JOB_WEIGHTS["run-our-own-calendar"]).toEqual({
      w_geo: 0.2,
      w_ctx: 0.25,
      w_job: 0.4,
      w_time: 0.15,
    });
    expect(FOCUS_JOB_WEIGHTS["understand-who-is-behind-it"]).toEqual({
      w_geo: 0.25,
      w_ctx: 0.25,
      w_job: 0.35,
      w_time: 0.15,
    });
    for (const job of FOCUS_JOBS) expect(sum(FOCUS_JOB_WEIGHTS[job])).toBe(1);
  });

  it("reproduces DEC-048 exactly for the 0.35 profile: w_time 0.35 · w_ctx 0.25 · w_job 0.40", () => {
    expect(weightsFor("publish-our-dates", { geoKnown: false })).toEqual({
      w_geo: 0,
      w_ctx: 0.25,
      w_job: 0.4,
      w_time: 0.35,
    });
  });

  it("splits a freed w_geo 4:3 between time and job for every other profile", () => {
    const stageZero = weightsFor("know-what-is-on", { geoKnown: false });
    expect(stageZero.w_geo).toBe(0);
    expect(stageZero.w_ctx).toBe(0.2);
    expect(stageZero.w_time).toBeCloseTo(0.2 + 0.45 * (4 / 7), 10);
    expect(stageZero.w_job).toBeCloseTo(0.15 + 0.45 * (3 / 7), 10);
    expect(sum(stageZero)).toBe(1);
  });

  it("leaves the profile untouched when the viewer's location is known", () => {
    expect(weightsFor("know-what-is-on", { geoKnown: true })).toEqual(
      FOCUS_JOB_WEIGHTS["know-what-is-on"],
    );
  });
});
