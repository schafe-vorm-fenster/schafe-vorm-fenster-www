import { describe, expect, it } from "vitest";

import { PRICE_TIERS } from "@/src/components/price-section/price-section";
import { parseBlocks } from "@/src/lib/content/blocks";

import { comparisonLabels, settingRows, settingTags, tierChecks } from "./content";

/**
 * The two tables `/dein-kalender` reads (DEC-0131 §1/§3). The fixtures are
 * the shape the artifacts author, not their wording — a copy change must not
 * break a test, and a grammar change must.
 */

const CONFIG_TABLE = `
| Einstellung | Kernsatz | Beispiel | Chips |
| --- | --- | --- | --- |
| Orte | Einzelne Orte oder ganze Gemeinden. | Beispiel: nur das Stadtgebiet. | Stadtgebiet, Ortsteile, ~~Nachbarorte~~ |
| Zeitraum | Wie weit der Kalender nach vorn schaut. | | |
`;

const CHECKS_TABLE = `
| Stufe | Häkchen 1 | Häkchen 2 | Häkchen 3 |
| --- | --- | --- | --- |
| community-calendar | eins | zwei | drei |
| portalize-enterprise | eins | zwei | |
`;

describe("settingTags", () => {
  it("reads a struck value as the excluded state and leaves the others plain", () => {
    expect(settingTags("Stadtgebiet, Ortsteile, ~~Nachbarorte~~")).toEqual([
      { label: "Stadtgebiet" },
      { label: "Ortsteile" },
      { label: "Nachbarorte", excluded: true },
    ]);
  });

  it("is empty for an empty cell rather than one blank tag", () => {
    expect(settingTags("")).toEqual([]);
    expect(settingTags("  ,  ")).toEqual([]);
  });
});

describe("settingRows", () => {
  const rows = settingRows(parseBlocks(CONFIG_TABLE));

  it("reads one row per table row, in the artifact's order", () => {
    expect(rows.map((row) => row.title)).toEqual(["Orte", "Zeitraum"]);
  });

  it("carries the core sentence, the example and the chips", () => {
    expect(rows[0]).toEqual({
      title: "Orte",
      core: "Einzelne Orte oder ganze Gemeinden.",
      example: "Beispiel: nur das Stadtgebiet.",
      tags: [
        { label: "Stadtgebiet" },
        { label: "Ortsteile" },
        { label: "Nachbarorte", excluded: true },
      ],
    });
  });

  it("leaves an empty example absent rather than rendering an empty paragraph", () => {
    expect(rows[1]).toEqual({
      title: "Zeitraum",
      core: "Wie weit der Kalender nach vorn schaut.",
      tags: [],
    });
    expect("example" in rows[1]).toBe(false);
  });

  it("is empty where the slot carries no table", () => {
    expect(settingRows(parseBlocks("**Überschrift:** ohne Tabelle"))).toEqual([]);
  });
});

describe("tierChecks", () => {
  const checks = tierChecks(parseBlocks(CHECKS_TABLE), PRICE_TIERS);

  it("keys the rows by offering id, never by position", () => {
    expect(Object.keys(checks).sort()).toEqual(["community-calendar", "portalize-enterprise"]);
    expect(checks["community-calendar"]).toEqual([
      { text: "eins" },
      { text: "zwei" },
      { text: "drei" },
    ]);
  });

  it("drops an empty cell rather than rendering a blank check", () => {
    expect(checks["portalize-enterprise"]).toHaveLength(2);
  });

  it("gives a tier the table does not name no checks at all", () => {
    expect(checks["portalize-calendar"]).toBeUndefined();
  });

  it("throws on a `Stufe` cell that names no tier rather than dropping its checks", () => {
    const typo = `
| Stufe | Häkchen 1 |
| --- | --- |
| portalize-kalender | eins |
`;
    expect(() => tierChecks(parseBlocks(typo), PRICE_TIERS)).toThrow(/portalize-kalender/u);
  });
});

describe("comparisonLabels", () => {
  const CONTRAST_TABLE = `
| Heute | Mit eurem Kalender |
| --- | --- |
| eins heute | eins mit Kalender |
`;

  it("reads both column labels off the table head", () => {
    expect(comparisonLabels(parseBlocks(CONTRAST_TABLE))).toEqual({
      today: "Heute",
      withCalendar: "Mit eurem Kalender",
    });
  });

  it("throws where a label is missing rather than rendering a bare colon", () => {
    const missing = `
| Heute |  |
| --- | --- |
| eins heute | eins mit Kalender |
`;
    expect(() => comparisonLabels(parseBlocks(missing))).toThrow(/column labels/u);
  });

  it("throws where the slot carries no table at all", () => {
    expect(() => comparisonLabels(parseBlocks("**Überschrift:** ohne Tabelle"))).toThrow(
      /column labels/u,
    );
  });
});
