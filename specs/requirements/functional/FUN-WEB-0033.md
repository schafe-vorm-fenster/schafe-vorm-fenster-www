---
artefact: requirement
id: FUN-WEB-0033
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: relevance-and-proof
needs: [NEED-WEB-0025]
source:
  source_id: SRC-0002
  loc: "go-to-market-os/concept/website-relevance-model.concept.md#L91"
  excerpt: "Clearance is a hard filter applied before scoring: elements without"
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0033 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0005-A2 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0033

Before scoring, the website SHALL exclude every element without `usage_rights: cleared` — a hard filter, never a down-weighting.

## Source

SRC-0002#scoring

Finding: The `usage_rights: cleared` token and "never down-weighted" are on the continuation line 92.
