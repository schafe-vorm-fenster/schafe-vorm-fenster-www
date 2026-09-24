---
artefact: requirement
id: FUN-WEB-0062
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: localization
source: "SRC-0007, DEC-0005"
evidence_sufficiency: S3
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0062

For every request, the website SHALL determine the locale entirely server-side — no middleware state, no cookies, no `Accept-Language` at render time.

## Notes

The URL is the preference.
