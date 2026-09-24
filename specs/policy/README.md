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

## Changing it

A change to this document is DP-14, governance change, and DP-14 is the
owner's at every impact level in all three reference profiles and in this one.
An executor never changes the policy that binds it.
