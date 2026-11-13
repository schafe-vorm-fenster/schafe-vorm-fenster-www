---
id: DEC-0092
title: A quality requirement is a measure — the 37 split, measured or reclassified, and not one number invented
status: accepted
date: 2026-09-24
decided_by: jan-henrik.hempel
---

## Context

DEC-0087 §3 reported the quality class as the finding of its wave:

> Q is a measure — `<scale>` of `<object>` SHALL be `<operator>` `<value>`
> `<unit>` measured by `<meter>` — and not one of the 41 quality requirements
> fits it. […] 41 rows claim to be quality requirements and most of them are
> not one, by the method's own definition.

Two things in that sentence need correcting before anything else. **The
number is 37, not 41.** `specs/requirements/quality/` held 37 documents on
the morning of this wave and `check:specs` W4 named 37 of them; the class
totals in DEC-0087 §3's table were transposed — its FUN row reads 43 / 96
where the truth was 43 / 100, and its NFR row reads 0 / 41 where the truth
was 0 / 37. The recast counts in that table are right and the denominators
are not. DEC-0087 is not edited: it is the record of what was decided on
2026-09-24, and this is the correction, in the place corrections go.

The second correction is about two of the three rows DEC-0087 named as
having *"no measure at all"*. One of them has one:
**`NFR-WEB-0022`** — "no new ad-hoc tracking is introduced with the
relaunch" — is measured today by `TS-WEB-0012-A9`, *"Exactly one analytics
loader in the rendered HTML […] no second analytics/tag/pixel vendor in
dependencies or markup."* It did not need reclassifying. It needed reading
against the tactical layer, which is where this repository keeps its
thresholds.

## Decision

The owner's instruction was to split and make measurable. Three operations,
kept distinct, applied to all 37.

### 1. Split — a statement carrying several measures becomes one requirement per measure

Eighteen of the 37 carried more than one predicate or more than one measure.
The method splits rather than rewrites: *"A statement joined by 'and' is
split, and the split is recorded so that the parts stay traceable to the same
passage."* Five more carried a measure and a rule that is not a measure, and
split the same way.

Every child inherits its parent's `area`, its `source` locator and its
evidence-sufficiency level, because the split changes the sentence and not
the evidence behind it. The parent identifier is retired into
`specs/traceability/identifier-map.md` with this record named as the retirer,
and every citation of it is re-pointed at its children.

**What counts as compound.** `method-statement-grammar` says *"One modal, one
predicate"* and nothing about lists. An enumeration that is the **object** of
one predicate is therefore not a compound: `NFR-WEB-0014`'s five browser
preference hints are the object of *honour*, and `NFR-WEB-0032`'s five
security headers are the object of *set*. Those were reclassified whole. A
statement with two verbs — inline **and** defer, self-host **and** declare
**and** preload — is a compound and was split. Where the Q form is involved
the test is sharper still, because the form *is* a measure: eight
`<scale>`/`<value>` pairs are eight measures however few verbs carry them.

### 2. Supply the measure — from the artefact that already enforces it

Five statements are single measures whose value this repository already
holds. The value was taken from the artefact that holds it and that artefact
named as the `<meter>`. **No number was invented**, and where no artefact
carries a value, none was written.

| Requirement | Measure | Meter, and where the value came from |
| --- | --- | --- |
| `NFR-WEB-0008` | image payload under `Save-Data` ≤ 70 % | `TS-WEB-0003-A6` — "≥ 30 % image bytes saved", threshold marked [PROPOSED] |
| `NFR-WEB-0016` | rendered font size ≥ 15 CSS px | `TS-WEB-0002-A10` — "no size below 15 px appears" |
| `NFR-WEB-0018` | touch target ≥ 44 × 44 CSS px | `TS-WEB-0002` D2 — the AAA 2.5.5 adoption, "≥ 44 × 44 CSS px for every target" |
| `NFR-WEB-0022` | analytics vendors = 1 | `TS-WEB-0012-A9` — "Exactly one analytics loader … no second vendor" |
| `NFR-WEB-0024` | persisted IP addresses = 0 | `TS-WEB-0013-A6` — "writes nothing, and no returned or cached key contains an IP address" |

The same rule supplied every split child's measure. The values behind the 27
new quality requirements come from four artefacts and no fifth:
`TS-WEB-0003` D1 (the performance budget adopted by DEC-0007),
`TS-WEB-0002` D2 (the AAA adoptions), `scripts/check-contrast.ts` (4.5 and 3,
in code) and `e2e/layout-stability.spec.ts` (`CLS_BUDGET = 0.1`, in code).

**Three of those meters run and the rest do not.** `scripts/check-contrast.ts`
runs in `pnpm check`; `e2e/layout-stability.spec.ts` and `e2e/a11y.spec.ts`
run in Playwright. The Lighthouse meter is a determination and an acceptance
criterion with no job behind it — there is no Lighthouse CI workflow in
`.github/workflows/`, and `TS-WEB-0003-A1` is one of the 181 criteria W3
counts as untested. That is recorded rather than smoothed over: a measure
whose meter does not run is still a measure, and the gap is the meter's.

### 3. Reclassify — a statement with no measure leaves the class

Nine statements name no measure and cannot be given one from anything this
repository holds. The method is explicit that the answer is not to invent
one: *"A quality requirement without a measure is not a quality requirement
yet."* Where the statement is not a measure **at all** — not a property of how
well something is done — it is not a quality requirement at any point in the
future either, and the classification tree says which class it belongs to.

Six of the nine answer question 2 — *"Is it imposed from outside the
project? — a constraint. A law, a policy, a contract, a platform decision
already taken."* — and became constraints. Three fell through to question 4
and became functional requirements.

**The number could be kept six times out of nine.** A reclassification moves
the type token and keeps the number, exactly as DEC-0087 moved `CON-WEB-0012`
to `BUS-WEB-0012`. That works only where the number is free in the target
class, and `FUN-WEB-0001`…`FUN-WEB-0056` are all occupied, so the three
statements that became functional requirements could not keep theirs:

| Was | Now | Number |
| --- | --- | --- |
| `NFR-WEB-0026` `NFR-WEB-0027` `NFR-WEB-0030` `NFR-WEB-0031` `NFR-WEB-0032` `NFR-WEB-0034` | `CON-WEB-` same number | kept — free in the constraint class |
| `NFR-WEB-0012` | `FUN-WEB-0128` | not kept — `FUN-WEB-0012` is the `/mitmachen` page row, `CON-WEB-0012` was retired by DEC-0087 |
| `NFR-WEB-0014` | `FUN-WEB-0129` | not kept — `FUN-WEB-0014` is the `/dein-kalender` page row |
| `NFR-WEB-0015` | `FUN-WEB-0130` | not kept — `FUN-WEB-0015` is the `/dein-kalender/bestellen` page row |

That is the method's own rule biting: *"Never reuse, never renumber. An
identifier handed to you belongs to the artefact that has it."* Keeping the
number where it is free costs nothing; forcing it where it is taken would
mean taking it off another artefact. The three that moved are registered in
the identifier map like every other retirement.

### 4. How a new number is allocated

`method-identifier-and-locator-schema`: *"the number is the next free one in
that combination"*. This repository has gaps — the numbers 0057 to 0059 and
0097 to 0099 in the functional family, 0008, 0009 and 0017 to 0019 in the
constraint family, 0029 in the quality family — and the identifier map shows
that none of them was ever assigned to anything. They are free by the letter
of the rule.

They are still not used. **A new artefact takes the next number above the
highest ever assigned in its prefix**, so `FUN` starts at `0107`, `NFR` at
`0039` and `CON` at `0024`. Monotonic allocation cannot reuse a number even
by accident, and the gaps are unexplained in the record — whatever produced
them is not written down anywhere, so filling them would be a guess dressed
as tidiness. A reclassification that keeps its number is not an allocation
and is not bound by this.

## The 37, one row each

| Requirement | Outcome | Now |
| --- | --- | --- |
| `NFR-WEB-0001` | split into 8 | `NFR-WEB-0039` · `NFR-WEB-0040` · `NFR-WEB-0041` · `NFR-WEB-0042` · `NFR-WEB-0043` · `NFR-WEB-0044` · `NFR-WEB-0045` · `NFR-WEB-0046` |
| `NFR-WEB-0002` | split into 5 | `NFR-WEB-0047` · `NFR-WEB-0048` · `NFR-WEB-0049` · `NFR-WEB-0050` · `NFR-WEB-0051` |
| `NFR-WEB-0003` | split into 5 | `NFR-WEB-0052` · `NFR-WEB-0053` · `NFR-WEB-0054` · `NFR-WEB-0055` · `NFR-WEB-0056` |
| `NFR-WEB-0004` | split into 2 | `FUN-WEB-0107` · `FUN-WEB-0108` |
| `NFR-WEB-0005` | split into 3 | `FUN-WEB-0109` · `FUN-WEB-0110` · `FUN-WEB-0111` |
| `NFR-WEB-0006` | split into 2 | `FUN-WEB-0112` · `FUN-WEB-0113` |
| `NFR-WEB-0007` | split into 2 | `FUN-WEB-0114` · `FUN-WEB-0115` |
| `NFR-WEB-0008` | measure supplied | `NFR-WEB-0008` |
| `NFR-WEB-0009` | split into 2 | `FUN-WEB-0116` · `FUN-WEB-0117` |
| `NFR-WEB-0010` | split into 2 | `NFR-WEB-0057` · `CON-WEB-0024` |
| `NFR-WEB-0011` | split into 3 | `NFR-WEB-0058` · `NFR-WEB-0059` · `CON-WEB-0025` |
| `NFR-WEB-0012` | reclassified, number not free | `FUN-WEB-0128` |
| `NFR-WEB-0013` | split into 3 | `FUN-WEB-0118` · `FUN-WEB-0119` · `FUN-WEB-0120` |
| `NFR-WEB-0014` | reclassified, number not free | `FUN-WEB-0129` |
| `NFR-WEB-0015` | reclassified, number not free | `FUN-WEB-0130` |
| `NFR-WEB-0016` | measure supplied | `NFR-WEB-0016` |
| `NFR-WEB-0017` | split into 2 | `NFR-WEB-0060` · `FUN-WEB-0121` |
| `NFR-WEB-0018` | measure supplied | `NFR-WEB-0018` |
| `NFR-WEB-0019` | split into 2 | `FUN-WEB-0122` · `FUN-WEB-0123` |
| `NFR-WEB-0020` | split into 2 | `NFR-WEB-0061` · `NFR-WEB-0062` |
| `NFR-WEB-0021` | split into 3 | `CON-WEB-0028` · `CON-WEB-0029` · `FUN-WEB-0124` |
| `NFR-WEB-0022` | measure supplied | `NFR-WEB-0022` |
| `NFR-WEB-0023` | split into 2 | `FUN-WEB-0125` · `CON-WEB-0033` |
| `NFR-WEB-0024` | measure supplied | `NFR-WEB-0024` |
| `NFR-WEB-0025` | split into 2 | `NFR-WEB-0063` · `FUN-WEB-0126` |
| `NFR-WEB-0026` | reclassified, number kept | `CON-WEB-0026` |
| `NFR-WEB-0027` | reclassified, number kept | `CON-WEB-0027` |
| `NFR-WEB-0028` | split into 4 | `CON-WEB-0035` · `CON-WEB-0036` · `CON-WEB-0037` · `NFR-WEB-0064` |
| `NFR-WEB-0030` | reclassified, number kept | `CON-WEB-0030` |
| `NFR-WEB-0031` | reclassified, number kept | `CON-WEB-0031` |
| `NFR-WEB-0032` | reclassified, number kept | `CON-WEB-0032` |
| `NFR-WEB-0033` | split into 2 | `FUN-WEB-0127` · `CON-WEB-0038` |
| `NFR-WEB-0034` | reclassified, number kept | `CON-WEB-0034` |
| `NFR-WEB-0035` | split into 2 | `CON-WEB-0039` · `NFR-WEB-0065` |
| `NFR-WEB-0036` | split into 2 | `CON-WEB-0040` · `CON-WEB-0041` |
| `NFR-WEB-0037` | split into 2 | `CON-WEB-0042` · `CON-WEB-0043` |
| `NFR-WEB-0038` | split into 2 | `CON-WEB-0044` · `CON-WEB-0045` |

## Consequences

- **37 quality requirements became 78 artefacts**: 32 quality requirements
  (5 with their measure supplied and their number kept, 27 new), 24
  functional requirements and 22 constraints. The requirement count rises
  from **155 to 196**, +41. Every one of those 41 is a measure or a predicate
  that was already in the repository, written down separately so that it can
  be decided, tested and versioned on its own.
- **`check:specs` W4 falls from 108/155 to 71/196.** The whole quality class
  is in its slot form; what remains outside it is 57 functional requirements
  and 14 constraints, which is the next wave.
- **No acceptance criterion was stranded.** Each child inherits the
  parent's Coverage row, its acceptance-criterion references and its gloss,
  rewritten to describe the child. W3 is unchanged at 181/420 and W2 is still
  empty: every one of the 196 requirements is covered by a tactical
  specification and discharged by at least one criterion.
- **32 identifiers were retired** and registered in the identifier map with
  this record named as the retirer. Every citation outside a decision record
  was re-pointed: 24 files in `specs/`, plus `src/lib/security/csp.ts`,
  `src/lib/live/bff.ts`, `src/lib/live/bff-places-search.integration.test.ts`,
  `src/lib/personalization/entry-context.ts` and `e2e/privacy.spec.ts`. The
  decision records keep their old citations, because a record says what was
  true when it was written and `check:specs` E5 resolves a retired identifier
  there and nowhere else.
- **Two corrections to DEC-0087 §3** are recorded above rather than made in
  place: the class denominators, and `NFR-WEB-0022`, which had a measure all
  along.
- **The Lighthouse meter still does not run.** Eight of the 27 new quality
  requirements name `TS-WEB-0003-A1` as their meter, and nothing in
  `.github/workflows/` executes it. `TS-WEB-0003` D7 and `TS-WEB-0015-A9`
  both specify the job. Until it exists, those eight are measured by a
  criterion rather than by a run, which W3 already counts.
