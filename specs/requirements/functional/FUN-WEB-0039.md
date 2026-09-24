---
artefact: requirement
id: FUN-WEB-0039
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: relevance-and-proof
source: "SRC-0002#required-data"
evidence_sufficiency: S1
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0039 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0007-A6, TS-WEB-0007-A7 — 1 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0039

For job fit, the relevance engine SHALL read `audiences` from a media-echo entry.

## Notes

Media-echo entries carry only `tags` today, so the field is UNKNOWN until it is modelled and full w_job scoring is blocked until then. The question that resolves it is Q-0076.
