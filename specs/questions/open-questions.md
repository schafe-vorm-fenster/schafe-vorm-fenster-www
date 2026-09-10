---
artefact: question-register
status: DRAFT
date: 2026-09-09
---

# Open Questions

| ID | Question | Blocks | Addressee | Origin |
| --- | --- | --- | --- | --- |
| Q-001 | ~~International TLD~~ **Resolved by DEC-035**: `sheepoutside.com`. Residual task: DNS wiring + add to the Vercel team. | WEB-F-060 | — | DEC-035 |
| Q-002 | ~~Stage-0 weight redistribution?~~ **Resolved by DEC-048** — 0.20 to time, 0.15 to job (`w_time 0.35 · w_ctx 0.25 · w_job 0.40`). | WEB-F-032 | — | DEC-048 |
| Q-003 | ~~Proof element counts?~~ **Resolved by DEC-048** — 3 inline · 5 home · 7 in the `/ueber-uns` stream. | WEB-F-031 | — | DEC-048 |
| Q-004 | ~~May w_job outrank geo proximity?~~ **Resolved**: it may, and where is a property of the page — weights are a profile per focus job (TS-005 D5). | WEB-F-032 | — | TS-005 D5 |
| Q-005 | ~~Where does order-promotion-material live?~~ **Resolved by DEC-052 §2** — deliberately unwired; the goal stays in the hub, no website page. | WEB-F-019 | — | DEC-052 |
| Q-006 | ~~One sentence on local advertising, or none?~~ **Resolved by DEC-052 §3** — none while the offering is withheld; the guard checks for absence. | WEB-C-015 | — | DEC-052 |
| Q-007 | ~~Newsletter placement?~~ **Resolved by DEC-052 §4** — footer everywhere, plus inline on `/ueber-uns`, the one page without a primary conversion. | WEB-F-021 | — | DEC-052 |
| Q-008 | IP geolocation without storage: legally verified (DPIA)? | WEB-F-054, WEB-Q-024 | legal | SRC-005/006 |
| Q-009 | Competitor-keyword landing pages and comparison pages: legally permissible in the intended form? | WEB-F-075 | legal | SRC-006 |
| Q-010 | ~~Language sets per country?~~ **Resolved by DEC-053** — national language plus English per domain; further languages on real demand. | WEB-F-068 | — | DEC-053 |
| Q-011 | ~~First-visit suggestion timing and scope?~~ **Resolved by DEC-053** — after launch, language only; a country suggestion cannot keep the once-per-session guarantee across origins. | WEB-F-069 | — | DEC-053 |
| Q-012 | ~~Where is "Portalize" introduced?~~ **Resolved by DEC-052 §1** — once, on `/dein-kalender` at the 480 € tier. | WEB-C-014 | — | DEC-052 |
| Q-013 | ~~Catamaran verified for accessibility?~~ **Superseded by DEC-043** — the brand retired Catamaran for Inter. Continues as Q-034. | WEB-Q-016 | — | DEC-043 |
| Q-014 | Five proof testimonials are `usage_rights: unverified` — obtain clearances (content-phase task, prioritised). Launch is **not** blocked: the empty slot shows and the claim is weakened (principle 4). | WEB-F-033, WEB-F-036 | jan-henrik | SRC-005 |
| Q-015 | ~~Which app API endpoints?~~ **Resolved by DEC-021 / SRC-011** — remaining: do the `events-api /api/stats` fields cover all three counter figures (places · dates · updates today)? | WEB-F-041 | app team | SRC-002, DEC-021 |
| Q-016 | Legacy URL inventory for the redirect map — extract from SRC-010. | WEB-F-070 | spec work | SRC-006 |
| Q-017 | ~~Invoicing process?~~ **Resolved by DEC-051** — the order goes to envoy as a structured event, then into the existing accounting process; the website issues nothing. | WEB-F-094 | — | DEC-051 |
| Q-018 | ~~Website update trigger?~~ **Resolved by DEC-050** — the hub's package publish fires a `repository_dispatch`; the workflow diffs and opens a PR. | WEB-F-084 | — | DEC-050 |
| Q-019 | `audiences: []` field on media-echo entries — model and backfill so w_job can score against audience IDs. | WEB-F-039 | gtm | SRC-002 required data |
| Q-020 | ~~Newsletter system?~~ **Resolved by DEC-051** — envoy carries signup and double opt-in, as a row of the Q-022 contract. | WEB-F-096 | — | DEC-051 |
| Q-021 | BFSG applicability of the website (self-service sale to institutions vs consumers): legal confirmation. | WEB-Q-026 | legal | DEC-012 |
| Q-022 | **Demand to envoy:** widget contract — CSS variable set, emitted events, spam protection (honeypot + rate limit per DEC-014), accessibility conformance, delivery date. | WEB-F-090–092, WEB-Q-035 | envoy team | DEC-009 |
| Q-023 | ~~Design system missing?~~ **Resolved by DEC-056** — delivered as `concept/website-design-system.md` with the boards in `concept/v2.0/`; the visual gate is lifted. | visual generation | — | DEC-056 |
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
| Q-042 | ~~Weight 800 missing from the brand tokens?~~ **Resolved** — the brand added `font.weight.display: 800` to `@schafe-vorm-fenster/brand-design` (go-to-market-os PR #339); the fontsource dependency already ships the face. | WEB-Q-016, SRC-014 | — | DEC-056 |
| Q-043 | ~~Lucide SVGs not delivered?~~ **Not a demand** — the website installs the icon set into its own stack as a dependency (WEB-C-007). The v2.0 boards render without icons locally, which is cosmetic and does not affect the specification. | WEB-C-007 | — | 2026-09-10 |
| Q-030 | ~~Measure segmentation cache cost before launch?~~ **Resolved by DEC-055** — observed in production instead; the fallback to municipality level is a parameter change. | WEB-F-052, WEB-Q-002 | — | DEC-055 |
| Q-031 | ~~Assessment drift trigger?~~ **Resolved by DEC-049** — twelve months or a major version, reported not blocking. | WEB-F-089 | — | DEC-049 |
| Q-029 | ~~Is the DPA public?~~ **Resolved by DEC-052 §5** — yes, as a section at `#auftragsverarbeitung`; municipalities check it before buying. | WEB-F-029 | — | DEC-052 |
| Q-028 | IA amendment for the "start the calendar in my place" page: **draft written** into `go-to-market-os/concept/website-information-architecture.concept.md` (route `/dein-ort/starten`) — awaiting review there. | WEB-F-047 | jan-henrik | DEC-024, DEC-036 |
