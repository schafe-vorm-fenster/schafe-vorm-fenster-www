---
id: DEC-049
title: Assessments expire after twelve months or a major version
status: accepted
date: 2026-09-10
decided_by: jan-henrik.hempel
---

## Decision

The two sticky judgement facets — `job_relation` and `editorial_weight` —
carry the date they were set. An assessment is due for review when it is
**older than twelve months** or when **the source package crosses a major
version**, whichever comes first.

Expired assessments appear in the build report as a countable list and do
**not** block the build. They stay in force until someone re-assesses;
the point is visibility, not interruption.

## Reasoning

These are the only two fields in the content model that hold a standing
human judgement rather than a derived fact. Without a trigger the site
would, after a year, order itself by opinions nobody currently holds —
and nobody would notice, because everything would keep validating.

## Consequences

→ TS-007 (schema carries `assessed_at`; the content check reports
expiry), TS-005 D3/D4. Resolves Q-031.
