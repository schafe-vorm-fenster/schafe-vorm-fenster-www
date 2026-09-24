---
artefact: requirement
id: NFR-WEB-0009
class: NFR
form: Q0
domain: WEB
status: DRAFT
version: 0.1.0
area: performance
source: "SRC-0014#aspect-ratios-and-reserved-space, DEC-0056"
evidence_sufficiency: S3
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-10T17:58:35+02:00"
---

# NFR-WEB-0009

Every box that will hold asynchronous content shall declare its ratio or height **before** the content arrives — `aspect-ratio` on the media element, never a fixed pixel height; text that arrives with data reserves its height in line units. Nothing may push the page down after paint.
