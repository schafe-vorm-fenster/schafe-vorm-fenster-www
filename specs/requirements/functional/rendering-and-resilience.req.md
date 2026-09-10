---
artefact: requirements
area: rendering-and-resilience
status: DRAFT
sources: [SRC-002]
decisions: [DEC-019]
---

# Rendering and Resilience

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| WEB-F-100 | Pages shall render server-side with caching; the page shell shall never block on an app API (streamed live modules), preserving TTFB < 200 ms (WEB-Q-002). | DEC-019 | S3 |
| WEB-F-101 | Tier 1: live modules fetch server-side, stream in, and cache the response. | DEC-019 | S3 |
| WEB-F-102 | Tier 2: on API failure, the last cached response is served, visibly labelled with its freshness ("Stand: …"). | DEC-019 | S3 |
| WEB-F-103 | Tier 3: on empty cache, a build-time snapshot is served, so every module always has content. | DEC-019 | S3 |
| WEB-F-104 | Exception for live counters: tier 2 with timestamp is permitted; tier 3 is not — the module is hidden instead ("counted live or not shown", WEB-F-041). | DEC-019 | S3 |
| WEB-F-105 | Cache lifetimes per module/page type: UNKNOWN — set in the tactical spec (carried over from the performance area). | DEC-019 | S1 |
| WEB-F-106 | Every module whose data arrives after the shell — above all geo-personalized content — renders a skeleton immediately and streams in. Skeletons reserve the final space (CLS, TS-003 A7); blocking spinners are forbidden. | DEC-033 | S3 |
