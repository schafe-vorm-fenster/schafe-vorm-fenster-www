---
artefact: tactical-spec
id: TS-WEB-0003
kind: rule
status: DRAFT
implements: [NFR-WEB-0001, NFR-WEB-0002, NFR-WEB-0003, NFR-WEB-0004, NFR-WEB-0005, NFR-WEB-0006, NFR-WEB-0007, NFR-WEB-0008, NFR-WEB-0009, FUN-WEB-0105]
sources: [SRC-0006, SRC-0007]
decisions: [DEC-0007, DEC-0019]
---

# TS-WEB-0003 — Performance

## Purpose

Resolves the adopted budget into per-route targets, loading rules, cache
lifetimes, and CI enforcement.

## Determinations

### D1 — Global budgets [FIXED: DEC-0007]

LCP < 2.5s · INP < 200ms · CLS < 0.1 · FCP < 800ms · TTFB < 200ms.
Compressed: HTML ≤ 50KB · JS ≤ 100KB · CSS ≤ 30KB · fonts ≤ 50KB ·
images ≤ 100KB each. Lighthouse: 100 target / 98 floor (Performance),
100 the rest — mobile and desktop.

### D2 — LCP elements per page [FIXED: DEC-0068, DEC-0069]

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

The two image LCPs are safe to declare because the asset always exists:
under DEC-0068 a missing photograph is filled by a generated placeholder
at the declared aspect ratio, never by an empty slot. The LCP element
therefore has its geometry from day one, and swapping the placeholder for
the real photograph later changes the bytes, not the layout and not the
budget. What the swap must not change is the aspect — the placeholder
declares it, and the real image is cropped to it.

### D3 — Fonts [FIXED: NFR-WEB-0005; subset PROPOSED]

**Atkinson Hyperlegible Next** (plus the Mono variant for labels, dates
and numbers), `woff2`, latin subset, self-hosted, preloaded,
`font-display: swap`; total ≤ 50KB across both families and the three
weights in use (400 · 700 · 800). Corrected 2026-09-11 per DEC-0043 — an
earlier version named Inter, which was wrong.

### D4 — JavaScript [FIXED: NFR-WEB-0003/004; split PROPOSED]

Server-first rendering (DEC-0019); client JS only for: live-module
hydration, place search, envoy widget, eTracker. Third-party rule:
eTracker deferred (never render-blocking, excluded from LCP path); envoy
widget loads lazily when its container approaches the viewport.
Per-route first-load JS ≤ 100KB, ≤ 70KB target — **reported, not
gating** [FIXED: DEC-0069]. The byte budget is a measure we watch; the
build-failing gate is Lighthouse (D1, 100 target / 98 floor, fixed by
DEC-0007). A route that exceeds the budget while Lighthouse stays green
produces a warning in the run summary and a line in the release review,
not a red build — what the visitor experiences is the thing being
promised, and bytes are only a proxy for it. The budgets are not
abandoned: a route that exceeds them *and* drops Lighthouse below the
floor fails on the Lighthouse check, which is the one that matters.

### D5 — Cache lifetimes (fills FUN-WEB-0105) [FIXED: DEC-0019, DEC-0069]

Vercel SWR semantics per DEC-0019 (serve cached, revalidate behind):

| Data | Fresh TTL | Serve-stale window |
| --- | --- | --- |
| dates per place ("today", "this week") | 5 min | **3 d** |
| active places / map | 1 h | **7 d** |
| live counters (`/api/stats`) | 15 min | **3 d** — beyond: hide (FUN-WEB-0104) |
| proof stream input (`media-echo`, build data) | build-time | until next deploy |
| proof stream per segment (`{community, trait, job, isoWeek}`) | 1 week | until the ISO week turns (tagged, TS-WEB-0005 D7) |
| pages (HTML, ISR) | 1 h | until next deploy |
| landing-only domains | static | until next deploy |

Freshness label ("Stand: …") appears when served data is older than its
fresh TTL [FIXED: DEC-0019].

**Why the stale windows are long.** Fresh TTL and stale window answer
different questions. The fresh TTL decides how fast a correction reaches
the page — five minutes for dates, and that is what matters in normal
operation. The stale window decides only what happens when the upstream
is *unreachable*, and there the choice is between a three-day-old date
list carrying a visible "Stand: …" and no date list at all. An old answer
that says how old it is beats an empty page, so the window is generous on
purpose. It never delays a correction: as soon as upstream answers, the
revalidation behind the served response replaces the stale copy.

### D6 — Reduced data [FIXED: NFR-WEB-0008; measures PROPOSED]

On `Save-Data: on` / `prefers-reduced-data`: hero/scene images drop to
low-res variants, non-LCP images stay lazy with tighter thresholds, map
module renders as list.

### D7 — Enforcement [FIXED: NFR-WEB-0007; config PROPOSED]

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
| TS-WEB-0003-A1 | tool | Lighthouse CI green on the five D7 routes, mobile + desktop. |
| TS-WEB-0003-A2 | tool | Bundle guard runs on every route and writes the measured first-load bytes to the run summary; a route over the D1/D4 budget is reported as a warning. The job fails only when A1's Lighthouse floor fails — the byte budget never fails a build on its own (D4). |
| TS-WEB-0003-A3 | static | Fonts: single variable woff2, preloaded, ≤ 50KB, swap. |
| TS-WEB-0003-A4 | e2e | With app APIs blocked (simulated outage): every page renders tier-2/3 content, freshness labels shown, counters hidden after stale window. |
| TS-WEB-0003-A5 | tool | eTracker and envoy absent from the critical request chain of the LCP element (verified in trace). |
| TS-WEB-0003-A6 | e2e | `Save-Data: on` responses are measurably lighter (≥ 30 % image bytes saved) [PROPOSED threshold]. |
| TS-WEB-0003-A7 | tool | CLS < 0.1 with live modules streaming in (reserved space, no shift). |
| TS-WEB-0003-A8 | static | Every image below the fold carries `loading="lazy"`; the declared LCP element of each page (D2) carries `loading="eager"` and `fetchpriority="high"`. No image outside the D2 table is eager. |

### D8 — Reserved space is how CLS is met [FIXED: DEC-0056, SRC-0014]

Every box holding asynchronous content declares its shape before the
content arrives: `aspect-ratio` on media (never a pixel height, so the
ratio survives every viewport), fixed heights for controls whose content
length varies, and `min-height: calc(<lines> · <line-height> · 1em)` for
text that arrives with data. Event titles clamp to two lines and meta to
one, so a long title cannot change a row's height; live counts sit in a
fixed-height badge, so one digit becoming two does not reflow.

The ratio set and the height table are in SRC-0014; this spec consumes
them and restates none of the values. CLS < 0.1 (D1) is the outcome this
determination produces rather than hopes for.

## Coverage

| Requirement | Discharged by |
| --- | --- |
| NFR-WEB-0001 (Lighthouse 100/98) | D1 · D7 enforcement · A1 |
| NFR-WEB-0002 (Core Web Vitals) | D1, D2 · A1, A7 |
| NFR-WEB-0003 (bundle budgets) | D1, D4 · A2, A3 |
| NFR-WEB-0004 (critical CSS, deferred JS) | D4 · A5 |
| NFR-WEB-0005 (self-hosted fonts) | D3 · A3 |
| NFR-WEB-0007 (CI + RUM) | D7 · A1, A2 |
| NFR-WEB-0009 (reserved space) | D8 · A7 |
| NFR-WEB-0008 (reduced data) | D6 · A6 |
| FUN-WEB-0105 (cache lifetimes) | D5 · A4 |
| NFR-WEB-0006 (image loading) | D2, D6 · A8 |

## Open points

- D4's split and D6's measures are [PROPOSED]; A6's threshold is [PROPOSED]. D2, D5's values and D4's enforcement stance are fixed by DEC-0069.
- Q-0015 sliver (stats fields) touches D5's counter row.
