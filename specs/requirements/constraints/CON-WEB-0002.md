---
artefact: requirement
id: CON-WEB-0002
class: CON
form: C0
domain: WEB
status: DRAFT
area: technical-constraints
source: "SRC-0006, SRC-0014, DEC-0056"
evidence_sufficiency: S3
---

# CON-WEB-0002

Mobile first: the primary audience arrives on the phone; mobile UX/UI is fully optimised. Tablet/desktop must work well but stays close to the mobile layout — width is not maximised. Breakpoints come from `@schafe-vorm-fenster/brand-design` (`breakpoint.xs…2xl`); the specs propose none. The scale is dense below the tablet on purpose — three of its six switch points sit under 640 px so that a small phone and a large phone are tuned differently instead of sharing one undifferentiated "mobile" layout.
