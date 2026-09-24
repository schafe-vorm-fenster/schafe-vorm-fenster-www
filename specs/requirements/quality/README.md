# Quality Requirements

## Purpose

How well the website does what it does: performance, accessibility,
privacy. Sources: the requirements transcript (SRC-0006), the adopted
product performance budget (SRC-0007, DEC-0007), and the communication
principles where they bind quality (no tracking as a trust argument).

Each requirement is **one document**, named for its identifier
(`NFR-WEB-0001.md`). This file is the index: it groups them by area,
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
| [NFR-WEB-0001](NFR-WEB-0001.md) | SRC-0006, DEC-0007 | S3 |
| [NFR-WEB-0002](NFR-WEB-0002.md) | SRC-0007, DEC-0007 | S3 |
| [NFR-WEB-0003](NFR-WEB-0003.md) | SRC-0007, DEC-0007 | S3 |
| [NFR-WEB-0004](NFR-WEB-0004.md) | SRC-0007 | S2 |
| [NFR-WEB-0005](NFR-WEB-0005.md) | SRC-0007, brand kit | S2 |
| [NFR-WEB-0006](NFR-WEB-0006.md) | SRC-0007 | S2 |
| [NFR-WEB-0007](NFR-WEB-0007.md) | SRC-0007 | S2 |
| [NFR-WEB-0009](NFR-WEB-0009.md) | SRC-0014#aspect-ratios-and-reserved-space, DEC-0056 | S3 |
| [NFR-WEB-0008](NFR-WEB-0008.md) | SRC-0006 | S2 |

### Accessibility

| ID | Source | Suff. |
| --- | --- | --- |
| [NFR-WEB-0010](NFR-WEB-0010.md) | SRC-0006 | S2 |
| [NFR-WEB-0011](NFR-WEB-0011.md) | SRC-0006, SRC-0014#accessibility, DEC-0056 | S3 |
| [NFR-WEB-0012](NFR-WEB-0012.md) | SRC-0006 | S2 |
| [NFR-WEB-0013](NFR-WEB-0013.md) | SRC-0006, SRC-0014, DEC-0056 | S3 |
| [NFR-WEB-0014](NFR-WEB-0014.md) | SRC-0006 | S2 |
| [NFR-WEB-0015](NFR-WEB-0015.md) | SRC-0006 | S2 |
| [NFR-WEB-0016](NFR-WEB-0016.md) | SRC-0006 | S1 |
| [NFR-WEB-0017](NFR-WEB-0017.md) | SRC-0006 (implied by AA) | S2 |
| [NFR-WEB-0018](NFR-WEB-0018.md) | SRC-0006 | S2 |
| [NFR-WEB-0019](NFR-WEB-0019.md) | derived; convention | S1 |
| [NFR-WEB-0026](NFR-WEB-0026.md) | DEC-0012 | S3 |
| [NFR-WEB-0027](NFR-WEB-0027.md) | DEC-0012, DEC-0039 | S3 |

### Privacy

| ID | Source | Suff. |
| --- | --- | --- |
| [NFR-WEB-0020](NFR-WEB-0020.md) | SRC-0006, DEC-0004 | S3 |
| [NFR-WEB-0021](NFR-WEB-0021.md) | SRC-0006, DEC-0004, DEC-0028 | S3 |
| [NFR-WEB-0022](NFR-WEB-0022.md) | SRC-0006, DEC-0004 | S3 |
| [NFR-WEB-0023](NFR-WEB-0023.md) | SRC-0001#boundaries, SRC-0003 | S2 |
| [NFR-WEB-0024](NFR-WEB-0024.md) | SRC-0006 | S1 |
| [NFR-WEB-0025](NFR-WEB-0025.md) | derived; convention | S1 |
| [NFR-WEB-0028](NFR-WEB-0028.md) | DEC-0016, DEC-0028 | S3 |

### Security

| ID | Source | Suff. |
| --- | --- | --- |
| [NFR-WEB-0030](NFR-WEB-0030.md) | DEC-0015 | S3 |
| [NFR-WEB-0031](NFR-WEB-0031.md) | DEC-0015 | S3 |
| [NFR-WEB-0032](NFR-WEB-0032.md) | DEC-0015 | S3 |
| [NFR-WEB-0033](NFR-WEB-0033.md) | DEC-0015 | S3 |
| [NFR-WEB-0034](NFR-WEB-0034.md) | platform default | S2 |
| [NFR-WEB-0035](NFR-WEB-0035.md) | DEC-0014 | S3 |
| [NFR-WEB-0036](NFR-WEB-0036.md) | DEC-0017 | S3 |
| [NFR-WEB-0037](NFR-WEB-0037.md) | DEC-0025 | S3 |
| [NFR-WEB-0038](NFR-WEB-0038.md) | DEC-0025 | S3 |
