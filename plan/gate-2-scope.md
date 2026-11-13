# Gate 2 — scope

The run merged the M2 (structure), M3 (content) and M4 (behaviour) page
work into one build wave, so one gate closes all three. This file fixes
what the gate's three strands sweep, walk and attack, and what they do
**not**. It references acceptance criteria by id; it never copies or
rewords them — the tactical specs in `specs/tactical/` remain the
contract (`plan/guardrails.md`).

Prioritization for this gate: `state/findings/round-2.md`.
Loop mechanics and severities: `plan/process.md`.

## 1 — QA acceptance sweep

Skills per `plan/process.md`: `webapp-testing`, plus
`web-design-guidelines` for the a11y/UX criteria; `semgrep` and
`differential-review` for the security sweep.

### 1.1 Structure

| TS | Spec | AC group to sweep | Notes |
| --- | --- | --- | --- |
| TS-WEB-0004 | `TS-WEB-0004--url-and-routing.tactical.md` | A1–A11 | route tree, translation map, error pages, redirect skeleton, the `/api/*` GET-only rule (A10) and the one-hostname rule (A11) — both now have live `app/api/*` routes to check against |
| TS-WEB-0006 | `TS-WEB-0006--page-composition.tactical.md` | A1–A15 | A6 (band on every page) fails on registration steps 2–3 by design — record as F-2-10, not as a new finding |
| TS-WEB-0002 | `TS-WEB-0002--accessibility.tactical.md` | A1–A12 | A1 needs the axe instrument from F-2-6; until it lands, A1 is reported blocked, not passed |
| TS-WEB-0001 | `TS-WEB-0001--locale-routing.tactical.md` | A1–A3, A5–A8, A10, A11 | A4 and A9 are out of scope (§4) |

### 1.2 Pages

Every page spec, full AC set, in **de and en**, at the reference
viewports (360 px and desktop):

| Route (de / en) | TS | AC group |
| --- | --- | --- |
| `/` · `/en/` | TS-WEB-0019 | A1–A15 |
| `/dein-ort` · `/en/your-place` | TS-WEB-0020 | A1–A13 |
| `/dein-ort/starten` · `/en/your-place/start` | TS-WEB-0021 | A1–A15 |
| `/mitmachen` · `/en/take-part` | TS-WEB-0022 | A1–A16 |
| `/mitmachen/registrieren` · `/en/take-part/register` | TS-WEB-0023 | A1–A16 |
| `/dein-kalender` · `/en/your-calendar` | TS-WEB-0024 | A1–A19 |
| `/dein-kalender/bestellen` · `/en/your-calendar/order` | TS-WEB-0025 | A1–A14 |
| `/deine-region` · `/en/your-region` | TS-WEB-0026 | A1–A17 |
| `/deine-region/angebot` · `/en/your-region/quote` | TS-WEB-0026 | A1–A17 (the quote-flow half) |
| `/ueber-uns` · `/en/about` | TS-WEB-0027 | A1–A15 |
| `/ueber-uns/archiv` · `/en/about/archive` | TS-WEB-0028 | A1–A14 |
| `/rechtliches` · `/en/legal` | TS-WEB-0029 | A1–A10, A12–A14 (A11 out of scope, §4) |

Known-deviating ACs, to be **recorded against the finding id, not
re-filed**: TS-WEB-0021-A2/D10 (F-2-13), TS-WEB-0023-A6 (F-2-5, blocked until the
fixture lands), TS-WEB-0026 D3 (F-2-21), TS-WEB-0029-A12 (F-2-6), TS-WEB-0029-A14
(F-2-19), TS-WEB-0025 D9 vs TS-WEB-0011 D9 (F-2-23).

### 1.3 Content

| TS | AC group | Notes |
| --- | --- | --- |
| TS-WEB-0007 | A1, A2, A4, A5, A7, A8, A9, A11, A12, A14, A15 | sweep normally |
| TS-WEB-0007 | A3, A6, A10, A13, A16 | blocked — no check exists; report against F-2-18 |

Plus the eight-point content compliance check from the communication
principles over all twelve routes in both languages, and the
`Demo-Daten` / `provenance: generated` marking discipline
(`plan/guardrails.md`, dummy-content rule) — F-2-4 is the known gap on
`/en`.

### 1.4 M4 systems

| TS | Spec | AC group | Notes |
| --- | --- | --- | --- |
| TS-WEB-0005 | `TS-WEB-0005--relevance-engine.tactical.md` | A1–A16 | A6 is unsatisfiable as written (open row 66) — record, do not reword |
| TS-WEB-0008 | `TS-WEB-0008--live-data.tactical.md` | A1–A14 | positions 1, 2, 4 answer from mocks (rows 90, 91); A8/A12 not built (F-2-15) |
| TS-WEB-0009 | `TS-WEB-0009--rendering-and-resilience.tactical.md` | A1–A13 | A1 depends on the Cache Components flip in flight; A12 is F-2-16 |
| TS-WEB-0010 | `TS-WEB-0010--personalization.tactical.md` | A1–A15 | stage 0 and stage 1 (mocked resolver, row 70) are walkable; stage 2 is F-2-14 |
| TS-WEB-0011 | `TS-WEB-0011--seo.tactical.md` | A1–A14 | JSON-LD wiring is in flight; A5/A6/A14 are re-checked at retest |
| TS-WEB-0012 | `TS-WEB-0012--analytics.tactical.md` | A1–A11 | event registry is green; the eTracker mount is in flight (row 83) |
| TS-WEB-0013 | `TS-WEB-0013--privacy.tactical.md` | A1–A3, A5 | A4, A6–A8 need the deployed surface (§4) |
| TS-WEB-0016 | `TS-WEB-0016--forms-and-leads.tactical.md` | A1–A14 | envoy widget and newsletter are declared mocks (rows 7, 22) |

### 1.5 Security sweep (TS-WEB-0014 scope)

`semgrep` over the tree and `differential-review` over the milestone
diff, per the skill matrix. Header and CSP criteria: TS-WEB-0014-A1 and
TS-WEB-0014-A2 — A1's static guard is F-1-2 and is `fix-now`; the preview's
`'unsafe-inline'` branch is F-2-27 and is recorded, not re-filed.

## 2 — UAT walk

The instrument is naive eyes; the report is a signal, not a verdict
(`plan/project-plan.md`). UAT walks the **wired** conversion goals of
`@schafe-vorm-fenster/goals`, in the order a real visitor meets them,
mapped through `src/lib/analytics/event-registry.ts`:

| Conversion goal | Stage | Route(s) to walk | What the walk ends at |
| --- | --- | --- | --- |
| `save-calendar-to-homescreen` | handover | `/` and `/dein-ort` (place search), plus the 404 place search | the click that opens a place calendar on `app.*` |
| `register-as-publisher` | handover | `/mitmachen` → `/mitmachen/registrieren` (all steps) | the registration CTA that navigates to `app.*` |
| `request-product-briefing` | handover | `/dein-kalender` and `/deine-region` | the outbound click to the Google Calendar booking link |
| `buy-calendar-licence` | completed | `/dein-kalender` → `/dein-kalender/bestellen` | invoice checkout concluded, embed code shown |
| `request-licence-quote` | completed | `/deine-region` → `/deine-region/angebot` | the envoy widget reporting a successful submission (mock) |

Walk all five in German. Repeat the first two in English
(`/en/your-place`, `/en/take-part/register`) — that is where F-2-4's
German labels sit and where a naive English visitor first loses trust.

Not walked, because nothing is wired to walk (registry `stage: null`):
`publish-first-event` (happens in the app), `request-ad-placement`
(Q-0006), `order-promotion-material` (Q-0005), `publish-events-regularly`
(recurrence rule open in the hub).

Record hesitation points, not verdicts. Each one becomes a finding, a
work package, or an open-list row with one line of reasoning — the
Project Manager decides, per `.agents/roles/project-manager.md`.

## 3 — Chaos runs

Four personas, one local Chrome session each against the dev server
(`PORT=3100`), unscripted. First targets, in this order:

| Persona | Targets first |
| --- | --- |
| Boundary Tester | the **place search** on `/`, `/dein-ort` and the 404 page: non-existent places, foreign ZIPs, coordinates as text, umlauts in every position, trailing whitespace, `<script>alert(1)</script>`, 10.000 characters. Then manufactured deep links and wrong locale prefixes — `/en/dein-ort` is known to answer 200 (F-2-8) and an unknown `/en/…` is known to answer a German 404 body (F-2-7) |
| Hasty Clicker | **bestellen** and **angebot**: double-submit the order and the quote form, reload during submission, hammer Back/Forward through both flows, run the same flow in two tabs. Watch the conversion events — `buy-calendar-licence` and `request-licence-quote` fire at `completed` and must fire exactly once |
| Form Abandoner | **registrieren**: abandon at a different step each time, return by direct URL, by Back, and via the navigation; then abandon mid-order and mid-briefing and return after a cleared session. The registration flow is a plain GET form across steps, so resumption state is the whole question |
| Keyboard-Only | the **archive filter** on `/ueber-uns/archiv` (client-side, no-refetch chips) and the **language switch** in the footer, then every conversion path end to end without a mouse. The 3 px violet focus ring must always show. Two `<nav>` landmarks currently share one accessible name on every second-level page (F-2-3) |

Every persona additionally touches the **language switch** on whatever
page it happens to be on: TS-WEB-0001-A7's "equivalent page, never the home
page" was only recently wired, and the layout still carries a second
chrome tree in flight.

## 4 — Explicitly out of scope at this gate

| AC / area | Why | Owner |
| --- | --- | --- |
| TS-WEB-0015-A3, A4, A5 | stage-2 CI (DEC-0031): the GitHub Actions workflows exist but `pnpm install` is refused by GitHub Packages for every `@schafe-vorm-fenster/*` package; unblocking needs a dashboard-only org setting (open row 64) | Jan (org owner), then M5 |
| TS-WEB-0015-A7, A8, A10 | canary production deployment, rollback, auto-merge — production surface | after the run (go-live), never this run (`plan/guardrails.md`) |
| TS-WEB-0015-A9 | Lighthouse CI, bundle guard, axe sweep as a pipeline `Budgets` job | M5 (the tool checks gate at M5; the axe *instrument* itself is F-2-6 and is due now) |
| TS-WEB-0015-A11 | `next.schafe-vorm-fenster.de` serves `next-2026` | after the run — the `next.*` domain is not wired, and domains are Jan's |
| TS-WEB-0015-A12 | branch protection contexts and repository secrets | after the run |
| TS-WEB-0001-A4 | the `.de` apex → `www` 301 against the real domain | after the run (production domains); the host matrix is implemented and unit-tested (open row 86) |
| TS-WEB-0001-A9 | every D1 domain resolves over HTTPS in its TLD default language | after the run; the landing-only `.pl`/`.at`/`.com` domains have no distinct content in this tree (open row 85) |
| TS-WEB-0013-A4, A6, A7, A8 | the deployed CSP allowlist and the closed request set measured on the deployment | M5 preview-smoke strand (open row 89); A1–A3 and A5 are swept locally now |
| TS-WEB-0029-A11 | production build fails while `#barrierefreiheit` has no document — needs a real `next build` with `VERCEL_ENV=production` | M5 / CI owner (open row 115); the guard is written and typechecks |
| TS-WEB-0003 (A1–A8), TS-WEB-0017 (A1–A17) | performance budgets and the technical foundation | closed at the M1 gate; re-checked as regression at M5 (font budget deviation: open rows 19, 20) |
| TS-WEB-0018 | scope boundaries | M5 |

Two systems are in scope but answer from **mocks** by decision, not by
defect — the mock rule (`plan/guardrails.md`) makes that the expected
state, and every one has a `Mock aktiv` row: geo-api and events-api
reads (rows 70, 77, 78, 90, 91), the envoy widget and the newsletter
(rows 7, 22), the `organizerId` minting in the order flow (row 129), and
the registration handover target (row 125). QA sweeps their ACs against
the mocked behaviour and against the labelling discipline, not against
live upstreams.
