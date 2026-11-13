import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { STANDARD_SOURCE_IDS, standardSources } from "./standard-sources";

/**
 * TS-WEB-0022 D11 / A17 — every standard source the banner names is one
 * `@schafe-vorm-fenster/offerings#community-calendar` lists. The list is the
 * package's; this suite reads the package and refuses a transcription that
 * drifts from it.
 */

const RECORD = readFileSync(
  "node_modules/@schafe-vorm-fenster/offerings/community-calendar.offering.md",
  "utf8",
);

/** The paragraph that states the boundary and enumerates the sources (lines 111–113). */
const BOUNDARY_PARAGRAPH = /\*\*A source the platform already supports publishes free\.\*\*([\s\S]*?)\n\n/.exec(
  RECORD,
)?.[1];

/** The Open Points entry that declares the list owned by the record (lines 230–234). */
const OWNERSHIP_NOTE = /\*\*The standard-source list is owned here\.\*\*([\s\S]*?)\n- /.exec(RECORD)?.[1];

describe("TS-WEB-0022-A17: the standard sources are the offering record's", () => {
  it("finds the boundary paragraph and the ownership note in the shipped record", () => {
    expect(BOUNDARY_PARAGRAPH).toBeDefined();
    expect(OWNERSHIP_NOTE).toBeDefined();
  });

  it("names each source the record enumerates, and no other", () => {
    for (const source of standardSources()) {
      expect(BOUNDARY_PARAGRAPH, source.id).toContain(source.packagePhrase);
      expect(OWNERSHIP_NOTE, source.id).toContain(source.packagePhrase);
    }
    // "a WordPress plugin, a common council information system
    // (Ratsinformationssystem), and an ICS feed" — three, and the record
    // says the list grows there first when support changes.
    expect(standardSources()).toHaveLength(3);
    expect(standardSources().map((source) => source.id)).toEqual([...STANDARD_SOURCE_IDS]);
  });

  it("carries a label in both locales for every source", () => {
    for (const source of standardSources()) {
      expect(source.label.de.length).toBeGreaterThan(0);
      expect(source.label.en.length).toBeGreaterThan(0);
    }
  });

  it("names no cooperation as a free-path example (D11, DEM-0067)", () => {
    const labels = standardSources()
      .flatMap((source) => [source.label.de, source.label.en])
      .join(" ")
      .toLowerCase();
    for (const cooperation of ["kirche-mv", "vevg", "karlsburg", "volkshochschule"]) {
      expect(labels).not.toContain(cooperation);
    }
  });

  it("carries no figure, currency or range (DEC-0107 §3)", () => {
    for (const source of standardSources()) {
      for (const label of Object.values(source.label)) {
        expect(label).not.toMatch(/\d|€|\bab\b/);
      }
    }
  });
});
