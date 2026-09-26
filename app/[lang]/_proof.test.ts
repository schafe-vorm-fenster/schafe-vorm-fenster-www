import { describe, expect, it } from "vitest";

import { parseProofLine, proofHeading } from "./_proof";

import { parseDemoProofElement } from "@/src/lib/pages/demo-content";

/**
 * The two things the cross-page proof pool decides outside the relevance
 * engine — the copy guide's CG-017 (which heading a section may carry) and
 * CG-028 (when somebody's words are a quote card), DEC-0143.
 *
 * The engine's own behaviour is `src/lib/relevance/`'s business and is tested
 * there; these are the facets the artifacts carry and the pages read back. The
 * review gate over the same rules is a `manual` criterion and is not named
 * here: a unit test is not an attestation (`scripts/check-coverage.ts`,
 * state/open.md row 272).
 */
describe("proofHeading", () => {
  it("heads a customer pool with the customer heading, never the press one (CG-017)", () => {
    expect(proofHeading("customer", "de")).toBe("Wo es wirklich benutzt wird");
    expect(proofHeading("customer", "en")).toBe("Where it is really in use");

    // The copy guide reserves "Was andere sagen" for press proof only
    // (website-copy-guide.md:516) — a customer section must not carry it.
    expect(proofHeading("customer", "de")).not.toBe(proofHeading("press", "de"));
    expect(proofHeading("customer", "en")).not.toBe(proofHeading("press", "en"));
  });

  it("reads the press heading from the site's own vocabulary, not from a page", () => {
    expect(proofHeading("press", "de")).toBe("Was andere sagen");
    expect(proofHeading("press", "en")).toBe("What others say");
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
