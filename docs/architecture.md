# Architecture

## Mono Repo Structure

The repository is organized as a TurboRepo mono repo with a single application and several focused packages.

```text
community-calendar/
├── apps/
│   └── web/                        # Astro app — the main frontend
│       └── src/clients/            # App-local API client adapters (see ADR-004)
├── packages/
│   ├── ui-theme/                   # Design tokens, Tailwind config, fonts
│   ├── ui-components/              # Shared Svelte 5 components
│   └── e2e/                        # Playwright + playwright-bdd regression suite
├── turbo.json
├── package.json
└── pnpm-workspace.yaml
```

### apps/web

The Astro application. Handles routing, page rendering (SSR and static), and the intent engine. This is the only deployable artifact. It imports from all packages but no package imports from it.

### packages/ui-theme

Design tokens (colors, spacing, typography), the shared Tailwind CSS configuration, and font assets. Consumed by `ui-components` and `apps/web`.

### packages/ui-components

Reusable Svelte 5 components — cards, chips, grids, interaction bar — that are framework-independent of Astro. They receive data via props and emit events. They never fetch data or import API clients directly.

### packages/e2e

The end-to-end and regression test suite. Uses Playwright with playwright-bdd for BDD/Gherkin scenarios. Contains feature files, step definitions, helpers, and route fixtures. Runs against any target via `BASE_URL`.

### apps/web/src/clients/

App-local API client adapters — one subdirectory per external API (see [ADR-004](adr/004-app-local-api-clients.md)). Each client owns its Zod schemas, helpers, fetch logic, and tests. Clients are never published to a registry; they are only consumed by `apps/web`. Current clients: `events-api`, `geo-api`, `classification-api`, `calendar-api`.

## Dependency Rules

Packages form a strict dependency graph. No circular dependencies are allowed.

```text
apps/web
  ├── imports → packages/ui-components
  ├── imports → packages/ui-theme
  └── src/clients/ (app-local: events-api, geo-api, classification-api, calendar-api)

packages/ui-components
  └── imports → packages/ui-theme

packages/e2e                (standalone, test-only)
```

**Rules:**

- API client packages are standalone — they depend on nothing inside the mono repo.
- `ui-components` may depend on `ui-theme` but not on API clients or the app.
- `apps/web` is the only consumer that composes everything together.
- `e2e` is test-only — it runs against the deployed or local app via HTTP.

## Application Layers (apps/web)

Inside the Astro app, code is organized into layers with strict dependency direction.

```text
Pages / Routes (Astro pages)
    ↓
Domain (view models, intent engine, composition)
    ↓
Services (business logic, data transformation)
    ↓
Clients (imported from packages — events-api-client, geo-api-client)
```

### Pages / Routes

Astro page files (`src/pages/`). Responsible for routing, data loading (via Astro's server-side hooks), and rendering. Pages call into the domain or service layer — never into clients directly.

### Domain

App-level domain models that compose raw API data into what the UI needs. Organized by concern:

```text
src/domain/
├── calendar/         # Combines event + geo data into view models
├── navigation/       # Scopes, URL construction, geographic routing
└── intent/           # Intent engine (Companion / Discovery / Onboarding)
```

The domain layer transforms and enriches client data. It produces the types that Svelte components and Astro pages consume.

### Services

Business logic that orchestrates one or more clients. A service may call multiple API clients, merge results, and apply rules — but it does not know about Astro or Svelte.

### Clients

Imported from packages. Each client package owns its schemas and fetch logic. The app does not define its own API schemas — it uses what the client packages provide.

## Schema Ownership

Every Zod schema has exactly one owner. Schemas are never duplicated across packages.

| Location                                        | Provides                                        | Consumed by                          |
| ----------------------------------------------- | ----------------------------------------------- | ------------------------------------ |
| `apps/web/src/clients/events-api/schemas/`      | Event, category, and related API response types | `apps/web` services and domain layer |
| `apps/web/src/clients/geo-api/schemas/`         | Community, county, district, geographic types   | `apps/web` services and domain layer |
| `apps/web/src/clients/calendar-api/schemas/`    | Organizer and calendar metadata types           | `apps/web` services and domain layer |
| `apps/web/src/domain/`                          | View models, composed types, engine state       | Astro pages, Svelte components       |

**Rules:**

- **Client packages own API response schemas.** They define the shape of what the external API returns.
- **The domain layer owns view models.** It transforms client schemas into what the UI renders.
- **Svelte components never import from client packages.** They receive domain-level types via props.
- **No shared `domain` package.** Domain models live in the app. Extract into a package only if a second app needs them.

## API Client Conventions

All API client packages follow the same patterns and constraints.

### Adapter Pattern

API clients are dumb adapters. They fetch raw data from external APIs, validate responses against Zod schemas, normalize errors, and return data to the caller. They contain no business logic, no domain transformations, and no framework imports.

### Error Handling

All clients return discriminated union results instead of throwing exceptions:

```typescript
// Success
{ success: true, data: T }

// Failure
{ success: false, error: { code: string; message: string; details?: unknown } }
```

### Logging

All API interactions are logged via Pino structured logging:

- Category: `client.{apiName}`
- Log before throwing (error state, not exceptions)
- Include request parameters, response time, status code

### Zod Validation

- All responses validated against Zod schemas before return
- Schemas owned by each client package (never duplicated across packages)
- Invalid responses are not cached; validation errors logged with the response body

### Access Patterns

Every API supports standardized access patterns:

- **Item Access** — fast retrieval of a single record
- **Bulk Access** — efficient retrieval of large datasets
- **Filtered Access** — search and filter-based subset retrieval
- **REST only** — clean, versioned REST interfaces (no GraphQL)

### Performance SLO

- All API responses must remain under 150ms (exclusive of network latency)
- Health checks must pass before data requests

### Environment Variables

Each API client reads its host URL from an environment variable (e.g., `EVENTSAPI_HOST`, `GEOAPI_HOST`).

**Rules:**

- Host values must **not** include a trailing slash (e.g., `https://events.api.schafe-vorm-fenster.de`, not `https://events.api.schafe-vorm-fenster.de/`).
- Host values must **not** contain trailing line breaks. The Vercel CLI is known to append `\n` to values when adding env vars interactively — always verify values after adding them with `vercel env pull`.

### Dependencies

Each client depends only on `zod` and `pino`. Clients must not depend on Astro, Svelte, UI components, business logic services, or site-specific configuration.

## Frontend Architecture

### Astro as Rendering Engine

Astro handles all page rendering — both server-side (SSR) and static generation. It delivers minimal JavaScript by default. Interactive behavior is added via Svelte islands.

### Svelte 5 Islands

Interactive components (interaction bar, infinite scroll, filter chips) are built in Svelte 5 and mounted as Astro islands with `client:*` directives. Each island is self-contained and receives data via props.

## Design Principles

- **Multi-generational inclusive design:** The UI must be navigable by a 12-year-old looking for a youth club and a 95-year-old checking waste collection (REQ-STR-1.1).
- **Zero dark patterns:** No deceptive UI patterns anywhere in the application.
- **Performance target:** First Contentful Paint (FCP) under 800ms (CON-STR-1.0).
- **URL permanence:** URLs are anchored to permanent geonameIds to prevent broken links in physical marketing materials (posters, flyers).

### Routing

URLs follow the pattern `/{name-slug}.{geonameId}` (e.g., `/ivenack.2895545`). The geoname ID is the permanent anchor. If a request arrives with a correct ID but wrong slug, the server issues a 301 redirect to the canonical URL.

Geographic levels use prefixes in the URL:

- `s` — State (ADM1)
- `c` — County (ADM3)
- `d` — District (ADM4)
- `m` — Municipality (ADM5)
- No prefix — Community (populated place)

### Link Generation Facade

Cross-page navigation links are generated through a centralized routing facade instead of assembling URL strings in layouts or components.

The facade owns canonical construction for:

- Geographic links (`/{prefix}/{slug}.{geonameId}`)
- Organizer links (`/org/{slug}.{id}`)
- Event detail links (`/org/{slug}.{id}/e/{date}-{slug}.{eventId}`)
- Breadcrumb item links (level-aware geographic mapping)

**Rules:**

- Layouts and pages must call facade/helper entrypoints for links. Avoid inline string interpolation for route paths.
- Components receive final `href` values via props and stay route-agnostic.
- Language prefix strategy must be handled at one layer (facade/context), not repeated across consumers.
- Fallback behavior for missing identifiers (return `undefined`) is part of the API contract and must be unit-tested.
- Date segment canonicalization for event detail routes must be deterministic and shared.

This keeps route semantics consistent across place pages, organizer pages, event detail pages, and teaser components while reducing drift risk when route formats evolve.

### Caching

Aggressive edge caching via Vercel with stale-while-revalidate headers. Static pages are pre-rendered at build time. Dynamic pages use SSR with short cache TTLs.

## File Organization

Within any package or app, files follow consistent conventions:

- **One exported function per file.** Helper functions go in a `helpers/` subfolder.
- **Kebab-case filenames** — `qualify-event.ts`, not `QualifyEvent.ts`.
- **Semantic suffixes** — `*.schema.ts`, `*.types.ts`, `*.client.ts`, `*.utils.ts`.
- **Co-located tests** — unit tests sit next to the code they test.
- **No barrel files** — import directly from source modules, not re-export index files.

```text
src/domain/calendar/
├── build-calendar-view.ts
├── build-calendar-view.test.ts
└── helpers/
    ├── merge-event-sources.ts
    └── sort-by-weight.ts
```
