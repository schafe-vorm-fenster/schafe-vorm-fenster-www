---
artefact: requirement
id: FUN-WEB-0120
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: accessibility
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "UNKNOWN"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0120 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0002-A4, TS-WEB-0002-A5 — 1 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# FUN-WEB-0120

For every interactive element, the website SHALL render a focus ring of 3 px `violet-500` at 2 px offset.

## Source

SRC-0006, SRC-0014, DEC-0056

Unlocatable: Transcript never mentions focus rings, pixel widths or a colour token.

Finding: "3 px violet-500 at 2 px offset" is a precise design value that does not occur anywhere in SRC-0006.
