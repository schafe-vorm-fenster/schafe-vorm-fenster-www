---
artefact: requirement
id: CON-WEB-0051
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: technical-constraints
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "UNKNOWN"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0051 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0017-A4, TS-WEB-0017-A8, TS-WEB-0017-A9 — 3 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0051

The solution SHALL take its breakpoints from `@schafe-vorm-fenster/brand-design` (`breakpoint.xs…2xl`), imposed by DEC-0056.

## Source

SRC-0006, SRC-0014, DEC-0056

Unlocatable: Transcript never mentions breakpoints or a design-token package.

Finding: `breakpoint.xs…2xl` and the package name come from DEC-0056; nothing in SRC-0006 supports them.

## Rationale

The scale is dense below the tablet on purpose — three of its six switch points sit under 640 px so that a small phone and a large phone are tuned differently instead of sharing one undifferentiated "mobile" layout. The specs propose no breakpoint of their own.
