---
artefact: requirement
id: FUN-WEB-0130
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: accessibility
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "Wir brauchen ein Dark und ein Light Theme und orientieren uns aber ausschließlich an dem Userbrowser. Wir bauen auch keine Umstellung dafür rein."
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0130 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0002-A1 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# FUN-WEB-0130

For theme selection, the website SHALL take the browser preference as its only input.

## Source

SRC-0006

Unlocatable: the transcript is one line with no line terminators, so it supports no position scheme.

## Rationale

"Theme selection follows the user's browser exclusively; the website provides no manual theme switcher."

## Notes

Reclassified from the quality class by DEC-0092. "the website provides no manual theme switcher" is the same rule stated negatively — the observable consequence of taking the browser preference as the only input — not a second predicate. The number could not be kept: 0015 is taken in the functional class by the `/dein-kalender/bestellen` page row.
