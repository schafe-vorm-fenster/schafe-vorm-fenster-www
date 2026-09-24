---
artefact: conflict
id: CONF-0024
type: value_conflict
status: OPEN
impact: Medium
involved: ["@leafcutter-strict/library-schemas", "@leafcutter-os/schemas"]
decision_point: DP-04
recommended_action: NEW_VERSION
permitted_outcomes: [NEW_VERSION, REJECT_NEW, ISOLATE]
blocking_demands: [DEM-0059]
decision_record: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T18:30:00+02:00"
---

# CONF-0024

The executor mode of a decision record: one contract knows four modes, the other two, and the policy in force uses one the narrower does not have

## Positions

- **@leafcutter-strict/library-schemas** — Four modes, including the bounded agent row the decision policies are written in.
  `node_modules/@leafcutter-strict/library-schemas/contracts/schemas/decision-record.schema.json#L44`
  > "AGENT_BOUNDED",

- **@leafcutter-os/schemas** — Two modes, and `AGENT_BOUNDED` is not one of them.
  `node_modules/.pnpm/@leafcutter-os+schemas@0.14.1/node_modules/@leafcutter-os/schemas/spec/sdr.schema.mjs#L15`
  > mode: z.enum(['HUMAN', 'AGENT']),

## Impact

Medium — `POL-GRADED-BY-IMPACT` binds six decision points to `AGENT_BOUNDED` at low impact, and a record of one of those decisions cannot be written in the narrower enum.

## Outcome

Taken: **NEW_VERSION**. Permitted for a value conflict: NEW_VERSION, REJECT_NEW, ISOLATE.

**Open against no decision record.** DEC-0100 takes the four-value enum,
because it is the one the bound policy's own `modes:` frontmatter declares
and the one `check:specs` E15 already validates every policy row against.

## Blocks

Every `SDR` recording a decision taken on an `AGENT_BOUNDED` row

## Confidence

`certain` — both enums are in installed files at pinned versions, and `AGENT_BOUNDED` is in one and not the other.
