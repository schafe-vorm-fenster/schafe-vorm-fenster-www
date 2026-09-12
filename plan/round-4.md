# Round 4 — the one short final fix round, and the handover

The last round of the run. `plan/process.md`'s abort criterion is met on
its **first** branch for the first time (`reports/qa/M5-run-1.md`): no
critical and no high finding is open. So this round is not "what is left
to do" — it is a deliberately short, deliberately cheap pass at what a
reviewer or a first-time user trips over first, after which the final
customer acceptance runs and everything still open becomes
`state/open.md`.

Decisions per finding: `state/findings/round-3.md` — all **23** findings
(F-3-1 … F-3-23) carry a `Round decision` and one line of reasoning.
This file is the work split, the dismissals, and the handover.

## Counts

| Severity | fix-now | open-list | total |
| --- | --- | --- | --- |
| critical | 0 | 0 | 0 |
| high | 0 | 0 | 0 |
| medium | 8 | 5 | 13 |
| low | 4 | 6 | 10 |
| **total** | **12** | **11** | **23** |

Nine findings came from the QA sweep (F-3-1 … F-3-9); fourteen are the PM
triage of the four round-3 chaos runs and the M5 UAT walk
(F-3-10 … F-3-23). F-3-2 is split: the `/ueber-uns` half is fix-now, the
`photo-surface` half is open-list, and it is counted once, as fix-now.

The budget is the constraint, not the backlog. `fix-now` means: **one
developer, about an hour per item, and a reviewer or a visitor meets it.**
Everything else carries its reasoning into `state/open.md` — which, at
this point in the run, is not a defeat but the handover document the next
phases are planned from.

## One developer, the whole tree

Rounds 1–3 split the work into three packages with disjoint file
ownership because three developers ran in parallel. This round does not.
**File ownership is the whole tree, one developer**, worked top to bottom
in the order below. There is nobody to conflict with, and the items are
small enough that a package boundary would cost more than it saves.

Commit messages reference the finding id as always
(`fix(scope): … [F-3-<nr>]`), so the retest can walk this round
mechanically.

## The fix-now list, in the order to work it

1. **F-3-10 — the blank band on the place-result pages.** *Verify first.*
   Reproduce it on the local production build (`VERCEL_ENV=preview pnpm
   build && VERCEL_ENV=preview pnpm start`, hash asset removed — rows 147
   and 148) at 360 px on `/dein-ort?ort=07743`, `?ort=10115` and
   `/dein-ort/starten?ort=99999`. Timebox the reproduction at ~15 minutes.
   A reserved-space or empty-module height is this round's to close; row
   145's Suspense/PPR tension is not — in that case write the evidence
   into the finding and stop. First because it is the largest thing a
   visitor sees, and because everything after it is known work.
   `app/[lang]/_islands.tsx`, `app/[lang]/_page-frame.tsx`.
2. **F-3-1 — the logo's accessible name.** Whitespace between the two
   wordmark line spans (or the whole visible string inside the
   `aria-label`), **plus** enabling `label-content-name-mismatch` in
   `e2e/a11y.spec.ts` and making the sweep fail on presence rather than
   impact. Turns TS-002-A1 and TS-029-A12 from `fail` to `pass`.
   `src/components/logo/logo.tsx`, `e2e/a11y.spec.ts`.
3. **F-3-11 — the newsletter mock's native submit.** Intercept the submit
   the way `envoy-form-mount` already does and swap in a `role="status"`
   confirmation; the input keeps its missing `name`. Closes the wipe, the
   flow-state reset and the missing feedback in one change.
   `src/components/newsletter-block/newsletter-block.tsx`.
4. **F-3-13 — the asset-extension 404 shell, and ship a favicon.** Two
   halves, one item: stop exempting asset-shaped paths that match no file
   from the `NOT_FOUND_PATH` rewrite, and add `app/icon.*` from
   `@schafe-vorm-fenster/brand-design` (`./logo.svg` / `./logo.png`). The
   brand file is the real asset, so no `Demo-Daten` badge and no
   `Dummy-Content` row — the mock and dummy-content rules do not apply to
   the brand owner's own logo. `src/lib/routes/not-found-routing.ts`,
   `src/lib/routes/landing-domain.ts`, `app/icon.*`.
5. **F-3-12 — the double-click that drops the postcode.** Guard the
   shared submit path against a second submit inside the same navigation.
   `src/components/search-field/search-field.tsx`.
6. **F-3-14 — the registration search's missing feedback.** Reuse the
   empty state `/dein-ort` already renders for the same input.
   `app/[lang]/mitmachen/registrieren/**`.
7. **F-3-2 (the `/ueber-uns` half) — `priority` on the declared LCP
   image.** One prop. Name the half in the commit message; the
   `photo-surface` half is explicitly not in this round.
   `src/components/media-frame/*`.
8. **F-3-5 — the founder photo's German `alt` on the English pages.** One
   string. `content/pages/ueber-uns/en.md`.
9. **F-3-15 — "KEIN NACHWEIS" on the English pages.** Two hard-coded
   German defaults and one literal into the dictionary.
   `src/components/empty-proof-slot/`, `src/components/objection-list/`,
   `app/[lang]/ueber-uns/page.tsx`.
10. **F-3-8 — `/_vercel/**` as a reserved prefix.** Three strings.
    `src/lib/routes/not-found-routing.ts`.
11. **F-3-9 — the silent catch arm on the place hop.** One log line, plus
    the test that makes `placeHop` throw. `proxy.ts`.
12. **F-3-16 — the true 404's skip link.** Last, and **only if it stays
    cheap**: the anchor and a target id inside `app/global-not-found.tsx`,
    without pulling `SiteChrome` into a file that bypasses it on purpose.
    If it costs more, stop and move it to the open list.

## Dismissed — one line each

Every chaos observation and UAT signal that becomes neither a finding nor
a work package, per `.agents/roles/project-manager.md`.

| Signal | Decision |
| --- | --- |
| C3-A-05 — the ambiguous-postcode picker is not reachable from the live search | **Not a defect** — the fixture's ambiguous zip resolves through to one place; the multi-candidate picker has no naturally-occurring fixture and the repository says so itself. A coverage note for the geo-api hardening (row 77), not a defect. |
| C3-A-06 — the language-suggestion prompt does not exist | **Not a defect** — `proxy.ts` computes the signal and exposes it as a `Server-Timing` header; the client banner is Q-011, deferred by decision. Absence of an unbuilt feature is not a finding. |
| C-A-06 — quote-form data lost across a DE→EN→DE switch | **Already settled** — `plan/round-3.md` decided it: nothing is stored between page views, and TS-001-A7 asks for the route context, which is preserved. |
| C3-B-3 — repeated `?ort=` collapses to the first value | **Not a defect** — first-value-wins is ordinary query-string semantics and `place-hop.ts` documents it. Erroring on a repeat would be a new rule nobody asked for. |
| C3-B-4 — the whole BFF answers `"demo":true` | **Not a defect — a scope note** — `state/open.md` row 77: no geo-api or events-api read token exists in any environment. The gate should know the round's `/api/*` probing never touched a real upstream error path; that is row 77's to close, not a fix round's. |
| C3-B-5 — `/start` 302s to a Google Form | **Specified** — TS-004 D1's one redirect-only row and TS-016 D6's lead fallback; `app/start/route.ts` documents why it is a 302 (the target swaps when the envoy widget lands) and why it carries `noindex`. |
| C-B-5 — a foreign ZIP ("1010") is accepted | **Not a defect** — no spec asks for a country check, and the value resolves to the founding page like any other uncovered input. Feature request, not defect. |
| C-B-6 — `/en/dein-ort` answers 200 | **Already open-list** — F-2-8, same reasoning as F-3-6: canonical and sitemap are correct, one row in `localeRedirects()` whenever a review wants it. |
| C-B-15 — `test%00@example.com` passes the email field | **Not a defect** — HTML5 treats `%00` as literal local-part text, and nothing is sent anywhere (envoy is a mock, row 7). Re-decide against the real widget's contract. |
| C3-H-4 — the two-tab interleave now fires 0 events, not 2 | **Not a defect — a coverage note** — both tabs tripped the new timing guard; tab isolation itself held with no field bleed. The original "one event per tab" result wants re-driving past the guard window, which is a QA method note, not a finding. |
| C3-K-3 — tab-stop counts identical at 360 and 1280 on every route | **Clean pass** — recorded so the round knows what was tried and found sound. |
| C3-K-4 — a consistent, visible 3 px focus ring everywhere, ~700 stops | **Clean pass** — including the `:focus-within`-on-wrapper pattern, which a future check must account for or it will misreport it. |
| UAT — the nav label "WAS IST LOS" says nothing about searching | **Already settled** — `plan/round-3.md`: TS-004 D4 fixes the navigation labels; changing them is a concept decision. |
| UAT — "Heute gegen mit dem Produkt" reads like a dropped word | **Already open-list** — an editorial slip below the finding bar, visitor-visible on a conversion page; content follow-up workstream. |
| UAT — "1 Orte ausgewählt" / "1 places selected" | **Already open-list** — F-2-53. It looks like a string but is a plural rule in the dictionary; the round's hour is committed elsewhere, and the content review touches every one of these strings anyway. |
| UAT — order step 1 needs a second click to add the found place | **Already settled** — TS-025's scope picker selects several places, so an explicit add is specified. UX-polish row. |
| UAT — the embed snippet's `demo-organizer-bestellen` id | **Already settled** — a `Demo-Daten` badge renders beside the snippet, so the mock-labelling guardrail holds; the minting itself is rows 2 and 129. |
| UAT — "DEMO-DATEN" above a question about her own real club | **Already settled** — the mock rule requires the badge; the discomfort is the honest cost of a mocked flow. Copy-tone item for the content workstream. |
| UAT — the English registration hands over to `…/registrieren` | **Already settled** — the app is a separate system outside this repository; recorded as a cross-system note (row 125). |
| UAT — event titles are still German on the English pages | **Dummy-Content** — the event rows are German demo fixtures (rows 90, 91); translating fixture data would make the mock look more real than it is. Content follow-up, with the real events. |
| UAT — "NICHT MOTIVGENAU · PLATZHALTER" and the ghost "Ortsansicht" mean nothing to a visitor | **Not a defect** — the dummy-content rule requires the label; that a visitor cannot parse it is a wording question for the content review, and the ghost text disappears with the real photo. |
| UAT — no loading state was observed on the live modules | **Not observable** — screenshots were taken after the page settled; UAT records it as "no observation either way". Nothing to decide. |
| UAT/chaos — the `vercel.live` CSP console error on the preview | **Already open-list** — F-2-27, preview-only by decision; the site's own strict CSP working as intended. |

## Say it out loud at the acceptance

`plan/project-plan.md` makes the final customer acceptance the prototype
milestone. These are not defects this round can close and not things the
preview shows, so they must be **said**, not discovered later. The
acceptance protocol names each one.

1. **Row 132 — the one real go-live blocker, and it is invisible on the
   preview.** A hash-only CSP cannot cover Next's request-time flight
   payload, so the four dynamic routes ship **unhydrated in production**.
   The prototype runs on a preview, where `'unsafe-inline'` applies and
   everything hydrates. It needs a DEC-045 amendment (a nonce), not a fix
   round. Rows 139, 147 and 148 are its consequences and travel with it.
2. **Row 145 — the Suspense/PPR shell was deliberately not shipped
   broken.** F-2-39 and F-2-56, three failing criteria (TS-005-A9,
   TS-009-A3, TS-009-A9): a genuine architectural tension between
   TS-009's shell and this site's no-JavaScript completeness guarantee,
   with row 131 beside it. The round was right to leave it. It needs the
   rendering-and-resilience spec owner.
3. **F-2-42 — no OG image on any page, in either language.** The largest
   remaining gap that is neither a decision nor a mock: every share of
   every page is a bare link today (TS-011-A8, TS-011-A9).
4. **F-3-3 and F-3-4 — named, not quietly fixed.** Mobile Lighthouse 96
   and 97 against D7's 98 floor on two of five routes, and `Save-Data: on`
   saving 0 %. Both belong to the performance owner after the prototype;
   QA asked explicitly that they be stated at the acceptance rather than
   papered over.
5. **Two systems answer from mocks, by decision, labelled in both
   languages** — the envoy widget, the newsletter, the geo-api and
   events-api reads, the `organizerId` minting and the registration
   handover. Every one has a `Mock aktiv` row; this run verified the
   labelling in DE and EN.

# After the prototype — the handover

`plan/project-plan.md` ends the run at the acceptance and puts a
**deliberate manual break** after it: the next phases are planned with
Jan, not by this run. What follows fills the plan's four workstreams with
the concrete `state/open.md` rows this run produced, so the planning
session starts from rows and not from a blank page.

## 1 — Content follow-up

Replace every `Dummy-Content` row with real, sourced content.

- **Rows: 17, 18, 19, 20, 21, 44, 46, 47, 48, 49, 50, 51, 52, 69, 92, 93,
  94, 95, 107, 109** — twenty rows.
- The gating dependencies are external, not editorial: **Q-045** (0/32
  media-echo entries carry `usage_rights`, so the archive and every proof
  pool render dummy rows — rows 1, 46, 49, 50, 51, 52), **Q-014** (all
  candidate testimonials `unverified` — rows 47, 48, 51), **the app's
  account model** (row 18's step-2 vocabulary), and **an owner for the
  two-working-day promise** (row 20 / C11, withheld rather than invented).
- Row 21 is the one with a deadline attached: the accessibility statement
  on `/rechtliches` has no source document at all and ships as a generic
  BFSG placeholder **flagged for legal counsel before any production
  build**.
- Row 69 is the structural half: the content artifacts carry no relevance
  facets (`geo`, `job_relation`, `editorial_weight`, `clearance`), which
  is why F-2-43's guards have no inputs.
- Riding along from this round: the German event titles on the English
  pages (fixture data, rows 90/91) and the `/dein-ort` S0 copy gap
  (row 93).

## 2 — Content review and tone sharpening

An editorial pass over all copy against the tone of voice and the
communication principles, and the one place where the run's own
guardrails collided with what a visitor understands.

- **F-2-53** — "1 Orte ausgewählt" / "1 places selected"; a plural rule,
  not a string.
- The `/dein-kalender` headline **"Heute gegen mit dem Produkt"** — an
  editorial slip below the finding bar, visitor-visible on a conversion
  page.
- The **wording of the mock and placeholder labels**: "DEMO-DATEN" above
  a question about the visitor's own real club, and "NICHT MOTIVGENAU ·
  PLATZHALTER" over a hero photo. The guardrails require the labels; UAT
  says a visitor cannot parse them. Both survive this run deliberately —
  what changes is how they read, not whether they are there.
- **F-3-17's wording** — "Das ging sehr schnell." reads to an honest
  visitor as an accusation.
- Rows 25, 26 and the `[PROPOSED]` copy carried in the page specs.

## 3 — Usability and feature feedback

Human reviews and user tests on the prototype, fed back as change
requests. This round's open-list findings are the starting set, because
each one is a judgement call rather than a defect.

- **F-3-18, F-3-19, F-3-23** — all three on order step 3: a reload that
  swallows the step, empty invoice fields that pass, and a single
  progress signal. Whoever takes that step takes all three.
- **F-3-17** — the spam guard's silent retry.
- **F-3-20** — the footer's column-major tab order at ≥768 px.
- **F-3-21** — Back-button recovery that works on one form and not the
  other.
- **F-3-22** — 22 px of residual desktop layout shift.
- **F-3-16** if it did not make the round's hour.
- Carried UAT signals that are settled-but-noted: the "WAS IST LOS" nav
  label, order step 1's two clicks to add a place, and F-2-8 / F-3-6's
  duplicate URL spellings.

## 4 — Finish the mocks, and harden

Every `Mock aktiv` row against the real systems, plus the clearances —
and only then production.

- **`Mock aktiv` rows: 1, 2, 5, 6, 7, 8, 22, 70, 77, 78, 79, 90, 91, 125,
  129, 136** — sixteen rows. Row 77 (no geo-api or events-api read token
  in any environment) is the keystone: `LIVE_DATA=auto` switches each
  capability to its real client the moment a token is provisioned, with
  no code change, so most of the others move with it.
- **Row 132 — the go-live blocker.** The DEC-045 amendment (nonce-based
  `script-src`) that lets a dynamic route hydrate in production. Rows 139,
  147 and 148 close with it, and rows 147/148 also owe `plan/process.md`
  and `CONTRIBUTING.md` the local production-build command
  (`VERCEL_ENV=preview`, hash asset removed).
- **F-3-7 / row 150** — the proxy resolves `?ort=` upstream per request,
  uncached, in front of the cache, and the page resolves it again; no
  rate limit exists anywhere. Latent while row 77 is open, real the day
  the token lands — the same day. These two are one piece of work.
- **Rows 142, 143/152, 151, 153, 154** — the dark-theme status tokens
  (brand package), `check:terms` into the `check` chain, `lang="de"` on
  the German legal bodies, the closed `ASSET_EXTENSIONS` list, and the
  `ReservedChipRow` class copy.
- **Jan's two dashboard items** — neither has an API and neither can be
  done from this repository:
  - **Row 22** — Q-020, the newsletter's sending system, is undecided.
    Until it is answered the block stays a labelled mock that sends
    nothing. Decision: envoy/ops, with Jan.
  - **Row 64** — CI cannot install the private packages: `pnpm install`
    fails with `ERR_PNPM_FETCH_403` on every `@schafe-vorm-fenster/*`
    package, because GitHub Packages requires each **publishing**
    repository to grant this repository's Actions access from its own
    settings page. Dashboard-only, no REST or `gh` endpoint exists. Jan,
    as org owner, for each of the eleven consumed packages:
    `brand-design`, `audiences`, `brand-identity`, `goals`, `media-echo`,
    `messaging`, `offerings`, `partners`, `people`, `posts`, `proof`.
