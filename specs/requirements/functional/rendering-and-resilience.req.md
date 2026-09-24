---
artefact: requirements
area: rendering-and-resilience
status: DRAFT
sources: [SRC-0002]
decisions: [DEC-0019]
---

# Rendering and Resilience

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| FUN-WEB-0100 | Pages shall render server-side with caching; the page shell shall never block on an app API (streamed live modules), preserving TTFB < 200 ms (NFR-WEB-0002). | DEC-0019 | S3 |
| FUN-WEB-0101 | Tier 1: live modules fetch server-side, stream in, and cache the response. | DEC-0019 | S3 |
| FUN-WEB-0102 | Tier 2: on API failure, the last cached response is served, visibly labelled with its freshness ("Stand: …"). | DEC-0019 | S3 |
| FUN-WEB-0103 | Tier 3: on empty cache, a build-time snapshot is served, so every module always has content. | DEC-0019 | S3 |
| FUN-WEB-0104 | Exception for live counters: tier 2 with timestamp is permitted; tier 3 is not — the module is hidden instead ("counted live or not shown", FUN-WEB-0041). | DEC-0019 | S3 |
| FUN-WEB-0105 | Cache lifetimes per module/page type: UNKNOWN — set in the tactical spec (carried over from the performance area). | DEC-0019 | S1 |
| FUN-WEB-0106 | Every module whose data arrives after the shell — above all geo-personalized content — renders a skeleton immediately and streams in. Skeletons reserve the final space at the declared ratio (NFR-WEB-0009), do **not** animate, and are replaced by the designed empty state after two seconds. Blocking spinners are forbidden. | DEC-0033, SRC-0014#skeletons, DEC-0056 | S3 |
