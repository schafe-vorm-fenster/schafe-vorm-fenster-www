---
artefact: conflict
id: CONF-0018
type: direct_contradiction
status: RESOLVED
impact: Medium
involved: ["TS-WEB-0024", "SRC-0017"]
decision_point: DP-04
recommended_action: NEW_VERSION
permitted_outcomes: [REJECT_NEW, NEW_VERSION, ISOLATE]
blocking_demands: []
decision_record: DEC-0083
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T18:00:00+02:00"
---

# CONF-0018

The tiers block must carry a question heading while the copy guide fails the build on a question mark in a section title

## Positions

- **TS-WEB-0024** — TS-WEB-0024 D6 and A8 require the tiers block to carry one question heading.
  `specs/decisions/DEC-0083--no-verbatim-copy-in-a-spec.md#L21`
  > "one question heading" — a *grammatical form*

- **SRC-0017** — CG-005 fails the build on a question mark in a section title.
  `specs/decisions/DEC-0083--no-verbatim-copy-in-a-spec.md#L22`
  > on a question mark in a section title (contradiction C3)

## Impact

Medium — the determination and its acceptance criterion could only be satisfied by breaking the copy contract.

## Outcome

Taken: **NEW_VERSION**. Permitted for a direct contradiction: REJECT_NEW, NEW_VERSION, ISOLATE.

Resolved in DEC-0083, which is the record; this file is the conflict, not a
second copy of the decision.

## Blocks

TS-WEB-0024

## Confidence

`certain` — the record itself names the collision.
