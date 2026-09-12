# Final Acceptance Protocol — the prototype milestone

Role: Customer (`.agents/roles/customer.md`,
`.agents/playbooks/playbook-customer-acceptance/SKILL.md`). This is the
closing protocol `plan/project-plan.md` makes the prototype milestone
itself. Judged alone, in writing, against what was ordered: **a complete
prototype — every route, every element, full design, full copy, full
images, with mocks and demo content labelled.** No fix was made, nothing
was escalated.

**Evidence read.** `plan/guardrails.md` (mock rule, dummy-content rule),
`plan/project-plan.md` ("The result is a prototype — complete" and "After
the prototype"), `plan/round-4.md` (the fix list, the dismissals, the
handover), `reports/acceptance/gate-2.md` (my own previous protocol — the
15 rejections and the seven must-fix items), `reports/qa/M5-run-1.md` and
`reports/qa/M5-run-2.md` (final: 285 pass / 28 fail / 45 not-testable of
358 criteria; 0 critical, 0 high; 14 findings open), `reports/uat/M5.md`,
`state/open.md`.

**Preview used, not reasoned about.**
`https://schafe-vorm-fenster-ihuc6flgy-schafe-vorm-fenster.vercel.app` —
the same commit (`691f1e8`) QA run 2 measured.

Two conditions, on purpose, because the run's own blind spot has been the
gap between them:

1. **Without JavaScript**, server response only, every one of the 24
   routes (twelve German, twelve English) plus both 404 surfaces plus
   seven `?ort=` variants — the harshest reading of the completeness
   promise, and the condition that caught the empty pages at gate 2.
2. **In a real browser** (Chromium, 390×844 and 1280×800): the home →
   place search path in both languages, the four-step order flow to the
   embed code, the quote form filled and submitted, the English
   registration flow, the archive's chip filter, the language switch, the
   404's recovery search, and a CLS measurement of my own on four pages.

Where a criterion needs an instrument I do not own — Lighthouse scores,
axe node counts, the e2e suite's determinism — I read QA's measurement
rather than repeating it. That is the playbook's spot-check principle,
and QA's evidence on those points is specific enough to rely on.

Note on attribution: the commit carrying this protocol takes the
`Fable 5.1` trailer per the standing instruction. The review itself was
performed by this session's model.

---

## 1 — Gate verdict on the prototype as ordered

**Accepted as the complete prototype the plan ordered, with a named
remainder that is written down rather than discovered later.**

The order was not "a working website". It was a prototype that is
*complete*: every route reachable, every element present, the design
carried through, the copy written, the images placed, and everything that
stands in for a system or a source honestly labelled as standing in. I
judged it against that sentence, and against that sentence it holds.

What I checked myself, and what I found:

- **All 24 routes answer 200** with a complete, server-rendered document
  in the right language. Body text ranges from 2 859 characters
  (`/dein-ort?ort=10115`, the no-dates branch — the shortest page on the
  site) to the two legal pages at 171 KB. Nothing renders as a shell, an
  empty state, or a hole. With JavaScript switched off entirely, every
  page still says what it is for and still offers its next step.
- **Both 404 surfaces render real pages.** `/dies-gibt-es-nicht-xyz` →
  `Seite nicht gefunden`, in German, with a working postcode search;
  `/en/not-a-page-xyz` → `Page not found`, in English. I typed a postcode
  into the 404's search in the browser and landed on a populated place
  page. At gate 2 the German 404 had no body at all and the English one
  answered in German. Both are gone.
- **All five conversion paths complete.** I drove four of them by hand:
  home → search → place → homescreen handover
  (`app.schafe-vorm-fenster.de/beispielort-musterhagen`); the four-step
  order flow through to a real, pasteable embed snippet; the quote form
  filled, paused over, submitted, and confirmed ("Danke — deine Anfrage
  ist angekommen"); the English registration flow through its three
  translated steps. The briefing link is one real, configured, reachable
  Google booking page (`calendar.app.google/VG9bZoYVnFcX1W6F8`, HTTP 200),
  the same one on all four pages that offer it.
- **A `?ort=` I invented behaves correctly.** I typed `24937` (never in
  any fixture) and got a fully worked place page — `Das ist los in
  Beispielort Musterhagen`, dates, a homescreen link with the right slug.
  I typed `Blütenhagen`, a place name that does not exist anywhere, and
  the site redirected me to the founding page, which addressed my invented
  place by name in seven separate sentences and then said, in so many
  words, *"Beispiel, nicht Blütenhagen"* about the demo dates it showed me
  underneath. That is the mock rule executed better than the rule asks
  for: complete, usable, and honest about itself in the same breath.
- **The archive works.** Six demo rows, a chip filter that filters when
  clicked, a `Demo-Daten` badge on the list.
- **Layout is stable where it matters.** I measured CLS myself at
  360×800, three isolated loads each: `/ueber-uns/archiv` 0.0003,
  `/` 0.0002, `/dein-ort?ort=24937` 0.0002, `/mitmachen` 0.0000. The
  262 px shift I rejected at gate 2 is gone as a visitor experiences it.
- **No console errors** in any walk except the preview's own `vercel.live`
  CSP block, which is the site's strict policy working as designed
  (F-2-27). The only non-origin host any page reached was `vercel.live`.
- **Every page has a real title and a real description**, hand-written,
  per page, in the page's own language. At gate 2 every page in both
  languages carried a meta description naming our own work packages and
  spec clauses to the public internet. That is fully gone, and it is the
  single cleanest fix of the round.

The completeness bar is met. What is not met is a short list of
correctness details, and one class of them — German strings surviving on
English pages — is the same class I rejected at gate 2 and is still not
closed. It is much smaller than it was. It is not closed.

---

## 2 — Scope, by how I judge it

### 2.1 Accepted

**285 criteria** carry a QA `pass` in `reports/qa/M5-run-2.md`, and I
accept them. QA's tables are the index; I do not re-litigate them here.
Every criterion that sits on a conversion path I walked myself, in the
paragraphs above and in §5.

Beyond the criterion count, three things I accept without reservation
because I went looking for them and could not break them:

- The **no-JavaScript completeness guarantee** now holds on all 24
  routes and both 404s. This was the run's worst blind spot for two
  gates. It is closed.
- The **English half of the site is a real site**, not a translation
  stub. Twelve routes, `lang="en"` on all twelve, English titles,
  English descriptions, English badges (`Demo data`, `Photo wanted`,
  `Not an exact match · placeholder`), English conversion copy, an
  English 404. The four German badge strings I rejected at gate 2 are
  gone; so is the `geoname.900001` identifier I found leaking into an
  English heading.
- The **honesty of the labelling**. I looked for a place where a mock
  pretends to be real and did not find one. The embed snippet sits next
  to its `Demo-Daten` badge. The newsletter says, in both languages,
  that nothing is sent and why. The quote confirmation says it saved
  nothing. The accessibility statement opens by calling itself a draft
  that has not been through legal review. Every invented name reads as
  invented — `Beispielwalde`, `Musterdorf`, `Beispielzeitung`. Nobody
  will mistake this prototype for a live service, and nobody had to
  compromise the experience to achieve that.

### 2.2 Accepted as prototype — the mock and dummy-content registers

Per `plan/guardrails.md`'s mock rule, a criterion touching a mocked
system is judged against the mock: the full flow, visible and usable,
with labelled dummy data, accepted **as prototype** with its
`state/open.md` row cited. This list is the hardening round's checklist.

**`Mock aktiv` — 16 rows, all accepted as prototype:**

| Row | System standing in | What I saw | Verdict |
| --- | --- | --- | --- |
| 1 | Media-echo entries (Q-045 — 0/32 cleared) | six fictitious archive rows, `Demo-Daten` on the list | accepted as prototype; the missing link and image are rejected separately (§2.3 R-2) |
| 2, 129 | `organizerId` minting (Q-046) | order step 4 renders the full success state with a real, copyable snippet and a visible `demo-organizer-bestellen` id under a `Demo-Daten` badge | accepted as prototype |
| 5, 78 | geo-api gaps — name search, county, radius, nearest covered place | `?ort=24937` and `?ort=Blütenhagen` both resolve correctly and differently; the "search by name is coming" note is on the search itself | accepted as prototype |
| 6, 91 | events-api `/api/stats` fields | one counter renders (`8.892 Termine`) behind a `Demo-Daten` badge; the two unavailable figures are absent rather than invented | accepted as prototype, and I prefer this to three fake numbers |
| 7 | envoy widget (Q-022) | the quote form fills, guards, submits and confirms, honestly | accepted as prototype |
| 8 | app help-URL contract (Q-041) | not visitor-reachable in this scope | accepted as recorded |
| 22 | newsletter sending system (Q-020) | full UX, `Demo-Daten`, "Es wird nichts verschickt — der Versand ist noch nicht angeschlossen" / "Nothing is sent — the mailing system is not connected yet" | accepted as prototype; §3 names it as Jan's decision |
| 70, 136 | stage-1 geolocation, stage-0 anchor | the placeless variants speak about one configured reference community, labelled | accepted as recorded |
| 77, 79 | no read token for geo-api or events-api in any environment | every data surface answers from mock or snapshot | accepted as prototype — this is the keystone row; most of the others move the day a token lands |
| 90 | dates in the place, this week nearby | demo rows on `/`, `/dein-ort`, `/dein-ort/starten`, badged | accepted as prototype |
| 125 | registration handover target, briefing URL | both are one real, working, configured URL | accepted as prototype |

**`Dummy-Content` — 20 rows, all accepted as prototype:** rows 17, 18,
19, 20, 21, 44, 46, 47, 48, 49, 50, 51, 52, 69, 92, 93, 94, 95, 107, 109.
I read every generated slot I could reach. Each one is recognisably
exemplary, on voice, and marked. Two I want to name:

- **Row 21 — the accessibility statement** on `/rechtliches`. It opens
  *"Diese Erklärung ist ein Entwurf. Für diesen Abschnitt liegt noch kein
  geprüftes Ausgangsdokument vor, und die Erklärung wurde noch nicht
  rechtlich geprüft."* Accepted as prototype, and the legal-review flag
  is where it belongs. It is also the one dummy-content row with a
  deadline: it must not reach a production build unreviewed.
- **Rows 20 and 19 — the withheld promises.** The two-working-day
  response promise and the trust block's operations sentences were
  *withheld* rather than invented, because no owner and no source stood
  behind them. Under a rule that says "never a hole", leaving those two
  slots empty was the harder call and the right one. Accepted.

### 2.3 Rejected and unresolved

These are what I do not accept. Each names the criterion it fails and a
reason a developer can act on without asking me anything. None of them
blocks the prototype milestone; all of them are why I will not say the
word "finished".

**R-1 — No `og:image` on any page, in either language.**
*Fails TS-011-A8, TS-011-A9 (finding F-2-42).* Verified myself across all
24 routes: `og:title`, `og:description`, `og:url`, `og:site_name`,
`og:locale` and `og:locale:alternate` are all present and correct;
`og:image` appears zero times, and `twitter:card` is `summary`, not
`summary_large_image`. **Rejected.** The stated purpose of this prototype
is reviews and user tests. Reviews and user tests arrive as a link pasted
into a chat window, and today every one of those links renders as a bare
grey rectangle. This is the largest remaining gap that is neither a
decision somebody owes nor a mock waiting for a system, and it is the one
I would fix first.

**R-2 — The archive's rows carry no outbound link and no image, and the
page now promises otherwise.**
*Fails TS-028-A14, TS-016-A7 (finding F-2-47).* I counted inside
`<main>` on `/ueber-uns/archiv`: zero `http` links, zero `<img>`.
**Rejected**, and the reason is stronger than at gate 2: this round gave
the page a real meta description, and it reads *"jede Zeile verlinkt auf
die Originalquelle beim Medium selbst"* — in English, *"every row links
to the original at the outlet."* The page now advertises, to search
engines and link previews, a behaviour it does not have. Q-045 explains
why the *content* is fictitious; it does not explain why six already
fictitious rows cannot carry a placeholder link and a placeholder image,
which is the treatment every other dummy-content slot in this run
received. Either the rows get their link and image, or the description
stops promising them.

**R-3 — German interface strings on English pages, wider than the
finding records.**
*Fails the locale-completeness ACs of TS-001 and the page copy ACs of
TS-024, TS-025 and TS-027 (finding F-3-24).* This is the class I rejected
at gate 2. Its badge half is genuinely closed. What is left, verified by
me on this build:

- **`/en/about` opens with a German `<h1>`** — *"Gebaut in einem Dorf,
  betrieben aus einem Dorf."* The proof section's heading is *"Was andere
  sagen"*, the traction line is *"Seit 2018 in Betrieb"*, the founder is
  attributed *"Jan-Henrik Hempel, Gründer"*, and six fixture attributions
  are German. F-3-24 records this page but names the proof label, the
  founder attribution, the context line and the attributions — not the
  headline. The headline is the first sentence an English reader meets on
  the page that is supposed to explain who we are.
- **`/en/your-calendar` — on the conversion path.** The secondary CTA
  beside "Order the calendar" reads *"Book a briefing (öffnet neuen Tab)
  · Daten gehen an Google"*. F-3-24 does not list this page at all. A
  disclosure about where a visitor's data goes, printed in a language
  that visitor did not choose, is the wrong string to have in German.
- **`/en/your-calendar/order`** — all four step badges read *"Schritt N
  von 4"*, the empty state reads *"Noch keine Auswahl. Füge oben Orte
  oder eine Postleitzahl hinzu."*, and the remove control is labelled
  *"Beispielwalde entfernen"*. The English registration flow, three steps
  away, says "Step 2 of 3" and "Continue" correctly — so the translation
  exists; the order flow simply does not use it.

**Rejected.** The instances are mechanical and enumerable. What I am
rejecting is that this is the third gate at which "fixed in German, still
broken in English" is the shape of the remaining work.

**R-4 — A raw internal proof identifier is rendered as visible body copy,
in both languages.** *New on this walk; fails TS-027's proof-card ACs and
the same standard under which this run already fixed the meta-description
leak and the `geoname.900001` leak.* `/ueber-uns` and `/en/about` both
render a visible paragraph reading **"Beleg: founder-former-volunteer-mayor
(cleared)"** — an internal record id and its internal clearance state, as
page copy, above the founder's quote. F-3-24 files this as a German
string on an English page. It is not only that: it is an identifier on
the German page too, where no locale bug exists. **Rejected.** The proof
card's context line should say what the evidence is, in words, or say
nothing.

**R-5 — Literal Markdown backticks in the accessibility statement.**
*New on this walk; fails TS-007's content-pipeline rendering and TS-029.*
Both `/rechtliches` and `/en/legal` render the sentence *"Diese Erklärung
gilt für die Website unter \`www.schafe-vorm-fenster.de\`."* — with the
backticks visible. An unrendered code span in a legal text. **Rejected**,
trivially: one source edit or one renderer case.

**R-6 — A duplicate `<main id="main">` survives every client-side
navigation into a flow route.** *New on this walk; fails TS-002's landmark
ACs and basic HTML validity.* Measured in the browser: entering
`/en/take-part/register` from `/en/take-part`, and `/mitmachen/registrieren`
from `/mitmachen`, leaves **two** elements with `id="main"` in the DOM
five seconds later. The stale one is `display: none` and height 0, so
nothing is visible and nothing is announced — but the id is duplicated
for the rest of the session, and the skip link's `#main` target becomes
ambiguous. **Rejected**, low. Same family as open row 158 (the transient
duplicate search-input id); worth recording because row 158 describes a
window that closes and this one does not.

**R-7 — TS-002-A1 and TS-029-A12 are unmet as written.**
*Open rows 155 and 156.* The criterion says axe-core reports zero
violations on every page in all three themes. QA's presence-based sweep
reports six moderate nodes: `landmark-unique` ×4 and `heading-order` ×2.
I confirmed the cause of the first myself — `/` serves three
`<form role="search">` elements with no accessible name between them.
**Recorded as unmet, not rejected as a defect**, and I want the reason on
the record because the state is much better than the verdict sounds: the
48 serious nodes per theme that the sweep carried for three rounds are
gone, Lighthouse accessibility scores 100 on every page and every run, and
zero serious and zero critical findings exist in any theme. What holds the
two criteria at `fail` is two deliberate decisions somebody else owns —
naming two search landmarks, which TS-006 D6's "no new text" rule
constrains, and normalising an `<h6>` inside a verbatim legal import.
Both need a decision, not a fix.

**R-8 — The performance floor is missed.** *F-3-3, F-3-4.* Mobile
Lighthouse 96 on `/` against TS-003 D7's floor of 98, re-measured
unchanged across two runs; `Save-Data: on` saves 0 %. I did not measure
these myself — Lighthouse is QA's instrument, not mine. **Rejected as
unmet**, to the performance owner, and §3 says it out loud because QA
asked that it be said rather than papered over.

**R-9 — The order flow takes an empty invoice.** *F-3-19.* I clicked
"Weiter" on step 3 ("Wohin geht die Rechnung?") with organisation,
contact, email and address all blank, and the flow handed me the embed
code. **Rejected.** Of the seven usability findings on the open list, this
is the one I would not let ride: it is a purchase step, the fields are
the invoice, and nothing marks them required or stops the visitor.

**R-10 — "1 Orte ausgewählt".** *F-2-53.* Confirmed in the browser after
adding one place; the English page says "1 places selected". **Rejected**,
cosmetic, a plural rule rather than a string. It sits on the paid path,
which is why I keep naming it.

**R-11 — The German legal bodies on `/en/legal` carry no `lang="de"`.**
*Open row 151; fails WCAG 3.1.2 under TS-029.* Verified: the only
`lang="de"` on the page is the language-switch link. The English
disclaimer above the texts now tells a sighted reader what is coming — a
screen-reader user still hears German prose read in an English voice.
**Rejected.** One attribute on the imported body wrapper.

### 2.4 Accepted as decided, tracked, or outside a customer's remit

- **Row 145 / TS-005-A9, TS-009-A3, TS-009-A9** — the Suspense/PPR shell
  against the no-JavaScript completeness guarantee, deliberately not
  shipped broken. At gate 2 I said I wanted this settled before calling
  the prototype finished, because F-2-49 and F-2-70 were concrete
  instances of it. Both instances are now closed, and closed on the side
  of completeness. That changes my position: the architectural decision
  is still owed, but it is no longer holding a visitor-visible defect
  behind it. Accepted as recorded, decision owed by the
  rendering-and-resilience spec owner.
- **Row 131 / TS-009-A2** — four routes stay fully dynamic, each because
  the request value *is* the page. Accepted as recorded.
- **Row 157 / TS-003-A8** — the hero is a CSS background and cannot carry
  `fetchpriority`; the `/ueber-uns` half is fixed. Accepted as a TS-003 D2
  conversation, travelling with R-8.
- **Rows 143/152 / TS-026-A8** — `check:terms` outside the `check` chain.
  A build guard, not page content; no visitor sees anything different.
  Accepted as tracked debt.
- **F-3-26** — the preview e2e suite fails a different single case on
  every run while the local suite is 509/0 twice. A measurement problem,
  not a product problem, and QA filed it as such. Accepted as recorded —
  and I agree with QA that it should be fixed before any future milestone
  reads a verdict off that suite.
- **F-3-25** — `/ueber-uns/archiv` measures CLS 0.279 in 4 of 12 runs
  under Playwright's parallel worker pool, and ≤ 0.0003 in every isolated
  measurement. My own three isolated measurements agree with the clean
  number. Accepted as a load artefact, recorded, not a visitor
  experience.
- **Rows 158, 159, 146, 154, 142, 153, F-3-6/F-2-8, F-3-7/row 150,
  F-3-17, F-3-18, F-3-20, F-3-21, F-3-22, F-3-23** — engineering and
  usability items with named owners in `plan/round-4.md`'s four
  workstreams. Accepted as tracked. I single out **F-3-17** for the
  content review rather than the code: "Das ging sehr schnell. Sieh die
  Angaben noch einmal durch" reads, to somebody who simply typed fast, as
  an accusation.
- **F-2-19 / TS-029-A14** — a skipped heading level inside imported
  privacy text. Accepted as tracked; I am not the right judge of a legal
  document's heading structure.

### 2.5 Counts

| | Count |
| --- | --- |
| Criteria in scope (QA M5 run 2) | 358 |
| Accepted (QA `pass`) | 285 |
| Not testable with the instruments available — accepted as an instrument gap, no missing product | 45 |
| Criteria carrying a `fail` | 28 |
| `Mock aktiv` rows accepted as prototype | 16 |
| `Dummy-Content` rows accepted as prototype | 20 |
| Findings open at the gate (QA) | 14 (0 critical · 0 high · 8 medium · 6 low) |
| **Rejected and unresolved by me (§2.3)** | **11 items, R-1 … R-11** |
| — of those, new on this walk, on no list QA, UAT or round 4 produced | 4 (R-4, R-5, R-6, and R-2's description contradiction) |

The eleven rejections are items, not criteria, and they do not partition
the 28 fails. Seven map onto existing criteria or findings — R-1 to
TS-011-A8/A9 (F-2-42), R-2 to TS-028-A14 and TS-016-A7 (F-2-47), R-3 to
F-3-24, R-7 to TS-002-A1 and TS-029-A12 (rows 155, 156), R-8 to F-3-3 and
F-3-4, R-11 to open row 151, and R-9/R-10 to F-3-19 and F-2-53, which are
open-list findings rather than failing criteria. Four are mine from this
walk and are not findings anywhere yet: R-4, R-5, R-6, and the
description contradiction inside R-2. The rest of the 28 fails I accept
as decided, tracked, or outside a customer's remit — §2.4 names them by
row and by owner.

---

## 3 — Say this out loud before any go-live

Four things are true of this prototype that the prototype itself cannot
show, plus two that only Jan can clear. None is a defect this run could
close. All of them have to be said now rather than found later.

**1. Row 132 is the one real go-live blocker, and the preview hides it.**
A hash-only CSP cannot cover Next's request-time flight payload, because
the payload is generated per request and the hash extractor reads
prerendered HTML. So the four dynamic routes — `/dein-ort`,
`/dein-ort/starten`, `/mitmachen/registrieren`,
`/dein-kalender/bestellen` — **ship unhydrated in production**: no click
handlers, no conversion events, React error #412. The preview hydrates
because a preview gets `'unsafe-inline'`. Two of those four routes are
conversion flows, so the failure mode is that the order flow and the
registration flow stop working on the day the site goes live and on no
day before it. This needs a DEC-045 amendment — a nonce — not a fix
round. Rows 139, 147 and 148 are its consequences and close with it.
**Nothing may be promoted to production until this is answered.**

**2. Row 145 — the Suspense/PPR shell was left unresolved on purpose.**
Three criteria fail (TS-005-A9, TS-009-A3, TS-009-A9) because the
loading-shell mechanism and this site's no-JavaScript completeness
guarantee genuinely collide, with row 131 beside it. The run wrote the
collision down instead of shipping something broken, and I would rather
have that. It needs the rendering-and-resilience spec owner. The
practical consequence today: on a slow connection a visitor sees nothing
where a skeleton would be — which is why the no-JavaScript half had to be
the one that won.

**3. The sharing and performance floor.** No page in either language
emits an `og:image`, so every share of this prototype is a bare link
(R-1, F-2-42, TS-011-A8/A9). Mobile Lighthouse measures 96 on `/` against
TS-003 D7's floor of 98, re-measured and unchanged, and `Save-Data: on`
saves 0 % (R-8, F-3-3/F-3-4). QA asked explicitly that these be stated
rather than quietly accepted, and they are right to: a prototype that
travels by link and is reviewed on phones is judged on exactly these two
things before anybody reads a word of it.

**4. The mock register — sixteen rows, and what they mean together.**
Sixteen `Mock aktiv` rows stand, every one labelled in both languages,
every one verified on this build. Read as a list they look like polish.
Read as a system they are one sentence: **no page on this site has ever
fetched anything from geo-api or events-api, because no read token for
either service exists in any environment (row 77).** Every place, every
date, every counter, every nearby example on this prototype is a fixture.
That is exactly what the mock rule ordered and it is honestly labelled
throughout — and it also means the first real integration is still
entirely ahead, and that row 77 is the keystone: `LIVE_DATA=auto`
switches each capability to its real client the moment a token is
provisioned, so most of the sixteen move together. Row 132 and row 77
are, between them, the whole distance from this prototype to a live site.

**Jan's two dashboard items — neither has an API, neither can be done
from this repository:**

- **Row 22 — the newsletter's sending system (Q-020) is undecided.**
  Until it is answered, the block stays a labelled mock that sends
  nothing. It is on every page of the site, in both languages, saying so.
  Decision: envoy/ops, with Jan.
- **Row 64 — CI cannot install the private packages.** `pnpm install`
  fails with `ERR_PNPM_FETCH_403` on every `@schafe-vorm-fenster/*`
  package, because GitHub Packages requires each *publishing* repository
  to grant this repository's Actions access from its own settings page.
  Dashboard-only; no REST or `gh` endpoint exists for it. Jan, as org
  owner, for each of the eleven consumed packages: `brand-design`,
  `audiences`, `brand-identity`, `goals`, `media-echo`, `messaging`,
  `offerings`, `partners`, `people`, `posts`, `proof`. Until then the
  quality gates run locally only.

---

## 4 — Re-judgement of the gate-2 must-fix list

At gate 2 I named seven things that had to be fixed before I would accept
the prototype as done. Here is each one against what I walked today.

**1. F-2-49 — the blank, JavaScript-only page on `/dein-ort/starten` and
the uncovered-postcode branch of `/dein-ort`. → RESOLVED.**
I re-ran my own gate-2 test: `curl` against the preview, no JavaScript at
all. `/dein-ort?ort=24937` returns 3 401 characters of body text with a
real headline; `/dein-ort?ort=10115` returns the no-dates branch;
`/dein-ort?ort=99999`, `?ort=abcdef` and `?ort=Blütenhagen` each return a
**307 to `/dein-ort/starten`**, which then renders a complete founding
page naming the place I typed. The hop happens in the proxy, before the
render, exactly as the fix describes. At gate 2 these routes returned 200
with an empty document. This was my first-priority rejection and it is
cleanly closed.

**2. F-2-70 — the empty German 404 body. → RESOLVED.**
`/dies-gibt-es-nicht-xyz` returns 404 with a rendered document: "Seite
nicht gefunden", an explanation, a postcode field, a search button, and a
link home. The English-prefixed 404 renders in English ("Page not
found"), closing the separate language mismatch I flagged alongside it. I
used the 404's search in a browser and it took me to a populated place
page. Both halves closed.

**3. F-2-39 / F-2-56, open row 145 — the loading-skeleton decision.
→ STILL OPEN, and I withdraw my condition.**
I said at gate 2 that I wanted this settled before calling the prototype
finished, on the grounds that items 1 and 2 were concrete instances of the
same unresolved tension. Both instances are now closed, and closed on the
side of completeness rather than the side of the shell. The decision is
still owed to the rendering-and-resilience spec owner and it is named in
§3. It is no longer a condition of my acceptance, because it is no longer
hiding a visitor-visible defect.

**4. F-2-69 — the 262 px layout shift on `/ueber-uns/archiv`. → RESOLVED
as a visitor experiences it.**
I measured it myself this time rather than reading QA's number: 360×800,
three isolated loads, `PerformanceObserver` on `layout-shift` —
**0.0003, 0.0000, 0.0003**. For comparison the three other pages I
measured came in at 0.0002, 0.0002 and 0.0000. F-3-25's 0.279 excursion
appears only under Playwright's parallel worker pool and is a
measurement artefact, which QA filed correctly. Closed.

**5. F-2-33's tail — four German labels on English pages, plus the
`geoname.900001` leak I found. → PARTLY RESOLVED; the class is not
closed.**
The five specific instances are all gone. `Demo-Daten`, `Foto gesucht`
and `Nicht motivgenau · Platzhalter` now read `Demo data`, `Photo wanted`
and `Not an exact match · placeholder` on all twelve English routes —
zero hits when I scanned for the German strings. `/en/your-region` now
says "examples from your region" where it used to print
`geoname.900001`. The founder's `alt` text is English. But the class
behind them is not closed: it moved to `/en/about`'s headline, to
`/en/your-calendar`'s briefing disclosure, and to the whole order flow's
step badges (R-3). **This item is the one I am least satisfied with**,
not because what remains is large, but because it is the third gate in a
row at which it is the same shape of problem.

**6. The meta-description ticket leak. → FULLY RESOLVED, and better than
I asked for.**
At gate 2 every page in both languages carried a description reading
*"Schafe vorm Fenster — Platzhalter aus dem Routing-Gerüst (M2). Titel
und Beschreibung kommen in M3 aus dem Content-Frontmatter (TS-011 D5)."*
I asked for "even a temporary, hand-written title and description per
page". What shipped is a real one for each of the 24 routes, in the
page's own language, written as marketing copy rather than as a
placeholder — *"Alle Termine aus deinem Ort an einer Stelle — Vereine,
Gemeinde, Feuerwehr, Kirche."* I scanned every rendered page for
`TS-###`, `Q-###`, `DEC-###`, `F-#-##` and work-package names and found
zero hits in any visible text or any meta tag. This is the best-executed
item on the list.

**7. `/en/legal`'s missing English disclaimer. → RESOLVED.**
The page now opens, in English, with: *"The six legal sections below are
available in German only. We do not machine-translate legal text and do
not write an English substitute for it. The English documents follow once
they exist."* That is better than the mitigation row 53 promised — it
explains the policy rather than just flagging the gap. The underlying
translation gap remains, correctly, and open row 151 (no `lang="de"` on
the German bodies) is still open and is rejected separately at R-11.

**And the two lower-priority rejections I made at gate 2:**

- **F-2-41, the missing context band on `/ueber-uns`, `/ueber-uns/archiv`
  and `/rechtliches`. → RESOLVED.** All three now carry an `<aside>`. I
  counted across every route: eleven of twelve German pages have one, and
  the only page with none is `/dein-kalender/bestellen`, which is the
  decided deviation F-2-10.
- **F-2-47, the archive's linkless rows. → STILL OPEN**, and now
  aggravated by the page's own description promising the opposite. See
  R-2.
- **F-2-42, no `og:image`. → STILL OPEN.** See R-1 and §3.

**Score on my own gate-2 list: five of seven must-fix items resolved, one
resolved and withdrawn as a condition, one partly resolved with its class
still open. Of the lower-priority four, two resolved, two still open.**

---

## 5 — What I would tell Jan first when he asks "is it done?"

**No — and it was never supposed to be. It is finished as a prototype,
and that is what you ordered.**

That is the honest answer in one breath, and here is what I would say
next, in this order.

**Open it. It holds.** Twenty-four pages in two languages, five
conversion paths that all complete, a 404 that helps instead of
apologising, an order flow that ends in code you could paste today, and a
search that behaves correctly for a postcode that exists, one that does
not, and a village name I invented on the spot. Turn JavaScript off and
it still all works. Read it and nothing is a placeholder pretending to be
content; where we did not have a source we wrote something honest and
marked it, and where we did not have a system we built the whole
experience and marked that too. You can put this in front of a
Bürgermeisterin next week and learn something real from what she does
with it.

**One thing stands between this and a live site, and the preview cannot
show it to you.** Under the security policy we ship, four pages —
including the order flow and the registration flow — will load in
production without their JavaScript attached. They work perfectly on the
preview because a preview runs a looser policy. That is row 132, it is a
decision about DEC-045 rather than a bug to fix, and it is the first
thing on the list for whatever comes after the break.

**Two things I would want done before anyone shares a link.** Nobody has
made a preview image, so every link to this site lands in a chat as a
grey box. And a handful of German sentences are still standing on English
pages — the "Why us" page still opens with a German headline, and the
briefing link's data-protection note is in German on the English calendar
page. Neither is hard. Both are the first impression.

**Two things only you can unblock**, both in dashboards no agent can
reach: how the newsletter actually sends (row 22), and CI's access to our
own private packages (row 64). Until the second one is cleared, every
quality gate on this project runs on somebody's laptop.

**And the thing I would want you to hold on to.** Every place name, every
date, every counter on this site is a fixture, because no read token for
geo-api or events-api exists in any environment yet. That is the mock
rule working exactly as written, and the labelling is honest on every
page. It also means the distance from here to a live site is two pieces
of work, not twenty: get the tokens in (row 77, and most of the sixteen
mock rows move with it), and amend the CSP (row 132). Everything else on
the open list is content, polish, or a decision somebody owes.

**Three things, as the customer.**

*Impressed:* the founding page for a place that does not exist. I typed
`Blütenhagen` — a name I made up — and got a complete page that addressed
my invented village by name, told me what it would take to get it into
the calendar, showed me a worked example, and said in plain words
*"Beispiel, nicht Blütenhagen"* about the example. That is a page nobody
was watching, in the branch nobody walks, and it is honest and finished.
The completeness rule is not a checklist here; somebody actually meant it.

*Impressed:* the meta descriptions. At the last gate, every page in both
languages told search engines our internal ticket numbers. Today every
page has a sentence somebody wrote on purpose. Small, invisible, and the
clearest evidence I have that the last round was worked rather than
ticked.

*Worried, and less than last time:* the blind spot is still German-first.
Five specific German strings on English pages were fixed this round, and
the same class re-appeared in three new places — a headline, a data
disclosure on a conversion path, an entire flow's step badges. It is
smaller every gate and it has not gone away. Before the next round of
work, I would want the English pages read end to end by a person, once,
in one sitting — not scanned for the four strings we already know about.
That is an hour of somebody's attention, and it would close a class that
three rounds of automated sweeps have not.

---

## Gate verdict

**The prototype milestone is accepted.** What was ordered — a complete
prototype, every route, every element, full design, full copy, full
images, mocks and demo content labelled — stands and works, in both
languages, with and without JavaScript, on the protected preview.

Accepted: 285 criteria, 16 `Mock aktiv` rows and 20 `Dummy-Content` rows
as prototype, 45 not testable with the instruments available.

Rejected and unresolved: eleven items (R-1 … R-11), four of them raised
here for the first time. None is critical, none is high, none blocks the
milestone, and every one names its criterion and what to do about it.

Not go-live-ready, and not claimed to be: row 132 must be answered, row
145 must be decided, the OG images and the performance floor must be
closed, and sixteen mocks must meet their real systems. That is the
hardening round `plan/project-plan.md` always put after this one, and
`state/open.md` is its checklist.
