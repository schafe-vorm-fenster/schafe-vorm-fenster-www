import { describe, expect, it } from "vitest";

import { emphasise, orderByTrait, validateEmphasisTable } from "./emphasis";

/** TS-019 D3a's table, as the home page will pass it. */
const scenes = ["whatsapp", "embed", "provenance"] as const;
const sceneOrder = {
  professional: ["embed", "provenance", "whatsapp"],
  "purchase-intent": ["embed", "provenance", "whatsapp"],
  press: ["provenance", "whatsapp", "embed"],
} as const;

describe("DEC-059 / Q-052: entry context sets emphasis and order, never the focus job", () => {
  it("reorders the scenes for a trait the table names", () => {
    expect(orderByTrait(scenes, sceneOrder, "professional")).toEqual([
      "embed",
      "provenance",
      "whatsapp",
    ]);
    expect(orderByTrait(scenes, sceneOrder, "press")).toEqual([
      "provenance",
      "whatsapp",
      "embed",
    ]);
  });

  it("leaves the default order for every trait the table does not name", () => {
    for (const trait of ["direct", "social", "print-qr", "reader-search", "activated"] as const) {
      expect(orderByTrait(scenes, sceneOrder, trait)).toEqual([...scenes]);
    }
  });

  it("never adds, removes or rewrites an element — a variant that is not a permutation is refused", () => {
    const broken = { press: ["provenance", "whatsapp"] } as const;
    expect(orderByTrait(scenes, broken, "press")).toEqual([...scenes]);
    expect(validateEmphasisTable(scenes, broken)).toEqual([
      "press: the variant is not a permutation of the default order",
    ]);
    expect(validateEmphasisTable(scenes, sceneOrder)).toEqual([]);
  });

  it("emphasises the first element of the trait's order, and says which one that is", () => {
    expect(emphasise(scenes, sceneOrder, "press")).toEqual({
      order: ["provenance", "whatsapp", "embed"],
      emphasised: "provenance",
    });
    expect(emphasise(scenes, sceneOrder, "direct").emphasised).toBe("whatsapp");
  });

  it("returns a set of the same size for every trait — the structure cannot vary by entry", () => {
    for (const trait of ["direct", "professional", "press", "social"] as const) {
      expect(orderByTrait(scenes, sceneOrder, trait).toSorted()).toEqual([...scenes].toSorted());
    }
  });
});
