import { describe, expect, it } from "vitest";

import { ageInDays, freshness, timeScore } from "./freshness";

const now = new Date("2026-09-11T12:00:00Z");

describe("TS-005-A6: time is one weight among four, never a verdict", () => {
  it("steps down the D4 table and floors at 0.35", () => {
    expect(freshness("2026-08-01", now)).toBe(1.0); // ≤ 90 days
    expect(freshness("2026-01-15", now)).toBe(0.8); // ≤ 1 year
    expect(freshness("2024-06-01", now)).toBe(0.6); // ≤ 3 years
    expect(freshness("2022-06-01", now)).toBe(0.45); // ≤ 5 years
    expect(freshness("2019-03-01", now)).toBe(0.35); // older
  });

  it("reads a year and a year-month as their first day", () => {
    expect(ageInDays("2026", now)).toBe(ageInDays("2026-01-01", now));
    expect(ageInDays("2026-08", now)).toBe(ageInDays("2026-08-01", now));
  });

  it("treats an undated or unparsable element as old rather than as fresh", () => {
    expect(freshness(null, now)).toBe(0.35);
    expect(freshness("irgendwann", now)).toBe(0.35);
  });

  it("never rewards a date in the future beyond the freshest step", () => {
    expect(freshness("2027-01-01", now)).toBe(1.0);
  });

  it("multiplies the editorial weight, so an evergreen piece is marked without touching the algorithm", () => {
    expect(timeScore({ date: "2026-09-01" }, now)).toBe(1.0);
    expect(timeScore({ date: "2021-10-01", editorialWeight: 2.5 }, now)).toBeGreaterThan(
      timeScore({ date: "2026-09-01" }, now),
    );
  });

  it("does NOT let a five-year-old element at weight 2.0 outrank a fresh one — TS-005-A6 is unsatisfiable as written", () => {
    // The finding, not a workaround: D4's five-year step is 0.45, so the
    // weight needed is > 1/0.45 ≈ 2.23, and A6 names 2.0. The engine
    // implements D4 verbatim; the criterion is recorded in state/open.md
    // rather than the table bent to fit it (plan/guardrails.md).
    expect(timeScore({ date: "2021-10-01", editorialWeight: 2.0 }, now)).toBeLessThan(
      timeScore({ date: "2026-09-01" }, now),
    );
  });
});
