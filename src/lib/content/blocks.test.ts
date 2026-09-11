import { describe, expect, it } from "vitest";

import { ctaOf, fieldAt, fieldsOf, parseBlocks } from "@/src/lib/content/blocks";

const body = `**Headline:** Was ist bei dir los?

**Sucheingabe (Placeholder):** Deine Postleitzahl

**Button:** Suchen

Begründung: Die Ortssuche läuft heute ausschließlich über die
Postleitzahl (Q-025).

- Presse
- Auszeichnung

| Titel | Typ |
| --- | --- |
| Beispiel A | Presse |
| Beispiel B | Podcast |
`;

describe("TS-007-A1: a slot body parses into typed blocks, never into HTML", () => {
  const blocks = parseBlocks(body);

  it("reads `**Label:** value` as a field", () => {
    expect(blocks[0]).toEqual({
      kind: "field",
      label: "Headline",
      value: "Was ist bei dir los?",
    });
    expect(blocks[1]).toEqual({
      kind: "field",
      label: "Sucheingabe (Placeholder)",
      value: "Deine Postleitzahl",
    });
  });

  it("reads prose as a paragraph, joining its wrapped lines", () => {
    const paragraph = blocks.find((block) => block.kind === "paragraph");
    expect(paragraph).toBeDefined();
    expect(paragraph?.kind === "paragraph" && paragraph.text).toContain(
      "über die Postleitzahl",
    );
  });

  it("reads a bullet list", () => {
    const list = blocks.find((block) => block.kind === "list");
    expect(list).toEqual({
      kind: "list",
      ordered: false,
      items: ["Presse", "Auszeichnung"],
    });
  });

  it("reads a pipe table with its header row", () => {
    const table = blocks.find((block) => block.kind === "table");
    expect(table).toEqual({
      kind: "table",
      head: ["Titel", "Typ"],
      rows: [
        ["Beispiel A", "Presse"],
        ["Beispiel B", "Podcast"],
      ],
    });
  });

  it("indexes fields by label and finds the CTA label", () => {
    expect(fieldsOf(blocks)["Button"]).toBe("Suchen");
    expect(ctaOf(blocks)).toBe("Suchen");
    expect(ctaOf(parseBlocks("**CTA-Label (primär):** Kalender öffnen"))).toBe(
      "Kalender öffnen",
    );
    expect(ctaOf(parseBlocks("**Headline:** nur eine Überschrift"))).toBeUndefined();
  });

  it("reads a bold sentence as prose, not as a field with an invented label", () => {
    const blocks = parseBlocks(
      "**The legal texts on this page are German only.** All six sections\nexist in German today.",
    );
    expect(blocks).toHaveLength(1);
    expect(blocks[0]).toEqual({
      kind: "paragraph",
      text: "The legal texts on this page are German only. All six sections exist in German today.",
    });
  });

  it("addresses fields by position, because the labels are translated", () => {
    const de = parseBlocks("**Sucheingabe (Placeholder):** Deine Postleitzahl");
    const en = parseBlocks("**Search input (placeholder):** Your postcode");
    expect(fieldAt(de, 0)).toBe("Deine Postleitzahl");
    expect(fieldAt(en, 0)).toBe("Your postcode");
    expect(fieldAt(en, 3)).toBeUndefined();
  });

  it("returns no blocks for an empty body rather than throwing", () => {
    expect(parseBlocks("")).toEqual([]);
    expect(parseBlocks("   \n\n  ")).toEqual([]);
  });

  it("keeps a runtime placeholder intact — segment independence (TS-007 D7)", () => {
    const [block] = parseBlocks("**Headline:** Das ist los in {place}");
    expect(block.kind === "field" && block.value).toBe("Das ist los in {place}");
  });
});
