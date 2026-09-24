---
artefact: requirement
id: FUN-WEB-0182
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: content-pipeline
source:
  source_id: DEC-0027
  loc: "specs/decisions/DEC-0027--legal-multilanguage-same-import.md#L13"
  excerpt: "languages/jurisdictions (PL, AT) are added in Google Docs when needed"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0182 that pass"
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

# FUN-WEB-0182

For a further language or jurisdiction, the editor SHALL add the legal text in Google Docs through the same process.

## Source

DEC-0012, DEC-0027

Finding: DEC-0027 supports it and is named second; DEC-0012 is named first and covers further legal *texts*, not further languages. The word 'Further' ends line 12 and 'same process' opens line 14.
