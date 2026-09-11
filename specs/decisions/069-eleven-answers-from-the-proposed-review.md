---
id: DEC-069
title: Answers from the PROPOSED review — price, accessibility, cache, budget, fallback, preview
status: accepted
date: 2026-09-11
decided_by: jan-henrik.hempel
---

## Context

The PROPOSED review (Q-058 … Q-070) put thirteen determinations to a
decision. This record carries the answers that are not large enough for a
record of their own. Q-058 became DEC-067, the placeholder principle
became DEC-068, and Q-060 and Q-070 are still open.

## Decisions

### 1. The container stops at 1200 px (Q-058 residual)

`measure.page` — already the token value, so nothing changes but the
reasoning, which was missing. **1350 px** would sit above the 1280 px
desktop reference viewport, so the maximum would never be reached at the
width everything is tested at. **980 px** would leave a three-column row
about 300 px per column where 1200 leaves about 380, and the container
does not carry text width at all — `measure.text` caps that separately at
68 ch. Materially wider than 1200 stops being the same layout at a
greater width and becomes a different layout, which TS-017 D2(d) forbids.

### 2. The price is emitted as structured data, with its scope attached (Q-061)

`/dein-kalender` emits `Service` + `Offer`. 480 € is **per organisation,
per year, net** — however many places that organisation covers. A bare
`price: 480` with `unitCode: ANN` states the year and nothing else, so
the figure could be quoted as if it were per place or gross. The
`priceSpecification` carries both missing halves:
`valueAddedTaxIncluded: false` and a `referenceQuantity` whose `unitText`
names the organisation. Structured data never says more precisely what
the visible copy says vaguely, so the same two qualifiers appear in the
copy.

### 3. Eight AAA criteria, not four (Q-062)

The four chosen for the audience stand: 2.4.9 Link Purpose, 1.4.8 Visual
Presentation, 3.1.5 Reading Level, 2.3.3 Animation from Interactions.
Four are added because they cost little against what the specs already
require: **2.4.10** Section Headings (the heading outline is already the
page structure), **2.2.6** Timeouts (no page has a session or expiring
state), **3.3.6** Error Prevention (already the shape of the order flow),
and **2.5.5** Target Size.

2.5.5 is the one that costs something: every target rises to 44 × 44,
not only the primary CTAs, which supersedes the 24 × 24 AA floor in
TS-002 D6 and puts real pressure on dense rows — the archive filter
chips, the scope tick-list. Adopted because a 24 px target is a thumb-miss
for exactly the visitors this site is for.

Rejected and recorded: 1.4.6 enhanced contrast as a blanket rule (the
high-contrast theme covers it), 1.3.6 Identify Purpose, 1.4.9 Images of
Text, sign language, extended audio description.

### 4. Stale windows are long; fresh TTLs are not (Q-067)

Dates per place and the live counters move to a **three-day** stale
window; active places and the map stay at seven days. Fresh TTL and stale
window answer different questions: the fresh TTL decides how fast a
correction reaches the page (five minutes for dates, unchanged), while
the stale window only decides what happens when upstream is
*unreachable*. There the choice is between a three-day-old list carrying
a visible "Stand: …" and no list at all, and an old answer that says how
old it is beats an empty page.

### 5. The byte budget reports; Lighthouse gates (Q-069)

Per-route first-load JS stays at ≤ 100 KB with a 70 KB target, but as a
**measure, not a gate**. A route over budget with Lighthouse green
produces a warning in the run summary and a line in the release review,
not a red build. The build-failing check is Lighthouse (100 target / 98
floor, DEC-007) — what the visitor experiences is the thing being
promised, and bytes are only a proxy for it.

### 6. Resilience snapshots are committed (Q-064)

The tier-3 fallback payloads in `src/generated/snapshots/` are tracked in
git. The "keep the previous file when the build fetch fails" rule only
works if a previous file exists in the source tree; regenerated from
nothing on a clean checkout, a snapshot is not a fallback but a second
live dependency, and a build during an outage would ship with no tier 3
at all. The cost — generated JSON churning in most builds — is accepted.

### 7. The lead fallback is the Google Form behind `/start` (Q-066)

While the envoy widget is undelivered, every lead surface falls back to
the form already running at `www.schafe-vorm-fenster.de/start`. Three
rules: **linked, never embedded** (DEC-013 forbids third-party embeds, and
an iframe would load Google for everyone who merely sees the surface);
**the link points at our own `/start`**, which redirects, so the swap to
envoy changes one route and no lead surface; and **the visitor is told
where it goes**, with the email address still offered beside it, because
the form submits to a third country and declining must be possible.

`/start` joins the TS-004 D1 inventory as the only row that is not a
page: redirect only, `noindex`, absent from the sitemap.

### 8. The order preview is deferred to the backlog (Q-063)

The scope step stays — choosing places, ZIP codes or a county is the
configuration the order is made of. What is deferred is the live answer
to "what would be in my calendar": counters, next dates, example places,
and `GET /api/scope/preview`. That route is the only BFF endpoint in the
whole flow, so deferring it removes an entire upstream dependency from
launch. The specification is kept intact in TS-025 D4 so the feature does
not have to be re-derived; it is simply not built, not tested, and not in
the route inventory until scheduled.

V1 shows the chosen scope instead — the ticked chips and their count. A
count of *selected places* is not a claim about content and needs no
upstream call.

### 9. Context proximity was mislabelled, not undecided (Q-068)

The endpoints are SRC-002's: its scoring block states `1.0 starting type
… 0.3 widest widening`. The `[PROPOSED]` tag on TS-005 D2 was too broad
and made a settled part of the relevance model look open. Corrected. What
genuinely remains this spec's own is narrower and now stated as such:
collapsing every named widening type to one middle value (0.6) rather
than ranking them, and applying the 0.3 floor to types the matrix names
for neither role instead of excluding them — which is what keeps a stream
from running dry.

## Consequences

TS-002, TS-003, TS-004, TS-005, TS-009, TS-011, TS-016, TS-017 and TS-025
are updated. Q-061 … Q-069 close in the register. Q-060 and Q-070 stay
open — both were answered with a question rather than a decision.
