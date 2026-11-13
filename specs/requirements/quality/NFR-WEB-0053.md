---
artefact: requirement
id: NFR-WEB-0053
class: NFR
form: Q1
domain: WEB
status: DRAFT
version: 0.1.0
area: performance
needs: [NEED-WEB-0005, NEED-WEB-0014]
source:
  source_id: SRC-0007
  loc: "community-calendar/docs/performance-budget.md#L20"
  excerpt: "| JavaScript (total) | < 100KB | Compressed, all bundles combined |"
evidence_sufficiency: S3
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# NFR-WEB-0053

Compressed size of the JavaScript of every route SHALL be < 100 KB, measured by TS-WEB-0003-A2.

## Source

SRC-0007, DEC-0007

## Rationale

TS-WEB-0003 D4 reports this budget rather than gating on it: "A route that exceeds the budget while Lighthouse stays green produces a warning in the run summary and a line in the release review, not a red build." The gate is NFR-WEB-0039.
