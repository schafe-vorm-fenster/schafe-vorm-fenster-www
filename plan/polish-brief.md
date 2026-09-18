# Polish Brief — story and design, as a first-time user sees it

Not an audit. A first-time visitor walked all twelve German routes on a
phone (390 × 844) and on a desktop (1280 × 800), screen by screen, and
this is what she would say. Where a fix needs a sentence, the sentence is
written out — German first, English equivalent for `en.md` after it. A
developer should be able to work this file top to bottom without asking
anything.

**Preview reviewed:** `schafe-vorm-fenster-da2unsz7s`, 2026-09-18.
**Screenshots:** `scratchpad/polish/before/<route>--phone.png` and
`--desktop.png`, full page. Phone pages sliced into 844 px tiles under
`scratchpad/polish/tiles/<route>-tNN.png`; tile numbers in this file
refer to those.

Out of scope here: the `Beispiel` / `Demo-Daten` / `Platzhalter` /
`Foto gesucht` / `nicht freigegeben` marks. A parallel change removes
them. This brief only names the **holes their removal leaves** — an empty
lilac box, three identical hatched rectangles, a portrait slot with
nothing in it.

---

## 0. The five things that break the impression

Measured on the preview, phone width, not asserted:

1. **The closing CTA is invisible on four pages.** `#closing-cta`'s
   button computes `color: rgb(23,29,13)` on `background: rgb(23,29,13)`
   — ink on ink. `/mitmachen` ("Kostenlos anmelden"), `/dein-kalender`
   ("Kalender bestellen"), `/dein-ort/starten` ("99999 eintragen") and
   `/deine-region` all end on a black pill with no readable label
   (`mitmachen-t06`, `dein-kalender-t05`, `dein-ort-starten-t02`,
   `deine-region-t05`). Root cause: `route-link.module.css` `.bare {
   color: inherit }` loads after `button.module.css` `.primaryLight {
   color: paper }`; equal specificity, later sheet wins, so the label
   inherits the surrounding light section's ink. On a dark hero the
   inherited colour happens to be paper, which is why it only shows at
   the foot of a page.
2. **The hero photo is 156 px tall on every phone page, and the site
   header covers half of it.** `photo-surface` reserves
   `--photo-headroom: 5 / 2` = 156 px at 390 px wide, and the
   transparent header occupies its top ~76 px. Net uncovered picture:
   about 30 px, 3 % of the screen. Because the reserve is a fixed band
   and the copy below grows, the hero box grows but the picture does
   not: `/ueber-uns` 156 of 1256 px (12 % picture), `/deine-region` 156
   of 693 (22 %), `/mitmachen` 156 of 610 (26 %). On desktop the same
   heroes look good (`home-desktop-t00`, `dk-desktop-t00`) — this is a
   phone-only failure.
3. **Illustrative event lists eat the page.** An `event-row` measures
   102 px on the phone, not the 76 px the design system specifies. The
   home page renders eleven of them across three modules before the
   first story begins; `/dein-ort` renders ten. Two demo lists sit back
   to back on the home page — "Das ist los in …" (5 rows) immediately
   followed by "Diese Woche in der Nähe" (5 rows), `home-t00`/`t01` —
   1.6 phone screens of near-identical rows with the same three demo
   titles in both.
4. **Section after section with no transition.** Sections change ground
   colour but nothing tells the reader why she is now reading this.
   `/dein-ort` puts four value stories in one 1320 px `paper` section
   with no kicker, no image and no ground change between them
   (`dein-ort-t01`–`t02`); `/mitmachen` puts three publishing paths in
   one 1995 px `surface-2` section (2.4 phone screens) where each path
   is a 21 px sub-head with no number and no separation from the step
   list above it (`mitmachen-t02`–`t03`). The eye is never led; it is
   only scrolled.
5. **Two headlines are broken text.** `/dein-ort`'s `h1` is clamped and
   renders "Such deinen Ort, dann steht hier, was dort lo…" —
   `scrollHeight` 98 px against `clientHeight` 61 px, so a third of the
   sentence is gone (`dein-ort-t00`). `/dein-kalender`'s contrast
   heading reads "Heute gegen mit dem Produkt", which is not German
   (`dein-kalender-t00`).

Everything else in this file is downstream of those five.

---

## Part A — Global rules

These are page-independent. Apply them once, in components, before
touching any page.

### G-1 The hero must show a photograph on a phone

**Rule.** At 390 px the photograph must be visible, unobstructed, for at
least **200 px** below the header — a quarter of the screen — and the
scrim must never cover more than **60 %** of the hero box at any width.

**How.**

- `photo-surface.module.css`: change the hero reserve from a fixed
  `aspect-ratio` to a header-aware minimum:
  `--photo-headroom` stays, but add
  `min-height: calc(var(--site-header-height) + 200px)` on
  `.surface[data-hero="true"]::before`. At 390 px that is ~276 px of
  picture, of which 200 px is clear of the header.
- Cap the hero box so the reserve cannot be outgrown: on
  `.surface[data-hero="true"]`, `max-height: 88svh` at phone widths with
  the content stack allowed to scroll past it, **or** — simpler and
  preferred — move the lead paragraph out of the hero on the four pages
  whose copy is long (`/mitmachen`, `/deine-region`, `/ueber-uns`,
  `/dein-kalender`) and into the first section below it. See the
  per-page lists; each says which sentence moves.
- The content-anchored scrim (`.content::before`) keeps its 0.82 floor.
  The section gradient's transparent stop moves from 26 % to **34 %** so
  the extra picture is actually legible and not merely present.

**Acceptance.** For every route, `hero.querySelector('.content')`'s top
offset inside the hero is ≥ 276 px at 390 px width, and
`heroContentTop / heroHeight` ≥ 0.40 on `/mitmachen`,
`/deine-region`, `/dein-kalender`, `/ueber-uns`.

### G-2 Illustrative modules are capped at three rows

**Rule.** An event list that *illustrates* is three rows. An event list
that *is the answer to the visitor's question* may be five. Nothing on
this website shows more than five, ever, and no page shows two lists of
the same kind.

- Position 1 ("Das ist los in {place}") — the page's live answer: **3
  rows**, then the primary CTA. Not five.
- Position 2 ("Diese Woche in der Nähe") — **5 rows**, and only where
  radius widening is the argument (`/dein-ort`, home state S3).
- Every list that sits inside a story ("Beispiel" modules on
  `/dein-ort`, `/mitmachen`, `/dein-ort/starten`) — **1 row**. One real
  date makes the point; three make a list.
- Below every capped list, a quiet affordance, never a second CTA:
  German **„Mehr Termine im Kalender von {ort}"** / English **"More
  dates in the {place} calendar"**, `quiet` button variant, 44 px, with
  `arrow-right`. Where no place is known: **„Mehr Termine ansehen"** /
  **"See more dates"**.

**Also fix the row itself.** `event-row` renders 102 px on the phone
against a specified 76 px, and the title clamps mid-word ("Feuerwehr:
Tag der…", "Dorffest am Gemeindehaus…") because the category badge
shares the title's line box. On the phone: move the badge to the meta
line, right-aligned next to the time, and give the title the full column
width. Two lines of title at 21 px then fit the specified 76 px and stop
truncating — desktop already renders the full titles (`home-desktop-t00`),
so the copy is not the problem, the column width is.

### G-3 Every section boundary carries a hand-off

**Rule.** No section may begin with only a heading on a new colour. Each
section after the hero opens with a **kicker** (mono 12 px, uppercase,
the design system's badge shape) naming its role, and where the argument
moves, a one-line **transition** sentence that ties it to the section
before.

The kicker vocabulary for the whole site — use these, do not invent per
page:

| Role | Kicker (de) | Kicker (en) |
| --- | --- | --- |
| The live answer | `WAS GERADE ANSTEHT` | `WHAT'S ON NOW` |
| Widening radius | `EINEN ORT WEITER` | `ONE PLACE OVER` |
| Why it matters | `WARUM DAS ZÄHLT` | `WHY IT MATTERS` |
| How it works | `SO FUNKTIONIERT ES` | `HOW IT WORKS` |
| Objection | `WARUM ES HEUTE HAKT` | `WHY IT SNAGS TODAY` |
| Evidence | `WER DAS SCHON MACHT` | `WHO ALREADY DOES THIS` |
| Price / scope | `WAS ES KOSTET` | `WHAT IT COSTS` |
| Trust | `WIE WIR ARBEITEN` | `HOW WE WORK` |
| Origin | `WO DAS HERKOMMT` | `WHERE THIS COMES FROM` |
| Other concerns | `ANDERES ANLIEGEN?` | `SOMETHING ELSE TODAY?` |

Implement as an optional `kicker?: string` prop on `section-shell`,
rendered as the first child inside `.container`, mono 12 px,
`--color-neutral-muted` on light grounds and `--color-lime-300` on ink
and violet, 8 px below it the heading. No badge fill — a hairline-free
label, so it never reads as a second badge next to `Demo-Daten`.

The transition sentences themselves are per page; they are written out in
Part B.

### G-4 Vertical rhythm and section height budget on a phone

**Rule.** No section may exceed **1.5 phone screens (1270 px at 390 px
width)**. A section that wants to be longer is two sections with
different grounds and its own kicker each.

Today's violators, measured: `/mitmachen` paths 1995 px, `/ueber-uns`
proof stream 1643 px and team 1380 px, `/dein-ort` value stories 1320 px,
`/dein-kalender` tiers 1250 px and proof 1176 px, home proof stream
1233 px.

**Rule.** The whole-page budget on a phone is **6 screens** for an entry
page and **3 screens** for a flow page. Today: home 7.65, `/mitmachen`
7.54, `/ueber-uns` 7.51, `/dein-kalender` 7.39, `/deine-region` 7.07,
`/dein-ort` 6.34. Every one of them loses a screen in Part B.

**Rule.** The ground sequence per page is fixed at composition time and
must alternate. The design system already forbids two adjacent photo
sections; `/dein-kalender` breaks it with three 143 px photo surfaces in
a row (the "Foto gesucht" hatches, `dein-kalender-t03`–`t04`). It also
forbids more than two consecutive sections of one colour family;
`/deine-region` ends on `lime-100` twice (821 px + 797 px).

### G-5 One primary CTA per screenful, and the same one all the way down

**Rule.** At any scroll position, at most one element carries
`data-cta="primary"` styling. The page's primary conversion appears
exactly twice: in the hero, and as the closing CTA — same goal, same
label, same variant. Secondary CTAs are `quiet` (text + arrow, lime-800)
and never sit directly above or beside the primary.

Today this is inverted in three places:

- `/deine-region` hero: the primary "Angebot anfragen" renders as bare
  text with no arrow, directly above a full-width white secondary pill
  three lines tall ("Termin für ein Kennenlerngespräch buchen (öffnet
  neuen Tab) · Daten gehen an Google") — the secondary visually wins
  (`deine-region-t00`).
- `/mitmachen` hero: "Kostenlos anmelden" is a bare text link, not a
  button (`mitmachen-t00`).
- `/dein-ort/starten` hero: "99999 eintragen" is a bare text link
  (`dein-ort-starten-t00`).

**Rule for the outbound disclosure.** "(öffnet neuen Tab) · Daten gehen
an Google" must leave the button label. It becomes a `meta` line
directly under the button: German **„Öffnet Google Kalender in einem
neuen Tab."** / English **"Opens Google Calendar in a new tab."** The
data note belongs in the privacy section it already links to, not in a
CTA.

### G-6 The closing CTA must be legible

Fix the cascade (finding 1 above). Either raise specificity in
`button.module.css` (`.button.primaryLight { color: … }`) or drop
`color: inherit` from `route-link`'s `.bare` and set it only where a
bare link genuinely inherits (nav, breadcrumb). Add an e2e assertion:
for every route, the computed `color` and `background-color` of
`#closing-cta a` differ by at least 4.5:1.

While in there: every page's closing block is currently just the button
(or, on `/dein-ort` and home, a naked search field with the permanence
sentence jammed under the helper text with no gap, `dein-ort-t04`). Give
`closing-cta` in `repeat` mode a **heading** and keep the reassurance —
headings per page in Part B — and set `gap: var(--space-4)` between
helper text and reassurance.

### G-7 Proof cards must stop looking like each other

Six to eight cards of "source label · BELEG badge · bold statement ·
place" in a row read as one grey block, not as breadth
(`ueber-uns-t01`–`t03`, `home-t04`–`t05`, `mitmachen-t05`). Three
changes:

- The badge reading `BELEG` next to a label already reading `Beleg`
  (`ueber-uns-t02`) is a duplication — drop the badge where the card has
  a named source, keep the source name.
- Raw internal IDs must never render. `/ueber-uns` shows
  "Beleg: founder-former-volunteer-mayor (cleared)" on the public page
  (`ueber-uns-t01`). Render the human source line only.
- Alternate the card shape: the **first** card of a stream is a wide
  feature card with its image (`ratio-proof`, 5:2) and a 21 px title;
  the rest are compact rows with a hairline between them, no card fill,
  no badge. One emphasis per stream, not seven.

### G-8 No headline is ever clamped

A place name may clamp to two lines (design system). A sentence headline
may not. Restrict the two-line clamp to the element that carries a place
name and remove it from `h1`. `/dein-ort` is the live failure.

### G-9 Where a placeholder is removed, something must take its place

The parallel change removes the visible marks. These slots then have
nothing in them at all — each needs a decision now:

| Slot | Today | After removal | Decision |
| --- | --- | --- | --- |
| `/dein-kalender` §3, `/deine-region` §4 embed demo | empty lilac rectangle, `Demo-Daten` badge (`dein-kalender-t01`, `deine-region-t02`) | an empty lilac rectangle | **Must not ship empty.** Render a static screenshot of a real embedded calendar at `ratio-map` (16:9) with the caption „So sieht der eingebundene Kalender aus." / "This is what the embedded calendar looks like." If no screenshot exists, drop the whole section — a blank box is worse than no section. |
| `/dein-kalender` §5 proof images ×3 | three identical hatched "Foto gesucht" surfaces in a row (`dein-kalender-t03`–`t04`) | three empty 143 px bands | Drop the image slot from these cards entirely and render them as G-7 compact rows. Three adjacent photo surfaces also break the design system's own adjacency rule. |
| `/ueber-uns` Christian Sauer portrait | hatch reading "Uns fehlt hier ein Bild aus deinem Ort." (`ueber-uns-t05`) — wrong copy for a portrait | empty hatch | Render the two team entries as text-only rows until a portrait exists. A portrait slot is not a photo-contribution occasion. |
| `/ueber-uns` reserved testimonial slot | hatch, "Für Erfahrungsberichte von Veranstalter:innen liegt noch kein freigegebenes Zitat vor." (`ueber-uns-t03`) | empty hatch | Keep this one, without the hatch: one line of muted meta text. It is the one honest gap the IA asks for. |
| `/mitmachen` objection block | hatch, "Für diesen Kanal liegt uns noch kein Nachweis vor." (`mitmachen-t01`) | empty hatch | Remove. The objection list needs no proof card; the objections are the audience's own words. |

---

## Part B — Page by page

Each page: the arc in beats, what a first-time reader hits, and an
ordered fix list. Copy is given verbatim. Register is `du` / `ihr`
throughout, per principle 1b.

---

### 1. Home `/` — 7.65 phone screens → target 5.5

**Intended arc**

1. *Ah ja* — "Was ist bei dir los?" I type my postcode and dates appear.
   The job is fulfilled here, not linked to.
2. *ach cool, das auch* — a flyer photo by WhatsApp becomes one of those
   dates.
3. *ach cool, das auch* — a municipality can run this under its own name.
4. *wer macht das?* — a former volunteer mayor, from a village of 400.
5. *will ich ausprobieren* — back to the search field, with the promise
   that it stays free.

**What is wrong**

- **Two event lists back to back.** `home-t00`/`t01`: "Das ist los in
  Beispielgemeinde Musterdorf" (5 rows) then immediately "Diese Woche in
  der Nähe" (5 rows), with the same three demo titles repeating in both.
  1.6 screens of rows before a single argument is made. The IA asks for
  *three* live dates in the first screen and "this week nearby" as a
  second module — not two five-row lists.
- Beat 2's example module ("Aus dem Flyer geworden") is another single
  event row on lime-500 — a fourth list in three screens (`home-t02`).
- No transition between the three scenes. Scene 1 ends on an event row,
  scene 2 begins with an aha-question on a new ground, scene 3 likewise.
  Three questions in a row read as an FAQ, not a story (`home-t02`–`t03`).
- The provenance stamp block on violet (`home-t04`) mixes three unrelated
  things: the origin sentence, the live counter, and "Mehr über uns" —
  and the counter's "9.065 TERMINE" badge sits next to a `Demo-Daten`
  badge, which undercuts the one number on the page.
- The proof stream is five identical cards, 1233 px (`home-t04`–`t05`).
- The closing block is a bare search field with no heading and no
  reassurance (`home-t06`). The page ends on an input, not on a promise.

**Fix list, in order**

1. **Cut position 1 to 3 rows** and put the primary CTA directly under
   it (G-2). Add the quiet affordance „Mehr Termine im Kalender von
   {ort}".
2. **Delete the second list in state S2.** "Diese Woche in der Nähe"
   stays only in state S3 (place known, no dates), where widening *is*
   the answer. In S2 the radius argument is already carried by
   `/dein-ort`; home does not need it. Saves ~660 px.
3. **Cut the WhatsApp scene's example row to one row** and label it as
   the outcome, not as a list. Module heading stays „Aus dem Flyer
   geworden".
4. **Add the kickers and transitions.** Before scene 1, on the lime-500
   ground, kicker `SO KOMMEN DIE TERMINE REIN` / `HOW THE DATES GET IN`
   and the transition line:
   *de:* „Die Termine oben tippt niemand bei uns ein. Sie kommen von den
   Leuten im Ort — meistens so:"
   *en:* "Nobody here types those dates in. They come from the people in
   the place — usually like this:"
   Before scene 2, kicker `UND WENN IHR SIE SELBST ZEIGEN WOLLT` / `AND
   IF YOU WANT TO SHOW THEM YOURSELF`, transition:
   *de:* „Dieselben Termine, nur auf eurer eigenen Seite:"
   *en:* "The same dates, on your own site:"
   Before scene 3, kicker `WO DAS HERKOMMT` / `WHERE THIS COMES FROM`,
   transition:
   *de:* „Beides gibt es, weil jemand das Problem selbst hatte."
   *en:* "Both exist because somebody had the problem himself."
   These three lines add no claim; they only name the joint.
5. **Split the violet block.** Keep the counter with its label „Termine,
   die gerade im Kalender stehen" as its own tight band on `ink`,
   directly under position 1 where it supports the live data. Move the
   origin stamp sentence („Gebaut von jemandem, der das Amt kennt, dem
   der Dienst dient. Seit 2018 in Betrieb.") into scene 3, where it
   belongs, with „Mehr über uns →" under it. The violet section
   disappears; the page loses 286 px and gains a reason for every block.
6. **Proof stream to four elements, first one featured** (G-7). Kicker
   `WER DAS SCHON MACHT`. Keep the existing kicker sentence as the
   heading: „Auszeichnungen, Presse und Orte, die den Dorfkalender schon
   nutzen".
7. **Give the closing block a heading and a reassurance.**
   *de:* Heading „Dann schau nach, was bei dir los ist." — reassurance
   „Kostenlos, ohne Anmeldung, dauerhaft."
   *en:* "Then go find out what's on where you live." — "Free, no
   account, permanently."
   Both sentences already exist in `content/pages/dein-ort/de.md` slot 8
   (sourced from `community-calendar`'s `price.note`); reuse, do not
   rewrite.

**Conversion moment.** The search field in beat 1 (stage 0) or "Kalender
von {ort} öffnen" (stage 1+). The closing block repeats it. Nothing else
on the page may be a primary button.

---

### 2. `/dein-ort` (no place) — 6.34 screens → target 5

**Intended arc**

1. *Ah ja* — search, and this place's dates appear.
2. *ach cool, das auch* — the bakery van is in here too, with its route.
3. *ach cool, das auch* — and the council meeting, and culture two
   villages over, and the fifteen-minute radius.
4. *will ich ausprobieren* — put it on the home screen; it costs nothing
   and stays free.

**What is wrong**

- **The `h1` is cut off** (G-8): "Such deinen Ort, dann steht hier, was
  dort lo…" (`dein-ort-t00`).
- **The hero headline is contradicted three lines later.** Hero says
  "Such deinen Ort", the next section says "Das ist los in
  Beispielgemeinde Musterdorf" — the page answers a question the visitor
  has not asked yet. With `?ort=17390` it is worse: the hero reads "Das
  ist los in Musterbach" and the very next section repeats the identical
  sentence (`dein-ort-ort17390-t00`).
- **The four value stories are one undifferentiated 1320 px block**
  (`dein-ort-t01`–`t02`): heading, paragraph, one event row, heading,
  paragraph, one event row… same ground, same type sizes, no image, no
  kicker, no rhythm. The IA specifies aspect → why it matters → live
  example → **testimonial**; the testimonials are not rendered at all,
  although four real quotes sit in `content/pages/dein-ort/de.md`
  (Kurzweg, Zschiesche, Eichler, Wendt).
- **"Diese Woche in der Nähe" is a fifth list** right after four stories
  that each ended in an event row (`dein-ort-t02`–`t03`).
- **The page ends on the wrong conversion.** The focus job's conversion
  is `save-calendar-to-homescreen`; the last block is a search field with
  the permanence line crammed under the helper text with no spacing
  (`dein-ort-t04`).

**Fix list, in order**

1. Remove the `h1` clamp (G-8).
2. **Merge hero and position 1 into one block.** In state S0 the hero is
   the search field and the example module is *one* row, not five. In
   state A the hero headline „Das ist los in {ort}" is followed
   immediately by the three live rows and the homescreen CTA — the
   second identical heading goes away entirely.
3. **Rebuild the four stories as four sections** with alternating
   grounds `paper → lime-100 → paper → surface`, each with its own
   kicker `WARUM DAS ZÄHLT`, each capped at one live row, each closing
   with its testimonial in the compact form of G-7. The four quotes
   already exist in the content file with their attributions; render
   them. Give story 1 (Bäckerwagen) and story 3 (Kultur) a
   `ratio-feature` photo; stories 2 and 4 stay text-led so the rhythm
   alternates.
4. **Add the connective lines** between the stories, so the sequence
   reads as widening and not as a list:
   after story 1 → *de:* „Und es bleibt nicht beim Brot." / *en:* "And
   it doesn't stop at bread."
   after story 2 → *de:* „Nicht alles davon würdest du suchen." /
   *en:* "You wouldn't go looking for all of it."
   after story 3 → *de:* „Und es hört an der Gemeindegrenze nicht auf." /
   *en:* "And it doesn't stop at the municipal boundary."
   Story 4 already carries that thought — the line hands over to it.
5. **Delete "Diese Woche in der Nähe" as a separate module in state A.**
   Story 4 *is* the radius argument; let it carry the five nearby rows
   as its own example, with the kicker `EINEN ORT WEITER`. One list,
   placed where it argues. Saves ~650 px.
6. **Homescreen block:** keep both platforms, but collapse them into one
   two-column row at 390 px is not possible — instead set the iOS steps
   open and Android behind a `details` summary „Android" so the block
   drops from 667 px to about 380 px. The heading stays „So landet der
   Kalender auf deinem Homescreen".
7. **Closing block = the homescreen CTA, not a search field.**
   *de:* Heading „Einmal antippen, und er ist da, wo deine Apps sind." —
   button „Kalender von {ort} auf den Homescreen legen" — reassurance
   „Kostenlos, ohne Anmeldung, dauerhaft: keine Einführungsstufe, die
   später wieder verschwindet."
   *en:* "One tap, and it sits where your apps sit." — "Add the {place}
   calendar to your home screen" — "Free, no account, permanent: not an
   introductory tier that disappears later."
   Move the search field above the context band as a quiet "anderer Ort?"
   affordance: *de:* „Anderer Ort?" / *en:* "Different place?"

**Conversion moment.** Hero CTA and closing CTA, both
`save-calendar-to-homescreen`. In state B (place known, no dates) both
switch to „Ersten Termin veröffentlichen" — that switch already works.

---

### 3. `/dein-ort/starten?ort=…` — 3.91 screens → target 3

**Intended arc**

1. *Ah ja* — my place really isn't in there. Said plainly, no apology.
2. *das ist wenig* — one person, one flyer, one WhatsApp photo, free.
3. *so sieht das aus* — a real neighbouring place, live.
4. *das bin vielleicht ich* — who usually starts it.
5. *will ich ausprobieren* — bring it to my place.

This page is the closest to right already. Three fixes.

**What is wrong**

- The primary CTA "99999 eintragen" is a bare text link in the hero
  (`dein-ort-starten-t00`), and the closing CTA is the invisible black
  pill (`dein-ort-starten-t02`).
- The live example is three rows on ink (`dein-ort-starten-t01`) — one
  is enough here; the point is "a place like yours has content", not
  "here is a list".
- Nothing between beat 4 ("Wer sowas meistens anstößt") and the search
  field — the page trails off into "Falsch getippt? Nochmal suchen"
  before its own CTA, which reads like a retreat.

**Fix list**

1. Hero CTA becomes a `primary-dark` button (lime-500 on the photo
   surface): „{ort} eintragen" with `arrow-right`; fallback „Deinen Ort
   eintragen".
2. Live example to one row (G-2), heading unchanged.
3. **Move "Falsch getippt? Nochmal suchen" below the closing CTA**, as a
   quiet line, not a section: *de:* „Falsch getippt? Nochmal suchen" /
   *en:* "Mistyped? Search again" with the field beneath.
4. **Closing block** gets its heading:
   *de:* „Ein Flyer reicht, um {ort} auf die Karte zu bringen." —
   button „{ort} eintragen" — reassurance „Kostenlos, ohne
   Anmeldegebühr, dauerhaft."
   *en:* "One flyer is enough to put {place} on the map." — "Add
   {place}" — "Free, no signup fee, permanent."
5. Add kickers: beat 2 `WAS ES BRAUCHT`, beat 3 `SO SIEHT DAS AUS`, beat
   4 `WER DAS MEISTENS ANSTÖSST` (all already the section headings —
   shorten the headings accordingly so heading and kicker do not repeat
   each other).

---

### 4. `/mitmachen` — 7.54 screens → target 5.5

**Intended arc**

1. *Ah ja* — photograph the flyer, send it, done.
2. *stimmt, so ist es* — the ways we announce things today don't reach
   everyone.
3. *ach, so viele Wege* — three ways in, pick yours.
4. *das läuft wirklich* — a real place, live.
5. *andere machen das auch* — three named institutions.
6. *will ich ausprobieren* — register, free, stays free.

**What is wrong**

- Best hero on the site, ruined by the CTA being a text link
  (`mitmachen-t00`) and the photo band being 156 px of a 610 px box.
- **The objection block is 1116 px of bad news** — five items in 21 px
  bold with `circle-x` icons, nearly 1.4 screens (`mitmachen-t01`).
  Beat 2 should sting, not grind.
- **The three publishing paths are one 1995 px section** with no
  numbering, no ground change, and headings that collide with the step
  list above them — "03 Termin erscheint…" is followed immediately by
  "Euren eigenen Kalender verbinden" with no gap (`mitmachen-t02`–`t03`).
  Each path carries a full-width `ratio-feature` photo, so three photos
  and nine numbered steps stack up into 2.4 phone screens.
- The cross-reference to `/dein-kalender` sits inside path 3 and reads
  as a fourth step (`mitmachen-t04`).
- Closing CTA invisible (`mitmachen-t06`).

**Fix list, in order**

1. Hero CTA → `primary-dark` button „Kostenlos anmelden"
   / "Sign up for free". Move the hero lead sentence ("Du hast den Flyer
   sowieso schon gedruckt…") out of the hero and into the first section,
   so the hero is headline + button only and the photo can breathe (G-1).
2. **Objection block to three items.** Keep, in this order: Flyer /
   Zeitung und Amtsblatt / eigene Kanäle. Fold items 4 and 5 into one
   closing line of the section, not a bulleted row:
   *de:* „Und wer das ehrenamtlich organisiert, hat neben der
   Organisation keine Zeit mehr fürs Bewerben — und schon gar nicht für
   ein neues Werkzeug."
   *en:* "And whoever organises this as a volunteer has no time left for
   promoting it — let alone for learning a new tool."
   Both halves are the audience record's own `pains`; nothing new is
   claimed. Section drops from 1116 px to ~700 px. Kicker
   `WARUM ES HEUTE HAKT`.
3. **Add the transition into beat 3** — this is the page's missing
   hinge:
   *de:* „Deshalb gibt es drei Wege rein, und alle drei sind Wege, die
   ihr schon geht."
   *en:* "So there are three ways in, and all three are ways you already
   take."
4. **Split the three paths into three sections**, grounds
   `surface-2 → paper → surface-2`, each with a mono number badge
   `01` / `02` / `03` beside its title, and **one photo across all
   three**, not three: keep the WhatsApp photo on path 1, drop the
   images on paths 2 and 3 (a wall calendar and a laptop on a desk say
   nothing the steps do not). Section total drops from 1995 px to about
   1100 px. Add `margin-block-start: var(--space-6)` between a step list
   and the next path title.
5. **Move the `/dein-kalender` cross-reference** out of path 3 into its
   own quiet `aside` between beat 5 and the closing CTA, one sentence,
   `quiet` link, unchanged wording.
6. Live example to three rows (it is position 3 → 1, so three is right),
   kicker `SO SIEHT DAS AUS`.
7. Proof block per G-7: first card featured, other two compact.
8. **Closing block:**
   *de:* Heading „Der nächste Flyer kann der erste Termin sein." —
   button „Kostenlos anmelden" — reassurance „Kostenlos anmelden,
   kostenlos bleiben — das steht seit 2022 öffentlich so da."
   *en:* "The next flyer can be the first date." — "Sign up for free" —
   "Sign up free, stay free — that has been on the public record since
   2022."
   The reassurance is already in the content file and sourced; keep it
   word for word.

**Conversion moment.** Hero button and closing button, both
`register-as-publisher` → `/mitmachen/registrieren`.

---

### 5. `/mitmachen/registrieren` — 2.05 screens

**Intended arc:** one question per step, three steps, then the app.

**What is wrong**

- **Step 1 has no way forward** (`mitmachen-registrieren-t00`). The
  screen is: breadcrumb, `SCHRITT 1 VON 3` badge, question, search field,
  helper text — then the context band and the footer. A visitor who does
  not press Enter in the field is stuck.
- The step badge is the only progress indication; there is no sense of
  how short this is.
- The context band on step 1 sits between the question and the footer
  and is the largest thing on the screen after the question — it invites
  the visitor to leave at the exact moment she was about to start.

**Fix list**

1. Add the primary button under the field on every step: „Weiter" /
   "Next", `primary-light`, with `arrow-right`. Disabled until the step
   is answered.
2. Replace the badge with a three-dot progress row (mono `1 · 2 · 3`,
   current one filled) plus the badge text as its accessible label. It
   costs 26 px and answers "how long is this".
3. Add one reassurance line under the question on step 1:
   *de:* „Drei Fragen, dann bist du drin. Keine E-Mail-Adresse nötig,
   solange du hier bist."
   *en:* "Three questions and you're in. No email address needed while
   you're here."
   Sourced: the page carries no identity fields by design (TS-023 D6).
4. Move the context band **below** the step card and set it `tight`.

---

### 6. `/dein-kalender` — 7.39 screens → target 5.5

**Intended arc**

1. *Ah ja* — our calendar, our website, our name, and nobody types.
2. *genau unser Problem* — today versus with the product.
3. *so sieht es aus* — the embedded calendar.
4. *was kostet das* — three tiers under one question.
5. *andere Gemeinden machen das* — proof.
6. *und die Daten?* — privacy, operations.
7. *will ich bestellen* — order, or talk first.

**What is wrong**

- **"Heute gegen mit dem Produkt"** — broken German in a 38 px section
  heading, on the sell page (`dein-kalender-t00`).
- **The embed demo is an empty lilac rectangle** (`dein-kalender-t01`).
  The single most persuasive module on the page shows nothing. Same on
  `/deine-region` (`deine-region-t02`).
- The tier 2 CTA is the invisible ink-on-ink pill
  (`dein-kalender-t02`); tier 3's CTA is centred text with no arrow,
  breaking the left-aligned rhythm of every other control on the site.
- **Three identical hatched "Foto gesucht / Uns fehlt hier ein Bild aus
  deinem Ort." blocks in a row** (`dein-kalender-t03`–`t04`) — and the
  copy is wrong anyway: these are portrait slots for named mayors, not
  an invitation for a photo from the reader's village.
- The trust block mixes a green `circle-check` list with a paragraph
  about where the founder lives (`dein-kalender-t05`) — a check-mark is
  a feature affirmation, not a biography.
- The secondary "Beratungstermin buchen (öffnet neuen Tab) · Daten gehen
  an Google" renders as a two-line button in the hero and again as a
  two-line link in tier 2 (G-5).

**Fix list, in order**

1. Fix the heading: *de:* „Heute — und mit dem Produkt" /
   *en:* "Today — and with the product". Keep the four rows.
2. Embed demo per G-9: a real screenshot at 16:9, or delete the section.
   Decide before this page ships; a blank box on the paid page is the
   single most expensive defect here.
3. Tier CTAs: tier 2 primary is Pulse in the hero only (design system —
   one himbeere per screen), so in the tier card it is `primary-light`
   „Kalender bestellen" with a visible label (G-6); tier 3 becomes a
   left-aligned `quiet` link „Für eine ganze Region →" /
   "For a whole region →". Tier 1's two quiet buttons stay.
4. Proof: drop the three image slots, render as G-7 compact rows under
   kicker `WER DAS SCHON MACHT`. Section drops from 1176 + 429 px to
   about 520 px.
5. Trust block: split the heading into two labelled paragraphs without
   check-marks — `DATENSCHUTZ` and `BETRIEB` as mono labels. Keep both
   texts as they stand.
6. Outbound disclosure out of both button labels (G-5).
7. **Add the transitions** — this page is four arguments with no seams:
   before beat 3 → *de:* „So sieht das aus, wenn es bei euch steht:" /
   *en:* "This is what it looks like once it sits on your site:"
   before beat 4 → *de:* „Was das kostet, hängt nur davon ab, wo der
   Kalender stehen soll." / *en:* "What it costs depends only on where
   the calendar is going to sit."
   before beat 6 → *de:* „Bleibt die Frage, wem ihr da eigentlich eure
   Daten gebt." / *en:* "Which leaves the question of who you're
   actually giving your data to."
8. **Closing block:**
   *de:* Heading „Euer Kalender kann nächste Woche laufen." — button
   „Kalender bestellen" — quiet link darunter „Lieber erst sprechen?
   Beratungstermin buchen".
   *en:* "Your calendar can be running next week." — "Order the
   calendar" — "Rather talk first? Book a briefing."
   *Note:* "nächste Woche" is a claim. If no cleared statement backs a
   lead time, use instead: „Zwei Zeilen Code, und euer Kalender läuft." /
   "Two lines of code, and your calendar is running." — that phrasing is
   already carried by the IA page brief.

**Conversion moment.** Hero Pulse button (`buy-calendar-licence`) with
the briefing as an equal-weight quiet link beside it; closing block
repeats both, Pulse becomes `primary-light` there (TS-006 D6).

---

### 7. `/dein-kalender/bestellen` — 2.17 screens

**What is wrong** (`dein-kalender-bestellen-t00`)

- Step 1 shows a "Landkreis Musterkreis" chip, then "Noch keine
  Auswahl." and "0 Orte ausgewählt" directly beneath — three statements
  contradicting each other in 120 px.
- No "Weiter" button. Same dead end as the registration flow.
- No price anywhere in the flow. Someone who arrives from a tier card
  loses the one number that made her click.
- The briefing exit is the only button-like element on the screen, so
  the exit outranks the path.

**Fix list**

1. Add „Weiter" per step (G-5 sizing), disabled until a scope exists.
2. Progress row `1 · 2 · 3 · 4` replacing the bare badge.
3. Put a persistent summary strip above the step, mono:
   *de:* „480 € pro Jahr, netto · {n} Orte ausgewählt" /
   *en:* "€480 per year, excl. VAT · {n} places selected". The price is
   fixed per organisation regardless of scope (DEC-060), which is
   reassuring and must be said: under the strip, one meta line
   *de:* „Der Preis ändert sich mit der Auswahl nicht." /
   *en:* "The price does not change with your selection."
4. Remove the "Landkreis Musterkreis" chip when no scope is chosen —
   empty state is „Noch keine Auswahl." alone.
5. Briefing exit becomes a `quiet` link in the step footer, never a
   button.

---

### 8. `/deine-region` — 7.07 screens → target 5

**Intended arc**

1. *Ah ja* — the whole district in one calendar, without a portal
   project.
2. *genau, das ist das Problem* — forty or eighty places cannot be
   covered editorially, and the administrative boundary is not where
   people live.
3. *es läuft schon* — examples from the district, live.
4. *was kommt dazu* — what the district tier adds over €480.
5. *andere auf dieser Ebene* — proof.
6. *will ich anfragen* — request a quote.

**What is wrong**

- **Primary and secondary CTAs are inverted in the hero**
  (`deine-region-t00`): "Angebot anfragen" is plain text; the briefing
  is a three-line white pill. See G-5.
- The hero is 693 px with 156 px of photo, and the photo is a dark sky —
  nothing is readable in it at phone size.
- "Beispiele aus dem Landkreis deiner Region" (`deine-region-t01`) is
  the fallback string showing through. When no district is known the
  heading must not name one: *de:* „So sieht das heute schon aus:
  Beispiele aus dem Bestand" / *en:* "This is what it already looks
  like: examples from the existing calendars".
- Empty embed demo (G-9).
- **Two `lime-100` sections in a row at the foot** (821 px + 797 px),
  against the design system's own two-family rule.
- **The quote form is rendered inline on this page *and* exists as its
  own route** `/deine-region/angebot`. Two identical forms, and the
  inline one shows "Absenden" plus a second button "Angebot anfragen"
  right under it (`deine-region-t05`) — two buttons for one action.
- Closing CTA invisible.

**Fix list, in order**

1. Hero: „Angebot anfragen" becomes the `primary-dark` button with
   `arrow-right`; the briefing becomes a `quiet` link under it, label
   „Lieber erst sprechen? Kennenlerngespräch buchen", with the
   disclosure moved to a meta line (G-5). Move the hero lead sentence
   („Genau das ist der Punkt…") into beat 2 so the hero is headline +
   CTA (G-1).
2. **Remove the inline form from `/deine-region`.** The page's job is
   the argument; `/deine-region/angebot` is the form. Replace the inline
   form with the closing CTA. Saves ~800 px and removes the double
   button.
3. Fix the fallback heading (above). Cap the example chips at 6 — they
   already are — and keep the counter only when `/api/stats` returns it.
4. Embed demo per G-9.
5. Re-ground the foot: proof on `surface`, closing CTA on `paper`, so no
   two `lime-100` sections touch.
6. **Add the transitions:**
   before beat 3 → *de:* „Und das ist keine Absichtserklärung — es läuft
   schon:" / *en:* "And this isn't a statement of intent — it's already
   running:"
   before beat 4 → *de:* „Was der Landkreis-Tarif darüber hinaus
   mitbringt:" / *en:* "What the district tier brings on top of that:"
7. **Closing block:**
   *de:* Heading „Sollen wir euch ein Angebot rechnen?" — button
   „Angebot anfragen" — quiet link „Lieber erst sprechen?
   Kennenlerngespräch buchen".
   *en:* "Shall we put a quote together for you?" — "Request a quote" —
   "Rather talk first? Book an intro call."
   No response-time promise (the constant is deliberately `null` until
   C11 is answered — do not add one).

---

### 9. `/deine-region/angebot` — 3.30 screens

**What is wrong** (`deine-region-angebot-t00`)

- The hero photo is a kitchen window under a full violet wash — it reads
  as a rendering error, not as art direction, and the headline sits
  below the photo on flat violet, so the photograph carries nothing.
- The form starts immediately with no framing: an organisation asked to
  request a quote gets no sentence about what happens next.

**Fix list**

1. Drop the photo. This is a form page; give it the violet `section`
   ground and the headline alone, `tight` density. Saves ~430 px and
   removes the artefact.
2. Add one line under the headline, before the first field:
   *de:* „Sag uns, um welches Gebiet es geht — den Rest klären wir im
   Gespräch."
   *en:* "Tell us which territory this is about — we'll sort the rest out
   in conversation."
   No time promise.
3. Keep the "Formular lädt gerade nicht?" fallback exactly as specified;
   render it as a quiet line under the submit button.

---

### 10. `/ueber-uns` — 7.51 screens → target 5

**Intended arc**

1. *Ah ja* — built in a village, run from a village, and here is the
   causal chain that makes the pricing make sense.
2. *der meint das ernst* — the bakery van, the sheep pasture, the
   mayoralty.
3. *andere sehen das auch so* — awards, press, a district, a
   Volkshochschule.
4. *wer ist das* — the team.
5. *ich habe ein Anliegen* — all three jobs offered.

**What is wrong**

- **The hero box is 1256 px with 156 px of photo** — 12 % picture, 88 %
  scrim (`ueber-uns-t00`). The worst instance of G-1 on the site.
- **The origin story is missing from the page.** The content file
  carries the bakery-van paragraph, the sheep-pasture naming and the
  founder quote („Wenn man alles sammelt, ist plötzlich in jedem Dorf
  jeden Tag irgendwas los. Wir müssen das nur sichtbar machen.") — the
  page shows only the causal chain and a proof card. Beat 2 is absent,
  and it is the beat that makes a reader trust this.
- **A raw proof ID renders on the public page:** "Beleg:
  founder-former-volunteer-mayor (cleared)" (`ueber-uns-t01`).
- **"Beleg  BELEG"** — label and badge duplicating each other
  (`ueber-uns-t02`).
- **Six identical proof cards, 1643 px** (`ueber-uns-t01`–`t03`). The IA
  asks for images and logos; there are none.
- **The founder portrait in the team block is a candid with a hand in
  front of the face** (`ueber-uns-t04`), and the second team member's
  portrait slot is a hatch reading "Uns fehlt hier ein Bild aus deinem
  Ort." (`ueber-uns-t05`) — copy written for a different slot entirely.
- The newsletter block sits between the team and the context band with
  no framing (`ueber-uns-t05`).

**Fix list, in order**

1. Apply G-1 and move the causal-chain paragraph out of the hero into
   the first section. Hero = `h1` „Gebaut in einem Dorf, betrieben aus
   einem Dorf." plus the photograph. Box drops from 1256 px to ~450 px,
   of which ~280 px is picture.
2. **Restore beat 2.** New `lime-100` section directly under the causal
   chain, kicker `WO DAS HERKOMMT`, heading *de:* „Angefangen hat es mit
   Brötchen." / *en:* "It started with bread rolls." Body: the origin
   paragraph exactly as it stands in `content/pages/ueber-uns/de.md`
   (Berlin → Schlatkow, the bakery van, the sheep pasture). Close it
   with the founder quote, set as a pull quote at sub-head size — it is
   `press_clearance: cleared`, so it may carry weight visually.
3. Strip the internal ID from the proof card (G-7); one human source
   line only.
4. Remove the duplicated `BELEG` badge (G-7).
5. **Proof stream: first card featured with its image, the remaining
   five as compact hairline rows.** Cap the visible stream at five plus
   the reserved testimonial slot, and put the archive link directly
   under it instead of in its own 114 px section. Target 700 px.
6. **Team:** replace the candid portrait with a plain portrait at
   `ratio-portrait` (4:5), or — if no such photo exists — render both
   people as text-only rows (G-9). Do not ship the current crop.
7. **Newsletter:** give it a kicker `AUF DEM LAUFENDEN BLEIBEN` and move
   it below the context band, directly above the footer, so the page's
   last argument is the three-job offer and not an email field.
8. Closing block is `merged` mode (this page has no conversion of its
   own). Give it a heading:
   *de:* „Und womit bist du heute hier?" / *en:* "So what brings you here
   today?"

---

### 11. `/ueber-uns/archiv` — 10.6 screens

The one list-shaped page, and it is the most honest page on the site.
Two small things.

1. The filter chips take 240 px before the first entry
   (`ueber-uns-archiv-t00`). Keep them, but set the row `tight` and drop
   "Alle" to a text reset link — eight pills at 40 px each is a lot of
   furniture in front of a list nobody browses.
2. "31 VON 31 EINTRÄGEN" is good; move it above the chips so the page's
   first line says how big it is.

No story work. This page is deliberately not a destination.

---

### 12. `/rechtliches` — 49.9 phone screens

Legal text; length is fine. Two usability fixes.

1. The section nav at the top is a plain list of six links
   (`rechtliches-t00`). Make it sticky under the header on the phone,
   `tight`, so a visitor 20 screens into the privacy policy can still
   jump. `section-nav` already exists; give it `position: sticky`.
2. `back-to-top` exists as a component — confirm it renders here. On a
   50-screen page it is the single highest-value control.

---

## Part C — Recommended implementation order

Each step leaves the site shippable.

| # | Work | Why here |
| --- | --- | --- |
| 1 | **G-6** closing-CTA colour fix + e2e assertion | One CSS line, fixes the primary conversion on four pages. Nothing else matters until this is done. |
| 2 | **G-8** headline clamp, **G-5** CTA hierarchy, the „Heute gegen mit dem Produkt" heading | Three small fixes that stop the site looking unfinished on first glance. |
| 3 | **G-1** hero photograph | One component, every page benefits, and it is Jan's complaint verbatim. |
| 4 | **G-2** event-row and list caps | One component + composition props; removes ~1.5 screens across four pages. |
| 5 | **G-3 / G-4** `section-shell` kicker prop and the rhythm budget | The mechanism every per-page transition needs. |
| 6 | **Page 1 — `/dein-ort`** | Highest traffic, the clearest story, and the fix list is mostly deletion. |
| 7 | **Page 2 — `/` home** | Depends on the same modules; the two lists collapse into one. |
| 8 | **Page 3 — `/mitmachen`** | The longest page, the biggest single win (paths section 1995 → ~1100 px). |
| 9 | **Page 4 — `/dein-kalender`** | The revenue page. Needs the G-9 embed-demo decision first. |
| 10 | **Page 5 — `/ueber-uns`** | Restoring the origin story is copy work already written in `content/`. |
| 11 | **Page 6 — `/deine-region`** | Removing the duplicate inline form is a clean deletion. |
| 12 | **Pages 7–9 — the three flows** (`registrieren`, `bestellen`, `angebot`) | Small, self-contained, and each currently has a dead end. |
| 13 | **Pages 10–12 — `starten`, `archiv`, `rechtliches`** | Polish. |

**Source discipline.** Every sentence in this brief is either a
connective line that adds no claim, or a phrase already carried by
`content/pages/**` or a hub package. Two sentences are flagged inline as
needing a cleared source before use: the `/dein-kalender` closing
heading's lead-time claim, and any response-time promise on
`/deine-region`. Nothing else introduces a number, a name or a quote
that is not already sourced.
