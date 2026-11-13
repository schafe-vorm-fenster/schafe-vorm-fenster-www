---
artefact: requirement
id: FUN-WEB-0005
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: jobs-and-navigation
needs: [NEED-WEB-0007, NEED-WEB-0008]
source:
  source_id: SRC-0001
  loc: "go-to-market-os/concept/website-communication-principles.concept.md#L209"
  excerpt: "The context band sits below the main argument and above the closing CTA."
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0005 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0006-A6 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0005

On every page, the website SHALL carry a context band naming the other three jobs, phrased as an offer, placed after the closing CTA as the last block of the page's content — except where the closing block is the closing place search, which follows it.

## Source

SRC-0001#2

Finding: Composite statement: placement is this line; "phrased as an offer" is lines 202-203; "naming the other three jobs" is line 325 (compliance check 6).

Deviation: `go-to-market-os/concept/website-communication-principles.concept.md#L209` says "The context band sits below the main argument and above the closing CTA." The owner's review of 2026-10-27 moved the closing block in front of the band twice — on `/dein-ort`, where the homescreen module is the closing block (issue #86, DEC-0170), and on `/dein-kalender` (issue #93), because a conversion standing after the hand-off to other jobs loses its context — and DEC-0174 §4 makes it the rule on every page; only the closing place search on `/` keeps its place after the band (SRC-0014 §Page Rhythm). The specification carries the truth (DEC-0104 §1); DEM-0073 asks the source to follow.
