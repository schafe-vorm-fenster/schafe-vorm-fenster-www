# Contracts

## Purpose

Machine-readable contracts the website builds against: the OpenAPI
specifications of the ecosystem services, and the Zod schemas for website
content formats. A contract is what allows an output — an API response, a
generated content file — to be validated by a tool before any human reads
it.

## Contents

- `api-contracts.md` — the service contract register (SRC-011)
- Content-format Zod schemas live in code (`src/domain/`), required by
  WEB-F-089; this folder documents *which* contracts exist and where.

## Convention

API contracts follow the product's proven pattern
(`community-calendar/docs/api-clients/openapi-requirements.md`, adopted by
DEC-021): every service publishes OpenAPI 3.0+ at a well-known endpoint;
consumers fetch, validate, and store the spec locally at build time and
validate responses at runtime with Zod schemas derived from it.
