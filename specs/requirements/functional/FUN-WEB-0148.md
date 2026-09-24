---
artefact: requirement
id: FUN-WEB-0148
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: pages
needs: [NEED-WEB-0030]
source:
  source_id: DEC-0034
  loc: "specs/decisions/DEC-0034--region-interim-active-examples.md#L13"
  excerpt: "Instead: a small set of *active example places*"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0148 that pass"
  operator: "="
  value: 8
  unit: criteria
  meter: "TS-WEB-0026-A1, TS-WEB-0026-A10, TS-WEB-0026-A11, TS-WEB-0026-A16, TS-WEB-0026-A17, TS-WEB-0026-A2, TS-WEB-0026-A3, TS-WEB-0026-A9 — 6 of 8 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0148

On `/deine-region`, the website SHALL render active example places, live counters and the place search.

## Source

DEC-0034

Finding: The three elements span lines 13-15 (lines 13-15: examples / live counters / place search); no single line carries all three. The record says 'the region page', never the route `/deine-region`.

## Notes

Example places are activity-ranked and proximity-aware. The map is deferred (DEC-0034).
