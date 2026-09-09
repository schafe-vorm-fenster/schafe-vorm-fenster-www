---
artefact: question-register
status: DRAFT
date: 2026-09-09
---

# Open Questions

| ID | Question | Blocks | Addressee | Origin |
| --- | --- | --- | --- | --- |
| Q-001 | Which TLD carries the international domain — .com or .org? | WEB-F-060 | jan-henrik | SRC-006, DEC-003 |
| Q-002 | Stage-0 weight redistribution: spec says w_geo moves to w_time **and** w_job; the prototype gives everything to w_time (0.15→0.5). Which is right? | WEB-F-032 | jan-henrik | SRC-002 vs SRC-004 |
| Q-003 | Proof element counts per surface (proposal: three inline per claim, seven in the "why us" stream) — confirm from click-dummy findings. | WEB-F-031 | jan-henrik | SRC-002 open points |
| Q-004 | May w_job outrank geo proximity (e.g. a BW municipality seeing Rubkow before a local event)? | WEB-F-032 | jan-henrik | SRC-002 open points |
| Q-005 | Where does `order-promotion-material` live — website page (`/mitmachen/vor-ort-werben`) or in the app? | WEB-F-019 | jan-henrik | SRC-003 open points |
| Q-006 | Companies/local advertising while `promotion: withheld`: exactly one sentence on `/eigener-kalender`, or nothing? | WEB-C-015 | jan-henrik | SRC-003 open points |
| Q-007 | Newsletter placement: footer only, or also inline on trust pages? | WEB-F-021 | jan-henrik | SRC-003 open points |
| Q-008 | IP geolocation without storage: legally verified (DPIA)? | WEB-F-054, WEB-Q-024 | legal | SRC-005/006 |
| Q-009 | Competitor-keyword landing pages and comparison pages: legally permissible in the intended form? | WEB-F-075 | legal | SRC-006 |
| Q-010 | Exact language sets per country domain beyond phase 1. | WEB-F-068 | jan-henrik | SRC-006, DEC-006 |
| Q-011 | Browser-language suggestion banner: adopt for the website? | WEB-F-069 | jan-henrik | SRC-007 |
| Q-012 | Where is the name "Portalize" introduced on the page (proposal: once, at the 480 € tier, before it appears on invoices)? | WEB-C-014 | jan-henrik | dialog 2026-09-09 |
| Q-013 | Catamaran verified for accessibility/readability (weights, sizes, contrast)? | WEB-Q-016 | brand/design | SRC-006 |
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
