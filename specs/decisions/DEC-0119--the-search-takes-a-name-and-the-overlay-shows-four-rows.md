---
id: DEC-0119
title: The search takes a name and the overlay shows four rows — the postcode mode leaves the search surfaces, `?zip=` stays for the order flow, and the geolocation control resolves through one `no-store` BFF route
status: DRAFT
date: 2026-09-25
decided_by: the engineering team
---

## Context

`DEC-0079` decided the place search by name, and `TS-WEB-0008 D7/D7a`,
`TS-WEB-0010 D5` and `TS-WEB-0008-A14/A15/A16` determine what that search
looks like. Task T-07 builds it, and the specification leaves a handful of
choices to the implementation. This record takes them. The task also inherits
two defaults the owner had already taken for the round (backlog,
`owner_decisions_defaulted`): chrome strings nobody wrote ship as dictionary
strings marked `data-demo="true"` with a `state/open.md` row each — the
placeholder convention of `DEC-0068` applied to chrome — and every engineer
records the round's defaults in one decision record, numbered in task order
from the block reserved for the round, with an index line. Both are followed
here.

What the code did before this task, measured on `next-2026` at `f5ae58c`:
`places.ts` branched on five digits into geo-api's postcode lookup and
answered an `unsupported`/`zip-only` outcome for a typed name where the index
was absent; `MAX_SUGGESTIONS` was 6; `place-index.ts` dropped the
municipality the index carries; `typeahead.tsx` rendered the name alone,
scrolled past 22 rem, and built the option href without the field's hidden
query, so `etcc_*` was lost on a pick; the dictionary's label, placeholder and
404 body named a postcode in both locales, as did the search blocks of the
five content artifacts A16 names; and no geolocation control existed.

## Decision

1. **The place search takes a name and nothing else.** `searchPlaces()` no
   longer looks at the shape of the string: five typed digits are matched
   against place and municipality names like any other string, match
   nothing, and classify as `uncovered` — the founding route (`D7`'s third
   row). The `unsupported` outcome and its `zip-only` hint are deleted from
   the type, the module and the BFF; the search never tells a visitor to
   type something else (`DEC-0079` §4).
2. **`?zip=` stays on `GET /api/places/search`, for one caller.** `DEC-0079`
   §7 keeps the order flow's scope step in postcode mode (`TS-WEB-0025 D3`),
   so the BFF keeps the parameter `TS-WEB-0004 D5` names — answered by a
   separate `searchPlacesByZip()` that runs only when `q` is absent, never
   by the name search, and never from a search surface. The registration
   resolver (`resolve-place.ts`, owned by T-16) is repointed at it with one
   call swapped, so its postcode gate keeps working until `TS-WEB-0023 D3`'s
   own change lifts the gate.
3. **The overlay shows four rows.** `D7a` says 3–4; four is the cap
   (`MAX_NAME_MATCHES`, `MAX_SUGGESTIONS`, `MAX_ROWS` — one number, three
   names for the three layers), and the client slices to it again so no
   answer can render more. The list has no `max-height` and no `overflow`:
   it never scrolls and never pages. Matching runs over place names first
   (exact, prefix, substring) and municipality names after (prefix,
   substring); either way the suggestion is the place, and every row reads
   "Ort (Gemeinde)" from a `municipality` field the `Place` type now carries
   out of the index (all 1,760 rows have one) and out of geo-api's
   hierarchy. The matched substring is emphasised at 700 by a plain
   case-insensitive match on the name; a match made through diacritic
   folding or on the municipality shows the row without emphasis rather
   than with a wrong one.
4. **A pick carries the field's query.** The option href is built through
   the route facade (`linkHref`) from the form's hidden query plus the slug,
   so `etcc_*` and the order flow's `orte` survive a pick exactly as they
   survive a submit (`TS-WEB-0023-A9`). `Enter` on an active row follows it;
   `aria-activedescendant` names it; without an active row the form submits
   as before.
5. **The no-match row is an option that is disabled, not a presentation
   item.** One `role="option"` with `aria-disabled="true"`, the `map-pin`
   glyph in muted, the sentence in ink, no link and no button — the ARIA
   listbox stays valid and the row is announced, while the onward action is
   the field's own submit (`D7a`, SRC-0014 §overlay).
6. **The geolocation control is a client component beside the hint, on
   every surface that carries the enhancement.** `place-search` gains
   `geolocation`, defaulting to `typeahead`, so the pages that asked for the
   overlay get the control without a page edit, and the pages that declined
   the enhancement (the 404) stay the plain form. It renders a real `<button
   type="button">` described by the "what will happen" sentence, disabled
   until hydrated (same geometry, no shift), and asks the browser **only on
   the click** — no effect, no observer. The glyph is Lucide `locate`, added
   to the icon table as SRC-0014 §Icons prescribes. Both strings are
   placeholders (`search.locate`, `search.locateExplains`), marked
   `data-demo="true"` and listed in `state/open.md` rows 215 and 216.
7. **The lookup is one `GET /api/places/nearest?lat&lng`, and the
   coordinates are dropped on arrival.** `TS-WEB-0010 D5` says the
   coordinates are never sent to our server; `TS-WEB-0008 D10`/`A1` say the
   BFF is the browser's only data surface and no client reaches geo-api;
   `D7` resolves coordinates against geo-api's point search. All three
   cannot hold at once, and the task text names the BFF route. D5's intent
   is kept where it can be: `nearestCoveredPlace()` runs **without**
   `resilient()` so no cache key is ever a coordinate, nothing is logged,
   the response is `Cache-Control: no-store`, and the body carries the place
   only. Sources in order: geo-api's proximity search with a token, the
   committed index (every community's own coordinate, no credential), the
   mock. No answer is a 404, and the control then does nothing. The tension
   is recorded for the spec owner (`state/open.md` row 217) rather than
   resolved here.
8. **A denial is not re-asked, and the page does not change.** After any
   error from the browser (denied, unavailable, timeout) the control stops
   asking for the rest of the page's life; it stays visible, enabled and
   unchanged, because a disabled or hidden control would be a change of
   the page and a message would be a second ask by other means.
9. **The wording.** Label "Dein Ort" / "Your place" — the owner's own label
   for this field (`content/pages/deine-region/de.md` slot 3); placeholder
   "Ortsname" / "Place name" — the noun the copy guide names in place of the
   postcode (`concept/website-copy-guide.md` §Postleitzahl); hint unchanged
   (it already spoke about names). The 404 body loses its postcode sentence
   and keeps its first ("Diese Adresse gibt es nicht." / "This address does
   not exist.") rather than gaining a new one. The five content artifacts'
   search blocks take the same two owner strings and the dictionary hint;
   the home artifact's rationale paragraph that stated the interim is
   removed, since `DEC-0079` §1 forbids stating one. Each of those content
   edits is one line in another task's file and is reported as such.
10. **`pnpm check:search-wording` is the A16 instrument.** It reads every
    string of the dictionary's `search` and `notFound` blocks in both
    locales and the `## …` section that carries each of the five named
    slots (`home-1-search-hero`, `dein-ort-0-state-s0`,
    `dein-ort-starten-5-search`, `deine-region-3-interim`,
    `registrieren-1-ort`) in both locales, HTML comments blanked, and fails
    on `Postleitzahl`, `PLZ`, `postcode` and `ZIP`. A missing slot is an
    error, not a pass. `content/pages/dein-kalender/bestellen/**` is named
    out of scope in the script (`DEC-0079` §7). It sits in the `check` chain
    before the static tests, so the pre-commit hook runs it.

## Consequences

- `TS-WEB-0008-A14` moves from "a ZIP classifies" to "a name and a
  municipality name each answer with the place, rendered Ort (Gemeinde)";
  the integration suite asserts it in both `LIVE_DATA` modes, and asserts
  that five digits reach `uncovered` through the name path.
- `TS-WEB-0008-A15` and `TS-WEB-0010-A8` are browser facts and live in
  `e2e/place-search.spec.ts`: row count and format, the byte-identical
  bounding box below the field, 0 CLS from the interaction, the single
  no-match row and the founding route, the JS-off form, and the ask count
  observed at `navigator.geolocation.getCurrentPosition` itself — zero on
  load and scroll, one on the click, still one after a second click.
- Pages owned by other tasks still carry the old wording in their **code
  fallbacks** (`app/[lang]/dein-ort/page.tsx` `searchHint`,
  `app/[lang]/dein-ort/starten/page.tsx` `PAGE_COPY`) and two e2e cases assert
  it (`e2e/pages/dein-ort.spec.ts` "postcode", `e2e/pages/dein-ort-starten.spec.ts`
  "Suche nach Ortsnamen"); the content now overrides the fallbacks, so the
  pages render correctly, and the fallbacks and cases are T-16's to retire.
  `src/components/gallery.tsx` (T-10) still labels its demo instance "Ort
  oder Postleitzahl" — a dev route, outside A16's surfaces.
- `e2e/search-persistence.spec.ts` types a place name (`Quilow`) instead of
  a postcode; every other e2e that typed five digits into a search surface
  relied on a postcode resolving, which the specification no longer offers
  — those cases now measure the founding route, which is the specified
  answer.
- The mock ring carries a municipality per place, so the overlay is
  reviewable under `LIVE_DATA=mock` in the same shape as under the index.
