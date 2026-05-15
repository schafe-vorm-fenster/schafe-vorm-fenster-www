# Tech Stack

## Language & Runtime

| Tool           | Purpose                               |
| -------------- | ------------------------------------- |
| **TypeScript** | All code, strict mode, no `any` types |
| **Node.js**    | Runtime (version pinned in `.nvmrc`)  |
| **pnpm**       | Package manager (no npm or yarn)      |

## Application

| Tool              | Purpose                                          |
| ----------------- | ------------------------------------------------ |
| **Astro**         | Meta-framework — SSR, static generation, routing |
| **Svelte 5**      | Interactive islands — reactive UI components     |
| **Tailwind CSS**  | Utility-first styling with custom design tokens  |
| **Lucide Svelte** | Icon library — tree-shaken SVG icons             |

### Why Astro + Svelte

Astro delivers zero JavaScript by default — pages are static HTML unless a component explicitly opts in. Svelte provides the lightest reactive runtime for the interactive parts (filters, infinite scroll, interaction bar). Together they minimize bundle size for low-end mobile devices in rural areas.

### Design Units

All spacing, typography, and sizing use **relative units (`rem`)** to support browser zoom and user font-size preferences. Touch targets are minimum 44px (2.75rem) per multi-generational inclusive design requirements.

## Validation & Data

| Tool          | Purpose                                              |
| ------------- | ---------------------------------------------------- |
| **Zod**       | Runtime schema validation, TypeScript type inference |
| **Fetch API** | HTTP client (native, no axios)                       |

Zod schemas are the single source of truth for data shapes. Every API response and domain model is validated at runtime. TypeScript types are inferred from schemas — never defined separately.

## Routing

URLs are built around permanent geoname IDs:

```text
/{name-slug}.{geonameId}       →  /ivenack.2895545
/{level}/{name-slug}.{geonameId} →  /c/uckermark.3249091
```

Astro file-based routing handles both static paths (pre-rendered at build) and dynamic SSR routes. Self-healing redirects (301) correct outdated slugs using the permanent ID.

## Testing

| Tool               | Tier        | Purpose                                           |
| ------------------ | ----------- | ------------------------------------------------- |
| **Vitest**         | Unit        | Single-function isolation, co-located with source |
| **Vitest**         | Component   | Multi-module orchestration (services, domain)     |
| **Vitest**         | Integration | Real API contract verification (client packages)  |
| **Playwright**     | E2E         | Full browser and HTTP testing                     |
| **playwright-bdd** | BDD         | Gherkin feature files for regression scenarios    |

### Test File Naming

| Suffix                  | Tier        | Runner     |
| ----------------------- | ----------- | ---------- |
| `*.test.ts`             | Unit        | Vitest     |
| `*.component.test.ts`   | Component   | Vitest     |
| `*.integration.test.ts` | Integration | Vitest     |
| `*.spec.ts`             | E2E         | Playwright |

### Test Rules by Tier

- **Unit** — all dependencies mocked, env vars allowed with cleanup
- **Component** — only external boundaries mocked, no `process.env`
- **Integration** — no mocks allowed, real API calls, env vars required
- **E2E** — full HTTP stack, BDD scenarios, `BASE_URL` controlled

## Logging

| Tool     | Purpose                 |
| -------- | ----------------------- |
| **Pino** | Structured JSON logging |

Loggers use dot-notation categories (`client.events-api`, `domain.calendar`). Rules: log before throwing, structured objects only (no string concatenation), never log secrets.

## Build & CI

| Tool               | Purpose                                           |
| ------------------ | ------------------------------------------------- |
| **TurboRepo**      | Task orchestration, caching, mono repo management |
| **GitHub Actions** | CI/CD — build, deploy, preview                    |
| **Docker**         | Container builds for CI (`Dockerfile.ci`)         |

## Hosting & Delivery

| Tool               | Purpose                                 |
| ------------------ | --------------------------------------- |
| **Vercel**         | Edge hosting, global CDN                |
| **Edge Functions** | Dynamic routing, self-healing redirects |
| **SWR caching**    | Stale-while-revalidate at the edge      |

## Linting & Formatting

| Tool                                   | Purpose                                                          |
| -------------------------------------- | ---------------------------------------------------------------- |
| **ESLint**                             | Code quality, architecture rule enforcement                      |
| **@schafe-vorm-fenster/eslint-plugin** | Custom rules (layer dependencies, file naming, logging, testing) |

The custom ESLint plugin enforces architectural boundaries: client-service-coordinator layers, one-function-per-file, kebab-case naming, semantic file suffixes, and test tier separation.

## Forbidden

These tools are explicitly excluded from the project:

| Forbidden               | Use instead                |
| ----------------------- | -------------------------- |
| `axios`                 | Native Fetch API           |
| `jest`                  | Vitest                     |
| `moment`                | `date-fns`                 |
| `npm` / `yarn`          | pnpm                       |
| Barrel/index re-exports | Direct imports from source |
