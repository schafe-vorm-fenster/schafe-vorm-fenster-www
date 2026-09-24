---
artefact: requirement
id: CON-WEB-0007
class: CON
form: C0
domain: WEB
status: DRAFT
version: 0.1.0
area: technical-constraints
source: "SRC-0014#icons, DEC-0056"
evidence_sufficiency: S3
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-10T17:58:35+02:00"
---

# CON-WEB-0007

Icons shall come from exactly one set — Lucide, 24 × 24 grid, 2 px stroke, monochrome, inheriting a single token colour, in three sizes (24 · 18 · 32). The website installs the set into its own stack as a dependency and imports glyphs by name; no icon file is committed here, none is drawn by hand, and no second family enters the set.
