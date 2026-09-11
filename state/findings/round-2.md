# Findings — Round 2 (M4 CI)

## F-2-1 — `pnpm build` fails typecheck on `src/lib/live/last-good.ts` (implicit `any`)

- Severity: medium
- Source: ci
- Where: `src/lib/live/last-good.ts:69` (untracked at the time of this
  finding — no commit touches this file yet on `next-2026`)
- Steps: On `next-2026`, run `pnpm build` (or `pnpm typecheck`). Next.js's
  build-time type check fails:
  ```
  src/lib/live/last-good.ts(69,60): error TS7031: Binding element
  'ttlSeconds' implicitly has an 'any' type.
  src/lib/live/last-good.ts(69,72): error TS7031: Binding element
  'tags' implicitly has an 'any' type.
  ```
  The destructured parameter `{ ttlSeconds, tags }` on the `write<T>`
  method has no type annotation; the file elsewhere types the same
  shape inline (`options: { readonly ttlSeconds: number; readonly
  tags?: readonly string[] }` on a sibling function, line 38) but that
  type is not reused/applied here.
- Expected: `pnpm build` (and `pnpm check`'s `typecheck` step) exits 0
  under the repo's `"strict": true` `tsconfig.json` — this is exactly
  what M4's `check.yml` runs on every push/PR to `next-2026`.
- Observed: build red on `next-2026` HEAD (`bce229b` at the time of this
  finding) purely from this one file; unrelated to the CI work package's
  own changes (`.github/workflows/**`, `README.md`, `CONTRIBUTING.md`,
  `playwright.config.ts`).
- Round decision: **fix-now** — decided in the triage entry for F-2-1 below
  (regression sweep on `next-2026` HEAD, not a file-by-file chase).
- Note: found while dry-running M4's `check.yml` build step locally, not
  by the persona this file's format was originally written for (QA) —
  filed as instructed for a CI-discovered issue outside the CI work
  package's own ownership scope. Not fixed here (`src/lib/live/**` is
  outside `.github/workflows/**` / `README.md` / `CONTRIBUTING.md` /
  `playwright.config.ts`, this work package's owned paths).
- Update (same round, ~10 min later): `next-2026`'s build is a moving
  target under the concurrent agents in this run. A push minutes later
  (`b4163fa`) triggered a real Vercel deployment build
  (`https://schafe-vorm-fenster-eepc12lta-schafe-vorm-fenster.vercel.app`,
  inspected via `vercel inspect --logs`) that failed typecheck on a
  **different** file: `src/components/code-snippet/copy-button.tsx(36,13)`
  — `TS2322`, a `"copy"`/`"check"` icon-name literal not assignable to the
  `lucide-react` icon-name union (consistent with `src/components/icon/`
  being under concurrent edit — `git status` showed it modified). This is
  not the same bug as the `last-good.ts` one above; it demonstrates the
  class of problem (typecheck breaks repo-wide, transiently, as other
  work packages land) rather than pinning blame on one file. Both
  `check.yml`'s `pnpm build` step and Vercel's own build are red for this
  reason whenever it recurs — worth a regression sweep once the parallel
  work packages in this run settle, not a fix chased file-by-file here.

---

## Triage note (Project Manager, 2026-09-11)

Round 2 is the gate-2 round: the run merged the M2/M3/M4 page work into
one build wave, so this gate covers TS-004/006/002/001 (structure),
TS-019–TS-029 (pages), TS-007 (content) and the M4 systems
TS-005/008/009/010/011/012/013/016. The build wave logged its
assumptions, bugs and deviations as rows on `state/open.md` rather than
as findings. This section converts every row that is a **defect or a
spec deviation in the built prototype** into a finding with a severity
and a round decision. Rows that are a decision for Jan, a `Mock aktiv`
register entry, a `Dummy-Content` register entry, or a post-prototype
item stay rows and are listed under "Not converted" at the end.

Findings F-2-2 onward carry `Source: pm-triage` — they were measured by
the build-wave developers and are re-filed here so the fix round and the
retest can walk them mechanically. The source row on `state/open.md`
stays intact; rows turned into `fix-now` findings carry a short
`Triage:` note.

**Deliberately not re-assigned:** a wiring developer is working the whole
`app/` tree in this same run (Cache Components flip, live-data wiring,
relevance selection, analytics mounting, JSON-LD, the duplicate
`page.meta.ts` shape modules, the nearby-module test flake, and rows 102
and 103). Rows 76, 83, 88, 102, 103, 104 and the `layout.tsx`
duplicate-chrome half of row 39 are therefore **not** converted into
findings — they are in flight, and a second assignment would collide.
The gate's QA sweep re-checks their ACs at retest.

## F-1-2 (carry-over from round 1) — no automated guard for TS-014-A1

- Round decision: **fix-now**
- Reasoning: TS-014 D7 demands the check as a machine check ("A1 asserts
  this statically, so the rule fails in CI rather than in review"), and
  `csp.ts` has been edited twice since round 1 — the per-build hash
  mechanism (row 21) and the preview-only `'unsafe-inline'` branch (row
  31). That branch is exactly the kind of edit the guard exists to
  fence: it must stay `environment === "preview"`-only, and today only
  a human reading the file keeps it that way. One
  `scripts/check-csp.ts` wired into `pnpm check` is cheap, and TS-014 is
  inside the M4 security sweep this gate runs.
- Resolved: 574f606

## F-2-1 — `pnpm build` fails typecheck on `next-2026`

- Round decision: **fix-now**
- Reasoning: `plan/guardrails.md` — "nothing enters the pipeline that is
  not green locally". A red typecheck blocks the QA sweep, the preview
  deploy and the e2e suite, i.e. all three gate strands at once. The
  concrete fix is a `pnpm check` regression sweep on `next-2026` HEAD
  once this run's parallel work packages have landed (row 65), not a
  file-by-file chase: both named files may already be fixed by the time
  the fix round starts, and new ones may have appeared.
- Round 3: carried into round 3 as **package C** — C runs the sweep on
  `next-2026` HEAD once the round's three packages have landed
  (`plan/round-3.md`).

## F-2-2 — Hero headline can fall on the light part of the photo surface at 360 px

- Severity: high
- Source: pm-triage (measured, M2/M3 page work package; `state/open.md` row 100)
- Where: `/`, `/dein-ort`, `/dein-ort/starten` at 360 × 640;
  `src/components/photo-surface/photo-surface.module.css`; TS-002
- Steps: Open the three pages at a 360 px viewport. The hero content box
  is taller than the dark band of `photo-surface`'s gradient
  (transparent → 18 %, 0.84 at 55 %), so the first line of the `h1` sits
  over the light part of the image.
- Expected: SRC-014 §Photo surface promises the text/surface contrast by
  construction; TS-002's contrast criteria hold at the reference
  viewports, and the run is mobile-first.
- Observed: At 360 px the contrast holds by luck, not by construction —
  today it is visible because the DEC-068 placeholders are light hatches.
- Round decision: **fix-now**
- Reasoning: a contrast failure on the `h1` of the three entry pages of
  every conversion path, at the smallest reference viewport. The fix is
  a floor on the scrim behind the content box in one component's CSS —
  cheap, and it belongs to the component work package, not to a page.
- Resolved: 4aeb472 — a second, content-anchored scrim in
  `photo-surface.module.css` that grows with the text stack itself
  rather than with a percentage of the box. Measured on `/`, `/dein-ort`,
  `/dein-ort/starten` at 360 and 1280 px: 1.76–3.53:1 (failing) at 360 px
  before, 11.88–15.67:1 after.

## F-2-3 — Two `<nav>` landmarks share the accessible name "Startseite" on every second-level page

- Severity: medium
- Source: pm-triage (`state/open.md` row 119)
- Where: `app/[lang]/_page-frame.tsx`, `src/components/breadcrumb-trail/`,
  `src/components/site-header/`; `/mitmachen/registrieren`,
  `/dein-kalender/bestellen`, `/deine-region/angebot`,
  `/ueber-uns/archiv`, `/dein-ort/starten`
- Steps: Load any second-level page and list the landmarks. `PageFrame`
  passes `label={d.nav.home}` to `BreadcrumbTrail` instead of the
  component's own default `"Seitenpfad"`, and `site-header`'s job nav
  carries `aria-label="Startseite"` as well.
- Expected: TS-002's landmark criteria — landmarks of the same role are
  distinguishable by their accessible name.
- Observed: Two identically named `<nav>` landmarks per page; the e2e
  breadcrumb test already has to disambiguate by text instead of by name.
- Round decision: **fix-now**
- Reasoning: a11y defect on the five second-level pages, three of which
  are conversion pages (register, order, quote). The fix is one prop in
  `_page-frame.tsx`. The keyboard-only chaos persona runs these pages at
  this gate.
- Resolved: 2eeab26 (dictionary key in 4aeb472) — `_page-frame.tsx` now
  passes the breadcrumb `d.nav.breadcrumb` ("Seitenpfad"/"Page path")
  instead of the header nav's own `d.nav.home`.

## F-2-4 — Demo and freshness labels render German on `/en`

- Severity: medium
- Source: pm-triage (`state/open.md` row 101)
- Where: `src/components/{live-module-frame,place-search,proof-card,live-counters,photo-surface,media-frame}`;
  every mocked module on the English tree
- Steps: Open any `/en/…` page carrying a mocked module. The
  `Demo-Daten` badge, `freshness-label`'s `Stand:` / `Beispiel` and
  `place-search`'s default hint appear in German.
  `demo-data-badge` takes a `label` prop; the six modules that mount the
  badge themselves do not forward it.
- Expected: TS-001 — an English page renders in English; the badge is
  part of the page, not an untranslated chrome fragment.
- Observed: German strings inside English pages, including on the
  English conversion pages.
- Round decision: **fix-now**
- Reasoning: user-visible on every English conversion path, and the
  language switch is one of the flows the chaos personas target at this
  gate. Bounded fix: forward the label (or read the dictionary) in six
  components.
- Resolved: 7b4b844 — `live-counters`'s figures no longer format with a
  hard-coded `"de-DE"` locale; `place-search`, `photo-surface`,
  `placeholder-surface`, `placeholder-badge` and `outbound-link` no
  longer carry a hard-coded German default with no `locale` awareness.
  Verified by walking all twelve `/en/*` routes and grepping the
  rendered text for the known German markers. Residue outside
  `src/components/**` ownership (page files that hard-code a value or
  never pass `locale`; `content/legal/**` has no English translation at
  all) is noted in the commit and left for its owning work package.

## F-2-5 — TS-023-A6 has no fixture, so the ambiguous-place branch is not walkable

- Severity: medium
- Source: pm-triage (`state/open.md` row 126)
- Where: `src/lib/live/mocks/geo.ts`,
  `app/[lang]/mitmachen/registrieren/resolve-place.ts`; TS-023-A6
- Steps: Search any postcode on `/mitmachen/registrieren`.
  `mockSearchByZip` answers at most one place per postcode, so a
  municipality with several communities never occurs against the demo
  data.
- Expected: TS-023-A6 — "a search resolving to a municipality with
  several communities does not advance". QA must sweep this AC at this
  gate.
- Observed: The page's handling is built and unit-tested against a
  stubbed multi-suggestion result, but no gate-level walk can reach it.
- Round decision: **fix-now**
- Reasoning: an AC on a conversion path that the gate sweep cannot
  discharge. The fix is one fixture in the shared live-data mock — the
  mock rule already puts demo data there, so this adds no new mechanism.
- Resolved: 2b50928

## F-2-6 — No a11y instrument: axe is not installed, so TS-002-A1 and TS-029-A12 cannot be discharged

- Severity: medium
- Source: pm-triage (`state/open.md` row 115)
- Where: `e2e/`, `package.json`, `stack.allow.json`; TS-002-A1,
  TS-029-A12
- Steps: Look for an axe dependency or an axe sweep in the e2e suite —
  neither exists. `e2e/pages/rechtliches.spec.ts` records A12 as a
  named, skipped test.
- Expected: Both ACs are declared at tool level;
  `plan/project-plan.md` puts tool checks (Lighthouse, axe, bundle
  guard) into the pyramid from M2 on.
- Observed: The gate's whole a11y AC group has no automated instrument;
  a11y is checked only by reading and by the keyboard-only persona.
- Round decision: **fix-now**
- Reasoning: this is the measuring instrument for an AC group the gate
  sweeps across twelve routes, and one of the two gate strands (QA)
  cannot report on it otherwise. Needs a stack-harmony ADR for the
  dependency (`plan/guardrails.md`) plus one e2e sweep over the route
  table — bounded, and it pays for itself immediately at this gate.
- Resolved: 549973f — the sweep found two real violations, filed as
  F-2-28 and F-2-29 below rather than fixed (both in `src/components/**`,
  the wiring work package's ownership this round).

## F-2-7 — An unknown `/en/…` URL gets the German 404 body

- Severity: medium
- Source: pm-triage (`state/open.md` row 37)
- Where: `app/global-not-found.tsx`, `app/[lang]/not-found.tsx`; DEC-073
- Steps: Request any unknown path under `/en/`. The served 404 is
  `global-not-found`, which sits above `[lang]` and has no language
  parameter.
- Expected: TS-001 — an English URL answers in English.
- Observed: German 404 body on English URLs. The localized
  `app/[lang]/not-found.tsx` exists and takes over the moment Next.js
  server-renders an in-tree `notFound()` body, which 16.3.4 does not.
- Round decision: **open-list**
- Reasoning: a framework limitation, measured in `next dev` and
  `next start`, with and without a dynamic root segment. The workaround
  already chosen is the only one that renders a complete document with
  the right status; the alternative is a Next upgrade, which is not this
  gate's work. Boundary-tester territory — QA records it, the row
  carries the decision for Jan (accept, or revisit after an upgrade).

## F-2-8 — `/en/<German segment>` answers 200 alongside the English segment

- Severity: low
- Source: pm-triage (`state/open.md` row 41)
- Where: `app/[lang]/…` (the App Router tree uses the German segments),
  `src/lib/routes/`; TS-004 D2
- Steps: `GET /en/dein-ort` → 200, same page as `/en/your-place`.
- Expected: TS-004 D2's localized segment is the page's one public URL.
- Observed: Both forms resolve; the canonical and the sitemap name only
  the English form.
- Round decision: **open-list**
- Reasoning: no indexing or user harm — canonical and sitemap are
  correct. A 301 is one row in `localeRedirects()` whenever a review
  wants the duplicate gone; not worth a fix-round slot before the gate.

## F-2-9 — The header's four job labels scroll horizontally below the lg switch point

- Severity: medium
- Source: pm-triage (`state/open.md` row 35)
- Where: `src/components/site-header/`; TS-004 D4, TS-017 D2(d),
  SRC-014 (silent on a phone form)
- Steps: Load any page below 768 px. The four job labels sit in a
  horizontally scrollable row.
- Expected: The design system specifies no phone form for the header;
  TS-017 D2(d) forbids a second component tree, which rules out a menu
  behind a button.
- Observed: One tree at every width, labels scrollable, marked
  `[PROPOSED]` in the component.
- Round decision: **open-list**
- Reasoning: a deliberate, marked design decision taken under a silent
  spec, not a defect. The PM does not overrule a `[PROPOSED]` design
  choice; it belongs to the customer acceptance at this gate, which is
  where `plan/gate-2-scope.md` puts it.

## F-2-10 — The context band is suppressed on registration steps 2–3

- Severity: medium
- Source: pm-triage (`state/open.md` row 24, first numbering block)
- Where: `app/[lang]/mitmachen/registrieren/`; TS-023 D7 vs TS-006 D5 /
  TS-006-A6
- Steps: Walk `/mitmachen/registrieren` steps 2 and 3 — no context band.
- Expected: TS-006-A6 requires the band on every page; TS-023 D7
  suppresses it on steps 2–3.
- Observed: The page follows the page-level spec; TS-006-A6 fails on
  those two states.
- Round decision: **open-list**
- Reasoning: spec against spec, not code against spec. The run's rule is
  that the more specific page spec binds and the deviation is recorded
  rather than silently passed; resolving the contradiction is a spec
  session, not a fix. QA records TS-006-A6 as failing on exactly these
  two states so the gate report stays honest.

## F-2-11 — A third closing-block shape beyond TS-006 D6's two

- Severity: medium
- Source: pm-triage (`state/open.md` row 98)
- Where: `app/[lang]/_page-frame.tsx` `ClosingBlock`; TS-006 D6
- Steps: Read `ClosingBlock` against D6's two named shapes.
- Expected: TS-006 D6 names two shapes — the goal's CTA repeated, or the
  merged three-job offer.
- Observed: A third, `[PROPOSED]` shape ships for states whose primary
  CTA neither fits.
- Round decision: **open-list**
- Reasoning: an unspecified shape is exactly what `plan/guardrails.md`
  routes to the open list, and it is marked `[PROPOSED]` rather than
  passed off as specified. Decided at the design review inside the
  customer acceptance, not in a fix round.

## F-2-12 — The chrome seam sits one level below the layout

- Severity: low
- Source: pm-triage (`state/open.md` row 97)
- Where: `app/[lang]/layout.tsx`, `app/[lang]/_page-frame.tsx`;
  TS-006 D2
- Steps: Read where the context band and the closing CTA are rendered.
- Expected: TS-006 D2 wants both "rendered by the shared layout from
  `page.meta.ts`".
- Observed: `PageFrame` renders them, one level below the layout; the
  observable result per page is the same.
- Round decision: **open-list**
- Reasoning: structural deviation with no user-visible effect, and the
  layout/PageFrame seam is being touched right now by the in-flight
  chrome and page-meta work. Re-read at retest rather than re-opened in
  a parallel fix.

## F-2-13 — `/dein-ort/starten` is a dynamic route against TS-021 D10

- Severity: medium
- Source: pm-triage (`state/open.md` row 99)
- Where: `app/[lang]/dein-ort/starten/page.tsx`; TS-021 D10, TS-021-A2,
  TS-009
- Steps: The page awaits `searchParams`, so Next.js renders it per
  request.
- Expected: TS-021 D10 wants a static shell with `?ort=` resolved
  outside the cache boundary, while TS-021-A2 requires the `h1` to carry
  the searched place with JavaScript disabled.
- Observed: The AC won; the route is dynamic.
- Round decision: **open-list**
- Reasoning: the fix is one `Suspense` boundary once `use cache`/PPR is
  available, and the Cache Components flip is in flight in this same run
  (row 76). Assigning it now would collide. QA re-checks TS-021-A2 and
  TS-009-A1 together at retest.

## F-2-14 — Personalization stage 2 never fires in the running app

- Severity: medium
- Source: pm-triage (`state/open.md` row 71)
- Where: `proxy.ts`, `composeViewerContext()`; TS-010 D2/D3/D6
- Steps: Request any page with a press referrer or a platform geo
  header — nothing hands `Referer`, the geo headers or `Sec-GPC`/`DNT`
  to a page, so every request stays stage 0.
- Expected: TS-010 D2/D3/D6 — stage 2 fires on a recognized referrer.
- Observed: The logic and its tests are complete;
  `composeViewerContext()` takes the signals as arguments and nothing
  passes them.
- Round decision: **open-list**
- Reasoning: TS-010 D8 makes stage 0 a complete site, so no visitor sees
  a broken page — this is an unwired capability, not a defect on a
  conversion path. The plumbing is proxy work in the same files the
  in-flight wiring wave is editing; it is scheduled behind that wave,
  and the gate sweeps TS-010's stage-0/stage-1 ACs.

## F-2-15 — The Portalize embed demo (TS-008 D6, position 1′) is not wired

- Severity: medium
- Source: pm-triage (`state/open.md` row 82)
- Where: `/dein-kalender`; `embed-frame`; TS-008 D6, TS-008-A8,
  TS-008-A12
- Steps: Open `/dein-kalender` — the `embed-frame` shell exists and takes
  an `organizerId`; the loader `<script>` is not mounted.
- Expected: TS-008 D6 composes the embed demo at position 1′.
- Observed: Not built.
- Round decision: **open-list**
- Reasoning: gated outside the run. TS-008-A12 requires written
  confirmation that the embed sets no cookie, and the place-filter
  parameter is Q-026 — both are third-party answers (row 7, envoy /
  Portalize). Building the loader before that confirmation would put an
  uncleared third-party script on the same page that carries the
  no-cookie trust claim.

## F-2-16 — TS-009-A12's snapshot regeneration build step does not exist

- Severity: medium
- Source: pm-triage (`state/open.md` row 79)
- Where: `src/generated/snapshots/`; TS-009 D8, TS-009-A12
- Steps: Look for the build step that regenerates the tier-3 snapshots
  from the real upstreams — there is none; the three artefacts are
  hand-written.
- Expected: TS-009 D8/A12 — the snapshots are generated from the real
  upstreams at build time.
- Observed: Hand-written fixtures standing in for generated ones.
- Round decision: **open-list**
- Reasoning: blocked on the same missing credential as row 77 — no
  `GEOAPI_READ_TOKEN` / `EVENTSAPI_READ_TOKEN` exists in any
  environment, so there is no upstream to regenerate from. It belongs to
  the post-run hardening round, where the mocks come out.

## F-2-17 — The BFF rate limit is a per-instance in-memory counter

- Severity: medium
- Source: pm-triage (`state/open.md` row 81)
- Where: `src/lib/live/bff.ts`; TS-004 D5, WEB-Q-038
- Steps: Read the counter — a fixed window in module memory, therefore
  per lambda instance, per region, and reset on every cold start.
- Expected: TS-004 D5's rate limit as a property of the route.
- Observed: A limit that holds per warm instance rather than globally.
- Round decision: **open-list**
- Reasoning: a real limit needs shared state (Runtime Cache or an
  upstream limiter) and a dependency decision; the prototype is a
  protected preview with no public traffic, so the risk this control
  exists for does not exist yet. Hardening round, alongside the real
  upstream tokens.

## F-2-18 — Six of TS-007 D12's twelve checks do not run

- Severity: medium
- Source: pm-triage (`state/open.md` rows 59, 60, 69)
- Where: `src/lib/content/`, `src/domain/content-frontmatter.schema.ts`;
  TS-007 D5/D7/D12, TS-007-A3/A6/A10/A13/A16, TS-005 D3/D4/D5
- Steps: Run `pnpm check:content` — it reports 0 errors over 64 files,
  but length budgets, clearance re-validation, hub-id resolution, the
  composition half of slot binding, segment independence and glossary
  conformance never execute.
- Expected: TS-007 D12 lists twelve checks; A3, A6, A10, A13 and A16 are
  declared at tool/unit level.
- Observed: Each missing check is blocked on an artefact that does not
  exist: `RelevanceFacets` (D7) is absent from schema and artifacts, hub
  ids are not carried in page frontmatter, the glossary's
  use-this-word/avoid-this-word columns and Layer C's composition spec
  are TS-007's own open points.
- Round decision: **open-list**
- Reasoning: the gap is in the verification layer, not in the shipped
  content — no page is wrong today. Three of the six cannot be written
  at all until a spec session decides TS-007's open points, and the
  facet half means writing four facets onto 172 existing slots, which is
  the content follow-up workstream, not a pre-gate fix. QA sweeps
  TS-007-A1/A2/A5/A7/A8/A9/A11/A12/A14 and records A3/A6/A10/A13/A16 as
  blocked with this finding id.

## F-2-19 — A heading level is skipped inside the imported privacy policy

- Severity: medium
- Source: pm-triage (`state/open.md` row 114)
- Where: `content/legal/privacy-policy.md` lines 100–108; TS-029-A14
- Steps: Read the document — `## 5. …` is followed by `#### Zweck` with
  no `###` between them. `shiftHeadings` applies one uniform shift and
  cannot repair a level that was wrong before the shift.
- Expected: TS-029-A14's "no skipped level inside any imported document".
- Observed: The defect is in the imported source document itself.
- Round decision: **open-list**
- Reasoning: the run must not rewrite legal text (repository working
  rule). The fix is one heading in the Google Doc plus a re-import, and
  that is the legal source owner's, not the run's. `e2e/pages/rechtliches.spec.ts`
  already asserts the satisfiable half and records this half as a named
  skipped finding rather than weakening the assertion.

## F-2-20 — Organization identity is regex-parsed out of the imprint prose

- Severity: low
- Source: pm-triage (`state/open.md` row 87)
- Where: `src/lib/seo/structured-data/organization-data.ts`; TS-011 D4
- Steps: Read the builder — it parses `content/legal/imprint.md`'s prose
  §5 with a targeted regex.
- Expected: TS-011 D4 — no identity data written into code.
- Observed: No data in code, but a brittle read of prose that a re-import
  of the imprint can silently break.
- Round decision: **open-list**
- Reasoning: it satisfies the letter of D4 and the structured-data
  library is being wired into pages right now by the in-flight work
  package. A structured identity record belongs in the hub, which is a
  content-source question for Jan, not a fix-round slot.

## F-2-21 — A map-shaped placeholder TS-026 D3 forbids is still in the manifest and the dev gallery

- Severity: low
- Source: pm-triage (`state/open.md` row 111)
- Where: `placeholders.manifest.json`,
  `src/generated/placeholders/deine-region/karte.svg`,
  `src/components/gallery.tsx`; TS-026 D3
- Steps: The `deine-region/karte` slot is a hatched box captioned
  "Kartenausschnitt" — the shape D3 forbids anywhere on `/deine-region`.
- Expected: TS-026 D3.
- Observed: Not rendered on any built page; two deliberately
  non-map-labelled slots were minted instead. The `karte` slot remains
  in the manifest and in the dev gallery.
- Round decision: **open-list**
- Reasoning: latent, not shipped — no page reaches for it, so no AC
  fails today. It is a trap for the next page that does, which is what
  the open row is for; retiring or relabelling it is the component
  owner's call at the design review.

## F-2-22 — `/rechtliches` is forced to carry a focus job it does not have

- Severity: medium
- Source: pm-triage (`state/open.md` row 105)
- Where: `app/[lang]/rechtliches/page.meta.ts`; TS-029 open point 5
- Steps: `page.meta.ts`'s `focusJob` is a required, closed-set field; a
  sender surface has no focus job in the four-job sense, so a value is
  picked anyway.
- Expected: TS-029's own open point 5 records the mismatch.
- Observed: A required field carries a value with no meaning on this page.
- Round decision: **open-list**
- Reasoning: the spec itself flags it as open. Widening the field to
  `focusJob: null` is a shape change to the module two work packages are
  currently consolidating (row 104, in flight) — it is decided once, in
  a spec session, after that consolidation lands.

## F-2-23 — TS-025 D9 and TS-011 D9 contradict each other on `/dein-kalender/bestellen`

- Severity: medium
- Source: pm-triage (`state/open.md` row 127)
- Where: `app/[lang]/dein-kalender/bestellen/page.tsx`, `proxy.ts`;
  TS-025 D9 vs TS-011 D9
- Steps: TS-025 D9 sets `noindex, follow` on the route; TS-011 D9 calls
  the route indexable. The page follows TS-025 D9.
- Expected: One indexability verdict per route.
- Observed: The page spec amends the SEO spec, which TS-025's own text
  already notes.
- Round decision: **open-list**
- Reasoning: spec against spec; the more specific page spec binds, and
  the choice made (an order flow is not a landing page) is the safe one.
  QA records TS-011-D9's expectation as deviated-by-TS-025 rather than
  as a failure.

## F-2-24 — The Vercel project still carries the legacy site's build settings

- Severity: medium
- Source: pm-triage (`state/open.md` row 22)
- Where: Vercel project settings — `installCommand: "yarn install"`,
  `buildCommand: "yarn build"`, `nodeVersion: 22.x`
- Steps: Read the project settings against the repository, which is pnpm
  and pins its own Node version.
- Expected: The deploy chain runs the repository's own toolchain.
- Observed: Preview deploys have nonetheless reached the build and
  typecheck step (row 65 shows a real Vercel build failing on
  typecheck), so the settings are not currently blocking.
- Round decision: **open-list**
- Reasoning: not a prototype defect — deploys work. Changing project
  settings touches the surface Jan owns for the production cutover, and
  it belongs with the go-live workstream, where the domains and
  production env vars are settled too.

## F-2-25 — `pnpm audit` reports 72 findings in the dev tree

- Severity: medium
- Source: pm-triage (`state/open.md` row 23)
- Where: `pnpm audit` — 2 critical, 26 high, all in the `vercel` CLI
  (`tar`, `undici`) and in `eslint-config-next`'s import plugin
- Steps: Run `pnpm audit`.
- Expected: A clean supply-chain posture before production.
- Observed: Every finding is in the development tree; none reaches a
  runtime bundle.
- Round decision: **open-list**
- Reasoning: nothing here ships to a visitor, and the fixes are upstream
  releases of two tools the run does not control. It is the security
  sweep's input at M5 and the hardening round's before go-live, not a
  gate-2 blocker.

## F-2-26 — `scripts/make-placeholders.mjs` deletes a tracked README on every run

- Severity: low
- Source: pm-triage (`state/open.md` row 118)
- Where: `scripts/make-placeholders.mjs`,
  `src/generated/placeholders/README.md`
- Steps: Run the script — `rmSync(OUT, { recursive: true })` clears the
  whole output directory, including the README that explains the
  directory, before regenerating.
- Expected: A generator replaces what it generates.
- Observed: A hand-written file is collateral.
- Round decision: **open-list**
- Reasoning: polish, no user or AC impact, and the loss is visible in
  `git status` the moment it happens. Fits the M5 budget, not a gate
  round.

## F-2-27 — The preview CSP carries `'unsafe-inline'` in `script-src`

- Severity: medium
- Source: pm-triage (`state/open.md` rows 21 and 31)
- Where: `src/lib/security/csp.ts`; TS-014 D2/D3/D7, DEC-045
- Steps: Read the header on a preview deployment. When the per-build
  hash set is empty, `csp.ts` adds `'unsafe-inline'` for
  `environment === "preview"` only.
- Expected: TS-014 D3 / DEC-045 — a per-build hash set, no
  `'unsafe-inline'`.
- Observed: The hash mechanism works in `next dev` and in a self-hosted
  `next build && next start` (28 hashes, zero violations). Two delivery
  mechanisms to Vercel's deployed Proxy function were built and measured
  to fail; a third was stopped by a permission denial. Production never
  receives the branch.
- Round decision: **open-list**
- Reasoning: a deliberate, measured, preview-only degradation taken so
  the surface the reviews and user tests run on actually hydrates —
  without it there is no prototype to review. Production is unaffected
  and D7 holds there unconditionally. What this round does buy is the
  fence: F-1-2's static check keeps the branch preview-only, which is
  why F-1-2 is fix-now.

## F-2-28 — `outbound-link`'s `secondary` pill loses the CSP's own contrast when nested in a `section-shell` ink/violet ground

- Severity: high
- Source: qa-tool (`e2e/a11y.spec.ts`, the F-2-6 axe instrument)
- Where: `src/components/outbound-link/outbound-link.module.css` (`.secondary`),
  `src/components/section-shell/section-shell.module.css` (`.ink a`,
  `.violet500 a`); TS-002-A1
- Routes: `/`, `/en`, `/dein-ort`, `/en/your-place` (all four: 360 px and
  1280 px) — 8 of the sweep's 48 (route × viewport) cases
- Steps: `axe-core` reports `color-contrast` (`serious`) on the
  `outbound-link`'s `secondary`-variant text on all four routes. Traced by
  hand (`getComputedStyle` on the failing node): `.secondary` sets
  `color: var(--color-neutral-ink)` on the anchor itself, meant to read
  against its own `--color-neutral-paper` (near-white) pill background.
  But `section-shell.module.css`'s `.ink a, .violet500 a { color:
  var(--color-lime-400) }` — the rule that makes *plain* links legible
  directly on the shell's own dark ground — has higher specificity (class +
  type selector vs. `.secondary`'s single class) and wins whenever the
  pill sits inside an `.ink`/`.violet500` section. The pill then renders
  `--color-lime-400` (`#b6de6d`) text on its own `--color-neutral-paper`
  background: measured contrast 1.47:1 against the 4.5:1 floor.
- Expected: TS-002-A1 — zero `axe-core` violations on every page (a11y
  gate); TS-002 D3's own rule that the brand green is never a text colour
  on a light ground.
- Observed: A light-on-near-white pill button on the home and `/dein-ort`
  hero/live-module CTA, in both languages, at both reference viewports.
- Round decision: **fix-now** (round 2b)
- Note: not fixed here — `outbound-link` and `section-shell` are under
  `src/components/**`, the wiring work package's ownership for this round.
  The general shape of the fix: `.secondary` (and any other component that
  paints its own surface) needs to re-assert its own text colour with
  higher specificity than `section-shell`'s blanket `.ink a`/`.violet500 a`
  rule, e.g. `.ink .secondary, .violet500 .secondary { color:
  var(--color-neutral-ink); }` beside the existing rule in
  `section-shell.module.css`, or a `:where()`-wrapped blanket rule in
  `section-shell.module.css` so its specificity stops overriding a
  component's own variant colour.
- Resolved: 7da518f — `.secondary` became `.link.secondary` (both
  classes already sit on the same anchor, `outbound-link.tsx`), raising
  its specificity to 0,2,0 against `section-shell`'s 0,1,1 ambient rule
  regardless of CSS import order. `section-shell.module.css` untouched,
  so `.inline`/`.quiet` (which rely on the ambient recolour) are
  unaffected. `e2e/a11y.spec.ts`: 49/49 passing after the fix.

## F-2-29 — `proof-card`'s claim text inherits the ink ground's colour onto the card's own lighter surface

- Severity: high
- Source: qa-tool (`e2e/a11y.spec.ts`, the F-2-6 axe instrument)
- Where: `src/components/proof-card/proof-card.module.css` (`.card`,
  `.claim`), `src/components/section-shell/section-shell.module.css`
  (`.ink`); TS-002-A1
- Routes: `/ueber-uns`, `/en/about` (both: 360 px and 1280 px) — 4 of the
  sweep's 48 cases
- Steps: `axe-core` reports `color-contrast` (`serious`) on the
  `proof-card`'s `.claim` text. `proof-card.module.css`'s `.card` paints
  its own `background: var(--color-neutral-surface)`, and `.claim` sets no
  `color` of its own — it inherits whatever ancestor supplies one. Inside
  the origin story's `.ink` section-shell, that ancestor is
  `section-shell.module.css`'s `.ink { color: var(--color-neutral-paper)
  }` — correct for text sitting directly on the ink background, wrong for
  a `proof-card` that paints its own lighter surface on top of it.
  Measured: `#f9fbf7` text on `#eef2e9` background, contrast 1.08:1
  against the 3:1 floor for this bold, large text.
- Expected: TS-002-A1 — zero `axe-core` violations on every page.
- Observed: Near-white text on a near-white card, on the one page
  (`/ueber-uns`, `/en/about`) that places a `proof-card` inside an `.ink`
  section.
- Round decision: **fix-now** (round 2b)
- Note: not fixed here — both components are under `src/components/**`,
  the wiring work package's ownership for this round. Same root-cause
  family as F-2-28 (a component that paints its own surface does not
  re-declare its own text colour, so it inherits a dark-ground default
  meant for bare text): the fix is `proof-card.module.css` giving `.claim`
  (and `.context`/`.attribution`, which have the same exposure) an explicit
  `color: var(--color-neutral-ink)`, which is correct on every one of
  `section-shell`'s own background variants because `.card`'s background is
  never the section's background.
- Resolved: 7da518f — `.claim` got its explicit `color:
  var(--color-neutral-ink)`. `.context`/`.attribution` already carried
  their own explicit colour by the time this round started (not the
  inheritance exposure this note anticipated) — checked, not touched.
  `e2e/a11y.spec.ts`: 49/49 passing after the fix.

## Not converted (rows that stay rows)

- **Decisions for Jan / spec sessions**: rows 1–13, 17–21 (first
  numbering block), 22, 23, 25, 26 (first block), 43, 45, 61, 62, 66,
  67, 68, 72, 84, 96, 106, 108, 123, 124 — clearance, hub sources,
  contradicting specs already resolved in the prototype's favour, and
  editorial questions. None is a defect in the built prototype.
- **`Mock aktiv` register**: rows 5, 6, 7, 8, 22 (first block), 70, 77,
  78, 90, 91, 116, 125, 128, 129 — the mock rule's checklist for the
  hardening round.
- **`Dummy-Content` register**: rows 17–21 (first block), 44, 46–53, 92,
  93, 94, 95, 107, 109, 110 — the content follow-up workstream.
- **Already resolved in this run**: rows 21/31 (mechanism, see F-2-27),
  39 (mechanism verified; the `layout.tsx` half is in flight), 42, 56,
  58, 120, 121.
- **In flight with the wiring work package**: rows 76, 83, 88, 99
  (see F-2-13), 102, 103, 104, and the nearby-module test flake.
- **Out of scope at this gate** (owner named in `plan/gate-2-scope.md`):
  rows 64 and 65-as-CI (stage-2 CI, TS-015-A3–A5), 85 and 86
  (production domains, TS-001-A4/A9), 89 (TS-013-A4's deployed-CSP
  half), 115's A11 half (production build), 117, 122, 130.
- **Post-prototype by definition**: rows 13, 84, 87 (hub identity
  record), and the whole "After the prototype" block.

---

# Findings — Round 2, QA gate-2 acceptance run 1

Appended by the QA acceptance run over `plan/gate-2-scope.md` (333 ACs).
Protocol: `reports/qa/gate-2-run-1.md`. Findings below carry the chaos and
UAT ids they were triaged from; observations that were **not** defects are
dismissed in the protocol, not here.

## F-2-30 — The uncovered-place branch never fires: any unresolved search answers with a confident demo place

- Severity: critical
- Source: uat (divergence pass) + chaos:boundary-tester (C-B-5) + qa
- Where: `/` and `/dein-ort` place search · TS-019-A3, TS-019-A4,
  TS-019-A5, TS-021-A6, TS-021-A14, TS-008-A7 · `src/lib/pages/live-anchor.ts:59`,
  `src/lib/live/places.ts:72`
- Steps:
  1. `curl "http://localhost:3100/dein-ort?ort=99999"` — `99999` is the
     fixture's own declared uncovered ZIP
     (`src/lib/live/mocks/fixtures.ts:44`, `demoPlaceForZip` returns
     `undefined` for it).
  2. Repeat with `?ort=abcde` (not a postcode at all).
  3. `curl "http://localhost:3100/?ort=07743"`, `?ort=38165`, `?ort=99999`.
- Expected:
  - TS-019-A5: "Type an uncovered place into the search on `/` and submit.
    The browser navigates to `/dein-ort/starten?ort=…`."
  - TS-019-A3: "Open `/?ort=<covered place with dates>`. Block 1 shows the
    place name and exactly 3 event rows."
  - TS-019-A4: "Open `/?ort=<covered place with no dates>`. Block 1 shows
    the nearby module … plus a publish-the-first-date CTA."
  - TS-021-A6 / TS-008-A7: "Searching an uncovered place lands on
    `/dein-ort/starten?ort=…`."
- Observed:
  - `/dein-ort?ort=99999` and `?ort=abcde` both answer **200** with a
    fully populated covered place ("Das ist los in Beispielgemeinde
    Musterdorf", three demo event rows, a homescreen CTA for that place).
    No redirect, no uncovered branch, no "we don't know this place yet".
  - `grep -rn "uncovered" app src` shows `outcome.kind === "uncovered"` is
    produced by `src/lib/live/places.ts:72` and **consumed by nothing** —
    no page and no route handler reacts to it.
  - `resolveLiveAnchor` (`src/lib/pages/live-anchor.ts:59`) turns every
    unresolvable value into `STAGE_ZERO_ANCHOR` with `stated: false`, and
    the placeless variant then renders as a confident *covered* answer
    rather than as "no place".
  - On `/`, `?ort=` is ignored entirely: `07743`, `38165` and `99999` all
    render the same stage-0 anchor. The home search form posts to
    `action="/dein-ort"`, so `/` never honours the parameter the three
    criteria are written against.
  - `/dein-ort/starten?ort=99999` renders correctly when reached directly —
    the founding page works, nothing routes to it.
- Impact: the three-outcome model of TS-008 D7 (dates / no dates / no
  place) collapses to one outcome for the visitor. A resident typing her
  own real postcode is shown a village she has never heard of and told
  what is on there. The founding conversion path
  (`save-calendar-to-homescreen` → `/dein-ort/starten` →
  `register-as-publisher`) has no entry.
- Note: the e2e tests for TS-019-A3/A4/A5, TS-021-A6 and TS-021-A14 are
  `test.skip`ped with the annotation "[M4 — TS-008 D2 BFF routes]". M4 is
  in scope at this gate, so those skips are stale and hide a live defect.
- Round decision: **fix-now** (round 3, package A)
- Reasoning: critical, and on the founding conversion path — every critical
  is fix-now (`plan/process.md`). `outcome.kind === "uncovered"` already
  exists at `src/lib/live/places.ts:72` and is consumed by nothing, so this
  is wiring an existing branch into `resolveLiveAnchor` plus honouring
  `?ort=` on `/`, not new logic. The stale `test.skip`s that hide it
  (TS-019-A3/A4/A5, TS-021-A6, TS-021-A14) come with the fix.

## F-2-31 — The 404 page ships a developer note as its body copy and carries neither place search nor jobs band

- Severity: high
- Source: uat (404 walk) + qa
- Where: every unknown URL, both locales · TS-004-A4 ·
  `src/lib/i18n/dictionary.ts:161` (de), `:238` (en),
  `app/global-not-found.tsx:52-70`
- Steps: open `http://localhost:3100/dies-gibt-es-nicht` (and
  `/en/anything`).
- Expected: TS-004-A4 — "404 renders place search + jobs band with status
  404 and `noindex`"; TS-004 D6 — "404: static shell + streamed place
  search".
- Observed:
  - The page's own body paragraph reads "Diese Adresse gibt es nicht.
    [Platzhalter M2 — Ortssuche und Job-Band folgen mit den Komponenten,
    DEC-032.]" — a developer note with a decision id, rendered as visitor
    copy. The English variant carries the same note translated.
  - Below it a dashed box labelled "Platzhalter: place-search +
    context-band" stands in for both required modules. There is no place
    search and no jobs band on the page.
  - The 500 surface has the same shape: "Bitte versuche es noch einmal.
    [Platzhalter M2 — DEC-032: statisch, minimal, ohne Datenabhängigkeit.]"
    (`dictionary.ts:166`, `:243`).
  - Status 404 and `noindex, follow` are correct.
- Note on the evidence gap: `src/lib/routes/routing.integration.test.ts:163`
  and `e2e/routes.spec.ts:53` both name TS-004-A4 and both pass, but they
  assert only the status, the `robots` value and the heading — neither
  clause the criterion is actually about (place search, jobs band) is
  asserted anywhere. A green suite is not evidence for this AC.
- Conversion-path argument for escalation: `plan/gate-2-scope.md` §2 lists
  "plus the 404 place search" as part of the `save-calendar-to-homescreen`
  walk. If the PM reads the 404 as part of that path, this is critical.
- Round decision: **fix-now** (round 3, package A)
- Reasoning: `plan/gate-2-scope.md` §2 counts the 404 place search as part
  of the `save-calendar-to-homescreen` walk, so the PM reads this as a
  conversion-path AC failure — critical by the severity table, fix-now
  either way. A decision id rendered as body copy also breaks the
  dummy-content rule. The evidence half (the TS-004-A4 tests assert only
  status, `robots` and the heading) is package C's, under F-2-55's
  assert-too-little strand — A must not edit `e2e/routes.spec.ts` or
  `src/lib/routes/routing.integration.test.ts` this round.

## F-2-32 — `request-product-briefing` is a dead link, and two pages paste a second placeholder URL against TS-016 D7

- Severity: high
- Source: uat (briefing walk) + qa
- Where: `/dein-kalender`, `/deine-region`, `/deine-region/angebot`, every
  step of `/dein-kalender/bestellen` · TS-016-A5, TS-016 D7 ·
  `src/lib/live/briefing.ts:12`, `app/[lang]/deine-region/page.tsx:161`,
  `app/[lang]/deine-region/angebot/page.tsx:40`,
  `src/components/gallery.tsx:1097`
- Steps: open `/dein-kalender`, follow "Beratungstermin buchen"; repeat on
  `/deine-region` and on `/deine-region/angebot`.
- Expected: TS-016 D7 (S3) — "One configured value (environment/config),
  referenced by every S3 placement — **never pasted per page**"; the CTA
  navigates to a booking URL that resolves.
- Observed:
  1. `BRIEFING_URL` defaults to
     `https://calendar.google.com/calendar/appointments/schedules/placeholder-briefing`.
     Google answers "Termin nicht gefunden". `NEXT_PUBLIC_BRIEFING_URL` is
     not set in `.env.local`, so this is what ships.
  2. `src/lib/live/briefing.ts:7` states "The real Google Calendar
     appointment-schedule URL is not configured anywhere yet (no source
     names it)". That premise is false: the installed hub package carries
     it — `node_modules/@schafe-vorm-fenster/people/jan-henrik-hempel/jan-henrik-hempel.person.md:24`
     and `index.json:370`, `url: https://calendar.app.google/VG9bZoYVnFcX1W6F8`,
     labelled "Booking a video call … Public, brand-neutral, usable for
     Schafe vorm Fenster".
  3. `/deine-region` and `/deine-region/angebot` do **not** read the
     constant at all — both hard-code a *different* placeholder,
     `https://calendar.google.com/calendar/appointments/example`, pasted
     per page. That is the exact thing D7 forbids, and it means the swap
     to the real URL would still leave two dead links behind.
- Impact: `request-product-briefing` is a wired conversion goal
  (`plan/gate-2-scope.md` §2) and it is a dead end on every one of its
  placements.
- Round decision: **fix-now** (round 3, package A)
- Reasoning: a wired conversion goal that dead-ends on every one of its
  placements, and it is **not** externally blocked — the real booking URL
  ships in the installed `@schafe-vorm-fenster/people` package, which the
  finding located. D7's "one configured value" is the same fix that removes
  the two per-page pastes. The third occurrence is in the dev-only
  `src/components/gallery.tsx` and is not visitor-facing; it is not part of
  this fix and not a reason to touch package B's files.

## F-2-33 — The English conversion flows still render German UI strings, including the primary buttons

- Severity: high
- Source: uat (EN walks) + chaos:form-abandoner (C-A-02, C-A-03) + qa
- Where: `/en/take-part/register`, `/en/your-region/quote`,
  `/en/your-place`, and the footer of every `/en/…` route · reference: F-2-4
  (resolved for six strings; this is the remaining tail)
- Steps:
  1. `curl "http://localhost:3100/en/take-part/register"` — step 1.
  2. `curl "http://localhost:3100/en/take-part/register?ort=beispielwalde"`
     — step 2.
  3. `curl "http://localhost:3100/en/your-region/quote"`.
- Expected: an English page renders English UI strings; TS-007 D-level
  harmonisation and the locale discipline of TS-001.
- Observed (all reproduce on the fresh preview as well):
  - Registration step 1: the search submit button reads **"Suchen"**, and
    the aside line reads "Heute mit einem anderen Anliegen hier?".
  - Registration step 2: the demo badge reads **"Demo-Daten"** and the
    primary continue button reads **"Weiter"**. Step 3 likewise.
  - `/en/your-region/quote`: the whole quote form is German —
    "Organisation", "E-Mail-Adresse", "Telefon (optional)", "Worum geht es?",
    submit **"Absenden"** — plus the badges "Foto gesucht" and
    "Demo-Daten", and the aside link "Angebot anfragen".
  - The footer contact + newsletter block is German on **every** `/en/…`
    route: "Demo-Daten", "Name", "E-Mail-Adresse", "Nachricht",
    "Absenden", "Neuigkeiten aus dem Projekt", "Anmelden",
    "Double-Opt-in, keine Cookies. Mit der Anmeldung stimmst du unserer
    Datenschutzerklärung zu."
- Impact: two of the five wired conversion goals
  (`register-as-publisher`, `request-licence-quote`) present their primary
  action to an English visitor in German.
- Round decision: **fix-now** (round 3, package A)
- Reasoning: two of the five wired conversion goals present their primary
  action to an English visitor in German. Package A owns the whole tail this
  round: the flow surface (register steps 1–3, the quote form, `Suchen`, the
  aside line, the `Demo-Daten` badge on flows) **and** the footer
  contact/newsletter block, because `src/components/newsletter-block/**`,
  `site-footer`-adjacent copy and `src/components/logo/**` are carved out to
  A for this round — F-2-33, F-2-35 and F-2-64 all sit in that one block and
  are fixed together. The logo's German accessible name on `/en` (UAT) is
  folded in here rather than filed separately.

## F-2-34 — `{county-or-organization}` renders as a literal in the English quote page's `h1`

- Severity: high
- Source: chaos:form-abandoner (C-A-01) + uat
- Where: `/en/your-region/quote`, the page `h1` · TS-026 (quote-flow half)
- Steps: `curl "http://localhost:3100/en/your-region/quote"`; also
  reproduced against the fresh preview.
- Expected: the heading names the county or the organisation, or falls back
  to a written-out placeless variant. TS-007-A16 forbids a resolved place
  name in a generated string and requires named interpolation slots — a
  slot that is never filled is not an acceptable rendering of one.
- Observed: the heading reads literally "Request a quote for
  {county-or-organization}". The German equivalent
  (`/deine-region/angebot`) renders a complete sentence ("Angebot für eure
  Organisation anfragen"), so only the English variant leaks the slot.
- Round decision: **fix-now** (round 3, package A)
- Reasoning: an unfilled interpolation slot rendered as the `h1` of a
  conversion page. The German twin already carries a complete placeless
  sentence, so the fix is its English counterpart in
  `content/pages/deine-region/en.md:159` plus the page filling the slot when
  a county is known — one content line and one page file.

## F-2-35 — Internal identifiers are rendered as visitor-facing copy on every route, in both locales

- Severity: high
- Source: uat (registration + quote walks) + qa
- Where: the footer newsletter block on all 24 routes; `/ueber-uns` and
  `/en/about`; `/rechtliches` and `/en/legal` · content compliance
  (`plan/gate-2-scope.md` §1.3), TS-007 D12
- Steps: request each of the twelve routes in both locales and strip tags;
  grep the visible text for `Q-0..`, `DEC-0..`, `TS-0..`.
- Expected: no internal ticket, decision or spec identifier appears in
  rendered page copy.
- Observed, verbatim:
  - Footer, **24/24 routes**, German even under `/en`: "Demo-Daten — es
    wird nichts verschickt, solange **Q-020** offen ist."
  - `/ueber-uns` and `/en/about`: "… ist \`license: unverified\` und deshalb
    bei jedem Build erneut auf Freigabe zu prüfen (kein Textproblem,
    **TS-007 D12**)." — the backticks render literally too.
  - `/rechtliches` and `/en/legal`: "Rechtliche Prüfung durch
    Rechtsberatung (jan-henrik, zusammen mit Rechtsberatung — **TS-029
    Open Point #1**)" and "Englische Fassung, sobald die deutsche Fassung
    freigegeben ist (**DEC-027**: Rechtstexte in DE und EN)."
  - The 404/500 placeholder note is filed separately as F-2-31.
- Note: the `Demo-Daten` badge itself is the guardrail working as intended
  and is not the defect — the ticket id next to it is.
- Round decision: **fix-now** (round 3, package A)
- Reasoning: internal ticket, decision and spec ids rendered as visitor copy
  on 24/24 routes fails the content-compliance check of
  `plan/gate-2-scope.md` §1.3 and the dummy-content rule's "claims stay
  generic" bar. Five known sites, all body copy plus one line in
  `newsletter-block.tsx:71` — cheap and the most visible thing on the
  prototype. The lint that would have caught it is F-2-43 (package C); this
  round fixes the text, not only the instrument.

## F-2-36 — `proxy.ts` sends the Vercel automation bypass secret to a Host-header-controlled origin and caches the answer process-wide

- Severity: high
- Source: qa (security sweep — `differential-review` over `7b3624d..HEAD`)
- Where: `proxy.ts:83`, `src/lib/security/csp-hashes.ts:41-77`,
  `src/lib/routes/host-matrix.ts:99-103` · TS-014 scope
- Steps (code path, reachability unproven — see the note):
  1. `canonicalHostFor(host)` returns `undefined` for any host absent from
     `DOMAIN_MATRIX`, so an unrecognised `Host` does **not** take the 301
     at `proxy.ts:52`.
  2. Execution reaches `await scriptHashes(request.nextUrl.origin)`
     (`proxy.ts:83`) with an origin derived from that header.
  3. `csp-hashes.ts:46-52` fetches that origin with the header
     `x-vercel-protection-bypass: $VERCEL_AUTOMATION_BYPASS_SECRET`.
  4. `cached ??=` (`csp-hashes.ts:41`, `:75`) is module-scope and keyed by
     nothing, so the first request on a cold instance fixes the hash set
     for every later request that instance serves.
  5. `:56-57` filters the parsed entries only by `typeof h === "string"`,
     and `src/lib/security/csp.ts:66` interpolates each as `` `'${hash}'` ``
     with no shape check — so a returned string containing `'` or `;`
     writes arbitrary tokens into `script-src`.
- Expected: the secret that bypasses Deployment Protection on every preview
  is never sent to a host the request chose; the CSP `script-src` is a
  function of the build, not of a request header.
- Observed: three independent defences are absent — no host allowlist
  before the fetch, no per-origin cache key, no validation of the returned
  tokens.
- Reachability note, recorded honestly: Vercel's edge normally refuses an
  unrecognised `Host`, and commit `e256fa8` skips the Host-spoof e2e case
  on preview for that reason, so this was **not** reproduced end to end.
  A local reproduction needs a cold server instance and `next dev` refuses
  a second instance in the same directory, so it was not attempted against
  the shared run server. `src/lib/security/csp-hashes.ts` is a new module
  that handles a secret and performs a request-derived fetch and has
  **zero tests**; `proxy.ts` has no unit test.
- Round decision: **fix-now** (round 3, package C)
- Reasoning: high, and not externally blocked. Three independent defences
  are absent and each is cheap: a host allowlist before the fetch, a
  per-origin cache key instead of `cached ??=`, and a shape check on the
  returned tokens before they are interpolated into `script-src`. The module
  is new, handles the preview-protection secret and has zero tests — the
  tests are part of the fix. Reachability being unproven lowers the urgency,
  not the fix: the fix costs less than another attempt to reproduce it.

## F-2-37 — `report-uri` / `Reporting-Endpoints` point at `/api/csp-report`, which cannot exist

- Severity: medium
- Source: qa (security sweep)
- Where: `src/lib/security/csp.ts:136`, `:188`; asserted green by
  `e2e/smoke.spec.ts:196` and `:227` · TS-014 D2 vs TS-017 D4
- Steps: `curl -sI http://localhost:3100/ | grep -i "report"` shows
  `report-uri /api/csp-report` and `Reporting-Endpoints: csp="/api/csp-report"`;
  `curl -s -o /dev/null -w "%{http_code}" http://localhost:3100/api/csp-report`.
- Expected: the reporting endpoint the policy names receives reports.
- Observed: the route does not exist, and it cannot be built: a report
  endpoint needs POST, and `scripts/check-api-routes.ts:110-128` (TS-017-A10)
  fails the build on any non-GET handler under `app/**`. TS-014's reporting
  half is inert by construction, and two smoke assertions currently certify
  the dead pointer as correct. This is a spec collision to resolve, not a
  coding slip.
- Round decision: **open-list**
- Reasoning: TS-014 D2 against TS-017 D4 is spec-against-spec, which this
  run records rather than resolves in a fix round (as with F-2-10 and
  F-2-23) — deciding whether a POST sink may exist under `app/**` is a spec
  session, and the PM does not reword either criterion
  (`plan/guardrails.md`). No visitor impact: nothing ever collected the
  reports, so the pointer is inert rather than wrong-in-effect. Blocker
  named: the TS-014 / TS-017 owner.

## F-2-38 — Two pages read `?ort=` raw, bypassing the validator; no input anywhere has a length bound

- Severity: medium
- Source: chaos:boundary-tester (C-B-1, C-B-2) + qa (security sweep)
- Where: `app/[lang]/mitmachen/registrieren/page.tsx:90`,
  `app/[lang]/dein-kalender/bestellen/page.tsx:166`;
  `src/components/search-field/search-field.tsx:73-83`,
  `src/components/envoy-form-mount/envoy-form-mount.tsx:109-123`
- Steps:
  1. In a browser on `/dein-kalender/bestellen`, read the place-search
     input's `maxlength` attribute — it is `null`.
  2. Paste 10 000 characters into it, or into any envoy field; the value is
     accepted whole.
  3. Read the two page files above: both take `searchParams.ort` directly
     instead of through `readPlaceParameter`.
- Expected: `src/lib/pages/place-parameter.ts:1-19` states "everything the
  page is allowed to do with it depends on it having passed through here
  first", and `:25` caps the value at 80 characters.
- Observed: those two routes skip the validator, so neither the 80-char cap
  nor the character allowlist applies on them — and no input in the tree
  carries `maxLength` on the client either. Server-side bounds exist only
  on the BFF routes (`app/api/places/search/route.ts:20` ≤120,
  `app/api/region/[county]/examples/route.ts:20` ≤80).
- Explicitly **not** a finding: the chaos personas' XSS hypothesis
  (C-B-3, C-B-4). The differential review traced both fields to every sink
  and found no reflection — the repo's single `dangerouslySetInnerHTML`
  (`src/lib/seo/structured-data/render.ts:33`) escapes `<` and is
  unreachable from request data, canonical/OG strip every query parameter
  (`src/lib/seo/canonical-params.ts:14-22`), URLs are built with
  `URLSearchParams`, and the envoy form has no `action` and no named
  fields, so nothing is submitted at all.
- Round decision: **fix-now** (round 3, package A)
- Reasoning: medium on a conversion path — both bypassing routes are flow
  steps (`registrieren`, `bestellen`) — and cheap: route the two
  `searchParams.ort` reads through `readPlaceParameter` and put `maxLength`
  on `search-field` and `envoy-form-mount`. Only the length/allowlist half
  is in scope; the XSS hypothesis is dismissed in the finding with its
  evidence and is not reopened.

## F-2-39 — No island renders a skeleton: the streamed-shell contract of TS-009 is not built

- Severity: high
- Source: qa
- Where: `app/[lang]/_islands.tsx:127` (`moduleSkeleton`, never called),
  `app/[lang]/_proof.ts:104` · TS-005-A9, TS-009-A3, TS-009-A9
- Steps: `grep -rn "<Suspense" app src --include='*.tsx'` → matches in
  comments only, no JSX. `grep -rn "moduleSkeleton\|fallback=" app src` →
  no call site. Request any of the twelve routes and `grep -c skeleton`
  the HTML → 0 on every one.
- Expected:
  - TS-005-A9: "The route shell renders prerendered without waiting for the
    engine; the static default appears before the segment variant."
  - TS-009-A3: the shell "contains header, footer, copy and **all module
    skeletons**".
  - TS-009-A9: "For every D3 island, the skeleton's rendered box equals the
    resolved module's box."
- Observed: there is no `<Suspense>` boundary anywhere in the tree, so no
  island has a fallback position to render into. `selectProof()` is
  awaited inline in every page body (`page.tsx:178`,
  `mitmachen/page.tsx:147`, `ueber-uns/page.tsx:139`,
  `dein-kalender/page.tsx:126`, `deine-region/page.tsx:118`), so the shell
  does wait for the engine and no static-default → segment-variant swap
  exists. TTFB is fine (37–133 ms) and header/footer/copy are present; the
  streaming half of the contract is simply absent.
- Round decision: **fix-now** (round 3, package B)
- Reasoning: high — three criteria (TS-005-A9, TS-009-A3, TS-009-A9) fail on
  one missing mechanism, and `moduleSkeleton` is already written and never
  called, so the work is mounting boundaries in `app/[lang]/_islands.tsx`,
  one file B owns this round.
- **Settled by the wiring wave — do not re-litigate:** `state/open.md`
  row 131 records that `/dein-ort`, `/dein-ort/starten`,
  `/mitmachen/registrieren` and `/dein-kalender/bestellen` stay blocking and
  dynamic by decision, and TS-020-A10 forbids a skeleton on `/dein-ort` by
  name. The boundaries go on the other eight routes' islands. Row 132 (a
  dynamic route cannot hydrate under DEC-045's hash-only CSP) is a DEC-045
  amendment owned outside this run and is not this package's to solve.

## F-2-40 — Every content artefact is `status: draft` and every one of them renders

- Severity: high
- Source: qa
- Where: all 22 files under `content/pages/`, plus
  `content/legal/accessibility.md` · TS-007-A14
- Steps: `grep -rn "^status:" content/pages content/legal | sort | uniq -c`;
  then request any route and read the copy.
- Expected: TS-007-A14 — "A production build contains only
  `status: approved` content; a `draft` file renders in preview and reaches
  no production page."
- Observed: no gate exists at any stage. `grep -rn approved src app scripts`
  finds only the schema enum and comments; `src/lib/content/loader.ts:197,215`
  reads the status field and never filters on it. The accessibility
  statement is among the drafts, and its own first paragraph says it "darf
  ohne Freigabe … nicht produktiv veröffentlicht werden" — the site would
  publish that sentence.
- Round decision: **fix-now** (round 3, package C)
- Reasoning: high — TS-007-A14 fails site-wide, and the site would publish
  the accessibility statement's own sentence saying it must not be
  published. The gate is code the run owns: `src/lib/content/loader.ts`
  filtering on `status` for a production build. Which artefacts become
  `approved` is a clearance decision for Jan and stays on the open list; the
  gate ships with everything still `draft`, which is exactly the preview
  behaviour A14 describes. F-2-46's one owned clause rides here: the
  frontmatter Zod objects must reject unknown keys, or the gate is
  bypassable silently.

## F-2-41 — The context band is a `section` inside `main`, not an `aside`, and is missing from four pages

- Severity: medium
- Source: qa
- Where: all twelve routes · TS-011-A4 (reference: F-2-10 covers only
  registration steps 2–3)
- Steps: `curl -s http://localhost:3100/dein-kalender | grep -o '<[a-z]* [^>]*context-band[^>]*>'`.
- Expected: TS-011-A4 — "every listed secondary element renders inside an
  `aside`, every primary element inside `main > article`; the context band
  is an `aside` on every page."
- Observed: the band renders as `<section aria-label="…" id="context-band">`
  **inside `<main>`** on `/`, `/dein-ort`, `/mitmachen`, `/dein-kalender`,
  `/deine-region`, `/dein-ort/starten` and `/mitmachen/registrieren`, and is
  absent entirely on `/ueber-uns`, `/ueber-uns/archiv`, `/rechtliches` and
  `/dein-kalender/bestellen`. Across all twelve pages there is exactly one
  `<aside>` in total (on `/mitmachen`); the live counters render as
  `<div id="live-counters">` inside `main`.
- Round decision: **fix-now** (round 3, package B)
- Reasoning: TS-011-A4 is a landmark criterion and twelve routes render
  exactly one `<aside>` between them — an a11y defect the keyboard-only
  persona meets on every page. The fix sits in the two chrome files B owns
  this round (`app/[lang]/_page-frame.tsx` and `section-shell`). The
  registration steps 2–3 suppression stays as F-2-10 decided (spec against
  spec, recorded, not fixed). If the four pages missing the band turn out to
  opt out in their own `page.tsx`, that clause goes back to package A at
  retest rather than B editing A's files.

## F-2-42 — No page emits an OG image, and `twitter:card` is `summary`

- Severity: medium
- Source: qa
- Where: every route, both locales · TS-011-A8, TS-011-A9 ·
  `src/lib/routes/metadata.ts:53-65`
- Steps: `curl -s http://localhost:3100/dein-kalender | grep -oE '<meta property="og:[^>]*>|<meta name="twitter:[^>]*>'`.
- Expected: TS-011-A8 — the complete D6 tag set; TS-011-A9 — "The OG image
  of every (path, language) responds 200, is 1200×630, within the size
  budget, and shows text in that language."
- Observed: `og:image`, `og:image:width`, `og:image:height`,
  `og:image:alt` and `twitter:image` are absent on every page in both
  locales, and `twitter:card` is `summary` where D6 fixes
  `summary_large_image`. No `next/og` route or build step exists, so
  TS-011-A9 has no subject at all. The equality clauses of A8 do hold:
  `og:url` equals the canonical, `og:locale` matches `<html lang>`, and
  `og:locale:alternate` matches the hreflang set.
- Round decision: **open-list**
- Reasoning: no conversion path and no visitor-visible failure. An OG image
  route plus a per-locale 1200×630 template for twelve routes in two
  languages is its own work package, not a fix-round slot, and the prototype
  does not go live (`plan/guardrails.md`). Goes to the M5 / go-live
  workstream with the other SEO surface items.

## F-2-43 — Six declared build guards do not exist, so six criteria cannot fail anything

- Severity: medium
- Source: qa
- Where: `scripts/check-*.ts`, `src/lib/content/validate.ts` · TS-002-A3,
  TS-005-A15, TS-006-A8, TS-007-A4, TS-011-A7, TS-026-A8
- Steps: run `pnpm check` (green), then look for each guard.
- Expected / Observed, one line each:
  - **TS-002-A3** "Automated contrast check of the token set passes for all
    themes" — no script reads the brand token set and computes ratios;
    the only contrast assertion is axe inside `e2e/a11y.spec.ts`, which
    runs on rendered pages and is not part of `pnpm check`.
  - **TS-005-A15** "A declared claim with a dangling proof id fails the
    build" — there is no `claims` key in the frontmatter schema or in any
    of the 22 artefacts, and `src/lib/content/validate.ts` contains zero
    `proof` references. (Same root cause as the skipped TS-020-A5.)
  - **TS-006-A8** "Content lint: zero hits of the generic-claims term list"
    — the list does not exist; `specs/tactical/page-composition.tactical.md:317`
    says so itself.
  - **TS-007-A4** "The same revocation fails the build" — the build command
    is `next build && node scripts/generate-csp-hashes.mjs`
    (`package.json:12`); `check:content` is not a build step, and
    `validate.ts` implements no clearance check at all.
  - **TS-011-A7** "unique non-empty title ≤ 60 chars and a description of
    120–158 chars; violations fail the build" — nothing measures either.
    Values happen to comply today because one placeholder template
    produces them (`src/lib/routes/metadata.ts:9-11`).
  - **TS-026-A8** "The response-time wording exists in exactly one module;
    a content lint fails on that wording in any content file" — the
    wording ships in `content/pages/deine-region/de.md:138` and `en.md:138`
    and in a second module (`src/components/gallery.tsx:1112`), and no
    term lint exists.
- Not re-filed here, per `plan/gate-2-scope.md` §1.3: TS-007-A3, A6, A13 and
  A16 are the same class of gap and are **recorded against F-2-18**. Two
  of them were re-confirmed this run: no glossary lint exists (A13), and
  no segment-independence lint exists (A16) — F-2-34 is the counter-example
  of an interpolation slot that ships unfilled. `src/lib/content/validate.ts:14,16`
  marks its own facet-completeness and harmonisation rows "partial", which
  is why A6 and A9 cannot be discharged either.
- Round decision: **fix-now** (round 3, package C)
- Reasoning: three of the six guards can be written against inputs that
  exist today — TS-002-A3 (token contrast over the brand set), TS-011-A7
  (title/description budget) and TS-026-A8 (single-source wording lint) —
  and each flips a criterion from fail to pass at gate close; package C has
  the room for them. The other three stay blocked on spec decisions and stay
  recorded here, exactly as F-2-18 records its own six: TS-005-A15 needs a
  `claims` key that no artefact has, TS-006-A8 needs a term list
  `page-composition.tactical.md:317` says does not exist, TS-007-A4 needs
  the clearance model.

## F-2-44 — The type scale is declared outside the token import and goes below 15 px

- Severity: medium
- Source: qa (`web-design-guidelines`)
- Where: `app/styles/components.css:28-46`,
  `src/components/event-row/event-row.module.css:29`,
  `scripts/check-brand.ts:79-84` · TS-002-A10
- Steps: `pnpm check:brand` (reports "no errors"), then read the files.
- Expected: TS-002-A10 — "No font family, size or weight is declared
  outside the token import; the rendered type scale equals `font.*` from
  the brand package, and no size below 15 px appears."
- Observed: `components.css` defines its own scale with literals that have
  no `font.*` counterpart; `--type-label-size: 0.75rem` is 12 px and
  `--type-microlabel-size: 0.6875rem` is 11 px — the file's own comment
  concedes it is "below the 15px floor". `event-row.module.css:29` is a
  bare `font-size: 28px`, and `font-weight: 700/800` literals appear in
  roughly thirty module stylesheets. `check-brand.ts` guards only colour
  literals and `font-family`, so the size and weight halves of the
  criterion are unguarded as well as unmet.
- Round decision: **fix-now** (round 3, package B)
- Reasoning: 11 px and 12 px body type is an a11y defect, not token hygiene,
  and raising the two custom properties above the 15 px floor plus the one
  bare `28px` in `event-row.module.css` is cheap. The rest of TS-002-A10 —
  moving the whole scale into the token import and the ~30 `font-weight`
  literals, plus teaching `check-brand.ts` the size and weight halves — is
  not cheap and goes to the open list.

## F-2-45 — The landing-only domain rule is not implemented: every path answers 200 on `.at`/`.pl`/`.com`

- Severity: medium
- Source: qa
- Where: `src/lib/routes/host-matrix.ts:29` (`kind: "landing"`, no
  consumer), `src/lib/routes/next-routing.ts:15` · TS-004-A3, TS-004 D1
- Steps: `curl -s -o /dev/null -w "%{http_code}" -H "Host: www.schafvormfenster.at" http://localhost:3100/mitmachen`.
- Expected: TS-004-A3 — "Landing-only domain: `/` and legal routes 200,
  `/mitmachen` 404"; TS-004 D1 — on the landing-only domains "every other
  path 404s".
- Observed: `/` 200, `/rechtliches` 200 and `/mitmachen` **200**.
  `host-matrix.ts` carries the `kind: "landing"` flag but nothing reads it,
  and `next-routing.ts:15` records that the host-dependent half of D3 is
  not built.
- Note: distinct from TS-001-A9, which `plan/gate-2-scope.md` §4 puts out
  of scope for being about real domains over HTTPS. This one is the
  in-tree routing rule and is checkable locally.
- Round decision: **fix-now** (round 3, package C)
- Reasoning: cheap — `kind: "landing"` already sits on the host matrix with
  no consumer, so one branch in the routing layer discharges TS-004-A3, and
  C owns `src/lib/routes/**` this round anyway for F-2-55. Distinct from
  TS-001-A9, which is out of scope for needing real domains.

## F-2-46 — `/en/legal` renders German bodies, and generation-only frontmatter passes validation

- Severity: medium
- Source: qa
- Where: `content/legal/` (flat, no locale level),
  `src/lib/content/legal-loader.ts:5-9`, `content/legal/accessibility.md:5-11`
  · TS-007-A11
- Steps: `ls content/legal`; `curl -s http://localhost:3100/en/legal`.
- Expected: TS-007-A11 — "`content/legal/<locale>/` renders as the anchored
  sections of the one legal page in registry order; anchors match TS-004 D8;
  a legal file carrying generation-only fields fails validation."
- Observed: `content/legal/` is six flat `.md` files with no `<locale>/`
  level. `/en/legal` renders the correct English anchors in registry order
  but **German section bodies**. Separately,
  `content/legal/accessibility.md` carries `derived_from`, `generated_by`,
  `generated_at` and `provenance: generated` — all forbidden for a
  `legal-section` by D10 — and `pnpm check:frontmatter` still reports "All
  frontmatter is valid", because the Zod objects are non-strict and drop
  unknown keys.
- Side observation, same area: the English newsletter consent link points
  at `/en/legal#datenschutz`, an anchor that does not exist on the English
  page (it uses `#privacy`).
- Round decision: **open-list**
- Reasoning: the criterion's main clause is English legal bodies, and the
  run must not write or translate legal text (repository working rule) —
  same blocker as F-2-19: the legal source owner, plus DEC-027, which fixes
  that DE and EN legal texts both exist. A `content/legal/<locale>/`
  restructure buys nothing while only German text exists. The one clause the
  run does own — non-strict Zod objects letting generation-only frontmatter
  pass `check:frontmatter` — is folded into F-2-40's gate in package C and
  is not lost.

## F-2-47 — Archive rows carry neither a preview image nor an outbound link

- Severity: medium
- Source: qa
- Where: `/ueber-uns/archiv`, `/en/about/archive` ·
  `app/[lang]/ueber-uns/archiv/page.tsx:144-152`,
  `src/components/archive-row/archive-row.tsx:25-29` · TS-016-A7, TS-028-A14
- Steps: open `/ueber-uns/archiv` and inspect any row.
- Expected: TS-016-A7 — "every archive entry renders an own preview image
  served from our own origin plus one outbound link with descriptive text";
  TS-028-A14 — "the outbound link opens the original at the outlet, its
  link text names source and subject, and it carries `rel="noopener"`".
- Observed: `ArchiveRow` is invoked with `contextLine`, `date`, `demo`,
  `outlet`, `title`, `types` — no `previewSrc` and no `href`. The component
  declares both optional and treats a missing preview and a missing link as
  legitimate variants, so no row has either. The no-embed half of A7 does
  hold and is enforced (`object-src`/`frame-src 'none'`,
  `src/lib/security/csp.ts:129-130`).
- Round decision: **open-list**
- Reasoning: not a conversion path, and neither half is the run's to
  produce: the outbound URLs per entry are media-echo data in
  `go-to-market-os`, and the previews are a `Dummy-Content` register item
  for the content follow-up workstream. `ArchiveRow` already accepts both
  props, so the row closes the moment the data exists — no code is in the
  way.

## F-2-48 — S2's quote mount is missing on `/deine-region`, and no lead form has a honeypot or a timing gate

- Severity: medium
- Source: qa
- Where: `app/[lang]/deine-region/page.tsx`,
  `src/components/envoy-form-mount/envoy-form-mount.tsx` · TS-016-A2,
  TS-016-A10
- Steps:
  1. `curl -s http://localhost:3100/deine-region | grep -o '<form[^>]*data-envoy[^>]*>'`.
  2. `grep -rni "honeypot" src app e2e`.
- Expected: TS-016-A2 — "Every D1 lead surface (S1, S2) renders the envoy
  mount point with the D2 attributes"; D1 row S2
  (`specs/tactical/forms-and-leads.tactical.md:45`) names **both**
  `/deine-region` and `/deine-region/angebot`. TS-016-A10 — honeypot
  present, hidden from assistive technology, not focusable; a submission
  faster than the timing threshold rejected.
- Observed: `/deine-region` renders only the site-wide footer contact mount
  — `EnvoyFormMount` does not appear in the page at all, so the quote mount
  exists only on `/deine-region/angebot`. And `honeypot` has zero hits
  anywhere; the rendered forms contain only their visible fields, and there
  is no submit handler of any kind (no `onSubmit`, no `"use client"`, no
  `"use server"`), so nothing could reject anything. The captcha clause of
  A10 passes cleanly.
- Note: the widget itself is a declared mock (`state/open.md` row 7); this
  finding is about the mount and the anti-spam contract the website owns,
  not about the widget's behaviour.
- Round decision: **fix-now** (round 3, package A)
- Reasoning: on the `request-licence-quote` path — D1 names `/deine-region`
  as an S2 lead surface and the mount is simply absent — and the honeypot is
  the website's half of A10, not the mocked widget's, so the mock rule does
  not excuse it. Cheap: one mount in the page, one hidden field and a timing
  stamp in `envoy-form-mount`, which A is already opening for F-2-51,
  F-2-65 and F-2-66.

## F-2-49 — `/dein-ort/starten` never re-resolves, and echoes the raw parameter as the place name

- Severity: medium
- Source: qa
- Where: `/dein-ort/starten` · TS-021-A7
- Steps:
  - `curl -s -o /dev/null -w "%{http_code} %{redirect_url}" "http://localhost:3100/dein-ort/starten?ort=beispielwalde"`
  - then read the rendered copy.
- Expected: TS-021-A7 — "a value that now resolves produces exactly one 302
  to `/dein-ort?ort=<slug>`" (DEC-070 re-resolution).
- Observed: the request answers **200**, not 302. Worse, `beispielwalde` is
  a covered demo place *with* dates, and the page tells the visitor
  "beispielwalde steht noch nicht im Dorfkalender" — a covered place is
  told it is not covered. The raw parameter is also echoed verbatim as the
  place name ("beispielwalde eintragen", lowercase) instead of the resolved
  name "Beispielwalde".
- Round decision: **fix-now** (round 3, package A)
- Reasoning: the founding conversion path tells a covered place it is not
  covered and echoes the raw query value as its name. It is the same
  re-resolution gap as F-2-30 and lands in the same two modules
  (`src/lib/pages/live-anchor.ts`, `src/lib/live/places.ts`), so fixing it
  apart from F-2-30 would cost more than fixing it with it.

## F-2-50 — `/deine-region`'s manifest declares one live module where D1 names four

- Severity: medium
- Source: qa
- Where: `app/[lang]/deine-region/page.meta.ts:25-31` · TS-026-A15
- Steps: compare the file against the D1 table in
  `specs/tactical/pages/deine-region.tactical.md`.
- Expected: TS-026-A15 — "`page.meta.ts` for `/deine-region` matches D1
  field by field".
- Observed: `liveModules` declares one entry
  (`position-3-active-places-in-the-county`) where D1 names four (county
  examples · counters · place search · embed demo position 1′), and D1's
  `offerings` row has no field in `PageMeta` and is not declared. Unlike
  the six other manifests this route has **no** `page.meta.test.ts`, so
  nothing catches the drift. The JSON-LD half of the criterion passes:
  `regionServiceNode` (`src/lib/seo/structured-data/service.ts:75-81`)
  emits `Service` with no `offers` and no price property.
- Round decision: **fix-now** (round 3, package A)
- Reasoning: `/deine-region` is the entry of a wired conversion goal, and
  its manifest is the only one of seven with no `page.meta.test.ts`, which
  is why the drift went unseen — declare the three modules that exist plus
  the missing test. The embed-demo row stays undeclared with F-2-15, which
  is blocked on the third-party no-cookie confirmation: do not invent a
  fourth entry to make the count match D1.

## F-2-51 — Order step 3 offers two calls to action, one of them inert

- Severity: medium
- Source: uat (order walk) + qa
- Where: `/dein-kalender/bestellen?orte=…&schritt=3` ·
  `app/[lang]/dein-kalender/bestellen/page.tsx:242-264`
- Steps: open `/dein-kalender/bestellen?orte=beispielwalde&schritt=3` and
  list the controls inside `main`.
- Expected: one primary action per step (TS-006 D-level, one primary
  conversion per screen).
- Observed: the step renders the envoy form's own **"Absenden"** submit
  button *and* a `data-cta="primary"` **"Weiter"** link. "Weiter" is the
  one that advances (to `?…&schritt=4`, verified). "Absenden" does nothing
  at all — the mocked mount has no `action` and no named fields — but it is
  the button a visitor filling in invoice details reaches for. UAT stopped
  here and had to work out which control was real.
- Correction to the UAT note: "Weiter" does navigate; the earlier
  observation that it did nothing did not reproduce.
- Round decision: **fix-now** (round 3, package A)
- Reasoning: UAT stopped here on a paid conversion path — two visible calls
  to action on one step, and the one that reads like the commitment
  ("Absenden") does nothing at all. Same `envoy-form-mount` work as F-2-65
  and F-2-66, one step's controls. Note the finding's own correction:
  "Weiter" does navigate; the inert "Absenden" beside it is the defect.

## F-2-52 — TS-010-A5 and TS-027-A7 contradict each other on the stage-0 empty proof slot

- Severity: medium
- Source: qa
- Where: `/mitmachen`, `/ueber-uns` at stage 0 · TS-010-A5 vs TS-027-A7 and
  SRC-001 §4
- Steps: `curl -s http://localhost:3100/mitmachen | grep -o 'data-empty-proof="true"'`.
- Expected: TS-010-A5 — at stage 0 "every page renders fully — place search
  present, **no empty slot**, no unresolved skeleton". TS-027-A7 — with no
  cleared testimonial, "6 filled + 1 empty, and the 7th position is not
  backfilled".
- Observed: one `EmptyProofSlot` ("Kein Nachweis") renders on each page at
  stage 0. Judged against TS-010-A5's own words this is a fail; judged
  against TS-027-A7 it is required. Both cannot hold — one criterion needs
  amending. Everything else in A5 passes (place search on all twelve pages,
  no skeletons, no geo lookup).
- Load-bearing note for whoever resolves it: `src/lib/relevance/select.ts:80-105`
  has no type reservation and no no-backfill rule — it slices to
  `SURFACE_COUNTS.stream = 7` and pads with generic empties. Today's 6+1 is
  an artefact of a six-element pool, not an enforced reservation, so
  TS-027-A7's second clause is unguarded even where it is satisfied.
- Round decision: **open-list**
- Reasoning: TS-010-A5 against TS-027-A7 — both cannot hold, and the PM does
  not amend an acceptance criterion to make it satisfiable
  (`plan/guardrails.md`). Recorded for the spec session together with the
  finding's load-bearing note that `src/lib/relevance/select.ts` has no type
  reservation, so A7's no-backfill clause is unguarded even where it is
  satisfied today.

## F-2-53 — "1 Orte ausgewählt": the German plural form is used for a count of one

- Severity: low
- Source: uat (order walk) + qa
- Where: `/dein-kalender/bestellen`, scope chip counter ·
  `app/[lang]/dein-kalender/bestellen/page.tsx:94`
- Steps: open `/dein-kalender/bestellen?orte=beispielwalde`.
- Expected: "1 Ort ausgewählt".
- Observed: "1 Orte ausgewählt". `SELECTED_COUNT` is
  `(n) => \`${n} Orte ausgewählt\`` with no singular branch; the English
  variant has the same shape ("1 places selected").
- Round decision: **open-list**
- Reasoning: low is open-list by `plan/process.md`. A singular branch on the
  scope-chip counter is an M5-budget item, not a round-3 slot.

## F-2-54 — Step 4 promises an email that nothing sends

- Severity: low
- Source: uat (order walk)
- Where: `/dein-kalender/bestellen`, step 4 ·
  `content/pages/dein-kalender/bestellen/*.md`
- Steps: open `/dein-kalender/bestellen?orte=beispielwalde&schritt=4`.
- Expected: the completed-conversion screen makes no promise the system
  cannot keep.
- Observed: "Kopiere den Code jetzt — er wird zusätzlich an die angegebene
  E-Mail-Adresse geschickt." Nothing is sent: the envoy mount has no
  `action` and no named fields, and no address is ever collected. The
  `Demo-Daten` badge does render next to the snippet, so the mock-labelling
  guardrail itself is satisfied — the false promise is the defect.
- Round decision: **open-list**
- Reasoning: low is open-list by `plan/process.md`. Worth naming for the
  content follow-up: it is one sentence, it promises something no mock can
  keep, and it is the first row the M5 budget should buy if the budget
  stretches.

## F-2-55 — Two rows of the D1 URL inventory do not exist, and the criteria that guard it are self-referential

- Severity: medium
- Source: qa
- Where: `src/lib/routes/routes.ts` (route registry), `/start`, `/llms.txt`
  · TS-004-A1, TS-004-A5, TS-004 D1
- Steps:
  - `curl -s -o /dev/null -w "%{http_code}" http://localhost:3100/start` → **404**
  - `curl -s -o /dev/null -w "%{http_code}" http://localhost:3100/llms.txt` → **404**
  - `/robots.txt` and `/sitemap.xml` both 200.
  - `pnpm build` route manifest lists neither path.
- Expected:
  - TS-004 D1 names `/sitemap.xml · /robots.txt · /llms.txt` as machine
    surfaces "per domain", and `/start` as a redirect-only row that exists
    "so that no lead surface hard-codes a third-party URL: every fallback
    links to `/start`".
  - TS-004-A1: "Every D1 path responds 200 on `.de`, bare and `/en/…`".
  - TS-004-A5: "`sitemap.xml`, `robots.txt`, `llms.txt` respond per domain".
- Observed: both rows are absent from the route registry, so neither is
  built. The failure is hidden because the tests naming both criteria
  assert against the registry rather than against D1:
  `src/lib/routes/routing.integration.test.ts:84` iterates `ROUTE_IDS`
  (the twelve content routes only), and the `TS-004-A5` block at `:202`
  checks the sitemap alone and never requests `llms.txt`. Both suites are
  green.
- Consequence for TS-016 D6: with `/start` missing, the lead fallback has
  no indirection target, which is one of the two reasons F-2-32's briefing
  URLs are pasted per page.
- Round decision: **fix-now** (round 3, package C)
- Reasoning: two D1 rows do not exist, and the two criteria that guard them
  assert against the route registry instead of against D1 — a green suite
  certifying its own gap. That is exactly the "tests that assert too little"
  strand this package owns (TS-004-A1, A4, A5). `/start` is also the
  indirection target whose absence is one of the two reasons F-2-32's
  briefing URL is pasted per page, so it pays twice.

## F-2-56 — No route is partially prerendered; four content routes are fully dynamic

- Severity: medium
- Source: qa
- Where: `pnpm build` route manifest · TS-009-A2 (reference: F-2-39)
- Steps: `pnpm build` (exit 0), then read the Route (app) table.
- Expected: TS-009-A2 — "Build manifest: every TS-004 D1 route emits a
  prerendered shell; zero routes are fully dynamic."
- Observed: **zero** routes are marked `◐ (Partial Prerender)`, so no route
  emits a prerendered shell with streamed content at all. Four content
  routes are marked `ƒ (Dynamic)` — `/dein-ort`, `/dein-ort/starten`,
  `/dein-kalender/bestellen`, `/mitmachen/registrieren` — in both locales.
  The remaining eight are fully static `○`, which is the opposite failure
  mode: static, not a shell plus islands.
- Note: `cacheComponents: true` is set (`next.config.ts:8`) and the build
  is green, so TS-009-A1 passes; the flip has simply not produced a PPR
  boundary anywhere, which is the same root cause as F-2-39.
- Round decision: **fix-now** (round 3, package B)
- Reasoning: same root cause and same file as F-2-39, so it closes with it
  on the eight routes that prerender — a shell plus streamed islands rather
  than fully static pages.
- **Settled, do not re-litigate:** `state/open.md` row 131 is the wiring
  wave's recorded reading that the four flow/`?ort=` routes are dynamic by
  design (the request value *is* the page). TS-009-A2's "zero routes are
  fully dynamic" clause therefore stays failed against row 131 and is
  recorded, not chased; row 132 (hash-only CSP vs request-time scripts) is a
  DEC-045 amendment owned outside this run.

## F-2-57 — Three claims ship without the confirmation their criteria make a precondition

- Severity: medium
- Source: qa
- Where: `/deine-region`, `/dein-kalender` · TS-016-A13, TS-024-A19,
  TS-026-A17
- Steps / Expected / Observed, one per criterion:
  - **TS-016-A13** — "The two-working-day promise copy on `/deine-region`
    is present only when the lead-handling process behind it is named and
    signed off (C11); absent otherwise." The promise ships
    (`content/pages/deine-region/de.md:138`, `en.md:138`); C11 in
    `specs/tactical/forms-and-leads.tactical.md` is UNKNOWN and no sign-off
    record exists. The criterion's own fallback ("absent otherwise") is not
    taken. **fail**
  - **TS-024-A19** — "Every sentence in `data-block=\"trust\"` about
    operations and AI names a hub record in its `derived_from`. A sentence
    without one blocks the block from shipping." `pnpm check:content`
    reports `content/pages/dein-kalender/de.md › dein-kalender-6-trust`
    and its EN twin as "[provenance] empty `derived_from`" — a warning, not
    a block, and the block ships. **fail**
  - **TS-026-A17** — "Before the page claims the map view as part of the
    package, the offering owner confirms it is shippable to a buyer.
    Unconfirmed → the claim is removed, not qualified." `/deine-region`
    carries the map claim ("Der ganze Landkreis auf einer Karte …"); no
    confirmation record exists, and F-2-21 shows the map-shaped placeholder
    is still in the manifest. **fail**
- Round decision: **fix-now** (round 3, package A)
- Reasoning: two of the three criteria prescribe the action themselves —
  "absent otherwise" (TS-016-A13) and "the claim is removed, not qualified"
  (TS-026-A17) — so the run discharges them without the external
  confirmations, which is the opposite of blocked. Both claims sit on
  conversion pages that the reviews and the user tests run against.
  TS-024-A19's half is a `derived_from` frontmatter line on two artefacts.

## F-2-58 — The axe sweep covers one of the three declared themes, so five criteria are only partly discharged

- Severity: medium
- Source: qa (`web-design-guidelines`)
- Where: `e2e/a11y.spec.ts:26-30` · TS-002-A1, TS-029-A12, TS-016-A8,
  TS-023-A16, TS-025-A12 (reference: F-2-6, which delivered the instrument)
- Steps: read the spec header; run `pnpm e2e` and count the generated cases
  (24 routes × 2 viewports = 48, all green).
- Expected: all five criteria say "in all three themes" (TS-002-A1 and
  TS-029-A12 literally "in all three [D4] themes"; TS-016-A8 and
  TS-025-A12 "in light, dark and high contrast"; TS-023-A16 "in all three
  themes").
- Observed: the sweep "runs the default (light, no-preference) theme only —
  the three-theme matrix is out of this bounded round and stays a gap", in
  the spec file's own words. Dark and high-contrast are never swept on any
  route. Three further clauses have no instrument at all: the widget's
  shadow root (TS-016-A8, TS-025-A12), the per-step sweep of the register
  and order flows (TS-023-A16, TS-025-A12 — only the flows' first step is
  in the route list), and "after each advance focus sits on the new step's
  heading" (TS-023-A16).
- Note: what the instrument does cover is genuinely green, at both
  reference viewports, on all 24 routes, and Lighthouse accessibility
  measures 100 on mobile and desktop for `/` on the preview. This finding
  is about the uncovered remainder, not about a regression.
- Round decision: **open-list**
- Reasoning: an instrument gap, not a regression — what the sweep covers is
  green on 24 routes at both viewports, and Lighthouse a11y measures 100.
  Round 3 is the last round before the abort criterion and the budget goes
  to defects, not to widening instruments. The more valuable uncovered half
  (a per-step sweep of the register and order flows, and focus landing on
  the new step's heading) goes on the list with it, as the first thing the
  M5 tool-checks gate buys.

## F-2-59 — The archive filter updates its count but hides no rows

- Severity: high
- Source: qa (cross-checked twice after a disagreeing first measurement)
- Where: `/ueber-uns/archiv`, `/en/about/archive` · TS-028-A4 (and TS-028-A6,
  which becomes vacuous)
- Steps:
  1. Open `/ueber-uns/archiv` and read the count line: "6 VON 6 EINTRÄGEN",
     six rows rendered, one per type.
  2. Click the chip "Presse".
  3. Read the count line and the rows again.
- Expected: TS-028-A4 — "Selecting two chips shows the union; an entry
  carrying both types appears exactly once." Selecting one chip must show
  only the rows of that type.
- Observed: the count line changes to "**1 VON 6 EINTRÄGEN**" and the chip's
  `aria-pressed` flips to `true`, but **all six rows stay rendered and
  visible**. The "Auszeichnung" row (04. November 2025) is still in
  `main`'s text and still returns client rects after "Presse" is selected.
  Adding a second chip changes nothing either. The filter therefore
  announces a filtered result set to a screen-reader user while the visual
  list is unfiltered — the two disagree.
- Measurement note, because it nearly went the other way: a first pass
  using `offsetParent !== null || display !== "none"` as the visibility
  test was wrong, and a parallel check that read only the count line
  concluded the filter worked. The verdict above rests on
  `getClientRects().length > 0` per row **and** on the rendered `main`
  text before and after the click, which agree with each other.
- Consequence for the chaos protocol: C-K-3 verified the chips are
  keyboard-reachable and that Enter activates them; it did not verify what
  activation does. That gap is what this finding closes.
- Round decision: **fix-now** (round 3, package B)
- Reasoning: high — the filter announces "1 von 6" to a screen-reader user
  while all six rows stay visible, so the accessible result and the visual
  result disagree; that is an a11y failure on top of TS-028-A4, and
  TS-028-A6 is vacuous until it is fixed. Contained in
  `src/components/archive-filter/**`, whose `selection.ts` is already
  unit-tested — the gap is the render, not the selection, which is why the
  green unit tests did not catch it.

## F-2-60 — `buy-calendar-licence` fires a second time on client-side back/forward

- Severity: high
- Source: qa
- Where: `/dein-kalender/bestellen` step 4 · TS-012-A5, TS-016-A12,
  TS-025-A11
- Steps:
  1. Open `/dein-kalender/bestellen?orte=beispielwalde&schritt=3`.
  2. Click "Weiter" — a Next `<Link>`, zero document requests recorded, so
     this is a soft navigation. One `buy-calendar-licence` event with
     `stage: completed` fires.
  3. Press Back, then Forward. Both are soft navigations (still zero
     document requests).
- Expected: TS-012-A5 — "Each wired D4 trigger emits exactly one event …
  client-side navigation back and forth does not replay it"; TS-016-A12 —
  "once per completed flow"; TS-025-A11 — "Exactly one
  `buy-calendar-licence` event with stage `completed` fires".
- Observed: a **second** identical `buy-calendar-licence` /
  `stage: completed` event fires on the forward navigation. The trigger is
  `FireConversionOnMount` at
  `app/[lang]/dein-kalender/bestellen/page.tsx:270`, which re-mounts.
- Impact: the one goal that is wired at `stage: completed` over-counts. The
  briefing handover does **not** replay on reload, so the defect is
  specific to the step-4 completion mount.
- Note: the event currently goes to `createMockTracker()` by decision, so
  no real number is wrong yet — but the trigger contract is, and the real
  adapter flag is the only thing between this and a wrong number.
- Round decision: **fix-now** (round 3, package A)
- Reasoning: high, and independently reproduced by the chaos run on the
  fresh preview with direct console counts (C-H-6, `round-2-chaos-hasty-clicker.md`
  Run 2) — so the trigger contract is wrong in the deployed surface, not
  only in the local reading. It is the one goal wired at `stage: completed`,
  and the mock tracker is the only reason no real number is wrong yet
  (`state/open.md` row 130 flips the real adapter on). Fix at
  `FireConversionOnMount` (`bestellen/page.tsx:270`) plus
  `src/components/conversion-tracker/**`, with a per-flow dedupe key rather
  than a mount.

## F-2-61 — `/dein-ort`'s empty state changes neither the primary CTA nor position 2, and leaks raw markdown

- Severity: high
- Source: qa
- Where: `/dein-ort?ort=<covered place with no dates>` · TS-008-A6
- Steps: open `http://localhost:3100/dein-ort?ort=38165` at 1280×800
  (`38165` resolves to the demo place "Beispielhausen", which has no dates).
- Expected: TS-008-A6 — "focus job and primary CTA switch to publishing,
  the place name appears escaped in the copy, URL and canonical are
  unchanged, position 2 renders labelled as surroundings."
- Observed:
  - `[data-cta="primary"]` is still the place search's
    `<button type="submit">Suchen</button>`. The only publishing action,
    "Ersten Termin veröffentlichen", carries no `data-cta` and targets
    `/mitmachen`, not the `register-as-publisher` target
    `/mitmachen/registrieren`. The primary conversion does not switch.
  - Position 2 renders **empty**: the section that shows "Diese Woche in
    der Nähe" for `?ort=07743` has no surroundings heading and no dates
    here.
  - The lead paragraph renders the raw placeholder
    ``Ersten Termin veröffentlichen → `/mitmachen` `` — literal backticks
    and an arrow, as visitor copy.
  - Passing clauses: URL and canonical unchanged
    (`canonical = …/dein-ort`), and the place name is escaped
    (`?ort=<img src=x onerror=…>` injects no element).
- Round decision: **fix-now** (round 3, package A)
- Reasoning: high — TS-008-A6's whole point is that the empty branch switches
  the conversion, and none of the three clauses happens; on top of it, raw
  markdown (backticks and an arrow) ships as visitor copy, which the
  dummy-content rule forbids outright. Same page and same live layer as
  F-2-30 and F-2-49, so all three land together.

## F-2-62 — Entering registration from `/dein-ort/starten` skips step 1, and the place is neither shown nor changeable

- Severity: high
- Source: qa
- Where: `/dein-ort/starten` → `/mitmachen/registrieren` · TS-023-A7
- Steps: open `/dein-ort/starten?ort=07743` and click the primary CTA
  ("07743 eintragen" → `/mitmachen/registrieren?ort=07743`).
- Expected: TS-023-A7 — "Following the CTA on `/dein-ort/starten?ort=X`
  lands on this page with step 1 answered as X, **the place visible and
  changeable, and step 1 not skipped**."
- Observed: the page renders "SCHRITT 2 VON 3 — Wer veröffentlicht die
  Termine?". Step 1 is not displayed at all, the resolved place name
  appears nowhere on the screen, and no control offers to change it. A
  visitor who mistyped her postcode on the previous page cannot see or
  correct which place she is registering for.
- Relation to F-2-30: the same CTA is what the founding path should hand
  over; with F-2-30 open, almost nobody reaches this page in the first
  place, which is why the defect has not been noticed.
- Round decision: **fix-now** (round 3, package A)
- Reasoning: high — TS-023-A7 is explicit that step 1 is not skipped and the
  place is visible and changeable, and a visitor who mistyped her postcode
  on the previous page cannot see or correct it. It is the hand-over that
  F-2-30 restores traffic to, so the two must land in the same round or the
  founding path opens onto a broken step.

## F-2-63 — `/deine-region` asserts a county at stage 0, and names it with a raw internal id

- Severity: medium
- Source: uat (`/deine-region` walk) + qa
- Where: `/deine-region`, `/en/your-region`, block 3 · TS-026-A10,
  TS-026 D4
- Steps: open `/deine-region` in a clean context — no geolocation, no
  `?ort=`, no referrer.
- Expected: TS-026-A10 — "Stage 0 …: block 3 renders the place search,
  **asserts no county name** and shows no county-dependent counter";
  TS-026 D4 — "Without an anchor no county name is asserted and the
  county-dependent parts do not render."
- Observed: block 3's heading reads "So sieht das heute schon aus:
  Beispiele aus dem **Landkreis geoname.900001**", followed by five county
  example places. A county is asserted with no anchor, and the asserted
  name is an unresolved geo-api identifier rendered as visitor copy — the
  same class of leak as F-2-35. The place search *is* present in the block
  and the block sequence matches the located render, so the rest of A10
  holds.
- Round decision: **fix-now** (round 3, package A)
- Reasoning: on the `request-licence-quote` entry page, and two defects in
  one heading — a county asserted with no anchor (TS-026-A10, TS-026 D4) and
  a raw `geoname.900001` rendered as visitor copy, the same leak class as
  F-2-35. UAT named it unprompted, which is the signal that it reads as
  broken rather than as unfinished.

## F-2-64 — The newsletter consent line links a legal anchor that does not exist in English

- Severity: medium
- Source: qa
- Where: the footer newsletter block on all 24 routes · TS-004-A8,
  TS-004-A9
- Steps: open any `/en/…` route, read the consent line's
  `Datenschutzerklärung` link target, then open it.
- Expected: TS-004-A8 — "every internal link resolves within the D1
  inventory"; TS-004-A9 — each legal link resolves "to its anchor on
  `/rechtliches`".
- Observed: the link targets `/en/legal#datenschutz`. The English legal
  page uses `#privacy`; there is no `#datenschutz` id on it, so the link
  lands at the top of the page instead of at the privacy section. The three
  named footer legal links (Imprint / Privacy / Accessibility) are correct
  — this is the fourth, inline one in the consent sentence.
- Note: the same consent sentence is the German-on-English string of
  F-2-33 and carries the `Q-020` id of F-2-35; all three defects sit in one
  block.
- Round decision: **fix-now** (round 3, package A)
- Reasoning: one `href` in the footer consent line, wrong on all 24 routes,
  and a broken internal link under TS-004-A8. It sits in the same block as
  F-2-33 and F-2-35, which package A is opening anyway — it costs nothing to
  fix while that block is open.

---

# Findings — Round 2, chaos Run 2 (Hasty Clicker, Playwright)

Triaged by the Project Manager from
`state/findings/round-2-chaos-hasty-clicker.md` **Run 2 (Playwright)**
(C-H-6…C-H-16), which landed after the QA acceptance sweep had closed. The
run used the documented fallback (persona-scripted Playwright against the
fresh preview, after round 1's agent-browser session could not type into
fields) and counted every conversion fire directly from the mock tracker's
console lines, so the numbers below are measured, not inferred.

Dispositions for the Run-2 observations that are **not** new findings:

| Chaos id | Disposition |
| --- | --- |
| C-H-6 (`buy-calendar-licence` twice after Back/Forward) | **already filed as F-2-60.** Not re-filed; the chaos evidence is added to F-2-60's reasoning, because it reproduces the defect on the deployed preview with console counts where QA had it locally |
| C-H-8 (double-click on step 3 → 4 fires once) | **clean pass**, recorded by the persona as a contrast case — no finding |
| C-H-11 (two tabs, interleaved quote submissions) | **clean pass** — one event per tab, no cross-tab value bleed |
| C-H-13 (`registrieren` commits via `?ort=` where `bestellen` uses `?orte=` + chip) | **not a defect.** Two different flows with two different specs: TS-023 registers one place, TS-025's scope picker selects several, so an explicit add step exists there and not here. The asymmetry is specified |
| C-H-14 (language switch double-click) | **not a defect** — confirms round 1's C-H-4 was a selector/tooling failure. The duplicate `<nav aria-label="Sprache">` it noticed is F-2-3, resolved in `2eeab26` |
| C-H-15 (navigate away mid-search, then Back) | **clean pass** — no stale or duplicated state |
| C-H-16 (roam, double-clicking the first nav link on eight routes) | **not a defect** — all eight console errors are the identical known `vercel.live` preview CSP block, F-2-27 |

## F-2-65 — `request-licence-quote` fires twice from one rapid double-click on "Absenden"

- Severity: high
- Source: chaos:hasty-clicker (C-H-7, Playwright Run 2, fresh preview)
- Where: `/deine-region/angebot` submit button ·
  `src/components/envoy-form-mount/envoy-form-mount.tsx` · TS-012-A5,
  TS-016-A12
- Steps: fill Organisation / Name / E-Mail / Telefon / Nachricht, then issue
  two `click()` calls at "Absenden" back to back with no wait between them.
- Expected: TS-012-A5 — each wired trigger emits exactly one event;
  TS-016-A12 — once per completed flow.
- Observed: `[analytics:mock] conversion {goalId: request-licence-quote,
  stage: completed}` twice for the one user action. Nothing disables or
  debounces the button, so the second click starts its own tracked
  submission.
- Relation: the same family as F-2-60, and the opposite mechanism — F-2-60
  is a history revisit, this is a click race. C-H-8 shows the bestellen
  completion link does **not** double-fire, so the defect is this button,
  not every control.
- Round decision: **fix-now** (round 3, package A)
- Reasoning: high, on a wired conversion path, and the second of the two
  `stage: completed` goals to over-count — with F-2-60 open, both of the
  run's completed-stage goals are wrong. The fix is disable-on-submit plus a
  one-per-flow guard in the one component A already opens for F-2-48,
  F-2-51 and F-2-66. It is also the mechanical half of F-2-66: a button that
  cannot be pressed twice is what makes the missing confirmation survivable.

## F-2-66 — The quote form gives no success feedback at all after a submission

- Severity: high
- Source: chaos:hasty-clicker (C-H-10) + uat (`/deine-region/angebot` walk)
- Where: `/deine-region/angebot` ·
  `src/components/envoy-form-mount/envoy-form-mount.tsx` · TS-016-A9,
  `plan/guardrails.md` (mock rule)
- Steps: fill and submit the quote form once, cleanly, and watch the page.
- Expected: TS-016-A9 requires focus to move "to the success message", which
  presupposes one; the mock rule requires every mocked component to deliver
  dummy data "never as a hole, never as a bare empty state".
- Observed: after the console-confirmed single fire, the fields are simply
  empty again — same layout, same "Absenden" button, no message, no disabled
  or loading state at any captured point. Nothing distinguishes "submitted"
  from "page just loaded". UAT reached the same dead end independently and
  wrote that she would not know whether to wait for a reply or try again.
- Round decision: **fix-now** (round 3, package A)
- Reasoning: high — the completion of a wired conversion goal is invisible
  to the visitor, on the one flow whose whole purpose is a hand-off to a
  human. It is also the direct risk multiplier for F-2-65: a visitor who
  sees no confirmation has every reason to press "Absenden" again. The
  widget is a declared mock (`state/open.md` row 7), which is precisely why
  the mock owes a labelled success state rather than nothing; building it
  is the mount's job, not the third party's, so it is not blocked.

## F-2-67 — Reloading immediately after "Weiter" on order step 3 silently swallows the advance

- Severity: medium
- Source: chaos:hasty-clicker (C-H-9, Playwright Run 2)
- Where: `/dein-kalender/bestellen`, the step 3 → step 4 transition ·
  `app/[lang]/dein-kalender/bestellen/page.tsx`
- Steps: from step 3, click "Weiter" and trigger a page reload immediately,
  with no wait — a hasty reload during the in-flight client-side transition.
- Expected: the reload either lands on step 4 (the transition had
  committed) or stays on step 3 with the click ready to retry and visibly
  so.
- Observed: the reload lands back on `schritt=3` with **zero** conversion
  events logged; the in-flight history push is discarded before the URL
  updates. No error, no pending state, no indication that the click did not
  count.
- Round decision: **fix-now** (round 3, package A)
- Reasoning: medium on a paid conversion path, which `plan/process.md` makes
  a fix-now case regardless of cost — and the cost here is small, because
  the flow's state is already entirely in the URL (TS-025 D8): a pending
  state on the step's primary control is enough for the visitor to see that
  the click was lost. No dedupe or session store is needed, and none may be
  added — TS-025 D8 is explicit that nothing is stored between page views.

## F-2-68 — Controls in the footer region move up to 174 px between first paint and settle

- Severity: high
- Source: chaos:hasty-clicker (C-H-12, Playwright Run 2, both viewports)
- Where: `/` at 1280×800 and 360×640 · TS-009-A8 (reference: F-2-39,
  F-2-56; TS-003-A7 / TS-003 D8 are the same rule but out of scope at this
  gate)
- Steps: load `/` with `waitUntil: domcontentloaded`, read
  `getBoundingClientRect()` for the `h1` and the first controls ~50 ms
  later, then read the same elements after `networkidle` plus a 1 s settle.
- Expected: TS-009-A8 — CLS < 0.1 on every content page with all islands
  streaming; TS-003 D8 — reserved space is how that is met.
- Observed (desktop): second "Suchen" button y `4204 → 4366` (+162 px),
  "Absenden" y `4764 → 4938` (+174 px), "Anmelden" y `4974 → 5148`
  (+174 px), `h1` width `450 → 474` (a font-swap reflow). Mobile shows the
  same shape at +12 px. A visitor who clicks a below-the-fold control inside
  the settling window — the hasty clicker's defining habit — hits empty
  space or the wrong control.
- Round decision: **fix-now** (round 3, package B)
- Reasoning: high — an in-scope AC (TS-009-A8) fails on the home page at
  both reference viewports, and the failure mode is a mis-click on the
  contact and newsletter controls rather than a cosmetic shift. Same root
  cause and same package as F-2-39 and F-2-56: nothing reserves an island's
  box because no island has a fallback box, so the fix is the reserved-space
  half of the boundaries B is mounting anyway, plus the font-swap reflow in
  `app/styles/**`. Measured numbers exist, so the retest has a target even
  without a CLS harness.
