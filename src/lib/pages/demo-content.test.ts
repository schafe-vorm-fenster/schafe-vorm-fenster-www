import { describe, expect, it } from "vitest";

import { fillTemplate, parseDemoProofElement, splitSteps } from "@/src/lib/pages/demo-content";

/**
 * TS-019-A8 / plan/guardrails.md (dummy-content rule): the five demo proof
 * elements of `/` come out of the content artifact's own list, never out of
 * the page — so the one place that reads them is tested against the exact
 * lines `content/pages/home/{de,en}.md` ships.
 */
describe("TS-019-A8: demo proof lines are read, never re-typed", () => {
  it("splits a quoted claim from its role and its place", () => {
    expect(
      parseDemoProofElement(
        `„Endlich sehen wir auf einen Blick, was bei uns im Ort los ist." — Ehrenamtliche Bürgermeisterin, Beispielgemeinde Musterdorf`,
        "Beispiel",
      ),
    ).toEqual({
      contextLine: "Ehrenamtliche Bürgermeisterin",
      claim: "Endlich sehen wir auf einen Blick, was bei uns im Ort los ist.",
      attribution: "Beispielgemeinde Musterdorf",
    });
  });

  it("reads the English artifact's straight quotes the same way", () => {
    expect(
      parseDemoProofElement(
        '"At last we can see at a glance what\'s on in our village." — Volunteer mayor, Example municipality Musterdorf',
        "Example",
      ),
    ).toEqual({
      contextLine: "Volunteer mayor",
      claim: "At last we can see at a glance what's on in our village.",
      attribution: "Example municipality Musterdorf",
    });
  });

  it("keeps the fallback context where the attribution names no role", () => {
    expect(
      parseDemoProofElement(
        `„Beispiel-Auszeichnung für digitale Teilhabe im ländlichen Raum." — Beispiel-Fachpreis Ländliche Digitalisierung`,
        "Beispiel",
      ),
    ).toEqual({
      contextLine: "Beispiel",
      claim: "Beispiel-Auszeichnung für digitale Teilhabe im ländlichen Raum.",
      attribution: "Beispiel-Fachpreis Ländliche Digitalisierung",
    });
  });

  it("splits on the last dash, so a dash inside the sentence survives", () => {
    expect(
      parseDemoProofElement(
        `„Der Kalender — und nur er — steht im Ort." — Vorsitzender, Beispieldorf Musterhagen`,
        "Beispiel",
      ).claim,
    ).toBe("Der Kalender — und nur er — steht im Ort.");
  });

  it("never leaves a card without an attribution", () => {
    expect(parseDemoProofElement("Ein Satz ohne Zuschreibung.", "Beispiel")).toEqual({
      contextLine: "Beispiel",
      claim: "Ein Satz ohne Zuschreibung.",
      attribution: "Beispiel",
    });
  });
});

describe("TS-007 D7: runtime values are substituted, the sentence is not rewritten", () => {
  it("fills every named slot it knows", () => {
    expect(fillTemplate("Das ist los in {place}", { place: "Musterdorf" })).toBe(
      "Das ist los in Musterdorf",
    );
    expect(fillTemplate("{ort} eintragen", { ort: "Testdorf" })).toBe("Testdorf eintragen");
  });

  it("leaves an unknown slot visible rather than blanking the sentence", () => {
    expect(fillTemplate("Kalender von {place} öffnen", {})).toBe("Kalender von {place} öffnen");
    expect(fillTemplate("{dates_count} Termine", { place: "x" })).toBe("{dates_count} Termine");
  });
});

describe("TS-020 D4: the homescreen instruction becomes an ordered list", () => {
  it("splits running prose at its sentence boundaries", () => {
    expect(
      splitSteps(
        `Öffne den Kalender von Musterdorf in Safari. Tipp auf „Teilen", dann auf „Zum Home-Bildschirm". Fertig — er startet ab jetzt wie eine App.`,
      ),
    ).toEqual([
      "Öffne den Kalender von Musterdorf in Safari.",
      `Tipp auf „Teilen", dann auf „Zum Home-Bildschirm".`,
      "Fertig — er startet ab jetzt wie eine App.",
    ]);
  });

  it("returns one step for a single sentence and none for an empty string", () => {
    expect(splitSteps("Fertig.")).toEqual(["Fertig."]);
    expect(splitSteps("   ")).toEqual([]);
  });
});
