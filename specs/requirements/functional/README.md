# Functional Requirements

## Purpose

What the website does. Extracted from the three concept documents
(SRC-0001..003), the requirements transcript (SRC-0006), and the adopted
product mechanisms (SRC-0007).

Each requirement is **one document**, named for its identifier
(`FUN-WEB-0001.md`). This file is the index: it groups them by area,
carries the area notes that belong to no single requirement, and records
each requirement's source and evidence-sufficiency level. The statement
itself lives in the requirement's own file and nowhere else.

## Index

### Jobs and Navigation

Primary source: SRC-0001 (`go-to-market-os/concept/website-communication-principles.concept.md`).
The four jobs, their conversions and audience mappings are defined there
(§1 "Jobs, not audiences") and are referenced, not restated.

#### Compliance

A page brief ships only when the eight-point check in SRC-0001 "Compliance
Check for a Page Brief" passes. That check is normative for every page
requirement in the `Pages` area below.

Copy ships only when the rules of SRC-0017 hold. SRC-0018 assigns each of
them to a schema budget, a `check:content` row, an e2e assertion or the
editorial gate, so "holds" is a run, not an opinion — except for the
eight rules the contract declares review-only, which TS-WEB-0006-A16 carries.

| ID | Source | Suff. |
| --- | --- | --- |
| [FUN-WEB-0001](FUN-WEB-0001.md) | SRC-0001#1-jobs-not-audiences | S2 |
| [FUN-WEB-0002](FUN-WEB-0002.md) | SRC-0001#1, SRC-0003#navigation | S2 |
| [FUN-WEB-0004](FUN-WEB-0004.md) | SRC-0001#2 | S2 |
| [FUN-WEB-0005](FUN-WEB-0005.md) | SRC-0001#2 | S2 |
| [FUN-WEB-0006](FUN-WEB-0006.md) | SRC-0001#7, SRC-0014#page-rhythm | S2 |
| [FUN-WEB-0007](FUN-WEB-0007.md) | SRC-0001#1 | S2 |
| [FUN-WEB-0009](FUN-WEB-0009.md) | SRC-0001#6-assumptions-not-switches | S2 |
| [FUN-WEB-0133](FUN-WEB-0133.md) | SRC-0001#2-order-do-not-exclude, DEC-0082 | S3 |
| [FUN-WEB-0134](FUN-WEB-0134.md) | SRC-0001#2-order-do-not-exclude, DEC-0082 | S3 |
| [FUN-WEB-0135](FUN-WEB-0135.md) | SRC-0001#2-order-do-not-exclude, DEC-0082 | S3 |
| [FUN-WEB-0136](FUN-WEB-0136.md) | SRC-0001#2-order-do-not-exclude, DEC-0082 | S3 |
| [FUN-WEB-0138](FUN-WEB-0138.md) | SRC-0001#1a-scenes-not-labels, SRC-0017, SRC-0018, DEC-0080 | S3 |

### Pages

Primary source: SRC-0003 (`go-to-market-os/concept/website-information-architecture.concept.md`).
Page briefs (structure, audiences in priority order, live modules) are
defined there per page and referenced — this file fixes existence, route,
focus job, and primary conversion. Conversion goal IDs resolve in
`@schafe-vorm-fenster/goals`.

| ID | Source | Suff. |
| --- | --- | --- |
| [FUN-WEB-0010](FUN-WEB-0010.md) | SRC-0003#home | S2 |
| [FUN-WEB-0011](FUN-WEB-0011.md) | SRC-0003#your-place-dein-ort | S2 |
| [FUN-WEB-0012](FUN-WEB-0012.md) | SRC-0003#publish-our-dates-mitmachen | S2 |
| [FUN-WEB-0013](FUN-WEB-0013.md) | SRC-0003#register-mitmachenregistrieren | S2 |
| [FUN-WEB-0014](FUN-WEB-0014.md) | SRC-0003, DEC-0036 | S3 |
| [FUN-WEB-0015](FUN-WEB-0015.md) | SRC-0003, DEC-0011, DEC-0036 | S3 |
| [FUN-WEB-0016](FUN-WEB-0016.md) | SRC-0003, DEC-0036 | S3 |
| [FUN-WEB-0017](FUN-WEB-0017.md) | SRC-0003, DEC-0036, DEC-0052, DEC-0081 | S3 |
| [FUN-WEB-0018](FUN-WEB-0018.md) | SRC-0003#archive | S2 |
| [FUN-WEB-0027](FUN-WEB-0027.md) | DEC-0032 | S3 |
| [FUN-WEB-0137](FUN-WEB-0137.md) | SRC-0003#navigation, DEC-0012, DEC-0039, DEC-0052, DEC-0081 | S3 |
| [FUN-WEB-0139](FUN-WEB-0139.md) | SRC-0003#conversion-map, DEC-0052, DEC-0081 | S2 |
| [FUN-WEB-0140](FUN-WEB-0140.md) | SRC-0003#navigation, DEC-0012, DEC-0039, DEC-0052, DEC-0081 | S3 |
| [FUN-WEB-0141](FUN-WEB-0141.md) | SRC-0003#navigation, DEC-0012, DEC-0039, DEC-0052, DEC-0081 | S3 |
| [FUN-WEB-0145](FUN-WEB-0145.md) | DEC-0032 | S3 |
| [FUN-WEB-0146](FUN-WEB-0146.md) | DEC-0039 | S3 |
| [FUN-WEB-0147](FUN-WEB-0147.md) | DEC-0032 | S3 |
| [FUN-WEB-0148](FUN-WEB-0148.md) | DEC-0034 | S3 |
| [FUN-WEB-0202](FUN-WEB-0202.md) | SRC-0003, DEC-0060, DEC-0052 | S3 |
| [FUN-WEB-0203](FUN-WEB-0203.md) | SRC-0003#for-a-whole-region | S2 |
| [FUN-WEB-0204](FUN-WEB-0204.md) | SRC-0008 — `@schafe-vorm-fenster/offerings`, DEC-0107 | S3 |
| [FUN-WEB-0205](FUN-WEB-0205.md) | DEC-0013 amendment 2026-09-25 | S3 |

### Place Search and Coverage

| ID | Source | Suff. |
| --- | --- | --- |
| [FUN-WEB-0048](FUN-WEB-0048.md) | entre repo, DEC-0028, DEC-0035 | S3 |
| [FUN-WEB-0049](FUN-WEB-0049.md) | DEC-0029 | S3 |
| [FUN-WEB-0142](FUN-WEB-0142.md) | DEC-0037 | S3 |
| [FUN-WEB-0155](FUN-WEB-0155.md) | DEC-0079, DEC-0024 | S3 |
| [FUN-WEB-0156](FUN-WEB-0156.md) | DEC-0079, DEC-0024 | S3 |
| [FUN-WEB-0157](FUN-WEB-0157.md) | DEC-0079, DEC-0024 | S3 |
| [FUN-WEB-0158](FUN-WEB-0158.md) | DEC-0024, DEC-0036, DEC-0037, DEC-0079 | S3 |
| [FUN-WEB-0159](FUN-WEB-0159.md) | DEC-0024, DEC-0036, DEC-0037, DEC-0079 | S3 |

### Relevance and Proof

Primary source: SRC-0002 (`go-to-market-os/concept/website-relevance-model.concept.md`)
— binding "for every module that renders more than one proof element or any
live content". Formula, weights, matrices are defined there and referenced.

| ID | Source | Suff. |
| --- | --- | --- |
| [FUN-WEB-0024](FUN-WEB-0024.md) | DEC-0024 | S3 |
| [FUN-WEB-0030](FUN-WEB-0030.md) | SRC-0001#3 | S2 |
| [FUN-WEB-0031](FUN-WEB-0031.md) | SRC-0002#sequence-rule | S2 |
| [FUN-WEB-0033](FUN-WEB-0033.md) | SRC-0002#scoring | S2 |
| [FUN-WEB-0034](FUN-WEB-0034.md) | SRC-0002#scoring | S2 |
| [FUN-WEB-0035](FUN-WEB-0035.md) | SRC-0002#context-matrix | S2 |
| [FUN-WEB-0037](FUN-WEB-0037.md) | SRC-0001#4, SRC-0003#archive | S2 |
| [FUN-WEB-0038](FUN-WEB-0038.md) | SRC-0002#required-data | S2 |
| [FUN-WEB-0039](FUN-WEB-0039.md) | SRC-0002#required-data | S1 |
| [FUN-WEB-0149](FUN-WEB-0149.md) | SRC-0002#scoring | S2 |
| [FUN-WEB-0150](FUN-WEB-0150.md) | SRC-0001#4-proof-is-context | S2 |
| [FUN-WEB-0151](FUN-WEB-0151.md) | SRC-0001#4-proof-is-context | S2 |

### Live Data

#### Dependency

Live modules build against the ecosystem services registered in
`../../contracts/api-contracts.md` (SRC-0011): events-api (search per
community/scope/category; public `/api/stats` for counters), geo-api
(place search, hierarchy, findbyaddress), calendar-api (organizer/embed
metadata). Integration follows the product's OpenAPI convention (DEC-0021):
fetch and pin `openapi.json` at build time, validate responses with
derived Zod schemas. Remaining sliver: Q-0015 (do the `/api/stats` fields
cover all three counter figures?).

| ID | Source | Suff. |
| --- | --- | --- |
| [FUN-WEB-0040](FUN-WEB-0040.md) | SRC-0001#5-live-data-carries-the-argument | S2 |
| [FUN-WEB-0041](FUN-WEB-0041.md) | SRC-0001#5 | S2 |
| [FUN-WEB-0042](FUN-WEB-0042.md) | SRC-0002#live-content | S2 |
| [FUN-WEB-0043](FUN-WEB-0043.md) | SRC-0002#live-content, DEC-0030 | S3 |
| [FUN-WEB-0045](FUN-WEB-0045.md) | SRC-0001#5 | S2 |
| [FUN-WEB-0153](FUN-WEB-0153.md) | SRC-0002#live-content, SRC-0003#your-place | S2 |
| [FUN-WEB-0154](FUN-WEB-0154.md) | SRC-0002#live-content, SRC-0003#your-place | S2 |

### Personalization Stages

| ID | Source | Suff. |
| --- | --- | --- |
| [FUN-WEB-0050](FUN-WEB-0050.md) | SRC-0001#6-assumptions-not-switches | S2 |
| [FUN-WEB-0051](FUN-WEB-0051.md) | SRC-0001#6 | S2 |
| [FUN-WEB-0052](FUN-WEB-0052.md) | SRC-0001#6 | S2 |
| [FUN-WEB-0054](FUN-WEB-0054.md) | SRC-0006, SRC-0005#blockers | S1 |
| [FUN-WEB-0055](FUN-WEB-0055.md) | SRC-0001#6, SRC-0002#context-matrix | S2 |
| [FUN-WEB-0056](FUN-WEB-0056.md) | SRC-0006 | S2 |
| [FUN-WEB-0160](FUN-WEB-0160.md) | SRC-0006 (transcript), SRC-0001#6 | S2 |
| [FUN-WEB-0161](FUN-WEB-0161.md) | SRC-0006 (transcript), SRC-0001#6 | S2 |
| [FUN-WEB-0162](FUN-WEB-0162.md) | SRC-0006 (transcript), SRC-0001#6 | S2 |

### Localization and Domains

The locale mechanism is adopted from the proven product model
(`community-calendar/docs/localization-architecture.md`, SRC-0007) by
DEC-0005. The canonical mechanism documentation stays in that repository.

| ID | Source | Suff. |
| --- | --- | --- |
| [FUN-WEB-0060](FUN-WEB-0060.md) | SRC-0006, DEC-0003, DEC-0035 | S3 |
| [FUN-WEB-0062](FUN-WEB-0062.md) | SRC-0007, DEC-0005 | S3 |
| [FUN-WEB-0063](FUN-WEB-0063.md) | SRC-0007, DEC-0005 | S3 |
| [FUN-WEB-0065](FUN-WEB-0065.md) | SRC-0007, DEC-0005 | S3 |
| [FUN-WEB-0066](FUN-WEB-0066.md) | SRC-0006, DEC-0006 | S3 |
| [FUN-WEB-0067](FUN-WEB-0067.md) | SRC-0006 | S2 |
| [FUN-WEB-0068](FUN-WEB-0068.md) | SRC-0006, DEC-0006 | S1 |
| [FUN-WEB-0163](FUN-WEB-0163.md) | SRC-0007, DEC-0005 | S3 |
| [FUN-WEB-0164](FUN-WEB-0164.md) | SRC-0007, DEC-0005 | S3 |
| [FUN-WEB-0165](FUN-WEB-0165.md) | SRC-0007, DEC-0005 | S3 |
| [FUN-WEB-0166](FUN-WEB-0166.md) | SRC-0007, DEC-0005 | S3 |
| [FUN-WEB-0168](FUN-WEB-0168.md) | SRC-0007, DEC-0038 | S2 |

### SEO

| ID | Source | Suff. |
| --- | --- | --- |
| [FUN-WEB-0070](FUN-WEB-0070.md) | SRC-0006 | S2 |
| [FUN-WEB-0071](FUN-WEB-0071.md) | SRC-0006 | S2 |
| [FUN-WEB-0072](FUN-WEB-0072.md) | SRC-0006 | S2 |
| [FUN-WEB-0073](FUN-WEB-0073.md) | SRC-0006, convention | S2 |
| [FUN-WEB-0074](FUN-WEB-0074.md) | SRC-0006 | S2 |
| [FUN-WEB-0076](FUN-WEB-0076.md) | SRC-0006 | S2 |
| [FUN-WEB-0077](FUN-WEB-0077.md) | SRC-0006 | S2 |
| [FUN-WEB-0078](FUN-WEB-0078.md) | convention | S2 |
| [FUN-WEB-0169](FUN-WEB-0169.md) | DEC-0018 | S3 |
| [FUN-WEB-0170](FUN-WEB-0170.md) | DEC-0018 | S3 |

### Content Pipeline

Foundation: ADR-001 (`go-to-market-os` is the single source of truth for
content, delivered as packages; SRC-0009).

| ID | Source | Suff. |
| --- | --- | --- |
| [FUN-WEB-0083](FUN-WEB-0083.md) | SRC-0006, DEC-0020 | S3 |
| [FUN-WEB-0089](FUN-WEB-0089.md) | DEC-0020 | S3 |
| [FUN-WEB-0143](FUN-WEB-0143.md) | DEC-0026 | S3 |
| [FUN-WEB-0144](FUN-WEB-0144.md) | DEC-0026 | S3 |
| [FUN-WEB-0171](FUN-WEB-0171.md) | SRC-0009 ADR-001, SRC-0006, DEC-0020 | S3 |
| [FUN-WEB-0172](FUN-WEB-0172.md) | SRC-0006, DEC-0020 | S3 |
| [FUN-WEB-0173](FUN-WEB-0173.md) | SRC-0006, DEC-0020 | S3 |
| [FUN-WEB-0174](FUN-WEB-0174.md) | SRC-0006, DEC-0020 | S3 |
| [FUN-WEB-0175](FUN-WEB-0175.md) | SRC-0006, SRC-0009 | S2 |
| [FUN-WEB-0176](FUN-WEB-0176.md) | SRC-0006, SRC-0009 | S2 |
| [FUN-WEB-0177](FUN-WEB-0177.md) | SRC-0006, SRC-0009 | S2 |
| [FUN-WEB-0178](FUN-WEB-0178.md) | SRC-0009 ADR-001 | S3 |
| [FUN-WEB-0179](FUN-WEB-0179.md) | SRC-0009 ADR-001, DEC-0022 | S3 |
| [FUN-WEB-0180](FUN-WEB-0180.md) | DEC-0012, DEC-0027 | S3 |
| [FUN-WEB-0181](FUN-WEB-0181.md) | DEC-0012, DEC-0027 | S3 |
| [FUN-WEB-0182](FUN-WEB-0182.md) | DEC-0012, DEC-0027 | S3 |

### Forms and Leads

| ID | Source | Suff. |
| --- | --- | --- |
| [FUN-WEB-0091](FUN-WEB-0091.md) | DEC-0009 | S3 |
| [FUN-WEB-0092](FUN-WEB-0092.md) | DEC-0009 | S3 |
| [FUN-WEB-0095](FUN-WEB-0095.md) | DEC-0013 | S3 |
| [FUN-WEB-0152](FUN-WEB-0152.md) | DEC-0010, DEC-0081 | S3 |
| [FUN-WEB-0183](FUN-WEB-0183.md) | DEC-0009, DEC-0081 | S3 |
| [FUN-WEB-0184](FUN-WEB-0184.md) | DEC-0010, DEC-0081 | S3 |
| [FUN-WEB-0185](FUN-WEB-0185.md) | DEC-0010, DEC-0081 | S3 |
| [FUN-WEB-0186](FUN-WEB-0186.md) | DEC-0051, DEC-0052 | S3 |
| [FUN-WEB-0187](FUN-WEB-0187.md) | DEC-0010, DEC-0081 | S3 |
| [FUN-WEB-0188](FUN-WEB-0188.md) | DEC-0011, DEC-0051 | S3 |
| [FUN-WEB-0189](FUN-WEB-0189.md) | DEC-0011, DEC-0051 | S3 |
| [FUN-WEB-0190](FUN-WEB-0190.md) | DEC-0051, DEC-0052 | S3 |
| [FUN-WEB-0191](FUN-WEB-0191.md) | DEC-0051, DEC-0052 | S3 |

### Rendering and Resilience

| ID | Source | Suff. |
| --- | --- | --- |
| [FUN-WEB-0102](FUN-WEB-0102.md) | DEC-0019 | S3 |
| [FUN-WEB-0103](FUN-WEB-0103.md) | DEC-0019 | S3 |
| [FUN-WEB-0105](FUN-WEB-0105.md) | DEC-0019 | S1 |
| [FUN-WEB-0192](FUN-WEB-0192.md) | DEC-0019 | S3 |
| [FUN-WEB-0193](FUN-WEB-0193.md) | DEC-0019 | S3 |
| [FUN-WEB-0194](FUN-WEB-0194.md) | DEC-0019 | S3 |
| [FUN-WEB-0195](FUN-WEB-0195.md) | DEC-0019 | S3 |
| [FUN-WEB-0196](FUN-WEB-0196.md) | DEC-0019 | S3 |
| [FUN-WEB-0197](FUN-WEB-0197.md) | DEC-0019 | S3 |
| [FUN-WEB-0198](FUN-WEB-0198.md) | DEC-0033, SRC-0014#skeletons, DEC-0056 | S3 |
| [FUN-WEB-0199](FUN-WEB-0199.md) | DEC-0033, SRC-0014#skeletons, DEC-0056 | S3 |
| [FUN-WEB-0200](FUN-WEB-0200.md) | DEC-0033, SRC-0014#skeletons, DEC-0056 | S3 |

### Accessibility

| ID | Source | Suff. |
| --- | --- | --- |
| [FUN-WEB-0118](FUN-WEB-0118.md) | SRC-0006, SRC-0014, DEC-0056 | S3 |
| [FUN-WEB-0119](FUN-WEB-0119.md) | SRC-0006, SRC-0014, DEC-0056 | S3 |
| [FUN-WEB-0120](FUN-WEB-0120.md) | SRC-0006, SRC-0014, DEC-0056 | S3 |
| [FUN-WEB-0121](FUN-WEB-0121.md) | SRC-0006 (implied by AA) | S2 |
| [FUN-WEB-0122](FUN-WEB-0122.md) | derived; convention | S1 |
| [FUN-WEB-0123](FUN-WEB-0123.md) | derived; convention | S1 |
| [FUN-WEB-0128](FUN-WEB-0128.md) | SRC-0006 | S2 |
| [FUN-WEB-0129](FUN-WEB-0129.md) | SRC-0006 | S2 |
| [FUN-WEB-0130](FUN-WEB-0130.md) | SRC-0006 | S2 |

### Performance

| ID | Source | Suff. |
| --- | --- | --- |
| [FUN-WEB-0107](FUN-WEB-0107.md) | SRC-0007 | S2 |
| [FUN-WEB-0108](FUN-WEB-0108.md) | SRC-0007 | S2 |
| [FUN-WEB-0109](FUN-WEB-0109.md) | SRC-0007, brand kit | S2 |
| [FUN-WEB-0110](FUN-WEB-0110.md) | SRC-0007, brand kit | S2 |
| [FUN-WEB-0111](FUN-WEB-0111.md) | SRC-0007, brand kit | S2 |
| [FUN-WEB-0112](FUN-WEB-0112.md) | SRC-0007 | S2 |
| [FUN-WEB-0113](FUN-WEB-0113.md) | SRC-0007 | S2 |
| [FUN-WEB-0114](FUN-WEB-0114.md) | SRC-0007 | S2 |
| [FUN-WEB-0115](FUN-WEB-0115.md) | SRC-0007 | S2 |
| [FUN-WEB-0116](FUN-WEB-0116.md) | SRC-0014#aspect-ratios-and-reserved-space, DEC-0056 | S3 |
| [FUN-WEB-0117](FUN-WEB-0117.md) | SRC-0014#aspect-ratios-and-reserved-space, DEC-0056 | S3 |

### Privacy

| ID | Source | Suff. |
| --- | --- | --- |
| [FUN-WEB-0124](FUN-WEB-0124.md) | SRC-0006, DEC-0004, DEC-0028 | S3 |
| [FUN-WEB-0125](FUN-WEB-0125.md) | SRC-0001#boundaries, SRC-0003 | S2 |
| [FUN-WEB-0126](FUN-WEB-0126.md) | derived; convention | S1 |

### Security

| ID | Source | Suff. |
| --- | --- | --- |
| [FUN-WEB-0127](FUN-WEB-0127.md) | DEC-0015 | S3 |

### Scope Boundaries

| ID | Source | Suff. |
| --- | --- | --- |
| [FUN-WEB-0132](FUN-WEB-0132.md) | SRC-0003#navigation | S2 |
| [FUN-WEB-0201](FUN-WEB-0201.md) | SRC-0001#boundaries, `@schafe-vorm-fenster/offerings` | S2 |

### Technical Constraints

| ID | Source | Suff. |
| --- | --- | --- |
| [FUN-WEB-0131](FUN-WEB-0131.md) | SRC-0001#purpose, SRC-0003 | S2 |
