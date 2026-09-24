---
artefact: requirement
id: CON-WEB-0079
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: content-pipeline
source:
  source_id: SRC-0009
  loc: "go-to-market-os/handbook/decisions/001-content-source-of-truth.adr.md#L106"
  excerpt: "One canonical definition per concept: audiences, brand, tone, and"
evidence_sufficiency: S3
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0079

The solution SHALL NOT define a conversion goal, audience, offering or proof id of its own, imposed by SRC-0009 ADR-001.

## Source

SRC-0009 ADR-001

Finding: ADR-001 names audiences, brand, tone and communication goals. The requirement's vocabulary (conversion goal, offering, proof id) is ADR-002's layer model (002-content-layer-model.adr.md lines 101/105/107), not ADR-001's.
