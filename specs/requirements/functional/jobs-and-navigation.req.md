---
artefact: requirements
area: jobs-and-navigation
status: DRAFT
sources: [SRC-001, SRC-003, SRC-017, SRC-018]
---

# Jobs and Navigation

Primary source: SRC-001 (`go-to-market-os/concept/website-communication-principles.concept.md`).
The four jobs, their conversions and audience mappings are defined there
(§1 "Jobs, not audiences") and are referenced, not restated.

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| WEB-F-001 | Every page shall declare exactly one focus job in its brief; the four jobs are defined in SRC-001 §1. | SRC-001#1-jobs-not-audiences | S2 |
| WEB-F-002 | Navigation labels shall name jobs — never audiences and never product names. The four labels and targets are defined in SRC-003 "Navigation". | SRC-001#1, SRC-003#navigation | S2 |
| WEB-F-003 | Each page shall present exactly one primary conversion, above the fold, visually unrivalled. | SRC-001#2-order-do-not-exclude | S2 |
| WEB-F-004 | All four jobs shall be reachable from every page within at most one click. | SRC-001#2 | S2 |
| WEB-F-005 | Every page shall carry a context band naming the other three jobs, phrased as an offer, placed below the main argument and above the closing CTA. | SRC-001#2 | S2 |
| WEB-F-006 | The last block of every page shall be the CTA of its focus job (identical to the primary conversion), preceded by the context band. Section order and colour rhythm follow SRC-014 "Page Rhythm". | SRC-001#7, SRC-014#page-rhythm | S2 |
| WEB-F-007 | The job "know what is on" shall be fulfilled in place on the home page (place search, or live dates of the visitor's place), not offered as a click target. | SRC-001#1 | S2 |
| WEB-F-008 | Each job shall be introduced through a concrete scene: an opener that is a statement of what works, exactly one mechanism, a block that stands without the one above it, never a feature list. Generic claims ("einfach", "digital") are not copy. How that copy is written — register, structure, concreteness, economy, headings, length budgets, truth — is SRC-017; which mechanism enforces which rule is SRC-018. | SRC-001#1a-scenes-not-labels, SRC-017, SRC-018, DEC-080 | S3 |
| WEB-F-009 | The website shall not present a visible role switcher or any "who are you?" self-classification prompt. | SRC-001#6-assumptions-not-switches | S2 |

## Compliance

A page brief ships only when the eight-point check in SRC-001 "Compliance
Check for a Page Brief" passes. That check is normative for every page
requirement in `pages.req.md`.

Copy ships only when the rules of SRC-017 hold. SRC-018 assigns each of
them to a schema budget, a `check:content` row, an e2e assertion or the
editorial gate, so "holds" is a run, not an opinion — except for the
eleven rules the contract declares review-only, which TS-006-A16 carries.
