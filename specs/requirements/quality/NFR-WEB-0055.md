---
artefact: requirement
id: NFR-WEB-0055
class: NFR
form: Q1
domain: WEB
status: DRAFT
version: 0.1.0
area: performance
needs: [NEED-WEB-0005, NEED-WEB-0014]
source:
  source_id: SRC-0007
  loc: "community-calendar/docs/performance-budget.md#L22"
  excerpt: "| Web fonts | < 50KB | Variable font, woff2 format |"
evidence_sufficiency: S3
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# NFR-WEB-0055

Compressed size of the web fonts of the website SHALL be <= 50 KB, measured by TS-WEB-0003-A3.

## Source

SRC-0007, DEC-0007

Finding: The source budget is strictly < 50KB; the requirement relaxes it to <= 50 KB.

## Notes

TS-WEB-0003 D3 spends the budget across both families and the three weights in use (400, 700, 800).
