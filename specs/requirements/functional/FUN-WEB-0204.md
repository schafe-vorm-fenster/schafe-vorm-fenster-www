---
artefact: requirement
id: FUN-WEB-0204
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: pages
needs: [NEED-WEB-0011, NEED-WEB-0015, NEED-WEB-0016]
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

# FUN-WEB-0204

At the publishing paths of `/mitmachen`, the website SHALL state the price boundary of BUS-WEB-0017.

## Source

SRC-0008 — `@schafe-vorm-fenster/offerings`, as BUS-WEB-0017 cites it. DEC-0107 §3.

## Rationale

The rule is the business's; this is the page behaviour that publishes it. Path 03 reads an actor's own website, and a reader who has just been told that the platform can read her website will ask what that costs. Leaving the answer out is what produced the review's finding: the page invites a connection and says nothing about its price, so the reader supplies the answer herself, and the answer she supplies is the wrong one.

It states the boundary, not a figure: `/mitmachen` carries no numeric price at all (TS-WEB-0022 D1, A12), and the add-on has none to carry — `custom-data-integration` is quoted per case, `price_status: on-request`.

## Notes

The render form is the hint banner of TS-WEB-0022 D11, and TS-WEB-0022-A17 is the criterion. The banner is not a second CTA and declares no conversion (DEC-0082 §1).
