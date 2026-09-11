---
id: DEC-058
title: Service contracts are pinned in the repository and refreshed by script
status: accepted
date: 2026-09-11
decided_by: jan-henrik.hempel
---

## Decision

Every ecosystem service the website consumes has a folder under
`src/clients/<service>/` holding its **pinned OpenAPI specification** and a
README stating what the website uses it for and what it measurably cannot
do. `pnpm fetch:openapi` refreshes them from the production hosts.

This follows the sibling services' own pattern
(`events-api/src/clients/*/fetch-openapi.mjs`) and realises the convention
registered as SRC-011 (DEC-021): fetch, validate, store locally, commit.

## Reasoning

The specifications answer questions that were open in the specs — and
answered them differently than assumed in two cases. Pinning them turns an
upstream change into a diff in a pull request instead of a surprise at
runtime, and it prepares the client code without writing any.

## Consequences

Six services pinned: events-api, geo-api, calendar-api, envoy-api,
assets-api, classification-api. All six publish their specification
unauthenticated. The folders currently carry contracts and knowledge, not
implementations.
