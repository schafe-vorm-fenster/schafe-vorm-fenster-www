---
artefact: requirement
id: CON-WEB-0078
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: content-pipeline
source: "SRC-0006, DEC-0020"
evidence_sufficiency: S3
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0078

The solution SHALL NOT read content from the hub at request time, imposed by DEC-0020.

## Rationale

Build and runtime — dynamic loading, geo-based selection — read exclusively from the local files.
