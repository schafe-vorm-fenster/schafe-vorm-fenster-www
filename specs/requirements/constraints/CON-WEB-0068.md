---
artefact: requirement
id: CON-WEB-0068
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: relevance-and-proof
needs: [NEED-WEB-0018, NEED-WEB-0027]
source:
  source_id: SRC-0002
  loc: "go-to-market-os/concept/website-relevance-model.concept.md#L25"
  excerpt: "they are revised from measurement, not from opinion."
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0068 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0005-A11, TS-WEB-0005-A3, TS-WEB-0005-A5 — 3 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0068

The solution SHALL NOT revise a relevance weight except from measurement, imposed by SRC-0002 §Scoring.

## Source

SRC-0002#scoring

Finding: Reference anchor is #scoring, but the revise-only-from-measurement rule sits in §Purpose (lines 24–25), not in §Scoring.
