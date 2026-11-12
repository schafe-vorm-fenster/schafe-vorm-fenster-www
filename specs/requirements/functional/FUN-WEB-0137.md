---
artefact: requirement
id: FUN-WEB-0137
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: pages
needs: [NEED-WEB-0002]
source:
  source_id: SRC-0003
  loc: "go-to-market-os/concept/website-information-architecture.concept.md#L40"
  excerpt: "also the header button \"Kalender\", always visible"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0137 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0004-A9 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0137

In the header, the website SHALL carry a persistent "Kalender" entry to `/dein-ort`.

## Source

SRC-0003#navigation, DEC-0012, DEC-0039, DEC-0052, DEC-0081

Deviation: `go-to-market-os/concept/website-information-architecture.concept.md#L40` asks for "also the header button \"Kalender\", always visible". The owner removed the button from the header on 2026-11-12 (DEC-0191 §3), at every width; its destination stays the first job label. The specification carries the truth (DEC-0104 §1); DEM-0077 asks for the source that states it.

Amendment 2026-11-12: the statement above no longer holds. The header carries no "Kalender" button; `/dein-ort` is reached through the first job label "Was ist los" (DEC-0191).
