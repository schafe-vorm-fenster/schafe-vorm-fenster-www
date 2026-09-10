---
artefact: tactical-spec
id: TS-012
profile: system
status: DRAFT
implements: [WEB-Q-020, WEB-Q-021, WEB-Q-022, WEB-Q-028]
sources: [SRC-006, SRC-010, SRC-003]
decisions: [DEC-004, DEC-013, DEC-016, DEC-017, DEC-028]
---

# TS-012 — Analytics and Conversion Measurement

## Purpose

How the website measures, under a cookieless, banner-free constraint that
is binding independently of the tool. Fixes the collector inventory, the
eTracker loader as the interim implementation, the event registry keyed
on the hub's conversion goal IDs, the boundary at which the website stops
measuring and the app takes over, and campaign attribution via the
inherited `etcc_*` parameters.

Conversion goals themselves are **not defined here**. They live in
`@schafe-vorm-fenster/goals` and are
referenced by ID (ADR-001). Which page carries which goal is
`pages.req.md` (WEB-F-010–019). Loading budgets are TS-003; the CSP
allowlist is WEB-Q-030 (security spec); the trust claim made from
cookielessness on `/dein-kalender` is WEB-Q-023 (content spec) — this
spec only keeps that claim true.

## Determinations

### D1 — The binding property: cookieless, banner-free [FIXED: DEC-004, WEB-Q-020]

The property is the requirement; eTracker is one implementation of it
(D2). Any successor inherits this table unchanged.

| Rule | Consequence |
| --- | --- |
| No cookie is set for analytics, first- or third-party | eTracker runs in its cookie-free mode (D2) |
| No persistent identifier in `localStorage`, `sessionStorage`, IndexedDB, cache keys, or URL | no visitor ID the website can carry or hand on |
| No returning-visitor recognition, no fingerprinting, no cross-device stitching | sessions are the largest unit; "unique visitors" over time is not a figure this site produces |
| No cross-domain identity transfer to `app.*` | the funnel joins at aggregate level only (D5) |
| No consent UI anywhere on the site | there is nothing to consent to; DEC-013 keeps it that way by banning third-party embeds |
| IP handling is anonymised, no raw storage | vendor-side setting, verified in the account (D2, open point) |

The absence of a banner is not a design choice that can be traded away
later: a banner would have to appear the moment any collector outside D7
is added.

### D2 — eTracker as interim implementation [FIXED: DEC-004, WEB-Q-021, SRC-010; loader details PROPOSED]

The legacy configuration is extracted from SRC-010
(`legacy-content/app/layout.tsx`) and carried over unchanged in meaning:

| Loader attribute | Value | Why it is binding |
| --- | --- | --- |
| script id | `_etLoader` | vendor contract |
| `data-block-cookies` | `true` | this is what makes D1 true at the vendor |
| `data-secure-code` | the legacy account code, from SRC-010, supplied as a build-time env var — never inlined in a committed file | one code = one property (D3) |
| `data-page-changed-detection` | `url` | App Router client navigation must produce page views without a full load |
| `src` | `https://code.etracker.com/code/e.js` | scheme pinned (legacy used protocol-relative); host is the CSP entry (WEB-Q-030) |
| loading | `async`, deferred, outside the LCP critical path | TS-003 D4 |

**Replaceability is a build rule, not an intention.** No page, component,
or content file calls the eTracker API directly. Everything goes through
one internal module (working name `lib/analytics`) exposing exactly:
`trackPageView()` (only if `data-page-changed-detection` proves
insufficient) and `trackConversion(goalId, stage, attributes)`. Swapping
the vendor replaces that module and nothing else; the D4 registry, the
event IDs, and every call site survive the swap.

### D3 — One account, one property [FIXED: DEC-028]

One eTracker account, one property, one secure code — all website
domains (`.de`, `.pl`, `.at`, `sheepoutside.com`) **and the app**.
Domain and language are dimensions *inside* the property (carried as
event attributes / the URL), never a reason to split properties.

Per-country properties are reconsidered when `.pl` / `.at` carry real
content (DEC-028); the reconsideration does not reopen D1.

Consequence for reporting: because there is no visitor identity (D1),
"one property" buys **shared vocabulary and shared campaign data**, not a
joined per-user funnel. Website handover counts and app completion counts
sit in the same report and are compared as ratios over a period.

### D4 — Event registry: one event per conversion goal [FIXED: DEC-016, WEB-Q-028; per-goal triggers PROPOSED]

Launch ships **conversion measurement only**. One event per conversion
goal, no exploratory event zoo (D7). The event name **is** the hub goal
ID verbatim — the site does not invent a parallel vocabulary.

Every event carries a fixed `stage` dimension: `handover` (the last thing
the website can observe) or `completed` (the goal is finished here).
The app emits `completed` for the goals it finishes, into the same
property (D3).

| Conversion goal (hub ID) | Stage emitted by the website | Trigger | Surface |
| --- | --- | --- | --- |
| `register-as-publisher` | `handover` | click of the registration CTA that navigates to `app.*` | `/mitmachen/registrieren` (WEB-F-013) |
| `publish-first-event` | — none | happens entirely in the app | app emits `completed` |
| `save-calendar-to-homescreen` | `handover` | click that opens a place calendar on `app.*` | `/dein-ort`, `/`, 404 place search |
| `buy-calendar-licence` | `completed` | invoice checkout concluded, embed code shown (WEB-F-094) | `/dein-kalender/bestellen` (WEB-F-015) |
| `request-licence-quote` | `completed` | envoy widget reports a successful submission (WEB-F-090) | `/deine-region/angebot` (WEB-F-016) |
| `request-product-briefing` | `handover` | outbound click to the Google Calendar booking link (WEB-F-093) — the booking itself is off-site with no callback | `/dein-kalender`, `/deine-region` |
| `request-ad-placement` | — not wired at launch | offering `local-advertising` is `promotion: withheld` (Q-006) | registry entry exists, no call site |
| `order-promotion-material` | — not wired at launch | no page yet (Q-005) | registry entry exists, no call site |
| `publish-events-regularly` | — not countable | the hub marks the recurrence rule open | neither side emits |

Rules:

1. The registry is one file, machine-readable, and its IDs are validated
   against the hub package at build time — an event name that does not
   resolve to a conversion goal ID fails the build (A3).
2. An event fires **once** per completed trigger. Client-side navigation
   must not replay it; a failed or cancelled action must not fire it.
3. Attributes carry no personal data and no free text: place slug is
   permitted (public, not personal), form contents are not. The website
   holds no submission data anyway (WEB-F-092).
4. Mapping `stage` and the goal ID onto eTracker's concrete event fields
   (event name / category / object / action, and their character limits)
   is verified in the account before launch — the *contract* above binds,
   the field mapping is [PROPOSED].

### D5 — The measurement boundary [FIXED: DEC-028, WEB-Q-028]

The website measures up to and including the handover. It does not try to
observe what happens afterwards.

| Flow | Website's last observation | Completion measured by |
| --- | --- | --- |
| publishing | registration started (navigation to `app.*`) | app: registration completed, first event published |
| reading | calendar opened on `app.*` | app: homescreen save, return through it |
| licence purchase | checkout concluded on the website | website — nothing follows |
| quote / briefing | form submitted (envoy) · booking link opened | envoy-api · calendar booking, off-site |

**No cross-domain cookie tricks.** No linker parameter, no shared
identifier appended to `app.*` links, no `postMessage` handshake, no
server-side ID minting. The only thing that crosses the boundary is
campaign context (D6), which describes the *entry*, not the *person*.

This is a deliberate loss of resolution and is accepted: the cookieless
promise is the binding property (D1) and is itself an argument the site
makes to its visitors. A measurement need that can only be met by
breaking it is not met.

### D6 — Campaign attribution via `etcc_*` [FIXED: DEC-028, entre `vercel.json`; parameter extension PROPOSED]

The convention is inherited, not invented: the QR shortlink redirects in
`/Users/jan-henrik.hempel/Projects/entre/vercel.json` already append
`etcc_cmp` (campaign) and `etcc_med` (medium) to every target. eTracker
reads them from the URL.

| Rule | Detail |
| --- | --- |
| Binding parameter set | `etcc_cmp`, `etcc_med` — the two in productive use. Further `etcc_*` parameters may be adopted later; none is assumed to exist now. [PROPOSED] |
| Who sets them | external entry points only: QR/print (`svf.li`), newsletter, social, partner links |
| Who never sets them | the website's own internal links and CTAs — a self-tagged internal click would overwrite the real entry attribution |
| Redirects | every redirect the website itself performs preserves the query string, including the `/:community` forwarding to `app.*` (TS-004 D3 rule 6, WEB-F-048) |
| Handover links | `etcc_*` present on the entry URL is appended to the outbound `app.*` link, so the app's `completed` events land under the same campaign in the shared property (D3). This is campaign context, not identity — it is the same string for everyone who scanned that poster. |
| Storage | none. Read from the URL by the tracker, never persisted by the website (persisting it would be the identifier D1 forbids) |
| SEO | `etcc_*` never appears in `sitemap.xml`, in internal links, or in a canonical URL; a URL carrying them canonicalises to the clean URL (TS-004 / SEO spec) |

### D7 — Collector inventory: no new ad-hoc tracking [FIXED: WEB-Q-022, DEC-013, DEC-017]

Exactly two collectors run in production. The list is closed; an addition
is a decision, not an implementation detail.

| Collector | Scope | Basis |
| --- | --- | --- |
| eTracker | page views + the D4 conversion events | DEC-004, WEB-Q-021 |
| Vercel Speed Insights | Web Vitals only, cookieless, no behavioural data | WEB-Q-007, TS-003 D7 |

Excluded by this determination, with no exception at launch: tag
managers, a second analytics vendor, ad or remarketing pixels, session
recording, heatmaps, scroll/rage-click instrumentation, third-party error
trackers (DEC-017 keeps error monitoring Vercel-native), and any
third-party embed that measures on its own (DEC-013). Server logs are
operational, not analytics, and are not repurposed for behaviour
reporting.

### D8 — Experimentation stays deferred [FIXED: DEC-016]

No A/B infrastructure ships: no variant assignment, no bucketing, no
experiment flag store, no per-visitor split — a split needs a stable
identifier, which D1 forbids. The relevance-model hypotheses H1–H6 wait,
and TS-005 weights stay at their set values.

What a later experiment capability would have to solve is named now so
the deferral stays honest: a cookieless assignment mechanism (edge-side,
per request, not per person), and the fact that the outcome of a split
cannot be attributed to a returning visitor.

### D9 — Emission contract: never block, never break [FIXED: TS-003 D4; queue shape PROPOSED]

| Rule | Detail |
| --- | --- |
| Loading | deferred/async, absent from the LCP critical path, counted against the per-route JS budget (TS-003 D4) |
| Tracker unavailable | `trackConversion` is a no-op that does not throw. A blocked, failed, or not-yet-loaded tracker never produces a visible error and never changes what the page does |
| Outbound clicks | fire-and-forget. The event must not delay, defer, or cancel the navigation to `app.*` — no `preventDefault` + timeout pattern. A lost event is preferable to a delayed handover [PROPOSED: a small pre-load queue flushed on loader ready] |
| No blocking dependency | no page, form, or CTA waits for the tracker to be ready before becoming usable |
| Failure visibility | dropped events are not retried and not queued across page loads (that would need storage, D1) |

## Free for the generator

- [FREE] Internal file layout of the analytics module and the registry
  format (TS/JSON), as long as D2's exported surface and D4's build-time
  validation hold.
- [FREE] Whether page views rely solely on `data-page-changed-detection`
  or on an explicit router hook, provided no duplicate page views result.
- [FREE] Naming of the `stage` attribute in code, given D4 rule 4 fixes
  the values.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-012-A1 | static | No analytics call site outside `lib/analytics`; no cookie, `localStorage`, `sessionStorage`, or IndexedDB write for analytics anywhere in the source; no consent-banner component in the tree. |
| TS-012-A2 | e2e | After a journey across all D1-inventory pages (TS-004): `document.cookie` contains no analytics cookie, web storage contains no analytics identifier, and no request goes to a host outside the D7 collectors. |
| TS-012-A3 | static | Every event ID in the registry resolves to a conversion goal ID in `@schafe-vorm-fenster/goals`; an unknown ID fails the build. |
| TS-012-A4 | unit | `trackConversion` before the loader is ready neither throws nor blocks; with the loader blocked entirely, the call is a silent no-op. |
| TS-012-A5 | e2e | Each wired D4 trigger emits exactly one event with the correct goal ID and `stage`; client-side navigation back and forth does not replay it; a cancelled action emits nothing. |
| TS-012-A6 | e2e | Entering with `?etcc_cmp=…&etcc_med=…`, the outbound `app.*` handover link carries both parameters and no other parameter; the handover is not delayed by the event. |
| TS-012-A7 | integration | A URL carrying `etcc_*` renders normally and emits a canonical without them; `sitemap.xml` contains no `etcc_*`; no internal link carries `etcc_*`. |
| TS-012-A8 | tool | Lighthouse/trace on the TS-003 D7 routes: the eTracker script is deferred, is not a render-blocking resource, and does not appear in the LCP critical path. |
| TS-012-A9 | static | Exactly one analytics loader in the rendered HTML, with `data-block-cookies="true"` and the secure code from an env var; no second analytics/tag/pixel vendor in dependencies or markup. |
| TS-012-A10 | manual | In the eTracker account: website and app events arrive in one property under one secure code; a `stage: handover` and a `stage: completed` event for the same goal ID appear side by side; campaigns from the `svf.li` QR redirects show up under `etcc_cmp`. |
| TS-012-A11 | static | No experiment/variant/bucketing code and no A/B dependency in the build. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| WEB-Q-020 (cookieless, banner-free) | D1, D2 (`data-block-cookies`), D5 (no cross-domain identity), D6 (no storage), D7 · A1, A2, A9 |
| WEB-Q-021 (eTracker interim, config from SRC-010, one account/property incl. app) | D2, D3, D4 (tool-independent registry) · A3, A9, A10 |
| WEB-Q-022 (no new ad-hoc tracking) | D7, D8, D4 rule 1 · A1, A9, A11 |
| WEB-Q-028 (one event per goal, boundary at handover, `etcc_*`, A/B deferred) | D4, D5, D6, D8, D9 · A3, A5, A6, A7, A10, A11 |

## Open points

- **Which eTracker fields carry the goal ID and `stage`?** (D4 rule 4)
  Event name / category / object / action, their character limits, and
  whether kebab-case IDs survive them — verify in the account before the
  registry is frozen. Addressee: jan-henrik.
- **Does one secure code really mean one property for website *and* app
  in eTracker's account model?** (D3) DEC-028 states the intent; the
  account structure has not been inspected. If the model needs two
  "websites" under one account, D3's reporting consequence changes.
  Addressee: jan-henrik.
- **Demand to the app team:** does the app emit `completed` under the
  same hub goal IDs into the shared property? Without that, D5's
  handover/completion comparison has nothing to compare against, and
  `publish-first-event` and `save-calendar-to-homescreen` stay uncounted
  end to end. Addressee: app team.
- **`save-calendar-to-homescreen` has no cookieless measurement.** The
  hub itself records the measurement as open ("cookieless tracking cannot
  currently recognise a returning user"). The website can only count the
  handover click. Is the goal re-cut around an app-side install/save
  event, or does it stay a goal without a number? Addressee: jan-henrik
  (hub goal file, not this spec).
- **`publish-events-regularly` is not countable anywhere** until the hub
  fixes a recurrence rule. Until then "one event per conversion goal"
  (WEB-Q-028) is complete only for the countable goals — stated here so
  the gap is not read as an omission. Addressee: jan-henrik (hub).
- **Two goals have no surface at launch:** `order-promotion-material`
  (Q-005, no page) and `request-ad-placement` (Q-006, offering withheld).
  Their registry entries exist unwired; resolving either question wires
  one call site and nothing else.
- **Anonymised-IP setting and the vendor-side data-processing terms** are
  asserted from the legacy support article, not verified for the new
  property (D1, last row). Addressee: jan-henrik / legal — same review
  that carries the DPA question (Q-029).
- **The privacy policy must name both collectors** (D7), including Vercel
  Speed Insights, which the legacy text does not mention. Owned by the
  legal import (DEC-012), not by this spec — flagged so it is not
  discovered after launch.
- **[PROPOSED] items awaiting confirmation:** D2 loader details, D4
  per-goal triggers and field mapping, D6 parameter extension, D9 queue
  shape.
