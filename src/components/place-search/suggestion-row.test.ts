import { describe, expect, it } from "vitest";

import { matchSpan, MAX_ROWS, suggestionLabel } from "./suggestion-row";

/**
 * TS-WEB-0008 D7a, the row format and the row budget — the two properties of
 * the overlay a unit test can pin without a browser (TS-WEB-0008-A15 measures
 * the rest: the overlay's geometry and CLS).
 */
describe("TS-WEB-0008 D7a: the suggestion row", () => {
  it('renders "Ort (Gemeinde)" — the place first, its municipality in brackets', () => {
    expect(suggestionLabel({ name: "Schlatkow", municipality: "Schmatzin" })).toBe("Schlatkow (Schmatzin)");
  });

  it("renders the name alone where the source carries no municipality — never empty brackets", () => {
    expect(suggestionLabel({ name: "Schlatkow" })).toBe("Schlatkow");
    expect(suggestionLabel({ name: "Schlatkow", municipality: "  " })).toBe("Schlatkow");
  });

  it("budgets four rows, never more (DEC-0119: the upper end of D7a's 3–4)", () => {
    expect(MAX_ROWS).toBe(4);
  });
});

describe("the matched substring, for the 700-weight emphasis", () => {
  it("splits the name around the typed string, case-insensitively", () => {
    expect(matchSpan("Schlatkow", "schlat")).toEqual({ before: "", match: "Schlat", after: "kow" });
    expect(matchSpan("Groß Kiesow", "kies")).toEqual({ before: "Groß ", match: "Kies", after: "ow" });
  });

  it("emphasises nothing when the match was made elsewhere — folded, or on the municipality", () => {
    expect(matchSpan("Züssow", "zuess")).toEqual({ before: "Züssow", match: "", after: "" });
    expect(matchSpan("Schlatkow", "Schmatzin")).toEqual({ before: "Schlatkow", match: "", after: "" });
    expect(matchSpan("Schlatkow", "")).toEqual({ before: "Schlatkow", match: "", after: "" });
  });
});
