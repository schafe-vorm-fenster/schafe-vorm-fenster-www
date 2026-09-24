---
artefact: requirement
id: FUN-WEB-0183
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: forms-and-leads
needs: [NEED-WEB-0020, NEED-WEB-0026]
source:
  source_id: DEC-0009
  loc: "specs/decisions/DEC-0009--envoy-lead-widget.md#L17"
  excerpt: "All lead forms are provided by an envoy web-component widget, embedded by"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0183 that pass"
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

# FUN-WEB-0183

For the quote request and the order flow's invoice step, the website SHALL embed the envoy web-component widget.

## Source

DEC-0009, DEC-0081

Finding: The Decision line says 'all lead forms'; the narrowing to the quote request and the order flow's invoice step is in the 2026-09-24 supersession at lines 38-42, which does not repeat the phrase 'web-component widget'.
