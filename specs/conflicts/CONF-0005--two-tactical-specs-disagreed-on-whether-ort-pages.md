---
artefact: conflict
id: CONF-0005
type: direct_contradiction
status: RESOLVED
impact: Medium
involved: ["TS-WEB-0011", "TS-WEB-0008"]
decision_point: DP-04
recommended_action: REJECT_NEW
permitted_outcomes: [REJECT_NEW, NEW_VERSION, ISOLATE]
blocking_demands: []
decision_record: DEC-0057
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T18:00:00+02:00"
---

# CONF-0005

Two tactical specs disagreed on whether ?ort= pages are indexable

## Positions

- **TS-WEB-0011** — TS-WEB-0011 D9 makes ?ort= pages indexable with a canonical pointing at the parameter-free path.
  `specs/decisions/DEC-0057--place-parameter-pages-are-indexable.md#L11`
  > Two specs disagreed, and three page specs had to pick one: TS-WEB-0011 D9 makes

- **TS-WEB-0008** — TS-WEB-0008 D7 proposed noindex, follow for the same pages.
  `specs/decisions/DEC-0057--place-parameter-pages-are-indexable.md#L13`
  > path; TS-WEB-0008 D7 proposed `noindex, follow`.

## Impact

Medium — three page specs had to pick one of the two before their indexing criteria could be written.

## Outcome

Taken: **REJECT_NEW**. Permitted for a direct contradiction: REJECT_NEW, NEW_VERSION, ISOLATE.

Resolved in DEC-0057, which is the record; this file is the conflict, not a
second copy of the decision.

## Blocks

TS-WEB-0020, TS-WEB-0021, TS-WEB-0025

## Confidence

`certain` — the record itself names the collision.
