---
artefact: requirement
id: FUN-WEB-0196
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: rendering-and-resilience
needs: [NEED-WEB-0025]
source:
  source_id: DEC-0019
  loc: "specs/decisions/DEC-0019--three-tier-data-resilience.md#L23"
  excerpt: "tier 2 with a timestamp"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0196 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0009-A4, TS-WEB-0009-A7, TS-WEB-0009-A8 — 3 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0196

For a live counter, the website MAY serve tier-2 data with a timestamp.

## Source

DEC-0019

Finding: The permission ('they may serve') ends line 22; line 23 carries the tier-2-with-timestamp content.
