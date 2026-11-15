---
id: DEC-0223
title: The hero photograph sits on a system-wide anchor, not on its own focal point
status: DRAFT
date: 2026-11-15
decided_by: UNKNOWN — the owner's, pending review (issue 255)
---

## Context

Issue 255. A hero photograph was positioned on its declared focal point
(`background-position: var(--photo-focal)`, DEC-0105 §2, DEC-0139). That puts
the motif in the box where it sits in the photograph. `/dein-kalender`
declares 45 % / 55 %, so the building stands behind the headline; the sky
above is left over and the text covers the motif.

The hero's text stack stands bottom-left from 48rem and across the full width
on the phone; the top ~35 % of the box is the reserved free band (the
`data-hero` spacer in `photo-surface.module.css`). DEC-0153 §4 solved the same
problem for the story stage with an anchored cut and noted that the hero "can
take an `anchor` the same way".

## Decision

1. **Two anchors, constants of the hero, not values per image.** Where in the
   hero box the focal point lands:
   - wide rendition (21:9, from 48rem): **x 68 % / y 32 %**, upper right of
     the text stack;
   - phone rendition (8:9): **x 50 % / y 28 %**, top centre, inside the free
     band.
   They are `HERO_ANCHOR` in `scripts/lib/focal-crop.mjs` and
   `--hero-anchor-phone` / `--hero-anchor-wide` in `app/styles/components.css`.
2. **The generator cuts on them.** `pnpm images:generate` cuts both renditions
   of a `ratio: hero` entry with `anchoredCropWindow` so the focal point lands
   on the anchor. File names do not change, so no public file is new. The
   phone cut may zoom down to a 600 px window (`HERO_PHONE_MIN_WIDTH`) so a low
   master can still reach the anchor; the wide cut keeps the box's own width.
   Each delivered file stays at or under 200 KB (TS-WEB-0003 D1).
3. **`photo-surface` positions a hero on the anchor**: the background layers
   (blur preview included) and the `<img>` mode, per rendition. A percentage
   position keeps the point at the same share of the box under `cover`, so it
   holds in every box shape, including the capped height from `lg`. A surface
   that is not a hero keeps `--photo-focal`.
4. **Per image only the focal point stays.** A focal point that lies clearly
   beside the motif is corrected in the entry and nowhere else. This change
   corrected three: `dein-ort-hero` (default 50/40 to 40/50: bus shelter and
   church tower), `dein-ort-starten-hero` (default 50/40 to 42/52: the fire
   station's gate and the community centre) and `mitmachen-hero` (45/62 to
   45/52: the master is only 1018 px high, and at 62 % the anchor at 28 % was
   out of reach).
5. **The check** is a browser measurement: on every page with a hero photo,
   at 360, 390, 700, 1024, 1280, 1470 and 1920 px, the focal point's pixel
   position lies outside the text stack's bounding box (TS-WEB-0006 D13).

## Consequences

- `TS-WEB-0006` D13 and `A22` (e2e), `A23` (unit) are new.
- DEC-0153's closing consequence ("the hero ... keeps its centred cut until a
  page declares one") is closed for heroes by this record.
- A new hero photograph needs a `focal` on its motif; the anchor does the rest.
- At 48rem and above up to 63.99rem the wide rendition and the 21:9 ratio
  apply; below 48rem the phone rendition and 8:9 apply. A ~700 px viewport is
  therefore the phone rendition.
