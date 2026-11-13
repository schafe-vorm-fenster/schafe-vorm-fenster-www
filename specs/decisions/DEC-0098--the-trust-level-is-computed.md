---
id: DEC-0098
title: A source's trust level is the minimum of its six-dimension vector — computed, and fifteen of eighteen were not
status: accepted
date: 2026-09-24
decided_by: jan-henrik.hempel
---

## Context

The source inventory has carried a `Trust` column and a rationale since the
cold start. DEC-0085 §6 recorded what was missing behind it:

> The inventory carries the derived trust level and a rationale; the vector
> behind it was never recorded. The trust **enum** is now the package's (E13).

`@leafcutter-strict/method-source-quality-rating` is explicit that the level
is not a judgement standing beside a vector but a function of one:

> Rate each dimension from 0 to 3. […] Then take the **minimum**, not the
> average: a source is as weak as its weakest dimension. Keep the full
> vector, because the vector says what to fix and the minimum does not.
>
> Map the minimum to a trust level: 3 on all is high, minimum 2 is medium,
> minimum 1 is low. A 0 on locatability or authority makes the source
> unusable as sole evidence.

The six dimensions are `locator_scheme`-adjacent in the contract too: the
`source-inventory` schema requires `quality` with all six keys, integers 0–3,
beside `trust` and `locator_scheme`. The repository had `trust` and neither
of the other two.

## Decision

### 1. All eighteen are scored, and `Trust` becomes the computed value

`specs/sources/source-inventory.md` gains a `## Quality vectors` table: the
locator scheme, the six dimensions, the minimum, the level the minimum
produces, and the level the inventory asserted before. The `Trust` column of
the register is now that computed level, and `check:specs` E20 recomputes it
from the vector on every run — a level and a vector that disagree is an
error, not a warning.

The scoring rule was written down before the sources were scored, so that it
is the same rule eighteen times:

- **Currency** is 3 where the source is dated and nothing later contradicts
  it, 2 where it is undated and uncontradicted, 1 where a contradicting
  source is newer, 0 where it is superseded outright.
- **Completeness** is 3 where nothing recorded in this repository says the
  source is missing something, 2 where something does, 1 where a *measured*
  share of what rests on it is absent.
- The other four are the method's own scale, applied literally.

Two dimensions were measured rather than judged, because DEC-0097 had just
measured them: locatability, from whether a position in the source can be
cited at all, and completeness for `SRC-0006`, from how many of the
requirements citing it the transcript actually carries.

### 2. Fifteen of eighteen levels do not survive the vector, and that is the finding

| Movement | Count | Sources |
| --- | --- | --- |
| high → medium | 9 | SRC-0001, SRC-0002, SRC-0008, SRC-0009, SRC-0011, SRC-0012, SRC-0013, SRC-0014, SRC-0015 |
| high → low | 3 | SRC-0003, SRC-0007, SRC-0016 |
| medium → low | 3 | SRC-0004, SRC-0005, SRC-0006 |
| unchanged | 3 | SRC-0010 (low), SRC-0017 (high), SRC-0018 (high) |

**No source changed.** The method's bar for `high` is 3 on all six
dimensions, and fifteen sources have at least one dimension below 3. The nine
that drop one notch drop almost entirely on completeness — each has a
`Q-####` row of this repository's own register saying what it is missing, and
the rating simply reads that row.

The six that land on `low` are the substantive ones, and each has a measured
reason:

- **`SRC-0003`, currency 1.** Line 35 says *"Contact and newsletter live in
  the footer"*; `CON-WEB-0061` forbids exactly that on DEC-0081's authority.
  Line 205 gives `/ueber-uns` *"Primary conversion: none of its own"*;
  `FUN-WEB-0017` gives it `request-product-briefing` on DEC-0081 §6's. Two
  decisions have overtaken a source nobody amended.
- **`SRC-0006`, three dimensions at 1.** Unlocatable by measurement (one
  line, no line terminators), incomplete by measurement (18 of the 64
  requirements citing it say something it does not), and vague by reading
  (*"vernünftige Umleitungen"*). Its authority is 3 — the speaker is the
  owner — which is exactly why the vector is worth more than the minimum:
  what is wrong with this source is not who said it.
- **`SRC-0007`, currency 1.** `performance-budget.md` line 10 carries
  `FID < 100ms`, superseded by INP in the Core Web Vitals themselves.
- **`SRC-0016`, locatability 1.** It is the one source not readable from this
  repository at all — a Google Doc id. No position in it can be cited here
  and no excerpt from it could be checked. No requirement rests on it today.
- **`SRC-0004` and `SRC-0005`, currency 1.** The v2.0 boards replaced the
  prototype's visual layer, and the inventory's own rationale for `SRC-0005`
  already said *"partly overtaken by events"*.

The one rating that is *better* than a naive reading would give is
`SRC-0010`'s currency, at 3 rather than 0. It is the superseded site, but the
claim it is registered for is its own URL inventory, and for that claim it is
the record rather than a superseded one. The method re-rates at the point of
use and says so.

### 3. What this costs, and what it does not

The rule the rating exists for, verbatim: *"An unlocatable or
unauthoritative source may corroborate other evidence. It may never be the
sole evidence for an artefact above draft status."*

Every requirement in this repository is `DRAFT` (DEC-0089), so **nothing has
to move today**. What the vectors do is put a price on moving, and the price
is concentrated: **64 requirements — the largest group in the repository —
rest on `SRC-0006`, which is now `low` with a defect on three of its six
dimensions**, and 29 rest on `SRC-0007`, which is `low` on currency.

Raising `SRC-0006` to `medium` needs a re-export of the transcript with line
breaks (locatability), the 18 unsupported statements re-sourced
(completeness), and its vague passages re-stated (specificity). Raising
`SRC-0003` and `SRC-0007` to `medium` needs one amendment each. None of that
is done here, because re-sourcing a requirement is a decision at its own
decision point, not a rating.

### 4. The defects the rating raises

The method's output includes *"a defect for every dimension rated 0 or 1"*.
Ten dimensions across seven sources qualify — one `unlocatable`, one
`unauthoritative`, four `stale`, one `incomplete`, one `vague` and two more —
and each becomes a row of the demand register.

## Consequences

- **All 18 sources carry a six-dimension vector, a locator scheme and a
  computed level.** `check:specs` E20 recomputes the level from the vector
  and fails on a mismatch, so the level cannot drift from its evidence again.
- **The `Trust` column changed on 15 of 18 rows and the old value is on the
  row beside it**, under `Was`. The change is the decision; the column is not
  quietly different from what it was.
- The register and the vector table are read separately by `check:specs` —
  E13 still validates the register's enum against the contract, E20 the
  vector — and every registered source must carry a vector.
- No requirement, criterion, count or pyramid figure moved.
