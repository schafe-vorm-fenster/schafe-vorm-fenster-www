---
artefact: requirement
id: CON-WEB-0031
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: security
source: "DEC-0015"
evidence_sufficiency: S3
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# CON-WEB-0031

The solution SHALL admit a Content-Security-Policy allowlist entry only as an explicit host through a reviewed pull request, imposed by DEC-0015.

## Notes

Reclassified from the quality class by DEC-0092. "never a wildcard" qualifies what may be admitted rather than adding a second limit, so this stays one constraint. `scripts/check-csp.ts` refuses a wildcard in any directive (TS-WEB-0014-A1). The number was free in the constraint class and is kept.
