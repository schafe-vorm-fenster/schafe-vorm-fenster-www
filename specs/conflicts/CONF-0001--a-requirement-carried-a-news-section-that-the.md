---
artefact: conflict
id: CONF-0001
type: direct_contradiction
status: RESOLVED
impact: Medium
involved: ["FUN-WEB-0086", "SRC-0003"]
decision_point: DP-04
recommended_action: NEW_VERSION
permitted_outcomes: [REJECT_NEW, NEW_VERSION, ISOLATE]
blocking_demands: []
decision_record: DEC-0022
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T18:00:00+02:00"
---

# CONF-0001

A requirement carried a news section that the authoritative information architecture has no page for

## Positions

- **FUN-WEB-0086** — FUN-WEB-0086 required a news section built from published posts, with no target page.
  `specs/decisions/DEC-0022--ia-is-authoritative-no-news.md#L13`
  > FUN-WEB-0086 still carried a "news section from

- **SRC-0003** — The new information architecture defines eight pages and no news page.
  `specs/decisions/DEC-0022--ia-is-authoritative-no-news.md#L13`
  > eight pages and no news page.

## Impact

Medium — a requirement demanded a surface the IA does not contain, inherited from the archived Strukturplan.

## Outcome

Taken: **NEW_VERSION**. Permitted for a direct contradiction: REJECT_NEW, NEW_VERSION, ISOLATE.

Resolved in DEC-0022, which is the record; this file is the conflict, not a
second copy of the decision.

## Blocks

FUN-WEB-0086

## Confidence

`inferred` — the two sides were reconstructed from the record rather than named in it.
