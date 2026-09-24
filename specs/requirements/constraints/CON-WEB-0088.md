---
artefact: requirement
id: CON-WEB-0088
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: rendering-and-resilience
source: "DEC-0019"
evidence_sufficiency: S3
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0088

The solution SHALL NOT let a page shell block on an app API, imposed by DEC-0019.

## Rationale

Live modules stream in, which is what preserves the TTFB budget of NFR-WEB-0051.
