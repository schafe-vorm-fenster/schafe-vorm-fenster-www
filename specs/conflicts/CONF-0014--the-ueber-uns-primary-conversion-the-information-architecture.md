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

Taken: **NEW_VERSION**, and it falls on **SRC-0003** — not on the requirement.

The taxonomy permits REJECT_NEW, NEW_VERSION and ISOLATE for a direct
contradiction, and this record used to stop at the word. Under the rule in
force when it was written (`specs/README.md` rule 4, "the concept document
wins") a reader would have taken the new version to be the requirement's.
It is not: the requirement stands as DEC-0081 decided it, and the **source**
is the artefact asked for a new version, through DEM-0001.

DEC-0104 §1 is why that is now stated rather than left implicit: the
specification carries the truth, a source is cited rather than obeyed, and the
deviation is recorded at the artefact (`Deviation:`) and as a demand against
the source. Nothing about the type, the impact or the permitted outcome set
changed — the taxonomy was right, the record was merely silent at the one
place where silence now means the opposite thing.

Resolved in DEC-0081, which is the record; this file is the conflict, not a
second copy of the decision. DEM-0001 stays `OPEN` until the source is edited
or the decision is reversed.

## Blocks

FUN-WEB-0017, SRC-0003

## Confidence

`certain` — the record itself names the collision.
