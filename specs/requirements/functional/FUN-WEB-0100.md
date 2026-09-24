---
artefact: requirement
id: FUN-WEB-0100
class: FUN
form: F0
domain: WEB
status: DRAFT
version: 0.1.0
area: rendering-and-resilience
source: "DEC-0019"
evidence_sufficiency: S3
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0100

Pages shall render server-side with caching; the page shell shall never block on an app API (streamed live modules), preserving TTFB < 200 ms (NFR-WEB-0002).
