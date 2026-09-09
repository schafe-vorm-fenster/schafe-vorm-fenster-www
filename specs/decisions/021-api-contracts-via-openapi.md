---
id: DEC-021
title: Service integration follows the product's OpenAPI contract pattern
status: accepted
date: 2026-09-09
decided_by: jan-henrik.hempel
---

## Context

Live modules need app APIs (Q-015). All ecosystem services already publish
OpenAPI 3.0+ specs at `/api/openapi`; the product consumes them via a
documented convention (fetch → validate → store `openapi.json` locally →
Zod-validate responses).

## Decision

The website adopts that convention unchanged
(`community-calendar/docs/api-clients/openapi-requirements.md` is the
canonical reference). The service register with hosts and relevant
operations is `specs/contracts/api-contracts.md` (SRC-011).

## Consequences

Q-015 is resolved except for one sliver: confirming that
`events-api /api/stats` covers all three counter figures. API changes
surface as diffs on pinned `openapi.json` files.
