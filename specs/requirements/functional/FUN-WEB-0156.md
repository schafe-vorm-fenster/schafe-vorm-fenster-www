---
artefact: requirement
id: FUN-WEB-0156
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: place-search
source: "DEC-0079, DEC-0024"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0156 that pass"
  operator: "="
  value: 5
  unit: criteria
  meter: "TS-WEB-0008-A1, TS-WEB-0008-A14, TS-WEB-0008-A15, TS-WEB-0008-A16, TS-WEB-0008-A7 — 2 of 5 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0156

For a typed string, the place search SHALL match it against place names and municipality names and offer a match as the place, rendered "Ort (Gemeinde)".
