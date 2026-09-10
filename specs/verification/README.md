# Verification

## Purpose

The last link of the STRICT chain: goal → need → requirement → tactical
spec → **verification**. This folder holds the test strategy and the
journey specifications; the tests themselves live in the code
(`src/**`, `e2e/**`), linked back by ID.

## Contents

- `verification-strategy.md` — levels, naming, and the closure rules
- `journeys/*.feature` — Gherkin specifications of the four jobs

## The rule

Traceability rides on IDs, not on a uniform test format
([DEC-040](../decisions/040-verification-architecture.md)). Every
acceptance criterion carries a global ID and a level; every test names
the ID it verifies; `pnpm check:specs` reports the gaps.
