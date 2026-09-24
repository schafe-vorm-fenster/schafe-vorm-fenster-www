---
artefact: conflict
id: CONF-0002
type: dependency_conflict
status: RESOLVED
impact: Medium
involved: ["TS-WEB-0002", "@schafe-vorm-fenster/brand-design"]
decision_point: DP-04
recommended_action: NEW_VERSION
permitted_outcomes: [NEW_VERSION, REJECT_NEW]
blocking_demands: []
decision_record: DEC-0043
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T18:00:00+02:00"
---

# CONF-0002

Two tactical specs were written against a typeface the brand package had already retired

## Positions

- **TS-WEB-0002** — TS-WEB-0002 D3 and TS-WEB-0003 D3 specify type rules against Catamaran.
  `specs/decisions/DEC-0043--brand-typeface-changed.md#L12`
  > TS-WEB-0002 D3 and TS-WEB-0003 D3 were written against Catamaran

- **@schafe-vorm-fenster/brand-design** — The tokens' font.family is Atkinson Hyperlegible Next; Catamaran is sunset.
  `specs/decisions/DEC-0043--brand-typeface-changed.md#L23`
  > sans: 'Atkinson Hyperlegible Next', 'Atkinson Hyperlegible',

## Impact

Medium — the weight floor, the accessibility argument and Q-0013's verification question all hung off the withdrawn family.

## Outcome

Taken: **NEW_VERSION**. Permitted for a dependency conflict: NEW_VERSION, REJECT_NEW.

Resolved in DEC-0043, which is the record; this file is the conflict, not a
second copy of the decision.

## Blocks

TS-WEB-0002, TS-WEB-0003, NFR-WEB-0016

## Confidence

`inferred` — the two sides were reconstructed from the record rather than named in it.
