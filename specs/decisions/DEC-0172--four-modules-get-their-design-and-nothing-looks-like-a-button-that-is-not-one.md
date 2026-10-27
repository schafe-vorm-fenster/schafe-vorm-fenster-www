---
id: DEC-0172
title: The customer proof becomes a stream of voices, the comparison pairs the archive ground with a fresh one, the benefit band becomes a flow, the trust block takes the provenance ground — and nothing looks like a button that is not a control
status: accepted
date: 2026-10-27
decided_by: jan-henrik.hempel
---

## Context

The owner's review of 2026-10-27
(`plan/reviews/2026-10-27/2026-10-27 Review Termine veröffentlichen und Dein Kalender.md`)
called four modules on `/mitmachen` and `/dein-kalender` ugly and asked three
times whether they had not been redesigned already: the customer proof
"Wo es wirklich benutzt wird" and the trust block after it (#91), the comparison
"Wer euren Termin heute nicht mitbekommt" (#94), and the benefit band of
"Was drinsteht, bestimmt ihr" (#96, "warum schwarze und weiße Buttons gemischt?
Was ist die inhaltliche Bedeutung?").

What the record shows, per module, before anything was changed:

| Module | Newer design than the code? | Why it was not applied |
| --- | --- | --- |
| Customer proof (#91) | **No drawn design for this module.** The only rule was the polish brief's G-7 (`plan/polish-brief.md:241`, text: "a wide feature card … the rest are compact rows"), and the code followed it. Newer quote designs exist — `concept/v2.0/Geschichten Modul.dc.html` 1a (DEC-0153) and the `/ueber-uns` design (`plan/reviews/2026-10-12/Design - Über uns Vorschau - *.jpg`, DEC-0162) — but each decision is scoped to its own page, and the quote treatment needs a cited source the customer records do not have (DEC-0143 §3). SRC-0014 had no section for a proof stream at all. The grey feature card also broke SRC-0014 itself: a card floating on a `lime-100` ground, in grey-green, which "never carries positive content". | Never decided for these pages; nobody designed a source-less customer claim. |
| Trust block (#91) | **No drawn design.** The polish brief's fix 5 (`plan/polish-brief.md:670`) is text, and the code followed it; the 2026-09-10 board (`UI Design Mobile v3.dc.html:558`) is older. | It looked like the old state because it stood on the same `lime-100` as the proof before it: two sections, one ground. |
| Comparison (#94) | **Yes, partly.** The review of 2026-09-22 gave two references for this section: the draft *Heute — und mit dem Produkt* (hairline rows, `Design - 3-Schritte-erklären … 11.10.34.png`) and the sepia design *wo es hakt* (`Design - wo es hakt.png`), with "wir orientieren uns hier am Sepia-Design von `/mitmachen`" (review line 188). Only the first was built (DEC-0106 §2); the second was built on `/mitmachen` alone. The `Desktop Raster` board (DEC-0150) draws the label above the sentence and the right label in `lime-800`; the code set both inline and grey. | The sepia half was dropped without a record; issue #51 even says the review assigns it to `/mitmachen` only. A mixed today/with table cannot sit wholly on the archive ground, which "never carries the solution" — that is the constraint nobody wrote down. |
| Benefit band (#96) | **No — the code is the design.** `Design -. Portalize Einstellungen 1.png` (review of 2026-09-22, line 233) draws exactly the white pills, the arrow on its own line and the black target pill. | The design itself is the problem: four non-interactive pills drawn at button size, in two fills whose meaning nothing states. DEC-0136 then made it worse: the source *Vereinswebsite* became CG-040's *eure eigene Website*, nearly the same words as the target *eure Website*. |

## Decisions

1. **The customer proof is a stream of voices** (SRC-0014 §Proof stream,
   `TS-WEB-0024` D9, `TS-WEB-0022` D6). Every item is the same flat element on
   the section's own ground — no fill, a hairline above (`hairlineOnLime` on
   `lime-100`) — with the claim first and a byline under it: a 40 px initials
   well (the icon well's size and fill, decorative, `aria-hidden`), the name in
   mono and the role or place. The first item keeps the whole row with its
   claim at sub-head size; the others are at card size and stand 6 + 6 from
   `xl`. It is the language of `/ueber-uns` (DEC-0162: chapter 02's inline
   proof, the quote card's order) without quotation marks, because none of the
   records cites a source (DEC-0143 §3). A cleared portrait or logo would take
   the well's place; no proof record carries one for a voice, so none renders.
   The change is in `proof-card`'s two stream emphases, so `/`'s proof stream,
   which uses the same emphases, takes the same form.
2. **The comparison pairs the old world with a fresh ground** (SRC-0014
   §Comparison, `TS-WEB-0024` D4). Each row is two flat fields that butt:
   *today* on the `archive ground` (`text-2`, label `archive ink`), *with your
   calendar* on `lime-100` (`ink`, label `lime-800`). The mono label stands
   above its sentence, as the `Desktop Raster` board draws it, with a colon for
   assistive technology only. Stacked below `xl`, 6 + 6 from it. This carries
   the sepia design's archive ground into the pair the owner asked to keep,
   and answers the 2026-09-22 complaint that the stacked comparison does not
   work on the phone ("Vielleicht was mit Farben?"). **No copy changed**: the
   kicker, the title and the eight sentences stay as they are; their didactics
   are issue #51's.
3. **The benefit band is a flow** (SRC-0014 §Source-to-target flow,
   `TS-WEB-0024` D12). Captioned with the lead sentence's own two verbs
   (*So kommen sie rein* · *Hier landen sie*), the sources are a plain list with
   their glyphs, a decorative arrow points to the target (down while stacked),
   and the target is one square `paper` field. The content logic, stated: the
   sources are **the actors' channels** — a flyer by WhatsApp, their Google
   calendar, their own website — and the target is **the customer's website**,
   where all of it lands. The third source therefore reads *Websites der
   Akteure* / *local groups' websites*, the word row 3 of the comparison already
   uses for the same people; CG-040's row for *Vereinswebseite* is amended to
   say a source is never addressed to the reader whose website is the target.
4. **The trust block takes the provenance ground** (SRC-0014 §Trust block,
   `TS-WEB-0024` D10). `violet-500` instead of `lime-100`: who runs the service
   and what happens to the data is this page's provenance, and the block no
   longer runs on from the proof section as one ground. The subjects stand side
   by side from `xl`, each under a hairline in the ground's label colour; still
   no icons. `rhythm.test.ts` passes with it.
5. **Nothing looks like a button that is not a control** (SRC-0014 §Do Not,
   `TS-WEB-0002` D5 and A14). A pill 36 px or taller, at least 1.5 × as wide as
   tall, with a fill or a 2 px border, is a link, button, summary, form control
   or label, sits inside one or holds one. The one exemption is a picture of a
   control inside an `aria-hidden` illustration (the explain module's drawn
   form). `e2e/control-styling.spec.ts` walks every route in both languages.

## What holds it

- `TS-WEB-0024-A23` (comparison), `A24` (flow), `A25` (proof stream), `A26`
  (trust ground), `TS-WEB-0022-A23` (proof stream on `/mitmachen`) —
  `e2e/module-designs.spec.ts`, at 390 and 1280 px, by token and position,
  never by wording.
- `TS-WEB-0002-A14` — `e2e/control-styling.spec.ts`.
- `comparison-table.test.tsx` — the halves and the hidden colon.
- Design-system contract rows `proof-stream`, `comparison-table`,
  `source-flow`, `trust-block`, and the `chip` row ("always a control").

## Not decided here

- The comparison's kicker and title (#51) and the CG-005 rule they need.
- `/deine-region`'s proof block still renders the default filled `proof-card`
  on `lime-100`; it is not part of the review and is left to its own issue.
