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

This three-class split is a project convention pending local availability
of the STRICT Core Specification's classification method
(`method-requirement-classification`, Core Spec 4.2/5.9).

## Conventions

- One file per requirement **area**; individual requirements are identified
  rows/sections within it. IDs are stable; files are organisational.
- References into `go-to-market-os` are by ID and path — content is never
  copied (ADR-001). These references become `devDependencies` once the
  content packages are published.
- `UNKNOWN` is a valid value and carries the question that resolves it.
