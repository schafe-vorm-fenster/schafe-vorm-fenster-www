---
artefact: requirement
id: CON-WEB-0038
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: security
source:
  source_id: DEC-0015
  loc: "specs/decisions/DEC-0015--strict-security-baseline.md#L13"
  excerpt: "dependency scanning in CI are binding from the first deployment."
evidence_sufficiency: S3
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# CON-WEB-0038

The solution SHALL NOT be released while a dependency scan reports a critical finding, imposed by DEC-0015.

## Source

DEC-0015

Finding: DEC-0015 binds dependency scanning in CI but says nothing about a severity threshold; 'critical finding blocks the release' is not stated in the record.
