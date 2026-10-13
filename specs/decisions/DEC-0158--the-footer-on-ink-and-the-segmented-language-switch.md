---
id: DEC-0158
title: The footer stands on ink, the language switch becomes a segmented control of two links, and the copyright line takes `line` and the imprint's legal name
status: accepted
date: 2026-10-13
decided_by: the engineering team
---

## Context

The owner's review of 2026-10-12 (DEC-0154, issue #42) redesigned the site
footer: neutral-black ground, logo left, the language switch as a segmented
control *Deutsch | English* right, a hairline, the three legal links and a
copyright line. SRC-0014 §Site footer wrote the design down; three points of
it could not be built as written, and one earlier decision stood in the way.

## Decisions

1. **The switch is two links, the current one marked `aria-current="page"`.**
   DEC-0120 rendered only the other language, framed by an invitation sentence
   ("Read this page in English:"), and its tests asserted that no
   `aria-current` exists. The segmented control shows both languages, so that
   form is replaced: one `<a>` per language to the equivalent page, `hreflang`
   and `lang` on each, the current one carrying `aria-current="page"` and the
   `lime-500` fill. Navigation, not a radio group — the issue asks for exactly
   that. The invitation sentence and its placeholder marking leave the
   dictionary; `state/open.md` row 235 is resolved. TS-WEB-0001 D5 is amended
   and `TS-WEB-0001-A12` holds it. A7 (equivalent page) is unchanged.
2. **The copyright line is `line`, not `muted`.** SRC-0014 said `muted`; on
   `ink` it measures **3.54:1**, under the 4.5:1 floor, and `border` measures
   4.37:1. `line` (#D1D6CB) measures 14.19:1 and is the nearest neutral that
   clears; the legal links stay `paper` (20.17:1) and bold, so the two still
   read apart. The guide is corrected and `check:contrast` gains the four
   footer pairs (paper/ink, line/ink, ink/lime-500, focus-dark/ink).
3. **The copyright holder comes from the imprint.** TS-WEB-0011 D4 forbids
   identity data in code, so the holder is `content/legal/imprint.md`'s legal
   name through the parse the `Organization` structured data already uses,
   resolved in the layout (`app/[lang]/_footer-data.ts`, `"use cache"`) and
   handed to the client chrome. The year is the render year. An empty holder
   renders no line.
4. **Focus on ink is `focus-dark`.** The light ring (violet) would all but
   vanish on black; the footer scopes `--focus` to `--color-roles-focus-dark`
   (`lime-400`, 13.66:1).

The track behind the segments is `ink` mixed with 13 % `paper` (`#202120`) —
tokens only, no new hex. It is a container, not a control edge; the segment
labels carry the contrast (15.52:1 for `paper`, 12.42:1 for `ink` on
`lime-500`), and the `lime-500` fill is never the track it stands on (A29).

## Consequences

- The phone menu uses the same switch; its ground is `ink` too, so the
  `tone` prop is gone.
- The footer's control count is 5 (three legal links, two segments), up from 4.
- `TS-WEB-0017-A41` and `A42` hold the design and the copyright line.
