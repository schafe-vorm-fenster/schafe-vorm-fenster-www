import { describe, expect, it } from "vitest";

import { liveModuleChain } from "./live-chain";
import { geo, NO_GEO, type ViewerContext } from "./types";

const viewer: ViewerContext = {
  geo: geo({
    country: "de",
    state: "niedersachsen",
    county: "helmstedt",
    municipality: "lehre",
    community: "flechtorf",
  }),
  trait: "reader-search",
  job: "know-what-is-on",
  stage: 3,
  locale: "de",
};

describe("TS-005-A16: the widening chain resolves place → surroundings → county → all regions", () => {
  it("emits the four modules in the documented order, each with the id list of its level", () => {
    const chain = liveModuleChain({ viewer, surroundingCommunities: ["flechtorf", "wendhausen"] });
    expect(chain.steps.map((step) => step.radius)).toEqual([
      "place",
      "surroundings",
      "county",
      "all",
    ]);
    expect(chain.steps[0].ids).toEqual(["flechtorf"]);
    expect(chain.steps[1].ids).toEqual(["flechtorf", "wendhausen"]);
    expect(chain.steps[2].ids).toEqual(["helmstedt"]);
    expect(chain.steps[3].ids).toEqual([]);
  });

  it("skips no step when the previous one returns results", () => {
    const chain = liveModuleChain({ viewer, placeHasDates: true });
    expect(chain.steps).toHaveLength(4);
    expect(chain.startsAt).toBe("place");
    expect(chain.placeIsEmpty).toBe(false);
  });

  it("starts at radius 2 when the place carries no dates", () => {
    const chain = liveModuleChain({ viewer, placeHasDates: false });
    expect(chain.startsAt).toBe("surroundings");
    expect(chain.steps.map((step) => step.radius)).toEqual(["surroundings", "county", "all"]);
    expect(chain.placeIsEmpty).toBe(true);
  });

  it("starts at the county when no place is known at all (stage 0/1)", () => {
    const chain = liveModuleChain({
      viewer: { ...viewer, geo: geo({ country: "de", state: "niedersachsen", county: "helmstedt" }), stage: 1 },
    });
    expect(chain.startsAt).toBe("county");
    expect(chain.steps.map((step) => step.radius)).toEqual(["county", "all"]);
  });

  it("renders the counters alone at stage 0", () => {
    const chain = liveModuleChain({ viewer: { ...viewer, geo: NO_GEO, stage: 0 } });
    expect(chain.steps.map((step) => step.radius)).toEqual(["all"]);
    expect(chain.startsAt).toBe("all");
  });

  it("replaces module 1 with the embed demo where the focus job is run-our-own-calendar", () => {
    const chain = liveModuleChain({ viewer: { ...viewer, job: "run-our-own-calendar" } });
    expect(chain.steps[0].module).toBe("embed-demo");
    expect(chain.steps[0].radius).toBe("place");
  });
});
