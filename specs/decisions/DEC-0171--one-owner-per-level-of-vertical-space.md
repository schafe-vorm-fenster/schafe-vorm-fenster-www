---
id: DEC-0171
title: One owner per level of vertical space — the section owns its padding, a content stack owns the gap between blocks, a block brings no outer margin
status: accepted
date: 2026-10-27
decided_by: jan-henrik.hempel
---

## Context

The owner's review of 2026-10-27 found blocks touching inside a section on
three pages and asked how the grid and the sections are built, "because this
should not happen if the layout implements clean blocks and sections":

- **#90** — on `/mitmachen` the button "Jetzt meine Webseite anmelden" (the
  last element of the third path module) stood at 0 px above the hint
  banner.
- **#108** — on `/ueber-uns` the first story card stood at 0 px under the
  chapter-03 heading; on `/ueber-uns/archiv` each year heading stood as close
  to the link above it as to the entries it names.

The review `plan/architecture/2026-10-27-frontend-layout-review.md` measured
every route at 390 and 1280 px (`scripts/measure-block-gaps.ts`) and traced
all three to one gap in the architecture: **nothing owned the space between
two blocks of a section.** `section-shell` owned its padding and the grid
owned width, but between the blocks the space was whatever margin the first
one happened to carry — 16 px after a paragraph or a heading (the element
defaults in `app/styles/base.css`), 0 px after a component (components carry
no outer margin, correctly), 24 px where a page added one. #108 added two
variants of the same hole: a wrapper (`motion-reveal`, a page's own `div`)
grouped several blocks with no rule for the space inside it, and a page that
asked for the space through a `className` margin on another component lost
the cascade to that component's own `margin: 0` in the production build.

## Decision

1. **Three levels, one owner each** (SRC-0014 §Shape and Space, *Who owns
   which space*). The section owns its `padding-block`. Its content box is a
   **content stack**, marked `data-stack`, which owns the space between its
   direct children. A block owns nothing outside its own box.
2. **The stack's values are tokens and do not step.** `--block-gap` is
   `space-4` (16 px) at all six breakpoints — the step a paragraph and a
   heading already kept, so running text reads as before and only the
   accidental gaps change. `--block-gap-bound` is `space-2` (8 px), the
   kicker's distance to the block it names. A larger or stepping value is a
   later owner decision, not an implementer's.
3. **The primitive is one global rule** in `app/styles/base.css`:
   `[data-stack] > *` clears `margin-block`, every child after the first gets
   `--block-gap`, a child after `[data-kicker]` gets `--block-gap-bound`. It
   carries (0,2,0) so that a component root's single-class `margin: 0` cannot
   take the gap away whatever order the stylesheets arrive in. `section-shell`
   marks its container; `motion-reveal` is a stack; a page's own grouping
   wrapper (a year of the archive) is a stack.
4. **Guards.** `TS-WEB-0017-A31` (`e2e/block-gaps.spec.ts`) walks every
   stack on every route in both languages at 390 and 1280 px and fails on a
   gap under the token, on a block whose computed margin is not the stack's,
   and on a margin at a stack's edge. `TS-WEB-0017-A32` (`pnpm check:brand`)
   fails a class passed as `className` to a component that declares a
   vertical margin; the seven hand-ins it found inside components are named
   in the script and the list may only shrink.

## Consequences

- #90 and #108 are fixed at the cause, not at the three places: the path
  module and the banner stand 16 px apart, the stories 16 px under the
  chapter, a year heading 32 px under the entry before it and 16 px above its
  own.
- The same rule fixed what the review measured elsewhere: the order flow
  (`/dein-kalender/bestellen`, seven pairs at 0 px), the register flow's step
  indicator against its `h1`, two paragraphs at 0 px on `/deine-region`, the
  counter pill against the search hint, and the home page's hand-off at
  24 px. A section that ends on a paragraph no longer adds the paragraph's
  16 px to its padding — the defect `section-shell`'s own comment described
  and its second selector never fixed (DEC-0129 §12).
- Spacing that stays a component's own is out of the stack's reach and
  correct there: the hero's text stack, the story stage's heading and lead,
  the price tiers as hairline rows, a photo credit under its quote.
- Not done here, recorded in the review as follow-up: the five components
  that re-implement section padding inside a section (`price-band`,
  `price-tier-row`, `publishing-path`, `_pages.module.css .benefitBand`,
  `archive-block`'s own padding) and the seven `className` margins A32 lists.
