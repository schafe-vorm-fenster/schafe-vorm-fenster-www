---
artefact: requirement
id: FUN-WEB-0017
class: FUN
form: F0
domain: WEB
status: DRAFT
version: 0.1.0
area: pages
needs: [NEED-WEB-0024, NEED-WEB-0025]
source:
  source_id: SRC-0003
  loc: "go-to-market-os/concept/website-information-architecture.concept.md#L221"
  excerpt: "**Primary conversion:** `request-product-briefing`. The closing CTA"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0017 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0004-A1, TS-WEB-0027-A1, TS-WEB-0027-A15 — 2 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0017

| Route | Focus job | Primary conversion |
| --- | --- | --- |
| `/ueber-uns` | understand who is behind it | `request-product-briefing`, carried by the page's contact section and repeated in the closing block (DEC-0081 §6). Secondary, below it: `subscribe-to-newsletter` in the inline block — the two asks serve two readiness levels (DEC-0052 §4 as amended) |

## Source

SRC-0003, DEC-0036, DEC-0052, DEC-0081

Finding: Re-resolved 2026-09-25. SRC-0003 line 221 now gives `/ueber-uns` the conversion this row states, and the conversion map lists the page at line 265. Line 222 adds "nothing above the fold does", which is what this row means by the closing block and the contact section — both sit below the first viewport (DEC-0081 §6, A3 of the audit). The secondary `subscribe-to-newsletter` is line 51 of the same source, "appears a second time inline on `/ueber-uns`, where the origin story", at the secondary weight DEC-0052 §4 gives it.

Amendment 2026-09-25: the recorded deviation against old line 205 is withdrawn. Hub PR #510 replaced "Primary conversion: none of its own; the closing CTA offers all three jobs" and added the missing conversion-map row, which is the edit DEM-0001 required; DEM-0001 is ANSWERED and CONF-0014 records the amendment as the NEW_VERSION it asked for. The locator is a position instead of UNKNOWN.

## Notes

Left outside the slot form by DEC-0093, and it is not a grammar failure. The body is a three-column tuple — route, focus job, primary conversion — and `@leafcutter-strict/method-statement-grammar` defines seven forms, all of them sentences: goal, need, functional, quality, constraint, business rule, fit criterion. **None of them has a slot for a tuple.** The method's own instruction for this case is "a candidate that fits no form is returned for classification rather than forced into the nearest one", and the classification is right: this is a functional requirement. What is missing is upstream, a mapping form, and flattening the tuple into three sentences per page would produce 27 artefacts that say together exactly what one row says. `form: F0` records the mismatch rather than hiding it.
