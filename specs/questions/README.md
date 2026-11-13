# Questions

## Purpose

The open-question register. STRICT: a value the sources do not support is
`UNKNOWN` plus the question that resolves it — never a plausible guess.
Every `Q-####` names an addressee; an answered question becomes a `DEC-####`
or flows into the requirement it blocked.

## How it relates to the demand and conflict registers

Both registers were created by DEC-0099 and neither replaces this one.

- A `Q-####` row is the **conversation**: it is amended as the answer narrows,
  it carries what was asked, measured and re-scoped, and it is where a
  resolution is recorded. That is why several rows are three times their
  original length.
- A `DEM-####` row in `specs/demands/demand-register.md` is the **request** in
  the shape `@leafcutter-strict/method-demand-recording` types it: one defect
  type from the eleven, one addressee, one concrete thing required, one answer
  format. 42 of the 57 demands name a `Q-####` row in `Raised by` and copy
  nothing from it.
- A `CONF-####` record in `specs/conflicts/` holds a **contradiction** rather
  than an open question. Three rows here turned out to be that rather than a
  demand: Q-0052, Q-0053 and Q-0058.

The registers are not merged, and the questions are not renumbered. A `Q-####`
identifier is cited across this repository and DEC-0086's rule holds: never
reuse, never renumber.

## Contents

- `open-questions.md` — the register
- `demand-acceptance-test-verification-level.md` — the handover document for
  Q-0074, addressed to the `@leafcutter-strict/library-schemas` maintainer.
  A demand that leaves the project is written so it can be handed over as it
  stands: the contract, the conflict and the proposed change, and nothing of
  this project in it (DEC-0090 §4)
