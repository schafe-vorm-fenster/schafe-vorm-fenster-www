---
artefact: requirement
id: FUN-WEB-0116
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: performance
needs: [NEED-WEB-0005, NEED-WEB-0014]
source:
  source_id: SRC-0014
  loc: "concept/website-design-system.md#L968"
  excerpt: "Declared as `aspect-ratio` on the media element, never as a fixed pixel"
evidence_sufficiency: S3
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# FUN-WEB-0116

Before asynchronous content arrives, the website SHALL declare the holding box's `aspect-ratio` rather than a fixed pixel height.

## Source

SRC-0014#aspect-ratios-and-reserved-space, DEC-0056

## Rationale

"Nothing may push the page down after paint" is the outcome, and NFR-WEB-0049 is where it is measured. A ratio survives every viewport; a pixel height does not.
