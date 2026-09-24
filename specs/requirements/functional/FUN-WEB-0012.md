---
artefact: requirement
id: FUN-WEB-0012
class: FUN
form: F0
domain: WEB
status: DRAFT
version: 0.1.0
area: pages
source:
  source_id: SRC-0003
  loc: "go-to-market-os/concept/website-information-architecture.concept.md#L107"
  excerpt: "**Primary conversion:** `register-as-publisher`."
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0012 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0004-A1, TS-WEB-0022-A1, TS-WEB-0022-A16 — 3 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0012

| Route | Focus job | Primary conversion |
| --- | --- | --- |
| `/mitmachen` | publish our dates | `register-as-publisher` |

## Source

SRC-0003#publish-our-dates-mitmachen

Finding: Focus job line 106; route heading line 104.

## Notes

Left outside the slot form by DEC-0093, and it is not a grammar failure. The body is a three-column tuple — route, focus job, primary conversion — and `@leafcutter-strict/method-statement-grammar` defines seven forms, all of them sentences: goal, need, functional, quality, constraint, business rule, fit criterion. **None of them has a slot for a tuple.** The method's own instruction for this case is "a candidate that fits no form is returned for classification rather than forced into the nearest one", and the classification is right: this is a functional requirement. What is missing is upstream, a mapping form, and flattening the tuple into three sentences per page would produce 27 artefacts that say together exactly what one row says. `form: F0` records the mismatch rather than hiding it.
