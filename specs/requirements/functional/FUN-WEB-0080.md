---
artefact: requirement
id: FUN-WEB-0080
class: FUN
form: F0
domain: WEB
status: DRAFT
version: 0.1.0
area: content-pipeline
source: "SRC-0009 ADR-001, SRC-0006, DEC-0020"
evidence_sufficiency: S3
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0080

ContentHub raw material (English, markdown + frontmatter) shall be consumed as npm packages from the private GitHub registry (`npm.pkg.github.com`), installed as devDependencies; until publication by reference to repo paths. Raw content is never copied into this repository.
