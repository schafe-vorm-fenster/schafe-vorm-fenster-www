---
artefact: requirement
id: FUN-WEB-0114
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: performance
needs: [NEED-WEB-0005, NEED-WEB-0014]
source:
  source_id: SRC-0007
  loc: "community-calendar/docs/performance-budget.md#L46"
  excerpt: "Lighthouse CI in GitHub Actions"
evidence_sufficiency: S2
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# FUN-WEB-0114

On every pull request, the delivery pipeline SHALL run Lighthouse CI against the routes of TS-WEB-0003 D7.

## Source

SRC-0007

Finding: The document names Lighthouse CI as a monitoring tool only. It does not say it runs on every pull request, nor against any particular set of routes.
