---
artefact: requirement
id: FUN-WEB-0179
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: content-pipeline
source: "SRC-0009 ADR-001, DEC-0022"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0179 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0007-A12, TS-WEB-0007-A2 — 2 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0179

For feed-like content, the website SHALL fetch it at build time rather than version it as a package.

## Notes

`media-echo/verified/` for `/ueber-uns/archiv` and inline proof.
