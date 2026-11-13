---
artefact: requirement
id: FUN-WEB-0174
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: content-pipeline
needs: [UNKNOWN]
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "dass wir die Texte in einem separaten Content-Ordner oder Package in der Website pflegen, auch als Marktdorn Frontmetter."
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0174 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0007-A12, TS-WEB-0007-A5 — 2 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0174

For generated website content, the website SHALL hold it in its own content folder as markdown with frontmatter and optional co-located assets, per target language.

## Source

SRC-0006, DEC-0020

Unlocatable: the transcript is one line with no line terminators, so it supports no position scheme.

Finding: "Marktdorn Frontmetter" is the transcript's rendering of "Markdown Frontmatter"; co-located assets are not mentioned.
