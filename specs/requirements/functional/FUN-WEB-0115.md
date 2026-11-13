---
artefact: requirement
id: FUN-WEB-0115
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: performance
needs: [NEED-WEB-0005, NEED-WEB-0017]
source:
  source_id: SRC-0007
  loc: "community-calendar/docs/performance-budget.md#L47"
  excerpt: "Real User Monitoring (RUM) for production"
evidence_sufficiency: S2
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# FUN-WEB-0115

In production, the website SHALL report field performance through cookieless real-user monitoring.

## Source

SRC-0007

Finding: "cookieless" does not appear in any of the three documents; only the existence of production RUM is supported.
