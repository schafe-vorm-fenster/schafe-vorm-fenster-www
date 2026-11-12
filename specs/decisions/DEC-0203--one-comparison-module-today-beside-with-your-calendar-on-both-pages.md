---
id: DEC-0203
title: One comparison module, today beside with-your-calendar, on /dein-kalender and /mitmachen
status: accepted
date: 2026-11-12
decided_by: jan-henrik.hempel
---

## Context

Issue #159, "NEXT2026 Neues Design für das Vergleichsmodul", with the owner's
design "Version 1a" (desktop and phone 390 px). Two sections said the same thing
in two layouts: on `/dein-kalender` the table "Heute / Mit eurem Kalender"
(four rows, `archive ground` beside `lime-100`, DEC-0172 §2), and on
`/mitmachen` the two halves "Die Nachbarn / Das Nachbardorf / Die Neuen" and
"Die üblichen Wege" on the archive ground, with a hand-off sentence above and
the closing line "Im Ehrenamt bleibt keine Zeit …" below (DEC-0117, DEC-0124,
DEC-0154). The issue makes them **one front-end component** that only changes
its content, and puts every problem directly beside its solution, on the
desktop and on the phone.

## Decision

1. **One component**, `comparison-table` (inventory 26), renders both sections.
   `/dein-kalender` passes four pairs (municipalities, TS-WEB-0024 D4),
   `/mitmachen` three (organisers, TS-WEB-0022 D3). Both read their pairs
   through one helper, `comparisonPairs()` (`app/[lang]/_comparison.ts`), off a
   Markdown table whose head is the two labels.
2. **The head is the kicker and the heading, nothing else.** The kicker stays
   "Warum es heute hakt" on both pages; the heading is the module's own `h2`.
   On `/mitmachen` the hand-off sentence above the section, the block "Die
   Nachbarn / Das Nachbardorf / Die Neuen", the detail lines of the usual
   channels and the closing line are removed; the three people now stand in the
   solution of pair 3. On `/dein-kalender` the heading becomes "Warum ein
   eigenes Terminmodul selten trägt", which the issue marks as a suggestion
   that is still open (owner question in the PR). The section takes the
   design's own padding (32 / 40 px on the phone, 64 / 72 px from `lg`) in
   place of the standard section edge.
3. **One block per pair.** *Today* on `surface`, *with your calendar* on
   `lime-500`, a straight edge between them and the radius on the outside only
   (24 px on the phone, 28 px from `lg`). A 52 px `ink` circle with the pair's
   topic glyph in `paper` stands with *today*, a 44 px `ink` circle with
   `arrow-right` on the edge between the halves (turned to point down while the
   halves stack). Labels "Heute" / "Mit eurem Kalender": `muted` on `surface`,
   `lime-900` on `lime-500`; the sentences `text-2` (400) and `ink` (700). Both
   circles are decoration (`aria-hidden`); the labels carry the meaning. The
   glyphs are the page's, in row order — `/mitmachen` `megaphone`, `clock`,
   `users`; `/dein-kalender` `monitor`, `users`, `smartphone`, `map-pin` — and a
   table whose row count differs from the page's glyph list fails the build.
4. **Where the design and the system differ, the system's value stands** (the
   owner's instruction for #159: tokens are binding, no literals, no new
   tokens):

   | Design | Built | Why |
   | --- | --- | --- |
   | `#171D0D` (circles, *with* text) | `ink` (`#000000`) | `#171D0D` is the ink retired by DEC-0155; TS-WEB-0017-A28 fails it |
   | `#EEF2E9`, `#A4D822`, `#F9FBF7`, `#606657`, `#2D3F01`, `#39412C` | `surface`, `lime-500`, `paper`, `muted`, `lime-900`, `text-2` | the same values, as tokens |
   | Labels 12 px / 0.1em, kicker 13 px / 0.12em | 15 px / 0.08em (`--type-label-size`, `--type-label-tracking`) | 15 px is the floor (SRC-0014 §Typography, TS-WEB-0002-A10), one tracking everywhere |
   | Glyph 26 px in the 52 px circle, arrow 22 px in the 44 px circle | 24 px both | `icon` knows 18 · 24 · 32 only (SRC-0014 §Icons) |
   | Phone layout up to 760 px | up to 767 px; side by side from `lg` (48rem, 768 px) | a media query takes one of the six breakpoint tokens (TS-WEB-0017-A4) |
   | Section 48 px at the sides on the desktop | the container's gutter | the layout grid owns the sides (DEC-0150) |

5. **What the system gains.** SRC-0014 §Comparison is rewritten for this
   design. Two exceptions are named there: the pair's outer radius (24 / 28 px)
   is a third radius value besides 0 and 999, for this module only; and the
   52 px topic circle is a third round ground for an icon besides the 40 px icon
   well and the 44 px control well.

## Consequences

- TS-WEB-0024 D4, A5 and A23 and TS-WEB-0022 D2, D3, A3 and A6 are amended
  (see the amendment notes there). `e2e/module-designs.spec.ts`,
  `e2e/pages/mitmachen.spec.ts` and `e2e/pages/dein-kalender.spec.ts` assert
  the new module; `e2e/objection-list.spec.ts` lost its subject on
  `/mitmachen` and is removed. `objection-list` and `archive-block` stay in the
  inventory; no page renders them now.
- Issues #44, #45 and #46 (the `/mitmachen` problem block) and #51 (the
  `/dein-kalender` didactics) are answered or overtaken by this design; the PR
  for #159 records which.
- The English heading and sentences are a draft translation, waiting for the
  owner (`state/open.md` row 294).
