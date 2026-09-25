---
artefact: conflict
id: CONF-0015
type: direct_contradiction
status: RESOLVED
impact: High
involved: ["SRC-0014", "TS-WEB-0006"]
decision_point: DP-04
recommended_action: REJECT_NEW
permitted_outcomes: [REJECT_NEW, NEW_VERSION, ISOLATE]
blocking_demands: []
decision_record: DEC-0082
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T18:00:00+02:00"
---

# CONF-0015

The design guide gives two components a primary-treatment CTA while the spec allows exactly one primary per page

## Positions

- **SRC-0014** — The explain module and the contact section's first action row each carry a CTA at primary treatment.
  `specs/decisions/DEC-0082--one-primary-per-page-and-the-cta-ladder.md#L13`
  > by giving two components a CTA "at primary treatment" — the explain

- **TS-WEB-0006** — TS-WEB-0006 D3 and A2 allow exactly one data-cta="primary" per rendered page.
  `specs/decisions/DEC-0082--one-primary-per-page-and-the-cta-ladder.md#L16`
  > exactly one `data-cta="primary"` per rendered page.

## Impact

High — the arithmetic produces five primaries on /mitmachen, so the page-level rule and its acceptance criterion could not pass.

## Outcome

Taken: **REJECT_NEW**. Permitted for a direct contradiction: REJECT_NEW, NEW_VERSION, ISOLATE.

Resolved in DEC-0082, which is the record; this file is the conflict, not a
second copy of the decision.

**The correction DEC-0082 §2 demanded has landed** (confirmed 2026-09-25).
`SRC-0014` now reads *"Filled is a weight, not a conversion rank. The first row
is `data-cta="secondary"`"* for the contact section and *"One CTA … at
**secondary** treatment"* for the explain module, and
`specs/contracts/design-system-contract.md` makes both `secondary` by definition
rather than by configuration — *"neither may take `primary` as a prop value"*.
`TS-WEB-0006-A18` asserts it. `TS-WEB-0006`'s open point saying the correction
had not landed is closed.

## Blocks

FUN-WEB-0003, TS-WEB-0006, TS-WEB-0022, TS-WEB-0024

## Confidence

`certain` — the record itself names the collision.
