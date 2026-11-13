---
artefact: requirement
id: NFR-WEB-0018
class: NFR
form: Q1
domain: WEB
status: DRAFT
version: 0.1.0
area: accessibility
needs: [NEED-WEB-0006]
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "UNKNOWN"
evidence_sufficiency: S2
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# NFR-WEB-0018

Size of every touch target on the website SHALL be >= 44 x 44 CSS px, measured by TS-WEB-0002 D2.

## Source

SRC-0006

Unlocatable: Transcript never mentions touch targets or their size.

Finding: 44 x 44 CSS px is a number SRC-0006 never gives.

## Notes

Original statement: "Touch targets and mobile UX shall meet accessibility sizing on the primary (mobile) experience." The value is TS-WEB-0002 D2's adoption of WCAG AAA 2.5.5: ">= 44 x 44 CSS px for every target, not only primary CTAs (supersedes the AA floor in D6)". The meter is the determination; no acceptance criterion asserts the 44 px figure yet, and axe's own `target-size` rule carries the AA floor of 24 px rather than this one. That gap is the meter's, not the measure's.
