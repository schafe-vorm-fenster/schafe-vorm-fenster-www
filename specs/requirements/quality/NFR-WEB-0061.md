---
artefact: requirement
id: NFR-WEB-0061
class: NFR
form: Q1
domain: WEB
status: DRAFT
version: 0.1.0
area: privacy
source: "SRC-0006, DEC-0004"
evidence_sufficiency: S3
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# NFR-WEB-0061

Analytics cookies and persistent identifiers after a full journey across the website SHALL be = 0, measured by TS-WEB-0012-A2.

## Notes

"no tracking cookies, no persistent identifiers, no returning-visitor recognition" — all three are the same count. TS-WEB-0012-A2 walks the D1 inventory and reads `document.cookie` and web storage afterwards.
