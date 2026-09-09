# Sources

## Purpose

The source inventory: every input the specification draws from, registered
with a stable ID, a locator, a trust rating, and a reading status. Nothing
enters a requirement without an entry here (STRICT: source inventory is the
first cold-start artefact; no statement without an exact source locator).

## Contents

- `source-inventory.md` — the L0 source set, `SRC-###` IDs

## Conventions

- Locators are `<repo>/<path>#<anchor-or-section>`; excerpts max 25 words.
- Trust is rated `high | medium | low` with a one-line rationale. The full
  six-dimension rating of STRICT 13.4.1 is applied once the Core
  Specification is available locally; until then this coarse scale is a
  documented project convention.
- Evidence sufficiency per requirement: `S0` no source · `S1` single
  unconfirmed source · `S2` corroborated or high-trust source · `S3`
  confirmed by an explicit decision (`DEC-###`).
