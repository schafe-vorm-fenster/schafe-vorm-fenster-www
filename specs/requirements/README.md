# Requirements

## Purpose

Requirement shells extracted from the governed sources, grouped by class.
**One requirement is one document**, named for its identifier — the shape
`@leafcutter-os/schemas` types as `spec/requirements/<id>.md`, level L3, and
`@leafcutter-strict/library-schemas`' `requirement-shell` contract records as
"a single requirement". Each carries its ID, its class, its status, at least
one source locator and an evidence-sufficiency level in frontmatter, and its
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
| BUS — business rule | `BUS-WEB-####` | one rule so far, `BUS-WEB-0012` |

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
not yet**, and the statement is the one extraction wrote, kept word for
word because recasting it would drop a qualification no slot holds. The
method's own rule decides which: *"Compound statements. One modal, one
predicate. A statement joined by 'and' is split."* Splitting makes new
artefacts, which this wave did not do.

`check:specs` E14 checks the form token against the class; W4 counts the
`0`s and names them. They are the burn-down, and they are honest.

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
