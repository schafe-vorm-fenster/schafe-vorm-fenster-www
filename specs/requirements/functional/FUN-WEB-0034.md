---
artefact: requirement
id: FUN-WEB-0034
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: relevance-and-proof
needs: [NEED-WEB-0018, NEED-WEB-0027]
source:
  source_id: SRC-0002
  loc: "go-to-market-os/concept/website-relevance-model.concept.md#L98"
  excerpt: "**Spread rule.** The two highest-scoring elements hold positions 1 and 2."
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0034 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0005-A3, TS-WEB-0005-A7 — 2 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0034

In every proof stream, the website SHALL produce the sequence from the spread rule of SRC-0002 (positions 1–2 top scorers; from position 3 furthest-on-geo-axis candidate at ≥50 % of top score; alternate near/far), without hand curation.

## Source

SRC-0002#scoring

Finding: Position-3 furthest/50 % clause, alternation and "without hand curation" continue on lines 99–102.
