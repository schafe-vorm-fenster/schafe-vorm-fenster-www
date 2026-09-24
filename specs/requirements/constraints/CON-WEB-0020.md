---
artefact: requirement
id: CON-WEB-0020
class: CON
form: C0
domain: WEB
status: DRAFT
version: 0.1.0
area: delivery-pipeline
source: "DEC-0031, DEC-0035"
evidence_sufficiency: S3
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-10T13:40:06+02:00"
---

# CON-WEB-0020

Migration stage: the `next-2026` branch deploys to `next.schafe-vorm-fenster.de` (the product's pre-launch preview vacates it — internal coordination, not a blocker), with Vercel deployment protection enabled and `noindex`, so the full deploy chain runs without going live.
