---
id: DEC-0182
title: Every explain graphic fills its pane, and the square floor below lg is the pane's, not the stage's
status: accepted
date: 2026-10-28
decided_by: jan-henrik.hempel
---

## Context

The owner reported on 2026-10-28, with screenshots of `/` at phone, tablet
and desktop width, that the explain module's three graphics are not equally
tall from `lg`, and that below `lg` an empty band stands between the stage
and the step lines.

The contract already says what should happen: "the other states stretch to
the tallest" (`specs/contracts/design-system-contract.md`, row
`explain-module`; SRC-0014 §Explain module). The implementation stretched the
**pane** to the tallest, but every graphic in it kept its own
`aspect-ratio: square`, so a square graphic ended short of a pane the
calendar had grown. Below `lg` the track's floor was also a square of the
**stage's** width (`100cqi`), while a pane is 82 % of it — a square graphic
in a stage-wide square leaves 18 % of the width as an empty band.

Measured on 2026-10-28 (dev server, `/` and `/mitmachen`): the gap between a
graphic's bottom and its pane's bottom was, for the image and chat states,

| width | 390 | 768 | 1024 | 1280 | 1584 |
| --- | --- | --- | --- | --- | --- |
| before | 111 px | 261 px (533 px on `/mitmachen` path 2) | 127 px | 41 px | 36 px |
| after | 0 | 0 | 0 | 0 | 0 |

The calendar state was always flush, because it is the one that grows.

## Decision

1. **Every graphic fills its pane** at every width. The pane is a flex
   column and its graphic takes `flex: 1 0 auto`; the graphic's own square is
   its floor, the pane's height is its size. This is the contract's
   "stretch to the tallest", now applied to the graphic and not only to its
   box.
2. **Below `lg` the square floor is the pane's**: the track's minimum height
   is the pane share (`--explain-pane-share`, 0.82) of the stage's width, not
   the whole width. "At least `ratio-square`" in SRC-0014 and TS-WEB-0022 D4
   means a state is at least as tall as it is wide.

## Consequences

- No state change and no breakpoint leaves an empty band between graphic and
  step lines. The stage keeps one height across its states (TS-WEB-0022-A19).
- A graphic in a grown pane is taller than square. The drawings are SVG with
  `slice` or `meet` on a token ground and the photo frame covers, so the
  ground continues; nothing is distorted.
- A very tall calendar now stretches the other two graphics with it. At
  768 px on `/mitmachen` path 2 a badge row squeezes the stacked meta into a
  one-character column and grows the calendar to 757 px; that was already the
  pane height before this decision and is a defect of the calendar row, not
  of this one.
- Verified by `e2e/explain-module.spec.ts` (TS-WEB-0022-A19: stage as tall as
  its panes, each at least square, each graphic as tall as its pane) and
  `e2e/explain-calendar.spec.ts` (TS-WEB-0017-A44: every graphic fills its
  pane at twelve widths).
