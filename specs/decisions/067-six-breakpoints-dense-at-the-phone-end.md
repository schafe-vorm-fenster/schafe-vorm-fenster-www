---
id: DEC-067
title: Six breakpoints, dense below the tablet — and why the spec's two were wrong
status: accepted
date: 2026-09-11
decided_by: jan-henrik.hempel
---

## Context

`brand-design` ships six breakpoint tokens: `xs` 360, `sm` 428, `md` 640,
`lg` 768, `xl` 1024, `2xl` 1280. TS-017 D2(b) had fixed **two** — and,
worse, had reused the names `md` and `lg` for 768 and 1024, which the
token set calls `lg` and `xl`. An implementation writing `md:` against
the tokens would have got 640 px where the spec meant 768, silently.

DEC-054 and DEC-056 had already ruled that the tokens win and the specs
propose no breakpoints. Neither recorded *why the scale has six*, so the
spec's reduction survived as text and read like an open proposal.

## Decision

**Six breakpoints, as the tokens define them, and the density below 640 px
is deliberate.**

Three of the six switch points sit under the tablet. That is the point of
the scale, not a leftover from a default: the primary audience arrives on
a phone (WEB-C-002), so the phone is the case to optimise rather than the
case to survive — and "phone" is not one width. A 360 px handset and a
428 px handset differ by nearly a fifth of the usable line. That is enough
room for a date row to earn its preview thumbnail, for a counter trio to
stop wrapping, for a label to sit beside its control instead of under it.
Treating both as one "mobile" spends the difference on nothing and tunes
the layout for neither device.

The upper three switch points exist for the opposite reason: to keep the
layout intact as the window grows, where width is deliberately not
maximised.

**What does not change:** the single-tree rule. Six switch points do not
license six layouts. A breakpoint may still change only spacing, type
step, image aspect and column count, and may never change block order,
block presence or wording. Density buys tuning, never a second component
tree — and without that rule a dense scale is an invitation to build the
phone layout twice.

## Consequences

- TS-017 D2(b) lists all six with their purpose; D2(c) takes the
  container measure from `measure.page` (1200 px) instead of its own
  960 px proposal. The withdrawn names are named as withdrawn, so the
  collision cannot be reintroduced from memory.
- TS-017 A4 checks that every `min-width` in the generated CSS is a token
  value — a literal px breakpoint at a call site now fails the build.
- **The verification regime samples the small range.** A criterion that
  looks only at 360 and 1280 cannot tell whether the dense end does
  anything. TS-017 A8 (layout identity) and A9 (no horizontal scroll)
  sample 360, 428 and 1280.
- TS-006 D3 gains 428 × 926 as a third reference viewport, explicitly
  *not* for the fold: it is more generous than 360 × 640 in both axes, so
  a fold check there could not fail on its own. It carries the
  small-range checks instead.
- The design-system contract's outstanding demand changes shape: a
  container width and outer gutter are owed **per breakpoint, all six**,
  and the three below 640 px are the ones nothing delivered so far
  answers.
- WEB-C-002 carries the reason, not just the source, so the next reader
  does not re-derive the reduction.
