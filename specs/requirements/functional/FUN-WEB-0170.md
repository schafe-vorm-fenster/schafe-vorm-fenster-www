---
artefact: requirement
id: FUN-WEB-0170
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: seo
needs: [NEED-WEB-0006]
source:
  source_id: DEC-0018
  loc: "specs/decisions/DEC-0018--allow-ai-crawlers-llms-txt.md#L12"
  excerpt: "an `llms.txt` carrying the short description and core facts"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0170 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0004-A5 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0170

At `/llms.txt`, the website SHALL maintain a short description and its core facts.

## Source

DEC-0018
