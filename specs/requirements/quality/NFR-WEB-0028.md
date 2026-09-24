---
artefact: requirement
id: NFR-WEB-0028
class: NFR
form: Q0
domain: WEB
status: DRAFT
version: 0.1.0
area: privacy
source: "DEC-0016, DEC-0028"
evidence_sufficiency: S3
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# NFR-WEB-0028

Launch ships conversion measurement only: one eTracker event per conversion goal ID. The website measures up to the handover (app opens, registration start); completion is measured by the app in the shared account. Campaign attribution keeps the `etcc_*` convention. A/B experimentation (H1–H6) stays deferred.
