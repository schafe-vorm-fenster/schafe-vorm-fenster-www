---
artefact: requirement
id: FUN-WEB-0127
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: security
needs: [NEED-WEB-0017, NEED-WEB-0022, NEED-WEB-0029]
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

# FUN-WEB-0127

On every pull request, the delivery pipeline SHALL run a dependency scan.

## Source

DEC-0015

Finding: The record binds dependency scanning 'in CI' from the first deployment; it does not say 'on every pull request'. That trigger is narrower than the record.
