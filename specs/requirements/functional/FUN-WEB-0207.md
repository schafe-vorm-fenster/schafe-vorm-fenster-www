---
artefact: requirement
id: FUN-WEB-0207
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: privacy
needs: [NEED-WEB-0017, NEED-WEB-0022, NEED-WEB-0029]
source:
  source_id: DEC-0218
  loc: "specs/decisions/DEC-0218--etracker-counts-every-page-and-every-cta-click-from-one-environment-variable.md#L23"
  excerpt: "2. **Every page view is counted, client navigation included, under a stable name.**"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0207 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0012-A12 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5.5"
  generated_at: "2026-11-12T18:10:00+01:00"
---

# FUN-WEB-0207

While the eTracker secure code is configured, the website SHALL count one page view per page a visitor reaches, client navigation included, named by route and language.

## Source

DEC-0218 §1–§2 (issue #194, owner, 2026-11-12).

Unconfigured, the website loads no loader and sends nothing (DEC-0218 §1); that half is the same criterion's second describe block.

## Notes

The names are `page-view.ts`'s: `<lang>/<route trail>` for `et_pagename`, `<lang>/<top-level route>` for `et_areas`, `<lang>/not-found` for a 404. The determination is `TS-WEB-0012 D2`. `/start` is outside the requirement (`TS-WEB-0016 D15`, "Measurement: nothing").

The needs are the analytics family's (`FUN-WEB-0124`, `CON-WEB-0035`): what binds the count is how it is taken — cookieless and banner-free (`NFR-WEB-0061`, `NFR-WEB-0062`) — not who reads the report.
