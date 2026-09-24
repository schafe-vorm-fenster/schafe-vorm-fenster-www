---
artefact: conflict
id: CONF-0017
type: direct_contradiction
status: RESOLVED
impact: High
involved: ["DEC-0036", "SRC-0017"]
decision_point: DP-04
recommended_action: NEW_VERSION
permitted_outcomes: [REJECT_NEW, NEW_VERSION, ISOLATE]
blocking_demands: []
decision_record: DEC-0083
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T18:00:00+02:00"
---

# CONF-0017

A spec demanded the /ueber-uns headline word for word while the copy guide put that same string on a build-failing avoid list

## Positions

- **DEC-0036** — DEC-0036 §3 fixed the /ueber-uns headline word for word and TS-WEB-0027-A3 asserted that exact string in an e2e criterion.
  `specs/decisions/DEC-0083--no-verbatim-copy-in-a-spec.md#L11`
  > `DEC-0036` §3 fixed the `/ueber-uns` headline word for word

- **SRC-0017** — CG-033 puts the sentence on a build-failing avoid list because the review rejected it as untrue.
  `specs/decisions/DEC-0083--no-verbatim-copy-in-a-spec.md#L14`
  > SRC-0017 CG-033 now puts it on a build-failing avoid

## Impact

High — a spec and a guide demanded and forbade the same string, so a passing build was impossible.

## Outcome

Taken: **NEW_VERSION**. Permitted for a direct contradiction: REJECT_NEW, NEW_VERSION, ISOLATE.

Resolved in DEC-0083, which is the record; this file is the conflict, not a
second copy of the decision.

## Blocks

TS-WEB-0027

## Confidence

`certain` — the record itself names the collision.
