import { describe, expect, it } from "vitest";

import {
  parseProofLine,
  proofHeading,
  quoteAuthor,
  selectedProofKind,
  type ProofCandidate,
  type ProofSelection,
} from "./_proof";

import { parseDemoProofElement } from "@/src/lib/pages/demo-content";

/** A candidate with only the fields these cases read. */
function candidate(over: Partial<ProofCandidate>): ProofCandidate {
  return {
    id: "c",
    contextLine: "Wer",
    claim: "Ein Satz.",
    attribution: "Wo",
    demo: false,
    ...over,
  };
}

function selection(entries: ProofSelection["entries"]): ProofSelection {
  return { entries, stage: 0, seed: "2026-W39", filled: entries.length };
}

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

describe("selectedProofKind", () => {
  it("reads the facet off the first selected element, so the pool heads its own section", () => {
    const press = selection([
      { kind: "item", candidate: candidate({ proofKind: "press" }), state: "ready" },
      { kind: "item", candidate: candidate({ proofKind: "customer" }), state: "ready" },
    ]);
    expect(selectedProofKind(press)).toBe("press");
    expect(proofHeading(selectedProofKind(press), "de")).toBe("Was andere sagen");
  });

  it("skips the empty positions ahead of the first element", () => {
    const mixed = selection([
      { kind: "empty" },
      { kind: "item", candidate: candidate({ proofKind: "press" }), state: "ready" },
    ]);
    expect(selectedProofKind(mixed)).toBe("press");
  });

  it("falls back to the customer kind for an empty slot and for a candidate carrying no facet", () => {
    expect(selectedProofKind(selection([]))).toBe("customer");
    expect(selectedProofKind(selection([{ kind: "empty" }]))).toBe("customer");
    expect(
      selectedProofKind(
        selection([{ kind: "item", candidate: candidate({}), state: "ready" }]),
      ),
    ).toBe("customer");
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
