---
artefact: requirement
id: FUN-WEB-0168
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: localization
source:
  source_id: SRC-0007
  loc: "community-calendar/docs/localization-architecture.md#L66"
  excerpt: "sessionStorage is used only to suppress repeat suggestions within a session"
evidence_sufficiency: S2
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0168

For the first-visit language suggestion, the website SHALL show it once per visitor.

## Source

SRC-0007, DEC-0038

Finding: The source scopes suppression to a session (sessionStorage), not to a visitor. "Once per visitor" is a stronger claim than the document supports.

## Notes

Held in `sessionStorage`. The feature is deferred (Q-0011); these rules bind it when it is built.
