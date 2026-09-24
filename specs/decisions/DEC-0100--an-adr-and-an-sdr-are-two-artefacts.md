---
id: DEC-0100
title: An ADR and a STRICT decision record are two artefacts — both are kept, and the SDR starts at the next executed decision point
status: accepted
date: 2026-09-24
decided_by: jan-henrik.hempel
---

## Context

DEC-0085 §6, twelfth row:

> **Decision record shape** · `status: PROPOSED/EFFECTIVE/SUPERSEDED` · 84
> records say `status: accepted` in the organisation's ADR convention, and
> `DEC-###` is cited across repositories.

DEC-0086 §3 refused the identifier for a reason that is really a reason about
the artefact:

> STRICT's decision record is an `SDR-<yyyy>-<mmdd>-<nnnn>` taken at one of
> the numbered decision points `DP-01…DP-14`, immutable, with criteria, mode,
> executor and outcome. That is not what an entry in `specs/decisions/` is,
> and adopting the id would claim the shape.

This decision finishes that sentence with the contracts in hand. There are 99
`DEC-####` records and they are cited **3,113 times in 571 files** outside
the generated identifier map. The cost of converting them is therefore known
and large — and it is *not* the argument.

## Decision

### 1. They are two artefacts, and the contract says so field by field

`@leafcutter-strict/library-schemas`' `decision-record` contract does not
describe a document that explains a choice. It describes **the execution of
one decision point**:

| Field | What the contract says | Does an ADR have it |
| --- | --- | --- |
| `dp` | required, patterned `^DP-(0[1-9]\|1[0-4]\|P\d{2})$` | No — and most DECs are not any of the fourteen |
| `subject` | "One record decides one subject", with its version | No — a DEC often moves many artefacts at once |
| `criteria[]` | "Every criterion of the decision point […] **A criterion left out invalidates the record**" | No — an ADR's reasoning is the author's, not a fixed set |
| `outcome` | "From the decision point's **own** outcome set" | No — an ADR's outcome is prose |
| `mode`, `executor`, `accountable` | "From the policy row. `accountable` is copied, never chosen" | No |
| `bounds_evaluated` | each bound with the value it was tested against | No |
| `evidence_sufficiency` | "The subject's level at the time of the decision — the gate the mode had to clear" | No |
| `status` | `PROPOSED` / `EFFECTIVE` / `SUPERSEDED`, immutable, reversal by `supersedes` | No — `accepted`, and amended in place |

The test that settles it is the `dp` field. It is **required**, and its
pattern is **closed** at the fourteen decision points plus a policy's own.
Take three records at random:

- **DEC-0002**, "Next.js and Vercel are the website stack." Which decision
  point? Not goal and need acceptance, not classification, not requirement
  approval, not conflict resolution, not impact assignment, not version
  increment, not scope change, not tactical approval, not verification
  acceptance, not deprecation, not deferral, not glossary admission, not
  baseline release, not governance change. A stack choice is **none of the
  fourteen**, so it cannot be an SDR at all.
- **DEC-0093**, "The compounds are split." Seventy-one subjects in one record.
  "One record decides one subject" rules it out.
- **DEC-0079**, "The place search asks for a place name." It resolves a
  contradiction, so DP-04 fits — but its criteria are the argument the owner
  made, not DP-04's criterion set, and the record would be invalid the moment
  a criterion of DP-04 is missing.

The converse fails too, and it matters as much. An SDR of `DP-03` on one
requirement records that the mode was `HUMAN`, that bound 2 failed on an
`UNKNOWN` fit criterion, and that the subject stood at `S2` — and an ADR has
nowhere to put any of it. Neither artefact is a subset of the other.

So: **an ADR documents a choice and the reasoning behind it; an SDR documents
an executed decision point under the policy.** They answer different
questions, they are read by different people at different times, and the
contract's own field list is where that shows.

### 2. Both are kept, and neither is converted

`specs/decisions/` keeps its 99 `DEC-####` ADRs, unchanged, with
`status: accepted` and the organisation's three sections. They are the
project's reasoning and they are cited 3,113 times.

Converting them would mean inventing a decision point for each — which the
closed `dp` pattern makes a fabrication rather than a mapping — and inventing
a criteria set, which the contract says invalidates the record if it is
incomplete. `@leafcutter-strict/foundation-evidence-discipline`: *"A
fabricated value is a defect — and the worse kind, because it reads exactly
like a supported one."* Ninety-nine records' worth of fabricated decision
points would be exactly that.

**The cost, stated either way.** Wave 1's technique would have handled it
mechanically: a mapping file, a scripted rename over 3,113 citations in 571
files, `--verify` proving nothing was lost. The rename is the cheap part and
this repository has already done a larger one. What would not have been cheap
— and not possible — is the content: 99 decision points, 99 criteria sets,
99 executor modes and 99 evidence-sufficiency levels that nobody recorded at
the time and nobody can reconstruct now. The argument against converting is
that they are different artefacts. The cost merely agrees with it.

### 3. SDRs start now, at the next executed decision point

`specs/decisions/SDR-<yyyy>-<mmdd>-<nnnn>.yaml`, beside the ADRs, as
`@leafcutter-os/schemas` types the path. One YAML document under
`decision_record`. **Immutable once written**: a reversal is a new record
naming the old one in `supersedes`, never an edit.

**There are zero today, and that is the honest state rather than an
omission.** No decision point has been executed under `POL-GRADED-BY-IMPACT`
since it was bound: DEC-0089 measured that every artefact has a dependant, so
none reaches the low impact level, and nothing has moved off `DRAFT`. The
register's first row will be the first status move, and `check:specs` now
requires it to be — **E15 anchors a status off `DRAFT` on an SDR, not on an
ADR.** That is the whole practical consequence of this decision, and it
changes nothing today precisely because nothing has moved.

`check:specs` E23 validates any SDR that appears: the identifier against the
file name, the fields both contracts require, the status enum read from the
installed schema, a locator in DEC-0097's form on every piece of evidence, and
the contract's own rule that *"a record with any `UNKNOWN` criterion cannot
approve; it escalates."*

### 4. Two contracts, two disagreements, both recorded rather than resolved quietly

The two installed schemas that type an SDR do not agree, and writing the first
record would have meant failing one of them silently:

- **The identifier.** `@leafcutter-os/schemas` patterns
  `^SDR-\d{4}-\d{4}-\d{4}$`; `@leafcutter-strict/library-schemas@0.4.1`
  patterns `^SDR-\d{4}-\d{4}$` — year and day, **no sequence number**, so two
  decisions taken on one day would share an identifier. This repository takes
  the three-group form, because
  `@leafcutter-strict/method-identifier-and-locator-schema` requires an
  identifier to belong to one artefact: *"Never reuse, never renumber."*
  Recorded as **CONF-0023**, demanded as **DEM-0058**.
- **The executor mode.** `library-schemas` enumerates `HUMAN`,
  `AGENT_PROPOSE`, `AGENT_BOUNDED`, `AUTO`; `@leafcutter-os/schemas`
  enumerates `HUMAN` and `AGENT`. `POL-GRADED-BY-IMPACT` binds six decision
  points to `AGENT_BOUNDED`, which the narrower enum cannot express at all.
  This repository takes the four-value enum, which is the one the bound
  policy's own `modes:` frontmatter declares. Recorded as **CONF-0024**,
  demanded as **DEM-0059**.

Neither is this repository's to fix, and neither is left as a silent local
choice.

### 5. DEC-0085 §6's row, amended

The row is not "closed" and not "still owed". It is **answered**: the shape
was owed on the premise that the 99 records were the wrong shape, and they are
not — they are a different artefact, kept. What the row asked for exists as
`specs/decisions/SDR-*.yaml`, empty and gated.

## Consequences

- **99 ADRs stay exactly as they are**, and 3,113 citations keep resolving.
  No rename, no renumber, no `--verify` delta.
- **`specs/decisions/` now holds two artefact kinds.** An ADR is
  `DEC-####--<slug>.md`, an SDR is `SDR-<yyyy>-<mmdd>-<nnnn>.yaml`, and
  `check:specs` reads each by its own shape. The count line reports both.
- **E15's anchor moved from the ADR to the SDR.** Nothing is off `DRAFT`, so
  nothing fails today; the next artefact that moves needs a record of the
  decision point that moved it, and that is the gate wave 6 inherits.
- Two upstream disagreements are in the conflict register with a demand each.
- No requirement, criterion, source, count, pyramid figure, W3, W7 or W8 value
  moved.
