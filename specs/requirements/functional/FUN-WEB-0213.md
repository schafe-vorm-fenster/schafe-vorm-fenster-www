---
artefact: requirement
id: FUN-WEB-0213
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: seo
needs: [NEED-WEB-0006]
source:
  source_id: SRC-0019
  loc: "plan/reviews/2026-11-12/2026-11-12 Review SEO und Sharing.md#L10"
  excerpt: "Ergänze die Anforderungen zu SEO, Social Cards, Sharing-Bild, Canonical, Share-Bild und Logo"
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0213 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0011-A17 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5.5"
  generated_at: "2026-11-12T19:30:00+01:00"
---

# FUN-WEB-0213

On every page that carries structured data, the website SHALL emit a JSON-LD `Organization` node with the name, the URL and the logo of the brand.

## Source

SRC-0019 — the owner names the logo among the SEO requirements (2026-11-12, line 10 of the review). The owner answered `Q-0098` on 2026-11-12: yes, on all pages, with the logo from the brand package.

## Notes

The logo is the brand mark as the existing 512 px PNG rendition (`/api/icon/512`, drawn from the brand package at build time); no logo file is committed. The round rendition follows with issue #199 and replaces the URL's content, not the field. The node is the one full `Organization` of `TS-WEB-0011 D4`; it appears once per page, so the one-entity rule holds. 404 and 500 emit no structured data.
