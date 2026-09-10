---
id: DEC-038
title: Language is determined by the path; suggestion is client-side and one-off
status: accepted
date: 2026-09-10
decided_by: jan-henrik.hempel
---

## Decision

1. **The path determines the language.** Not a header, not a cookie, not
   a session. The reason is cacheability: pages must stay statically
   cacheable, and output that varies by request header cannot be. Users
   also do not switch language mid-visit — the URL is the preference.
2. **First-visit suggestion, later.** Offering a first-time visitor the
   best-matching language — or even the best-matching country domain —
   is desirable but deferred. When it is built it must: run
   **client-side only**, appear **once** (sessionStorage), and **never**
   influence server rendering or vary a cached response. It offers a
   link; it does not redirect the render.

## Consequences

→ WEB-F-061/062 (unchanged, now reasoned), WEB-F-069 (shape fixed, timing
open in Q-011). The rule is stated as an outcome ("language comes from
the path, responses stay cacheable"), not as a technology ban.
