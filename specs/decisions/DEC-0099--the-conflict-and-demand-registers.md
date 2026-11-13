---
id: DEC-0099
title: The conflict and demand registers exist, populated from what already happened — 22 conflicts and 57 demands, none invented
status: accepted
date: 2026-09-24
decided_by: jan-henrik.hempel
---

## Context

DEC-0085 §6, eleventh row:

> **Conflict and defect registers** · conflict record, defect record ⇒ demand
> · Contradictions are resolved inside `DEC-###` and defects surface as
> `Q-###` rows. Both work; neither carries the taxonomy.

"Both work" was true and is the reason this was owed rather than urgent. What
neither carries is the classification, and the classification is the point of
both methods:

- `@leafcutter-strict/method-conflict-taxonomy`: *"A conflict record is worth
  more than a note saying two things disagree, because the type of the
  disagreement decides how it can be resolved."*
- `@leafcutter-strict/method-defect-taxonomy`: *"A defect that is merely
  noticed becomes a workaround. A defect that is named becomes a demand with
  an addressee."*

`DP-04` is the other reason. `POL-GRADED-BY-IMPACT` binds conflict resolution
to the owner at every impact level, and gave two reasons: *"The impact method
gives no criterion for a conflict resolution, and this repository holds no
conflict record to resolve one against."*

## Decision

### 1. `specs/conflicts/` — one document per conflict

`CONF-####`, domain-less, per DEC-0086 §1: the domain token sits on the chain
artefacts and not on the registers that cut across them. One file per
conflict, named for the artefact it holds, because a conflict record is a
document — two positions, each with a locator and an excerpt — and not a row.

The frontmatter is `@leafcutter-os/schemas`' conflict document — `type`,
`status`, `impact`, `involved`, `decision_point`, `recommended_action`,
`blocking_demands`, `decision_record` — and the body is what
`library-schemas`' `conflict-record` contract additionally requires:
`positions[]` with evidence, the impact with its reason, and the outcome set
the type permits. The two contracts describe the same artefact at two levels
and neither is complete alone.

`check:specs` E21 reads the enums out of the installed `conflict-record`
schema, requires **two** positions each with a locator and a ≤25-word excerpt
— *"A conflict record that names only the new candidate is half a record"* —
and rejects a `recommended_action` that is not among the record's own
`permitted_outcomes`.

### 2. 22 conflicts, and every one of them was had

All 95 decision records were read, plus the question register. **18
contradictions were found in them** and **4 more by DEC-0097's locator run**:

| Type | Count |
| --- | --- |
| direct contradiction | 16 |
| value conflict | 4 |
| dependency conflict | 2 |

20 are `RESOLVED` and name the `DEC-####` that resolved them; 2 are `OPEN`,
both found by the locator run and neither yet decided.

**Most decisions are not conflicts, and that is the answer, not a shortfall.**
The method: *"A conflict is a contradiction between two statements, not a
disagreement with one of them."* Records deliberately looked at and left out:

- **DEC-0059** rules itself out — *"There was no contradiction to resolve,
  only an imprecise sentence."*
- **DEC-0062** (Akteur/Organizer) adds a distinction the glossary did not
  have. Silence is not contradiction, so it is not a terminology shift.
- **DEC-0070** — *"Neither was a choice between alternatives; both were
  determinations that had never been put to anyone."*
- **DEC-0084 §1** (400 → 280 inhabitants) is a factual correction: only one
  statement stood in the repository, so it is a disagreement with one.
- **DEC-0093 / DEC-0094** are method-conformance migrations, and §3 says of
  itself that the nine page rows are *"a shape mismatch, not a violation"*.

One known conflict is **not** in the register and is named here instead:
Q-0053's logo-radius collision was real and was resolved without a decision
record, and its second position lives in a package README that this repository
does not commit. A position that cannot be located cannot be a position
(DEC-0097 §1), so it is recorded as absent rather than approximated.

One widening is recorded rather than smuggled: the taxonomy's *"Typical
resolution"* column is typical, not exhaustive, and three records resolved a
direct contradiction by `ISOLATE` — the carve-out, not the rejection. Where a
record actually took an outcome, that outcome is in the type's permitted set.

### 3. `specs/demands/demand-register.md` — one row per demand

`DEM-####`, domain-less, same rule. A register of many identifiers is one
document, the way the question register, the glossary and the source inventory
are (DEC-0086 §4) — the contract types a demand as nine short fields, and
fifty-seven files of nine fields each, most of them pointing at a `Q-####` row
that already exists, would be the duplication this decision is trying to
avoid. The **fields** are the contract's; the file count is not, and that is
the recorded deviation.

`check:specs` E22 validates the defect type against the eleven, the status,
and the two fields that make a demand one: *"'More detail' is not a demand"*
and *"A demand addressed to nobody is a note."*

### 4. 57 demands: 42 cross-references, 15 new

| Defect | Count |
| --- | --- |
| incomplete | 22 |
| unauthoritative | 20 |
| stale | 5 |
| unlocatable | 5 |
| unmandated | 3 |
| vague | 2 |

41 `OPEN`, 15 `ANSWERED`, 1 `WAIVED`. Five of the eleven defect types are
unused, and the register says so by not inventing rows for them.

**42 rows are the question register read against the taxonomy.** Each names
its `Q-####` in `Raised by` and copies nothing from it: the `Q` row is the
conversation, the `DEM` row is the request. Two `Q` rows are the same demand
recorded twice — Q-0019 and Q-0076, the `audiences` field on media-echo — and
they merge into one demand with two addressees.

**15 rows are new, and none could have come from the question register**,
because this wave found them:

- **Nine** are the source-quality dimensions rated 0 or 1 (DEC-0098). The
  method requires exactly this: *"a defect for every dimension rated 0 or 1."*
- **Six** are the locator run's (DEC-0097): the three constraints whose
  mandate is "convention", the ten requirements whose source does not support
  them, `FUN-WEB-0179`'s SHALL taken from an ADR's open question, the two
  dangling citations to retired identifiers, and the upstream `loc: UNKNOWN`
  slot.

The pressure point in classifying was `vague` against `incomplete`, and the
taxonomy settles it: *"Vague means the element is there and unmeasured
('fast'); ask for the measure. Incomplete means the element is absent
altogether."* Every missing API field, component and contract slot is
therefore `incomplete`, and only two rows are `vague`.

`DEM-0008` is the register's first **waiver**, and it is written the way the
method requires one — *"a waived demand is a decision to proceed on thin
evidence. That is often the right call. It is never a call that should be
invisible afterwards."* `SRC-0010` has no mandate holder to confirm it,
because it is a website that no longer runs, and the only claims it is used
for are facts about itself.

### 5. What this does to DP-04, exactly

It removes **one** of the two reasons and leaves the other.

`POL-GRADED-BY-IMPACT` bound DP-04 to the owner because *"the impact method
gives no criterion for a conflict resolution, and this repository holds no
conflict record to resolve one against."* The second clause is now false: 22
records exist, each with its type, its two positions, its impact and the
outcome set its type permits — which is precisely the evidence a decision at
DP-04 would be taken on.

The first clause stands. `@leafcutter-strict/method-impact-level-assignment`
still names no criterion for a conflict resolution, so there is nothing to
evaluate a bounded agent row against, and **DP-04 stays `HUMAN` at every
level**. The policy is not amended here. What changed is that the owner now
decides against a record instead of against a memory.

### 6. How the four registers relate

Nothing is merged and nothing is renumbered.

| Register | Holds | Stays because |
| --- | --- | --- |
| `specs/decisions/` `DEC-####` | what was decided and why | 1,898 citations; it is the project's reasoning |
| `specs/questions/` `Q-####` | the conversation that narrows an answer | amended over time; cited across the repository |
| `specs/conflicts/` `CONF-####` | what collided, on what evidence, at what impact | the type decides the outcomes; no other register carries it |
| `specs/demands/` `DEM-####` | the request: defect type, addressee, answer format | the taxonomy and the addressee; no other register carries either |

A `CONF` names its `DEC` and never restates it. A `DEM` names its `Q` and
never restates it. Where a conflict is held open by a demand — the unamended
information architecture, the superseded performance budget, the upstream
schema slot — the conflict names the demand in `blocking_demands`.

## Consequences

- **`specs/conflicts/` holds 22 records and `specs/demands/` one register of
  57 rows.** `check:specs` reports both in its count line and gains E21 and
  E22.
- **W6 moves from 302/302 to 324/324.** The `conflict-record` contract carries
  `ai_provenance`, so DEC-0091's rule reaches the 22 new records; the prompt
  identity is `UNKNOWN` on them for the same reason it is `UNKNOWN` on the
  other 302.
- **A conflict record may name a retired identifier**, for the reason a
  decision record may, and the demand register may in one row, because a
  demand to repoint a dangling citation has to name it.
- **DP-04 is unchanged and now has its evidence.** One of its two reasons is
  spent.
- No requirement, criterion, count, pyramid figure, W3, W7 or W8 value moved.
