---
id: DEC-0194
title: The home intro is a drawn phone with a legend, and the place search moves into it
status: accepted
date: 2026-11-12
decided_by: jan-henrik.hempel
---

## Context

Issue 143, "NEXT2026 Homepage Einstiegsmodul", with the owner's design
("Dorfkalender Einstieg", desktop 1280 px and phone 390 px). The black section
under the home stage, "Das ist los in Schlatkow", is replaced by a section that
explains in one look what the digital village calendar is: a calendar for one's
own place on the phone, where dates are found and entered. The stage loses its
place search and its location hint, because the new section carries both.

## Decision

1. **The section** is "Dein digitaler Dorfkalender." — `id="dorfkalender"`, the
   page's one `ink` section, directly under the stage in every state. It has
   **no button**; the only link is "Kalender von [Ort] öffnen" (new tab,
   `rel="noopener"`).
2. **The phone** is a drawing (300 × 580 px, light-blue metal frame) in one
   `role="img"`. Its header is 150 px (the place's photograph, the place name,
   the municipality); under it stand **five fixed slots** of 82 px: Versorgung,
   Gemeindeleben, Bildung & Gesundheit, Kultur & Tourismus, In den Nachbarorten.
   The legend (stroke from the frame, lime dot, label) is positioned from the
   numbers 150 / 82 / 10 (`legendCenters`), never by hand.
3. **A slot is filled on its own**: the next date of its category in the
   recognised place, else its fixed default row (neutral on purpose: no firm,
   no place name). Real and default rows may mix; the order is the legend's,
   not the calendar's. The category ids are `src/lib/live/categories.ts`'s —
   Versorgung `everyday-supply`, Gemeindeleben `community-life`, Bildung &
   Gesundheit `education-health`, Kultur & Tourismus `culture-tourism`;
   In den Nachbarorten is the next date of any category in another place.
   Nothing is mapped that the table does not hold.
4. **Which place**: the one the visitor searched for or located in the section;
   else the page's chosen place (`?ort=`); else the showcase community
   (Schlatkow, municipality Schmatzin). The search loads the place **in place**
   — the page does not navigate, the stage does not change. A search that finds
   no covered place leaves the phone as it was.
5. **No permission prompt on load.** The issue's "determined by geolocation
   when loading, as in the stage" is read the way the stage does it: the
   browser's position is asked on the click of the locate button only
   (TS-WEB-0010 D5); what is known without a click is `?ort=`.
6. **The primary conversion** (TS-WEB-0006 D3, one `data-cta="primary"` per
   page) stays where TS-WEB-0019 D2 puts it, but on the new search: in S1 the
   search's submit, in S2/S3 the hero's CTA.
7. **Layout** hangs on the width of the section (container query, two columns
   from 761 px, one below). Between 761 and 1100 px the drawing is scaled in
   steps (0.6 · 0.75 · 1) so the text keeps a usable column; on the phone it is
   0.57 · 0.62 · 0.71 so its 500 px fit the gutters. The thresholds are
   registered in `scripts/check-brand.ts`.
8. **The stage** carries neither the search input nor the location control.
   S3's widened radius (`#nearby`) is unchanged and follows the ink section.
9. **Colours** are tokens only. The light-blue metal is outside the palette on
   purpose (it draws a device) and enters through `app/styles/brand.css` as
   `--device-frame-*`. The design's dark ink for the display rim, the camera
   island and the type is the site's neutral black (`--color-neutral-ink`,
   TS-WEB-0017-A28, DEC-0155); the retired dark green is not reintroduced.
10. **English** strings stand beside the German ones in the dictionary and wait
    for the owner's review.

## Consequences

TS-WEB-0019 D2/D3 and A2, A5, A16, A17 are amended (see the amendment note
there). `e2e/pages/home.spec.ts`, `e2e/place-search.spec.ts`,
`e2e/active-place.spec.ts`, `e2e/layout-grid.spec.ts` and the search
persistence specs address the new section instead of `#place-dates` and the
stage search. The hand-off row of DEC-0159 (issue 25) is gone with the section
it stood in; `HomeFocusCopy` loses its two fields.
