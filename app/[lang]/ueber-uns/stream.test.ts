import { describe, expect, it } from "vitest";

import { filledOnly } from "./stream";

import type { ProofEntry } from "../_proof";

/**
 * TS-WEB-0027 D5 / A6 as amended by DEC-0175 §3 — a missing proof renders
 * nothing: no empty slot, no placeholder, and no backfill.
 */
const item = (id: string): ProofEntry => ({
  kind: "item",
  state: "ready",
  candidate: {
    id,
    contextLine: "Nordkurier",
    claim: "claim",
    attribution: "2022",
    demo: false,
  },
});

const empty: ProofEntry = { kind: "empty" };

describe("TS-WEB-0027-A6: a gap in the stream renders nothing, and nothing backfills it", () => {
  it("drops every gap and keeps the filled entries", () => {
    const kept = filledOnly([item("a"), item("b"), empty, empty]);
    expect(kept.map((entry) => entry.candidate.id)).toEqual(["a", "b"]);
  });

  it("keeps the engine's order of the filled entries", () => {
    const kept = filledOnly([item("a"), empty, item("b"), empty, item("c")]);
    expect(kept.map((entry) => entry.candidate.id)).toEqual(["a", "b", "c"]);
  });

  it("changes nothing where every position is filled", () => {
    const entries = [item("a"), item("b"), item("c")];
    expect(filledOnly(entries)).toEqual(entries);
  });

  it("renders nothing at all where no position is filled", () => {
    expect(filledOnly([empty, empty])).toEqual([]);
  });
});
