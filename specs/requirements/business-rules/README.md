# Business Rules

## Purpose

A business rule holds independently of whoever applies it.
`@leafcutter-strict/method-requirement-classification` asks it first, before
anything else: *"Does it hold independently of any executor? — a business
rule. 'An invoice over 10,000 counts as material' is true whether a system,
a clerk or nobody applies it."* The method adds that a rule has no system
subject, and that the rule and the requirement that applies it are two
artefacts — *"Merging them hides the rule from every other consumer of it."*

That is why this class exists separately from `constraints/`: a constraint
is imposed on **the solution** from outside, a business rule is true about
**the business** whatever the solution does with it.

Each rule is **one document**, named for its identifier
(`BUS-WEB-0012.md`). This file is the index.

## Index

### Audience model

| ID | Source | Suff. |
| --- | --- | --- |
| [BUS-WEB-0012](BUS-WEB-0012.md) | SRC-0001#boundaries | S2 |

### Pages

| ID | Source | Suff. |
| --- | --- | --- |
| [BUS-WEB-0015](BUS-WEB-0015.md) | SRC-0003, DEC-0060, DEC-0052 | S3 |
| [BUS-WEB-0016](BUS-WEB-0016.md) | SRC-0003#for-a-whole-region | S2 |

### Scope Boundaries

| ID | Source | Suff. |
| --- | --- | --- |
| [BUS-WEB-0013](BUS-WEB-0013.md) | SRC-0001#boundaries, `@schafe-vorm-fenster/offerings` | S2 |
| [BUS-WEB-0014](BUS-WEB-0014.md) | SRC-0001#boundaries | S2 |
