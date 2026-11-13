---
artefact: requirement
id: CON-WEB-0031
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: security
needs: [NEED-WEB-0017, NEED-WEB-0022, NEED-WEB-0029]
source:
  source_id: DEC-0015
  loc: "specs/decisions/DEC-0015--strict-security-baseline.md#L17"
  excerpt: "Every new external resource is a deliberate allowlist change."
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0031 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0014-A1 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# CON-WEB-0031

The solution SHALL admit a Content-Security-Policy allowlist entry only as an explicit host through a reviewed pull request, imposed by DEC-0015.

## Source

DEC-0015

Finding: DEC-0015 states deliberateness only; neither 'explicit host' nor 'reviewed pull request' appears in the record (the host-allowlist wording is in DEC-0045 line 23, the PR requirement in neither).

## Notes

Reclassified from the quality class by DEC-0092. "never a wildcard" qualifies what may be admitted rather than adding a second limit, so this stays one constraint. `scripts/check-csp.ts` refuses a wildcard in any directive (TS-WEB-0014-A1). The number was free in the constraint class and is kept.
