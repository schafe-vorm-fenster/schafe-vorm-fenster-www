import { describe, expect, it } from "vitest";

import { parseBlocks } from "@/src/lib/content/blocks";

import { comparisonPairs } from "./_comparison";

/**
 * The comparison module's table (issue #159, DEC-0203). The fixtures are the
 * shape the artifacts author, not their wording — a copy change must not
 * break a test, and a grammar change must.
 */

const TABLE = `
| Heute | Mit eurem Kalender |
| --- | --- |
| eins heute | eins mit Kalender |
| zwei heute | zwei mit Kalender |
`;

describe("comparisonPairs", () => {
  it("reads both labels off the table head and pairs each row with the page's glyph", () => {
    expect(comparisonPairs(parseBlocks(TABLE), ["megaphone", "clock"], "slot")).toEqual({
      labels: { today: "Heute", withCalendar: "Mit eurem Kalender" },
      rows: [
        { icon: "megaphone", today: "eins heute", withProduct: "eins mit Kalender" },
        { icon: "clock", today: "zwei heute", withProduct: "zwei mit Kalender" },
      ],
    });
  });

  it("throws where a label is missing rather than rendering a bare colon", () => {
    const missing = `
| Heute |  |
| --- | --- |
| eins heute | eins mit Kalender |
`;
    expect(() => comparisonPairs(parseBlocks(missing), ["clock"], "slot")).toThrow(/column labels/u);
  });

  it("throws where the slot carries no table at all", () => {
    expect(() =>
      comparisonPairs(parseBlocks("**Überschrift:** ohne Tabelle"), ["clock"], "slot"),
    ).toThrow(/needs a table/u);
  });

  it("throws where the rows and the page's glyphs disagree in number", () => {
    expect(() => comparisonPairs(parseBlocks(TABLE), ["clock"], "slot")).toThrow(/2 rows.*1 pairs/u);
    expect(() =>
      comparisonPairs(parseBlocks(TABLE), ["clock", "users", "monitor"], "slot"),
    ).toThrow(/2 rows.*3 pairs/u);
  });

  it("throws where a cell is empty", () => {
    const empty = `
| Heute | Mit eurem Kalender |
| --- | --- |
| eins heute |  |
`;
    expect(() => comparisonPairs(parseBlocks(empty), ["clock"], "slot")).toThrow(/empty cell/u);
  });
});
