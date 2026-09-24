---
artefact: conflict
id: CONF-0022
type: value_conflict
status: OPEN
impact: Low
involved: ["NFR-WEB-0055", "SRC-0007"]
decision_point: DP-04
recommended_action: NEW_VERSION
permitted_outcomes: [NEW_VERSION, REJECT_NEW]
blocking_demands: []
decision_record: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T18:00:00+02:00"
---

# CONF-0022

The web-font budget: the requirement admits 50 KB, the source excludes it

## Positions

- **NFR-WEB-0055** — The requirement allows exactly 50 KB.
  `specs/requirements/quality/NFR-WEB-0055.md#L25`
  > Compressed size of the web fonts of the website SHALL be <= 50 KB

- **SRC-0007** — The adopted budget is strictly under 50KB.
  `community-calendar/docs/performance-budget.md#L22`
  > Web fonts | < 50KB | Variable font, woff2 format

## Impact

Low — one byte of difference, but it is the difference between a budget that is met and one that is not.

## Outcome

Taken: **NEW_VERSION**. Permitted for a value conflict: NEW_VERSION, REJECT_NEW.

**Open against no decision record.** The contradiction was found by the
locator run of DEC-0097 and has not been resolved; DP-04 is the owner's
at every impact level (POL-GRADED-BY-IMPACT).

## Blocks

NFR-WEB-0055

## Confidence

`certain` — the record itself names the collision.
