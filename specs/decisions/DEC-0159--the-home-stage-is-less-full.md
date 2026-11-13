---
id: DEC-0159
title: The place stage is less full, keeps its search once a place is known, carries no counter, and hands off to publishing in a row of its own
status: accepted
date: 2026-10-13
decided_by: jan-henrik.hempel
---

## Context

Four points of the owner's review of 2026-10-12 (DEC-0154) concern the place
stage on `/` and `/dein-ort` and the live dates under it:

- **#20** — the stage is too full: a helper line ("Tipp den Ortsnamen ein —
  Vorschläge kommen ab dem zweiten Buchstaben."), the location link and a
  paragraph explaining it ("Fragt den Browser einmal … Gespeichert wird
  nichts.") stand under one search field.
- **#23** — the stage with a chosen place looks "verdammt langweilig"; the
  search for another place should stay in it.
- **#24** — the counter "Termine, die gerade im Kalender stehen — 8.543
  Termine" says nothing to anyone. DEC-0154 already took it out of the
  specification (TS-WEB-0019 D3 block 2d, A14 superseded, CG-034); the render
  and its test were owed.
- **#25** — the hand-off "Fehlt deine Veranstaltung, jetzt selbst eintragen."
  is right but too inconspicuous.

The owner's rulings are the issues' acceptance lists. This record states how
they were carried out and the two choices the implementation had to make.

## Decision

1. **The stage search is compact** (#20). The placeholder carries the
   instruction ("Tipp den Ortsnamen ein" / "Type the place name"); no helper
   line is printed; the "use my location" control stands directly under the
   field. The field's label stays ("Dein Ort" / "Your place", from the
   dictionary) — only the visible hint goes. `place-search` gains a `stage`
   treatment for this; every other surface keeps its helper line.
2. **The location explanation is read, not seen.** TS-WEB-0010 D5 requires the
   control to "state what will happen", and #20 asks that the data-protection
   note stay findable without standing on the stage. The sentence remains the
   control's `aria-describedby` text and becomes its `title`. Open point below:
   the privacy policy has no section on browser geolocation.
3. **A placeholder must fit.** A placeholder cannot wrap, and SRC-0014 forbids
   truncated text. At the body size "Tipp den Ortsnamen ein" (191 px) does not
   fit the 171 px a 360 px phone leaves; at the meta size (159 px) it does. The
   stage placeholder takes the meta size; typed text keeps the body size.
4. **State A keeps the search** (#23) on `/dein-ort`, placeholder "Anderen Ort
   suchen" / "Search another place". The review's "Suche nach einem anderen
   Ort …" measures 270 px and would be cut at every phone width, so the issue
   title's own wording is used. The search carries no `primary` marker in state
   A (the handover does). The lower "search for another place" section stands
   in state B only, so state A does not ask the same thing twice. On `/` the
   search already stays in every state (it is the prerendered shell, DEC-0078);
   its placeholder does not vary by state, because an input attribute cannot
   stream.
5. **No counter on `/`** (#24). The render, `CountersIsland` on `/`, the
   manifest's position 4, the content slot `home-9-counters` and the unused
   badge unit word go. `/` requests no `/api/stats`. `TS-WEB-0019-A14`'s test is
   removed and `A18` asserts the absence. `/deine-region` keeps its counter —
   its spec (TS-WEB-0026) is not touched by this review.
6. **The hand-off is a row** (#25): a hairline above it, the question
   "Fehlt deine Veranstaltung?" at card size in `paper`, and one `secondary`
   button "Jetzt selbst eintragen" to `/mitmachen` — `paper` on `ink`, the
   ground where SRC-0014's secondary is legal. Never `primary`; the page keeps
   exactly one. Stacked on the phone, one row from `md`.

**The coverage budget moves by one** (DEC-0141's ratchet): `TS-WEB-0019-A14`
is superseded and describes a render that no longer exists, so it has no
instrument and cannot get one; `MISSING` goes from 135 to 136 in
`specs/verification/coverage-budget.json`. A test that named A14 while asserting
A18 would count a superseded criterion as verified, which is the worse lie.

New criteria with their tests: TS-WEB-0019-A17 (#20), A18 (#24), A19 (#25),
TS-WEB-0020-A18 (#20, #23). TS-WEB-0019-A1 reads three live modules.

## Open points

- **The privacy policy does not mention browser geolocation.**
  `content/legal/privacy-policy.md` is imported from Google Workspace and was
  not edited. If the location query needs a note there, it is the owner's
  legal text.
- **At 320 px** the German S0 placeholder (159 px) is 26 px wider than the
  field (133 px) and is cut; the English ones miss by 1–3 px. 360 px is the
  phone the criteria hold it to. Fixing 320 would mean an icon-only submit
  below 360 px, which is a design question, not this record's.

## Consequences

- `concept/website-design-system.md` §Search field gains "On a stage the field
  stands alone".
- TS-WEB-0019 D1, D2, D3, D5, A1, A14, A17–A19; TS-WEB-0020 owed list (done)
  and A18; `plan/reviews/2026-10-12/spec-impact.md` rows #20, #23, #24, #25.
- Content: `home/de.md`, `home/en.md` (slots 1, 2, 12; slot 9 removed),
  `dein-ort/de.md`, `dein-ort/en.md` (slots 0 and 1).
