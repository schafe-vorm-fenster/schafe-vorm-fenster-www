---
artefact: requirement
id: FUN-WEB-0076
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
  excerpt: "Also wir machen alles von guten Beschreibungstexten, guter Semantik"
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0076 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0011-A7 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0076

On every page, the website SHALL carry a purposeful meta description and title derived from its page brief.

## Source

SRC-0006

Unlocatable: the transcript is one line with no line terminators, so it supports no position scheme.

Finding: Transcript says only "gute Beschreibungstexte"; page titles and the derivation from a page brief are not in SRC-0006.

Further: SRC-0019 — issue #195 (`plan/reviews/2026-11-12/2026-11-12 Review SEO und Sharing.md`, line 18) asks that every page has "einen sinnvollen Titel, eine Beschreibung, ggf. Keywords". Titles and descriptions are this requirement; keywords are not required by it or by any other until `Q-0096` is answered.

## Notes

Lengths, the brand suffix and the title on `/` are `TS-WEB-0011 D5`. The suffix separator is open: D5 writes a middle dot (`·`), the build an em dash (`—`) (`Q-0094`).
