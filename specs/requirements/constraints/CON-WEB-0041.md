---
artefact: requirement
id: CON-WEB-0041
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: security
needs: [NEED-WEB-0017, NEED-WEB-0022, NEED-WEB-0029]
source:
  source_id: DEC-0017
  loc: "specs/decisions/DEC-0017--vercel-native-monitoring.md#L12"
  excerpt: "No additional error-tracking"
evidence_sufficiency: S3
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# CON-WEB-0041

The solution SHALL NOT add a third-party error or monitoring SDK, imposed by DEC-0017.

## Source

DEC-0017

Finding: The sentence 'No additional error-tracking service, no new data flows.' wraps across lines 12-13; only the part on line 12 is quoted.
