---
artefact: requirement
id: CON-WEB-0088
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: rendering-and-resilience
source:
  source_id: DEC-0019
  loc: "specs/decisions/DEC-0019--three-tier-data-resilience.md#L21"
  excerpt: "The page shell never blocks on an API (streaming)."
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0088 that pass"
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

# CON-WEB-0088

The solution SHALL NOT let a page shell block on an app API, imposed by DEC-0019.

## Source

DEC-0019

## Rationale

Live modules stream in, which is what preserves the TTFB budget of NFR-WEB-0051.
