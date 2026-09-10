---
id: DEC-043
title: The brand typeface is Inter; Catamaran is retired
status: accepted
date: 2026-09-10
decided_by: jan-henrik.hempel
---

## Context

TS-002 D3 and TS-003 D3 were written against Catamaran, taken from the
brand profile as it stood on 2026-09-09. The hub's design system has since
moved: `@schafe-vorm-fenster/brand-design` sets Inter throughout and its
own kit records the change in as many words — "Catamaran's old rules" and
"Catamaran sunset. Roughly a dozen surfaces still load it."

## Decision

Inter is the website's typeface. Catamaran is not used, not loaded, and
not carried as a fallback.

**The rules survive the name.** Everything the two specs determined about
type remains in force and now applies to Inter: a weight floor for body
copy, a single self-hosted variable `woff2`, `font-display: swap`,
preloaded, within the 50 KB font budget, and contrast checked against the
brand palette. Only the family changes.

## Consequences

- TS-002 D3's weight floor is restated for Inter; the concrete value is
  [PROPOSED] until read from `@schafe-vorm-fenster/brand-design`.
- TS-003 D3's font row names Inter.
- Q-013 (Catamaran's readability) is superseded by Q-034, which asks the
  same of Inter and of the new colour system.
- Three brand packages are in play — the repo installs
  `@schafe-vorm-fenster/design-tokens` from the retired path while the hub
  publishes `brand-design` and `brand-identity`. Which one binds is
  Q-033.
