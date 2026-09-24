---
artefact: requirement
id: FUN-WEB-0158
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: place-search
source: "DEC-0024, DEC-0036, DEC-0037, DEC-0079"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0158 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0021-A14, TS-WEB-0021-A2, TS-WEB-0021-A9 — 3 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0158

For a place the system does not carry, the place search SHALL lead to `/dein-ort/starten` with the place as a query parameter.

## Notes

"nothing entered in <place> yet" plus the founding flow. It is the escalation of the place-search axis — dates, then no dates, then no place — and therefore sits under `/dein-ort`.
