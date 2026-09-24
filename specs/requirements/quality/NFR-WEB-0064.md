---
artefact: requirement
id: NFR-WEB-0064
class: NFR
form: Q1
domain: WEB
status: DRAFT
version: 0.1.0
area: privacy
source: "DEC-0016, DEC-0028"
evidence_sufficiency: S3
fit_criterion:
  scale: "Experiment, variant and bucketing code in the build"
  operator: "="
  value: 0
  meter: "TS-WEB-0012-A11 — run by TS-WEB-0012-A11, TS-WEB-0012-A3, TS-WEB-0012-A5, TS-WEB-0012-A6"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# NFR-WEB-0064

Experiment, variant and bucketing code in the build SHALL be = 0, measured by TS-WEB-0012-A11.

## Notes

"A/B experimentation (H1–H6) stays deferred." The deferral is DEC-0016's; the count is what makes it checkable.
