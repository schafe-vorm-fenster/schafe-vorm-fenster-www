# Policy

## Purpose

The decision policy in force for this specification: which mode, executor,
bounds and accountable role apply at each pair of decision point and impact
level. It is the artefact that says whether an agent may decide.

`@leafcutter-strict/library-schemas` ships three reference profiles —
conservative, assisted, delegated — and selects none of them, on purpose:
*"How much authority an agent holds is a decision, and it should not arrive as
an install default."* A project copies one, adapts it, and keeps the copy in
its own specification under its own identifier. This directory is that place.

## Contents

- `graded-by-impact.decision-policy.md` — `POL-GRADED-BY-IMPACT`, adopted by
  DEC-0088. An agent may decide at low impact inside four bounds and with a
  record; from medium upward the decision is the owner's, and so is every
  decision point the impact method leaves undefined.

## What binds a status

Nothing else. A status moves at the decision point this policy names and
nowhere else (`@leafcutter-strict/foundation-draft-only-output`), and
`pnpm check:specs` E15 enforces it: with no policy here, `DRAFT` is the only
status anything may carry; with one, a status other than `DRAFT` needs a
decision record that names the artefact. W5 reports, per decision point, what
the policy would resolve today and what escalates instead.

## DP-01 has a docket since 2026-09-24

Goal and need acceptance was bound in DEC-0088 and resolved in DEC-0089
against an empty set: there was no goal and no need in this repository, so the
row had nothing to be exercised on. DEC-0101 and DEC-0102 gave it 47 subjects
— 13 `GOAL-WEB-####` and 34 `NEED-WEB-####` — and three things follow.

- **The evidence gate is met on every one.** *"Below S2 no acceptance or
  approval decision may be taken at all"*, and all 47 are S2, derived rather
  than asserted. This is the first layer here where the gate is met by every
  artefact rather than by most of them.
- **It is `HUMAN` anyway, and not because of an impact count.** The owner
  bound DP-01 to `HUMAN` in all four columns before any subject existed. No
  dependant count and no evidence level moves that, which is why the chain
  wave moved nothing off `DRAFT`.
- **`priority` is the one field an acceptance cannot settle from the
  sources.** `needSchema` requires it, nothing ranks the needs, and DEM-0062
  asks the accountable role for the ranking. An owner may accept with the
  field `UNKNOWN`; the record has to say so.

DEC-0103 §6 is the full reading. This section describes the policy; it does
not change it.

## Changing it

A change to this document is DP-14, governance change, and DP-14 is the
owner's at every impact level in all three reference profiles and in this one.
An executor never changes the policy that binds it.
