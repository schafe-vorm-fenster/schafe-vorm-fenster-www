---
artefact: conflict
id: CONF-0020
type: direct_contradiction
status: RESOLVED
impact: High
involved: ["DEC-0040", "@leafcutter-strict/library-schemas"]
decision_point: DP-04
recommended_action: ISOLATE
permitted_outcomes: [REJECT_NEW, NEW_VERSION, ISOLATE]
blocking_demands: [DEM-0015]
decision_record: DEC-0090
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T18:00:00+02:00"
---

# CONF-0020

The acceptance-test contract closes its item at four keys while every criterion here must carry a verification level

## Positions

- **DEC-0040** — Every acceptance criterion is globally addressable and declares one of six verification levels.
  `specs/decisions/DEC-0040--verification-architecture.md#L17`
  > **Every acceptance criterion is globally addressable and declares its

- **@leafcutter-strict/library-schemas** — The tactical-specification contract closes acceptance_tests items at exactly id, given, when and then.
  `specs/decisions/DEC-0090--acceptance-criteria-keep-the-verification-level.md#L25`
  > `additionalProperties: false` closes the item at exactly four keys.

## Impact

High — the level is what the verification pyramid and the 181/420 burn-down are computed from, so migrating would have cost the repository its steering number.

## Outcome

Taken: **ISOLATE**. Permitted for a direct contradiction: REJECT_NEW, NEW_VERSION, ISOLATE.

Resolved in DEC-0090, which is the record; this file is the conflict, not a
second copy of the decision.

## Blocks

420 acceptance criteria, the verification pyramid

## Confidence

`certain` — the record itself names the collision.
