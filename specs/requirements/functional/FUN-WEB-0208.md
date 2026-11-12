---
artefact: requirement
id: FUN-WEB-0208
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: privacy
needs: [NEED-WEB-0017, NEED-WEB-0022, NEED-WEB-0029]
source:
  source_id: DEC-0218
  loc: "specs/decisions/DEC-0218--etracker-counts-every-page-and-every-cta-click-from-one-environment-variable.md#L26"
  excerpt: "3. **Every CTA click reports one event.** Category is the hub conversion goal its target serves, or `navigation`, or `outbound`."
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0208 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0012-A13, TS-WEB-0012-A14 — 2 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5.5"
  generated_at: "2026-11-12T18:10:00+01:00"
---

# FUN-WEB-0208

When a visitor clicks a call to action, the website SHALL report one click event categorised by the conversion goal the target serves.

## Source

DEC-0218 §3 (issue #194, owner, 2026-11-12).

## Notes

The naming scheme (category, action, object, type) and the CTA → event table are `TS-WEB-0012 D4` (click layer) and `src/lib/analytics/cta-event.ts`. A CTA is an element carrying a `data-cta` rank (`TS-WEB-0006 D3`) or a link that leaves the site. The click event carries no personal data and no free text (`TS-WEB-0012 D4` rule 3): the object is built from the route id, a fixed target key or a host name, never from a label.

It does not replace the conversion events of `CON-WEB-0035`; the action tells the two apart (DEC-0218 §4).
