---
artefact: conflict
id: CONF-0021
type: value_conflict
status: OPEN
impact: Medium
involved: ["NFR-WEB-0048", "SRC-0007"]
decision_point: DP-04
recommended_action: NEW_VERSION
permitted_outcomes: [NEW_VERSION, REJECT_NEW]
blocking_demands: [DEM-0007]
decision_record: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T18:00:00+02:00"
---

# CONF-0021

Interaction to Next Paint against the adopted budget's First Input Delay

## Positions

- **NFR-WEB-0048** — The requirement fixes INP < 200 ms as the interaction budget.
  `specs/requirements/quality/NFR-WEB-0048.md#L26`
  > Interaction to Next Paint of every route of TS-WEB-0003 D7 SHALL be < 200 ms

- **SRC-0007** — The adopted performance budget fixes FID < 100ms and names no INP at all.
  `community-calendar/docs/performance-budget.md#L10`
  > **FID** (First Input Delay) | < 100ms | Interactive elements respond fast

## Impact

Medium — the requirement is measured by a running Lighthouse gate, so the two never disagree in practice — but the source it cites does not contain the metric it names.

## Outcome

Taken: **NEW_VERSION**. Permitted for a value conflict: NEW_VERSION, REJECT_NEW.

**Open against no decision record.** The contradiction was found by the
locator run of DEC-0097 and has not been resolved; DP-04 is the owner's
at every impact level (POL-GRADED-BY-IMPACT).

## Blocks

NFR-WEB-0048

## Confidence

`certain` — the record itself names the collision.
