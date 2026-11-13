---
artefact: conflict
id: CONF-0016
type: direct_contradiction
status: RESOLVED
impact: Medium
involved: ["SRC-0003", "SRC-0001"]
decision_point: DP-04
recommended_action: NEW_VERSION
permitted_outcomes: [REJECT_NEW, NEW_VERSION, ISOLATE]
blocking_demands: []
decision_record: DEC-0082
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T18:00:00+02:00"
---

# CONF-0016

Two equal conversions on /dein-kalender against one visually unrivalled primary

## Positions

- **SRC-0003** — The page brief gives /dein-kalender two conversions of equal weight.
  `specs/decisions/DEC-0082--one-primary-per-page-and-the-cta-ladder.md#L23`
  > SRC-0003 gives `/dein-kalender` two equal conversions

- **SRC-0001** — SRC-0001 §2 allows one unrivalled primary conversion per page.
  `specs/decisions/DEC-0082--one-primary-per-page-and-the-cta-ladder.md#L24`
  > while SRC-0001 §2 allows one unrivalled primary

## Impact

Medium — TS-WEB-0006 D3 had reconciled the two only as a [PROPOSED] clause, and a proposal cannot close a contradiction.

## Outcome

Taken: **NEW_VERSION**. Permitted for a direct contradiction: REJECT_NEW, NEW_VERSION, ISOLATE.

Resolved in DEC-0082, which is the record; this file is the conflict, not a
second copy of the decision.

## Blocks

FUN-WEB-0003, TS-WEB-0006

## Confidence

`certain` — the record itself names the collision.
