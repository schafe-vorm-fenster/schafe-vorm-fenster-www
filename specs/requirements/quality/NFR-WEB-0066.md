---
artefact: requirement
id: NFR-WEB-0066
class: NFR
form: Q1
domain: WEB
status: DRAFT
version: 0.1.0
area: seo
needs: [NEED-WEB-0006]
source:
  source_id: SRC-0019
  loc: "plan/reviews/2026-11-12/2026-11-12 Review SEO und Sharing.md#L26"
  excerpt: "OG-Bilder: je Seite oder ein sauberes Standardbild (1200×630), per Next-Metadata-API."
evidence_sufficiency: S2
fit_criterion:
  scale: "share images of all indexable (path, language) pairs whose pixel size is 1200 × 630"
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

# NFR-WEB-0066

Pixel size of every share image SHALL be = 1200 × 630 px, measured by TS-WEB-0011-A9.

## Source

SRC-0019 — issue #195 names the size, 1200×630. `TS-WEB-0011 D6` fixes the same pair as `og:image:width` 1200 and `og:image:height` 630.

## Notes

One measure per requirement (DEC-0092): the file budget is `NFR-WEB-0067`. The format — PNG or JPEG, because scrapers do not reliably render AVIF or WebP — is not a measure and stays in `TS-WEB-0011 D6`. As built the images are PNG.
