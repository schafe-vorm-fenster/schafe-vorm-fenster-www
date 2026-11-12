---
artefact: requirement
id: FUN-WEB-0210
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: seo
needs: [NEED-WEB-0003]
source:
  source_id: SRC-0019
  loc: "plan/reviews/2026-11-12/2026-11-12 Review SEO und Sharing.md#L27"
  excerpt: "Favicon/Icons/Manifest prüfen."
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0210 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0011-A16 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5.5"
  generated_at: "2026-11-12T18:30:00+01:00"
---

# FUN-WEB-0210

On every page, the website SHALL link a web app manifest that names the site and lists its app icons.

## Source

SRC-0019 — issue #195 lists the manifest beside favicon and icons as something to check.

Finding: The source asks to check a manifest, not to ship one with given fields. Name and icon list are the minimum a browser needs to offer the site for a home screen; display mode, colours and start URL are `TS-WEB-0011 D10` and [PROPOSED].

## Notes

Served at `/manifest.webmanifest` (`app/manifest.ts`); the proxy lets that path through. The icons are those of `FUN-WEB-0209`.
