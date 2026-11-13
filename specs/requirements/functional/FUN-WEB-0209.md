---
artefact: requirement
id: FUN-WEB-0209
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: seo
needs: [NEED-WEB-0003]
source:
  source_id: SRC-0019
  loc: "plan/reviews/2026-11-12/2026-11-12 Review SEO und Sharing.md#L18"
  excerpt: "Favicon und App-Icons sind gesetzt."
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0209 that pass"
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

# FUN-WEB-0209

On every page, the website SHALL link a favicon, a touch icon and app icons, each drawn from the brand mark of the brand package, as a full circle.

## Source

SRC-0019 — issue #195 asks for favicon and app icons; the owner's statement of 2026-11-12 (line 10) names the logo among what must not get lost.

Further: the owner's review of 2026-09-22 (`plan/reviews/2026-09-23/2026-09-22 Review SVF Preview Website.md`, line 6) asks for the favicon with a larger border radius, "like a deliberately rounded app icon". The brand package's rule is `logo.radius` = `radius.pill`, a full circle on every surface including the favicon (`specs/contracts/design-system-contract.md`, the `logo.*` row; `state/open.md` row 214). The owner decided on 2026-11-12 that the favicon is a full circle, the brand rule (`Q-0095`). The website serves the round file from the brand package (`./logo-round.svg`, `./logo-round.png`, go-to-market-os PR 712, brand-design 2.10.0), issue #199. Status stays DRAFT.

## Notes

The sizes (32, 180, 192 and 512 px) are `TS-WEB-0011 D10`, [PROPOSED]; no source names them. No logo file is committed to this repository — every icon is drawn from the package at build time (`TS-WEB-0017-A6`).

The need is `NEED-WEB-0003` — keep the local view at hand so that finding it again costs nothing: a tab, a bookmark and a home-screen entry are found again by their icon.
