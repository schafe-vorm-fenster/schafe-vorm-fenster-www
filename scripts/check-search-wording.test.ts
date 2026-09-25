import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  checkSearchWording,
  dictionaryStrings,
  OUT_OF_SCOPE,
  postcodeHits,
  SEARCH_SLOTS,
  slotSection,
} from "./check-search-wording";

/**
 * TS-WEB-0008-A16 — negative tests against fixture artifacts in a temporary
 * tree (never against files committed under `content/`), and one positive
 * run against the real tree so the check is known to pass today.
 */

const SLOT = { page: "home", slot: "home-1-search-hero" } as const;

function artifact(placeholder: string, extra = ""): string {
  return [
    "---",
    "route: /",
    "---",
    "",
    "# Home",
    "",
    "## Slot 1 — Suchfeld",
    "",
    `<!-- id: ${SLOT.slot}; content_type: hero; provenance: sourced; status: draft -->`,
    "",
    "**Headline:** Was ist bei dir los?",
    "",
    `**Sucheingabe (Placeholder):** ${placeholder}`,
    "",
    "**Button:** Suchen",
    extra,
    "",
    "## Slot 2 — Etwas anderes",
    "",
    "**Text:** Die Rechnungsanschrift braucht Straße, PLZ und Ort.",
    "",
  ].join("\n");
}

let root: string;

function write(page: string, locale: string, content: string): void {
  const directory = join(root, "content", "pages", page);
  mkdirSync(directory, { recursive: true });
  writeFileSync(join(directory, `${locale}.md`), content);
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "check-search-wording-"));
});

afterEach(() => {
  rmSync(root, { recursive: true, force: true });
});

describe("postcodeHits: the terms A16 names", () => {
  it("finds each of them, case-insensitively where the word is a word", () => {
    expect(postcodeHits("Deine Postleitzahl").map((hit) => hit.term)).toEqual(["Postleitzahl"]);
    expect(postcodeHits("Straße, PLZ, Ort").map((hit) => hit.term)).toEqual(["PLZ"]);
    expect(postcodeHits("Your postcode").map((hit) => hit.term)).toEqual(["postcode"]);
    expect(postcodeHits("your ZIP code").map((hit) => hit.term)).toEqual(["ZIP"]);
  });

  it("does not match the abbreviation inside another word", () => {
    expect(postcodeHits("Gezipptes Archiv, Splz")).toEqual([]);
  });

  it("reports the line", () => {
    expect(postcodeHits("Ortsname\nzweite Zeile\nPostleitzahl eingeben")).toEqual([
      { line: 3, term: "Postleitzahl", excerpt: "Postleitzahl eingeben" },
    ]);
  });
});

describe("slotSection: the search block and nothing around it", () => {
  it("returns the slot's own section, from its heading to the next", () => {
    const section = slotSection(artifact("Dein Ort"), SLOT.slot);
    expect(section?.startLine).toBe(7);
    expect(section?.lines.join("\n")).toContain("**Sucheingabe (Placeholder):** Dein Ort");
    expect(section?.lines.join("\n")).not.toContain("Rechnungsanschrift");
  });

  it("blanks HTML comments without moving line numbers", () => {
    const source = artifact("Dein Ort", "<!-- source_note: früher Postleitzahl -->");
    const section = slotSection(source, SLOT.slot);
    expect(section?.lines.join("\n")).not.toContain("Postleitzahl");
    const lines = source.split("\n");
    const start = lines.findIndex((line) => line.startsWith("## Slot 1"));
    const end = lines.findIndex((line) => line.startsWith("## Slot 2"));
    expect(section?.lines.length).toBe(end - start);
  });

  it("answers nothing for a slot the artifact does not carry", () => {
    expect(slotSection(artifact("Dein Ort"), "home-9-does-not-exist")).toBeUndefined();
  });
});

describe("checkSearchWording: fixture trees", () => {
  it("passes a clean search block in both locales", () => {
    write("home", "de", artifact("Dein Ort"));
    write("home", "en", artifact("Your place"));
    const result = checkSearchWording({ root, strings: [], slots: [SLOT] });
    expect(result.errors).toEqual([]);
    expect(result.slotsScanned).toBe(2);
  });

  it("fails on a postcode in the search block, naming file and line", () => {
    write("home", "de", artifact("Deine Postleitzahl"));
    write("home", "en", artifact("Your postcode"));
    const { errors } = checkSearchWording({ root, strings: [], slots: [SLOT] });
    expect(errors).toHaveLength(2);
    expect(errors[0]).toMatch(/content\/pages\/home\/de\.md:13: search block `home-1-search-hero` names a postcode \("Postleitzahl"\)/u);
    expect(errors[1]).toMatch(/content\/pages\/home\/en\.md:13: .*"postcode"/u);
  });

  it("does not hold another slot's wording against the search block", () => {
    // The fixture's slot 2 says "PLZ" on purpose — an invoice address is not
    // the place search.
    write("home", "de", artifact("Dein Ort"));
    write("home", "en", artifact("Your place"));
    expect(checkSearchWording({ root, strings: [], slots: [SLOT] }).errors).toEqual([]);
  });

  it("does not hold an HTML comment inside the search block against it", () => {
    write("home", "de", artifact("Dein Ort", "<!-- source_note: bis DEC-0079 stand hier die Postleitzahl -->"));
    write("home", "en", artifact("Your place"));
    expect(checkSearchWording({ root, strings: [], slots: [SLOT] }).errors).toEqual([]);
  });

  it("fails when the search slot is missing, rather than passing by scanning nothing", () => {
    write("home", "de", artifact("Dein Ort").replace(SLOT.slot, "home-1-renamed"));
    write("home", "en", artifact("Your place"));
    const { errors, slotsScanned } = checkSearchWording({ root, strings: [], slots: [SLOT] });
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/de\.md: search slot `home-1-search-hero` not found/u);
    expect(slotsScanned).toBe(1);
  });

  it("fails when an artifact is missing", () => {
    write("home", "de", artifact("Dein Ort"));
    const { errors } = checkSearchWording({ root, strings: [], slots: [SLOT] });
    expect(errors).toEqual(["content/pages/home/en.md: content artifact missing — the search block of home cannot be checked"]);
  });

  it("fails on a dictionary string that names a postcode", () => {
    write("home", "de", artifact("Dein Ort"));
    write("home", "en", artifact("Your place"));
    const { errors } = checkSearchWording({
      root,
      slots: [SLOT],
      strings: [
        { key: "de.search.label", value: "Ort oder Postleitzahl" },
        { key: "en.search.placeholder", value: "Place name" },
      ],
    });
    expect(errors).toEqual(['dictionary de.search.label: names a postcode ("Postleitzahl") — Ort oder Postleitzahl']);
  });

  it("never reads the order flow's scope step (DEC-0079 §7)", () => {
    write("home", "de", artifact("Dein Ort"));
    write("home", "en", artifact("Your place"));
    write("dein-kalender/bestellen", "de", artifact("Postleitzahl"));
    write("dein-kalender/bestellen", "en", artifact("postcode"));
    const result = checkSearchWording({
      root,
      strings: [],
      slots: [SLOT, { page: "dein-kalender/bestellen", slot: SLOT.slot }],
    });
    expect(result.errors).toEqual([]);
    expect(result.slotsScanned).toBe(2);
    expect(OUT_OF_SCOPE).toBe("content/pages/dein-kalender/bestellen");
  });
});

describe("checkSearchWording: the real tree", () => {
  it("names the five artifacts A16 lists and nothing else", () => {
    expect(SEARCH_SLOTS.map((slot) => slot.page)).toEqual([
      "home",
      "dein-ort",
      "dein-ort/starten",
      "deine-region",
      "mitmachen/registrieren",
    ]);
  });

  it("scans the search and 404 blocks of both locale dictionaries", () => {
    const keys = dictionaryStrings().map((string) => string.key);
    expect(keys).toContain("de.search.label");
    expect(keys).toContain("en.search.placeholder");
    expect(keys).toContain("de.search.hint");
    expect(keys).toContain("en.search.submit");
    expect(keys).toContain("de.notFound.body");
  });

  it("passes today — TS-WEB-0008-A16 holds on the committed tree", () => {
    const result = checkSearchWording();
    expect(result.errors).toEqual([]);
    expect(result.slotsScanned).toBe(SEARCH_SLOTS.length * 2);
    expect(result.stringsScanned).toBeGreaterThan(0);
  });
});
