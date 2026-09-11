import { describe, expect, it } from "vitest";

import { MAY_CHANGE, MAY_NEVER_CHANGE, STAGE_MODEL, stageOf } from "./stages";
import { geo, NO_GEO } from "../relevance/types";

describe("TS-010-A1: the stage is a label on a resolved object, never a mode", () => {
  it("stage 0 — nothing known", () => {
    expect(stageOf({ geo: NO_GEO, trait: "direct" })).toBe(0);
  });

  it("stage 1 — an approximate location", () => {
    expect(stageOf({ geo: geo({ country: "de", state: "mecklenburg-vorpommern" }), trait: "direct" })).toBe(1);
  });

  it("stage 2 — an entry context, with or without a location", () => {
    expect(stageOf({ geo: NO_GEO, trait: "professional" })).toBe(2);
    expect(stageOf({ geo: geo({ country: "de" }), trait: "social" })).toBe(2);
  });

  it("stage 3 — a stated place, whatever else is known", () => {
    expect(stageOf({ geo: geo({ community: "flechtorf" }), trait: "direct" })).toBe(3);
    expect(stageOf({ geo: geo({ community: "flechtorf" }), trait: "press" })).toBe(3);
  });

  it("names the four stages of SRC-001 §6 and what each one may do", () => {
    expect(STAGE_MODEL.map((stage) => stage.stage)).toEqual([0, 1, 2, 3]);
    for (const stage of STAGE_MODEL) {
      expect(stage.mayChange).toEqual(MAY_CHANGE);
    }
  });

  it("records the invariants no stage may touch", () => {
    expect(MAY_NEVER_CHANGE.map((row) => row.invariant)).toEqual([
      "page structure",
      "focus job",
      "conversion",
      "navigation",
      "URL and canonical",
    ]);
  });
});
