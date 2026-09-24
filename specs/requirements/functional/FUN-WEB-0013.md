---
artefact: requirement
id: FUN-WEB-0013
class: FUN
form: F0
domain: WEB
status: DRAFT
version: 0.1.0
area: pages
source: "SRC-0003#register-mitmachenregistrieren"
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0013 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0004-A1, TS-WEB-0023-A1, TS-WEB-0023-A16 — 2 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0013

| Route | Focus job | Primary conversion |
| --- | --- | --- |
| `/mitmachen/registrieren` | publish our dates | `publish-first-event` (handover to the app) |

## Notes

Left outside the slot form by DEC-0093, and it is not a grammar failure. The body is a three-column tuple — route, focus job, primary conversion — and `@leafcutter-strict/method-statement-grammar` defines seven forms, all of them sentences: goal, need, functional, quality, constraint, business rule, fit criterion. **None of them has a slot for a tuple.** The method's own instruction for this case is "a candidate that fits no form is returned for classification rather than forced into the nearest one", and the classification is right: this is a functional requirement. What is missing is upstream, a mapping form, and flattening the tuple into three sentences per page would produce 27 artefacts that say together exactly what one row says. `form: F0` records the mismatch rather than hiding it.
