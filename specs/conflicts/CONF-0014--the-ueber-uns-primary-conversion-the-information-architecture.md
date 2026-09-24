---
artefact: conflict
id: CONF-0014
type: direct_contradiction
status: RESOLVED
impact: High
involved: ["SRC-0003", "FUN-WEB-0017"]
decision_point: DP-04
recommended_action: NEW_VERSION
permitted_outcomes: [REJECT_NEW, NEW_VERSION, ISOLATE]
blocking_demands: [DEM-0001]
decision_record: DEC-0081
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T18:00:00+02:00"
---

# CONF-0014

The /ueber-uns primary conversion: the information architecture says it has none

## Positions

- **SRC-0003** — The page brief gives /ueber-uns no primary conversion of its own.
  `go-to-market-os/concept/website-information-architecture.concept.md#L205`
  > **Primary conversion:** none of its own; the closing CTA offers all

- **FUN-WEB-0017** — The route table gives /ueber-uns request-product-briefing as its primary conversion.
  `specs/requirements/functional/FUN-WEB-0017.md#L32`
  > `/ueber-uns` | understand who is behind it | `request-product-briefing`

## Impact

High — the conversion map in the same source does not list the page either, so a reader of SRC-0003 alone would build the page without its primary ask.

## Outcome

Taken: **NEW_VERSION**. Permitted for a direct contradiction: REJECT_NEW, NEW_VERSION, ISOLATE.

Resolved in DEC-0081, which is the record; this file is the conflict, not a
second copy of the decision.

## Blocks

FUN-WEB-0017, SRC-0003

## Confidence

`certain` — the record itself names the collision.
