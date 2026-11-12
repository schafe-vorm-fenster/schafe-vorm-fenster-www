import { describe, expect, it } from "vitest";

import { parseProofLine, proofIntro, quoteAuthor } from "./_proof";

import { parseDemoProofElement } from "@/src/lib/pages/demo-content";

/**
 * The two things the cross-page proof pool decides outside the relevance
 * engine — the copy guide's CG-017 (the one head every proof section carries,
 * DEC-0209) and CG-028 (when somebody's words are a quote card), DEC-0143.
 *
 * The engine's own behaviour is `src/lib/relevance/`'s business and is tested
 * there; these are the facets the artifacts carry and the pages read back. The
 * review gate over the same rules is a `manual` criterion and is not named
 * here: a unit test is not an attestation (`scripts/check-coverage.ts`,
 * state/open.md row 272).
 */
describe("proofIntro", () => {
  it("is the owner's one head for every proof section, in both locales (DEC-0209)", () => {
    expect(proofIntro("de")).toEqual({
      kicker: "Was andere über uns sagen",
      heading: "Stimmen aus der Praxis",
    });
    expect(proofIntro("en")).toEqual({
      kicker: "What others say about us",
      heading: "Voices from the field",
    });
  });

  it("does not repeat a word between kicker and heading (DEC-0206 §3)", () => {
    for (const locale of ["de", "en"] as const) {
      const { kicker, heading } = proofIntro(locale);
      const words = (text: string) => new Set(text.toLocaleLowerCase(locale).split(/\s+/));
      const shared = [...words(kicker)].filter((word) => words(heading).has(word));
      expect(shared).toEqual([]);
    }
  });
});

describe("quoteAuthor", () => {
  it("reads the role and the organisation off the attribution's last comma", () => {
    expect(quoteAuthor("Bürgermeister in Rubkow, Gemeinde Rubkow")).toEqual({
      role: "Bürgermeister in Rubkow",
      organisation: "Gemeinde Rubkow",
    });
  });

  it("refuses a name without both halves — CG-028 requires role and organisation", () => {
    expect(quoteAuthor("Bürgermeister in Rubkow")).toBeNull();
    expect(quoteAuthor("Wasserschloss Quilow")).toBeNull();
    expect(quoteAuthor("Rolle, ")).toBeNull();
  });

  it("needs a citation *and* a role+organisation attribution before an element is a quote", () => {
    // Today's authored shape: the attribution part splits at its first comma,
    // so the role stands alone and the element stays a `proof-card` even with a
    // citation. state/open.md row 280 says so; this is the negative half.
    const authored = parseProofLine(
      `„Die Termindaten senken den Aufwand." — Holger Wendt, Bürgermeister in Rubkow — [Nordkurier](https://example.org/a)`,
    );
    expect(authored.citation).toBeDefined();
    expect(quoteAuthor(parseDemoProofElement(authored.line, "Rückmeldung").attribution)).toBeNull();

    // The shape that does reach a quote card: name, role, organisation.
    const quotable = parseProofLine(
      `„Die Termindaten senken den Aufwand." — Holger Wendt, Bürgermeister, Gemeinde Rubkow — [Nordkurier](https://example.org/a)`,
    );
    const card = parseDemoProofElement(quotable.line, "Rückmeldung");
    expect(card.contextLine).toBe("Holger Wendt");
    expect(quotable.citation).toEqual({ label: "Nordkurier", url: "https://example.org/a" });
    expect(quoteAuthor(card.attribution)).toEqual({
      role: "Bürgermeister",
      organisation: "Gemeinde Rubkow",
    });
  });
});

describe("parseProofLine", () => {
  const LINE = "„Die Termindaten senken den Aufwand.“ — Holger Wendt, Bürgermeister in Rubkow";

  it("leaves a line without a citation exactly as it was", () => {
    const parsed = parseProofLine(LINE);
    expect(parsed.citation).toBeUndefined();
    expect(parsed.line).toBe(LINE);
  });

  it("takes a trailing citation off the line and reads its label and url", () => {
    const parsed = parseProofLine(`${LINE} — [Nordkurier, „Rubkow plant digital"](https://example.org/a)`);
    expect(parsed.citation).toEqual({
      label: 'Nordkurier, „Rubkow plant digital"',
      url: "https://example.org/a",
    });
    expect(parsed.line).toBe(LINE);
  });

  it("takes the citation off before the attribution is parsed, so the attribution survives", () => {
    const parsed = parseProofLine(`${LINE} — [Nordkurier](https://example.org/a)`);
    const card = parseDemoProofElement(parsed.line, "Rückmeldung");
    expect(card.contextLine).toBe("Holger Wendt");
    expect(card.attribution).toBe("Bürgermeister in Rubkow");
    expect(card.claim).toBe("Die Termindaten senken den Aufwand.");
  });

  it("ignores a link that is not at the end, and one with no scheme", () => {
    const inline = `„Siehe [dort](https://example.org/a) nach." — Wer, Wo`;
    expect(parseProofLine(inline).citation).toBeUndefined();
    expect(parseProofLine(`${LINE} — [Nordkurier](example.org/a)`).citation).toBeUndefined();
  });
});
