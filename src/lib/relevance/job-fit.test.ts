import { describe, expect, it } from "vitest";

import { JOB_RELATION_WEIGHTS, jobFit, unassessedJobs } from "./job-fit";
import { FOCUS_JOBS, type JobRelationProfile } from "./types";

const publisherTestimonial: JobRelationProfile = {
  "know-what-is-on": "neutral",
  "publish-our-dates": "supports",
  "run-our-own-calendar": "supports",
  "understand-who-is-behind-it": "neutral",
};

describe("TS-005-A1 (D3): job relation is a profile over all four jobs", () => {
  it("scores supports 1.0, neutral 0.5, peripheral 0.2", () => {
    expect(JOB_RELATION_WEIGHTS).toEqual({ supports: 1.0, neutral: 0.5, peripheral: 0.2 });
    expect(jobFit(publisherTestimonial, "publish-our-dates")).toBe(1.0);
    expect(jobFit(publisherTestimonial, "know-what-is-on")).toBe(0.5);
  });

  it("gives an unassessed job the lowest step, so an element holds back rather than appearing everywhere", () => {
    expect(jobFit({}, "run-our-own-calendar")).toBe(0.2);
  });

  it("keeps the gap countable instead of silently defaulting", () => {
    expect(unassessedJobs(publisherTestimonial)).toEqual([]);
    expect(unassessedJobs({ "publish-our-dates": "supports" })).toEqual(
      FOCUS_JOBS.filter((job) => job !== "publish-our-dates"),
    );
  });
});
