---
id: DEC-0175
title: The /ueber-uns stories become an accordion, chapter 02 tells the mayoralty once with its period, a missing proof renders nothing anywhere, and an emptied year leaves the press page
status: accepted
date: 2026-10-27
decided_by: jan-henrik.hempel
---

## Context

The owner's review of 2026-10-27 (`plan/reviews/2026-10-27/2026-10-27 Review
Über uns, Presse und Registrieren.md`) found six defects on `/ueber-uns` and its
press page. Each carries an issue:

- **#102** — chapter 03's stories (`story-disclosure`) stood in a two- or
  three-column grid, and the open one spanned the whole row. A click reflowed
  every card behind it: "hüpft und springt … Das geht gar nicht. Mache eher ein
  Akkordeon (expand/collapse) draus."
- **#103** — the place line "Schmatzin · Bürgermeisteramt" over chapter 02 read
  "zu banal, zu abgehackt": if the facts stay, then written out, and better
  laid out.
- **#104** — under chapter 02's text stood a second line, "Der Gründer war selbst
  ehrenamtlicher Bürgermeister — das Amt, dem der Dienst hilft, kennt er von
  innen.", sourced "Nordkurier, 2019 und 2022". The text right above had already
  said he was mayor; the line gave no period (the owner: 2019 to 2024); and the
  source named two years of a newspaper instead of an article.
- **#105** — chapter 03 showed a hatched card "Beleg fehlt — Hier steht die
  Stimme einer Veröffentlichenden oder eines Bürgermeisters, sobald eine
  Freigabe dafür vorliegt.": "so etwas darf doch nicht auf der Webseite landen!"
  It was not a slip: TS-WEB-0027 D5 required it ("the gap is rendered, not
  hidden"), and four more pages rendered a flat panel where no proof cleared
  (`/`, `/mitmachen`, `/dein-kalender`, `/deine-region`).
- **#106** — principle 03 read "Deshalb ist der Dorfkalender kostenlos, und das
  bleibt so. Deshalb kostet die Lizenz …": two sentences opening on "Deshalb".
- **#107** — on `/ueber-uns/archiv` a filter hid the rows of a year and left its
  `h2` standing: "2024", then "2021 · 2020 · 2019 · 2018" with nothing under them.

## Decision

1. **Chapter 03 is an accordion** (#102). One column at every width; each story
   keeps its column and its place, and opening one only grows that item
   downward. The `<details>` share **no** `name`, so **several stories may be
   open at once**: an exclusive group closes the open story when another
   opens, and when the open one stands above the clicked one, the clicked one
   jumps up under the pointer by the height of the story that closed — the same
   jump in another direction. The first story stays open in the server HTML;
   nothing changes after hydration, nothing needs JavaScript, and nothing
   transitions, so reduced motion has nothing to reduce. The open story keeps
   the `violet-500` ground; its title no longer steps up a size, so the colour
   is the only change the item shows. SRC-0014 §Story disclosure, the contract
   row and `TS-WEB-0027-A17` say so.
2. **Chapter 02 tells the mayoralty once, with its period, and the second
   proof line goes** (#103, #104). The fact matters — it is where the name comes
   from — so it is **folded into the chapter's text**, not dropped. The place
   line becomes **"Gemeinde Schmatzin"**, so the three chapters widen from the
   village (Schlatkow) to the municipality to the county
   (Vorpommern-Greifswald). The text, at lead size:

   > Von 2019 bis 2024 war Jan-Henrik Hempel ehrenamtlicher Bürgermeister von
   > Schmatzin, zu dem auch Schlatkow gehört. An diese Zeit erinnert der Name
   > Schafe vorm Fenster: Vom Küchenfenster aus sah man auf die Schafweide der
   > Gemeinde.

   Sources: `founder-former-volunteer-mayor` for the office, its start in 2019
   and Schlatkow as part of the municipality; the brand profile's origin story
   ("The name honours the founder's time as volunteer mayor of Schmatzin: the
   municipal sheep pasture was visible from the kitchen window") — hence
   "erinnert an", not the old "stammt aus". The end of the term, 2024, is the
   owner's statement in the review; the hub record says "Offen bleibt: das
   Amtsende", so `DEM-0074` asks it to follow. The inline proof element with its
   "Nordkurier, 2019 und 2022" line is removed; TS-WEB-0027 D3's "one inline
   proof" in chapter 02 is withdrawn.
3. **A missing proof renders nothing — on every page** (#105). The relevance
   engine still returns an unfilled position as an `empty` entry, so the gap
   stays countable (`filled`); a page renders nothing for it: no hatch, no
   panel, no badge, no sentence about the gap, and nothing backfills it. The
   claim stands in its weakened form (FUN-WEB-0151, "stays empty"), which a
   placeholder is not. Removed: the `empty-proof-slot` component, the
   `ueber-uns-3a-empty-slot-demo` slot ("Beleg fehlt" and its sentence), the
   `oneEmptySlot` helper, the silent panels on `/`, `/mitmachen`,
   `/dein-kalender` and `/deine-region`, and the empty panel beside
   `/mitmachen`'s objection block. The rule stands in TS-WEB-0007 D11 (the
   content lifecycle), TS-WEB-0005 D5 (the engine), TS-WEB-0027 D5,
   TS-WEB-0022 D3, SRC-0014 §Do Not and the design-system contract, and
   `e2e/no-placeholder.spec.ts` (**TS-WEB-0007-A19**) walks every route in both
   languages for the marker, the stand-in's words and a proof-placeholder class.
   SRC-0003 line 236 still asks for "one visible empty slot where no cleared
   proof exists"; the specification stands (DEC-0104 §1), FUN-WEB-0017 carries
   the `Deviation:` line and `DEM-0075` asks the source to follow.
4. **Principle 03 says "Deshalb" once** (#106): "Deshalb ist der Dorfkalender
   kostenlos, und das bleibt so. Die Lizenz für den eigenen Kalender kostet
   {price:portalize-calendar} im Jahr statt eines Projektbudgets." Same two
   statements; the figure is still the offering token, never typed
   (TS-WEB-0006-A12, TS-WEB-0027-A4). English the same way.
5. **An emptied year leaves the press page with its heading** (#107). The
   filter hides a year block (`data-archive-year`) whose rows are all hidden,
   heading included, with the same `hidden` mechanism as the rows — out of the
   layout and the accessibility tree together, so the outline has no `h2`
   without an entry. The only movement is the filter's own row removal. D4's
   defensive empty result is now rendered as one line ("Zu dieser Auswahl gibt
   es keinen Eintrag. „Alle" zeigt wieder alles."), still unreachable while
   every chip has a row. TS-WEB-0028 D7 and the new **TS-WEB-0028-A19** say so.
6. **Two copy rules** (SRC-0017):
   - **CG-046 — A claim appears once per page.** A fact the page has said is
     not said again as a proof line, a pull quote or a teaser on the same page.
   - **CG-047 — A source names outlet, date and a working link, or it is
     omitted.** "Zeitung, Jahr und Jahr" is not a source; a fact without a
     linkable article stands in the text without a source line, backed by the
     hub record in the content artefact's `derived_from`.
   Both are `review` rows in the copy contract: no lint can tell one fact
   from its paraphrase, and CG-047's link half is already held for quotes by
   CG-028.

## Consequences

- `TS-WEB-0027` D2, D3 and D5 are amended; A3, A5, A6, A7, A11 and A17 are
  rewritten. `TS-WEB-0028` D4 and D7 are amended, A19 is new. `TS-WEB-0007` D11
  is amended, A19 is new. `TS-WEB-0005` D5 and `TS-WEB-0022` D3 and A6 are
  amended. SRC-0014 §Story disclosure and §Do Not, the contract's
  `story-disclosure` row and composition rules, SRC-0017 (CG-046, CG-047, Do
  Not) and the copy contract carry the rules.
- `state/open.md` row 260 (the stand-in's words) is closed: there are no words
  left to write.
- The five unverified testimonials still keep the reserved seventh position
  empty; the stream is shorter instead of showing the gap. Clearing one fills
  the position with no change to the page.
- Not done here: the layout spacing on `/ueber-uns` and the archive (#108), the
  photo-credit tooltip on the quote band (#101) and the "öffnet neuen Tab" text
  (#100) are other changes.
- **Open for the owner** — the hub's media echo has a Nordkurier article on
  Schafe vorm Fenster from June 2018 (`2018-06-nordkurier-schafe-vorm-fenster`),
  before the mayoralty began in 2019. "Der Name stammt aus der Amtszeit" could
  therefore not be true as written; the text now says the name *recalls* that
  time, the brand profile's "honours". If the name came earlier, chapter 02
  should say what it actually recalls.

## Amendment 2026-10-27: rule numbers

The two copy rules were merged as CG-044 and CG-045, numbers DEC-0170 and
DEC-0174 had taken minutes earlier for other rules. They are renumbered
**CG-046** (a claim appears once per page) and **CG-047** (a source names
outlet, date and a working link, or it is omitted); their wording is unchanged.
