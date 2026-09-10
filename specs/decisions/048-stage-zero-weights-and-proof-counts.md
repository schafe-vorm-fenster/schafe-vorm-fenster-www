---
id: DEC-048
title: Stage-0 weights split between time and job; proof counts per surface
status: accepted
date: 2026-09-10
decided_by: jan-henrik.hempel
---

## Decision

**Stage 0** (no location known): the freed `w_geo` of 0.35 splits — 0.20
to time, 0.15 to job. The profile becomes `w_time 0.35 · w_ctx 0.25 ·
w_job 0.40`. Without geo the job is the only relevance axis left, so
dropping it would waste a quarter of the score; recency still matters but
does not decide. This settles the divergence between the relevance model
("time **and** job") and the prototype (everything to time).

**Proof element counts per surface:**

| Surface | Elements |
| --- | --- |
| inline beside a claim | 3 |
| home page stream | 5 |
| `/ueber-uns` stream | 7 |

Three is the minimum the sequence rule needs (near · near · far); seven
carries the full pattern including the return to proximity.

## Consequences

→ TS-005 D5 stage-0 row, TS-005 D6 step 4. Resolves Q-002 and Q-003.
The counts are revisable from H1's measurement, the split from H5's.
