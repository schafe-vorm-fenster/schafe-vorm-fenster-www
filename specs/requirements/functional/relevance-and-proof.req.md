---
artefact: requirements
area: relevance-and-proof
status: DRAFT
sources: [SRC-001, SRC-002]
---

# Relevance and Proof

Primary source: SRC-002 (`go-to-market-os/concept/website-relevance-model.concept.md`)
— binding "for every module that renders more than one proof element or any
live content". Formula, weights, matrices are defined there and referenced.

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| WEB-F-030 | Any list longer than three items shall be ordered by the relevance model, not chronologically. | SRC-001#3 | S2 |
| WEB-F-031 | Every proof stream shall follow the sequence rule "two near, then widen" (near · near · far · near · very far · middle · far) as specified in SRC-002. | SRC-002#sequence-rule | S2 |
| WEB-F-032 | Proof elements shall be scored by the formula and starting weights of SRC-002 §Scoring (w_geo 0.35 · w_ctx 0.25 · w_job 0.25 · w_time 0.15); weights are revised from measurement only. Stage-0 redistribution: Q-002. | SRC-002#scoring | S2 |
| WEB-F-033 | Elements without `usage_rights: cleared` shall be excluded before scoring (hard filter), never down-weighted. | SRC-002#scoring | S2 |
| WEB-F-034 | The spread rule of SRC-002 (positions 1–2 top scorers; from position 3 furthest-on-geo-axis candidate at ≥50 % of top score; alternate near/far) shall produce the sequence without hand curation. | SRC-002#scoring | S2 |
| WEB-F-035 | The entry context shall select starting proof type and time window per the context matrix in SRC-002. | SRC-002#context-matrix | S2 |
| WEB-F-036 | Every claim on the website shall have a proof slot beside it; a slot with no cleared proof stays empty and the claim is weakened accordingly; proof is never invented or implied. | SRC-001#4-proof-is-context | S2 |
| WEB-F-037 | The full proof archive shall exist exactly once, as `/ueber-uns/archiv`, filterable by type, chronological. | SRC-001#4, SRC-003#archive | S2 |
| WEB-F-038 | Geo proximity shall be computed against the five-level location model `place · municipality · county · state · country` carried by `geo:` frontmatter in `go-to-market-os/media-echo/verified/` (complete, 34/34) and `proof/`. | SRC-002#required-data | S2 |
| WEB-F-039 | Job fit requires `audiences: []` on media-echo entries — currently only `tags` exist. UNKNOWN until modelled; blocks full w_job scoring. | SRC-002#required-data | S1 |
| WEB-F-024 | Place-bound proof elements (reference calendars, local events, place flyers) shall be drawn only from covered places — places with data in events-api. Coverage gaps are never illustrated with invented or uncovered examples. | DEC-024 | S3 |
