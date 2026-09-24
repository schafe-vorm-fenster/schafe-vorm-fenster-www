---
artefact: requirement
id: CON-WEB-0067
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: pages
needs: [NEED-WEB-0006]
source:
  source_id: DEC-0039
  loc: "specs/decisions/DEC-0039--legal-as-one-page.md#L26"
  excerpt: "anchors are stable and must not change"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0067 that pass"
  operator: "="
  value: 10
  unit: criteria
  meter: "TS-WEB-0029-A1, TS-WEB-0029-A14, TS-WEB-0029-A15, TS-WEB-0029-A2, TS-WEB-0029-A3, TS-WEB-0029-A4, TS-WEB-0029-A5, TS-WEB-0029-A6, TS-WEB-0029-A7, TS-WEB-0029-A9 — 8 of 10 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0067

The solution SHALL NOT rename or remove a legal anchor, imposed by DEC-0039.

## Source

DEC-0039

## Rationale

A retired section keeps its anchor with a pointer to its successor. An anchor is a permanent address.
