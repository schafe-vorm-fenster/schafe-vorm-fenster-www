---
artefact: requirement
id: CON-WEB-0056
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: technical-constraints
source:
  source_id: SRC-0014
  loc: "concept/v2.0/README.md#L31"
  excerpt: "sich als Abhängigkeit in den eigenen Stack"
evidence_sufficiency: S3
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0056

The solution SHALL install the icon set as a dependency and import glyphs by name, imposed by DEC-0056.

## Source

SRC-0014#icons, DEC-0056

Finding: Only the `install as a dependency` half is in the source. `import glyphs by name` is not stated anywhere in SRC-0014; the closest is the plain list of glyph names (concept/v2.0/README.md lines 36-38, concept/website-design-system.md lines 966-995). · the source cites a requirement identifier at this locator that this repository has since retired, so the excerpt stops before it.
