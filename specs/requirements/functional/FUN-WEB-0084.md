---
artefact: requirement
id: FUN-WEB-0084
class: FUN
form: F0
domain: WEB
status: DRAFT
version: 0.1.0
area: content-pipeline
source: "SRC-0006, SRC-0009"
evidence_sufficiency: S2
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0084

Update workflow: a content-package update triggers an agent-driven diff; resulting content updates arrive as a pull request against the website. The hub's package publish fires a `repository_dispatch` (DEC-0050), closing ADR-001's open question 1.
