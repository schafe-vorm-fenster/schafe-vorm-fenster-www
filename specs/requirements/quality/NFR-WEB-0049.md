---
artefact: requirement
id: NFR-WEB-0049
class: NFR
form: Q1
domain: WEB
status: DRAFT
version: 0.1.0
area: performance
source:
  source_id: SRC-0007
  loc: "community-calendar/docs/performance-budget.md#L11"
  excerpt: "**CLS** (Cumulative Layout Shift) | < 0.1"
evidence_sufficiency: S3
fit_criterion:
  scale: "Cumulative Layout Shift of every content page"
  operator: "<"
  value: 0.1
  meter: "e2e/layout-stability.spec.ts (TS-WEB-0009-A8) — run by TS-WEB-0009-A8"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# NFR-WEB-0049

Cumulative Layout Shift of every content page SHALL be < 0.1, measured by `e2e/layout-stability.spec.ts` (TS-WEB-0009-A8).

## Source

SRC-0007, DEC-0007

## Notes

This is the one Core Web Vital with a running meter: `e2e/layout-stability.spec.ts` carries `CLS_BUDGET = 0.1` and measures unexpected shifts at 360 x 800 on every content page, plus the archive over three filter interactions (TS-WEB-0028-A13).
