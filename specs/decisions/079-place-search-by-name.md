---
id: DEC-079
title: The place search asks for a place name; a postcode is not offered
status: accepted
date: 2026-09-23
decided_by: jan-henrik.hempel
---

## Context

The specification had the premise inverted. `WEB-F-046`, `TS-008 D7`,
`Q-025` and six page specs said: *ZIP works today, name search is blocked
on geo-api, so the field asks for a postcode and explains the
restriction.* The preview shipped exactly that — "Suche nach Ortsnamen
kommt noch dazu — bis dahin reicht die Postleitzahl" under the hero
field — and the 2026-09-22 review rejected it in both halves
(`plan/reviews/2026-09-23/2026-09-22 Review SVF Preview Website.md`,
§Homepage/Hero/Funktional).

Both halves were wrong about a different thing:

1. **The measurement was right, the conclusion was not.** geo-api 3.1.3
   `community/search` takes `countryCode`, `lat`/`lng`, `zips` and
   geoname id lists — there is no name parameter (verified in the pinned
   `src/clients/geo-api/openapi.json`). But the website does not depend
   on that endpoint to search by name: it ships a committed index of the
   covered communities (`scripts/build-place-index.ts` →
   `src/generated/snapshots/communities.json`, 1,760 entries with place
   name, slug, position and municipality), built from the public
   village-calendar site, which needs no credential. Name search has
   been working; the specs described a blocker that the implementation
   had already routed around.

2. **ZIP is not a smaller version of the feature — it is a different,
   worse one.** A postcode is an administrative abstraction; a place name
   is the thing a person means when she says where she lives. "Hier komme
   ich her, hier lebe ich" is the emotional content of the entire entry
   point, and the site's primary conversion runs through it. A field
   asking for five digits asks the visitor to translate herself into
   an identifier first.

## Decision

**The website searches places by name. A postcode is not offered as a
product feature.**

1. The place search takes a **place name**. The typed string is matched
   against place names **and** municipality names, and a match is offered
   as the place. No surface of the search — label, placeholder, helper
   text, submit, page copy — offers, names or explains a postcode, and no
   surface states an interim.

2. **Where the names come from is an implementation detail, and it is
   free.** Today that is the committed covered-community index; tomorrow
   it may be a geo-api name endpoint (`Q-025`, geo-api #130 unified
   search and #166 coordinate search), or both behind the one BFF route.
   What is specified is what the visitor is promised — a name — not which
   store answers her. Swapping the store is not a change to `WEB-F-046`
   or to `TS-008 D7`.

3. **The typed name gets a suggestion overlay** (`TS-008 D7a`): from the
   second character, 3–4 rows, each rendered "Ort (Gemeinde)" so two
   villages of the same name are told apart, matching place and
   municipality names alike, drawn over the page so nothing below the
   field moves. It is a progressive enhancement: without JavaScript the
   field stays a plain GET form.

4. **A name with no match is not an error and not a dead end.** It
   produces no suggestion, and submitting it still reaches
   `/dein-ort/starten?ort=<query>` — the founding flow (`WEB-F-047`).
   The search never answers a visitor with silence and never tells her to
   type something else instead.

5. **`findbyaddress` stays forbidden** (`DEC-024` §3): a paid, slow
   external Google lookup.

6. **What this decision does not settle:** whether the search must find
   *uncovered* places Germany-wide. The index knows the covered
   communities only. That is `Q-071`, and `DEC-024` §1 is amended to
   point at it rather than to be read as settled.

7. **Out of scope:** the order flow's scope step (`TS-025 D3`) keeps its
   postcode mode. That is a buyer configuring which places a purchased
   calendar covers — a scope input, not the visitor's place search — and
   it stays as `DEC-069` §8 left it.

## Superseded statements

| Where | Said | Now |
| --- | --- | --- |
| `WEB-F-046` | "covers all of Germany; ZIP search works, name search requires the geo-api endpoint" | searches by name over the covered communities; ZIP not offered; source of names free; scope is `Q-071` |
| `DEC-024` §3 | name search *becomes* a geo-api endpoint | name search exists on the index; the endpoint is an upstream want (`Q-025`) |
| `TS-008 D7` | ZIP row "works today", name row "blocked on Q-025", ZIP placeholder as an interim | name is the input; ZIP not offered; the interim sentence is deleted |
| `TS-008-A14` | a typed name produces "the documented ZIP hint" | a typed name produces suggestions; a name without a match produces the `starten` destination |
| `Q-025` | ZIP-only until it lands; blocks `WEB-F-046` | upstream demand; blocks nothing that ships |
| `TS-019`, `TS-020`, `TS-021`, `TS-023`, `TS-025 D3` | "ZIP-only until Q-025", "reachable only by ZIP", "bites hardest here" | removed; the criteria that asserted ZIP behaviour assert name behaviour |

## Consequences

- **The specs stop describing a blocker that does not block.** `Q-025`
  continues as an upstream demand to geo-api and gates nothing on the
  website; its value is that it would let the committed index be retired
  and would make option 1 of `Q-071` possible.
- **The committed index becomes load-bearing** and therefore needs its
  refresh path treated as such: `pnpm build:place-index` before a release
  whose village set moved. A stale index costs suggestions, not the
  search — an unmatched name still reaches `/dein-ort/starten`.
- **Copy work follows.** Every visitor-facing string that names a
  postcode on a search surface is now a defect against `WEB-F-046`,
  asserted statically by `TS-008-A16` — in both locales, in the
  dictionary defaults and in the page content artifacts.
- **The overlay is now specified, not free.** `TS-008 D7a` determines
  placement, row count, row format and the no-shift rule; only debounce,
  request cancellation and highlight styling stay free.
- **`DEC-024` is amended rather than replaced.** Its points 2 and 4 (the
  uncovered place as a conversion moment; proof only from covered places)
  are untouched and still carry `WEB-F-047`.

## Amendment 2026-09-24 — §6 is closed: covered-only ships, Germany-wide is the target

§6 left one thing open — whether the search must find *uncovered* places
Germany-wide — and named `Q-071` for it. **Q-071 is answered**
(owner, 2026-09-23/24), along the proposal it carried:

1. **Suggestions cover the covered communities only.** The overlay of §3
   is fed by the committed index; a name outside the ~1,760 covered
   communities produces no suggestion. That is the current state and it
   ships.
2. **A typed name with no match still reaches `/dein-ort/starten` on
   submit**, with the raw query as `?ort=` (§4, `WEB-F-047`). The
   activation path stays intact, which is the whole reason covered-only is
   acceptable: the visitor is not stopped, she is routed.
3. **Germany-wide finding by name remains the target**, carried by
   `Q-025` as an upstream demand to geo-api. It is a target, not a
   commitment on a page: no search surface states a limit, states an
   interim, or promises a reach it does not have (§1 unchanged).

`DEC-024` §1 is re-read accordingly — see its second amendment. §7 (the
order flow keeps its postcode mode) is untouched and was confirmed
unchanged by the same round of decisions.
