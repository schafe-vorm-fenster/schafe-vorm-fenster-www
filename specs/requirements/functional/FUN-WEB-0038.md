---
artefact: requirement
id: FUN-WEB-0038
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: relevance-and-proof
source: "SRC-0002#required-data"
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0038 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0005-A1 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0038

When ranking proof, the website SHALL compute geo proximity against the five-level location model `place · municipality · county · state · country` carried by `geo:` frontmatter in `@schafe-vorm-fenster/media-echo` and `proof/`.

## Notes

The media-echo `geo:` data is complete, 34/34.
