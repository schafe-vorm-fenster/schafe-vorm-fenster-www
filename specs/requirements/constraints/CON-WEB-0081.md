---
artefact: requirement
id: CON-WEB-0081
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: forms-and-leads
source:
  source_id: DEC-0009
  loc: "specs/decisions/DEC-0009--envoy-lead-widget.md#L19"
  excerpt: "the website ships no own form backend."
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0081 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0016-A1, TS-WEB-0016-A14, TS-WEB-0016-A2 — 1 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0081

The solution SHALL NOT ship a form backend of its own, imposed by DEC-0009.

## Source

DEC-0009, DEC-0081
