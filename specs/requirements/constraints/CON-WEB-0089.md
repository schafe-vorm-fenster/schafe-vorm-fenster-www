---
artefact: requirement
id: CON-WEB-0089
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: rendering-and-resilience
source:
  source_id: DEC-0056
  loc: "specs/decisions/DEC-0056--design-system-delivered.md#L33"
  excerpt: "**Skeletons** are specified down to the hatch, and they do **not**"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0089 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0009-A13, TS-WEB-0009-A8, TS-WEB-0009-A9 — 1 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0089

The solution SHALL NOT animate a skeleton, imposed by DEC-0033.

## Source

DEC-0033, SRC-0014#skeletons, DEC-0056

Finding: The third source DEC-0056 supports it, while the first-named DEC-0033 says nothing about animation; the rule wraps, so line 33 carries subject and negation and the verb 'animate' opens line 34.
