---
artefact: tactical-spec
id: TS-003
profile: rule
status: DRAFT
implements: [WEB-Q-001, WEB-Q-002, WEB-Q-003, WEB-Q-004, WEB-Q-005, WEB-Q-006, WEB-Q-007, WEB-Q-008, WEB-F-105]
sources: [SRC-006, SRC-007]
decisions: [DEC-007, DEC-019]
---

# TS-003 — Performance

## Purpose

Resolves the adopted budget into per-route targets, loading rules, cache
lifetimes, and CI enforcement.

## Determinations

### D1 — Global budgets [FIXED: DEC-007]

LCP < 2.5s · INP < 200ms · CLS < 0.1 · FCP < 800ms · TTFB < 200ms.
Compressed: HTML ≤ 50KB · JS ≤ 100KB · CSS ≤ 30KB · fonts ≤ 50KB ·
images ≤ 100KB each. Lighthouse: 100 target / 98 floor (Performance),
100 the rest — mobile and desktop.

### D2 — LCP elements per page [PROPOSED]

The LCP element is declared per page and eager-loaded; everything else
must not compete:

| Page | LCP element |
| --- | --- |
| `/` | place-search block (text/input, no image) |
| `/dein-ort` | place name + next dates (text) |
| `/mitmachen` | WhatsApp scene image |
| `/dein-kalender` | ownership headline (text) |
| `/ueber-uns` | founder photo |

Text-first LCP wherever the brief allows — images never above the fold
without being the declared LCP element.

### D3 — Fonts [FIXED: WEB-Q-005; subset PROPOSED]

Catamaran as **variable font**, `woff2`, latin subset, self-hosted,
preloaded, `font-display: swap`; total ≤ 50KB. The nine static brand-kit
weights are not shipped to the browser.

### D4 — JavaScript [FIXED: WEB-Q-003/004; split PROPOSED]

Server-first rendering (DEC-019); client JS only for: live-module
hydration, place search, envoy widget, eTracker. Third-party rule:
eTracker deferred (never render-blocking, excluded from LCP path); envoy
widget loads lazily when its container approaches the viewport.
Per-route first-load JS ≤ 100KB hard, ≤ 70KB target [PROPOSED].

### D5 — Cache lifetimes (fills WEB-F-105) [PROPOSED]

Vercel SWR semantics per DEC-019 (serve cached, revalidate behind):

| Data | Fresh TTL | Serve-stale window |
| --- | --- | --- |
| dates per place ("today", "this week") | 5 min | 24 h |
| active places / map | 1 h | 7 d |
| live counters (`/api/stats`) | 15 min | 24 h — beyond: hide (WEB-F-104) |
| proof stream input (`media-echo`, build data) | build-time | until next deploy |
| proof stream per segment (`{municipality, trait, job, isoWeek}`) | 1 week | until the ISO week turns (tagged, TS-005 D7) |
| pages (HTML, ISR) | 1 h | until next deploy |
| landing-only domains | static | until next deploy |

Freshness label ("Stand: …") appears when served data is older than its
fresh TTL [FIXED: DEC-019].

### D6 — Reduced data [FIXED: WEB-Q-008; measures PROPOSED]

On `Save-Data: on` / `prefers-reduced-data`: hero/scene images drop to
low-res variants, non-LCP images stay lazy with tighter thresholds, map
module renders as list.

### D7 — Enforcement [FIXED: WEB-Q-007; config PROPOSED]

- **Lighthouse CI** on every PR against: `/`, `/dein-ort`, `/mitmachen`,
  `/dein-kalender`, `/ueber-uns` (mobile emulation, throttled);
  asserts D1 scores. Performance < 98 fails the build.
- **Bundle guard** in CI asserts D1/D4 size budgets per route.
- **RUM**: Vercel Speed Insights (cookieless) watches D1 in production;
  alerts on p75 regression.

## Free for the generator

- [FREE] Code-splitting strategy, component-level lazy boundaries —
  within D4 budgets.
- [FREE] Image formats/sizes pipeline, as long as ≤ 100KB and AVIF/WebP
  preferred.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-003-A1 | tool | Lighthouse CI green on the five D7 routes, mobile + desktop. |
| TS-003-A2 | tool | Bundle guard: every route within D1/D4 budgets. |
| TS-003-A3 | static | Fonts: single variable woff2, preloaded, ≤ 50KB, swap. |
| TS-003-A4 | e2e | With app APIs blocked (simulated outage): every page renders tier-2/3 content, freshness labels shown, counters hidden after stale window. |
| TS-003-A5 | tool | eTracker and envoy absent from the critical request chain of the LCP element (verified in trace). |
| TS-003-A6 | e2e | `Save-Data: on` responses are measurably lighter (≥ 30 % image bytes saved) [PROPOSED threshold]. |
| TS-003-A7 | tool | CLS < 0.1 with live modules streaming in (reserved space, no shift). |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| WEB-Q-001 (Lighthouse 100/98) | D1 · D7 enforcement · A1 |
| WEB-Q-002 (Core Web Vitals) | D1, D2 · A1, A7 |
| WEB-Q-003 (bundle budgets) | D1, D4 · A2, A3 |
| WEB-Q-004 (critical CSS, deferred JS) | D4 · A5 |
| WEB-Q-005 (self-hosted fonts) | D3 · A3 |
| WEB-Q-006 (image loading) | D2, D6 |
| WEB-Q-007 (CI + RUM) | D7 · A1, A2 |
| WEB-Q-008 (reduced data) | D6 · A6 |
| WEB-F-105 (cache lifetimes) | D5 · A4 |

## Open points

- D2/D4-split/D5-values/D6-measures/A6-threshold are [PROPOSED].
- Q-015 sliver (stats fields) touches D5's counter row.
