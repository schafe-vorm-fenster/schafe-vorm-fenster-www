---
artefact: requirement
id: CON-WEB-0057
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: technical-constraints
needs: [UNKNOWN]
source:
  source_id: SRC-0014
  loc: "concept/website-design-system.md#L1067"
  excerpt: "Any new requirement takes the matching Lucide glyph — no icon is drawn by"
evidence_sufficiency: S3
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0057

The solution SHALL NOT commit an icon file or draw a glyph by hand, imposed by DEC-0056.

## Source

SRC-0014#icons, DEC-0056

Finding: The statement joins two clauses that live in two different SRC-0014 files: `draw a glyph by hand` here (the sentence wraps onto line 1002, `hand, and no glyph from another family enters the set.`), while `commit an icon file` rests on concept/v2.0/README.md line 32, `Asset geliefert und nicht ins Repo eingecheckt.`.
