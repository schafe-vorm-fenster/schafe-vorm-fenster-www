---
artefact: requirement
id: NFR-WEB-0056
class: NFR
form: Q1
domain: WEB
status: DRAFT
version: 0.1.0
area: performance
needs: [NEED-WEB-0005, NEED-WEB-0014]
source:
  source_id: SRC-0007
  loc: "community-calendar/docs/performance-budget.md#L23"
  excerpt: "| Images (per image) | < 100KB | WebP/AVIF preferred |"
evidence_sufficiency: S3
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# NFR-WEB-0056

Size of every image the website serves SHALL be <= 200 KB, measured by TS-WEB-0003-A2.

## Source

SRC-0007, DEC-0007, DEC-0202

Deviation: `community-calendar/docs/performance-budget.md#L23` says "Images (per image) < 100KB". The owner raised the budget to 200 KB per delivered image size on 2026-11-12 so photographs stay sharp (DEC-0202). The specification carries the truth (DEC-0104 §1); DEM-0079 asks the product to follow.

## Notes

TS-WEB-0003 D1 prefers WebP and AVIF; the format is free for the generator within the budget.
