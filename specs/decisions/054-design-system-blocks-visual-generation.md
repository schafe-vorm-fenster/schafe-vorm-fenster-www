---
id: DEC-054
title: Visual generation waits for the component layer, not for tokens
status: accepted
date: 2026-09-10
---

# DEC-054 — Visual generation waits for the component layer

## Decision

Generation of the visual layer waits for the design system. Everything
that does not depend on it — routing, content pipeline, relevance engine,
BFF, analytics, security, delivery — proceeds.

**Corrected 2026-09-10.** An earlier version of this record described the
design system as "announced but not delivered". Read from the installed
package, that is wrong: `@schafe-vorm-fenster/brand-design` v2.6.0 already
ships a substantial system — six breakpoints, the space scale, radius,
border (with contrast ratios in the values), shadow, touch targets,
measure, logo and button tokens, category display, print tokens, a dark
palette, and responsive type via `clamp()`.

What is missing is one layer up: **components and composition**. The
outstanding contract is stated in
`specs/contracts/design-system-contract.md`.

## Consequences

- The gate is narrower than it was: not "wait for a design system" but
  "wait for the component manifest and the composition rules".
- TS-017 D2's breakpoint proposals are superseded by the token values —
  the specs consume `breakpoint.*` and propose nothing.
- Q-023 stays open against the narrowed contract.
