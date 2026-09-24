---
artefact: requirement
id: FUN-WEB-0048
class: FUN
form: F0
domain: WEB
status: DRAFT
version: 0.1.0
area: place-search
source: "entre repo, DEC-0028, DEC-0035"
evidence_sufficiency: S3
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-10T13:40:06+02:00"
---

# FUN-WEB-0048

Inherited URL contract: `svf.li` QR redirects target the **apex** `schafe-vorm-fenster.de/:community` (with `etcc_cmp`/`etcc_med`), which today serves the calendars directly. Once the calendars move to `app.*` and the apex redirects to `www.`, the website shall forward `/:community` paths to the place's calendar on `app.*`, preserving the campaign parameters. Until that move: nothing to do.
