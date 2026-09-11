import { describe, expect, it } from "vitest";

import { orderBySequenceRule } from "./order";

/** A scored stand-in: the ordering rule only ever reads id, score and tier. */
const candidate = (id: string, score: number, tier: number) => ({ id, score, tier });

describe("TS-005-A12: the sequence rule orders the stream, never the calendar", () => {
  it("puts the two highest scorers in positions 1 and 2", () => {
    const ordered = orderBySequenceRule([
      candidate("near-a", 0.9, 0),
      candidate("near-b", 0.85, 1),
      candidate("far-a", 0.8, 4),
      candidate("near-c", 0.7, 1),
    ]);
    expect(ordered.slice(0, 2).map((item) => item.id)).toEqual(["near-a", "near-b"]);
  });

  it("widens at position 3 and returns to proximity at position 4", () => {
    const ordered = orderBySequenceRule([
      candidate("near-a", 0.9, 0),
      candidate("near-b", 0.85, 1),
      candidate("near-c", 0.84, 1),
      candidate("far-a", 0.8, 4),
      candidate("near-d", 0.75, 0),
    ]);
    expect(ordered.map((item) => item.tier)).toEqual([0, 1, 4, 1, 0]);
  });

  it("takes the element furthest from the centre of gravity, not merely the next-most-distant", () => {
    const ordered = orderBySequenceRule([
      candidate("near-a", 0.9, 0),
      candidate("near-b", 0.85, 0),
      candidate("middle", 0.8, 2),
      candidate("very-far", 0.75, 5),
      candidate("near-c", 0.7, 0),
    ]);
    expect(ordered[2].id).toBe("very-far");
  });

  it("keeps the top candidate when the furthest element scores below half of it", () => {
    const ordered = orderBySequenceRule([
      candidate("near-a", 0.9, 0),
      candidate("near-b", 0.85, 0),
      candidate("middle", 0.8, 2),
      candidate("very-far", 0.2, 6),
    ]);
    expect(ordered[2].id).toBe("middle");
  });

  it("breaks ties by id, ascending", () => {
    const ordered = orderBySequenceRule([
      candidate("b", 0.5, 0),
      candidate("a", 0.5, 0),
      candidate("c", 0.5, 0),
    ]);
    expect(ordered.map((item) => item.id)).toEqual(["a", "b", "c"]);
  });

  it("is not a chronological order — it never looks at a date at all", () => {
    const ordered = orderBySequenceRule([
      candidate("oldest-but-best", 0.95, 0),
      candidate("newest", 0.4, 4),
      candidate("middle-aged", 0.9, 1),
    ]);
    expect(ordered.map((item) => item.id)).toEqual(["oldest-but-best", "middle-aged", "newest"]);
  });
});

describe("TS-005-A7: ordering never deadlocks", () => {
  it("fills the stream when every candidate is near", () => {
    const pool = [0, 1, 2, 3, 4, 5, 6].map((n) => candidate(`near-${n}`, 0.9 - n / 100, 0));
    expect(orderBySequenceRule(pool)).toHaveLength(7);
  });

  it("fills the stream when every candidate is far", () => {
    const pool = [0, 1, 2, 3, 4].map((n) => candidate(`far-${n}`, 0.9 - n / 100, 6));
    expect(orderBySequenceRule(pool)).toHaveLength(5);
  });

  it("returns every candidate exactly once", () => {
    const pool = [
      candidate("a", 0.9, 0),
      candidate("b", 0.8, 4),
      candidate("c", 0.7, 1),
      candidate("d", 0.6, 6),
      candidate("e", 0.5, 2),
    ];
    const ordered = orderBySequenceRule(pool);
    expect(ordered.map((item) => item.id).toSorted()).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("handles the degenerate pools without throwing", () => {
    expect(orderBySequenceRule([])).toEqual([]);
    expect(orderBySequenceRule([candidate("only", 0.5, 3)]).map((i) => i.id)).toEqual(["only"]);
  });
});
