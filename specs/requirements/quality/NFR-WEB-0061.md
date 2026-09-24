---
artefact: requirement
id: NFR-WEB-0061
class: NFR
form: Q1
domain: WEB
status: DRAFT
version: 0.1.0
area: privacy
needs: [NEED-WEB-0017, NEED-WEB-0022, NEED-WEB-0029]
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "Das bedeutet auch keine wiederkehrenden User, keine Cookies fürs Tracking und so weiter."
evidence_sufficiency: S3
fit_criterion:
  scale: "Analytics cookies and persistent identifiers after a full journey across the website"
  operator: "="
  value: 0
  meter: "TS-WEB-0012-A2 — run by TS-WEB-0012-A1, TS-WEB-0012-A2, TS-WEB-0012-A9"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# NFR-WEB-0061

Analytics cookies and persistent identifiers after a full journey across the website SHALL be = 0, measured by TS-WEB-0012-A2.

## Source

SRC-0006, DEC-0004

Unlocatable: the transcript is one line with no line terminators, so it supports no position scheme.

## Notes

"no tracking cookies, no persistent identifiers, no returning-visitor recognition" — all three are the same count. TS-WEB-0012-A2 walks the D1 inventory and reads `document.cookie` and web storage afterwards.
