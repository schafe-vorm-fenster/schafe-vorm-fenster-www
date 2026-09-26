---
id: DEC-0139
title: The focal point is the crop — the motif rule picks four heroes, the declared pair cuts the file and positions the surface, and the flyer motif has no cleared photograph
status: DRAFT
date: 2026-09-26
decided_by: the engineering team
---

## Context

Three things met in the imagery round.

`DEC-0105` §2 made the crop follow **the motif's declared focal point, never
`center` by default**, and `concept/website-design-system.md` (SRC-0014, lines
831–851) carries the same rule together with the motif per page: `/` shows
villages **with activity**, `/dein-kalender` shows **venues**,
`/mitmachen` shows **the act itself — a flyer, a phone, a hand**, never dark,
never sad, never empty-at-dusk. `T-04` built the plumbing for the first half:
`focal: {x, y}` in `ImageEntrySchema`, `pageImage` → `hero-block` →
`photo-surface` → `--photo-focal`. **No page artifact declared one**, so every
surface stood on the stylesheet's fallback and the rule bound nothing.

The owner's review of 2026-09-22 says what that looked like in practice
(line 25): *"Wenn das Motiv eher vertikal mittig/unten ist und oben viel
Himmel (was bei den Ortsfotos oft so ist), dass führt das dazu, dass das
Motiv von dem Fade verdeckt wird"* — and names three swaps: the Melkerschule
in Schlatkow for the home hero (line 29), a composition of a noticeboard and a
real culture calendar for the embed scene (line 73), and an open-air photo
with people for the founder portrait (line 436).

And `scripts/generate-images.mjs` cropped every placed photograph with sharp's
`position: "attention"` — a saliency guess that is neither declared nor
reproducible, and that cannot be reviewed against a motif rule.

## Decision

### 1. The declared focal point does both jobs

`focal: {x, y}` is now declared on **every placed image entry** of the four
pages this task owns, and one value serves both ends: `photo-surface` positions
the background with it, and `scripts/generate-images.mjs` cuts the file with it.
The rule is one sentence, in `scripts/lib/focal-crop.mjs`: *the largest window
of the target ratio that fits inside the frame, centred on the focal point and
pushed back inside the frame where the centre would hang over an edge.* It never
zooms in — moving a subject by dropping resolution is a second decision and this
is not it — and without a declared pair it falls back to `50% 40%`, which is what
`photo-surface.module.css` already falls back to. `scripts/focal-crop.test.ts`
covers the four shapes this round met, the clamp and the two refusals;
`e2e/hero-focal.spec.ts` asserts in the browser that the declared pair reaches
all three background layers of each of the four heroes, and that it sits at or
above 40 %.

The declared values, and what each one is anchored on:

| Entry | `focal` | Why |
| --- | --- | --- |
| `home-hero` | 50 / 55 | The Melkerschule fills the middle; 55 drops the sky out of the 21:9 band and keeps the tables |
| `home-scene-embed` | 42 / 50 | The Gützkow town hall sits left of centre |
| `home-scene-provenance` | 45 / 40 | Person and roll-up share the frame; the surface default is the honest centre |
| `mitmachen-hero` | 42 / 62 | The crowd, the tables and the fire, instead of the grey sky above them |
| `mitmachen-path-whatsapp` | 45 / 55 | The two notices on the fieldstone wall |
| `mitmachen-path-calendar` | 45 / 58 | The meeting place under the tree, not the treetops |
| `mitmachen-path-website` | 40 / 55 | The desk, not the roof beams |
| `dein-kalender-hero` | 45 / 55 | The Amtsgebäude's roof and facade above the scrim |
| `ueber-uns-hero` | 38 / 58 | The sheep barn stands in the left half |
| `ueber-uns-founder-portrait` | 48 / 45 | Between the face and the handwritten name badge, which the asset descriptor calls load-bearing |
| `ueber-uns-team-jan-henrik-hempel` | 55 / 38 | The face sits right of centre and high |

Only the entries whose motif or crop the review asks to change were re-placed
(`home-hero`, `mitmachen-hero`, `dein-kalender-hero`, `ueber-uns-hero`,
`ueber-uns-founder-portrait`). The other six keep the rendition they already
have — their box is close to the source ratio and no review asks for a second
cut; their declaration is what `photo-surface` positions with today and what
the next placement will cut with.

`--force` takes a list and now also re-places a **placed** real entry, which is
what a changed motif needs; without it the script stays idempotent.

### 2. `/` gets the Melkerschule, and the placement reads Commons itself

The owner's URL pointed at the assets proxy, not at a licence. The Commons file
page resolves to **`File:Melkerschule Schlatkow.jpg`**, *Jan-Henrik Hempel*
(account `J2hcom`, own work), 2016-09-11, 5073×2817, **CC BY-SA 4.0** — read
from the file page's `extmetadata` on 2026-09-26. Share-alike obliges the site
to attribute, so the entry carries `licence: CC BY-SA 4.0` and
`content/legal/image-credits.md` gains its line; the Rathebur photo the hero
carried before leaves the list, because the list names what is on the site.

`scripts/generate-images.mjs` resolves a Commons `source` on its own now: the
title comes out of the `commons.wikimedia.org/wiki/File:…` URL the entry already
carries — nothing is guessed from prose — and the original is cached outside the
repository (`$TMPDIR/svf-commons-originals`), because the committed form of a
5 MB camera file is the rendition under `public/images/real/`. A `ratio: hero`
entry is placed as **both** renditions, phone and wide, from the one photograph
and the one focal point.

### 3. Three motifs stay as they are, and each says why

- **`/dein-kalender` is verified, not swapped.** The design system asks for
  venues, "culture houses, Gemeindehäuser, halls", and the review says it of
  this very photo: *"Evtl. ist das auch schon so definiert, weil schon ein
  Gemeindehaus zu sehen ist"*. The Amtsgebäude of the Uckerland municipality is
  one, with its noticeboard beside the door. New crop, same motif.
- **`/mitmachen` keeps its photograph.** No cleared flyer/phone/hand photograph
  exists — `eventification-dataset` holds photographed flyers and its
  `GOVERNANCE.md` says *"We hold no licence to redistribute them"*, and neither
  the brand package nor the Commons account has such a motif. The Osterfeuer
  photograph stays, re-cropped onto the people (state/open.md row 266), and the
  explain module's first stage keeps the "FLYER.JPG" hatch with
  `data-placeholder="flyer-photo"`, which `explain-stage` already renders.
- **The embed scene on `/` keeps Gützkow.** The "Schaukasten + Kulturkalender"
  composition needs a cleared noticeboard photograph (there is none), permission
  to montage (`image-credits.md`: *"keine Montage"*) and a real calendar, which
  is a Portalize embed rather than a mockup (DEC-0068 rule 3) — row 267.

### 4. The founder portrait becomes the open-air photograph

`2026-04-otcamp-neustrelitz-outdoor-session.jpeg` is the photo the review names,
it is in `@schafe-vorm-fenster/people@0.3.6` and the person record settles the
rights for all fourteen assets (`press_clearance: cleared`); the asset's own
terms are `license: free use, credit advised`, `credit: openTransfer.de`. The
entry keeps its id, its slot, its `ratio: portrait` and its `lcp: true`, so the
LCP element of `/ueber-uns` is the same element and the same file name
(TS-WEB-0003 D2, A8 — `e2e/lcp-image.spec.ts` unchanged and green). Because the
credit is *advised* rather than required, it could have moved to `/rechtliches`
alone; it stays rendered at the image, where the previous portrait's credit
stood, and `image-credits.md` says so in the same sentence it used before. The
descriptor's own "not a portrait" warning is recorded as row 268, not argued
away.

## Consequences

- Four heroes and one portrait were re-placed; `mitmachen-hero` and
  `ueber-uns-hero` came out below their nominal size (680×765) because the
  tighter crop carries more detail than the 100 KB budget of TS-WEB-0003 D1
  allows at 800×900. The ratio is exact either way, so nothing reflows —
  row 269 asks whether hero photographs deserve their own byte budget.
- `focal` is written back as `"y": …` because js-yaml quotes the key `y`
  (YAML 1.1 reads it as a boolean); both spellings load as the string `y`, and
  the quoted one is what a generation run leaves behind, so the files carry it
  everywhere and a re-run changes nothing.
- No specification was amended and no status was promoted. The two criteria this
  task answers to were re-run rather than rewritten: `TS-WEB-0003-A8` through
  `e2e/lcp-image.spec.ts`, `TS-WEB-0002-A3` through `pnpm check:contrast`, which
  measures the token set and does not open an image (DEC-0105 §1).
- The owner decisions this task inherited are unchanged by it; the numbering
  rule ("numbers are taken in task order and never reused") is why this record
  is **DEC-0139** although the backlog's note for T-20 still says DEC-0131 —
  that number belongs to T-13 and is taken.
