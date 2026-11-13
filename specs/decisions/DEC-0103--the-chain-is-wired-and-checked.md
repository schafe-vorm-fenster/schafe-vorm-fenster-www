---
id: DEC-0103
title: The chain is wired and checked — 222 of 273 requirements answer to a need, and the 51 that do not say why
status: accepted
date: 2026-09-24
decided_by: jan-henrik.hempel
---

## Context

DEC-0101 built the goal layer and DEC-0102 the need layer. Neither is worth
anything until the requirements point at it and something counts the result.
`method-chain-linkage` is explicit about the division: *"The counting is
deterministic and belongs to the validator. This method covers what the
numbers do not say: which missing link is a defect in the artefact, which is a
defect in the source, and which means the need was never real."*

## Decision

### 1. Every requirement carries `needs[]`

All 273. **222 name at least one need; 51 carry `[UNKNOWN]`.** The value is
the one the requirement shell already uses wherever the input does not support
a field, and W9 counts it rather than letting it look like a link.

Not one need was written to make a requirement resolve. That was the rule of
the wave and it is what the 51 cost.

### 2. What the 51 have in common, and why it is not a mapping failure

| Area | Orphans | Why |
| --- | --- | --- |
| content-pipeline | 22 | The pipeline exists so that the website can carry hub-sourced, per-language text without copying it (DEC-0020). That is the **operator's** need. The SSD lists six stakeholders and all six are audiences |
| localization | 13 | The domain, locale and hreflang layer serves the expansion recorded in the business goal `proven-outside-home-regions`. No audience states a need for a Polish, Austrian or international surface, and the hub's own `contributes_to` puts no conversion goal under that goal either |
| technical-constraints | 12 | Next.js, Vercel, TypeScript, pnpm, one icon set, the brand kit. A build-side mandate, again the operator's |
| delivery-pipeline | 4 | Branch, pipeline, rolling deployment, deployment protection. The operator's |

Three of the four are one finding: **the specification document names no
supply-side stakeholder.** That is not repaired here. Adding a stakeholder to
the SSD is a change to the specification document — DP-07 — and writing a need
for a stakeholder nobody listed would be the invention this wave exists to
avoid. It is raised as DEM-0063.

The fourth, localization, is the same shape one level up: a goal with nothing
below it (§4).

### 3. Three checks and one report, and none of them stricter than the method

`check:specs` gains exactly what `method-chain-linkage` steps 1, 3 and 4
describe, and nothing beyond it.

- **E24** — *"Every requirement names at least one need"*. The field is
  `required` with `minItems: 1` in the requirement shell; each entry is an
  existing `NEED-WEB-####` or `UNKNOWN`.
- **E25** — *"every need names at least one goal and one stakeholder listed in
  the specification"*. The stakeholder list is read out of the specification
  document's own `stakeholders[]` and nowhere else; the field was added to the
  SSD frontmatter in this change, carrying exactly the six names its
  `## Stakeholders` section already gave. The need's shape is checked against
  `@leafcutter-os/schemas`' `needSchema` field list.
- **E26** — *"every goal falls inside scope"*. The goal names the
  specification document, that document exists, and `contributes_to` resolves
  to a goal that exists and is not itself.
- **W9** — the linkage report: the five findings of the method's table, each
  with the repair the method names, and coverage *"as a fraction with its
  numerator and denominator — never as a bare percentage"*. The fifth finding,
  the unverified requirement, is **not** counted twice: W7 already counts the
  requirements with no test below their fit criterion, and W9 points at it.

The two identifier patterns and the two field lists come out of
`@leafcutter-os/schemas`' `goal.schema.mjs` and `need.schema.mjs` rather than
being spelled in the script. The module is ESM-only and this script runs as
CommonJS, so it is read as text; a shape that stops matching fails the check
loudly instead of passing unnoticed. That is the same posture DEC-0085 §4 took
for the JSON contracts.

### 4. The report, both directions

| Finding | Today | The method's repair |
| --- | --- | --- |
| orphan requirement | 51/273 | find the need, or withdraw the requirement |
| orphan need | 0/34 | — |
| uncovered need | 6/34 | the need is unimplemented — or unnoticed |
| uncovered goal | 1/13 | the goal is aspiration, not work |
| unverified requirement | 93/273 (W7) | verification gap |

**The six uncovered needs are one finding, not six.** NEED-WEB-0031,
NEED-WEB-0033 and NEED-WEB-0034 are three of the four things a company needs
to know, and SRC-0003's own open points say why nothing serves them:
*"Companies (local advertising) have no page while the offering is
`withheld`."* NEED-WEB-0012 (what publishing costs an actor in time, and what
comes back in attendance) and NEED-WEB-0023 / NEED-WEB-0028 (supporting many
local actors without quality loss) are three arguments the website does not
currently make. The method's word for that is *"unimplemented — or
unnoticed"*, and this is the first artefact in the repository able to tell the
difference.

**The one uncovered goal is GOAL-WEB-0002, `proven-outside-home-regions`.** No
need names it and no goal contributes to it — and that is the hub's own
record, not a gap in this wiring: every one of the eleven conversion goals
carries `contributes_to` up to `recurring-licence-revenue`. A goal that the
SSD names as carried by this website, that thirteen localization requirements
work for, and that no audience need and no countable action pays into, is
exactly the method's *"aspiration, not work"*. It is reported, not repaired:
repairing it means either a conversion goal in the hub or a scope decision,
and both are somebody else's.

### 5. Goal coverage walks `contributes_to`

A goal counts as covered when a need names it **or** when a goal that
contributes to it is covered. Without that, `recurring-licence-revenue` would
be reported uncovered while eleven conversion goals pay into it, which would
be a false finding. The parent chain is the hub's own and is read rather than
invented (DEC-0101 §3).

## Consequences

- `check:specs` runs E1–E26 and reports W1–W9. No existing check changed.
- `specs/traceability/rtm.md` gains the chain layer: the needs each area's
  requirements name, and the report snapshot.
- DEM-0063 is open: the specification lists no supply-side stakeholder, and 38
  of the 51 orphans are that one gap.
- **DP-01 has a docket.** Goal and need acceptance was a decision point with
  no subject until today; §6 below says what it can and cannot do with one.
- Nothing moved off `DRAFT`. E15 is unchanged and still refuses a status move
  that no SDR anchors, and there are none.

### 6. What DP-01 can do now, and what it still cannot

`POL-GRADED-BY-IMPACT` binds DP-01 Goal and need acceptance to `HUMAN` at
every impact level, accountable `@domain-requirements-engineer`. DEC-0089
resolved it against an empty set, because there was no goal and no need in the
repository.

There are now 47 subjects — 13 goals and 34 needs — and three things are true
of them that were not true of anything before:

1. **The evidence gate is met on every one.** `method-decision-policy-
   resolution`: *"Below S2 no acceptance or approval decision may be taken at
   all."* All 47 are S2, and S2 is derived rather than asserted — the deciding
   fields are the cited line, and both deciding sources are trust `medium`
   (DEC-0098). This is the first layer in the repository where the gate is met
   by every artefact rather than by 260 of 273.
2. **It stays `HUMAN` anyway, and not because of the impact count.** DP-01 is
   `HUMAN` in all four columns of the policy — the owner bound it that way in
   DEC-0088, before any subject existed. No dependant count and no evidence
   level changes that. An agent cannot accept a goal or a need here at any
   impact level, which is why nothing in this wave moved off `DRAFT`.
3. **The decision it would take is now a real one.** Accepting NEED-WEB-0012
   is accepting that the website should make an argument it does not make;
   accepting GOAL-WEB-0002 is accepting a goal nothing pays into. Those are
   decisions with consequences, which is what a decision point is for. Before
   this wave DP-01 could only have been exercised on nothing.

What it still cannot do: set `priority`. `needSchema` requires the field, no
source ranks the needs, and DEM-0062 asks the accountable role for the
ranking. An acceptance that left `priority` at `UNKNOWN` on all 34 would trip
bound 2 of the policy if this were an agent row, and it is not one — so the
owner may accept with the field unknown, and the record has to say so.

This record does **not** amend the policy. Changing `POL-GRADED-BY-IMPACT` is
DP-14, governance change, and that is never an agent's.
