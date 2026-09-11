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
- Round decision: (Project Manager to set)
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

## F-2-1 — `pnpm build` fails typecheck on `next-2026`

- Round decision: **fix-now**
- Reasoning: `plan/guardrails.md` — "nothing enters the pipeline that is
  not green locally". A red typecheck blocks the QA sweep, the preview
  deploy and the e2e suite, i.e. all three gate strands at once. The
  concrete fix is a `pnpm check` regression sweep on `next-2026` HEAD
  once this run's parallel work packages have landed (row 65), not a
  file-by-file chase: both named files may already be fixed by the time
  the fix round starts, and new ones may have appeared.

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
