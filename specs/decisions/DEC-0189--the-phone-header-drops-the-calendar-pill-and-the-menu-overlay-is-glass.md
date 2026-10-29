---
id: DEC-0189
title: The phone header drops the calendar pill, and the menu overlay is the blurred page
status: accepted
date: 2026-10-29
decided_by: jan-henrik.hempel
---

## Context

The owner's review of 2026-10-29 sent a reference for the phone menu: the
closed bar without the calendar pill, and the open overlay as a darkened,
blurred view of the page with the four jobs in Label-mono rows, the current
one a translucent pill, no calendar button, and the language switch centred
at the foot.

## Decision

1. **Below `md` (40rem) the bar is the mark and the burger.** The calendar
   pill (`HEADER_CALENDAR_ENTRY`) returns at `md`. Its destination, `place`,
   is the overlay's first job ("Was ist los"), so no destination becomes
   unreachable. Without JavaScript the burger cannot open, so the pill stays
   in the bar on the phone (`@media (scripting: none)`).
2. **The overlay is glass.** `backdrop-filter: blur(24px) saturate(120%)` over
   `scrim-72` (the blur primitive's tint ceiling, DEC-0105 §4); paper on it
   stays above 8:1 even over a paper page. No blur support or
   `prefers-reduced-transparency: reduce` → the solid ink sheet it was.
3. **Rows**: Label-mono, upper case, tracked, 1.2 × the label size, full-width
   pill targets of `--target-comfortable`; the current page a translucent
   paper fill (with `aria-current`), hover a lighter one. No dividers, no
   calendar button.
4. **Language switch**: `tone="glass"` — translucent paper track, current
   segment a stronger translucent fill — centred at the overlay's foot. The
   footer keeps the solid tone.
5. Breakpoints: the overlay only exists below `xl` (64rem); the desktop row
   from `xl` and its centring from 80rem are untouched.

## Consequences

TS-WEB-0017-A12 ("the calendar entry in the header of every page") is walked
from `md` up; on the phone the e2e asserts the pill is absent and the
overlay's first job carries its target. The tablet tier (40–64rem) keeps
pill and burger and gets the same overlay.
