import { describe, expect, it } from "vitest";

import { checkRhythm } from "./rhythm";

/** The design system's own home-page rhythm, which must pass unchanged. */
const HOME = [
  "photo",
  "lime-500",
  "ink",
  "photo",
  "lime-100",
  "photo",
  "surface",
  "violet-500",
  "paper",
] as const;

describe("TS-006-A: the page rhythm is part of the design", () => {
  it("accepts the rhythm the design system prints", () => {
    expect(checkRhythm(HOME, 1)).toEqual([]);
  });

  it("rejects two photo sections in a row", () => {
    const violations = checkRhythm(["photo", "photo", "paper"]);
    expect(violations.map((v) => v.rule)).toContain(
      "no photo section adjacent to another",
    );
  });

  it("rejects three consecutive sections of one colour family", () => {
    const violations = checkRhythm(["paper", "surface", "surface-2"]);
    expect(violations).toHaveLength(1);
    expect(violations[0].rule).toBe(
      "at most two consecutive sections of one colour family",
    );
  });

  it("allows two of one family, which is the stated maximum", () => {
    expect(checkRhythm(["lime-100", "lime-500", "paper"])).toEqual([]);
  });

  it("rejects a second dark anchor and a second himbeere element", () => {
    expect(checkRhythm(["ink", "paper", "ink"]).map((v) => v.rule)).toContain(
      "the dark ink section appears once per page",
    );
    expect(checkRhythm(["paper"], 2).map((v) => v.rule)).toContain(
      "exactly one himbeere element per screen",
    );
  });
});
