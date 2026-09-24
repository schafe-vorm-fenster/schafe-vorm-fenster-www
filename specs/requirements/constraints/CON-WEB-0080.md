---
artefact: requirement
id: CON-WEB-0080
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: content-pipeline
source:
  source_id: SRC-0009
  loc: "UNKNOWN"
  excerpt: "UNKNOWN"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0080 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0007-A12, TS-WEB-0007-A2 — 2 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0080

The solution SHALL NOT carry a news section, imposed by DEC-0022.

## Source

SRC-0009 ADR-001, DEC-0022

Unlocatable: No line in ADR-001 (or ADR-002/003/004) says the website carries no news section. ADR-001 only assigns `news/` to the hub as source of truth (line 149) and mentions `published posts for the news section` as feed-like content (line 170).

Finding: Attribution is misleading: the `source` field itself says the constraint is imposed by DEC-0022, yet SRC-0009 ADR-001 is listed first and supports the opposite reading -- it presumes a news section exists.

## Rationale

The information architecture is authoritative and names none.
