---
artefact: conflict
id: CONF-0019
type: direct_contradiction
status: RESOLVED
impact: Medium
involved: ["TS-WEB-0006", "FUN-WEB-0041"]
decision_point: DP-04
recommended_action: ISOLATE
permitted_outcomes: [REJECT_NEW, NEW_VERSION, ISOLATE]
blocking_demands: []
decision_record: DEC-0084
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T18:00:00+02:00"
---

# CONF-0019

Every page must carry a live module, but the only live figures a sender surface can show are the traction figures another rule forbids

## Positions

- **TS-WEB-0006** — TS-WEB-0006 D1 requires at least one live module per page, which is why TS-WEB-0027 D4 specified operating counters.
  `specs/decisions/DEC-0084--the-village-argument-and-the-counter-that-goes.md#L30`
  > active places — because `TS-WEB-0006 D1` requires at least one live module per

- **FUN-WEB-0041** — Static traction figures are forbidden, and counters are counted live or not shown.
  `specs/decisions/DEC-0084--the-village-argument-and-the-counter-that-goes.md#L32`
  > figures, already forbidden by `FUN-WEB-0041` and `TS-WEB-0008-A10`.

## Impact

Medium — a rule that can only be satisfied by breaking another rule was being satisfied by evasion on three sender surfaces.

## Outcome

Taken: **ISOLATE**. Permitted for a direct contradiction: REJECT_NEW, NEW_VERSION, ISOLATE.

Resolved in DEC-0084, which is the record; this file is the conflict, not a
second copy of the decision.

## Blocks

TS-WEB-0027, TS-WEB-0006

## Confidence

`certain` — the record itself names the collision.
