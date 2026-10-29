---
id: DEC-0190
title: On the phone the burger is a track that carries the page's job
status: accepted
date: 2026-10-29
decided_by: jan-henrik.hempel
---

## Context

The owner's reference for the closed phone header (2026-10-29, "5a/5b"): the
mark on the left, beside it a track across the rest of the bar with the burger
at its right end, and inside the track the current job as a paper pill. "Aktiv
ist von oben nach unten Punkt 1 bis 4. Die Pille wandert in der Spur – wie am
Desktop, wo sie auch an ihrer Position sitzt." Tapping the bar opens the menu
overlay of DEC-0189.

## Decision

1. **Below `md` (40rem)** the burger of a page that belongs to one of the four
   jobs — the job itself or an ancestor in its trail (`register` → `takePart`,
   `order` → `calendar`, `archive` → `about`, `placeStart` → `place`) — is the
   track: the header's well, the job as a pill in the desktop row's
   current-page pair, the stripes at the right end. The whole track is the
   one button; its accessible name starts with the pill's text.
2. **The pill steps** one `space-2` per menu position (0–3).
3. **Pages outside the jobs** (`/`, the region pages, `/rechtliches`, 404) keep
   the round 44 px burger.
4. The mark is 48 px on the phone, matching the track; 40 px from `md`.
5. From `md` the track is the round burger again; desktop is untouched.
6. **Type size, deviating from the 15 px label floor**: the pill is
   `clamp(0.75rem, 3.4vw, label size)`, about 12 px at 360 px, as the
   reference draws it. "TERMINE VERÖFFENTLICHEN" does not fit the track at
   15 px on a 360 px screen (measured with the real face). Below about 340 px
   the longest label is cut with an ellipsis.

**Amendment 2026-10-29 (owner):** `/` carries "Was ist los" (its focus job,
first step) in the track. The desktop row still marks no job on `/`. Item 3
now covers the region pages, `/rechtliches` and 404 only.

## Consequences

`e2e/site-header.spec.ts` asserts the four states, the stepping, that the pill
opens the menu, that the longest label fits at 360 px, and the round burger
on `/rechtliches`.
