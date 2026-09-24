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
