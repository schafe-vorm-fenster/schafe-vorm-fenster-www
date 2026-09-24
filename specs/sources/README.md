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
  `@leafcutter-strict/method-identifier-and-locator-schema` wants the finest
  granularity a source supports — `#L102`, `#P45`, `#¶12`, `#M45:12` — plus
  the excerpt on every locator. The rows here carry a source id and
  sometimes a section. That gap is owed (DEC-085 §6); closing it means
  re-reading all 18 sources.
- Trust is `high | medium | low | unusable` with a one-line rationale. The
  vocabulary is the source-inventory contract's and `pnpm check:specs`
  validates the column against it (E13). What is **not** recorded is the
  six-dimension vector
  (`@leafcutter-strict/method-source-quality-rating`: locatability,
  authority, currency, completeness, specificity, internal consistency,
  each 0–3, trust = the minimum, never the average). Only the derived level
  survives here, so the vector cannot say what to fix. Owed.
- Evidence sufficiency per requirement follows
  `@leafcutter-strict/method-evidence-sufficiency-rating`, read here as:
  `S0` no source · `S1` single unconfirmed source · `S2` corroborated or
  high-trust source · `S3` confirmed by an explicit decision (`DEC-###`).
  The `S0–S3` set itself comes from the requirement-shell contract.
