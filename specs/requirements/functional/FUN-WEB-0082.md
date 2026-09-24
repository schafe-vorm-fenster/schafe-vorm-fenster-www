---
artefact: requirement
id: FUN-WEB-0082
class: FUN
form: F0
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
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0082

Generated website contents shall live in this repository's content folder as markdown + frontmatter with optional co-located assets, per target language. Build **and** runtime (dynamic loading, geo-based selection) read exclusively from these local files — never from GTM at request time.
