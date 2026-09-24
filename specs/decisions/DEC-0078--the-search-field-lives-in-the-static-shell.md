---
id: DEC-0078
title: A streamed boundary never carries a control that holds what a visitor types — the search field lives in the static shell
status: accepted
date: 2026-09-19
decided_by: run/developer (row 213 work package)
---

## Context

`state/open.md` row 213, measured on the production build
(`VERCEL_ENV=preview pnpm build && VERCEL_ENV=preview pnpm start`): a
postcode typed into the home page's search was present in the input at
96 ms and gone again at **349 ms**, 3/3 runs, with Playwright's `fill()`
*and* with real `keyboard.type()` key events. `/dein-ort` and
`/mitmachen/registrieren` kept what was typed. This is the site's primary
conversion entry, and the window is widest exactly where the audience is —
on a slow rural connection.

The cause, confirmed in the shipped HTML rather than inferred:

- `/` and `/en` were the **only two routes in the build with a streamed
  `<Suspense>` boundary** (`<template id="B:0">` count: 1 on `/` and `/en`,
  0 on `/dein-ort`, `/deine-region`, `/dein-ort/starten`,
  `/mitmachen/registrieren`, `/dein-kalender/bestellen` — the other four
  read `?ort=` in the page and carry `instant = false`).
- That boundary's **fallback was the whole of block 1**, search module
  included: the pending segment of `/`'s HTML held one `<form>`, one
  `<input id="ort-suche-fokus">` and the page's single
  `data-cta="primary"`; the resolved branch held a second copy of all
  three in the `<div hidden id="S:0">` at the end of the body.
- React reveals a boundary by inserting the resolved branch's DOM and
  removing the fallback's. On a bare `/` — no `?ort=` at all — the
  resolved branch renders the *same* S1 markup, so the visitor sees no
  change and loses the value anyway. Every load of `/` paid this, not just
  the stated ones.

It also explains an intermittent red: `TS-WEB-0021-A14` failed once in five full
runs with the empty-parameter signature `/dein-ort?ort=` that
`search-form.tsx` documents as C3-H-2. The `<form>` was inside the swapped
subtree, so F-3-12's "refuse the second submit of the same document" ref was
re-created underneath a double click.

### What was ruled out, and why

1. **Capture the typed value before hydration.** The window is 96–350 ms;
   the shell's own client bundle has not run yet, so no React listener
   exists to remember anything. Catching it needs an inline script, and
   DEC-0045's hash-only `script-src` cannot hash a request-time script
   (row 132). Ruled out by the CSP, not by taste.
2. **Move the field into the client.** Costs the no-JS guarantee the
   control exists for (FUN-WEB-0010, TS-WEB-0019-A11) and does not help: the value
   is lost before any client chunk runs.
3. **Make `/` block (`instant = false`), like `/dein-ort`.** Removes the
   boundary, and with it `/`'s prerendered shell (`state/open.md` row 131
   counts `/` among the eight that prerender). Row 132 then applies to the
   site's primary entry: a dynamic route does not hydrate under the
   production CSP, which would take the conversion tracker, the burger menu
   and the typeahead down on `/`. Ruled out.
4. **Hand `?ort=` on `/` to the place route** (a third row in
   `place-hop.ts`). Would delete TS-WEB-0019 D2's S2/S3, and with them the
   page's only conversion event (`save-calendar-to-homescreen`, D7) and
   TS-WEB-0019-A3/A4/A13. A rendering defect does not justify deleting specified
   product behaviour.

## Decision

**The line between the prerendered shell and a streamed boundary runs
around what holds visitor input — not around a page block.**

1 — **No `<input>`, `<textarea>` or `<select>` may be rendered inside a
`<Suspense>` boundary, on any route.** A boundary reveal replaces DOM, and
a replaced control loses whatever a visitor had already put into it. This
is a site-wide rule (TS-WEB-0009 D2, acceptance `TS-WEB-0009-A14`), enforced against
the shipped HTML of every route in `e2e/search-persistence.spec.ts` rather
than by review.

2 — **On `/`, block 1 is split across three small boundaries and a static
remainder.** The hero's photograph, its kicker and the **whole search
module** — `<form>`, label, input, hint, typeahead mount point — are the
prerendered shell. Only these arrive through a boundary:

| Boundary | Carries | Why it has to |
| --- | --- | --- |
| hero content | the headline · lead · CTA trio (`HeroContent`) | TS-WEB-0019 D2 keys all three on the resolved place |
| search submit | the 44 px submit button (`SearchSubmit`) | `data-cta="primary"` moves from the submit (S1) to the hero CTA (S2/S3), and an attribute cannot be streamed on its own |
| module slot | the ink `#place-dates` section and S3's `#nearby` | the modules *are* the stated states |

Each boundary's fallback and resolved branch render through the **same**
component (`HeroContent`, `SearchSubmit`, `FocusModules`), so "the reserved
space is identical whichever branch the page renders" — TS-WEB-0019 D2's own
free choice — holds by construction. On a bare `/` all three resolve to
byte-identical content, so the visitor sees nothing move.

3 — **The seams this needs are three optional props, not a rewrite.**
`hero-block` gains `content` (the headline/lead/CTA trio as a node) and
`search` (a slot rendered under the CTA, outside whatever the page puts in
`content`); `search-field` gains `submit` and exports `SearchSubmit`;
`place-search` passes `submit` through. Every other caller of the three
components is untouched and keeps the old props.

4 — **`?ort=` is still read once per request.** The three boundaries share
one resolver through React's `cache()`, so the split costs no extra geo
lookup and no extra dates read.

### What stays true

- `/` and `/en` still prerender; `state/open.md` row 131's count of eight
  is unchanged, and row 132's CSP situation gains no new dynamic route.
- The form is still a plain GET to the place route and still complete with
  JavaScript off (TS-WEB-0019-A11).
- The typeahead still attaches to the field by id — and now to a field that
  cannot be pulled out from under it.
- No new inline script anywhere.
- TS-WEB-0019 D2's four states, TS-WEB-0019-A2/A3/A4/A5/A13 and the single
  `data-cta="primary"` per page (TS-WEB-0006 D3) are unchanged.

## Consequences

- One control is still replaced by a reveal on `/`: the submit **button**.
  It holds no value, its two branches are the same element at the same
  size, and the swap is the price of a per-request `data-cta`. A visitor
  who has tabbed onto it inside the reveal window loses focus — a strictly
  smaller surface than the whole form, and the field itself never loses
  focus, because it never leaves the document.
- `/`'s HTML carries three boundary markers instead of one. The streamed
  payload is smaller than before, because the search module no longer
  travels twice.
- A future page that puts a form behind a boundary fails `TS-WEB-0009-A14` in
  e2e rather than shipping a silent value loss.

## Evidence

Production build, hash asset removed, `--workers=3`, `LIVE_DATA=auto`.

| | before | after |
| --- | --- | --- |
| `e2e/search-persistence.spec.ts` | 5 failed / 8 passed — both identity walks and both typing walks on `/` and `/en`, plus the HTML rule | 13 passed |
| distinct `#ort-suche-fokus` elements per load of `/` | 2 | 1 |
| `<input>` inside a streamed boundary | `/`, `/en` | none on any route |
| `e2e/pages/home.spec.ts` (TS-WEB-0019-A2…A14) | passing | passing |
| `e2e/layout-stability.spec.ts` | passing | passing |
