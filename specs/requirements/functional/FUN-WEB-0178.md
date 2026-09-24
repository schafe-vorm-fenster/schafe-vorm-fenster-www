---
artefact: requirement
id: FUN-WEB-0178
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: content-pipeline
source:
  source_id: SRC-0009
  loc: "go-to-market-os/handbook/decisions/001-content-source-of-truth.adr.md#L55"
  excerpt: "**This repository is the single source of truth for content**, including"
evidence_sufficiency: S3
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0178

For a conversion goal, audience, offering or proof id, the website SHALL reference it from `go-to-market-os`.

## Source

SRC-0009 ADR-001

Finding: Same vocabulary gap as CON-WEB-0079: `conversion goal`, `offering` and `proof id` are ADR-002 terms; ADR-001 speaks of audiences, brand, tone and communication goals.
