---
artefact: requirement
id: FUN-WEB-0141
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: pages
needs: [NEED-WEB-0006]
source:
  source_id: SRC-0003
  loc: "go-to-market-os/concept/website-information-architecture.concept.md#L49"
  excerpt: "\"Datenschutz\" and \"Barrierefreiheit\" — all three point at anchors on one"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0141 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0004-A9 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0141

In the footer, the website SHALL carry the legal links "Impressum", "Datenschutz" and "Barrierefreiheit", each pointing at its anchor on `/rechtliches`.

## Source

SRC-0003#navigation, DEC-0012, DEC-0039, DEC-0052, DEC-0081

Finding: Re-resolved 2026-09-25. The amendment rewrote the sentence the locator pointed at, and the three names no longer sit on one line: "Impressum" closes line 48, "Datenschutz" and "Barrierefreiheit" open line 49, and the anchor target `/rechtliches` is on the continuation line 50. Line 49 is the line that carries "all three point at anchors", which is the clause this requirement states.

## Notes

The anchor registry is TS-WEB-0004 D8 and the page is FUN-WEB-0146.
