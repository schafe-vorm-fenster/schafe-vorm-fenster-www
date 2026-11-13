# Requirements

## Purpose

Requirement shells extracted from the governed sources, grouped by class.
**One requirement is one document**, named for its identifier — the shape
`@leafcutter-os/schemas` types as `spec/requirements/<id>.md`, level L3, and
`@leafcutter-strict/library-schemas`' `requirement-shell` contract records as
"a single requirement". Each carries its ID, its class, its status, at least
one source locator — a position and an excerpt, never a bare file name — and
an evidence-sufficiency level in frontmatter, and its
statement in the body. The directory README is the index and defines nothing.
Nothing here approves itself: a requirement becomes binding at its decision
point, not by being written down.

## Classes

| Folder | Class | ID prefix |
| --- | --- | --- |
| `functional/` | what the website does | `FUN-WEB-####` |
| `quality/` | how well it does it (performance, accessibility, privacy) | `NFR-WEB-####` |
| `constraints/` | fixed decisions bounding the solution space | `CON-WEB-####` |
| `business-rules/` | true of the business whoever applies it | `BUS-WEB-####` |

The four classes are the method's.
`@leafcutter-strict/method-requirement-classification` classifies by a
four-step decision tree — business rule, then constraint, then quality, then
functional — and the `requirement-shell` contract fixes the four tokens:

| STRICT class | Here | Note |
| --- | --- | --- |
| FUN — functional | `FUN-WEB-####` | 1:1 |
| NFR — quality | `NFR-WEB-####` | 1:1 |
| CON — constraint | `CON-WEB-####` | also carries the scope boundaries |
| BUS — business rule | `BUS-WEB-####` | five rules; four of them were extracted from inside other requirements by DEC-0094 |

The Volere type number the method also asks for is not recorded yet; that
row of DEC-0085 §6 stays open.

## Statement grammar

`@leafcutter-strict/method-statement-grammar` gives each class one sentence
shape, and the requirement-shell contract records which one the description
follows in `form`:

| Class | Form | Shape |
| --- | --- | --- |
| Functional | F | `<condition>`, the `<actor>` SHALL `<action>` `<object>` |
| Quality | Q | `<scale>` of `<object>` SHALL be `<operator>` `<value>` `<unit>` measured by `<meter>` |
| Constraint | C | The solution SHALL `<limit>`, imposed by `<mandate and clause>` |
| Business rule | B | `<condition>`, `<subject>` `<is or counts as>` `<consequence>` |

The method defines exactly one variant per class, so the digit the contract
asks for reads: **`1` — the description is in that form**; **`0` — it is
not yet**. The method's own rule decides which: *"Compound statements. One
modal, one predicate. A statement joined by 'and' is split."* An enumeration
that is the object of one predicate is not a compound; two verbs joined by
"and" are. DEC-0092, DEC-0093 and DEC-0094 ran that split across the whole
set, so **10 of 273** are still at `0` and each of them says on the artefact
why: nine are the page rows `FUN-WEB-0010`…`FUN-WEB-0018`, a three-column
tuple the method has no form for (Q-0075), and `FUN-WEB-0068` is a target
picture whose values are UNKNOWN (Q-0010).

## The need above it

Every requirement carries `needs[]`, which the shell contract requires with
`minItems: 1` and explains in one line: *"At least one. A requirement without
a need is a defect of the run, not of the source."* DEC-0102 built the layer
and DEC-0103 wired it — **222 of 273 name a need, 51 carry `[UNKNOWN]`**.

`UNKNOWN` is not a placeholder to be filled in later with something
plausible. It says that no readable source states why the requirement exists
in terms of a stakeholder the specification lists, and each of the 51 falls
into one of two groups that DEC-0103 names and DEM-0063 addresses. A need
written to make a requirement resolve would be worth less than the
`UNKNOWN`, because it would look like evidence.

`check:specs` E24 validates the field; W9 reports the chain in both
directions.

## Fit criterion

Every requirement carries `fit_criterion`, which the shell contract requires
and types as a `oneOf`: a measure — `scale`, `operator`, `value`, optional
`unit`, `meter` — or the string `UNKNOWN`. DEC-0095 fills it from what
already checks the requirement: a quality requirement's own Q statement is
the measure, and every other requirement is measured by its acceptance
criteria passing, with the criteria named as the meter. Where **no**
acceptance criterion of a requirement is referenced by a test, nothing checks
it and the value is `UNKNOWN` — never a criterion nobody runs. `check:specs`
E18 validates the shape, W7 reports the fill rate.

`check:specs` E14 checks the form token against the class; W4 counts the
`0`s and names them. They are the burn-down, and they are honest.

## Source locator

`source` is the contract's `$defs/locator`: `source_id`, a `loc` of the form
`<file>#L102` — or `#P45`, `#¶12`, `#M45:12`, the four schemes
`@leafcutter-strict/method-identifier-and-locator-schema` tabulates — and an
`excerpt` of at most 25 words copied out of that exact position, in the
source's own language. DEC-0097 resolved all 273.

`loc` is `UNKNOWN` where the source supports no position scheme, and the
method says what that means: *"Where the source carries no position scheme at
all, the locator is `UNKNOWN` and the source is reported as unlocatable —
which is a defect of the source, not of the run."* The excerpt may still be
there — the words are evidence even where the position is not.

The contract's `source` holds **one** locator and this repository's
requirements often rest on several references at once. The full list is the
`## Source` section of the document, which also carries what the reading of
the source found: where the listed order misleads, where only half a
statement is in the source, where nothing in the source says it at all.
`check:specs` E19 validates the shape, W8 reports the fill rate.

Where a statement carried material the form has no slot for — the reason
behind the rule, a pointer to where something else is defined — that
material moved into a `## Rationale` or `## Notes` section of the same
document, word for word. The shell contract types `rationale` as its own
field for exactly that reason. Nothing was deleted.

The identifiers themselves are no longer a deviation. DEC-0086 moved every
family onto `<TYPE>-<DOMAIN>-<NNNN>`, taking the class tokens from the
requirement-shell contract, without reassigning a single number:
`WEB-F-007` became `FUN-WEB-0007`. `specs/traceability/identifier-map.md`
records the whole mapping.

## Conventions

- One file per requirement, named for its identifier (`FUN-WEB-0001.md`).
  The area is recorded on the artefact as `area:` and groups the index; it is
  organisational, the identifier is not.
- References into `go-to-market-os` are by ID and path — content is never
  copied (ADR-001). These references become `devDependencies` once the
  content packages are published.
- `UNKNOWN` is a valid value and carries the question that resolves it.
