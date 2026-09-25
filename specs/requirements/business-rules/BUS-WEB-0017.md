---
artefact: requirement
id: BUS-WEB-0017
class: BUS
form: B1
domain: WEB
status: DRAFT
version: 0.1.0
area: scope-boundaries
needs: [NEED-WEB-0015, NEED-WEB-0016]
source:
  source_id: SRC-0008
  loc: "@schafe-vorm-fenster/offerings/community-calendar.offering.md#L107"
  excerpt: "Publishing paths included: maintaining dates in the actor's own Google Calendar"
evidence_sufficiency: S3
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-25T09:30:00+02:00"
---

# BUS-WEB-0017

For a publishing path whose source the platform already supports, publishing counts as free of charge.

## Source

SRC-0008 — `@schafe-vorm-fenster/offerings`, `community-calendar.offering.md#L98`–`#L115` and `custom-data-integration.offering.md#L82`–`#L100`, read in the installed package at 0.3.3. DEC-0107.

The position is given in the published package rather than in a hub repository path, because a published version is a fixed artefact and this one was the artefact read.

Deviation: `@schafe-vorm-fenster/offerings/custom-data-integration.offering.md#L88` puts "an ICS feed" inside the paid add-on's included scope. DEC-0107 §2 makes a feed the platform already reads a standard source and therefore free, and narrows the add-on to the individual integration into a system the platform does not already support. The specification carries the truth (DEC-0104 §1); DEM-0065 asks the offering owner to follow.

## Rationale

It is true of the business whoever applies it — a website, a quotation, a support conversation or nobody. It has no system subject, which is question 1 of `@leafcutter-strict/method-requirement-classification`'s tree and the reason this is a business rule rather than a page behaviour.

The rule states only the **free** side, and that is deliberate rather than a half-rule. The paid side needs no artefact here: `custom-data-integration` is a published offering, `commercial_model: paid`, `promotion: on-request-only`, and its own record carries what it costs. What was missing from every register was the *free* side and the boundary between them, and a two-clause statement would be the compound `method-statement-grammar` forbids.

## Notes

Applied on the website by FUN-WEB-0204. The list of standard sources is the offering's, not this specification's, and DEM-0065 is open until the offering carries it.
