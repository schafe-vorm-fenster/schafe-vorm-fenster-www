# Sources

## Purpose

The source inventory: every input the specification draws from, registered
with a stable ID, a locator, a trust rating, and a reading status. Nothing
enters a requirement without an entry here (STRICT: source inventory is the
first cold-start artefact; no statement without an exact source locator).

## Contents

- `source-inventory.md` — the L0 source set, `SRC-####` IDs

## Conventions

- Locators are `<repo>/<path>#<anchor-or-section>`; excerpts max 25 words.
  `@leafcutter-strict/method-identifier-and-locator-schema` wants the finest
  granularity a source supports — `#L102`, `#P45`, `#¶12`, `#M45:12` — plus
  the excerpt on every locator. All 18 sources were read and every
  requirement's locator resolved (DEC-0097): the position lives on the
  requirement, and the `Sch.` column here records which scheme each source
  supports. `SRC-0006` supports `none` — it is one line with no line
  terminators — and `SRC-0016` is not readable from this repository at all.
- Trust is `high | medium | low | unusable`, and it is **computed, not
  asserted**: the six-dimension vector of
  `@leafcutter-strict/method-source-quality-rating` — locatability,
  authority, currency, completeness, specificity, internal consistency, each
  0–3 — and the level is the **minimum**, never the average. The vocabulary
  is the source-inventory contract's; `pnpm check:specs` validates the column
  against it (E13) and recomputes the level from the vector (E20), so a level
  that disagrees with its evidence is an error. DEC-0098 scored all eighteen
  and 15 of the 18 levels changed, none of them because a source did. The
  vector is kept beside the minimum because the vector says what to fix.
- Evidence sufficiency per requirement follows
  `@leafcutter-strict/method-evidence-sufficiency-rating`, read here as:
  `S0` no source · `S1` single unconfirmed source · `S2` corroborated or
  high-trust source · `S3` confirmed by an explicit decision (`DEC-####`).
  The `S0–S3` set itself comes from the requirement-shell contract.
