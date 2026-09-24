---
artefact: requirements
area: jobs-and-navigation
status: DRAFT
sources: [SRC-0001, SRC-0003, SRC-0017, SRC-0018]
---

# Jobs and Navigation

Primary source: SRC-0001 (`go-to-market-os/concept/website-communication-principles.concept.md`).
The four jobs, their conversions and audience mappings are defined there
(§1 "Jobs, not audiences") and are referenced, not restated.

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| FUN-WEB-0001 | Every page shall declare exactly one focus job in its brief; the four jobs are defined in SRC-0001 §1. | SRC-0001#1-jobs-not-audiences | S2 |
| FUN-WEB-0002 | Navigation labels shall name jobs — never audiences and never product names. The four labels and targets are defined in SRC-0003 "Navigation". | SRC-0001#1, SRC-0003#navigation | S2 |
| FUN-WEB-0003 | Each page shall present exactly one primary conversion, above the fold, visually unrivalled — exactly one element carrying the primary marker, one unmarked repeat in the closing block, and every other action at secondary treatment: module CTAs, tier CTAs, the context band and every row of the contact section. A hero may carry a second, adjacent secondary action where the page brief declares a goal of equal weight (order versus consult). | SRC-0001#2-order-do-not-exclude, DEC-0082 | S3 |
| FUN-WEB-0004 | All four jobs shall be reachable from every page within at most one click. | SRC-0001#2 | S2 |
| FUN-WEB-0005 | Every page shall carry a context band naming the other three jobs, phrased as an offer, placed below the main argument and above the closing CTA. | SRC-0001#2 | S2 |
| FUN-WEB-0006 | The last block of every page shall be the CTA of its focus job (identical to the primary conversion), preceded by the context band. Section order and colour rhythm follow SRC-0014 "Page Rhythm". | SRC-0001#7, SRC-0014#page-rhythm | S2 |
| FUN-WEB-0007 | The job "know what is on" shall be fulfilled in place on the home page (place search, or live dates of the visitor's place), not offered as a click target. | SRC-0001#1 | S2 |
| FUN-WEB-0008 | Each job shall be introduced through a concrete scene: an opener that is a statement of what works, exactly one mechanism, a block that stands without the one above it, never a feature list. Generic claims ("einfach", "digital") are not copy. How that copy is written — register, structure, concreteness, economy, headings, length budgets, truth — is SRC-0017; which mechanism enforces which rule is SRC-0018. | SRC-0001#1a-scenes-not-labels, SRC-0017, SRC-0018, DEC-0080 | S3 |
| FUN-WEB-0009 | The website shall not present a visible role switcher or any "who are you?" self-classification prompt. | SRC-0001#6-assumptions-not-switches | S2 |

## Compliance

A page brief ships only when the eight-point check in SRC-0001 "Compliance
Check for a Page Brief" passes. That check is normative for every page
requirement in `pages.req.md`.

Copy ships only when the rules of SRC-0017 hold. SRC-0018 assigns each of
them to a schema budget, a `check:content` row, an e2e assertion or the
editorial gate, so "holds" is a run, not an opinion — except for the
eight rules the contract declares review-only, which TS-WEB-0006-A16 carries.
