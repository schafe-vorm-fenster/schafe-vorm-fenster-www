---
artefact: requirement
id: FUN-WEB-0129
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: accessibility
source: "SRC-0006"
evidence_sufficiency: S2
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# FUN-WEB-0129

For the browser preference hints `prefers-color-scheme`, `prefers-contrast`, `prefers-reduced-motion`, reduced-data and the user's font-size setting, the website SHALL render accordingly.

## Rationale

"The site shall honour browser preference hints and render accordingly: `prefers-color-scheme` (dark and light theme), `prefers-contrast` (high-contrast theme), `prefers-reduced-motion`, reduced-data, and user font-size scaling."

## Notes

Reclassified from the quality class by DEC-0092. One modal, one predicate — the five hints are the object of "honour", not five statements joined by "and" — so this is a reclassification and not a split. The reduced-data hint additionally carries a measure of its own, NFR-WEB-0008. The number could not be kept: 0014 is taken in the functional class by the `/dein-kalender` page row.
