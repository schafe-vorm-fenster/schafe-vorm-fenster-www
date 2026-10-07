---
id: DEC-0153
title: One story stage instead of three story sections, and the focal point lands above the reading band
status: accepted
date: 2026-10-07
decided_by: jan-henrik.hempel
---

## Context

Round 4's F-4-5 found the three value stories on `/dein-ort` stacking at full
weight, so they read as repetition rather than rhythm (`state/open.md` row
289). It was open because no pattern existed to build against.

On 2026-10-07 the owner delivered a board, *Geschichten Modul*, as a bundled
standalone HTML file with two variants:

- **1a**, *Ein Tag — Geschichten zum Durchklicken*: one stage, with a large
  picture and its quote beside the story of one hour. Three hours can be
  picked.
- **1b**, *Triptychon*: three cards side by side.

The owner chose **1a**. Because the module is large, it should not stand three
times in a row. One module should explain, in depth and vividly, rather than
three. The same review found a second problem: a photograph's motif sits under
the black overlay. The owner asked for a requirement on focal points and
cropping, and invited a solution.

## Decision

1. **The story stage is the pattern for a set of single-category stories.**
   - It is written into SRC-0014 § *Story stage* and the design-system
     contract (§1 `story-stage`, §2 one stage per page).
   - The board is imported unbundled as
     `concept/v2.0/Geschichten Modul.dc.html`, with renders at 1440, 820 and
     390 px in `concept/v2.0/assets/story-stage/`.
   - The board's photographs are the two already in `public/images/real/`.
   - Its scrim, `rgba(12,14,8,…)` up to 0.96, was replaced on import by the
     neutral ladder (DEC-0151). That is the third design input that arrived
     with a tinted scrim.
2. **On `/dein-ort`**, stories 1–3 render as one stage, "ein Tag im Dorf":
   08:30 Brot, 17:00 Rat, 20:00 Kultur.
   - The board supplies the copy. It is filed in the artifact's story slots
     (*Uhrzeit*, *Reiter*, *Schlagzeile*, *Erzählung*) and in the new slot
     `dein-ort-2b-story-stage`, in both locales.
   - Story 4, the radius story, stays its own section with the nearby module.
   - The stage stands after story 4, so the two dark grounds never touch.
   - Each hour shows one live date of its own category (DEC-0152's selector,
     now asked for all three categories).
   - The quotes follow DEC-0152 §6: Wendt closes the council story. The board
     showed Zschiesche there, but the board's copy is sample copy and the
     pairing was decided before.
3. **Picking without JavaScript.**
   - The hours are a native radio group; `:has(:checked)` shows the pick.
   - Every story shares one grid cell, so a pick never changes the height
     (layout stability).
   - Unpicked stories are `visibility: hidden`.
   - There is no auto-advance. The only auto-advance in the system is the
     explain module's.
4. **The focal point lands above the reading band.** The requirement
   (contract §2, `TS-WEB-0020-A17`): a photograph under text declares `focal`
   and an `anchor` with `y ≤ 38`. The solution:
   - `anchoredCropWindow` (`scripts/lib/focal-crop.mjs`, unit-tested) takes
     the largest window of the target ratio that puts the focal point
     exactly at the anchor. It zooms only as far as needed and never below
     the box's pixel width.
   - `pnpm images:generate` writes a 5:4 `stage` rendition from the Commons
     original, and the entry records `stage_file`.
   - The component sets `background-position` to the anchor, so the point
     lands there in any box ratio.
   - Measured: both photographs land their focal point at exactly 50 % / 30 %.
     Brietzig's focal point was set on the tower's middle (55/40) after a
     first try at 55/50 cut off the spire.
5. **The proxy's public-file list** (`src/lib/routes/landing-domain.ts`) gains
   the two stage files. Without them the proxy answered 404 with the files on
   disk, which is what that list's own test exists to catch.

## Consequences

- `TS-WEB-0020` D3 says how the stories render. `A4` and `A10` are amended
  (one stage plus one section, instead of four sections). `A16` (picking
  without JavaScript, height stable, keyboard) and `A17` (anchored focal
  point) are new, with tests in `e2e/pages/dein-ort.spec.ts` and
  `src/lib/content/stage-anchor.test.ts`.
- `state/open.md` row 289 (F-4-5) is resolved.
- Other pages adopt the stage when their story blocks are next composed.
  Today `/dein-ort` is the only page with a set of single-category stories.
- The hero and other photo surfaces can take an `anchor` the same way. They
  keep their centred cut until a page declares one.
