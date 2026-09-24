---
artefact: requirement
id: FUN-WEB-0018
class: FUN
form: F0
domain: WEB
status: DRAFT
version: 0.1.0
area: pages
source:
  source_id: SRC-0003
  loc: "go-to-market-os/concept/website-information-architecture.concept.md#L222"
  excerpt: "This is the only list-shaped page on the"
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0018 that pass"
  operator: "="
  value: 5
  unit: criteria
  meter: "TS-WEB-0004-A1, TS-WEB-0028-A11, TS-WEB-0028-A12, TS-WEB-0028-A2, TS-WEB-0028-A9 — 5 of 5 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0018

| Route | Focus job | Primary conversion |
| --- | --- | --- |
| `/ueber-uns/archiv` | understand who is behind it | none; only list-shaped page, not a destination |

## Source

SRC-0003#archive

Finding: "Primary conversion: none." is line 219; "deliberately not a destination" continues on line 223.

## Notes

Left outside the slot form by DEC-0093, and it is not a grammar failure. The body is a three-column tuple — route, focus job, primary conversion — and `@leafcutter-strict/method-statement-grammar` defines seven forms, all of them sentences: goal, need, functional, quality, constraint, business rule, fit criterion. **None of them has a slot for a tuple.** The method's own instruction for this case is "a candidate that fits no form is returned for classification rather than forced into the nearest one", and the classification is right: this is a functional requirement. What is missing is upstream, a mapping form, and flattening the tuple into three sentences per page would produce 27 artefacts that say together exactly what one row says. `form: F0` records the mismatch rather than hiding it.
