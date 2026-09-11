import { describe, expect, it } from "vitest";

import { gate } from "./gate";
import { geo, type RelevanceItem } from "./types";

const base: RelevanceItem = {
  id: "base",
  type: "testimonial",
  geo: geo({ country: "de" }),
  jobRelation: { "know-what-is-on": "supports" },
  date: "2026-01-01",
  clearance: "cleared",
};

describe("TS-005-A2: clearance is a hard filter applied before scoring", () => {
  it("passes a cleared element", () => {
    expect(gate([base]).items.map((item) => item.id)).toEqual(["base"]);
  });

  it("removes an unverified and an internal-only element, whatever it would have scored", () => {
    const pool: RelevanceItem[] = [
      { ...base, id: "unverified", clearance: "unverified" },
      { ...base, id: "internal", clearance: "internal-only" },
      base,
    ];
    const result = gate(pool);
    expect(result.items.map((item) => item.id)).toEqual(["base"]);
    expect(result.dropped).toEqual([
      { id: "unverified", reason: "clearance" },
      { id: "internal", reason: "clearance" },
    ]);
  });

  it("lets a labelled demo element through with its flag, so the prototype shows the mechanism", () => {
    const demo: RelevanceItem = { ...base, id: "demo", clearance: "unverified", demo: true };
    expect(gate([demo]).items.map((item) => item.id)).toEqual(["demo"]);
  });

  it("WEB-F-024: a place-bound element only from a covered place", () => {
    const pool: RelevanceItem[] = [
      { ...base, id: "covered", placeBound: true, place: "flechtorf" },
      { ...base, id: "uncovered", placeBound: true, place: "nirgendwo" },
      { ...base, id: "unplaced", placeBound: true, place: null },
    ];
    const result = gate(pool, { coveredPlaces: ["flechtorf"] });
    expect(result.items.map((item) => item.id)).toEqual(["covered"]);
    expect(result.dropped.map((drop) => drop.reason)).toEqual(["place-not-covered", "place-not-covered"]);
  });

  it("keeps place-bound elements when no coverage set is supplied — the caller has not asked events-api yet", () => {
    const pool: RelevanceItem[] = [{ ...base, id: "covered", placeBound: true, place: "flechtorf" }];
    expect(gate(pool).items).toHaveLength(1);
  });
});
