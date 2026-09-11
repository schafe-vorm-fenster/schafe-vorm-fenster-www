# Round 3 — the last fix round before the abort criterion

Round 3 of the gate-2 loop. `plan/process.md`'s abort criterion ends the
loop after **three rounds** whether or not anything is still open, so
whatever is not fixed here goes to `state/open.md` at gate close. That is
why this round buys defects and not instruments where the two compete.

Decisions per finding: `state/findings/round-2.md` (every finding
F-1-2, F-2-1…F-2-68 carries a `Round decision` line with one line of
reasoning). This file is the work split.

## Counts

| Severity | fix-now | open-list | already resolved in round 2 |
| --- | --- | --- | --- |
| critical | 1 | 0 | 0 |
| high | 15 | 0 | 3 |
| medium | 16 | 22 | 4 |
| low | 0 | 7 | 1 (F-1-2, severity not set) |
| **total** | **32** | **29** | **8** |

No critical and no high finding goes to the open list this round: none is
externally blocked and none contradicts a concept document. Every
open-list entry is a medium or a low, and each names its reason —
spec-against-spec (F-2-10, F-2-23, F-2-37, F-2-52), an external blocker
(F-2-15, F-2-16, F-2-19, F-2-46, F-2-47), a marked `[PROPOSED]` design
choice (F-2-9, F-2-11), or a cost that does not fit a last round
(F-2-42, F-2-58).

One escalation to record: **F-2-31** is filed high, and the finding itself
delegates the call. `plan/gate-2-scope.md` §2 counts the 404 place search
as part of the `save-calendar-to-homescreen` walk, so the PM reads it as a
conversion-path AC failure — critical by `plan/process.md`'s table. The
severity line stays as QA wrote it (the PM does not rewrite a measured
field); the priority is critical and it leads package A after F-2-30.

## Three packages, disjoint file ownership

The three run in parallel. Ownership is by **file**, not by topic — where
a topic crosses a file boundary, the file decides and the finding says so.

| | Package A — conversion paths and flows | Package B — components and rendering | Package C — platform |
| --- | --- | --- | --- |
| **Owns** | `app/**` except the four files named under B · `src/lib/pages/**` · `src/lib/live/places.ts`, `briefing.ts`, `mocks/**` · `src/lib/i18n/**` · body copy in `content/pages/**` and `content/legal/**` · `src/components/{envoy-form-mount,conversion-tracker,search-field,newsletter-block,logo}/**` | `src/components/**` except A's five carve-outs · `app/styles/**` · `app/[lang]/_page-frame.tsx` · `app/[lang]/_islands.tsx` · `app/[lang]/_proof.ts` | `proxy.ts` · `src/lib/security/**` · `src/lib/content/**` · `src/domain/content-frontmatter.schema.ts` · `src/lib/routes/**` · `scripts/**` · `app/api/**` and new top-level machine routes (`app/start/`, `app/llms.txt/`) · the `status:` frontmatter key in content files · `e2e/routes.spec.ts`, `e2e/smoke.spec.ts`, `src/lib/routes/routing.integration.test.ts` |
| **Findings** | 20 | 6 | 6 |

Three deliberate carve-outs, so nobody has to negotiate mid-round:

1. **`src/components/{envoy-form-mount,conversion-tracker,search-field,newsletter-block,logo}` belong to A, not B.** Five findings on the quote and order flows live in `envoy-form-mount` alone, and F-2-33 / F-2-35 / F-2-64 are three defects inside one footer block. Splitting them would put two developers in one file.
2. **`app/[lang]/_page-frame.tsx`, `_islands.tsx`, `_proof.ts` and `app/styles/**` belong to B, not A.** The Suspense boundaries go where the islands are declared — one file — so the page bodies A is editing do not change at all.
3. **The three test files named for C belong to C alone.** A fixes the 404 body (F-2-31); C strengthens the TS-004-A4 assertion that currently passes on a placeholder (F-2-55). Same round, different files, no conflict — A must not touch them.

`content/pages/**` is shared at file level but not at line level: C touches
only the `status:` frontmatter key, A owns every body-copy line. If a
rebase conflicts there, A's body edits win and C re-applies its one-line
frontmatter change.

---

## Package A — conversion paths and flows

20 findings. Work them in the order below; the first eleven are the gate.

**Critical**

- **F-2-30** — the uncovered-place branch never fires; `/` ignores `?ort=` entirely. The founding path has no entry. Wire the existing `outcome.kind === "uncovered"` through `resolveLiveAnchor`; the stale `test.skip`s come with it.

**High** (F-2-31 leads — see the escalation note above)

- **F-2-31** — the 404 ships a developer note as body copy and carries neither place search nor jobs band.
- **F-2-32** — `request-product-briefing` dead-ends on all its placements; two pages paste a second placeholder URL against TS-016 D7. The real booking URL is in the installed `@schafe-vorm-fenster/people` package.
- **F-2-33** — German UI strings, including the primary buttons, in the English register and quote flows and in the footer block on every `/en` route. The logo's German accessible name is folded in here.
- **F-2-34** — `{county-or-organization}` renders as a literal in the English quote page's `h1`.
- **F-2-35** — `Q-020`, `DEC-027`, `TS-007 D12` and friends rendered as visitor copy on 24/24 routes.
- **F-2-60** — `buy-calendar-licence` fires a second time on client-side forward navigation (reproduced on the preview as C-H-6).
- **F-2-61** — `/dein-ort`'s empty state switches neither the primary CTA nor position 2, and leaks raw markdown.
- **F-2-62** — entering registration from `/dein-ort/starten` skips step 1; the place is neither shown nor changeable. Must land with F-2-30.
- **F-2-65** — `request-licence-quote` fires twice from one rapid double-click on "Absenden" (C-H-7).
- **F-2-66** — the quote form gives no success feedback at all after a submission (C-H-10 + UAT).

**Medium**

- **F-2-38** — two pages read `?ort=` raw, bypassing the validator; no input has a length bound.
- **F-2-48** — S2's quote mount is missing on `/deine-region`; no lead form has a honeypot or a timing gate.
- **F-2-49** — `/dein-ort/starten` never re-resolves and echoes the raw parameter as the place name. Fixes with F-2-30.
- **F-2-50** — `/deine-region`'s manifest declares one live module where D1 names four, and is the only manifest with no `page.meta.test.ts`.
- **F-2-51** — order step 3 offers two calls to action, one of them inert.
- **F-2-57** — three claims ship without the confirmation their criteria make a precondition; two of the criteria prescribe removing the claim, which the run can do.
- **F-2-63** — `/deine-region` asserts a county at stage 0 and names it `geoname.900001`.
- **F-2-64** — the newsletter consent line links `/en/legal#datenschutz`, an anchor the English page does not have.
- **F-2-67** — reloading immediately after "Weiter" on order step 3 silently swallows the advance (C-H-9).

## Package B — components and rendering

6 findings, heavier per item than A's: two of them are one rendering
change.

**High**

- **F-2-39** — no island renders a skeleton; there is no `<Suspense>` boundary anywhere, and `moduleSkeleton` is written and never called.
- **F-2-59** — the archive filter updates its count but hides no rows; the accessible result and the visual result disagree.
- **F-2-68** — controls in the footer region move up to 174 px between first paint and settle on `/` (C-H-12). Same reserved-space work as F-2-39, plus the font-swap reflow in `app/styles/**`.

**Medium**

- **F-2-41** — the context band is a `section` inside `main` rather than an `aside`, and is absent on four pages.
- **F-2-44** — 11 px and 12 px type below TS-002-A10's 15 px floor, plus a bare `28px`. Only the a11y half is in this round.
- **F-2-56** — no route is partially prerendered. Closes with F-2-39 on the eight routes that prerender.

## Package C — platform

6 findings.

**High**

- **F-2-36** — `proxy.ts` sends the Vercel automation bypass secret to a Host-header-controlled origin, caches the answer process-wide and interpolates the returned strings into `script-src` unvalidated. Three cheap defences plus the tests this zero-test module lacks.
- **F-2-40** — every content artefact is `status: draft` and every one renders. Build the gate; F-2-46's non-strict-Zod clause rides here. Which artefacts become `approved` stays Jan's clearance decision on the open list.

**Medium**

- **F-2-1** — `pnpm check` regression sweep on `next-2026` HEAD once the round's three packages have landed, per the decision already recorded in round 2. C runs it; it is not a file-by-file chase.
- **F-2-43** — six declared build guards do not exist. Build the three whose inputs exist today (TS-002-A3, TS-011-A7, TS-026-A8); the other three stay blocked on spec decisions.
- **F-2-45** — the landing-only domain rule is not implemented; `kind: "landing"` has no consumer.
- **F-2-55** — `/start` and `/llms.txt` do not exist, and the criteria that guard them assert against the route registry instead of against D1. This is the "tests that assert too little" strand: TS-004-A1, A4 and A5.

---

## Settled by the wiring wave — do not re-open

These are recorded decisions on `state/open.md`, not open questions. A
developer who "fixes" them is fighting a settled reading and will be
reverted.

| Row | What it settles | Touches |
| --- | --- | --- |
| **131** | `/dein-ort`, `/dein-ort/starten`, `/mitmachen/registrieren` and `/dein-kalender/bestellen` are dynamic (ƒ) **by decision** — each reads a request value that *is* the page. Eight of twelve routes prerender. Do not force a shell onto the four; TS-020-A10 forbids a skeleton on `/dein-ort` by name | F-2-39, F-2-56 (package B) |
| **132** | A dynamic route cannot hydrate under DEC-045's hash-only CSP. Choosing a nonce is a DEC-045 amendment owned **outside** this run, and it is flagged for Jan | F-2-39, F-2-56 (B), F-2-36 (C) |
| **139** | TS-023-A9/A10 and TS-025-A11 fail against a local production build and pass in dev and on preview — row 132's unhydrated page, not a wiring defect. Do not re-wire the events chasing it | F-2-60, F-2-65 (package A) |
| **130** | The conversion events are wired and resolve `wired: true`; `getAnalyticsTracker()` always returns the mock by decision. The double-fire findings are about the trigger contract, not about the adapter | F-2-60, F-2-65 (A) |
| **133** | The two axe contrast violations are resolved (F-2-28/F-2-29, `7da518f`). 49/49 green. Do not re-touch `outbound-link` or `proof-card` for contrast | package B |
| **103, 138** | Titles and meta descriptions still come from the M2 placeholders; closing TS-011 D5 needs a schema field plus twelve content files in both languages, and is the content pipeline's, not a fix round's | F-2-43's TS-011-A7 guard (C) measures what exists; it does not move the source |
| **136, 137** | The stage-0 anchor and `/mitmachen`'s example place are configured mocks that swap with a geo-api read token. Not defects | F-2-30, F-2-49, F-2-63 (A) — fix the branch logic, not the anchor's source |
| **7, 22, 129, 125** | The envoy widget, the newsletter, the `organizerId` minting and the registration handover target are declared `Mock aktiv`. The mock rule requires a labelled, working mock — which is why F-2-66 is a defect and the `Demo-Daten` badge is not | F-2-48, F-2-65, F-2-66 (A) |

## UAT and chaos signals decided as non-defects

`.agents/roles/project-manager.md` requires each UAT signal to become a
finding, a work package, or an open-list row with one line of reasoning.
These are the ones that become none of the three.

| Signal | Decision |
| --- | --- |
| Registration and order flows restart at step 1 on a fresh session; invoice details are lost (C-A-04, C-A-05) | **Not a defect** — TS-023-A2/A3 and TS-025 D8 fix this as the intended behaviour: the step is in the URL and nothing is stored between page views, which the order page says in its own copy. |
| Form data lost across a language switch (C-A-06) | **Not a defect** — same rule; the route context is preserved, which is what TS-001-A7 asks for. |
| `DEMO-DATEN` on a question about the visitor's own real club made her doubt the form | **Not a defect** — the mock rule requires the badge; the discomfort is the honest cost of shipping a mocked flow. A copy-tone item for the content workstream, not a finding. |
| The English registration hands over to `app.schafe-vorm-fenster.de/registrieren` (German path segment) | **Not a defect here** — the app is a separate system outside this repository's scope. Recorded as a cross-system note for the app owner. |
| The nav label "WAS IST LOS" does not say "search for your town here" | **Not a defect** — TS-004 D4 fixes the navigation labels; changing them is a concept decision, not a fix round's. |
| The step-4 embed snippet carries `demo-organizer-bestellen` "without signal" | **Not a defect** — a `Demo-Daten` badge does render beside the snippet, so the mock-labelling guardrail holds. The `organizerId` mock is `state/open.md` row 129 by decision. The false email promise beside it is F-2-54 (low, open list). |
| "Weiter" on order step 3 "did nothing" | **Corrected, not a defect** — "Weiter" does navigate; QA re-measured it. The inert "Absenden" next to it is the real defect and is F-2-51. |
| `/dein-kalender`'s headline "Heute gegen mit dem Produkt" reads like a dropped word | **Not a finding — open-list row.** An editorial slip below the finding bar, but visitor-visible on a conversion page; it goes to the content follow-up workstream rather than into a round-3 package. |
| Order step 1: the search result and "add this place" are two separate clicks | **Not a finding — open-list row.** TS-025's scope picker selects several places, so an explicit add is specified; that a first-time visitor expected the search itself to add is a UX-polish row for the M5 budget. |
| `registrieren` commits via `?ort=` where `bestellen` uses `?orte=` plus a chip (C-H-13) | **Not a defect** — two flows, two specs: TS-023 registers one place, TS-025 selects several. The asymmetry is specified. |
| Double-click on the bestellen completion link fires once (C-H-8); two tabs submit once each (C-H-11); the language switch double-clicks cleanly (C-H-14); navigating away mid-search leaves no stale state (C-H-15) | **Clean passes** — recorded so the round knows what was tried and found sound. |
| The eight console errors in the chaos roam (C-H-16) | **Already filed** — all identical, all the known `vercel.live` preview CSP block, F-2-27 (open list, preview-only by decision). |
