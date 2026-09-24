---
artefact: conflict
id: CONF-0013
type: direct_contradiction
status: RESOLVED
impact: High
involved: ["SRC-0003", "CON-WEB-0061"]
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

# CONF-0013

Contact in the footer: the information architecture requires it, the constraint forbids it

## Positions

- **SRC-0003** — The information architecture puts contact and newsletter in the footer.
  `go-to-market-os/concept/website-information-architecture.concept.md#L35`
  > Contact and newsletter live in the footer, together with the legal links

- **CON-WEB-0061** — The constraint forbids contact in the footer.
  `specs/requirements/constraints/CON-WEB-0061.md#L30`
  > The solution SHALL NOT place contact inside the footer, imposed by DEC-0081.

## Impact

High — the source is the reference the page briefs are read from, and it still tells a reader the opposite of what ships.

## Outcome

Taken: **NEW_VERSION**. Permitted for a direct contradiction: REJECT_NEW, NEW_VERSION, ISOLATE.

Resolved in DEC-0081, which is the record; this file is the conflict, not a
second copy of the decision.

## Blocks

CON-WEB-0061, SRC-0003

## Confidence

`certain` — the record itself names the collision.
