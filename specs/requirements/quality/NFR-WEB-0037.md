---
artefact: requirement
id: NFR-WEB-0037
class: NFR
form: Q0
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
  generated_at: "2026-09-10T13:40:06+02:00"
---

# NFR-WEB-0037

External API tokens never reach the client. The website exposes use-case-tailored endpoints for client interactions and calls ecosystem APIs exclusively server-side (BFF).
