---
id: DEC-0168
title: One active place on the client — a single store keyed by query and generation from which headline, rows, calendar link, photograph and credit all derive; the example place is explicit state; the credit is a © control; the calendar address is `<slug>.<geonameId>` on the village calendar's host
status: accepted
date: 2026-10-27
decided_by: jan-henrik.hempel
---

## Context

The owner's review of 2026-10-27 (`plan/reviews/2026-10-27/`) raised three
points about the stage of `/` and `/dein-ort`:

- **#80** — "Je nachdem wann ich wie lade oder Geolokalisiere, haben wir ein
  falsches Ortsbild. […] Hinterfrage die Software-Architektur an der Stelle."
  The screenshot shows `/dein-ort` with "Das ist los in Schlatkow" under a
  photograph of Dargitz, after several rounds of fixes.
- **#78** — the credit line on a place photograph should become a small ©
  icon with a tooltip.
- **#81** — the village calendar link pointed at
  `https://app.schafe-vorm-fenster.de/lehre`; the calendar is at
  `https://schafe-vorm-fenster.de/lehre.2879378`.

### How the active place was determined (measured on `next-2026` at 8c2d2bc)

There was no active place, only **six independent answers** to "which place
does this page speak about", each computed by an island for itself:

| Consumer | Read | Fallback without a place |
| --- | --- | --- |
| hero headline (`_home-focus`, `place-islands`) | `usePlaceState()` → own `useJson(resolve)` + own `useLive(events)` | S1/S0 headline |
| module slot (position 1) | the same hook, a second copy of its state | `SHOWCASE_COMMUNITY` — **implicitly** (`place ?? SHOWCASE`) |
| nearby, story examples, homescreen | the same hook, more copies | `SHOWCASE_COMMUNITY`, implicitly |
| stage photograph (`_place-photo`) | the same hook, another copy, plus its own `useLive(photo)` and `new Image()` | **none** — the page's own photograph |
| calendar links | the slug prop of whichever island rendered them | the showcase slug |
| "use my location" | `navigator.geolocation` → `/api/places/nearest` → `location.assign` | — |

All of them read `?ort=` from a module-global query store that `<QuerySync />`
filled in a passive effect after the first paint. They shared fetch promises
(`browser.ts`), but each settled into its own `useState`, and a settled
answer was reused for 60 s only.

### The races and mismatches found

Each was reproduced in `e2e/active-place.spec.ts` against `next-2026` before
the change — **five of six red**:

1. **The example is not a state** — the screenshot. Without `?ort=`, the
   module spoke about Schlatkow because a fallback said so, but the
   photograph had no such fallback and kept `/dein-ort`'s own (Dargitz).
   Headline area and photograph named two different places, every time.
2. **The loading window** — with a place, the photograph route takes 0.6–2.5 s
   warm and up to 15 s cold (DEC-0167). For that whole time the headline said
   "Das ist los in Quilow" over `/`'s own photograph of the Melkerschule in
   Schlatkow, with no word that it was not Quilow. On a slow assets-api this
   is the "depending on when I load" of the review.
3. **The example under the chosen place** — while `/api/places/resolve`
   answered, every island treated "pending" as S0 and fetched and rendered
   Schlatkow's rows, nearby list and story examples under `?ort=anklam`.
4. **A late position overrides a later choice** — a position can take ten
   seconds. A visitor who clicked "Meinen Standort verwenden" and then picked
   Anklam in the search started a navigation; when the position came back the
   control called `location.assign(?ort=schlatkow)` and cancelled hers.
5. **Six copies of one answer** — the islands' copies of the resolution and the
   dates verdict could disagree (an island mounting after the 60 s reuse window
   asked again), and the query store was published after paint, so on a client
   navigation the next page's islands painted one frame with the previous
   `?ort=`.
6. **Superseded responses** — guarded per island by URL keys, so a late answer
   for a previous place was not shown; correct, but only by six separate
   guards, and the photograph's preload was never aborted.

## Decisions

1. **One store, one snapshot** (`src/lib/pages/active-place.ts`). The store
   reads the query (`query-store.tsx`), resolves `?ort=` once, loads the dates
   verdict once, and loads the photograph once a stage asks for it. Every
   consumer on `/` and `/dein-ort` — hero headline and CTA, module slot,
   nearby, story examples, homescreen block, closing block, stage photograph,
   credit, calendar links — renders from one `useSyncExternalStore` snapshot,
   so in any render they name the same place. The snapshot is one of:
   `unknown` (the server snapshot: exactly the prerendered HTML, nothing asked)
   · `resolving` (renders as `unknown`: nothing about the example is fetched or
   shown) · `example` · `chosen` (with its dates verdict and photograph) ·
   `uncovered` (the hop to the founding page).
2. **Generations, not URL keys.** A new query starts a new generation and
   aborts the previous photograph's preload; every answer is applied only if
   its generation is still current. Order of arrival no longer matters.
3. **The example place is explicit state.** Without `?ort=` (or when the
   resolver does not answer) the snapshot is `example: schlatkow`
   (`SHOWCASE_COMMUNITY`). The stage shows **the example's photograph** like a
   chosen place's — unless the page's own photograph already depicts it. Image
   inventory entries gain an optional `place` (a geo-api slug): `home-hero` is
   the Melkerschule in Schlatkow (`place: schlatkow`), so `/` without a place
   keeps its own photograph and asks nothing; `dein-ort-hero` depicts Dargitz,
   so `/dein-ort` without a place shows Schlatkow's. This amends DEC-0167 §5
   ("visits without `?ort=` never call the route") for `/dein-ort`.
4. **No unlabelled photograph under a place's headline.** While a place's
   photograph loads, the stage's own photograph carries the label
   "Beispielfoto" (dictionary `placePhoto.pending`); without one it carries
   DEC-0167 §4's fallback label. The rule DEC-0167 §4 stated ("never a
   different place's photograph presented as this one") now holds for the
   loading window as well.
5. **The calendar address** (issue #81). `calendarUrl()` takes a place's slug
   **and** geoname id and builds `{CALENDAR_ORIGIN}/{slug}.{geonameId}` — the
   village calendar's own scheme (community-site's README: "a village page is
   addressed as `<name>.<geonameId>`"; the same key `place-index.ts` already
   used to read its pages). `CALENDAR_ORIGIN` is community-site's origin,
   `https://schafe-vorm-fenster.de`, from `NEXT_PUBLIC_COMMUNITY_SITE_ORIGIN`
   — the variable `redirect-map.ts` already used for help. It is the same for
   every domain this website serves: community-site is one German deployment
   on the apex. Measured 2026-10-27: `app.schafe-vorm-fenster.de` has no DNS
   record, `sheepoutside.com` neither; `/lehre.2879378` on the apex answers
   200. `calendarUrlForSlug()` is gone — a slug alone cannot make the address.
   `APP_ORIGIN` stays for the registration and help handovers, which are not
   calendar links. *(Superseded 2026-10-28 by DEC-0177: `APP_ORIGIN` is gone;
   the registration and help handovers are `APP_URL`, the Schlatkow village
   calendar, until the app has its own domain.)* No CSP change: a navigation is not governed by CSP.
6. **The credit is a © control** (issue #78). `photo-credit` is a 40 px round
   well with Lucide `copyright` in `paper` on `scrim-45`, in the photograph's
   top-right corner — the corner, well and scrim step of `ai-edited-mark`
   (DEC-0165), so the two marks speak one language and never collide: while a
   place photograph covers the stage, the surface's AI mark stands down. It is
   a real `<button>` ("Bildnachweis" / "Photo credit") with `aria-expanded`;
   hover, keyboard focus and a tap open the panel, Escape closes it and returns
   focus, a second click or a tap outside closes it. The panel is a `paper`
   card holding the full credit — title linked to the Commons file page,
   author, licence, "über Wikimedia Commons" — one tab stop past the control.
   The licence obligations (author, licence, a reachable source link) are met
   at the photograph, behind one interaction instead of in standing text.
   **Every photo credit, not only the place photograph's** (issue #101, the
   owner's follow-up of 2026-10-27). `photo-credit` is a generic component:
   `photo-surface` and `media-frame` take a `credit` and render it as the ©
   control, and every credited inventory image is wired that way — today the
   openTransfer photograph of the quote band and the portrait on
   `/ueber-uns`, whose "Foto: openTransfer.de" stood as text on the picture.
   Where an AI-edited mark holds the corner, the control stands left of it.
   `TS-WEB-0007-A18` walks every route in both languages: no credit is
   visible running text, and every credited image carries the control.
7. **A late position never overrides a later choice.** The "use my location"
   control abandons its attempt the moment the page starts to leave
   (`beforeunload`, `pagehide`) or its URL changes.
8. **The story stage's live date belongs to the active place, and an empty
   one says nothing** (coordinator's follow-up of 2026-10-27, the owner's
   screenshot `Ist - Zitat unter Terminen.png`). Measured: it did not hang on
   the place — `StoryExample` read the same anchor — but its pool
   (`/api/places/{slug}/examples`) is either empty (without a token
   community-site's page read is challenged, so the pool falls to its empty
   snapshot) or holds no date of the story's kind (no bakery van in Lehre or
   Anklam, DEC-0153 §2), and then the island rendered nothing while the stage
   still printed "Im Kalender" over it. The pool is now read only for an
   established place (never while `?ort=` resolves), and the label stands only
   with a row (`story-stage.module.css`).
9. **The query is published before paint** (`useLayoutEffect` in
   `<QuerySync />`), so a client navigation's next page never paints with the
   previous page's `?ort=`.

## Consequences

- `usePlaceState()` is removed. The three flows keep `usePlaceResolution()`
  for their register lookup; they are not stage pages and show no photograph.
- New criteria: **TS-WEB-0020-A27** (the active place: example state, the
  loading label, nothing of the example fetched while resolving, a superseded
  photograph dropped, a late position dropped; unit-tested in
  `src/lib/pages/active-place.test.ts`, walked in `e2e/active-place.spec.ts`)
  and **TS-WEB-0020-A28** (the © control: hover, keyboard, touch, Escape) and
  **TS-WEB-0007-A18** (no credit as running text on any route; issue #101).
  Amended: TS-WEB-0020-A7, A20, A22; TS-WEB-0019-A22; TS-WEB-0008-A11 and D9's
  build row. TS-WEB-0019 D2, TS-WEB-0020 D2, TS-WEB-0021 D4 and TS-WEB-0010 D5
  carry a note naming this record.
- SRC-0014 §Photo surface states the example rule, the loading label and the ©
  control; §Icons adds `copyright`. The design-system contract's component
  table names `photo-credit`. DEC-0167 carries an amendment.
  `content/legal/image-credits.md` says the credit is behind the © at the
  photograph.
- `/dein-ort` without a place now makes one more request (the example's
  photograph, CDN-cached as `activePlaces`); `/` does not.
- Open, outside this record: with a geo-api token, `/api/places/nearest`
  answers the geo-api proximity hit's slug capitalised (`Schlatkow`), so the
  located URL reads `?ort=Schlatkow`; the resolver normalises it. And
  community-site answers the server-side tokenless page read with a Vercel
  bot challenge (403) since at least 2026-10-27, so without a token the photo
  route answers 204 `no-store` and the stage shows the fallback label.
