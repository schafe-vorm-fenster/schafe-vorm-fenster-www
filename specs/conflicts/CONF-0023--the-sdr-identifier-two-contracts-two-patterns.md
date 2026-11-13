---
artefact: conflict
id: CONF-0023
type: direct_contradiction
status: OPEN
impact: Medium
involved: ["@leafcutter-strict/library-schemas", "@leafcutter-os/schemas"]
decision_point: DP-04
recommended_action: NEW_VERSION
permitted_outcomes: [REJECT_NEW, NEW_VERSION, ISOLATE]
blocking_demands: [DEM-0058]
decision_record: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T18:30:00+02:00"
---

# CONF-0023

The STRICT decision record's identifier: two installed contracts pattern it two different ways, and an id cannot satisfy both

## Positions

- **@leafcutter-strict/library-schemas** — The identifier is two four-digit groups, so it carries the year and the day and no sequence number.
  `node_modules/@leafcutter-strict/library-schemas/contracts/schemas/decision-record.schema.json#L10`
  > "pattern": "^SDR-\\\\d{4}-\\\\d{4}$"

- **@leafcutter-os/schemas** — The identifier is three four-digit groups, year, day and a sequence within the day.
  `node_modules/.pnpm/@leafcutter-os+schemas@0.14.1/node_modules/@leafcutter-os/schemas/spec/sdr.schema.mjs#L10`
  > id: z.string().regex(/^SDR-\d{4}-\d{4}-\d{4}$/),

## Impact

Medium — no decision record exists yet, so nothing is invalid today; the first one written has to fail one of the two contracts.

## Outcome

Taken: **NEW_VERSION**. Permitted for a direct contradiction: REJECT_NEW, NEW_VERSION, ISOLATE.

**Open against no decision record.** DEC-0100 takes the three-group form for
this repository, because a two-group identifier cannot distinguish two
decisions taken on the same day and
`@leafcutter-strict/method-identifier-and-locator-schema` requires that an
identifier belong to one artefact: *"Never reuse, never renumber."* The
divergence itself is upstream's, and DEM-0058 asks for it.

## Blocks

Every `SDR-####-####-####` this repository writes

## Confidence

`certain` — both patterns are in installed files at pinned versions, and no id matches both.
