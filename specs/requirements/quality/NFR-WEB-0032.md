---
artefact: requirement
id: NFR-WEB-0032
class: NFR
form: Q0
domain: WEB
status: DRAFT
version: 0.1.0
area: security
source: "DEC-0015"
evidence_sufficiency: S3
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# NFR-WEB-0032

Security headers shall be set site-wide: HSTS, `frame-ancestors` (deny except app-embed needs), referrer-policy, `X-Content-Type-Options`, permissions-policy.
