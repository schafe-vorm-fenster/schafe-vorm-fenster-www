---
id: DEC-0150
title: Surfaces run full-bleed, content stands in a 1200 px container — the desktop grid from the owner's design input
status: accepted
date: 2026-10-07
decided_by: jan-henrik.hempel
---

## Context

Round 4's editorial review found desktop content stretched across the full
viewport (F-4-1, `state/open.md` row 288). At 1280 × 800 the hero `h1` spanned
1214 px and the search field 1091 px. DEC-0149 deliberately left the value
open, because it "need[s] a designer's judgment … not a number invented here".
`DEM-0042` had asked the design system since Q-0058 for a container width and
outer gutter per breakpoint, and none existed.

The judgment arrived on 2026-10-07 as a design board, *Desktop-Raster ·
Vorgabe — Flächen randlos, Inhalt im Container*, delivered as a bundled
standalone HTML file. It is imported unbundled as
`concept/v2.0/Desktop Raster.dc.html`, and its two 1440 px screens are
rendered to `concept/v2.0/assets/desktop-raster/`. Every asset it carried is
byte-identical to a file already in `concept/` (logo, both hero photographs,
the `support.js` runtime), so nothing new is committed except the board and
its renders.

## Decision

The board's grid is adopted as written into
`concept/website-design-system.md` § *Layout Grid*. The values:

1. **Three tiers on the existing six breakpoints.** Mobile below `md`
   (640 px): one column, 16 px margin. Tablet from `md`: eight columns, 32 px
   margin, 20 px gutter. Desktop from `xl` (1024 px): twelve columns, 24 px
   gutter, at least 48 px margin. No new switch point: 640 and 1024 are
   token values, so `TS-WEB-0017-A4` holds unchanged.
2. **A 1200 px content box.** Header, hero content and every section share
   it, so they start on one left edge. The 1200 px is the content and the
   margins lie outside it. `measure.page` names the value; the container is
   `measure.page` plus two margins.
3. **Surfaces stay full-bleed.** Photographs and colour sections run across
   the viewport, as the guide already said.
4. **Placement from `xl`.** Hero text in columns 1–7, bottom-left, never
   centred. Search in columns 1–6. Running text at most 7 columns, headlines
   at most 8. Two-column sections put the head in 1–4 and the list in 5–12.
   Comparisons are 6 + 6. Buttons sit side by side with a 12 px gap.
5. **Hero height from `xl`.** `/` takes `min(80vh, 680px)` and content pages
   take `min(70vh, 560px)`. This replaces `ratio-hero` from `xl`.

**The board is normative for position and width only.** Its display sizes
are 72/64/56/48 px and its header carries a navigation pill. Both contradict
rules the guide already holds, the *Typography* table and the *Transparent
overlay header*, and neither is adopted by this record. The board also arrived
with a dark-green, `ink`-tinted scrim. That scrim was replaced on import by
the neutral-black ladder (DEC-0151). The guide says so at the section, so a generator reading the board
does not take them as rules.

## What this amends

- **DEC-0116 §4** ("the CTA slot is a column at every width") now holds
  **below `xl`**. From `xl` the slot is a row with `space-3` between buttons,
  and it wraps. The amendment is noted at that section.
- **DEC-0132 / `ratio-hero`**: the 21:9 hero aspect now applies only from `lg`
  up to `xl`. From `xl` the height of item 5 applies. Both heights are
  declared before paint, so the reserved-space rule (`DEC-0056`) holds.
- **The two-column switches at `lg` (48rem)** in the components move to `xl`.
  `explain-module` is not one of them: its three steps side by side are that
  component's own rule, and the contract pins its `lg` switch.
- **DEC-0069 §1 is confirmed, not amended.** 1200 px stays. What changes is
  that the value is the content box rather than the padded box. `measure.text`
  stays the cap on running text, and the 7-column span is the tighter cap
  from `xl`.
- **DEC-0067 is untouched.** The scale stays dense below 640 px. The grid
  does not use `xs` or `sm`, and a component may still tune type or spacing
  there.

## Consequences

- `DEM-0042` is answered by the six-row table in § *Layout Grid*.
- `DEM-0071` opens against `@schafe-vorm-fenster/brand-design`. The space
  scale has no 20 px step (0.25 · 0.5 · 0.75 · 1 · 1.5 · 2 · 3 · 4 · 6 · 8 rem),
  so the tablet gutter cannot be written without a literal until one ships.
- `Q-0085` opens: the board draws no tablet screen, so the column placement
  of hero text, search and headlines in the eight tablet columns is not
  designed. Until it is answered they take the full content width, capped by
  `measure.text`.
- `specs/contracts/design-system-contract.md` §2 binds the grid. Its first
  bullet ("container width and outer gutter per breakpoint — all six") is
  now a rule rather than a gap.
- `TS-WEB-0017 D2(c)` names the content box and the tiers.
- **Acceptance criteria and code arrived together, the same day.**
  `TS-WEB-0017-A23`–`A27` (edges and content box, column spans, hero height,
  CTA row, head 1–4 / list 5–12). Each has its test in
  `e2e/layout-grid.spec.ts` or `e2e/photo-surface.spec.ts`, so the backlog did
  not grow (`TS-WEB-0017 D6c`). `A9`'s test now measures the content box. The
  code:
  - `app/styles/base.css`: the per-tier margin and gutter, `.container` as
    content box plus margin, `container-type: inline-size`, and `--span-4/6/7/8`
    in `cqi`. Headlines are capped at 8 columns and paragraphs at
    `min(measure.text, 7 columns)` from `xl`. The 24 px gutter at `sm` is gone,
    because every phone width takes 16 px.
  - `photo-surface`: `.content` is a `.container`, and from `xl` it has the
    capped hero height with `ratio-hero` switched off. A `heroSize`
    (`home` | `page`) prop is set to `home` on `/` only.
  - `hero-block`: `h1` and lead in 7 columns, search in 6, and the CTA slot as
    a row from `xl`.
  - `live-module-frame` `layout="split"`, used for the live dates on `/`.
  - `objection-list`, `origin-story`, `comparison-table`, `howto-block`,
    `proof-stream`, `site-footer` and `/ueber-uns` move from 48rem to 64rem,
    with `--grid-gap` between columns. `explain-module` keeps its `lg`.
  - `archive-filter`: an unpressed chip carries the check's width as inline
    padding, so pressing one no longer widens it. The narrower 928 px content
    box at 1024 px had made the chip row re-wrap on a click (0.5040 against
    `TS-WEB-0028-A13`'s 0.5 after-input guard; 0.2148 before).
  - Measured on the dev server: at 1440 the logo, hero `h1` and sections
    start at x = 120, the `h1` is 690 px, the search 588 px, the content
    1200 px, and the hero is 680 px on `/` and 560 px elsewhere. At 1280 the
    edge is x = 48 and the content 1184 px.
- `.agents/roles/developer.md` dropped its stale "breakpoints 768/1024 only"
  and points at § *Layout Grid*. The page-implementation dispatch already
  globs `concept/v2.0/*.dc.html`, so the board reaches every generator without
  a dispatch change.
