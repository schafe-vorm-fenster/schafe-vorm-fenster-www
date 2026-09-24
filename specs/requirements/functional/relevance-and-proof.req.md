---
artefact: requirements
area: relevance-and-proof
status: DRAFT
sources: [SRC-0001, SRC-0002]
---

# Relevance and Proof

Primary source: SRC-0002 (`go-to-market-os/concept/website-relevance-model.concept.md`)
— binding "for every module that renders more than one proof element or any
live content". Formula, weights, matrices are defined there and referenced.

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| FUN-WEB-0030 | Any list longer than three items shall be ordered by the relevance model, not chronologically. | SRC-0001#3 | S2 |
| FUN-WEB-0031 | Every proof stream shall follow the sequence rule "two near, then widen" (near · near · far · near · very far · middle · far) as specified in SRC-0002. | SRC-0002#sequence-rule | S2 |
| FUN-WEB-0032 | Proof elements shall be scored by the formula and starting weights of SRC-0002 §Scoring (w_geo 0.35 · w_ctx 0.25 · w_job 0.25 · w_time 0.15); weights are revised from measurement only. Stage-0 redistribution: Q-0002. | SRC-0002#scoring | S2 |
| FUN-WEB-0033 | Elements without `usage_rights: cleared` shall be excluded before scoring (hard filter), never down-weighted. | SRC-0002#scoring | S2 |
| FUN-WEB-0034 | The spread rule of SRC-0002 (positions 1–2 top scorers; from position 3 furthest-on-geo-axis candidate at ≥50 % of top score; alternate near/far) shall produce the sequence without hand curation. | SRC-0002#scoring | S2 |
| FUN-WEB-0035 | The entry context shall select starting proof type and time window per the context matrix in SRC-0002. | SRC-0002#context-matrix | S2 |
| FUN-WEB-0036 | Every claim on the website shall have a proof slot beside it; a slot with no cleared proof stays empty and the claim is weakened accordingly; proof is never invented or implied. | SRC-0001#4-proof-is-context | S2 |
| FUN-WEB-0037 | The full proof archive shall exist exactly once, as `/ueber-uns/archiv`, filterable by type, chronological. | SRC-0001#4, SRC-0003#archive | S2 |
| FUN-WEB-0038 | Geo proximity shall be computed against the five-level location model `place · municipality · county · state · country` carried by `geo:` frontmatter in `@schafe-vorm-fenster/media-echo` (complete, 34/34) and `proof/`. | SRC-0002#required-data | S2 |
| FUN-WEB-0039 | Job fit requires `audiences: []` on media-echo entries — currently only `tags` exist. UNKNOWN until modelled; blocks full w_job scoring. | SRC-0002#required-data | S1 |
| FUN-WEB-0024 | Place-bound proof elements (reference calendars, local events, place flyers) shall be drawn only from covered places — places with data in events-api. Coverage gaps are never illustrated with invented or uncovered examples. | DEC-0024 | S3 |
