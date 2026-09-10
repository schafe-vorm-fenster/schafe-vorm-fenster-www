---
artefact: question-register
status: DRAFT
date: 2026-09-09
---

# Open Questions

| ID | Question | Blocks | Addressee | Origin |
| --- | --- | --- | --- | --- |
| Q-001 | ~~International TLD~~ **Resolved by DEC-035**: `sheepoutside.com`. Residual task: DNS wiring + add to the Vercel team. | WEB-F-060 | — | DEC-035 |
| Q-002 | Stage-0 weight redistribution: spec says w_geo moves to w_time **and** w_job; the prototype gives everything to w_time (0.15→0.5). Which is right? | WEB-F-032 | jan-henrik | SRC-002 vs SRC-004 |
| Q-003 | Proof element counts per surface (proposal: three inline per claim, seven in the "why us" stream) — confirm from click-dummy findings. | WEB-F-031 | jan-henrik | SRC-002 open points |
| Q-004 | ~~May w_job outrank geo proximity?~~ **Resolved**: it may, and where is a property of the page — weights are a profile per focus job (TS-005 D5). | WEB-F-032 | — | TS-005 D5 |
| Q-005 | Where does `order-promotion-material` live — website page (`/mitmachen/vor-ort-werben`) or in the app? | WEB-F-019 | jan-henrik | SRC-003 open points |
| Q-006 | Companies/local advertising while `promotion: withheld`: exactly one sentence on `/dein-kalender`, or nothing? | WEB-C-015 | jan-henrik | SRC-003 open points |
| Q-007 | Newsletter placement: footer only, or also inline on trust pages? | WEB-F-021 | jan-henrik | SRC-003 open points |
| Q-008 | IP geolocation without storage: legally verified (DPIA)? | WEB-F-054, WEB-Q-024 | legal | SRC-005/006 |
| Q-009 | Competitor-keyword landing pages and comparison pages: legally permissible in the intended form? | WEB-F-075 | legal | SRC-006 |
| Q-010 | Exact language sets per country domain beyond phase 1. | WEB-F-068 | jan-henrik | SRC-006, DEC-006 |
| Q-011 | First-visit language/country suggestion: deferred by decision, to be built later. Shape is fixed (client-side, once, sessionStorage, never breaks caching — DEC-038); open is *when* and whether it also suggests a **country** (domain switch), not just a language. | WEB-F-069 | jan-henrik | SRC-007, DEC-038 |
| Q-012 | Where is the name "Portalize" introduced on the page (proposal: once, at the 480 € tier, before it appears on invoices)? | WEB-C-014 | jan-henrik | dialog 2026-09-09 |
| Q-013 | ~~Catamaran verified for accessibility?~~ **Superseded by DEC-043** — the brand retired Catamaran for Inter. Continues as Q-034. | WEB-Q-016 | — | DEC-043 |
| Q-014 | Five proof testimonials are `usage_rights: unverified` (Kurzweg, Wendt, Eichler, Zschiesche, Kulturlandbüro) — obtain clearances. Content-phase task; blocks proof slots. | WEB-F-033/036 | jan-henrik | SRC-005, GTM proof/ |
| Q-015 | ~~Which app API endpoints?~~ **Resolved by DEC-021 / SRC-011** — remaining: do the `events-api /api/stats` fields cover all three counter figures (places · dates · updates today)? | WEB-F-041 | app team | SRC-002, DEC-021 |
| Q-016 | Legacy URL inventory for the redirect map — extract from SRC-010. | WEB-F-070 | spec work | SRC-006 |
| Q-017 | Invoicing process behind the on-invoice purchase (issuing, addressing, dunning) — payment method itself decided by DEC-011. | WEB-F-094 | jan-henrik | SRC-004/005, DEC-011 |
| Q-018 | Website-update trigger on content change in GTM (repository dispatch on merge · scheduled rebuild · deploy hook on package publish)? | WEB-F-084 | jan-henrik | ADR-001 open q. 1 |
| Q-019 | `audiences: []` field on media-echo entries — model and backfill so w_job can score against audience IDs. | WEB-F-039 | gtm | SRC-002 required data |
| Q-020 | Newsletter system (sending, double opt-in) — requirements fixed (cookieless, GDPR, DOI), tool open. | WEB-F-096 | jan-henrik | dialog 2026-09-09 |
| Q-021 | BFSG applicability of the website (self-service sale to institutions vs consumers): legal confirmation. | WEB-Q-026 | legal | DEC-012 |
| Q-022 | **Demand to envoy:** widget contract — CSS variable set, emitted events, spam protection (honeypot + rate limit per DEC-014), accessibility conformance, delivery date. | WEB-F-090–092, WEB-Q-035 | envoy team | DEC-009 |
| Q-023 | Design system (tokens, components, breakpoints) — announced as upcoming input; until it lands, generation of visual layers is blocked. | one-shot generation | jan-henrik | dialog 2026-09-09 |
| Q-024 | ~~Region interim~~ **Resolved by DEC-034** — active examples + counters + search; residual: events-per-place activity signal (folded into Q-015/Q-025 demands). | WEB-F-028 | — | DEC-034 |
| Q-025 | **Demand to geo-api:** place/municipality name-search endpoint over the existing Typesense index (ZIP search exists; `findbyaddress` forbidden for this use — external Google lookup). | WEB-F-046 | geo-api | DEC-024 |
| Q-026 | **Demand to Portalize:** embed cookie-freedom verified (no consent duty introduced), and a place-filter parameter for the loader so the demo shows the searched place. | WEB-F-043 | portalize | DEC-030 |
| Q-027 | ~~Preview domain~~ **Resolved by DEC-035**: `next.schafe-vorm-fenster.de` — it serves only the product's pre-launch preview (not live), which moves aside. | WEB-C-020 | — | DEC-035 |
| Q-032 | **Demand to geo-api:** coordinate → administrative-hierarchy resolution. WEB-F-053 requires county-level geolocation, but platform request headers give country / state / city — no county — and `findbyaddress` is banned for this path (DEC-024). Either geo-api gains the resolution or WEB-F-053 relaxes to state, which would make relevance tiers 0–2 unreachable before a place search. | WEB-F-053, TS-005 D1 | geo-api | TS-010, 2026-09-10 |
| Q-033 | ~~Which brand package binds?~~ **Resolved by DEC-044** — two packages, three levels: tokens and assets from `@schafe-vorm-fenster/brand-design`, identity from `brand-identity`. The third candidate no longer exists. | WEB-C-003 | — | DEC-044 |
| Q-034 | Verify the new brand typeface (Inter) and the new colour system for accessibility — weight floor, sizes, contrast against the palette. Successor to Q-013. | WEB-Q-016, WEB-Q-011 | brand/design | DEC-043 |
| Q-035 | ~~Nonce or per-build hashes?~~ **Resolved by DEC-045** — per-build hashes; the shell stays static. | WEB-Q-030, TS-004 D6 | — | DEC-045 |
| Q-036 | ~~Where does the last-good store live?~~ **Resolved by DEC-046** — Vercel Runtime Cache; a cold region falls to tier 3 by design. | WEB-F-102, DEC-019 | — | DEC-046 |
| Q-037 | **Demand to events-api:** `/api/stats` returns `totalEvents`, date bounds and quality counters only — no field for *places* or *updates today*. Under WEB-F-041 those two counters are simply not rendered until the fields exist. | WEB-F-041 | events-api | TS-008, 2026-09-10 |
| Q-038 | **Demand to geo-api:** caller-supplied radius and `maxResults` on the geoPoint search. Today a server-side constant `PROXIMITY_SEARCH_RADIUS_KM = 20` applies, so the relevance model's "~15 km" is approximated in the BFF by haversine over returned positions. | WEB-F-042 | geo-api | TS-008, 2026-09-10 |
| Q-039 | ~~Where do /hilfe URLs and the support articles go?~~ **Resolved by DEC-047** — articles migrate to the app, `/hilfe/*` redirects there; interim target is the app root. | WEB-F-070, WEB-C-010 | — | DEC-047 |
| Q-040 | Does the app emit conversion completion under the same hub goal ids, and does one eTracker secure code really mean one property for website and app? DEC-028 states the intent; the account was never inspected. | WEB-Q-028 | app team | TS-012 |
| Q-041 | **Demand to the app team:** a public help URL contract, so `/hilfe/{slug}` can redirect per article instead of to the app root (DEC-047), and a destination for the 37 migrating support articles. | WEB-F-070 | app team | DEC-047 |
| Q-030 | Cache cost of community-level segmentation — measure before launch. TS-005 D8 accepts roughly 10–20× the entries of municipality segmentation; confirm the real figure and the hit rate against the performance budget before it becomes a launch surprise. | WEB-F-052, WEB-Q-002 | jan-henrik | content concept, 2026-09-10 |
| Q-031 | **Assessment drift.** `job_relation` and `editorial_weight` are set once and carried forward sticky across regeneration. After a year nobody re-reads them, and the site orders itself by judgements no one holds any more. What triggers a review — element age, package major version, a periodic sweep? | WEB-F-089, TS-005 D3/D4 | jan-henrik | content concept, 2026-09-10 |
| Q-029 | Does the Auftragsverarbeitungsvertrag (`content/legal/dpa.md`) belong on the public legal page, or is it a customer document handed over at contract time? Registry slot `#auftragsverarbeitung` is reserved either way. | WEB-F-029 | jan-henrik | DEC-039 |
| Q-028 | IA amendment for the "start the calendar in my place" page: **draft written** into `go-to-market-os/concept/website-information-architecture.concept.md` (route `/dein-ort/starten`) — awaiting review there. | WEB-F-047 | jan-henrik | DEC-024, DEC-036 |
