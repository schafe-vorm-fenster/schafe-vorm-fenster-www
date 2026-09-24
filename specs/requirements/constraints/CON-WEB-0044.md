---
artefact: requirement
id: CON-WEB-0044
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: security
source: "DEC-0025"
evidence_sufficiency: S3
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# CON-WEB-0044

The solution SHALL protect its client-facing endpoints with rate limiting and an origin check, imposed by DEC-0025.

## Notes

TS-WEB-0014-A10: each route answers `200` below its limit and `429` with `Retry-After` beyond it; a cross-site `Origin` gets `403`.
