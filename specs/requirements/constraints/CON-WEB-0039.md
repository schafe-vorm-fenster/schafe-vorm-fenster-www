---
artefact: requirement
id: CON-WEB-0039
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: security
needs: [NEED-WEB-0017, NEED-WEB-0022, NEED-WEB-0029]
source:
  source_id: DEC-0014
  loc: "specs/decisions/DEC-0014--spam-protection-honeypot.md#L11"
  excerpt: "Forms are protected by invisible honeypot fields, submission-timing"
evidence_sufficiency: S3
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# CON-WEB-0039

The solution SHALL protect every form submission with a honeypot field, a submission-timing floor and server-side rate limiting, imposed by DEC-0014.

## Source

DEC-0014

## Notes

Binds the envoy widget (Q-0022). TS-WEB-0014-A8 asserts the honeypot and the timing floor against the envoy side; TS-WEB-0014-A10 asserts the rate limit.
