# UAT — Gate 2

Persona: first-time visitor with a real goal (Bürgermeisterin looking for a
calendar for her Gemeinde; Vereinsvorstand wanting to publish dates; Landkreis
employee asking for a quote). Target: the stable preview
`schafe-vorm-fenster-83x6zbys4-schafe-vorm-fenster.vercel.app`. Walked the five
wired conversion goals in German, the first two repeated in English, per
`plan/gate-2-scope.md` §2. Phone viewport (360×640) for the first two German
walks, desktop (1440×900) for the rest. Screenshots referenced below live in
the run's scratchpad and are not part of this repo.

This is a signal report. It records what a naive visitor saw and where she
hesitated — it does not judge pass/fail.

## Goals walked

| Goal | Route(s) | Outcome |
| --- | --- | --- |
| `save-calendar-to-homescreen` (DE) | `/` → `/dein-ort` | Reached — homescreen link resolves to `app.schafe-vorm-fenster.de/<ort>` |
| `save-calendar-to-homescreen` (404 path) | `/dies-gibt-es-nicht` | Dead end — no place search present |
| `register-as-publisher` (DE) | `/mitmachen` → `/mitmachen/registrieren` (3 steps) | Reached — ends at `app.schafe-vorm-fenster.de/registrieren` |
| `request-product-briefing` | `/dein-kalender`, `/deine-region` | Dead end — both outbound "Beratungstermin buchen" links go to placeholder Google Calendar schedules that report "Termin nicht gefunden" |
| `buy-calendar-licence` | `/dein-kalender` → `/dein-kalender/bestellen` (4 steps) | Reached — embed code shown at step 4 |
| `request-licence-quote` | `/deine-region` → `/deine-region/angebot` | Reached the submit action; no confirmation appeared after submitting |
| `save-calendar-to-homescreen` (EN) | `/en/` → `/en/your-place` | Reached — homescreen link resolves correctly |
| `register-as-publisher` (EN) | `/en/take-part` → `/en/take-part/register` (3 steps) | Reached — ends at `app.schafe-vorm-fenster.de/registrieren` (German path segment on the English flow) |

## Walk notes

### `/` and `/dein-ort` — "what's on in my village" (DE, phone)

- Landed on `/`. The postcode search is right there in the first screen, no
  hunting needed — I typed a real postcode (07743) without hesitation because
  the field was labeled plainly ("Deine Postleitzahl").
- The result named a place I've never heard of, "Beispielwalde", with a row of
  invented-looking event titles ("Chorprobe im Pfarrsaal (Beispiel)"). The
  small "DEMO-DATEN" tag was the only sign this wasn't really my town. As
  someone typing her own real postcode for the first time, I would have
  expected either my own town or a clear "we don't have your area yet" —
  getting a confident, fully-populated answer for a place I don't recognize
  made me unsure whether the search even understood my input.
- I tried this again with a postcode that doesn't exist (99999) and then with
  letters ("abcde") to see what "not covered" looks like. Both times I got the
  same kind of confident, fully-populated demo answer (a different fictitious
  place each time) — never an error, never "we don't know this place yet."
  There was no way, as a visitor, to find out what happens when the site
  genuinely doesn't recognize a place.
- The nav item that would matter to someone looking for a calendar is labeled
  "WAS IST LOS" (what's going on) — it's the entry point but nothing in the
  wording says "search for your town here."
- Clicking "Kalender von Beispielwalde auf den Homescreen legen" pointed to
  `app.schafe-vorm-fenster.de/beispielwalde` — correct handover target, though
  I could not verify what that page shows since the app is a separate system.

### 404 page — "the wrong address" (DE, phone)

- Visited a made-up path expecting either a normal 404 or another chance to
  search for my town. Instead the page's own body text reads: "Diese Adresse
  gibt es nicht. [Platzhalter M2 — Ortssuche und Job-Band folgen mit den
  Komponenten, DEC-032.]" — a raw developer note, ticket ID included, shown as
  the page's actual content. Below it, a labeled placeholder region says
  "Platzhalter: place-search + context-band." There is no search here at all.
  As a visitor who mistyped a link, I have nowhere to go but "Zur Startseite."

### `/mitmachen` → `/mitmachen/registrieren` — "I want to publish our dates" (DE, phone)

- From the homepage, "TERMINE VERÖFFENTLICHEN" in the nav led me straight to
  `/mitmachen` — matched my intent as a Vereinsvorstand.
- "Kostenlos anmelden" is the only clear next step and it worked.
- Step 1 asks "Für welchen Ort willst du veröffentlichen?" — postcode only,
  same as the homepage search.
- Step 2's whole question group is labeled, in the accessibility layer, "Wer
  veröffentlicht die Termine? DEMO-DATEN" — the DEMO-DATEN marker sitting on a
  question I'm answering about my own, real club made me briefly wonder if my
  answer was actually going to be recorded anywhere, or if I was filling out
  a sample form.
- The footer contact form on this same page carries the note "DEMO-DATEN — es
  wird nichts verschickt, solange Q-020 offen ist." — an internal ticket ID
  exposed to visitors, sitting right next to a real "Absenden" button I might
  otherwise have tried.
- Reached "Fast geschafft" / "Weiter in der App" at the end, pointing to
  `app.schafe-vorm-fenster.de/registrieren`.

### `/dein-kalender` and `/deine-region` — "we want a briefing" (desktop)

- On `/dein-kalender`, the heading "Heute gegen mit dem Produkt" reads like a
  dropped word ("today against ... with the product") — I paused trying to
  parse what it meant before moving on.
- "Beratungstermin buchen" is offered twice on this page and once more on
  `/deine-region` — each one labeled "(öffnet neuen Tab) · Daten gehen an
  Google", which built some trust. But every one of the three links I checked
  goes to a placeholder Google Calendar scheduling URL
  (`.../schedules/placeholder-briefing` and `.../appointments/example`); Google
  itself answers "Termin nicht gefunden" ("Möglicherweise wurde der Termin
  gelöscht oder der Link ist falsch"). As the Landkreis employee who wanted to
  book a quick call, this is a dead end — there is no way to actually book a
  briefing from this preview.
- On `/deine-region`, the "Beispiele aus dem Landkreis" section heading reads
  "…aus dem Landkreis geoname.900001" — a raw internal identifier where a
  Landkreis name should be. I would not know what "geoname.900001" refers to.

### `/deine-region/angebot` — "we want a quote" (desktop)

- Reached via "Angebot anfragen" from `/deine-region`.
- The form (Organisation, Name, E-Mail, Telefon, Worum geht es?) is marked
  "DEMO-DATEN" directly above the fields — again, filling in my organization's
  real name under a "demo data" banner gave me pause about whether this would
  go anywhere.
- After filling all four required fields and clicking "Absenden", the form
  visibly cleared but nothing told me the request had been sent — no
  confirmation text, no toast, no summary of what I submitted. As the person
  who just asked for a quote, I would not know whether to wait for a reply or
  try again.

### `/dein-kalender/bestellen` — "we want to buy a calendar" (desktop)

- Step 1 asks for a postcode again; searching surfaced a "+ Beispielwalde"
  link I had to click separately to actually add the place — the search
  result and the "add this place" action are two different clicks, which
  wasn't obvious the first time (I first assumed the search itself added it).
- After adding one place, the counter read "1 Orte ausgewählt" (should be
  singular "1 Ort").
- Step 3 ("Wohin geht die Rechnung?") shows both a "Weiter" link and an
  "Absenden" button on screen together. I clicked "Weiter" first, expecting it
  to move me forward with the invoice details I'd already typed — it did
  nothing, the step number didn't change. Only clicking "Absenden" advanced
  the flow. Having two visible calls to action for what turned out to be one
  action was a genuine stop-and-figure-it-out moment.
- Step 4 shows the embed snippet to paste into a real website. The snippet
  itself reads `data-portalize-organizer-id="demo-organizer-bestellen"` and
  loads from `.../api/demo-organizer-bestellen/load.js`. If I actually pasted
  this into my Gemeinde's website as instructed ("Kopiere den Code jetzt"), it
  would embed a generic demo widget, not something tied to my order — nothing
  on the page signals that this particular code is a placeholder rather than
  my calendar.

### `/en/` and `/en/your-place` — English repeat, phone/desktop

- Homepage translated cleanly (search box "Your postcode", button "Search").
  The event content itself stayed in German ("Feuerwehr: Tag der offenen Tür
  (Beispiel)", "Beispielgemeinde Musterdorf") and the logo's accessible name
  is still "Schafe vorm Fenster — zur Startseite" — small, but the first thing
  a screen-reader user hears on the English site is a German sentence.
- On the results page (`/en/your-place?ort=07743`), the "Search" button itself
  reverts to "Suchen" — the one interactive control I'd need to search again
  is unexpectedly in German.
- The homescreen CTA is fully translated ("Add the Beispielwalde calendar to
  your home screen") and points correctly to `app.schafe-vorm-fenster.de`.

### `/en/take-part` → `/en/take-part/register` — English repeat, desktop

- "FOTO GESUCHT" badge on `/en/take-part` stayed in German.
- Step 1 of the English registration: the button is "Suchen" (not "Search"),
  and the helper line under the search box reads entirely in German
  ("Bislang nur per Postleitzahl — die Ortssuche folgt."), as does the small
  navigation line above the footer links ("Heute mit einem anderen Anliegen
  hier?"). As an English-only visitor, step 1 of registering already mixes
  languages.
- Step 2's question group is labeled "Who's publishing the dates? DEMO-DATEN"
  (English question, German tag) and the primary button to continue is
  "Weiter" — not translated. Step 3 has the same "Weiter" button.
- The final screen ("Almost there" / "Continue in the app") is correctly
  translated, but the link it hands off to is
  `app.schafe-vorm-fenster.de/registrieren` — a German path segment as the
  very last thing before leaving an otherwise-English flow.

## Divergence pass — against `specs/verification/journeys/know-what-is-on.feature`

- Scenario "Die Startseite erfüllt den Job an Ort und Stelle" matched: the
  place search is on the first screen of `/`, no click needed to reach it.
- Scenario "Ein abgedeckter Ort ohne Termine wechselt den Fokus-Job" (a place
  with no events should switch the page's focus to "publish dates" and offer
  to be first) — could not be reproduced. Every input tried (a real postcode,
  a non-existent postcode, letters) returned a fully-populated demo place with
  events; the "no events" branch was never observed from naive input.
- Scenario "Ein nicht abgedeckter Ort führt ins Gründen" (an unrecognized
  place should land on `/dein-ort/starten` with the place as a query
  parameter and a real nearby example) — also not reached for the same
  reason: nothing tried produced an "unrecognized place" response.
- Scenario "Die Seite trägt auch ohne erreichbare App-API" (graceful
  degradation when the app APIs are unreachable) — not exercisable as a naive
  visitor; no observation made either way.
- The three-outcome model the spec describes (dates / no dates / no place) was
  only ever observed to produce the "dates" outcome in this walk, regardless
  of what was typed into either postcode field on `/`, `/dein-ort`,
  `/mitmachen/registrieren`, or `/dein-kalender/bestellen`.

## Screenshots taken (23)

Saved under the run's scratchpad (`uat/` subfolder), not committed to the
repo: home (phone), `/dein-ort` result (phone), the 404 placeholder page
(phone), registration steps 1–4 (phone), `/dein-kalender` (desktop), the
placeholder briefing-link result (desktop), `/deine-region` (desktop), the
quote form before and after submit (desktop), order steps 1–4 including the
embed-code screen (desktop), and the English home / your-place / take-part /
register steps 1–4 (desktop).
