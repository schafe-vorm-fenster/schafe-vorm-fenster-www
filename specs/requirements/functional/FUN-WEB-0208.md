---
artefact: requirement
id: FUN-WEB-0208
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: seo
needs: [NEED-WEB-0006]
source:
  source_id: SRC-0019
  loc: "plan/reviews/2026-11-12/2026-11-12 Review SEO und Sharing.md#L18"
  excerpt: "vollständige Open-Graph- und Twitter-Tags mit **Share-Bild**"
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0208 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0011-A15 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5.5"
  generated_at: "2026-11-12T18:30:00+01:00"
---

# FUN-WEB-0208

Wherever a page names a share image, the website SHALL name a text alternative for it in the page language, for Open Graph and for the Twitter card alike.

## Source

SRC-0019 — issue #195 asks for complete Open Graph and Twitter tags with a share image; `og:image:alt` and `twitter:image:alt` are part of a complete set.

Finding: The source says "complete", not "alt". The text alternative and its language are `TS-WEB-0011 D6` ("`og:image:alt` — localized, from frontmatter"). The need it serves is the "usable without barriers" half of `NEED-WEB-0006`: a reader of a shared link who cannot see the image still learns what it shows.

## Notes

D6 places the text in the page frontmatter. As built (issue #195) it is derived — `Schafe vorm Fenster — <title>`, `src/lib/seo/share-image.ts` — because the content schema has no alt field. A derived text satisfies this requirement; a frontmatter field is D6's refinement and stays open there.
