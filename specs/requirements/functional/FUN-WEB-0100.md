---
artefact: requirement
id: FUN-WEB-0100
class: FUN
form: F0
domain: WEB
status: DRAFT
version: 0.1.0
area: rendering-and-resilience
source: "DEC-0019"
evidence_sufficiency: S3
---

# FUN-WEB-0100

Pages shall render server-side with caching; the page shell shall never block on an app API (streamed live modules), preserving TTFB < 200 ms (NFR-WEB-0002).
