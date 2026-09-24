---
artefact: requirement
id: FUN-WEB-0031
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: relevance-and-proof
source:
  source_id: SRC-0002
  loc: "go-to-market-os/concept/website-relevance-model.concept.md#L38"
  excerpt: "The resulting shape is **near · near · far · near · very far"
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0031 that pass"
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

# FUN-WEB-0031

In every proof stream, the website SHALL follow the sequence rule "two near, then widen" (near · near · far · near · very far · middle · far) as specified in SRC-0002.

## Source

SRC-0002#sequence-rule

Finding: Sequence wraps onto line 39 ("middle · far**."); the rule name is the heading on line 34.
