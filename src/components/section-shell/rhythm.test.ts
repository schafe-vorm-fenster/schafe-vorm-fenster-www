import { describe, expect, it } from "vitest";

import { checkRhythm, RHYTHM_RULES } from "./rhythm";

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

/**
 * SRC-0014 §Page Rhythm prints the closing Dorfkalender block as a tenth
 * section, `ink`, after the context band — the one further ink section a
 * page may carry.
 */
const HOME_WITH_CLOSING_SEARCH = [...HOME, "ink"] as const;

describe("TS-006-A: the page rhythm is part of the design", () => {
  it("accepts the rhythm the design system prints", () => {
    expect(checkRhythm(HOME, 1)).toEqual([]);
    expect(checkRhythm(HOME_WITH_CLOSING_SEARCH, 1)).toEqual([]);
  });

  it("rejects two photo sections in a row", () => {
    const violations = checkRhythm(["photo", "photo", "paper"]);
    expect(violations.map((v) => v.rule)).toContain(RHYTHM_RULES.photoAdjacent);
  });

  it("rejects three consecutive sections of one colour family", () => {
    const violations = checkRhythm(["paper", "surface", "surface-2"]);
    expect(violations).toHaveLength(1);
    expect(violations[0].rule).toBe(RHYTHM_RULES.family);
  });

  it("allows two of one family, which is the stated maximum", () => {
    expect(checkRhythm(["lime-100", "lime-500", "paper"])).toEqual([]);
  });

  it("rejects a second himbeere element", () => {
    expect(checkRhythm(["paper"], 2).map((v) => v.rule)).toContain(RHYTHM_RULES.himbeere);
  });
});

describe("TS-WEB-0019-A10 / SRC-0014 §Page Rhythm: the closing search block is the one further ink section (DEC-0117)", () => {
  it("allows a second ink section when it is the page's last section", () => {
    expect(checkRhythm(["photo", "ink", "paper", "surface", "ink"])).toEqual([]);
  });

  it("rejects a second ink section anywhere but last", () => {
    const violations = checkRhythm(["ink", "paper", "ink", "paper"]);
    expect(violations).toEqual([{ index: 2, rule: RHYTHM_RULES.inkClosingLast }]);
  });

  it("rejects two adjacent ink sections, even at the end", () => {
    const violations = checkRhythm(["paper", "ink", "ink"]);
    expect(violations.map((v) => v.rule)).toContain(RHYTHM_RULES.inkAdjacent);
    expect(violations.map((v) => v.rule)).not.toContain(RHYTHM_RULES.inkClosingLast);
  });

  it("rejects a third ink section outright", () => {
    const violations = checkRhythm(["ink", "paper", "ink", "paper", "ink"]);
    expect(violations).toEqual([{ index: 4, rule: RHYTHM_RULES.inkOnce }]);
  });
});

describe("SRC-0014 §Section grounds carry rhythm: the archive ground and the contact exemption (DEC-0117)", () => {
  it("counts the archive ground as its own family — it breaks a neutral run", () => {
    expect(checkRhythm(["paper", "archive", "surface"])).toEqual([]);
    expect(checkRhythm(["paper", "surface", "archive"])).toEqual([]);
  });

  it("holds the archive ground to the same two-in-a-row maximum", () => {
    const violations = checkRhythm(["archive", "archive", "archive"]);
    expect(violations).toEqual([{ index: 2, rule: RHYTHM_RULES.family }]);
  });

  it("never counts the contact section: it neither adds to a run nor breaks one", () => {
    // Passed explicitly, it is dropped before any rule looks.
    expect(checkRhythm(["lime-100", "lime-500", "contact", "paper"])).toEqual([]);
    // It does not break a run either: the sections on either side count
    // against each other as if it were not there.
    expect(checkRhythm(["paper", "surface", "contact", "surface-2"])).toEqual([
      { index: 2, rule: RHYTHM_RULES.family },
    ]);
    // And it does not stand between a closing ink block and the page's end.
    expect(checkRhythm(["ink", "paper", "ink", "contact"])).toEqual([]);
  });
});
