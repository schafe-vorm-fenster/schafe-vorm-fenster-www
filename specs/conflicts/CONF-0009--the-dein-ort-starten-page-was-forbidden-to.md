---
artefact: conflict
id: CONF-0009
type: direct_contradiction
status: RESOLVED
impact: Medium
involved: ["TS-WEB-0021", "SRC-0017"]
decision_point: DP-04
recommended_action: NEW_VERSION
permitted_outcomes: [REJECT_NEW, NEW_VERSION, ISOLATE]
blocking_demands: []
decision_record: DEC-0071
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T18:00:00+02:00"
---

# CONF-0009

The /dein-ort/starten page was forbidden to address the reader directly while the copy guide makes direct address the site-wide rule

## Positions

- **TS-WEB-0021** — TS-WEB-0021 D9 forbids direct address on /dein-ort/starten — never direct, name who usually starts it.
  `specs/decisions/DEC-0071--the-last-four.md#L105`
  > address and forbade it on `/dein-ort/starten` — *never direct

- **SRC-0017** — CG-008/CG-012 make direct address of the reader the rule for the whole site.
  `specs/decisions/DEC-0071--the-last-four.md#L108`
  > the reader directly, everywhere** (contradiction C8 of

## Impact

Medium — one route's tone rule contradicted a site-wide copy rule that the content phase writes against.

## Outcome

Taken: **NEW_VERSION**. Permitted for a direct contradiction: REJECT_NEW, NEW_VERSION, ISOLATE.

Resolved in DEC-0071, which is the record; this file is the conflict, not a
second copy of the decision.

## Blocks

TS-WEB-0021

## Confidence

`certain` — the record itself names the collision.
