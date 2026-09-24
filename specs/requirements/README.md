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

This three-class split **deviates** from
`@leafcutter-strict/method-requirement-classification`, which classifies by
a four-step decision tree into FUN · NFR · CON · BUS and records the Volere
type number alongside. The mapping, and why it stands (DEC-0085 §6):

| STRICT class | Here | Note |
| --- | --- | --- |
| FUN — functional | `FUN-WEB-####` | 1:1 |
| NFR — quality | `NFR-WEB-####` | 1:1 |
| CON — constraint | `CON-WEB-####` | also carries the scope boundaries |
| BUS — business rule | — | **no class here** |

The method is explicit that a business rule and the requirement applying it
are two artefacts, and that merging them hides the rule. Splitting them here
means a fourth ID family and an extraction pass over 155 rows, so it is
owed, not done.

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
