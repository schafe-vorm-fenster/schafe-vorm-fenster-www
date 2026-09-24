---
artefact: conflict
id: CONF-0007
type: direct_contradiction
status: RESOLVED
impact: High
involved: ["DEC-0012", "SRC-0017"]
decision_point: DP-04
recommended_action: ISOLATE
permitted_outcomes: [REJECT_NEW, NEW_VERSION, ISOLATE]
blocking_demands: []
decision_record: DEC-0066
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T18:00:00+02:00"
---

# CONF-0007

The copy guide fails the build on a Sie form while the legal page is imported verbatim in the formal register

## Positions

- **DEC-0012** — The five legal documents on /rechtliches are imported verbatim and are written in the formal register.
  `specs/decisions/DEC-0066--one-register-du-everywhere.md#L85`
  > (DEC-0012, DEC-0027) and are written in the formal register

- **SRC-0017** — CG-003 makes any Sie form a build failure and carries no carve-out.
  `specs/decisions/DEC-0066--one-register-du-everywhere.md#L86`
  > documents are. SRC-0017 CG-003 makes a `Sie` form a build failure and

## Impact

High — with no exemption the /rechtliches page could not ship at all.

## Outcome

Taken: **ISOLATE**. Permitted for a direct contradiction: REJECT_NEW, NEW_VERSION, ISOLATE.

Resolved in DEC-0066, which is the record; this file is the conflict, not a
second copy of the decision.

## Blocks

TS-WEB-0029, TS-WEB-0007, FUN-WEB-0029

## Confidence

`certain` — the record itself names the collision.
