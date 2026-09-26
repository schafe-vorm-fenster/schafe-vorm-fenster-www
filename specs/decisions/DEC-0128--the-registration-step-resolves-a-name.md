---
id: DEC-0128
title: The registration step resolves a name — the `isZip` gate goes, a municipality hit asks which village, the step-1 submit is the page's one primary, and the typed string cannot be canonicalised in the page
status: DRAFT
date: 2026-09-25
decided_by: the engineering team
---

## Context

`DEC-0079 §1` fixed the place search on a **name**: "no surface of the
search — label, placeholder, helper text, submit, page copy — offers, names or
explains a postcode, and no surface states an interim". `T-07` (`DEC-0119`)
carried that through the search module, the dictionary, the BFF route and the
five content artifacts `TS-WEB-0008-A16` names, and `pnpm check:search-wording`
has held it since.

Three things it could not reach stayed behind, all of them on this task's
surfaces:

1. **`app/[lang]/mitmachen/registrieren/resolve-place.ts:38` still gated on
   `isZip`.** A typed name was dropped unread — `return { kind: "unresolved" }`
   before any lookup — and five typed digits were the only input step 1 could
   answer. The registration flow was therefore the one search surface of the
   site still running in postcode mode, behind a field whose own helper line
   promises suggestions for a place name. `TS-WEB-0023-A2` ("a typed place name
   that matches … shows step 2") could not hold, and `TS-WEB-0023-A6` (a
   municipality with several communities does not advance) was unreachable
   code: `searchPlacesByZip`'s mock answers at most one place per postcode, so
   the `ambiguous` branch existed only under a stub in the unit test.
2. **`content/pages/dein-ort/starten/{de,en}.md`'s preamble still stated that
   the page "adressiert die Besucherin nie direkt" / "never addresses the
   visitor directly".** `TS-WEB-0021 D9` was amended on 2026-09-24 to the
   opposite — the reader is addressed directly on every page, and what differs
   on the founding page is the *ask*, not the voice — and review decision 15
   (2026-09-23) retired the carve-out outright. The artifact was citing a
   retired determination.
3. **Step 1 rendered no `data-cta="primary"` at all**, while
   `TS-WEB-0023-A1` asks for "exactly one".

The postcode sweep of the *strings* on these three surfaces turned out to be
already done: `check:search-wording` scans the `dein-ort`,
`dein-ort/starten` and `mitmachen/registrieren` search blocks and the three
page modules, and it reported no errors before this task changed a line. What
was left was the behaviour behind the field, the retired-determination note,
and the ladder.

## Decision

**Step 1 resolves a place name through the same `searchPlaces` every other
search surface uses.** The `isZip` gate is deleted, not widened.

1. **The lookup order is slug, then name.** `resolvePlace(raw)` answers first —
   an `?ort=` arriving from `/dein-ort/starten`, `/mitmachen` or the empty
   calendar view is already a community slug (`D5`) and must not be spent on a
   search. Only what is not a slug goes to `searchPlaces`, which matches place
   **and** municipality names out of the committed community index.
2. **Five typed digits are a string, not a mode.** They are matched like any
   other name, match nothing, and step 1 stays unanswered with the value
   echoed only in the field (`A5`). `searchPlacesByZip` is no longer called
   from this page; it keeps its one caller, the order flow's scope step, which
   `DEC-0079 §7` leaves in postcode mode.
3. **More than one suggestion asks which one — unless one of them is the name
   as typed.** `D3`'s "municipality hit" row is implemented as
   "`suggestions.length > 1` → `ambiguous`", not as a test for whether the
   typed string *was* a municipality name: `searchPlaces` resolves
   `outcome.place` to its first match, and the slug is what travels to the app,
   so a wrong village is not a correctable mistake here. The one exception is
   an **exact name match that is unique**: `searchByName` ranks an exact folded
   name ahead of every prefix, substring and municipality match
   (`src/lib/live/place-index.ts:114-140`), so for a name the visitor spelled
   out in full the first suggestion is not a guess. Measured over
   `src/generated/snapshots/communities.json`: **62** covered names whose exact
   match is unique and whose raw spelling misses the literal slug lookup were
   sent to a chooser they do not need — 12 of them blocked only by an unrelated
   row that contains the string (`Bömitz` behind `Labömitz`, `Gülzow` behind
   `Gülzowshof`, `Knüppeldamm` behind `Knüppeldamm Ausbau`), the other 50 by
   the villages of a municipality that carries the typed name as well, where
   the exact row is that municipality's seat (`Groß Polzin` → `gross-polzin`,
   `Groß Kiesow` → `gross-kiesow`). Neither group is the "search resolving to a
   municipality with several communities" `A6` asks the question for: there the
   typed string is no community's name at all. What keeps the question open is
   a *second* row of the same
   name (two `Görke`, in Dargen and in Postlow), which is the case
   `TS-WEB-0008 D7a` prints the brackets for. Exactness is decided with the
   index's own `fold`, exported for this caller, never with a second
   normaliser.
4. **A candidate row reads `Ort (Gemeinde)`.** The row is formatted by
   `suggestionLabel()` in `src/components/place-search/suggestion-row.ts` — the
   function the typeahead's own rows use (`TS-WEB-0008 D7a`, `A14`), so a
   chooser row and a suggestion row cannot drift apart, and a blank
   municipality prints the bare name rather than empty brackets. No page-local
   copy of that format exists. The value taken from a row is the community slug
   (`D3`).
5. **The candidate chips are marked `demo` only when the data is demo.** The
   page passed `state="mocked"` for every `ambiguous` lookup while the branch
   was unreachable; now that it renders, the flag follows `lookup.demo`, which
   is `false` for the committed index (`config.ts`, `placeSearchByName` is a
   real backend). Marking real rows as demo would be a false provenance claim
   (`DEC-0068`).
6. **`TS-WEB-0023-A6` becomes an e2e fact, on `Lindetal`.** Measured against
   `src/generated/snapshots/communities.json`: six communities carry `Lindetal`
   as their municipality — `Alt Käbelich`, `Ballin`, `Dewitz`, `Leppin`,
   `Marienhof`, `Plath` — while no community is *named* `Lindetal`, no slug is
   `lindetal`, and no name contains the string. So the slug lookup misses, the
   exact-name exception of §3 does not apply, and the chooser is reached for the
   reason `A6` states, with the first four rows shown (`D7a`'s cap). The unit
   test walks the same case against the same data, and the "not e2e-walkable
   today" note in `e2e/pages/registrieren.spec.ts` is withdrawn.

   The first draft of this record used `Groß Polzin` and claimed it had "five
   covered villages behind it and no community of its own slug". Both halves
   were wrong against the committed data: the five matching rows are the seat
   community `Groß Polzin` (slug `gross-polzin`) plus four villages, and the
   ambiguous branch was reached only because `resolvePlace()` matches slugs
   **literally** (`src/lib/live/places.ts:197-213` → `place-index.ts`'s
   `BY_SLUG`, `trim().toLowerCase()`), so the typed `Groß Polzin` missed
   `gross-polzin` by spelling. A fixture that depends on that would flip to
   `resolved` the day the slug lookup folds or slugifies its input. `Lindetal`
   depends on nothing but the index's municipality column.
7. **The step-1 submit carries `data-cta="primary"`.** Searching *is* the
   advance on this step — a resolved place moves the flow to step 2 by itself —
   so the one control on the screen is the one primary `A1` asks for. The
   founding-page escape hatch under a failed search stays `primary-light`, so
   the count is one in every state step 1 can render.
8. **The field's placeholder comes from the artifact**, not from the module's
   dictionary default: `registrieren-1-ort`'s "Sucheingabe (Placeholder)"
   field, the same binding `/dein-ort/starten` already makes. No new sentence
   was written for it.
9. **The `/dein-ort/starten` preamble is corrected to the amended `D9`.** The
   sentence is editorial prose in the content artifact, outside every slot, and
   it is rewritten from the spec's own amended text plus review decision 15 —
   no visitor-facing copy changed, and the artifact now says that the earlier
   "never direct" is retired.

### What the page cannot do: canonicalise the typed string

`D4` says the state in the query is `?ort=<slug>`, and `A2` reads "puts
`ort=<slug>` in the URL". Step 1 is a plain `<form method="get">`, so the value
it submits is the string the visitor typed; the slug is one lookup later. The
obvious repair — `redirect()` to the canonical value in the page — was built
and **measured against a production build, where it does not work**:

```
$ next start && curl -D - '/mitmachen/registrieren?ort=Wolfradshof'
HTTP/1.1 200 OK
x-nextjs-prerender: 1
x-nextjs-postponed: 1
…body contains NEXT_REDIRECT;replace;/mitmachen/registrieren?ort=wolfradshof;307
```

That is exactly the failure `src/lib/routes/place-hop.ts` records for the two
`?ort=` pages (`F-2-49`): with Cache Components the route resumes from a
postponed prerender, `redirect()` thrown during the resume is past the point
where the status line can change, and a browser without JavaScript receives a
200 with an empty document. The redirect was therefore **removed again**, and
the reason is written into the page where the next reader will look for it.

What holds instead: the typeahead's rows carry the slug, so the enhanced path
puts `ort=<slug>` in the URL on its first navigation; the plain form's typed
name resolves server-side to the same step 2 with the place answered and
named, and every control from there on is built from `resolvedOrt` — the slug —
so the typed string survives exactly one request and never reaches the
handover. Canonicalising the first request needs the **proxy**, the way
`place-hop.ts` does it, and that is a routing change in a module this work
package does not own.

## Consequences

- `resolve-place.ts` no longer imports `isZip` or `searchPlacesByZip`. The only
  caller of the postcode lookup left on the site is the order flow's scope
  step, which is what `DEC-0079 §7` intends.
- `TS-WEB-0023 D5`'s `ort` row still reads "Validation | geo-api slug lookup".
  That is now incomplete — the validation is a slug lookup **or** a name search
  — and it is the newer `DEC-0079 §1` that governs. The row is left for the
  spec owner rather than amended here: this task was not given `TS-WEB-0023` to
  edit, and no determination is contradicted, only under-described.
- `A2`'s slug clause holds on the enhanced path and from step 2 onward, and not
  on the first request of the no-JS path. `A2` is therefore reported as a
  **deviation**, not as met: the two `ort=Wolfradshof` assertions pin the
  interim shape and say so at the assertion, so the day the proxy hop lands
  their failure is the expected signal.
- **`state/open.md` row 126 / `F-2-5` is discharged.** It asks the live-data
  owner for "one municipality fixture with several communities" because
  `mockSearchByZip` answers at most one place per postcode and the ambiguous
  branch was "not e2e-walkable today". The postcode path is gone from this page
  and the committed index carries the case (§6), so nothing is owed by the
  shared mock any more. The row is left to its owner rather than edited here;
  `T-16`'s `files_shared` entry ("a same-name fixture for A6 — T-07 owns") is
  likewise moot.
- `src/lib/live/place-index.ts`'s `fold()` is exported (one word plus its
  reason). §3's exactness test has to fold the way the index matched, and a
  page-local normaliser would answer differently for `ß` and for every umlaut —
  the same reuse rule that keeps the candidate row on `suggestionLabel()`.
- Step 1 now contributes one `[data-cta="primary"]` to `e2e/cta-contrast.spec.ts`'s
  measurement on this route — the same 44 px search submit the home hero
  already carries.
- No placeholder copy was introduced: every string this task touched is either
  owner wording already in an artifact or a dictionary value `T-07` set.
- `e2e/registrieren-empty.spec.ts`'s `99999` case is unchanged in behaviour and
  renamed in intent: it is a value no place matches, not a postcode lookup that
  failed.
