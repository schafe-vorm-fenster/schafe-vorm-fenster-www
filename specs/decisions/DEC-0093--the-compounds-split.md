---
id: DEC-0093
title: The compounds are split — one modal and one predicate per artefact, and the nine page rows are a shape the method has no form for
status: accepted
date: 2026-09-24
decided_by: jan-henrik.hempel
---

## Context

DEC-0087 put 47 of 155 statements into their slot form and reported the
remainder honestly:

> 108 are not, and are left byte for byte. Splitting a compound is what the
> method asks for and it makes new artefacts, which this wave does not do.

DEC-0092 took 37 of those 108 — the whole quality class — through the split.
This record takes the other 71: the 57 functional requirements and the 14
constraints `check:specs` W4 still names.

The rule is one sentence of `@leafcutter-strict/method-statement-grammar`:

> Compound statements. One modal, one predicate. A statement joined by "and"
> is split, and the split is recorded so that the parts stay traceable to the
> same passage.

And the reason for splitting rather than rewriting is the sentence after it,
in the same method's output section: *"A candidate that fits no form is
returned for classification rather than forced into the nearest one."* A
compound forced into one slot loses whichever half the slot does not hold.

## Decision

### 1. What counts as a compound, applied the same way twice

The test DEC-0092 set is kept: **more than one predicate or more than one
modal is a compound; an enumeration that is the object of one predicate is
not.** `CON-WEB-0021`'s eight CI gates are the object of *gate*, so it is one
constraint with a list in its Notes. `FUN-WEB-0101`'s "fetch server-side,
stream in, and cache the response" is three verbs joined by "and", so it is
three requirements.

The test cuts the 71 four ways.

| Outcome | Count | What it means |
| --- | --- | --- |
| **Split** | 40 parents → 113 children | More than one predicate or modal. Parent retired, children new-numbered, every citation re-pointed |
| **Recast in place** | 15 | One predicate, carrying material the form has no slot for. The statement goes into its form and the material into `## Rationale` or `## Notes`, word for word. The identifier does not move |
| **Reclassified** | 1 | `FUN-WEB-0075` is a deferral with a condition, not something the website does. It is `CON-WEB-0075`, the same number, free in the target class |
| **Left at `form: 0`** | 10 | Nine page rows and one target picture — see §3 |

A split child's class is decided afresh by
`@leafcutter-strict/method-requirement-classification`, not inherited. That
is why 43 of the 113 children are constraints: a compound of the form "the
website does X, and never does Y" carries a functional requirement and a
bound, and the tree puts them in different classes. Splitting them apart is
the only way either gets the grammar and the approval route it is owed.

### 2. A split never moves a number, and never loses a criterion

Each child inherits its parent's `area`, `source` locator and evidence level;
the split changes the sentence, not the evidence. Each child also inherits
the parent's row in every tactical Coverage table, with the same acceptance
criteria and a gloss rewritten to describe the child rather than the parent.

That last part is what keeps the coverage honest. **W3 is unchanged at
181/420 and W2 is still empty**: every one of the 268 requirements is
implemented by a tactical specification and discharged by at least one
acceptance criterion. A split that stranded a criterion would show up in
either number immediately.

The re-pointing is verified mechanically, not by reading: the identifier map's
`## Retired identifiers` table is the register, and a sweep over `specs/`,
`src/` and `e2e/` — every `.md`, `.ts`, `.tsx` and `.feature` — finds **zero**
citations of a retired identifier outside a decision record. `check:specs` E5
enforces the same rule on every run.

### 3. The nine page rows are not a grammar failure

`FUN-WEB-0010` … `FUN-WEB-0018` are one table row each:

| Route | Focus job | Primary conversion |
| --- | --- | --- |
| `/mitmachen` | publish our dates | `register-as-publisher` |

`method-statement-grammar` defines seven forms — goal, need, functional,
quality, constraint, business rule, fit criterion — and **every one of them is
a sentence**. None has a slot for a tuple. The method's instruction for a
candidate that fits no form is to return it for classification, and the
classification is not the problem: these are functional requirements, and
`class: FUN` is right.

So they are left exactly as they are, with `form: F0` and a Notes section
saying why. Two alternatives were considered and both cost more than they buy:

- **Flatten each row into three sentences.** "For `/mitmachen`, the website
  SHALL declare the focus job *publish our dates*" and two more, per page.
  Twenty-seven artefacts that together say what nine rows say, and the
  mapping — which is the thing being specified — stops being visible in one
  place. `FUN-WEB-0001` and `FUN-WEB-0003` already state the general rules
  that a page declares one focus job and one primary conversion; these rows
  are the instance table under them.
- **Invent a mapping form.** That is a change to the method, which is
  upstream's and DP-14's, not this repository's.

**This is a shape mismatch, not a violation**, and `form: F0` records it
rather than hiding it. It is raised as Q-0075 so the gap has an addressee.

`FUN-WEB-0068` stays at `form: F0` for a different reason: "Per-country
language sets beyond phase 1 … are the target picture; exact sets per country:
UNKNOWN (Q-0010)." Writing it in the F form means inventing the sets, which
`@leafcutter-strict/foundation-evidence-discipline` forbids outright. It waits
for Q-0010.

## The 71, one row each

| Requirement | Outcome | Now |
| --- | --- | --- |
| `CON-WEB-0001` | split into 3 | `CON-WEB-0046` · `CON-WEB-0047` · `CON-WEB-0048` |
| `CON-WEB-0002` | split into 3 | `CON-WEB-0049` · `CON-WEB-0050` · `CON-WEB-0051` |
| `CON-WEB-0004` | split into 2 | `CON-WEB-0052` · `FUN-WEB-0131` |
| `CON-WEB-0005` | split into 2 | `CON-WEB-0053` · `CON-WEB-0054` |
| `CON-WEB-0006` | recast in place | `CON-WEB-0006` |
| `CON-WEB-0007` | split into 3 | `CON-WEB-0055` · `CON-WEB-0056` · `CON-WEB-0057` |
| `CON-WEB-0014` | split into 2 | `CON-WEB-0058` · `FUN-WEB-0132` |
| `CON-WEB-0016` | recast in place | `CON-WEB-0016` |
| `CON-WEB-0020` | recast in place | `CON-WEB-0020` |
| `CON-WEB-0021` | recast in place | `CON-WEB-0021` |
| `CON-WEB-0022` | recast in place | `CON-WEB-0022` |
| `CON-WEB-0023` | recast in place | `CON-WEB-0023` |
| `FUN-WEB-0003` | split into 4 | `FUN-WEB-0133` · `FUN-WEB-0134` · `FUN-WEB-0135` · `FUN-WEB-0136` |
| `FUN-WEB-0008` | split into 2 | `FUN-WEB-0138` · `CON-WEB-0059` |
| `FUN-WEB-0010` | left at form 0 | a three-column tuple; the method has no form for one |
| `FUN-WEB-0011` | left at form 0 | a three-column tuple; the method has no form for one |
| `FUN-WEB-0012` | left at form 0 | a three-column tuple; the method has no form for one |
| `FUN-WEB-0013` | left at form 0 | a three-column tuple; the method has no form for one |
| `FUN-WEB-0014` | left at form 0 | a three-column tuple; the method has no form for one |
| `FUN-WEB-0015` | left at form 0 | a three-column tuple; the method has no form for one |
| `FUN-WEB-0016` | left at form 0 | a three-column tuple; the method has no form for one |
| `FUN-WEB-0017` | left at form 0 | a three-column tuple; the method has no form for one |
| `FUN-WEB-0018` | left at form 0 | a three-column tuple; the method has no form for one |
| `FUN-WEB-0019` | split into 2 | `FUN-WEB-0139` · `CON-WEB-0060` |
| `FUN-WEB-0021` | split into 4 | `FUN-WEB-0140` · `FUN-WEB-0141` · `FUN-WEB-0137` · `CON-WEB-0061` |
| `FUN-WEB-0023` | split into 2 | `CON-WEB-0062` · `FUN-WEB-0142` |
| `FUN-WEB-0024` | recast in place | `FUN-WEB-0024` |
| `FUN-WEB-0025` | split into 3 | `FUN-WEB-0143` · `FUN-WEB-0144` · `CON-WEB-0063` |
| `FUN-WEB-0026` | split into 3 | `FUN-WEB-0145` · `FUN-WEB-0147` · `CON-WEB-0064` |
| `FUN-WEB-0028` | split into 3 | `FUN-WEB-0148` · `CON-WEB-0065` · `CON-WEB-0066` |
| `FUN-WEB-0029` | split into 2 | `FUN-WEB-0146` · `CON-WEB-0067` |
| `FUN-WEB-0032` | split into 2 | `FUN-WEB-0149` · `CON-WEB-0068` |
| `FUN-WEB-0036` | split into 3 | `FUN-WEB-0150` · `FUN-WEB-0151` · `CON-WEB-0069` |
| `FUN-WEB-0039` | recast in place | `FUN-WEB-0039` |
| `FUN-WEB-0041` | recast in place | `FUN-WEB-0041` |
| `FUN-WEB-0044` | split into 2 | `FUN-WEB-0153` · `FUN-WEB-0154` |
| `FUN-WEB-0046` | split into 6 | `FUN-WEB-0155` · `FUN-WEB-0156` · `FUN-WEB-0157` · `CON-WEB-0070` · `CON-WEB-0071` · `CON-WEB-0072` |
| `FUN-WEB-0047` | split into 2 | `FUN-WEB-0158` · `FUN-WEB-0159` |
| `FUN-WEB-0048` | recast in place | `FUN-WEB-0048` |
| `FUN-WEB-0049` | recast in place | `FUN-WEB-0049` |
| `FUN-WEB-0050` | recast in place | `FUN-WEB-0050` |
| `FUN-WEB-0052` | recast in place | `FUN-WEB-0052` |
| `FUN-WEB-0053` | split into 4 | `FUN-WEB-0160` · `FUN-WEB-0161` · `FUN-WEB-0162` · `CON-WEB-0073` |
| `FUN-WEB-0061` | split into 2 | `FUN-WEB-0163` · `FUN-WEB-0164` |
| `FUN-WEB-0064` | split into 2 | `FUN-WEB-0165` · `FUN-WEB-0166` |
| `FUN-WEB-0068` | left at form 0 | a target picture with an UNKNOWN value (Q-0010) |
| `FUN-WEB-0069` | split into 3 | `FUN-WEB-0168` · `CON-WEB-0074` · `CON-WEB-0076` |
| `FUN-WEB-0070` | recast in place | `FUN-WEB-0070` |
| `FUN-WEB-0075` | reclassified, number kept | `CON-WEB-0075` |
| `FUN-WEB-0079` | split into 2 | `FUN-WEB-0169` · `FUN-WEB-0170` |
| `FUN-WEB-0080` | split into 2 | `FUN-WEB-0171` · `CON-WEB-0077` |
| `FUN-WEB-0081` | split into 2 | `FUN-WEB-0172` · `FUN-WEB-0173` |
| `FUN-WEB-0082` | split into 2 | `FUN-WEB-0174` · `CON-WEB-0078` |
| `FUN-WEB-0084` | split into 3 | `FUN-WEB-0175` · `FUN-WEB-0176` · `FUN-WEB-0177` |
| `FUN-WEB-0085` | split into 2 | `FUN-WEB-0178` · `CON-WEB-0079` |
| `FUN-WEB-0086` | split into 2 | `FUN-WEB-0179` · `CON-WEB-0080` |
| `FUN-WEB-0088` | split into 3 | `FUN-WEB-0180` · `FUN-WEB-0181` · `FUN-WEB-0182` |
| `FUN-WEB-0090` | split into 3 | `FUN-WEB-0183` · `CON-WEB-0081` · `CON-WEB-0082` |
| `FUN-WEB-0093` | split into 5 | `FUN-WEB-0184` · `FUN-WEB-0185` · `FUN-WEB-0187` · `FUN-WEB-0152` · `CON-WEB-0083` |
| `FUN-WEB-0094` | split into 3 | `FUN-WEB-0188` · `FUN-WEB-0189` · `CON-WEB-0084` |
| `FUN-WEB-0096` | split into 5 | `FUN-WEB-0186` · `FUN-WEB-0190` · `FUN-WEB-0191` · `CON-WEB-0085` · `CON-WEB-0086` |
| `FUN-WEB-0100` | split into 2 | `FUN-WEB-0192` · `CON-WEB-0088` |
| `FUN-WEB-0101` | split into 3 | `FUN-WEB-0193` · `FUN-WEB-0194` · `FUN-WEB-0195` |
| `FUN-WEB-0104` | split into 2 | `FUN-WEB-0196` · `FUN-WEB-0197` |
| `FUN-WEB-0105` | recast in place | `FUN-WEB-0105` |
| `FUN-WEB-0106` | split into 5 | `FUN-WEB-0198` · `FUN-WEB-0199` · `FUN-WEB-0200` · `CON-WEB-0089` · `CON-WEB-0090` |

The five not in this table — `CON-WEB-0011`, `CON-WEB-0013`, `FUN-WEB-0020`,
`FUN-WEB-0022` and `FUN-WEB-0087` — are compounds too, and they are the
subject of their own record: four of them hide a business rule and the fifth
is a constraint filed as a functional requirement.

## Consequences

- **196 requirements become 268**, +72. 40 parents retired, 113 children
  born, 15 statements recast without moving, one reclassification keeping its
  number, ten left at `form: 0` with the reason on the artefact.
- **`check:specs` W4 falls from 71/196 to 15/268** — the ten of §3 plus the
  five that belong to the business-rule record.
- **41 identifiers retired** and registered in the identifier map with this
  record named. 43 files re-pointed across `specs/`, plus
  `specs/verification/journeys/know-what-is-on.feature`, which the first
  re-pointing pass missed because it scanned only Markdown — a gap E10 caught
  on the next run, which is what E10 is for.
- **The RTM is regenerated from the artefacts** rather than edited: its area
  table from the `area:` field of every requirement, its tactical table from
  the `implements:` list of every specification. That corrected two rows that
  had been wrong before this wave — `TS-WEB-0004` did not list `FUN-WEB-0023`
  or `FUN-WEB-0029`, both of which it implements.
- **The constraint class trebles**, from 17 to 77. That is the finding of this
  record rather than a side effect: this repository states a great many of its
  rules as "do X, and never do Y", and the half after the comma was invisible
  to the constraint class until the compounds came apart.
