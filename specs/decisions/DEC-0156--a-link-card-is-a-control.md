---
id: DEC-0156
title: A link card is a control — the context band as the owner drew it on 2026-10-12
status: accepted
date: 2026-10-13
decided_by: jan-henrik.hempel
---

## Context

The owner's review of 2026-10-12 (point 20, issue #39) called the context band
"Wikipedia in den 90ern" and delivered a new design for desktop, tablet and
phone (`plan/reviews/2026-10-12/Design - Kontextband Section - *.png`):
a heading, a mono kicker *"Auch interessant"*, and three **pill-shaped** cards,
each with an icon well on the left and a dark arrow disc on the right.

SRC-0014 §Shape and Space allows radius 999 for controls and the logo, `0` for
everything else. Q-0087 asked whether the cards may be pills: either a linked
card counts as a control, or the band takes a named exception.

The design's card lines are also shorter than the band slots' questions
("Wer den Dorfkalender macht" instead of "Du willst wissen, wer den
Dorfkalender macht?"), and they are statements, which is what CG-030 asks
for and what three of four blurbs were not (state/open.md rows 231, 232).

## Decision

Taken as the owner's design input; reversible by a later design decision.

1. **A whole-card link is a control** (answers Q-0087). Where the entire
   card is one link and the target, it takes the controls' radius, 999.
   This is not an exception for the band: any future card that is wholly a
   link may be a pill, and a card that only *contains* a link stays at 0.
2. **The band follows the design.** Heading line (Subhead role, set as a
   `p` that names the band's `nav`, not as an `h2`: it is a question, and
   CG-005 keeps questions out of section titles) with the mono
   kicker to its right from the tablet tier on, below it on the phone. Three
   cards: a 40 px `lime-100` icon well with a `lime-800` Lucide glyph (one per
   job: `map-pin`, `megaphone`, `monitor`, `users`), the job label in bold and
   the blurb beneath, a 44 px `ink` (neutral black) disc with a `lime-500`
   arrow. One card per row on the phone, two from `lg` (the tablet frame),
   three in one row from `xl`.
3. **The card's fill is never its ground**: `paper` on the band's `surface`;
   the merged closing block (`/ueber-uns`, `/ueber-uns/archiv`,
   `/rechtliches`) stands on `paper`, so its cards take `surface`.
4. **The blurbs are the owner's lines from the design** — statements, so no
   card renders `data-demo` any more. The publish line stays the owner's
   earlier sentence (CG-030 example); it is not in the design, which shows
   the band of a page whose focus job is publishing.
5. **On the phone the band stays a full-width `surface` section.** The
   rounded field of the phone frame is not built as a panel inside the
   section: SRC-0014 forbids a padded card inside a padded section, and a
   `surface` panel on a `surface` section would not show. The cards stack on
   the section's own ground.

Issue #40 rides along: the home page's closing heading loses the "Dann" that
referred to nothing — *"Schau nach, was bei dir los ist."*, English
*"See what's on where you live."*

## Consequences

- SRC-0014 §Page chrome revised → Context band records the answer;
  `specs/contracts/design-system-contract.md` row `context-band` drops the
  open question; TS-WEB-0006 D5 gains a *Form* row.
- `TS-WEB-0017-A35` (`e2e/context-band.spec.ts`) measures the form at 390,
  820 and 1440 px: three cards, the per-row count, pill radius, a 40 px well,
  a 44 px neutral-black disc, a fill that is not the ground, no line cut off.
- Q-0087 is closed; state/open.md rows 231 and 232 are resolved.
