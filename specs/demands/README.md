# Demands

## Purpose

The demand register. `@leafcutter-strict/method-demand-recording`:

> A demand is a formal request for input the method needs and does not have.
> It is the mechanism by which the method improves its input instead of
> compensating for it.

and, on what a demand is not: *"'More detail' is not a demand."* · *"A demand
addressed to nobody is a note."*

Each row carries a defect type from
`@leafcutter-strict/method-defect-taxonomy`'s eleven — the type fixes what the
defect blocks and what to ask for — plus the addressee, the concrete request,
the answer format, what it blocks, why, and the status. `check:specs` E22
validates the defect type, the status, and that neither the addressee nor the
request is empty.

## Contents

- `demand-register.md` — the register, 57 rows

## How it relates to the question register

`specs/questions/open-questions.md` came first and stays. The relation is not
duplication:

- **A `Q-####` row is the conversation**: it is amended as the answer narrows,
  it carries the history of what was asked, measured and re-scoped, and several
  rows record a resolution that produced a `DEC-####`.
- **A `DEM-####` row is the request**, in the shape the method types it: one
  defect type, one addressee, one concrete thing required, one answer format.
  Where a demand comes out of the register, `Raised by` names the `Q-####` row
  and the row is not copied.

42 of the 57 demands are that cross-reference — the question register read
against the defect taxonomy. **15 are new**, and none of them could have come
from the question register, because they were found by this wave: nine are the
source-quality dimensions rated 0 or 1 (DEC-0098), six are the locator run's
defects (DEC-0097).

Three rows of the question register turned out to be **conflicts** rather than
demands — Q-0052, Q-0053 and Q-0058 — and they belong in `specs/conflicts/`
where two of them now are.

## How a demand closes

Two ways, and no third:

- **Answered** — an answer registered as a source, with its own locator and
  quality rating.
- **Waived** — decided at the blocked artefact's decision point, by the
  accountable role, with the reason recorded. *"A waived demand is a decision
  to proceed on thin evidence. That is often the right call. It is never a call
  that should be invisible afterwards."*

One row is `WAIVED` today: `DEM-0008`, the pre-relaunch site's missing
authority, waived because the only claims it is used for are facts about
itself.

It does **not** close because time passed, because somebody said it was fine,
or because the artefact was approved anyway.
