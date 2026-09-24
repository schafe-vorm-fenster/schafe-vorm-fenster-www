---
artefact: conflict
id: CONF-0006
type: direct_contradiction
status: RESOLVED
impact: Medium
involved: ["UNKNOWN", "SRC-0001"]
decision_point: DP-04
recommended_action: REJECT_NEW
permitted_outcomes: [REJECT_NEW, NEW_VERSION, ISOLATE]
blocking_demands: []
decision_record: DEC-0066
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T18:00:00+02:00"
---

# CONF-0006

The wireframes address the Verwaltung as Sie while the communication principles require one sender across all four jobs

## Positions

- **unattributed** — The wireframe screens 05, 06 and 08 address the Verwaltung with Sie while readers and Vereine are addressed with du.
  `specs/decisions/DEC-0066--one-register-du-everywhere.md#L11`
  > The wireframes address readers and Vereine with `du` and the Verwaltung

- **SRC-0001** — Principle 2 keeps all four jobs one click apart, so the same person may not meet two senders inside one click.
  `specs/decisions/DEC-0066--one-register-du-everywhere.md#L16`
  > It collides with principle 2 of SRC-0001.

## Impact

Medium — a register axis would have had to be carried by the content pipeline for the rest of the project.

## Outcome

Taken: **REJECT_NEW**. Permitted for a direct contradiction: REJECT_NEW, NEW_VERSION, ISOLATE.

Resolved in DEC-0066, which is the record; this file is the conflict, not a
second copy of the decision.

## Blocks

TS-WEB-0007

## Confidence

`certain` — the record itself names the collision.
