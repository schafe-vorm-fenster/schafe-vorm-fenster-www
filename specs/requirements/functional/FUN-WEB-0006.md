---
artefact: requirement
id: FUN-WEB-0006
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: jobs-and-navigation
needs: [NEED-WEB-0007, NEED-WEB-0008]
source:
  source_id: SRC-0001
  loc: "go-to-market-os/concept/website-communication-principles.concept.md#L299"
  excerpt: "The last block of every page is the CTA of its focus job, with the context"
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0006 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0006-A17, TS-WEB-0006-A7 — 1 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0006

On every page, the website SHALL close the page's own blocks with the CTA of the page's focus job — identical to the primary conversion and followed by the context band.

## Source

SRC-0001#7, SRC-0014#page-rhythm

Finding: "identical to the primary conversion" is not on this line; it is line 326 ("A closing CTA identical to the primary conversion.").

Deviation: `go-to-market-os/concept/website-communication-principles.concept.md#L299` says "The last block of every page is the CTA of its focus job, with the context band in front of it." Since the owner's review of 2026-10-27 — `/dein-ort` (issue #86, DEC-0170) and `/dein-kalender` (issue #93), generalised by DEC-0174 §4 — the closing CTA ends the page's own blocks and the band follows it as the last block; the page still ends in its conversion in the sense the principle argues, as nothing of the page's own follows it. The closing place search on `/` stays after the band. The specification carries the truth (DEC-0104 §1); DEM-0073 asks the source to follow.

## Notes

Section order and colour rhythm follow SRC-0014 "Page Rhythm".
