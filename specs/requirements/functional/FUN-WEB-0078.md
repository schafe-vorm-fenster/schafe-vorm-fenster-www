---
artefact: requirement
id: FUN-WEB-0078
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
  scale: "acceptance criteria of FUN-WEB-0078 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0011-A8, TS-WEB-0011-A9, TS-WEB-0011-A15 — 3 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0078

On every page, the website SHALL carry complete social sharing metadata (Open Graph, Twitter cards) with a per-page OG image.

## Source

SRC-0019 — issue #195 asks for complete Open Graph and Twitter tags with a share image; the owner's statement of 2026-11-12 (line 10 of the same file) names social cards and the share image among the requirements that must not get lost.

Until 2026-11-12 this requirement's source was "convention", which names no document and was unlocatable. The statement is unchanged; it now has a line to stand on.

## Notes

The complete set is the table in `TS-WEB-0011 D6`: `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:locale` and its alternates, `og:image` with width, height, type and alt, `twitter:card` = `summary_large_image`, and `twitter:title`, `twitter:description`, `twitter:image` emitted explicitly. The image itself is `FUN-WEB-0207`, its format `NFR-WEB-0066`, its text alternative `FUN-WEB-0208`. `twitter:site` waits for an account (`Q-0097`).
