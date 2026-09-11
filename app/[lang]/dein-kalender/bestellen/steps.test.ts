import { describe, expect, it } from "vitest";

import { addPlace, parseOrte, removePlace, resolveOrderStep } from "./steps";

describe("TS-025-A4: scope in the URL", () => {
  it("parses and serializes the comma-separated slug list", () => {
    expect(parseOrte(undefined)).toEqual([]);
    expect(parseOrte("")).toEqual([]);
    expect(parseOrte("a,b")).toEqual(["a", "b"]);
  });

  it("adds without duplicating", () => {
    expect(addPlace(undefined, "a")).toBe("a");
    expect(addPlace("a", "a")).toBe("a");
    expect(addPlace("a", "b")).toBe("a,b");
  });

  it("removes one place, keeping the rest", () => {
    expect(removePlace("a,b,c", "b")).toBe("a,c");
    expect(removePlace("a", "a")).toBe("");
  });
});

describe("TS-025-A4: step resolution", () => {
  it("stays on the scope screen (step 1) with nothing selected", () => {
    expect(resolveOrderStep(false, undefined)).toBe(1);
    expect(resolveOrderStep(false, "3")).toBe(1);
    expect(resolveOrderStep(false, "4")).toBe(1);
  });

  it("moves to step 2 once something is selected, by default", () => {
    expect(resolveOrderStep(true, undefined)).toBe(2);
  });

  it("reaches step 3/4 only with a non-empty scope", () => {
    expect(resolveOrderStep(true, "3")).toBe(3);
    expect(resolveOrderStep(true, "4")).toBe(4);
  });

  it("ignores an invalid `schritt` value", () => {
    expect(resolveOrderStep(true, "not-a-number")).toBe(2);
    expect(resolveOrderStep(true, "0")).toBe(2);
    expect(resolveOrderStep(true, "99")).toBe(2);
  });
});
