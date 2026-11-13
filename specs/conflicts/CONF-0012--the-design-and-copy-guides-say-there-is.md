---
artefact: conflict
id: CONF-0012
type: direct_contradiction
status: RESOLVED
impact: High
involved: ["SRC-0014", "TS-WEB-0016-A2"]
decision_point: DP-04
recommended_action: NEW_VERSION
permitted_outcomes: [REJECT_NEW, NEW_VERSION, ISOLATE]
blocking_demands: []
decision_record: DEC-0081
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T18:00:00+02:00"
---

# CONF-0012

The design and copy guides say there is no contact form; three spec statements required one in the footer

## Positions

- **SRC-0014** — One contact section exists for the whole site and there is no contact form.
  `specs/decisions/DEC-0081--contact-section-replaces-the-contact-form.md#L16`
  > that **there is no contact form**.

- **TS-WEB-0016-A2** — The footer renders an envoy mount point for the contact form, which FUN-WEB-0090 and TS-WEB-0016 D1 also require.
  `specs/decisions/DEC-0081--contact-section-replaces-the-contact-form.md#L19`
  > asserted that the footer renders an envoy mount point for it.

## Impact

High — an acceptance criterion asserted a surface the guides forbid, and the contact route of the whole site hung on it.

## Outcome

Taken: **NEW_VERSION**. Permitted for a direct contradiction: REJECT_NEW, NEW_VERSION, ISOLATE.

Resolved in DEC-0081, which is the record; this file is the conflict, not a
second copy of the decision.

## Blocks

FUN-WEB-0090, FUN-WEB-0021, FUN-WEB-0017, FUN-WEB-0093, TS-WEB-0016, TS-WEB-0027

## Confidence

`certain` — the record itself names the collision.
