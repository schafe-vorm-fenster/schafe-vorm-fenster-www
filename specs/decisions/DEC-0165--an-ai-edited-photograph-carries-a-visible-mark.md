---
id: DEC-0165
title: Every photograph edited with an AI tool carries a visible sparkles mark and says so in its alt text
status: accepted
date: 2026-10-14
decided_by: jan-henrik.hempel
---

## Context

DEC-0161 §4 made the `/mitmachen` hero an AI-edited real photograph
(`provenance: ai-edited`) and decided **no visible badge**: the picture depicts
what the copy claims, so the "Nicht motivgenau" placeholder badge does not
apply, and the editing was named only in `data-provenance="ai-edited"` and on
`/rechtliches` (`content/legal/image-credits.md`). Its consequences left one
point open for the owner: whether an AI-edited photograph should carry a
visible note at the image as well.

The owner answered it on 2026-10-14: **every photograph we edited with AI
carries a visible marker**, a small sparkles icon in a corner of the picture,
the way Gemini marks the images it makes.

## Decisions

1. **The mark** (`ai-edited-mark`, SRC-0014 §Photo surface). A 40 px round
   well — the icon-well size — filled with the translucent `scrim-45` step of
   the scrim ladder, carrying Lucide `sparkles` (added to the icon set, SRC-0014
   §Icons) at 24 px in `paper`. Tokens only. It is not a placeholder badge and
   says nothing about whether the picture depicts its claim: it says the
   picture was edited with an AI tool.
2. **The corner is the photograph's top right, chosen by measurement.** On the
   `/mitmachen` hero in both languages, a 40 px box at each corner, 16 px in,
   the top ones below the header (`--site-header-height` + `space-3`, the
   offset the retained `.marks` slot already used):

   | Corner | 390 × 844 | 1280 × 800 |
   | --- | --- | --- |
   | top right | clear — 376 px to the nearest text | clear — 495 px |
   | top left | clear — 376 px | clear — 135 px |
   | bottom right | clear by 17 px (de) / 56 px (en) | clear — 495 px |
   | bottom left | **overlaps the headline / CTA** | **overlaps the CTA** |

   Top right is clear by the widest margin at both widths, and the hero's
   reserved photograph band (55 svh on the phone) keeps the text stack out of
   it whatever the copy's length. It never meets the header: on a hero it sits
   below `--site-header-height`; on any other surface or frame it sits
   `space-4` from the top.
3. **Contrast is guaranteed by construction and measured on the pixels.**
   `paper` (#F9FBF7) over the 0.45 well over a pure-white pixel is 3.2 : 1;
   every darker pixel only raises it, so the glyph clears the 3 : 1 non-text
   floor (NFR-WEB-0059) on any photograph. Measured on the production build
   against the actual photograph under the mark (mark hidden, each pixel
   composited at 0.45): **3.58 : 1 at 390 px, 3.39 : 1 at 1280 px**, worst
   pixel, both languages.
4. **The text alternative, twice.** The mark is a non-interactive
   `role="img"` with the dictionary's `aiEditedMark` — "Mit KI bearbeitet" /
   "Edited with AI" — as `aria-label` and `title`; the glyph stays
   `aria-hidden`. And an `ai-edited` image's `alt` **ends with the same
   sentence** in the page's language; `check:frontmatter` fails an inventory
   entry whose `alt` does not (`PageFrontmatterSchema`). The `/mitmachen` hero's
   alt gains it in de and en.
5. **Generic, driven by provenance.** `pageImage()` already derives
   `aiEdited` from `provenance === "ai-edited"`; `photo-surface` and
   `media-frame` render the mark exactly when that flag is set and the image is
   neither missing nor `generated`, and mark the box
   `data-provenance="ai-edited"`. Every page call site that passes an inventory
   image's `notDepicting` now passes its `aiEdited` beside it.
   `TS-WEB-0007-A17` walks every route in both languages: each AI-edited frame
   carries exactly one labelled mark, no mark exists anywhere else, and a page
   whose inventory holds a placed `ai-edited` image shows at least that many —
   so an image wired without the flag fails the test instead of shipping
   unmarked.

## Consequences

- DEC-0161 §4's "No visible badge" is superseded by this record; the rest of
  §4 stands (`provenance: ai-edited` is still a real photograph, carries no
  placeholder badge, and is named on `/rechtliches`).
- SRC-0014 §Photo surface and §Icons, the design-system contract's component
  table, and `TS-WEB-0007` (D6 and `A17`) say what this record decides.
- The story-stage's photographs and the place islands' images do not pass
  `aiEdited` yet; none of them is AI-edited today, and `A17` fails the moment
  one is without its mark.
