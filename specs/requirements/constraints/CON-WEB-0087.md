---
artefact: requirement
id: CON-WEB-0087
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: content-pipeline
source:
  source_id: DEC-0023
  loc: "specs/decisions/DEC-0023--three-phases-and-strict.md#L12"
  excerpt: "copy is not written while the specification phase runs."
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0087 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0007-A14 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:40:00+02:00"
---

# CON-WEB-0087

The solution SHALL NOT produce page copy before its specification phase has ended, imposed by DEC-0023.

## Source

DEC-0023

## Rationale

"Page copy production happens after this specification phase (project rule); specs use placeholders." Where a spec needs example copy it is marked as a placeholder.

## Notes

Reclassified from the functional class by DEC-0094. It was filed as something the website does; it is a project rule imposed by a decision already taken, which is question 2 of `@leafcutter-strict/method-requirement-classification`. It is also the second limit of CON-WEB-0006's original statement, which is why that one carries only the method and this one carries the order. The number was free in the constraint class and is kept.
