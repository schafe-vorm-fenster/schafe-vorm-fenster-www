---
artefact: requirement
id: FUN-WEB-0180
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: content-pipeline
source: "DEC-0012, DEC-0027"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0180 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0007-A11 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0180

For the legal texts, the website SHALL import them through the Google Workspace pipeline in German and English.

## Notes

`content/legal/` plus `import.yaml`. They are the one content type not sourced from the GTM hub.
