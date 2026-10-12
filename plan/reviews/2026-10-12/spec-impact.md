# Spec impact of the 2026-10-12 review

Derived from `2026-10-12 Review SVF Preview Website.md`. Every point of the review
is a GitHub issue (#18 to #52, and #55 and #56 for the Über-uns input of the same day), labelled by category (**Text/Didaktik**, **Design**,
**Funktion/Technik**) and by page. The earlier review (`../2026-09-23/spec-impact.md`)
left the per-page points in the review text and never tracked them; this table is
what fixes that. Decisions are in `specs/decisions/DEC-0154--…`.

**Status:** *spec changed* = the specification now says it. *owed* = the specification
names it and the work package follows. *decision* = the owner has to decide first.

## Startseite

| Review point | Issue | Category | Where the spec carries it | Status |
| --- | --- | --- | --- | --- |
| The place's own photo, not always the same | #18 | Funktion · Design | SRC-0014 §Photo surface ("A place shows its own photograph"), `Q-0089`, TS-WEB-0020 owed list | spec changed · decision |
| Date section still dark green | #19 | Design | SRC-0014 §Neutrals, Open decisions 6, `Q-0090` | decision |
| Stage too full: hint, location link, explanation | #20 | Design · Text | TS-WEB-0020 owed list, TS-WEB-0019 | owed |
| Headline "Was ist los in deinem Dorf?" | #21 | Text | content `home/de.md`, `en.md` | owed |
| Date selection: diverse, culture, rare before regular | #22 | Funktion | TS-WEB-0008 owed list | owed |
| Keep the search for another place in the stage | #23 | Design | TS-WEB-0020 owed list | owed |
| Remove the counter "8.543 Termine" | #24 | Funktion · Design | TS-WEB-0019 D3 block 2d, A14 (superseded), CG-034 | spec changed |
| "Fehlt deine Veranstaltung?" more prominent | #25 | Design | TS-WEB-0019 | owed |
| WhatsApp module: real graphics | #26 | Design | SRC-0014 §Explain module | owed |
| WhatsApp module on the phone: swipe and arrows | #27 | Funktion · Design | contract `explain-module` | owed |
| CTAs white on white (`/` and `/mitmachen`) | #28 | Design | SRC-0014 §Button, contract §2, Open decisions 7, `Q-0091` | spec changed · decision |
| "Jetzt kostenlos anmelden" should point at the other ways | #29 | Text · Funktion | TS-WEB-0019 / TS-WEB-0022 (CTA target) | owed |
| Remove "Aus dem Flyer geworden" | #30 | Text | content `home/*.md`, TS-WEB-0019 | owed |
| "Ohne eigenes System" wording | #31 | Text | content `home/*.md` | owed |
| Town-hall photo with a web-calendar overlay | #32 | Design | SRC-0014 §Photo surface | owed |
| "Kalender bestellen" needs a supporting line | #33 | Text | CG-026 (supporting line) | spec changed |
| "Über uns" text: humanizer, "mitgegründet", dashes | #34 | Text | CG-040 avoid list (to add with the fix) | owed |
| "Über uns" photo not full width on the phone | #35 | Design | SRC-0014 §Section grounds, TS-WEB-0027 owed list | owed |
| "Was andere sagen": one statement, deep link | #36 | Text · Funktion | TS-WEB-0027 owed list, TS-WEB-0019 | owed |
| "Beleg aus der Region" printed as text | #37 | Funktion · Text | CG-035 (extended) | spec changed |
| Proof lines as sentences | #38 | Text | CG-027 (70 limit withdrawn), `Q-0086` | spec changed · decision |
| Context band, new design | #39 | Design | SRC-0014 §Page chrome revised, contract `context-band`, `Q-0087` | spec changed · decision |
| "Schau nach, was bei dir los ist." | #40 | Text | content | owed |
| Contact section, tidied | #41 | Design | SRC-0014 §Page chrome revised, contract `contact-section`, `Q-0088` | spec changed · decision |
| Footer, new design | #42 | Design | SRC-0014 §Page chrome revised, contract `site-footer` | spec changed |

## Termine veröffentlichen

| Review point | Issue | Category | Where the spec carries it | Status |
| --- | --- | --- | --- | --- |
| New hero photograph | #43 | Design | `Q-0092`, `content/legal/image-credits.md` | decision |
| Solution before problem | #44 | Text | CG-042 (new), TS-WEB-0022 D2 (amended) | spec changed |
| „Wer euren Termin …“ more natural | #45 | Text | CG-009, content `mitmachen/*.md` | owed |
| "Die üblichen Wege" before „Wer euren Termin …“ | #46 | Text | TS-WEB-0022 D2 (amended) | spec changed |
| Explain module texts truncated with "…" | #47 | Funktion · Design | SRC-0014 §Explain module and §Fixed heights, CG-025, TS-WEB-0022 A18 (superseded) | spec changed |
| "In Erprobung (Alpha)" | #48 | Text | content | owed |
| "Bitte nachfragen …" unreadable | #49 | Text | hub `offerings`, content | owed |
| Hand-off to "Kalender für eure Website" | #50 | Text | content | owed |

## Dein Kalender

| Review point | Issue | Category | Where the spec carries it | Status |
| --- | --- | --- | --- | --- |
| "Warum es heute hakt" unchanged | #51 | Text | CG-005 and CG-018 (model pair withdrawn), CG-042, TS-WEB-0024 D4 | spec changed |
| Test dates shown | #52 | Funktion | TS-WEB-0008 owed list, `community-site/src/filter/filterTestEvents.ts` | owed |

## Über uns (added the same day)

The owner sent further input: the two `/dein-kalender` points again (they are
#51 and #52, unchanged) and the redesign of `/ueber-uns` with a question about press
material.

| Review point | Issue | Category | Where the spec carries it | Status |
| --- | --- | --- | --- | --- |
| Über uns rebuilt on the new design (chapters, expandable stories, person, award block) | #55 | Design | TS-WEB-0027 owed list (chapter structure), `Q-0087`, SRC-0014 Open decisions | owed · decision |
| All press material on the website: where and how | #56 | Design · Funktion | TS-WEB-0028 D1 and D3 (amendment proposed), `Q-0093` | decision |

## Why #51 did not change

The owner asked why the `/dein-kalender` section did not change after the review of
2026-09-22. What the files show:

1. The earlier review's remarks on the section were didactic ("zu früh", "Was hakt
   denn heute?", the USP is other actors taking part) and about the design of the
   comparison. Only the comparison and its column labels were acted on (DEC-0106 §2).
2. `decisions.md`, `decisions-audit.md` and the earlier `spec-impact.md` do not list
   the didactic point. `spec-impact.md` says per-page items "stay in the review".
   An item that stays in prose is not a task, so nobody owned it.
3. CG-005 and CG-018 then wrote the kicker *"Warum es heute hakt"* over the title
   *"Wer euren Termin heute nicht mitbekommt"* into the guide as the pair "the review
   accepts exactly". The title belongs to the `/mitmachen` design, not to a
   comparison. The guide's own example kept the defect in place.

## What a reader needs to know

- Nothing in this review was implemented in code yet, except what is marked
  *spec changed*, and that only in the specification.
- The new designs are images, not code. Where they differ from the design
  system (pill cards, black ground), that is an open question with a number, not a
  silent change.
