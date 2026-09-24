---
artefact: requirement
id: FUN-WEB-0149
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: relevance-and-proof
source:
  source_id: SRC-0002
  loc: "go-to-market-os/concept/website-relevance-model.concept.md#L94"
  excerpt: "Starting weights: `w_geo 0.35 · w_ctx 0.25 · w_job 0.25 · w_time 0.15`."
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0149 that pass"
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

# FUN-WEB-0149

For every proof element, the relevance engine SHALL score it by the formula and starting weights of SRC-0002 §Scoring.

## Source

SRC-0002#scoring

Finding: The formula itself is the code block on lines 84–88; per-element scope is line 81.

## Notes

w_geo 0.35 · w_ctx 0.25 · w_job 0.25 · w_time 0.15. The stage-0 redistribution is Q-0002.
