---
artefact: requirement
id: NFR-WEB-0056
class: NFR
form: Q1
domain: WEB
status: DRAFT
version: 0.1.0
area: performance
source: "SRC-0007, DEC-0007"
evidence_sufficiency: S3
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# NFR-WEB-0056

Size of every image the website serves SHALL be < 100 KB, measured by TS-WEB-0003-A2.

## Notes

TS-WEB-0003 D1 prefers WebP and AVIF; the format is free for the generator within the budget.
