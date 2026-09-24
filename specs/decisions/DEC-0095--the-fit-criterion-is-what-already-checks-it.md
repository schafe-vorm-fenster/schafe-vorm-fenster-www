---
id: DEC-0095
title: The fit criterion is what already checks the requirement — and UNKNOWN where nothing does
status: accepted
date: 2026-09-24
decided_by: jan-henrik.hempel
---

## Context

`fit_criterion` is in the `required` array of the `requirement-shell`
contract, and until this wave no requirement in this repository carried one.
DEC-0088 made the gap expensive rather than merely untidy: bound 2 of
`POL-GRADED-BY-IMPACT` is *"No unknown criterion, where the subject has a fit
criterion"*, so an agent row cannot be reached without one, and nothing could
even be evaluated while the field was absent rather than `UNKNOWN`.

The contract types it as a `oneOf`:

```json
"fit_criterion": { "oneOf": [
  { "const": "UNKNOWN" },
  { "properties": { "scale": {}, "operator": {}, "value": {}, "unit": {}, "meter": {} },
    "required": ["scale", "operator", "value", "meter"],
    "additionalProperties": false } ] }
```

and glosses it: *"Scale, operator, value, unit and meter — or `UNKNOWN`,
which is expected until a measure arrives."*
`@leafcutter-strict/method-statement-grammar` gives the same shape as its FC
form — `<scale>` `<operator>` `<value>` `<unit>`, measured by `<meter>` — so
there is nothing to invent about the shape. The only question is what fills
it.

## Decision

### 1. What verifies a requirement is its fit criterion, written down

This repository has had fit criteria since the cold start and called them
something else. A requirement is covered by a tactical specification, the
specification discharges it with named acceptance criteria, and a test
references the criterion by its identifier. That chain is a scale, an
operator, a value and a meter; it was simply never written into the field the
contract names.

So the fit criterion is filled from the chain, two ways:

- **A quality requirement's own statement is already a measure.** Since
  DEC-0092 every `NFR` is in the Q form, which *is* the FC form. Its `scale`,
  `operator`, `value` and `unit` are parsed out of the statement, and its
  `meter` is the meter the statement names plus the acceptance criteria a test
  actually runs. **8 requirements.**
- **Everything else is measured by its criteria passing.** `scale` is
  "acceptance criteria of `<id>` that pass", `operator` is `=`, `value` is how
  many criteria the requirement has, `unit` is `criteria`, and `meter` names
  them with how many of them a test references. **165 requirements.**

### 2. `UNKNOWN` where nothing checks it, and that is most of the gap

Where **no** acceptance criterion of a requirement is referenced by a test,
nothing verifies it, and the field is `UNKNOWN`. That is the contract's own
value for the case and the foundation's rule behind it —
`@leafcutter-strict/foundation-evidence-discipline`: *"Where the input does
not support a value, write `UNKNOWN`. […] A fabricated value is a defect — and
the worse kind, because it reads exactly like a supported one."* Writing
"acceptance criteria that pass = 4" for four criteria nobody runs would be
exactly that defect.

**100 of 273 requirements carry `UNKNOWN`**: 38 functional, 35 constraints, 24
quality, 3 business rules. Every one of them is a requirement whose criteria
are among the 181 that W3 has been counting all along. The two burn-downs are
the same burn-down seen from two ends, and W7 now says so in the run output.

The question each `UNKNOWN` carries, as the foundation requires, is the same
one: **which test references an acceptance criterion of this requirement?** It
is answered by writing that test, not by editing this field.

Of the 13 requirements at evidence level S1, 6 carry `UNKNOWN` and 7 carry a
measure — evidence sufficiency and verification are different axes, and this
is the first run in which the repository can see that they are.

### 3. One meter may live in another specification, and the Coverage table cannot say so

`NFR-WEB-0049` — Cumulative Layout Shift < 0.1 — is implemented by
`TS-WEB-0003`, whose Coverage row gives it `A1` and `A7`, neither of which a
test references. Its real meter is `e2e/layout-stability.spec.ts`, which runs
against `TS-WEB-0009-A8`, a criterion of a different specification.

`check:specs` E9 requires a Coverage row to cite criteria of its own
specification, so the Coverage table structurally cannot record that. The fill
therefore takes the union of two sets: the criteria the Coverage row gives a
requirement, and any criterion its **statement's own meter names**. Without
that, a requirement measured by a running test would read `UNKNOWN` because
the meter sits one specification away.

### 4. What the count under-reports, named rather than patched

The test-reference scan is E10's, unchanged: `src/**/*.test.ts(x)`,
`e2e/**/*.spec.ts(x)` and `specs/verification/journeys/**/*.feature`. It does
**not** include `scripts/`, and three real meters live there —
`scripts/check-contrast.ts`, `scripts/check-csp.ts` and
`scripts/check-seo-budget.ts` — each with its own test file beside it, each
running inside `pnpm check` on every commit. A requirement measured only by
one of those reads `UNKNOWN` here although something does check it.

The scan set was deliberately **not** widened in this wave. Widening it would
have moved W3 in the same run that moved the requirement count, and then
neither number would have been comparable with wave 3's close. It is the first
item of wave 5, and it can only improve both figures.

## Consequences

- **All 273 requirements carry `fit_criterion`**: 173 a measure, 100
  `UNKNOWN`. The field the contract has required since the cold start is
  populated for the first time.
- **`check:specs` gains E18 and W7.** E18 validates the shape against the
  contract's `oneOf` — the four required keys, no fifth key outside the
  contract's five, or the literal `UNKNOWN`. W7 reports the fill rate and
  names the policy bound it feeds.
- **Bound 2 of `POL-GRADED-BY-IMPACT` is now evaluable.** It was not before,
  because an absent field is not an `UNKNOWN` one. For 100 requirements it
  fails and escalates, which is the bound working; for 173 it passes, and they
  are stopped by bound 3 instead — no artefact reaches the low impact level,
  and the prompt identity in `ai_provenance` is still `UNKNOWN` (DEC-0091).
- **W3 and W7 are two views of one gap.** 181 untested criteria, 100
  requirements with no tested criterion. Writing a test moves both.
