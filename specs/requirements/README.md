# Requirements

## Purpose

Requirement shells extracted from the governed sources, grouped by class.
Every requirement carries an ID, a DRAFT status, at least one exact source
locator, and an evidence-sufficiency level. Statements use the shall-form.
Nothing here approves itself: a requirement becomes binding at its decision
point, not by being written down.

## Classes

| Folder | Class | ID prefix |
| --- | --- | --- |
| `functional/` | what the website does | `WEB-F-###` |
| `quality/` | how well it does it (performance, accessibility, privacy) | `WEB-Q-###` |
| `constraints/` | fixed decisions bounding the solution space | `WEB-C-###` |

This three-class split **deviates** from
`@leafcutter-strict/method-requirement-classification`, which classifies by
a four-step decision tree into FUN · NFR · CON · BUS and records the Volere
type number alongside. The mapping, and why it stands (DEC-085 §6):

| STRICT class | Here | Note |
| --- | --- | --- |
| FUN — functional | `WEB-F-###` | 1:1 |
| NFR — quality | `WEB-Q-###` | 1:1 |
| CON — constraint | `WEB-C-###` | also carries the scope boundaries |
| BUS — business rule | — | **no class here** |

The method is explicit that a business rule and the requirement applying it
are two artefacts, and that merging them hides the rule. Splitting them here
means a fourth ID family and an extraction pass over 155 rows, so it is
owed, not done. The id prefixes themselves stay: the method forbids
renumbering, and `WEB-F-###` is cited from sibling repositories and from
`plan/reviews/`.

## Conventions

- One file per requirement **area**; individual requirements are identified
  rows/sections within it. IDs are stable; files are organisational.
- References into `go-to-market-os` are by ID and path — content is never
  copied (ADR-001). These references become `devDependencies` once the
  content packages are published.
- `UNKNOWN` is a valid value and carries the question that resolves it.
