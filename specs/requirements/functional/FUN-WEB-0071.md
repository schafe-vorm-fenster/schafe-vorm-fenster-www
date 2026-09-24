---
artefact: requirement
id: FUN-WEB-0071
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: seo
needs: [NEED-WEB-0006]
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "Also und in der Side-Text verpacken, den Hauptinzeit in Artikel und Main-Text verpacken. Navigation enough natürlich, also extrem semantisches Markup."
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0071 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0011-A3, TS-WEB-0011-A4 — 1 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0071

In every page it renders, the website SHALL use strictly semantic markup: main content in `main`/`article`, secondary content explicitly demoted to `aside`, navigation in `nav`, heading hierarchy sound.

## Source

SRC-0006

Unlocatable: the transcript is one line with no line terminators, so it supports no position scheme.

Finding: Transcript covers aside/article/main/nav; a sound heading hierarchy is not mentioned here.
