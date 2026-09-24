---
artefact: requirement
id: CON-WEB-0086
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: forms-and-leads
needs: [NEED-WEB-0011, NEED-WEB-0024]
source:
  source_id: DEC-0052
  loc: "specs/decisions/DEC-0052--page-level-answers.md#L116"
  excerpt: "Therefore the block ships only when one does."
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0086 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0016-A11, TS-WEB-0016-A12, TS-WEB-0016-A21 — 1 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0086

The solution SHALL NOT ship either newsletter route before a sending system is in operation, imposed by DEC-0051.

## Source

DEC-0051, DEC-0052

Finding: The second source DEC-0052 supports it (amendment §5), while the first-named DEC-0051 only decides which system carries the newsletter; the two surfaces this binds — footer entry and inline block — are named across lines 116-117.

## Notes

The sending system is Q-0020.
