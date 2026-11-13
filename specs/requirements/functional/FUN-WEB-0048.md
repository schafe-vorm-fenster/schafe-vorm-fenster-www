---
artefact: requirement
id: FUN-WEB-0048
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: place-search
needs: [NEED-WEB-0002]
source:
  source_id: DEC-0035
  loc: "specs/decisions/DEC-0035--domain-layout-and-preview.md#L29"
  excerpt: "Once apex redirects to www, legacy `/:community` paths (svf.li QR"
evidence_sufficiency: S3
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0048

Once the calendars move to `app.*` and the apex redirects to `www.`, the website SHALL forward a `/:community` path to that place's calendar on `app.*`, preserving the campaign parameters.

## Source

entre repo, DEC-0028, DEC-0035

Finding: the source list names `entre repo` first; DEC-0035 is what carries the rule.

## Notes

The inherited contract: `svf.li` QR redirects target the apex `schafe-vorm-fenster.de/:community` with `etcc_cmp` and `etcc_med`, which today serves the calendars directly. Until the move there is nothing to do.
