import { describe, expect, it } from "vitest";

import { matchesSelection, toggleSelection } from "./selection";

describe("TS-028 D4/D5: zero selected shows all, otherwise OR-combined", () => {
  it("shows every row when nothing is selected", () => {
    expect(matchesSelection(["presse"], new Set())).toBe(true);
    expect(matchesSelection([], new Set())).toBe(true);
  });

  it("shows a row that carries at least one selected type", () => {
    expect(matchesSelection(["presse", "radio"], new Set(["radio"]))).toBe(true);
  });

  it("hides a row that carries none of the selected types", () => {
    expect(matchesSelection(["presse"], new Set(["radio"]))).toBe(false);
  });

  it("OR-combines two selected types", () => {
    const selected = new Set(["presse", "radio"]);
    expect(matchesSelection(["radio"], selected)).toBe(true);
    expect(matchesSelection(["fernsehen"], selected)).toBe(false);
  });
});

describe("toggleSelection: an immutable add/remove", () => {
  it("adds a type not yet selected", () => {
    const next = toggleSelection(new Set(), "presse");
    expect([...next]).toEqual(["presse"]);
  });

  it("removes a type already selected", () => {
    const next = toggleSelection(new Set(["presse"]), "presse");
    expect(next.size).toBe(0);
  });

  it("never mutates the set it was given", () => {
    const original = new Set(["presse"]);
    toggleSelection(original, "radio");
    expect(original.size).toBe(1);
  });
});
