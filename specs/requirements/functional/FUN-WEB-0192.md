---
artefact: requirement
id: FUN-WEB-0192
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: rendering-and-resilience
needs: [NEED-WEB-0005]
source:
  source_id: DEC-0019
  loc: "specs/decisions/DEC-0019--three-tier-data-resilience.md#L11"
  excerpt: "the site must ship fast (server-rendered,"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0192 that pass"
  operator: "="
  value: 4
  unit: criteria
  meter: "TS-WEB-0009-A1, TS-WEB-0009-A14, TS-WEB-0009-A2, TS-WEB-0009-A3 — 1 of 4 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0192

For every page, the website SHALL render it server-side with caching.

## Source

DEC-0019

Finding: This is the Context section, not the Decision; the Decision's line 16 covers tier-1 live modules, not every page. 'cached)' continues on line 12.
