import { describe, expect, it } from "vitest";

import { readSectionHeads, sectionHeadFindings, stem, stemsOf } from "../e2e/support/section-heads";

/**
 * The judging half of TS-WEB-0006-A21 (DEC-0206): the browser half reads the
 * levels, this half decides what breaks the rule. Pure, so it is tested here,
 * under `pnpm check:static-tests`, rather than only against a running server.
 */
describe("stem", () => {
  it("brings the owner's own example to one stem: nutzt / benutzt", () => {
    expect(stem("nutzt")).toBe(stem("benutzt"));
  });

  it("folds case, umlauts and a plural", () => {
    expect(stem("Termine")).toBe(stem("Termin"));
    expect(stem("Dörfer")).toBe(stem("dorfer"));
  });

  it("keeps a short word whole rather than cutting it to nothing", () => {
    expect(stem("geht")).toBe("geht");
  });
});

describe("stemsOf", () => {
  it("drops function words and words under four letters", () => {
    expect([...stemsOf("Wo es wirklich benutzt wird").values()]).toEqual(["benutzt"]);
  });
});

describe("proper names", () => {
  it("leaves a listed place or organisation out of the stems", () => {
    expect([...stemsOf("Schlatkow bei Rostock, NØRD und Bitkom").values()]).toEqual([]);
    expect([...stemsOf("Vorpommern-Greifswald").values()]).toEqual([]);
  });

  it("does not excuse a repeated name alone, and not a repeated common noun", () => {
    expect(
      sectionHeadFindings({
        section: "kapitel",
        levels: [
          { kind: "line", text: "Schlatkow" },
          { kind: "heading", text: "Eine Schafweide vor dem Küchenfenster." },
          { kind: "intro", text: "Seit dem Umzug nach Schlatkow lag die Schafweide vor dem Haus." },
        ],
      }),
    ).toEqual([
      'heading "Eine Schafweide vor dem Küchenfenster." and intro "Seit dem Umzug nach Schlatkow lag die Schafweide vor dem Haus." share a stem (Schafweide/Schafweide)',
    ]);
  });
});

describe("sectionHeadFindings", () => {
  it("passes a kicker, a heading and an intro that say three different things", () => {
    expect(
      sectionHeadFindings({
        section: "wege",
        levels: [
          { kind: "kicker", text: "So geht's einfacher" },
          { kind: "heading", text: "So kommen eure Termine rein" },
          { kind: "intro", text: "Drei Wege. Alle nutzt ihr eh schon." },
        ],
      }),
    ).toEqual([]);
  });

  it("reports a fourth level", () => {
    const findings = sectionHeadFindings({
      section: "nearby",
      levels: [
        { kind: "kicker", text: "Einen Ort weiter" },
        { kind: "line", text: "Und gleich nebenan." },
        { kind: "heading", text: "Was in fünfzehn Minuten Entfernung passiert" },
        { kind: "intro", text: "Zwei Dörfer daneben läuft auch etwas." },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0]).toContain("4 text levels");
  });

  it("reports a stem the kicker and the heading share", () => {
    const findings = sectionHeadFindings({
      section: "beleg",
      levels: [
        { kind: "kicker", text: "Wer den Kalender nutzt" },
        { kind: "heading", text: "Wo es wirklich benutzt wird" },
      ],
    });
    expect(findings).toEqual([
      'kicker "Wer den Kalender nutzt" and heading "Wo es wirklich benutzt wird" share a stem (nutzt/benutzt)',
    ]);
  });
});

describe("readSectionHeads", () => {
  // No DOM in the unit run (no jsdom): the reader runs in
  // e2e/section-heads.spec.ts. This pins the rule that was a false alarm.
  it("treats an article after the heading as content, not as intro", () => {
    expect(readSectionHeads.toString()).toMatch(/sawHeading && element\.tagName === "ARTICLE"/);
  });
});
