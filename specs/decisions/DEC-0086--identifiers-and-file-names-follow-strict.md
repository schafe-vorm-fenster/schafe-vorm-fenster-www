---
id: DEC-0086
title: Identifiers and file names follow the STRICT scheme — <TYPE>-<DOMAIN>-<NNNN>, and a file is named for the artefact it holds
status: accepted
date: 2026-09-24
decided_by: jan-henrik.hempel
---

## Context

DEC-0085 §6 listed eleven places where this repository's form diverges from
the STRICT packages it installs, and put a price on each. The first row was
the identifier schema:

> `<TYPE>-<DOMAIN>-<NNNN>` — `FUN-WEB-0001` … Cost: a rename of ~340 ids in
> ~155 files plus every external citation.

Two of the three reasons that row gave for not paying have since been
checked and do not hold:

- **"Cited from sibling repositories."** Measured, not assumed: the only
  repository that cites these ids is this one. `go-to-market-os` — the
  single other repository in the workspace that could — cites none. The
  rename is closed inside this repository.
- **"~340 ids in ~155 files."** The real figure is 802 identifiers and
  11,306 citations across 708 files. The estimate was low by a factor of
  thirty on citations, which is an argument for doing it by script today
  rather than by hand later.

The third reason stands and is answered rather than overridden:
`@leafcutter-strict/method-identifier-and-locator-schema` says *"Never
reuse, never renumber. An identifier handed to you belongs to the artefact
that has it."* No number is reassigned here. `WEB-F-007` becomes
`FUN-WEB-0007`: the same artefact, the same number, re-composed and widened
to the four digits the method fixes. Nothing is recycled and nothing moves
to a different artefact.

## Decision

### 1. The identifier is composed the way the method composes it

`@leafcutter-strict/method-identifier-and-locator-schema`, procedure step 1:

> **Compose the identifier.** `<TYPE>-<DOMAIN>-<NNNN>`, for example
> `NEED-ACC-0004`. The type is the artefact's level or class, the domain is
> the registered domain tag, the number is the next free one in that
> combination.

and, on numbering: *"Absent means numbering starts at 0001."* Four digits,
therefore, in every family.

The **type tokens are the installed contracts'**, not invented here. The
JSON Schemas in `@leafcutter-strict/library-schemas@0.4.1` declare
`^(FUN|NFR|CON|BUS)-[A-Z]{2,5}-\d{4}$` for a requirement and
`^TS-[A-Z]{2,5}-\d{4}$` for a tactical specification;
`@leafcutter-os/schemas/spec` declares `^SRC-\d{4}$` for a source,
`^GOAL-[A-Z]+-\d{4}$`, `^NEED-[A-Z]+-\d{4}$`, `^CONF-\d{4}$` and
`^DEM-\d{4}$` for the artefacts this repository does not yet hold.

The **domain token appears exactly where those schemas carry one**. It is
on the chain artefacts — goal, need, requirement, tactical specification —
and absent from the cross-cutting registers: `SRC-\d{4}`, `CONF-\d{4}` and
`DEM-\d{4}` carry no domain, and neither does STRICT's decision record.
This repository's domain tag is `WEB`.

### 2. The mapping, family by family

| Artefact | Was | Is | Type token from |
| --- | --- | --- | --- |
| Functional requirement | `WEB-F-###` | `FUN-WEB-####` | requirement-shell contract |
| Quality requirement | `WEB-Q-###` | `NFR-WEB-####` | requirement-shell contract |
| Constraint | `WEB-C-###` | `CON-WEB-####` | requirement-shell contract |
| Tactical specification | `TS-###` | `TS-WEB-####` | tactical-specification contract |
| Acceptance criterion | `TS-###-A#` | `TS-WEB-####-A#` | local — see §3 |
| Decision record | `DEC-###` | `DEC-####` | local — see §3 |
| Open question | `Q-###` | `Q-####` | local — see §3 |
| Source | `SRC-###` | `SRC-####` | `@leafcutter-os/schemas` source id |
| Glossary term | `GL-###` | `GL-####` | local — see §3 |
| Specification document | `SSD-WEB` | `SSD-WEB-0001` | local — see §3 |

The class mapping `F → FUN`, `Q → NFR`, `C → CON` is the table
`specs/requirements/README.md` has carried since the cold start, now spent
rather than merely recorded. The business-rule class remains empty; that
row of DEC-0085 §6 is untouched.

`specs/traceability/identifier-map.md` is the generated record: every old
id, its new id and its citation count, plus every renamed file. It is
produced by `scripts/migrate-identifiers.mjs --emit-map` and is the one
file in the repository where the old forms still appear.

### 3. Four families keep a local type token, and why

The method defines no identifier for them, and the nearest thing it has is
a different artefact:

- **`DEC-####`.** STRICT's decision record is an
  `SDR-<yyyy>-<mmdd>-<nnnn>` taken at one of the numbered decision points
  `DP-01…DP-14`, immutable, with criteria, mode, executor and outcome. That
  is not what an entry in `specs/decisions/` is, and adopting the id would
  claim the shape. The shape is still owed — DEC-0085 §6 keeps that row.
- **`Q-####`.** The method's nearest artefact is a `DEM-####` demand: a
  defect turned into a request with an addressee, an answer format and a
  due date. The question register has none of that yet. Also still owed.
- **`GL-####`.** `@leafcutter-strict/method-glossary-policy` governs
  admission, mapping and rejection of terms and defines no identifier at
  all.
- **`TS-WEB-####-A#`.** The tactical-specification contract types
  `acceptance_tests[].id` as a free string with no pattern, so there is
  nothing to adopt. DEC-0040's id-carrying criterion with a verification
  level stands; the criterion now inherits its spec's composed id.

`SSD-WEB` was the one identifier that fitted no rule at all. It is
`SSD-WEB-0001`.

### 4. A file is named for the artefact it holds

`@leafcutter-strict/library-schemas` names its own conflict records
`spec/conflicts/CONF-0001--where-the-output-contracts-live.md`, and
`@leafcutter-os/schemas` documents `spec/goals/GOAL-<DOMAIN>-<nnnn>.md`,
`spec/needs/NEED-<DOMAIN>-<nnnn>.md` and `spec/conflicts/CONF-<nnnn>.md`.
The rule behind all of them is that an artefact is resolvable by its
identifier without opening the file.

So:

| Layer | Was | Is |
| --- | --- | --- |
| Decisions | `085-strict-is-a-versioned-dependency.md` | `DEC-0085--strict-is-a-versioned-dependency.md` |
| Tactical specs | `page-composition.tactical.md` | `TS-WEB-0006--page-composition.tactical.md` |

114 files in all. `check:specs` E1 now enforces both directions: a decision
or tactical file whose name does not carry its own frontmatter id is an
error, where before only the decision's three-digit prefix was compared.

Requirement files, the question register, the glossary, the source
inventory and the contract register are **not** renamed. Each holds a
register of many identifiers, so there is no single artefact to name the
file for. Turning them into one-artefact-per-file documents is an artefact
shape question, not an identifier question, and belongs with the rest of
DEC-0085 §6.

`specs/` keeps its name. The `spec/<kind>/` layout in the docstrings of
`@leafcutter-os/schemas` describes the repository those schemas were
written for; no blueprint this repository installs prescribes a directory
name, and inventing one from a docstring would be exactly the kind of
unsourced claim the method forbids.

### 5. The checker consumes the patterns instead of repeating them

DEC-0085 §4 moved five controlled vocabularies out of
`scripts/check-specs.ts` and into the installed contracts. Three identifier
**patterns** follow them: requirement, tactical specification and source
are now read from the schemas rather than spelled in the script, so a
narrowing upstream fails the check instead of passing unnoticed.

That needs one repair. `@leafcutter-strict/library-schemas@0.4.1` ships
every `pattern` with its backslashes doubled — the JSON holds `\\\\d`, so
`JSON.parse` yields `\\d`, a literal backslash followed by `d`, and the
expression matches nothing. DEC-0085 recorded the bug as upstream's to fix;
collapsing each doubled backslash at the one place that reads a pattern is
the deterministic repair, and it is confined to `idPattern()`. When
upstream fixes the escaping the call sites do not change.

`DEC-####`, `Q-####` and `GL-####` stay local patterns, for the reason in
§3.

### 6. What DEC-0085 §6 now says

Its identifier row is amended to point here. The other ten rows are
untouched: this change is identifiers, file names and the parts of the
check scripts that encode them, and nothing else.

## Consequences

- 802 identifiers and 11,306 citations in 708 files were rewritten in one
  scripted pass, word-bounded in both directions so that `TS-019` never
  corrupted `TS-019-A6` and `DEC-008` never matched inside `DEC-0085`.
  `scripts/migrate-identifiers.mjs --verify` reports what is left.
- `pnpm check` is green with the counts unchanged: 155 requirements · 85
  decisions · 73 questions · 18 sources · 29 tactical specs · 420
  acceptance criteria, the same verification pyramid, the same 181/420 W3
  warnings, 1192 unit and integration tests and 55 static tests. An
  identifier rename that moved a count would have been a rename that lost
  an artefact.
- The unit and e2e guards that keep internal ids out of rendered copy and
  indexed metadata — `e2e/content-compliance.spec.ts`,
  `e2e/metadata-compliance.spec.ts`, `src/lib/routes/metadata.test.ts` —
  carry the new shapes **in addition to** the old ones. Copy written before
  today would still be a leak.
- `PageFrontmatterSchema.page_id` accepts `TS-<DOMAIN>-####`. The pattern is
  spelled in `src/domain/` rather than imported, because
  `@leafcutter-strict/library-schemas` is a devDependency and that module is
  bundled.
- `concept/website-content-production.concept.md` still carries the old
  forms. It had uncommitted changes when this migration ran and was left
  untouched; re-running `scripts/migrate-identifiers.mjs --apply` after
  those changes land finishes it.
- Records of decisions already taken — `plan/reviews/**`, `state/**`,
  `reports/**` — had their id citations migrated so the reference graph
  holds, and nothing else. Where they sketch the *old scheme* as `TS-###`
  they still do, because that is what was true when they were written.
