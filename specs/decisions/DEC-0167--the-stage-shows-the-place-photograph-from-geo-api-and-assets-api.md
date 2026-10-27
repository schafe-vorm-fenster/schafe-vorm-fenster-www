---
id: DEC-0167
title: The stage shows the chosen place's own photograph — Wikidata's image through geo-api, delivered and attributed by assets-api; no licence, no photograph; a place without one keeps the page's photograph, labelled as an example
status: accepted
date: 2026-10-14
decided_by: jan-henrik.hempel
---

## Context

The owner's review of 2026-10-12 (DEC-0154, issue #18) found that the stage of
a page with a chosen place shows one fixed photograph for every place:
`/dein-ort?ort=schlatkow` showed the bus stop in Dargitz. SRC-0014 §Photo
surface was rewritten to "a place shows its own photograph" and left open what
a place without one shows (`Q-0089`), together with where ~1,760 place
photographs come from and their rights.

The owner decided the source on 2026-10-14: **the place photographs the geo-api
and the assets-api already provide.** What those services provide was read in
their repositories and measured against production the same day:

- **geo-api** `GET /api/{token}/community/{geonameId}` carries `image`: one
  nullable string, Wikidata **P18** of the place as a Commons
  `Special:FilePath/<file>` URL. No author, no licence, no size, no focal point.
  The slug lookup the site already used carries no image at all.
- **The public village calendar** carries the same P18 image on a community's
  page (`community.wikimediaCommonsImages[0]`), already rewritten to an
  assets-api URL — so the source works without a token too.
- **assets-api** `GET /api/image?wikimediaCommonsId=<file>` answers the image
  as WebP (at most 1,000 px wide today), no token, with the attribution in its
  **response headers**: `License` (Commons `LicenseShortName`, e.g.
  `CC BY-SA 4.0`) and `Copyright` (`(C) <year> <author>`). Only this parameter
  form carries them; a `url=` of the FilePath URL is fetched anonymously and
  loses them. There is no JSON metadata operation and no resize parameter.
- A `HEAD` of that URL was answered 200 with full attribution from the
  service's CDN while the `GET` of the same URL failed with a 500 after ~11 s
  (Ivenack, Groß Luckow). A cold `GET` that succeeds took 8.3–11.2 s; warm,
  0.6–2.5 s.

## Decisions

1. **The source.** A new BFF route, `GET /api/places/{slug}/photo`
   (`src/lib/live/place-photo.ts`), resolves the place and reads its image
   reference from the first source that answers — geo-api
   `community/{geonameId}` (token), else the public calendar's community page
   (no token), else nothing (the mock has no photograph). The reference is
   reduced to its **Commons file name** and checked with a `GET` of the
   assets-api image URL whose body is discarded: it is the request the browser
   will make, so it is the one that must succeed, and it leaves the image warm
   in the service's CDN. Its headers give licence, author and year.
   The browser receives `{src, fileName, sourceUrl, licence, author?, year?,
   width?, height?}` and loads `src` from the assets host — the one ecosystem
   origin `img-src` already allows (event images, DEC-0152). geo-api's token
   never leaves the server (TS-WEB-0008 D10).
2. **No licence, no photograph.** A photograph is shown only when assets-api
   states a licence for it, and, unless that licence is public domain or CC0,
   an author to attribute. An image that is not on Commons has no stated
   licence and is dropped by the same rule. An image whose `GET` does not
   deliver an image is not handed out.
3. **The credit stands at the photograph.** `content/legal/image-credits.md`
   names every photograph on `/rechtliches` rather than at the image — which
   cannot list ~1,760 places. A place photograph therefore carries its credit
   line in the stage's top corner: "Foto: *title* (linked to the Commons file
   page) – *author*, *licence*, über Wikimedia Commons". `/rechtliches` says so
   in a new section "Fotos der Orte". The wording is a placeholder for the
   content phase (dictionary `placePhoto`).
4. **`Q-0089`: a place without a usable photograph keeps the page's own
   photograph, labelled honestly.** Not the hatched "Foto gesucht" surface and
   not a colour ground: the stage stays a photo surface, the page rhythm keeps
   its photograph, and the corner says "Beispielfoto · von *Ort* haben wir noch
   kein Foto". The same holds when the route fails or the image does not load.
   Never a different place's photograph presented as this one. A regional
   (county) photograph is not used: no service states one.
5. **The swap shifts nothing and costs the default nothing.** The page's own
   photograph stays the prerendered surface background and the LCP; visits
   without `?ort=` never call the route. With a place, the photograph is loaded
   first and then laid over the surface as an out-of-flow layer with the same
   scrim (`photo-surface`'s new `photoLayer` slot, `photo-layer.tsx`), fading
   in unless reduced motion is asked for. The credit line is out of flow too.
6. **Crop.** The services state no focal point, so a place photograph takes the
   surface's default `50% 40%` — never `center` (DEC-0105 §2). DEC-0153's
   anchored crop (`anchoredCropWindow`) needs a declared focal point and does
   not apply; the inherited `--photo-focal` of the photograph underneath is
   deliberately not used, because it describes another picture.
7. **Caching and budgets.** A photograph and a "has none" verdict are cached as
   `activePlaces` (TS-WEB-0003 D5: 1 h fresh, 7 d stale). A failed upstream is
   `204 no-store`, so the next view asks again instead of inheriting it. The
   image check has its own 15 s budget (`ASSETS_IMAGE_TIMEOUT_MS`), above the
   measured cold maximum, because a call aborted earlier leaves nothing in
   assets-api's CDN and a cold image would then never warm; nobody waits on it,
   since the stage shows its own photograph until the answer lands.

## Coverage, measured

A random sample of 150 of the 1,760 covered places on 2026-10-14, against
production geo-api and assets-api: **28 (19 %) have a Wikidata image; 15 (10 %)
have a usable photograph** today — licences CC BY-SA 4.0 (10), CC BY-SA 3.0
(2), CC0 (2), CC BY 2.0 (1). The other 13 images fail in assets-api with a 500
on every attempt; they show the fallback until the service delivers them.
Extrapolated, about 175 places show their own photograph today and about 330
would once assets-api serves every Wikidata image.

## Consequences

- `SRC-0014` §Photo surface states the rule and the fallback; `Q-0089` is
  resolved by this record.
- `TS-WEB-0020`: the owed item #18 is done; criteria **A19** (the route),
  **A20** (photograph and credit), **A21** (fallback), **A22** (no shift, no
  call without a place). `TS-WEB-0019` **A22** (the same on `/`).
  `TS-WEB-0008` D2 and `TS-WEB-0004` D5 list the route.
- The `ai-edited-mark` (DEC-0165) marks the surface's own photograph. Neither
  `/` nor `/dein-ort` carries an AI-edited stage photograph today; should one
  get one, the mark must stand down while a place photograph covers it, since
  it would then mark a picture that is not shown and share the credit's corner.
- Open, outside this repository: assets-api's 500 for some Commons originals,
  and its `HEAD` answering from a CDN entry its `GET` does not match; the image
  width is capped at 1,000 px, which the 1,280 px stage upscales slightly.
  Wikidata P18 is chosen by Wikidata's editors, not by us: a motif may be a
  church portal or an aerial view rather than a village street (SRC-0014
  §Motif per page); `TS-WEB-0017-A15`'s imagery review cannot reach photographs
  that are chosen at runtime.

## Amendment — 2026-10-27: the credit is a © control, the example has its photograph, the loading window is labelled (DEC-0168)

The owner's review of 2026-10-27 (issues #78, #80):

1. **§3, the credit.** The credit no longer stands as a text line in the
   corner. It is a © control (`photo-credit`) in the photograph's top-right
   corner — the AI mark's corner, well and scrim — that opens a card with the
   same credit (title linked to the Commons file page, author, licence, "über
   Wikimedia Commons") on hover, keyboard focus and tap, and closes on Escape.
   The licence obligations are met at the photograph, one interaction away.
2. **§5, "visits without `?ort=` never call the route".** Superseded for
   `/dein-ort`: without a place the page speaks about its example place, and
   its stage now shows the example's photograph, because `dein-ort-hero`
   depicts Dargitz. `/` keeps the rule — its own photograph depicts the
   example (`home-hero`, `place: schlatkow`).
3. **§4 holds for the loading window too.** While the place's photograph
   loads, the stage's own photograph is labelled "Beispielfoto".
4. **Consequences, the AI mark.** The mark now stands down by rule while a
   place photograph covers the surface (`photo-surface.module.css`), so the
   © control can take its corner.

