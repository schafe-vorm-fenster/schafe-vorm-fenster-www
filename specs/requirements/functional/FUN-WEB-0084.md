---
artefact: requirement
id: FUN-WEB-0084
class: FUN
form: F0
domain: WEB
status: DRAFT
area: content-pipeline
source: "SRC-0006, SRC-0009"
evidence_sufficiency: S2
---

# FUN-WEB-0084

Update workflow: a content-package update triggers an agent-driven diff; resulting content updates arrive as a pull request against the website. The hub's package publish fires a `repository_dispatch` (DEC-0050), closing ADR-001's open question 1.
