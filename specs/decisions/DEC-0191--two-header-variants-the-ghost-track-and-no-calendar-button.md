---
id: DEC-0191
title: Two header variants, the track spreads its ghost layers, and the calendar button leaves the header
status: accepted
date: 2026-11-12
decided_by: jan-henrik.hempel
---

## Context

Owner feedback on PR #140 (issue #139), 2026-11-12. The ghost layers of
DEC-0190 were 8 px slivers beside an empty well; the logo sat close to the
track; and the header had three shapes (phone track, tablet round burger plus
lime "Kalender" button, desktop row plus button).

## Decision

1. **Two header variants, at every width.** Wide, from `xl` (64rem): the mark
   and the four job labels inline. Below it, down to the smallest phone and
   **including the tablet**: the mark and the track (pill and burger). The
   round burger plus calendar button of `md` is gone. A page outside the four
   jobs keeps the plain round burger in the narrow variant.
2. **The breakpoint is `xl`, measured.** With the real face the mark (40 px),
   the wordmark (90 px), the gap (12 px) and the label row (681 px) need 823 px
   of content width. `lg` (768 px) offers 704 px, `xl` (1024 px) 928 px, so `lg`
   does not fit and `xl` is the smallest token that does. The owner's estimate
   was "about 1000 px". No new breakpoint token.
3. **The calendar button (`HEADER_CALENDAR_ENTRY`) is removed from the header
   entirely**, at every width, and from the code (`navigation.ts`, the
   `calendarButton` dictionary keys). Its destination, `place`, stays the first
   job label and the first row of the menu. This **contradicts TS-WEB-0004 D4
   ("persistent \"Kalender\" button"), FUN-WEB-0137, TS-WEB-0017 D4/A12 and
   DEC-0189 §1**; the specification carries the truth (DEC-0104 §1), so those
   artefacts are amended and the deviation from the source is recorded on
   FUN-WEB-0137 and as DEM-0077. Without JavaScript the narrow bar now offers
   no navigation at all (the burger needs script); the footer stays reachable.
4. **The ghost layers share the free width** (supersedes DEC-0190 §2). The
   track is a flex row: a slot before the pill, the pill, a slot after it, the
   stripes. The slots grow in the ratio `index : (3 - index)`, so the free
   width (track minus pill minus stripes) is shared in thirds and the pill sits
   `index` thirds along it. A layer for each job before the pill lies in the
   first slot, one for each job after it in the second; layer k reaches k thirds
   out from the pill and runs on under it. Layers are translucent, fully
   rounded and overlap, so the nearer ones are darker. At 360 px the longest
   label ("Termine veröffentlichen") leaves almost no free width, so its layers
   are barely visible there; the label fitting wins.
5. **More room between the mark and the track**: `space-6` between them from
   22.5rem (`xs`) up, `space-3` below it so the longest label still fits.
   Between the last layer's rounding and the stripes (owner, second review
   2026-11-12): `space-2` below `xs`, `space-3` from `xs`, `space-4` from
   `md`. `space-4` at 360 px cuts the longest label by 3 px (measured).
6. The layer colour is ink at 24 %, an assumed value and not a design-system
   token. It is the owner's to set.

## Consequences

`e2e/site-header.spec.ts` asserts the two variants and the switch between
1023 px and 1024 px, the track and the layer count per index at 360 and 768 px,
and that no calendar link stands in the header. The A12 walk (calendar entry on
every page) is withdrawn with the entry, which moves the coverage ratchet
(`specs/verification/coverage-budget.json`) MISSING 146 -> 147: criterion
TS-WEB-0017-A12 is let go with the element it asserted.
