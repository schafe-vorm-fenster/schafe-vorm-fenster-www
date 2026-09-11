import { describe, expect, it } from "vitest";

import { scoreAll, scoreItem } from "./score";
import { geo, NO_GEO, type RelevanceItem, type ViewerContext } from "./types";
import { weightsFor } from "./weights";

const now = new Date("2026-09-11T12:00:00Z");

const lehre = geo({
  country: "de",
  state: "niedersachsen",
  county: "helmstedt",
  municipality: "lehre",
  community: "flechtorf",
});

const viewer: ViewerContext = {
  geo: lehre,
  trait: "professional",
  job: "know-what-is-on",
  stage: 3,
  locale: "de",
};

const item: RelevanceItem = {
  id: "lehre-lelender",
  type: "reference-case",
  geo: geo({ country: "de", state: "niedersachsen", county: "helmstedt", municipality: "lehre" }),
  jobRelation: { "know-what-is-on": "supports" },
  date: "2026-08-01",
  clearance: "cleared",
};

describe("TS-005-A3: score(e) = w_geo·geo + w_ctx·ctx + w_job·job + w_time·(freshness·editorial)", () => {
  it("is the weighted sum of the four terms, and says which term contributed what", () => {
    const scored = scoreItem(item, viewer, { now });
    const w = weightsFor("know-what-is-on", { geoKnown: true });

    expect(scored.components).toEqual({ geo: 0.8, ctx: 1.0, job: 1.0, time: 1.0 });
    expect(scored.score).toBeCloseTo(
      w.w_geo * 0.8 + w.w_ctx * 1.0 + w.w_job * 1.0 + w.w_time * 1.0,
      10,
    );
    expect(scored.tier).toBe(1);
  });

  it("accepts an override profile, because the D5 numbers are [PROPOSED]", () => {
    const scored = scoreItem(item, viewer, {
      now,
      weights: { w_geo: 1, w_ctx: 0, w_job: 0, w_time: 0 },
    });
    expect(scored.score).toBe(0.8);
  });
});

describe("TS-005-A5: stage 0 has no geo term — time and job fit drive the order", () => {
  const stageZero: ViewerContext = { ...viewer, geo: NO_GEO, stage: 0 };

  it("zeroes the geo term however near the element is", () => {
    const near = scoreItem(item, stageZero, { now });
    const far: RelevanceItem = { ...item, id: "far", geo: geo({ country: "pl" }) };
    expect(scoreItem(far, stageZero, { now }).score).toBe(near.score);
  });

  it("orders a fresh, job-supporting element above an old, peripheral one", () => {
    const old: RelevanceItem = {
      ...item,
      id: "old",
      date: "2018-06-01",
      jobRelation: { "know-what-is-on": "peripheral" },
    };
    const [first, second] = scoreAll([old, item], stageZero, { now });
    expect([first.id, second.id]).toEqual(["lehre-lelender", "old"]);
  });
});

describe("TS-005-A4: determinism — identical input yields identical output", () => {
  it("produces the same scores across 1000 runs", () => {
    const first = scoreAll([item], viewer, { now }).map((scored) => scored.score);
    for (let run = 0; run < 1000; run += 1) {
      expect(scoreAll([item], viewer, { now }).map((scored) => scored.score)).toEqual(first);
    }
  });

  it("rounds the score, so two elements of equal facets are a real tie and not floating-point noise", () => {
    const twin: RelevanceItem = { ...item, id: "twin" };
    const [a, b] = scoreAll([item, twin], viewer, { now });
    expect(a.score).toBe(b.score);
  });
});
