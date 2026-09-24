---
artefact: conflict
id: CONF-0003
type: dependency_conflict
status: RESOLVED
impact: Medium
involved: ["DEC-0052", "DEC-0081"]
decision_point: DP-04
recommended_action: NEW_VERSION
permitted_outcomes: [NEW_VERSION, REJECT_NEW]
blocking_demands: []
decision_record: DEC-0052
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T18:00:00+02:00"
---

# CONF-0003

The inline newsletter block was permitted because /ueber-uns had no conversion of its own — and then it got one

## Positions

- **DEC-0052** — §4 permits the inline newsletter block because /ueber-uns has no primary conversion to compete with.
  `specs/decisions/DEC-0052--page-level-answers.md#L26`
  > `/ueber-uns` has no primary conversion of its own, so the

- **DEC-0081** — DEC-0081 §6 gives /ueber-uns the booking as its primary conversion.
  `specs/decisions/DEC-0081--contact-section-replaces-the-contact-form.md#L114`
  > So `/ueber-uns` declares `primaryConversion: request-product-briefing`,

## Impact

Medium — the block's only stated justification became false, so it stood on a reason no record held any more.

## Outcome

Taken: **NEW_VERSION**. Permitted for a dependency conflict: NEW_VERSION, REJECT_NEW.

Resolved in DEC-0052, which is the record; this file is the conflict, not a
second copy of the decision.

## Blocks

TS-WEB-0027, FUN-WEB-0017

## Confidence

`certain` — the record itself names the collision.
