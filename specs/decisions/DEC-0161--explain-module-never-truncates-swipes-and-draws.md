---
id: DEC-0161
title: The explain module never truncates, swipes below lg, and draws the WhatsApp path; the /mitmachen hero is an AI-edited real photograph
status: accepted
date: 2026-10-13
decided_by: jan-henrik.hempel
---

## Context

The owner's review of 2026-10-12 (DEC-0154) raised four points on the explain
module and the `/mitmachen` stage, tracked as issues #47, #27, #26 and #43.
DEC-0155 §2 had already settled the rule behind #47 — readability goes before a
fixed height — and SRC-0014, CG-025 and `TS-WEB-0022-A18` were rewritten to it,
but the render still cut every step line with `text-overflow: ellipsis`, and
the A18 test passed on exactly that: it measured "one line" as "as tall as one
line-height", which an ellipsis clamp satisfies by construction. `Q-0092` asked
what the revised hero photograph is. The owner answered it in the brief for
this work package (2026-10-13): **an AI-edited real photograph**.

## Decisions

1. **No step line is truncated** (issue #47). The `nowrap` / `ellipsis` clamp
   leaves `explain-module.module.css`; a longer line wraps. All three step lines
   are always rendered, and from `lg` they share one grid row, so the module's
   height is fixed by its longest step and a change of step moves nothing. The
   instrument is new: **`TS-WEB-0022-A20`** fails a computed
   `text-overflow: ellipsis`, a `-webkit-line-clamp`, and any core or detail
   whose `scrollHeight` exceeds its `clientHeight` (or `scrollWidth` its
   `clientWidth`), at 390 and 1280 px, on the fixture, on `/` and on
   `/mitmachen`. It supersedes A18, whose test is retired with it. Measured on
   this change: no truncated line on any of the three; at 390 px every step
   still fits one line, so no copy had to change.
2. **Below `lg` the stage swipes, and two arrows step through it** (issue #27).
   The stage is a horizontal scroll-snap container (`scroll-snap-type: x
   mandatory`, each pane snapping, the last at the end). A swipe that settles on
   a pane selects that step; the two arrows — real buttons with a name, 44 px,
   paper with an `ink` glyph and a `border` ring so they read on every pane
   ground — select the neighbour, and at either end stay focusable with
   `aria-disabled`. Both are handwork and stop the pass for good (DEC-0105 §6
   unchanged). The machine drives the same scroll: the auto-advance and a step
   line scroll the stage to the pane, smoothly, and **instantly under
   `prefers-reduced-motion`**. The 550 ms of DEC-0105 §6 stays the machine's
   settle time; the slide itself is the browser's smooth scroll, which replaces
   the `translateX` transition. Because the stage is a scroll container it takes
   keyboard focus below `lg` (axe `scrollable-region-focusable`, WCAG 2.1.1)
   and the arrow keys scroll it; from `lg` it is `display: contents`, leaves the
   tab order and the arrows are not rendered. Criterion: **`TS-WEB-0022-A21`**.
3. **The WhatsApp path is drawn, not left grey** (issue #26). State 1 is an
   inline-SVG illustration (`StageFlyerPhoto`): a flyer pinned to a board and a
   phone held up in front of it with the flyer in its viewfinder. The chat of
   state 2 shows the same drawn flyer in its bubble instead of the hatched
   "FLYER.JPG" stand-in, which is retired with its dictionary string. Both are
   illustrations, not photographs: no lettering, no place, no messenger's logo
   or trademark — the chat stays ours, under our mark. Colours come from the
   brand tokens by class (`ink` for the phone, `lime-100` ground, `himbeere-500`,
   `violet-500`, `lime-500` accents), never a literal and never a dark-green
   fill. Inline SVG needs no request and no file under `public/`, so the proxy's
   `PUBLIC_FILES` allowlist is unchanged. The presentation the review mentions
   was not available to this work package; whether its graphics replace these
   stays the owner's call. The calendar and website paths keep their grey
   state-1 panel; they were not part of #26.
4. **`Q-0092`: the revised hero is an AI-edited real photograph** (issue #43).
   - It is the **Osterfeuer 2023 in Schmatzin** (Jan-Henrik Hempel, Wikimedia
     Commons, CC BY-SA 4.0) — the photograph the hero showed before — edited
     with Google Gemini: crop, light, contrast and saturation; the tool also
     redrew details (the pram at the right edge is gone). It depicts the same
     event at the same place.
   - **`provenance: ai-edited`** is a new value of the image inventory
     (`ImageProvenanceSchema`). It requires `source` (the original), `master`
     (the edited file, repository-relative — here
     `plan/reviews/2026-10-12/Design - Mitmachen Hero (Gemini).jpg`) and
     `licence`. `pnpm images:generate` places it like a real photograph, from the
     master, at the declared focal point (`{x: 45, y: 62}`), both renditions
     inside the 100 KB budget.
   - **No visible badge** — *superseded by DEC-0165 (2026-10-14): every
     AI-edited photograph now carries the visible sparkles mark and ends its
     alt text with the note; the rest of this point stands.* SRC-0014 §Photo surface puts the "Nicht motivgenau"
     badge on a photo that does not depict what the copy claims; this one does.
     Provenance travels the way every other provenance does since 2026-09-18:
     `data-provenance="ai-edited"` on the surface. The editing is named on
     `/rechtliches` (`content/legal/image-credits.md`), on the credit line and in
     "Zuschnitt und Bearbeitung", which until now said no photograph was edited
     beyond its crop.
   - The two `.webp` renditions that lay beside the master in the review folder
     were the previous photograph's renditions, byte for byte; the new ones are
     cut by the pipeline, not copied.

## Consequences

- `TS-WEB-0022` D4 (the "Below `lg`" and "Line length" rows) and the
  acceptance table carry A20 and A21; A18 is superseded by A20.
- SRC-0014 §Explain module and §Photo surface, and the contract row
  `explain-module`, say what this record decides.
- Open for the owner: whether an AI-edited photograph should carry a visible
  note at the image as well (e.g. for EU AI Act Art. 50(4), should the edit be
  judged a manipulation of a real event); today the note is on `/rechtliches`
  only. **Answered by DEC-0165** (2026-10-14): it does — the sparkles mark on the
  picture and the note at the end of its alt text.
