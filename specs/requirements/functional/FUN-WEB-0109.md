---
artefact: requirement
id: FUN-WEB-0109
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: performance
source:
  source_id: SRC-0007
  loc: "community-calendar/docs/performance-budget.md#L38"
  excerpt: "**Fonts**: Self-hosted variable fonts with `font-display: swap`"
evidence_sufficiency: S2
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# FUN-WEB-0109

For every web font, the website SHALL serve the brand kit's `woff2` file from its own origin.

## Source

SRC-0007, brand kit

Finding: Self-hosting is supported here; the `woff2` format appears only in the budget row on line 22 ("Variable font, woff2 format"). The phrase "brand kit" appears nowhere in any of the three documents.
