---
artefact: requirement
id: FUN-WEB-0181
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: content-pipeline
needs: [UNKNOWN]
source:
  source_id: UNKNOWN
  loc: "UNKNOWN"
  excerpt: "UNKNOWN"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0181 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0007-A11 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0181

For an imported legal text, the website SHALL render it as a section of the single legal page.

## Source

DEC-0012, DEC-0027

Unlocatable: DEC-0027 states only that the existing Google-Docs import carries German and English legal documents and that further languages/jurisdictions follow the same process. It says nothing about how an imported text is rendered, and names neither a single legal page nor sections.

Finding: Neither cited record supports it: DEC-0012 is named first and covers the import pipeline, DEC-0027 covers languages. The one-page-with-sections rule is DEC-0039 (lines 11, 31), which this requirement does not cite.

## Notes

The page is FUN-WEB-0146.
