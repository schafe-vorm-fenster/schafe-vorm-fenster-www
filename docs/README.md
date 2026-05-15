# Documentation

## Overview

Project documentation for the **Community Calendar** by Schafe vorm Fenster.

## Global Architecture

- [architecture.md](./architecture.md) — Monorepo structure, application layers, dependency rules, schema ownership, API client conventions
- [tech-stack.md](./tech-stack.md) — Technology choices, testing tiers, tooling decisions, forbidden tools
- [ecosystem-architecture-reference.md](./ecosystem-architecture-reference.md) — Backend and microservice ecosystem principles (out of scope for this repo, kept for reference)

## Deployment & Domains

- [domains.md](./domains.md) — Vercel domain configuration, TLD-based locale detection, production/preview/local domains

## API Clients

- [api-clients/](./api-clients/) — Index of all external API client packages
- [api-clients/openapi-requirements.md](./api-clients/openapi-requirements.md) — OpenAPI spec fetching, validation, storage, and CI requirements

## Architecture Decision Records

- [adr/001-consumer-owned-zod-schemas.md](./adr/001-consumer-owned-zod-schemas.md) — Consumer-owned Zod schemas over shared npm packages
- [adr/002-per-domain-services-intent-layouts.md](./adr/002-per-domain-services-intent-layouts.md) — Per-domain services with intent-driven layouts
- [adr/003-centralized-route-link-facade.md](./adr/003-centralized-route-link-facade.md) — Centralized route link facade for inter-page navigation

## Other

- [stories/](./stories/) — Feature stories and roadmap
- [raw-material/](./raw-material/) — Research notes and raw planning material
