---
artefact: requirement
id: FUN-WEB-0054
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: personalization
needs: [NEED-WEB-0017, NEED-WEB-0022, NEED-WEB-0029]
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "UNKNOWN"
evidence_sufficiency: S1
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0054

When geolocating by IP, the website SHALL process without storing personal data.

## Source

SRC-0006, SRC-0005#blockers

Unlocatable: Transcript calls tracking "Datenschutzkonform" but says nothing about geolocation processing without storing personal data.

Finding: Data-minimisation on the geolocation path is not in SRC-0006; it appears to come from SRC-0005.

## Notes

Legal verification pending (Q-0008).
