---
artefact: requirement
id: FUN-WEB-0169
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: seo
needs: [NEED-WEB-0006]
source:
  source_id: DEC-0018
  loc: "specs/decisions/DEC-0018--allow-ai-crawlers-llms-txt.md#L11"
  excerpt: "AI crawlers are explicitly permitted in robots.txt"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0169 that pass"
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

# FUN-WEB-0169

In `robots.txt`, the website SHALL explicitly allow AI crawlers.

## Source

DEC-0018
