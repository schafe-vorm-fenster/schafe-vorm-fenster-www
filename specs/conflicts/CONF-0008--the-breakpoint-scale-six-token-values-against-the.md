---
artefact: conflict
id: CONF-0008
type: value_conflict
status: RESOLVED
impact: High
involved: ["@schafe-vorm-fenster/brand-design", "TS-WEB-0017"]
decision_point: DP-04
recommended_action: REJECT_NEW
permitted_outcomes: [NEW_VERSION, REJECT_NEW]
blocking_demands: []
decision_record: DEC-0067
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T18:00:00+02:00"
---

# CONF-0008

The breakpoint scale: six token values against the spec's two, with the names md and lg reused for different pixel values

## Positions

- **@schafe-vorm-fenster/brand-design** — The token set ships six breakpoints, with md at 640 and lg at 768.
  `specs/decisions/DEC-0067--six-breakpoints-dense-at-the-phone-end.md#L11`
  > ships six breakpoint tokens: `xs` 360, `sm` 428, `md` 640,

- **TS-WEB-0017** — TS-WEB-0017 D2(b) fixed two breakpoints and gave the names md and lg to 768 and 1024.
  `specs/decisions/DEC-0067--six-breakpoints-dense-at-the-phone-end.md#L13`
  > had reused the names `md` and `lg` for 768 and 1024

## Impact

High — an implementation writing `md:` against the tokens would silently have got 640 px where the spec meant 768.

## Outcome

Taken: **REJECT_NEW**. Permitted for a value conflict: NEW_VERSION, REJECT_NEW.

Resolved in DEC-0067, which is the record; this file is the conflict, not a
second copy of the decision.

## Blocks

CON-WEB-0049, CON-WEB-0050, CON-WEB-0051, TS-WEB-0017

## Confidence

`certain` — the record itself names the collision.
