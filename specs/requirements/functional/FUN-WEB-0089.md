---
artefact: requirement
id: FUN-WEB-0089
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: content-pipeline
source:
  source_id: DEC-0020
  loc: "specs/decisions/DEC-0020--content-architecture.md#L25"
  excerpt: "The formats are defined as Zod schemas in this repository: frontmatter"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0089 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0007-A1, TS-WEB-0007-A6 — 1 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0089

For every website content format, the repository SHALL define a Zod schema — frontmatter fields plus `describe()` guidance on lengths, phrasing and tone per field — as the binding contract for generation agents.

## Source

DEC-0020

Finding: The record's describe() guidance covers 'lengths and phrasing' (line 26); 'tone' is not in DEC-0020.

## Notes

Starting point: `src/domain/content-frontmatter.schema.ts` (reshape to the new formats).
