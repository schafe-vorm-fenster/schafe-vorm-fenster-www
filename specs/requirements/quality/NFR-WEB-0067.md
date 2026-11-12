---
artefact: requirement
id: NFR-WEB-0067
class: NFR
form: Q1
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
  scale: "share images of all indexable (path, language) pairs at or below 300 KB"
  operator: "="
  value: 1
  unit: fraction
  meter: "TS-WEB-0011-A9"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5.5"
  generated_at: "2026-11-12T18:30:00+01:00"
---

# NFR-WEB-0067

File size of every share image SHALL be <= 300 KB, measured by TS-WEB-0011-A9.

## Source

SRC-0019 names the share image as a requirement and gives no budget.

Finding: The value 300 KB is not in SRC-0019. It is `TS-WEB-0011 D6` ("≤ 300 KB"), written on 2026-09-10 and the budget `TS-WEB-0011-A9` has checked since; the specification carries the truth (DEC-0104), so the requirement takes it from there rather than leaving it `UNKNOWN`.

## Notes

The budget lies outside `NFR-WEB-0056` (200 KB per image the website serves) on purpose: the page never loads its share image, a scraper does (D6). As built the images are about 50 KB.
