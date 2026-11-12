---
id: DEC-0195
title: The home page has no closing block, and its context band is headed "Erfahre mehr über unsere Kalenderplattform"
status: accepted
date: 2026-11-12
decided_by: jan-henrik.hempel
---

## Context

Issues #148 and #149. The closing search block on `/` ("Schau nach, was bei
dir los ist", `home-11-closing-cta`, on `ink`) repeated the hero's search and
the focus module. The context band's heading "Heute mit einem anderen Anliegen
hier?" no longer fits a band that now leads straight into the contact section.

## Decision

1. **`/` has no closing block.** `PageFrame` takes `closing: { variant: "none" }`
   (the shape DEC-0186 introduced for `/ueber-uns`). The slot
   `home-11-closing-cta` is removed from both locales' content. This is a
   documented exception to TS-WEB-0006 D6, recorded in D6 itself and in
   TS-WEB-0019 (D3 row 4, A9, A10, A11). The hero's search submit stays the
   page's one `data-cta="primary"`, so no primary conversion is lost.
2. **The search's second instance carries no closing job any more.**
   `search(false)` stays: it feeds the focus modules (TS-WEB-0019 D2 S2/S3),
   not the closing block. TS-WEB-0019-A10's "same target and label" clause is
   replaced by "no `#closing-cta`, one primary".
3. **The band heading on `/` changes** to "Erfahre mehr über unsere
   Kalenderplattform" (EN: "Learn more about our calendar platform"), in the
   slot `home-10-context-band`. The fallback heading used by other pages is
   unchanged.
4. **Ground order at the end of the page is kept.** Seen at 1440 and 390 px in
   both locales: proof stream `lime-100` · context band `surface` · contact
   section `lime-100`. The band's near-white grey reads as a calm break
   between two green sections, the band's cards stay legible, and "section
   grounds carry rhythm, not meaning" (SRC-0014) leaves no reason to swap one.
   The page-rhythm list loses its trailing `ink` and has no violation
   (`page-rhythm.test.ts`); the second `ink` section of DEC-0117 no longer
   exists on `/`.

## Consequences

`e2e/pages/home.spec.ts`, `routes.spec.ts`, `page-order.spec.ts` and
`contact-section.spec.ts` treat `/` like `/ueber-uns`: no `#closing-cta`. The
render-site line numbers in `src/lib/content/validate.ts` and the content
README moved with `page.tsx`.
