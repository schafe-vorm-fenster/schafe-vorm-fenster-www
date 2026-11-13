---
id: DEC-0087
title: The artefact shape follows STRICT — one requirement per document, the business-rule class, the slot grammar where meaning survives it, and DRAFT until a decision policy exists
status: accepted
date: 2026-09-24
decided_by: jan-henrik.hempel
---

## Context

DEC-0086 closed the identifier row of DEC-0085 §6 and said plainly what it
had not touched:

> Requirement files, the question register, the glossary, the source
> inventory and the contract register are **not** renamed. Each holds a
> register of many identifiers, so there is no single artefact to name the
> file for. Turning them into one-artefact-per-file documents is an artefact
> **shape** question, not an identifier question.

This is that question, and four more from §6 that are shape rather than
chain: the business-rule class, the statement grammar, the status lifecycle
and per-artefact versions. The chain itself — need, goal, locators, the
decision-record shape, the conflict and defect registers — stays owed.

Two of the five answers came out the opposite way round from the way the
work was framed. Both are recorded here with the sentence that decided them,
because an answer that contradicts the brief is worth more than one that
confirms it.

## Decision

### 1. A requirement is a document. The other three registers are registers

The question is not a matter of taste; the contracts type it, and they type
it differently for the four registers wave 1 left alone.

| Register | What its contract records | Shape |
| --- | --- | --- |
| Requirements | `requirement-shell`: *"a single requirement, with every attribute the method requires"* | **one document each** |
| Sources | `source-inventory`: *"the L0 source set"* — one object with `run`, `sources[]`, `clusters[]`, `reading_order[]` | register |
| Questions | `question-set`: *"the questions put to stakeholders, and the answers registered back"* — one object with `mode`, `questions[]`, `answers[]` | register |
| Glossary | `glossary-proposal`: *"term admissions, ambiguity splits and synonym mappings"* — one object with `terms[]`, `ambiguities[]`, `synonyms[]`, `shifts[]` | register |

`@leafcutter-os/schemas` settles the requirement case beyond argument. Its
`spec/requirement.schema.mjs` opens:

> `/** The frontmatter of a requirement document
> (`spec/requirements/<DOMAIN>-<CLASS>-<nnnn>.md`), level L3. */`

A requirement has frontmatter, a path and a level, which is what a document
has and what a table row does not. The same package types a goal, a need and
a conflict the same way, and types no per-source, per-question or per-term
document at all. `source-inventory` is named like a register because it is
one; it stays one, and so do the question register and the glossary.

So the 18 `*.req.md` files are gone and 155 requirement documents stand in
their place, named for their identifiers. The file name is the bare
identifier — `FUN-WEB-0001.md` — and not `<id>--<slug>.md`, because that is
the form the schema docstrings give for every spec artefact they name
(`GOAL-<DOMAIN>-<nnnn>.md`, `NEED-<DOMAIN>-<nnnn>.md`, `CONF-<nnnn>.md`).
DEC-0086 §4's rule is satisfied either way: the artefact is resolvable by its
identifier without opening the file.

The register view survives as the directory README: the area notes that
belong to no single requirement, and every id with its source and evidence
level. The statement lives in exactly one place, which is the point of the
split.

### 2. One requirement was a business rule

`@leafcutter-strict/method-requirement-classification` asks four questions in
order and the first yes decides. Question one:

> **Does it hold independently of any executor?** — a business rule. "An
> invoice over 10,000 counts as material" is true whether a system, a clerk
> or nobody applies it.

Nothing in this repository had ever been asked it, so everything fell through
to constraint or functional and the `BUS` class the requirement-shell
contract declares stayed empty. Read against all 155, exactly one statement
answers it yes:

> `CON-WEB-0012` — "Municipalities and institutions are not separated: same
> product, same argument, one job."

No system subject. True whether a website, a sales deck, a price list or
nobody acts on it. It is `BUS-WEB-0012` now, in
`requirements/business-rules/`, with the same number it has held since
`WEB-C-012` — never reuse, never renumber — and all 13 citations moved with
it.

Four statements **carry** a business rule without being one, and are left
alone. The method's own trap says why:

> A business rule and the requirement that applies it are two artefacts. The
> rule without a system subject; the requirement with one, depending on the
> rule. Merging them hides the rule from every other consumer of it.

| Left as-is | The rule inside it |
| --- | --- |
| `CON-WEB-0011` | enterprise pricing is on request |
| `CON-WEB-0013` | the AI-coaching track belongs to a different brand |
| `FUN-WEB-0020` | the licence is priced per organisation, with no place limit |
| `FUN-WEB-0022` | a quote request is answered within two working days |

Splitting each into a rule plus the requirement that applies it makes four
new artefacts. That is extraction, not migration, and it is owed.

### 3. The slot grammar, for 47 of 155

`@leafcutter-strict/method-statement-grammar` gives each class one shape and
has the artefact record which one it follows in `form`. It also rules
something out, and the exclusion is what decides most of the 155:

> Compound statements. One modal, one predicate. A statement joined by "and"
> is split, and the split is recorded so that the parts stay traceable to the
> same passage.

47 statements are one modal clause and are recast into their slot form
without losing a word. 108 are not, and are left byte for byte. Splitting a
compound is what the method asks for and it makes new artefacts, which this
wave does not do.

| Class | Recast | Why the rest are not |
| --- | --- | --- |
| FUN | 43 / 96 | the nine page rows are a three-column mapping, and F is a sentence with no slot for a tuple; the others carry an exception, a phasing or a second modal |
| CON | 3 / 17 | C wants one limit and its mandate; most state two or three limits at once |
| BUS | 1 / 1 | — |
| NFR | **0 / 41** | see below |

The quality class is the finding. Q is a measure — `<scale>` of `<object>`
SHALL be `<operator>` `<value>` `<unit>` measured by `<meter>` — and not one
of the 41 quality requirements fits it. They divide into two kinds, and the
method has a name for the second:

- **Several measures in one statement.** `NFR-WEB-0002` carries five Core
  Web Vitals, `NFR-WEB-0003` five bundle budgets, `NFR-WEB-0001` four
  Lighthouse categories across two form factors plus a floor. Each is five
  or more Q statements wearing one identifier.
- **No measure at all.** `NFR-WEB-0012`, "markup shall be fully semantic with
  correct ARIA labelling"; `NFR-WEB-0022`, "no new ad-hoc tracking is
  introduced with the relaunch". The method: *"A quality requirement without
  a measure is not a quality requirement yet. Keep the statement, set the fit
  criterion to `UNKNOWN`, and expect it to be rejected until the measure
  arrives. That rejection is the method working."*

Filling the Q slots for either kind means inventing a measure. None was
invented. The whole quality class is owed, and it is owed for a reason
sharper than "not done yet": 41 rows claim to be quality requirements and
most of them are not one, by the method's own definition.

`form` records the verdict. The requirement-shell contract types it as a
class letter plus a digit and never says what the digit enumerates; the
method defines exactly one variant per class, so **1 is that variant and 0 is
"not yet"**. `check:specs` E14 checks the letter against the class, W4 counts
and names the 108.

Where a recast statement carried material no slot holds — the reason behind
a rule, a pointer to where something else is defined — it moved into a
`## Rationale` or `## Notes` section of the same document, word for word.
The shell contract types `rationale` as its own field for that reason.
Nothing was deleted, and no acceptance criterion was stranded: every
Coverage-table gloss in the tactical layer still describes the requirement it
names.

### 4. DRAFT is the only status an executor may write

The wave was framed to promote what has shipped: a requirement verified by
passing tests is not a draft. The method says the reverse, in a company-layer
foundation, in one sentence:

> An executor that writes `status: APPROVED` has not saved a step; it has
> removed the record that makes the approval auditable.
> — `@leafcutter-strict/foundation-draft-only-output`

A status moves at a decision point — DP-03 for a requirement, DP-08 for a
tactical specification, DP-09 for its verification — and which of them an
agent may execute is set by the project's decision policy. **This repository
has no decision policy.** DEC-0085 §6 keeps that row open deliberately, and
`library-schemas/policies` refuses to supply a default:

> How much authority an agent holds is a decision, and it should not arrive
> as an install default.

> Every pair is bound. There is no default row: a pair the policy does not
> cover fails the pipeline rather than falling back to something nobody
> decided.

> A scope starts at conservative.

Conservative binds all fourteen decision points to `HUMAN` at every impact
level. So there is no point at which anything here could be approved, green
tests do not become one, and every artefact stays `DRAFT`.

Two things change so that `DRAFT` reads as a record rather than an oversight:

- **E15** rejects any status but `DRAFT` while no `POL-*` policy exists under
  `specs/`. It adapts the moment one does.
- **W5** reports what a decision point could resolve today, using the
  policies' own gate — *"Nothing is decided at goal acceptance or requirement
  approval below S2"*. 145 of 155 requirements meet DP-03's gate (≥ S2 and
  covered by a tactical spec); 0 of 29 tactical specs meet DP-09's, because
  181 of the 420 acceptance criteria still have no test. Evidence for a
  decision, never the decision.

### 5. Versions start at 0.1.0, and the method does not say so

`@leafcutter-strict/method-version-increment` answers half the question. It
is a rule for **increments**: its inputs are *"the artefact's current version
and its diff"*, its output is major, minor or patch with the reason, and its
test is *"would an artefact that satisfied the old version still satisfy the
new one?"*. About the first version of an artefact that predates versioning
it says nothing at all, and `@leafcutter-os/schemas` types `version` as a
bare string with no pattern. The starting value has to be argued, not read
off.

**0.1.0**, for §4's reason: nothing here has passed a decision point. DP-13
baseline release has never run — its playbook requires every status
transition in the period to have a decision record, and there are none — so
no artefact is at a released baseline and a `1.x` would claim one. The first
increment the method actually governs is the one after the first approval,
and its reason goes into the change record, because *"a version bumped
without one cannot be reviewed"*.

Three contracts declare `version`, so three kinds of artefact carry it:
`requirement-shell` (155), `tactical-specification` (29) and
`specification-document` (the SSD). The decision record, the glossary
proposal, the question set and the source inventory declare none, and none
is invented for them. `check:specs` E16 enforces it.

### 6. Given/when/then cannot carry a verification level, so it stays owed

DEC-0085 §6 framed this as a choice deliberately made. It is not a choice;
the two shapes are incompatible, and the schema says so:

```json
"acceptance_tests": { "items": {
  "properties": { "id": {}, "given": {}, "when": {}, "then": {} },
  "required": ["id", "given", "when", "then"],
  "additionalProperties": false } }
```

`additionalProperties: false` closes the object at exactly four keys. DEC-0040's
verification level — `static · unit · integration · e2e · tool · manual` —
has nowhere to live. The two places it could be smuggled both cost more than
they buy:

- **Inside a prose field.** The level becomes a substring of `then` that
  `check:specs` parses out of free text. It is what the typed field exists to
  avoid.
- **Inside `id`.** `id` is a free string with no pattern, so
  `TS-WEB-0001-A1:integration` would validate — and then the verification
  level is part of the identifier, so re-levelling a criterion renumbers it.
  `method-identifier-and-locator-schema` forbids exactly that: *"Never reuse,
  never renumber."*

The verification pyramid is computed from the level, `check:specs` reports
it, 420 criteria carry it and the test suite hangs off it. Degrading it to
buy a shape the contract cannot hold is a bad trade, so the 420 criteria are
not migrated. DEC-0040 stands unedited — it is the record of what was decided
on 2026-09-10 — and DEC-0085 §6's row is rewritten from "deliberately chose"
to the measured incompatibility, so the next person does not re-open it as a
preference.

## Consequences

- 158 files became 296: 18 requirement registers out, 155 requirement
  documents and one new `business-rules/` index in. Every count that names an
  artefact is unchanged — **155 requirements · 86 decisions (87 with this
  one) · 73 questions · 18 sources · 29 tactical specs · 20 glossary terms ·
  420 acceptance criteria**, the same pyramid (static 82 · unit 30 ·
  integration 73 · e2e 165 · tool 39 · manual 31), the same 181/420 W3, 1192
  unit and integration tests and 55 static tests. A shape migration that
  moved a count would have lost an artefact.
- `scripts/migrate-identifiers.mjs --verify` reports exactly what it reported
  before the wave: three files with deliberate old-form mentions in prose.
  No citation was lost, including inside the 47 rewritten statements.
- `check:specs` gains four checks and two reports. E14 form, E15 status, E16
  version; E1 and E2 extended to requirement documents; W4 counts the
  statements still outside their form, W5 what a decision point could resolve.
  Three of the four new errors are checks this repository could not have had
  before, because the field they check did not exist.
- The two burn-downs are now visible in one run: **108/155 statements outside
  their slot form** and **181/420 criteria without a test**. Both are
  honest numbers and both go down by work, not by redefinition.
- `concept/website-content-production.concept.md` and
  `concept/v1.0/Wireframes Mobile.dc.html` had uncommitted changes when this
  wave ran and were left untouched, as in wave 1.
