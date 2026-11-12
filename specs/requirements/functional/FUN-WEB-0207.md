---
artefact: requirement
id: FUN-WEB-0207
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
  scale: "acceptance criteria of FUN-WEB-0207 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0011-A9, TS-WEB-0011-A15 — 2 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5.5"
  generated_at: "2026-11-12T18:30:00+01:00"
---

# FUN-WEB-0207

For every indexable page in each of its languages, the website SHALL name a share image of its own that shows the page title in that language and the brand mark of the brand package.

## Source

SRC-0019 — the owner's statement of 2026-11-12 names the sharing image, the share image and the logo as requirements that must not get lost. Issue #195 (same review file, line 26) asks for an image per page or one clean default image.

Finding: The owner's statement names the image and the logo, not their relation. That the brand mark sits **in** the image, and that the image is per page and per language, is `TS-WEB-0011 D6` (per-page image generated from the frontmatter title, the brand mark and the theme tokens; text inside it localized like any other text, `DEC-0026`). Issue #195 allowed one default image instead; the specification keeps the per-page image D6 already fixed.

## Notes

The image's format and budget are `NFR-WEB-0066`; its text alternative is `FUN-WEB-0208`; the tag set that carries it is `FUN-WEB-0078`.

The mark is read from `@schafe-vorm-fenster/brand-design` at build time and never committed here (`TS-WEB-0017-A6`). A hand-made image named in frontmatter that overrides the generated one is in D6 and not built; this requirement does not ask for it.

The need is `NEED-WEB-0006` — findable through search — as for `FUN-WEB-0078`: a link that is passed on in a messenger or a social network is found through its preview. No need in the register names sharing as a channel of its own.
