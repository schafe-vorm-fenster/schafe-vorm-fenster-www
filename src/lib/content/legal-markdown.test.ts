import { describe, expect, it } from "vitest";

import { parseLegalMarkdown, shiftHeadings } from "./legal-markdown";

describe("TS-029 D1-D6: legal markdown reader", () => {
  it("parses headings at every level 1-6", () => {
    const blocks = parseLegalMarkdown("# One\n## Two\n### Three\n#### Four");
    expect(blocks).toEqual([
      { kind: "heading", level: 1, text: "One" },
      { kind: "heading", level: 2, text: "Two" },
      { kind: "heading", level: 3, text: "Three" },
      { kind: "heading", level: 4, text: "Four" },
    ]);
  });

  it("parses a paragraph with bold and a link", () => {
    const blocks = parseLegalMarkdown("Contact **Jan-Henrik** at [our site](https://example.com).");
    expect(blocks).toEqual([
      {
        kind: "paragraph",
        inline: [
          { kind: "text", value: "Contact " },
          { kind: "bold", value: "Jan-Henrik" },
          { kind: "text", value: " at " },
          { kind: "link", text: "our site", href: "https://example.com" },
          { kind: "text", value: "." },
        ],
      },
    ]);
  });

  it("keeps a trailing double-space as a hard break within one paragraph", () => {
    const blocks = parseLegalMarkdown("Street 1  \nTown  \nCountry");
    expect(blocks).toHaveLength(1);
    const [block] = blocks;
    expect(block.kind).toBe("paragraph");
    if (block.kind !== "paragraph") throw new Error("unreachable");
    expect(block.inline).toEqual([
      { kind: "text", value: "Street 1" },
      { kind: "break" },
      { kind: "text", value: "Town" },
      { kind: "break" },
      { kind: "text", value: "Country" },
    ]);
  });

  it("parses a bullet list, separately from an ordered list", () => {
    const blocks = parseLegalMarkdown("- one\n- two\n\n1. first\n2. second");
    expect(blocks).toEqual([
      { kind: "list", ordered: false, items: [[{ kind: "text", value: "one" }], [{ kind: "text", value: "two" }]] },
      {
        kind: "list",
        ordered: true,
        items: [[{ kind: "text", value: "first" }], [{ kind: "text", value: "second" }]],
      },
    ]);
  });

  it("never throws on an unrecognised line — it becomes prose", () => {
    expect(() => parseLegalMarkdown("| a | b |\n|---|---|\n| c | d |")).not.toThrow();
  });

  it("shiftHeadings demotes every level, capped at h6", () => {
    const blocks = parseLegalMarkdown("# Impressum\n## Kontakt\n#### Deep");
    expect(shiftHeadings(blocks, 2)).toEqual([
      { kind: "heading", level: 3, text: "Impressum" },
      { kind: "heading", level: 4, text: "Kontakt" },
      { kind: "heading", level: 6, text: "Deep" },
    ]);
  });

  it("shiftHeadings never produces a level above 6", () => {
    const blocks = parseLegalMarkdown("#### Four");
    expect(shiftHeadings(blocks, 4)).toEqual([{ kind: "heading", level: 6, text: "Four" }]);
  });

  it("leaves non-heading blocks untouched by shiftHeadings", () => {
    const blocks = parseLegalMarkdown("plain paragraph");
    expect(shiftHeadings(blocks, 2)).toEqual(blocks);
  });
});
