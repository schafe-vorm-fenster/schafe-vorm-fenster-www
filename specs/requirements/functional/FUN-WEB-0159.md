---
artefact: requirement
id: FUN-WEB-0159
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: place-search
source: "DEC-0024, DEC-0036, DEC-0037, DEC-0079"
evidence_sufficiency: S3
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0159

For a typed name that matches nothing, the place search SHALL reach `/dein-ort/starten` on submit.

## Rationale

A name that matches nothing yields no suggestion and is not an error, so the search never answers a visitor with silence and never asks her to type something else.
