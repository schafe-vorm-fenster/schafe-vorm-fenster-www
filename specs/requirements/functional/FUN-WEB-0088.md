---
artefact: requirement
id: FUN-WEB-0088
class: FUN
form: F0
domain: WEB
status: DRAFT
version: 0.1.0
area: content-pipeline
source: "DEC-0012, DEC-0027"
evidence_sufficiency: S3
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0088

Legal texts (imprint, privacy, terms) arrive via the Google Workspace import pipeline (`content/legal/` + `import.yaml`) in German **and English**, and are rendered as sections of the single legal page (FUN-WEB-0029); further languages/jurisdictions are added in Google Docs, same process. They are the one content type not sourced from the GTM hub.
