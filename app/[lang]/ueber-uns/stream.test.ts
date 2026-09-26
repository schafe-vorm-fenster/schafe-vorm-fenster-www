import { describe, expect, it } from "vitest";

import { oneEmptySlot } from "./stream";

import type { ProofEntry } from "../_proof";

/**
 * TS-WEB-0027 D5 / A6 — "at most **one** empty slot is ever visible. Further
 * gaps shorten the stream below seven instead of adding a second empty slot."
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

describe("TS-WEB-0027-A6: the reserved place is the stream's only empty slot", () => {
  it("keeps one gap and drops the rest, without backfilling", () => {
    const kept = oneEmptySlot([item("a"), item("b"), empty, empty]);
    expect(kept.filter((entry) => entry.kind === "empty")).toHaveLength(1);
    expect(kept.filter((entry) => entry.kind === "item")).toHaveLength(2);
    // No item moved into the dropped position: the list is two items and one gap.
    expect(kept).toHaveLength(3);
  });

  it("keeps the gap where the engine put it", () => {
    const kept = oneEmptySlot([item("a"), empty, item("b"), empty]);
    expect(kept.map((entry) => entry.kind)).toEqual(["item", "empty", "item"]);
  });

  it("changes nothing where the engine left exactly one gap", () => {
    const entries = [item("a"), item("b"), empty];
    expect(oneEmptySlot(entries)).toEqual(entries);
  });

  it("changes nothing where every position is filled", () => {
    const entries = [item("a"), item("b")];
    expect(oneEmptySlot(entries)).toEqual(entries);
  });
});
