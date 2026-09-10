---
id: DEC-042
title: Hub content is referenced by package name, never by repository path
status: accepted
date: 2026-09-10
decided_by: jan-henrik.hempel
---

## Context

The hub was restructured twice on 2026-09-10 — first to
`packages/{models,direction,operations,brands}/`, then to
`packages/{identity,market,evidence,operations}/`. Every spec that cited a
repository path went stale within hours. The npm package names did not
move.

## Decision

Specs reference hub content by **package name**:

| Content | Package |
| --- | --- |
| proof assets | `@schafe-vorm-fenster/proof` |
| press, awards, appearances | `@schafe-vorm-fenster/media-echo` |
| audience model | `@schafe-vorm-fenster/audiences` |
| business and conversion goals | `@schafe-vorm-fenster/goals` |
| offerings and pricing | `@schafe-vorm-fenster/offerings` |
| positioning, value propositions, pillars | `@schafe-vorm-fenster/messaging` |
| brand identity, imagery rules | `@schafe-vorm-fenster/brand-identity` |
| design system, logos, tokens | `@schafe-vorm-fenster/brand-design` |

Repository paths remain only for material that is not a package — the
concept documents, and files consulted as archive.

## Reasoning

The package name is the form the website will actually consume once the
packages are devDependencies (WEB-F-080), so the reference is not a
convention but the real address. It also survives the hub's internal
reorganisation, which the last day showed is frequent.

## Consequences

Path references in existing specs are corrected. A moved package is now a
rename with a changelog entry rather than a silent breakage.
