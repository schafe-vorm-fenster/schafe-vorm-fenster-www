---
artefact: conflict
id: CONF-0011
type: direct_contradiction
status: RESOLVED
impact: High
involved: ["SRC-0001", "SRC-0017"]
decision_point: DP-04
recommended_action: NEW_VERSION
permitted_outcomes: [REJECT_NEW, NEW_VERSION, ISOLATE]
blocking_demands: []
decision_record: DEC-0080
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T18:00:00+02:00"
---

# CONF-0011

The communication principles require the scene opener to be the visitor's own question; the wording review rejects question openers

## Positions

- **SRC-0001** — SRC-0001 §1a requires the scene opener to be the visitor's own question, and TS-WEB-0006 D7 implements it.
  `specs/decisions/DEC-0080--website-copy-guide-bound-by-a-contract.md#L25`
  > §1a requires the scene opener to be the visitor's own question.

- **SRC-0017** — The 2026-09-22 review rejects question openers and asks for statement openers instead.
  `specs/decisions/DEC-0080--website-copy-guide-bound-by-a-contract.md#L28`
  > question-opener the review rejects.

## Impact

High — the only written copy rule in the specs was the wrong one, and two page criteria plus their e2e tests assert it.

## Outcome

Taken: **NEW_VERSION**. Permitted for a direct contradiction: REJECT_NEW, NEW_VERSION, ISOLATE.

Resolved in DEC-0080, which is the record; this file is the conflict, not a
second copy of the decision.

## Blocks

FUN-WEB-0008, TS-WEB-0006, TS-WEB-0019, TS-WEB-0022, TS-WEB-0007

## Confidence

`certain` — the record itself names the collision.
