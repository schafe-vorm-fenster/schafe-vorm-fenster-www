---
artefact: requirement
id: CON-WEB-0082
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: forms-and-leads
needs: [NEED-WEB-0015, NEED-WEB-0025]
source:
  source_id: DEC-0009
  loc: "specs/decisions/DEC-0009--envoy-lead-widget.md#L32"
  excerpt: "The contact form is gone."
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0082 that pass"
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

# CON-WEB-0082

The solution SHALL NOT carry a general contact form, imposed by DEC-0081.

## Source

DEC-0009, DEC-0081

Finding: Found in DEC-0009's 'Superseded in part 2026-09-24 — DEC-0081' section, which is where this record records the withdrawal; the originating decision is DEC-0081.

## Rationale

Contact is a standing section of static channel rows.
