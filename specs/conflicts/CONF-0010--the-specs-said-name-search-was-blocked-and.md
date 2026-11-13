---
artefact: conflict
id: CONF-0010
type: direct_contradiction
status: RESOLVED
impact: High
involved: ["FUN-WEB-0046", "UNKNOWN"]
decision_point: DP-04
recommended_action: NEW_VERSION
permitted_outcomes: [REJECT_NEW, NEW_VERSION, ISOLATE]
blocking_demands: []
decision_record: DEC-0079
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T18:00:00+02:00"
---

# CONF-0010

The specs said name search was blocked and the field must ask for a postcode; the shipped site had been searching by name all along

## Positions

- **FUN-WEB-0046** — ZIP works today, name search is blocked on geo-api, so the field asks for a postcode and explains the restriction.
  `specs/decisions/DEC-0079--place-search-by-name.md#L12`
  > six page specs said: *ZIP works today, name search is blocked

- **unattributed** — The website ships a committed covered-community index and has been searching by place name without the geo-api endpoint.
  `specs/decisions/DEC-0079--place-search-by-name.md#L31`
  > the specs described a blocker that the implementation

## Impact

High — the site's primary conversion entry was specified against a restriction that did not exist, and the preview shipped the wrong field.

## Outcome

Taken: **NEW_VERSION**. Permitted for a direct contradiction: REJECT_NEW, NEW_VERSION, ISOLATE.

Resolved in DEC-0079, which is the record; this file is the conflict, not a
second copy of the decision.

## Blocks

FUN-WEB-0046, TS-WEB-0008, TS-WEB-0019, TS-WEB-0020, TS-WEB-0021, TS-WEB-0023

## Confidence

`certain` — the record itself names the collision.
