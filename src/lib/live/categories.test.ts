import { describe, expect, it } from "vitest";

import { EVENT_CATEGORIES } from "@/src/components/event-row/event-row";

import { categoryLabel, categoryTone, EVENTS_API_CATEGORY_IDS } from "./categories";

/**
 * The mapping that was missing — and the regression it fixes.
 *
 * `toListItems` used to ask whether an events-api category id was one of the
 * design system's own names. It never is: the two vocabularies are different
 * lists, so every real event rendered as `neighbouring` with the word
 * "Nachbarschaft" beside it, whatever it actually was.
 */

describe("every events-api category reaches a tone of its own", () => {
  it("maps the five upstream ids to five different tones", () => {
    const tones = EVENTS_API_CATEGORY_IDS.map((id) => categoryTone(id));
    expect(new Set(tones).size).toBe(EVENTS_API_CATEGORY_IDS.length);
    for (const tone of tones) expect(EVENT_CATEGORIES).toContain(tone);
  });

  it("does not collapse a classified event onto the fallback tone", () => {
    for (const id of ["community-life", "education-health", "everyday-supply", "culture-tourism"] as const) {
      expect(categoryTone(id), id).not.toBe("neighbouring");
    }
  });

  it("keeps the four subject tones stable — a page's colour is part of its meaning", () => {
    expect(categoryTone("community-life")).toBe("social");
    expect(categoryTone("education-health")).toBe("official");
    expect(categoryTone("everyday-supply")).toBe("merchants");
    expect(categoryTone("culture-tourism")).toBe("culture");
  });
});

describe("what has no id", () => {
  it("sends `unknown`, an absent id and an id nobody has seen to the same fallback", () => {
    expect(categoryTone("unknown")).toBe("neighbouring");
    expect(categoryTone(undefined)).toBe("neighbouring");
    expect(categoryTone("something-events-api-adds-next-year")).toBe("neighbouring");
  });

  it("leaves `fest` unassigned rather than inventing a rule for it", () => {
    // events-api has no festival category, and deriving one from a title
    // would be a classification the ecosystem did not make (open row 6).
    const assigned = new Set(EVENTS_API_CATEGORY_IDS.map((id) => categoryTone(id)));
    expect(assigned.has("fest")).toBe(false);
  });
});

describe("the words beside the tone", () => {
  it("uses the upstream vocabulary's own short names, in both locales", () => {
    expect(categoryLabel("everyday-supply", "de")).toBe("Versorgung");
    expect(categoryLabel("culture-tourism", "de")).toBe("Kultur & Tourismus");
    expect(categoryLabel("community-life", "en")).toBe("Community life");
  });

  it("labels an unknown id in the visitor's language, never with the raw id", () => {
    expect(categoryLabel("nonsense", "de")).toBe("Sonstiges");
    expect(categoryLabel("nonsense", "en")).toBe("Other");
  });
});
