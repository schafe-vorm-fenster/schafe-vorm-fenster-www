---
artefact: conflict
id: CONF-0004
type: value_conflict
status: RESOLVED
impact: Low
involved: ["SRC-0013", "@schafe-vorm-fenster/brand-design"]
decision_point: DP-04
recommended_action: NEW_VERSION
permitted_outcomes: [NEW_VERSION, REJECT_NEW]
blocking_demands: []
decision_record: DEC-0056
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T18:00:00+02:00"
---

# CONF-0004

The design system sets display type at weight 800 while the token package declares only 400 and 700

## Positions

- **SRC-0013** — concept/website-design-system.md uses weight 800 for display sizes.
  `specs/decisions/DEC-0056--design-system-delivered.md#L52`
  > the design system uses weight 800

- **@schafe-vorm-fenster/brand-design** — The tokens declare only weights 400 and 700.
  `specs/decisions/DEC-0056--design-system-delivered.md#L53`
  > for display sizes while the tokens declare only 400 and 700 (Q-0042).

## Impact

Low — recorded as a gap rather than closed here, and retired upstream when brand-design added font.weight.display 800 (Q-0042).

## Outcome

Taken: **NEW_VERSION**. Permitted for a value conflict: NEW_VERSION, REJECT_NEW.

Resolved in DEC-0056, which is the record; this file is the conflict, not a
second copy of the decision.

## Blocks

NFR-WEB-0016

## Confidence

`inferred` — the two sides were reconstructed from the record rather than named in it.
