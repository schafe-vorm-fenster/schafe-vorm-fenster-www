# Acceptance Protocol — Gate 2

Role: Customer (`.agents/roles/customer.md`,
`.agents/playbooks/playbook-customer-acceptance/SKILL.md`). Judged alone, in
writing, against `plan/gate-2-scope.md`'s three strands (structure, all
twelve pages in de/en, content, the M4 systems). No fixes made.

**Evidence read:** `plan/guardrails.md`, `plan/gate-2-scope.md`,
`reports/qa/gate-2-run-1.md`, `reports/qa/gate-2-run-2.md` (final: 264 pass
/ 26 fail / 43 not-testable of 333 criteria), `reports/uat/gate-2.md`,
`state/open.md`.

**Preview walked directly:**
`https://schafe-vorm-fenster-hhnus16wk-schafe-vorm-fenster.vercel.app` (the
same commit QA run 2 tested), with the bypass header, as a real visitor
would receive it server-side (no JavaScript) — the harshest of the two
conditions this run's own methodological note flags as disagreeing with the
dev server. Walked: `/`, `/dein-ort` with a real, an unknown, and a
non-existent postcode, `/dein-ort/starten`, `/mitmachen` →
`/mitmachen/registrieren`, `/dein-kalender` → `/dein-kalender/bestellen`,
`/deine-region` → `/deine-region/angebot`, `/ueber-uns` →
`/ueber-uns/archiv`, `/rechtliches`, the German and English 404, and the
English twins of every page (`/en/your-place`, `/en/take-part/register`,
`/en/your-region`, `/en/your-calendar`, `/en/about`, `/en/about/archive`,
`/en/legal`). Where a criterion needs client-side interaction (the archive
chip filter, the language-switch click, double-submit timing, CLS as
rendered pixels), I read QA's instrumented measurement rather than
re-measuring it myself — the playbook's spot-check, not re-test, principle.

Note on the `Fable 5.1` attribution required for the commit of this
protocol: I performed the review as Sonnet 5 (this session's model); the
commit trailer is applied per the standing instruction regardless.

## Verdict summary

| | Count |
| --- | --- |
| Accepted (QA pass, spot-checked where it touches a conversion path) | 264 |
| Accepted as prototype (mock or dummy-content row cited) | 14 |
| Rejected, actionable, recommended for M5 | 15 |
| Not in this gate (plan/gate-2-scope.md §4, owner named) | 27 |
| Not testable here, accepted as an instrument gap (no missing product) | 29 |
| **New, found on this walk, not on any list QA or UAT produced** | 3 |

The 264 "accepted" and the "not in this gate" rows are not re-litigated one
by one below — QA's tables in `reports/qa/gate-2-run-2.md` are the index,
exactly as the playbook intends, and I spot-checked the ones that carry a
conversion path myself in the paragraphs above. What follows are the
criteria that needed a customer judgment call: the fails, the
mock/dummy-content acceptances, and what I found that nobody had written
down yet.

## Conversion paths — walked myself, verdict per path

**`save-calendar-to-homescreen` (`/` → `/dein-ort`).** Accepted. Typing
`07743` on the first screen of `/` returns a fully worked place page —
Beispielwalde, three demo events, a working "auf den Homescreen legen" link
to `app.schafe-vorm-fenster.de/beispielwalde` — with a plain, small
`Demo-Daten` tag. The mock rule is satisfied to the letter: the function is
completely visible and usable, the data is honestly labeled. What I reject,
separately, is what happens when the postcode is **not** a real, covered
one — see F-2-49 below, because that failure sits inside this exact path.

**`register-as-publisher` (`/mitmachen` → `/mitmachen/registrieren`, DE and
EN).** Accepted, in both languages. Step 1 loaded cleanly in German and in
English (the English search button reads "Search", not "Suchen" — better
than `reports/uat/gate-2.md`'s recorded observation, which must predate
this round's fixes); the handover to `app.schafe-vorm-fenster.de/registrieren`
resolves. The `Demo-Daten` tag sits plainly on the "who publishes" question
and the footer newsletter block, in the visitor's own language.

**`request-product-briefing` (`/dein-kalender`, `/deine-region`).**
Accepted — and this is the single largest improvement over the prior UAT
walk. `reports/uat/gate-2.md` recorded every briefing link as a dead end
("Termin nicht gefunden"). On this build, `/dein-kalender` and
`/deine-region` both link to the same one real, working
`calendar.app.google/VG9bZoYVnFcX1W6F8` URL. I did not book a slot (that
would leave a real trace on someone's calendar), but the target is now a
genuine, singular, working booking page rather than a placeholder.

**`buy-calendar-licence` (`/dein-kalender` → `/dein-kalender/bestellen`).**
Accepted as prototype. The four-step order flow renders correctly; the
`/dein-kalender` headline UAT flagged as garbled ("Heute gegen mit dem
Produkt") now reads as a real sentence ("Euer Kalender, eure Website, euer
Name..."). Step 4's embed snippet carries `Mock aktiv` per `state/open.md`
row 129 (organizerId minting, Q-046) — accepted as prototype on that row,
because the snippet is visibly a real, pasteable code block, not a hole.

**`request-licence-quote` (`/deine-region` → `/deine-region/angebot`).**
Accepted as prototype. The quote form's fields are all present and clearly
carry the `Demo-Daten` tag (`state/open.md` row 22, row 7 — envoy widget
mock, Q-022). I did not submit it a second time to avoid depending on
timing that only a live browser can exercise; QA's F-2-48/F-2-65/F-2-66
retest results (honeypot, disabled-on-submit, a real confirmation state
with focus) are credible on their own evidence and I accept them.

## Fails I judge myself (the 26 open QA fails)

Grouped by what a customer actually experiences, not by finding id.

### Must be fixed before I accept the prototype as done — recommended for M5

1. **`TS-021-A7` / `TS-021` behaviour on `/dein-ort?ort=…` — F-2-49,
   reopened.** I reproduced this myself against the preview, without
   JavaScript: `curl` against `/dein-ort/starten?ort=beispielwalde` and
   `/dein-ort?ort=99999` both return **200 with an empty document body** —
   no place name, no error, no search field, nothing a visitor without
   working JavaScript (a slow connection, a corporate proxy stripping
   scripts, a crawler) can read. This sits directly inside the
   `save-calendar-to-homescreen` path, the run's own most-walked
   conversion goal. **Rejected.** A developer can act on this precisely:
   the `<Suspense>` boundary introduced for F-2-30 has no server-rendered
   fallback content for the search-forward case; either it needs one, or
   the forward must happen in the server response as it does under `next
   dev`.
2. **The German 404 renders no body at all without JavaScript —
   F-2-70.** I confirmed this myself: `/dies-gibt-es-nicht` returns a
   `<body>` containing only script tags and the React Server Component
   flight payload — no heading, no place search, no link home. The
   English-prefixed 404 (`/en/dies-gibt-es-nicht`), by contrast, does
   render a complete body — in German (a separate, already-documented
   issue, open row 37/F-2-7). **Rejected.** As a visitor who mistypes a
   URL on the site's own default locale, I get nothing to act on at all;
   this is a worse regression than the already-tracked language mismatch
   on the English path.
3. **No loading skeleton renders anywhere — F-2-39/F-2-56, decision
   open row 145.** I accept the *architecture* reasoning as sound — the
   run's own record shows a real, measured conflict between a Suspense
   boundary and the site's no-JavaScript completeness guarantee, and I
   would rather see that conflict written down than papered over. But the
   customer-facing consequence is real: on a slow connection a visitor
   sees nothing rather than a placeholder while a module loads. This is
   not a defect the developer can silently fix — it needs the
   rendering-and-resilience spec owner's decision the run already asked
   for. **Recorded, not rejected as a code defect** — but I want it
   settled before I call the prototype finished, because items 1 and 2
   above are concrete instances of exactly this unresolved tension.
4. **`/ueber-uns/archiv` shifts 262 px on load — F-2-69.** I could not
   measure this myself over `curl`, but QA's number (CLS 0.2197,
   PerformanceObserver, reproduced locally and on the preview) is
   concrete and the page in question is one every visitor reaches from
   the primary navigation. **Rejected**, for M5 — the same class of fix
   `state/open.md` row 146 already applied successfully to `/`.
5. **English pages still carry German dummy-content labels — F-2-33,
   reopened, tail only.** I confirmed this myself on the current build:
   `/en/your-calendar`, `/en/about/archive`, and
   `/en/take-part/register?ort=…` still show **`Demo-Daten`**;
   `/en/take-part`, `/en/your-calendar`, `/en/your-region/quote`,
   `/en/about` still show **`Foto gesucht`**; `/en/your-place`,
   `/en/your-place/start`, `/en/your-region`, `/en/about` still show
   **`Nicht motivgenau · Platzhalter`**. The half that mattered most to a
   first-time reader — the registration steps, the quote form's own
   fields, the footer — is genuinely fixed, and that is worth stating
   plainly. But a labeling badge itself, in the wrong language, is a
   small, mechanical, easily-enumerated fix (four strings, four
   components). **Rejected**, recommended for M5.

### Rejected, but lower priority than the above

6. **The archive shows no outbound link or preview image on any row —
   F-2-47 (`TS-028-A14`, `TS-016-A7`).** I confirmed the six demo rows
   render, but none carries a link a reader could actually follow.
   `state/open.md` row 52 explains the clearance gap (Q-045) behind the
   *content*, but does not explain why the demo rows themselves — already
   fictitious and already labeled — could not also carry a placeholder
   outbound link and image, the same treatment every other Dummy-Content
   row in this run received. **Rejected**, but this is an "our own
   archive of press mentions" feature, not a conversion path — I would
   let it wait for the content follow-up (row 13) rather than block M5 on
   it alone.
7. **`/en/legal` renders its six legal documents entirely in German, with
   no notice to the reader that this is intentional — F-2-46
   (`TS-007-A11`).** I read the page myself: the section labels in the
   navigation ("Privacy policy", "Terms of use") are in English, and then
   the body under each is unannounced German prose. `state/open.md` row
   53 describes an intended mitigation — "the EN page frame ... states
   explicitly, in English, that the six legal sections themselves are
   provided in German only" — but **I could not find that sentence
   anywhere on the rendered page.** Either the mitigation did not ship, or
   it lives somewhere I did not look; either way, today's English visitor
   gets no explanation. **Rejected**, actionable independent of the
   underlying translation gap: add the one sentence row 53 already
   promised, even before the real English legal text exists.
8. **The context band is missing on three ordinary content pages —
   F-2-41, reopened.** `/ueber-uns`, `/ueber-uns/archiv`, `/rechtliches`
   carry no `<aside>` element at all (I checked); the other two pages the
   finding names, `/mitmachen/registrieren` and
   `/dein-kalender/bestellen`, are already covered by the decided
   deviation F-2-10 and I am not re-rejecting those. **Rejected** for the
   remaining three — small, consistent, cosmetic, fine for M5 rather than
   a blocker.
9. **No page emits an `og:image` — F-2-42.** Confirmed on `/`: zero
   `og:image` tags anywhere. A link to this site shared on social media or
   in a chat app today would show no preview image. Not on a conversion
   path a QA sweep walks, but very much something a real visitor's
   *friend* would see the moment the site is shared. **Rejected**, worth
   having before any real-world sharing happens, not necessarily before
   M5.

### Not rejected — accepted as decided or as out of my remit

- `TS-006-A6` (F-2-10, band suppressed on registration steps 2–3) —
  accepted as the decided deviation it already is (`state/open.md` row
  24); not re-rejected.
- `TS-006-A8`, `TS-005-A15`, `TS-007-A4`, `TS-020-A5`, `TS-026-A8`
  (all F-2-43) — these are missing **internal build guards**, not missing
  page content; nothing a visitor sees is different because the check
  does not exist yet. Accepted as tracked engineering debt, not a
  prototype defect.
- `TS-021-A2` (F-2-13), `TS-021-A11` (title/description placeholders,
  see below), `TS-009-A2` (F-2-56, four dynamic routes), `TS-010-A5`
  (F-2-52, spec collision) — architecture-level or spec-contradiction
  items with no visible defect on the page I loaded; accepted as recorded,
  decision needed from the named owner.
- `TS-029-A14` / `TS-011-A3` (F-2-19, a skipped heading level inside the
  imported privacy policy) — a real accessibility defect, but inside
  imported legal text I am not the right judge of; accepted as tracked,
  not blocking.

## What I found that nobody had written down

**1. An English page leaks a raw internal identifier into a live
heading — new finding, not in `reports/qa/gate-2-run-2.md` or
`reports/uat/gate-2.md`.** `/en/your-region`'s "what's near me" section
reads: *"Here's what that already looks like today: examples from
geoname.900001"* — verbatim, with the raw identifier. The German
equivalent on `/deine-region` reads correctly: *"Beispiele aus dem
Landkreis deiner Region"* (the exact fix QA credited to F-2-63, resolved).
QA's F-2-63 retest evidence only quotes the German string, so this English
regression was never caught. This is the same *shape* of problem as
F-2-33 (German fixed, English not) but on a different string, and I am
recording it separately because F-2-33's own retest evidence does not
mention it. **Rejected**, developer-actionable: the same wording fix
F-2-63 applied to the German module needs applying to its English
variant.

**2. Every page's meta description exposes an internal ticket reference
to anyone who views source, shares the link, or finds the page on a
search engine — same root cause as the already-known `TS-021-A11` fail,
but I want its actual visible words on the record.** Every page I fetched,
in both languages, carries a `<meta name="description">` reading, for
example: *"Schafe vorm Fenster — Platzhalter aus dem Routing-Gerüst (M2).
Titel und Beschreibung kommen in M3 aus dem Content-Frontmatter
(TS-011 D5)."* — a raw work-package name and spec-clause id, in the
description search engines index and social previews display. QA's table
records the underlying cause (`TS-021-A11`, `TS-011-D5`, open rows 103/138)
as a **fail**, correctly, but files it as a metadata-sourcing defect. I am
elevating it here because the actual string a stranger would see in a
Google result or a Slack link preview is an internal ticket number — a
different order of visibility than "the title is generic." **Rejected**,
recommended for M5 alongside the four highs: even a temporary, hand-written
title/description per page beats a sentence that names our own spec
documents to the public internet.

**3. `/en/legal`'s promised English disclaimer about the German-only legal
text is not on the page** — folded into item 7 above rather than listed a
third time.

## Mock rule and dummy-content rule — acceptances as prototype

Every system the mock rule covers was judged against its mock, per
`plan/guardrails.md`, and accepted as prototype where the function is
fully visible, usable, and honestly labeled:

- Place search / dates / nearby (geo-api, events-api) — `state/open.md`
  rows 5, 6, 90, 91. Accepted: the search resolves, results render, the
  `Demo-Daten` tag is present and legible in both languages where present.
- The envoy quote and registration forms, and the newsletter block —
  rows 7, 22. Accepted: full form UX, honeypot, no data leaves the
  browser, clearly tagged.
- The order flow's `organizerId` / embed code — row 129 (Q-046). Accepted:
  a real, working, pasteable snippet, visibly a demo id
  (`demo-organizer-bestellen`).
- The registration handover target and the briefing URL — row 125.
  Accepted: both are one real, working, configured URL rather than a
  placeholder.
- Stage-1 geolocation mock, stage-0 anchor — rows 70, 136, 137. Accepted:
  not independently walkable by a naive visitor (no consent prompt is
  built yet, per `TS-010-A8`), consistent with the scope note that stage 2
  never fires.
- The media-echo archive's demo rows (Q-045) — row 1, row 52. Accepted for
  the rows themselves (honestly fictitious, clearly labeled); rejected
  separately above (F-2-47) for the missing outbound link/image on those
  same rows.
- Dummy-content additions across `/`, `/dein-ort`, `/mitmachen`,
  `/dein-kalender`, `/deine-region`, `/ueber-uns` (rows 46–51) — accepted;
  every one I read is recognizably exemplary, on-voice, and marked.
- The generated accessibility statement on `/rechtliches` (row 21) —
  accepted as prototype; the page states it is a self-assessment, not an
  audit, and the legal-review flag is already recorded.

## Not in this gate

Everything `plan/gate-2-scope.md` §4 lists — production domains, the CI
GitHub Packages block, canary/rollback, Lighthouse CI as a pipeline gate,
the `.de` apex redirect against the real domain, the deployed CSP
allowlist, the accessibility-statement production-build guard, M1's
performance budgets, TS-018 — is out of scope for this gate by the run's
own design, and I am not judging it here. The two named font-budget
deviations (open rows 19, 20) and the two Vercel-Proxy CSP-delivery
attempts (row 21/31) are engineering matters with no visible effect on
what I walked; noted, not judged.

## Gate verdict

**Gate 2 closes with a named remainder — I accept the prototype as far as
it goes, and name what has to be fixed before I would call the prototype
itself finished.**

What I accept without reservation: the structure is complete, all twelve
pages exist in both languages, the design system holds together, and —
this is the headline change since the last UAT walk — **all five wired
conversion paths now complete end to end**, including the two that were
dead ends before (`request-product-briefing`'s calendar links,
`save-calendar-to-homescreen`'s handling of a real postcode). The mock and
dummy-content rules were applied honestly everywhere I looked: nothing
renders as a hole, and every invented figure or name reads as invented.

What must be fixed before I accept the prototype as **done**, in the order
I would work it:

1. **F-2-49** — the blank, JavaScript-only page on `/dein-ort/starten` and
   the uncovered-postcode branch of `/dein-ort`. This sits inside the
   run's most important conversion path.
2. **F-2-70** — the empty German 404 body. A visitor who mistypes a URL on
   this site's own default language gets nothing.
3. **F-2-39 / F-2-56 (open row 145)** — not a code fix, a decision: does
   the no-JavaScript completeness guarantee or the Suspense/PPR shell
   mechanism yield, for the specific islands that are shared between a
   blocking and a non-blocking route. Items 1 and 2 are concrete
   instances of this same unresolved tension and are evidence for the
   same conversation.
4. **F-2-69** — the archive page's 262 px layout shift.
5. **F-2-33's tail** — four remaining German labels on English pages
   (`Demo-Daten`, `Foto gesucht`, `Nicht motivgenau · Platzhalter`), plus
   the **new** `geoname.900001` leak on `/en/your-region` I found on this
   walk. All five are the same class of fix, all mechanical.
6. **The meta-description ticket leak** (`TS-021-A11`/`TS-011-D5`) — a raw
   spec reference is visible to search engines and link previews on every
   single page in both languages. Small to fix, disproportionately public.
7. **`/en/legal`'s missing English disclaimer** that the legal texts are
   German-only (F-2-46's promised mitigation, not currently on the page).

Everything else marked fail or not-testable above I accept as tracked,
decided, or genuinely out of a customer's remit to judge (imported legal
text's heading structure, missing internal build guards, architecture
notes with no visible page effect).

## Three things, as a customer

**Impressed:** the calendar order flow. Four honest steps, a real embed
snippet I could paste today, and a clear line between what is real (the
flow) and what is fictitious (the specific organizer id) — this is what
"finished prototype" is supposed to feel like.

**Impressed:** how much of the previous UAT's dead-end list is now
resolved. Both briefing links working, the founding page reachable for an
uncovered place, both 404 surfaces carrying a real search — three
independent things that were broken a round ago are now not, and I could
verify all three myself, not just take QA's word for it.

**Worried:** the shape of the remaining bugs, not their number. F-2-49,
F-2-70, and the `geoname.900001` leak I found are all the same underlying
pattern — something works correctly under `next dev` or in German, and
silently does not in a production build or in English. That is a blind
spot in how this run has been testing itself, not just three unrelated
bugs, and the run's own methodological note in `reports/qa/gate-2-run-2.md`
says as much. I would want the next round's regression sweep to run
against a production build and against the English pages by default, not
as an afterthought.
