import { describe, expect, it } from "vitest";

import { isoWeekSeed, rotateTies } from "./rotation";

const scored = (id: string, score: number) => ({ id, score });

describe("TS-005-A11: the rotation seed is the ISO week, and it is an input", () => {
  it("formats the ISO year and week, not the calendar year", () => {
    expect(isoWeekSeed(new Date("2026-09-11T00:00:00Z"))).toBe("2026-W37");
    // 1 January 2027 is a Friday and belongs to ISO week 53 of 2026.
    expect(isoWeekSeed(new Date("2027-01-01T00:00:00Z"))).toBe("2026-W53");
    // 4 January 2027 opens ISO week 1 of 2027.
    expect(isoWeekSeed(new Date("2027-01-04T00:00:00Z"))).toBe("2027-W01");
  });

  it("is stable within a week and changes at the week boundary", () => {
    expect(isoWeekSeed(new Date("2026-09-07T00:00:00Z"))).toBe(
      isoWeekSeed(new Date("2026-09-13T23:59:59Z")),
    );
    expect(isoWeekSeed(new Date("2026-09-14T00:00:00Z"))).toBe("2026-W38");
  });

  it("shifts equally-scored candidates and nothing else", () => {
    const pool = [
      scored("a", 0.9),
      scored("b", 0.5),
      scored("c", 0.5),
      scored("d", 0.5),
      scored("e", 0.1),
    ];
    const week37 = rotateTies(pool, "2026-W37").map((item) => item.id);
    const week38 = rotateTies(pool, "2026-W38").map((item) => item.id);

    expect(week37[0]).toBe("a");
    expect(week37[4]).toBe("e");
    expect(week38[0]).toBe("a");
    expect(week38[4]).toBe("e");
    expect(week37.slice(1, 4).toSorted()).toEqual(["b", "c", "d"]);
    expect(week37).not.toEqual(week38);
  });

  it("is a rotation, so the scores stay in descending order under every seed", () => {
    const pool = [scored("a", 0.9), scored("b", 0.5), scored("c", 0.5), scored("d", 0.2)];
    for (let week = 1; week <= 53; week += 1) {
      const seed = `2026-W${String(week).padStart(2, "0")}`;
      const scores = rotateTies(pool, seed).map((item) => item.score);
      expect(scores).toEqual([...scores].toSorted((a, b) => b - a));
    }
  });

  it("is deterministic: the same seed gives the same order, run after run", () => {
    const pool = [scored("z", 0.5), scored("a", 0.5), scored("m", 0.5)];
    const first = rotateTies(pool, "2026-W20").map((item) => item.id);
    for (let run = 0; run < 100; run += 1) {
      expect(rotateTies(pool, "2026-W20").map((item) => item.id)).toEqual(first);
    }
    expect(first.toSorted()).toEqual(["a", "m", "z"]);
  });

  it("leaves a group of one untouched", () => {
    expect(rotateTies([scored("only", 0.4)], "2026-W20").map((item) => item.id)).toEqual(["only"]);
  });
});
