---
artefact: requirement
id: NFR-WEB-0065
class: NFR
form: Q1
domain: WEB
status: DRAFT
version: 0.1.0
area: security
source:
  source_id: DEC-0014
  loc: "specs/decisions/DEC-0014--spam-protection-honeypot.md#L12"
  excerpt: "No captcha of any kind."
evidence_sufficiency: S3
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# NFR-WEB-0065

Captchas, challenge iframes and third-party challenge scripts on any page SHALL be = 0, measured by TS-WEB-0014-A9.

## Source

DEC-0014

Finding: The record bans captchas; challenge iframes and third-party challenge scripts are not named in DEC-0014.
