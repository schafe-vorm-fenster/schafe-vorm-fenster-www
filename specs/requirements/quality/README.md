# Quality Requirements

## Purpose

How well the website does what it does: performance, accessibility,
privacy, security. Sources: the requirements transcript (SRC-0006), the
adopted product performance budget (SRC-0007, DEC-0007), and the
communication principles where they bind quality (no tracking as a trust
argument).

Every statement here is a measure, in the shape
`@leafcutter-strict/method-statement-grammar` gives the class: `<scale>` of
`<object>` SHALL be `<operator>` `<value>` `<unit>` measured by `<meter>`.
DEC-0092 is where that became true — a statement bundling several measures
was split into one requirement per measure, a statement with no measure was
reclassified out of this class, and no value was invented: every one of them
is read off an artefact this repository already holds, which is also the
meter the statement names.

Each requirement is **one document**, named for its identifier
(`NFR-WEB-0039.md`). This file is the index: it groups them by area,
carries the area notes that belong to no single requirement, and records
each requirement's source and evidence-sufficiency level. The statement
itself lives in the requirement's own file and nowhere else.

## Index

### Performance

Budget adopted from `community-calendar/docs/performance-budget.md`
(SRC-0007) by DEC-0007, with FID replaced by INP; Lighthouse targets from
the transcript (SRC-0006).

Cache strategy: the product's edge-cache table was **not** adopted
(product-specific page types). Website cache values: UNKNOWN, to be set in
the tactical spec per page type.

| ID | Source | Suff. |
| --- | --- | --- |
| [NFR-WEB-0008](NFR-WEB-0008.md) | SRC-0006 | S2 |
| [NFR-WEB-0039](NFR-WEB-0039.md) | SRC-0006, DEC-0007 | S3 |
| [NFR-WEB-0040](NFR-WEB-0040.md) | SRC-0006, DEC-0007 | S3 |
| [NFR-WEB-0041](NFR-WEB-0041.md) | SRC-0006, DEC-0007 | S3 |
| [NFR-WEB-0042](NFR-WEB-0042.md) | SRC-0006, DEC-0007 | S3 |
| [NFR-WEB-0043](NFR-WEB-0043.md) | SRC-0006, DEC-0007 | S3 |
| [NFR-WEB-0044](NFR-WEB-0044.md) | SRC-0006, DEC-0007 | S3 |
| [NFR-WEB-0045](NFR-WEB-0045.md) | SRC-0006, DEC-0007 | S3 |
| [NFR-WEB-0046](NFR-WEB-0046.md) | SRC-0006, DEC-0007 | S3 |
| [NFR-WEB-0047](NFR-WEB-0047.md) | SRC-0007, DEC-0007 | S3 |
| [NFR-WEB-0048](NFR-WEB-0048.md) | SRC-0007, DEC-0007 | S3 |
| [NFR-WEB-0049](NFR-WEB-0049.md) | SRC-0007, DEC-0007 | S3 |
| [NFR-WEB-0050](NFR-WEB-0050.md) | SRC-0007, DEC-0007 | S3 |
| [NFR-WEB-0051](NFR-WEB-0051.md) | SRC-0007, DEC-0007 | S3 |
| [NFR-WEB-0052](NFR-WEB-0052.md) | SRC-0007, DEC-0007 | S3 |
| [NFR-WEB-0053](NFR-WEB-0053.md) | SRC-0007, DEC-0007 | S3 |
| [NFR-WEB-0054](NFR-WEB-0054.md) | SRC-0007, DEC-0007 | S3 |
| [NFR-WEB-0055](NFR-WEB-0055.md) | SRC-0007, DEC-0007 | S3 |
| [NFR-WEB-0056](NFR-WEB-0056.md) | SRC-0007, DEC-0007 | S3 |

### Accessibility

| ID | Source | Suff. |
| --- | --- | --- |
| [NFR-WEB-0016](NFR-WEB-0016.md) | SRC-0006 | S1 |
| [NFR-WEB-0018](NFR-WEB-0018.md) | SRC-0006 | S2 |
| [NFR-WEB-0057](NFR-WEB-0057.md) | SRC-0006 | S2 |
| [NFR-WEB-0058](NFR-WEB-0058.md) | SRC-0006, SRC-0014#accessibility, DEC-0056 | S3 |
| [NFR-WEB-0059](NFR-WEB-0059.md) | SRC-0006, SRC-0014#accessibility, DEC-0056 | S3 |
| [NFR-WEB-0060](NFR-WEB-0060.md) | SRC-0006 (implied by AA) | S2 |

### Privacy

| ID | Source | Suff. |
| --- | --- | --- |
| [NFR-WEB-0022](NFR-WEB-0022.md) | SRC-0006, DEC-0004 | S3 |
| [NFR-WEB-0024](NFR-WEB-0024.md) | SRC-0006 | S1 |
| [NFR-WEB-0061](NFR-WEB-0061.md) | SRC-0006, DEC-0004 | S3 |
| [NFR-WEB-0062](NFR-WEB-0062.md) | SRC-0006, DEC-0004 | S3 |
| [NFR-WEB-0063](NFR-WEB-0063.md) | derived; convention | S1 |
| [NFR-WEB-0064](NFR-WEB-0064.md) | DEC-0016, DEC-0028 | S3 |

### Security

| ID | Source | Suff. |
| --- | --- | --- |
| [NFR-WEB-0065](NFR-WEB-0065.md) | DEC-0014 | S3 |
