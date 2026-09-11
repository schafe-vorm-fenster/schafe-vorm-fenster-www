---
id: DEC-073
title: The locale and URL layer — one typed table, no i18n library, and the 404 that actually renders
status: accepted
date: 2026-09-11
decided_by: run/developer (M2 routing work package)
---

## Context

TS-004 D3a leaves the mechanism open ("`next-intl` localized `pathnames`, or
an own map consumed by proxy + facade; decided at implementation, the
contract above is what binds"). TS-001 D7 adds that a new language must not
require a code change. Three further questions came up while building the
skeleton and none of them had a determination:

1. does a localized-routing library enter the stack?
2. where does the URL mapping live while `proxy.ts` still has no
   host-dependent rules to evaluate?
3. how does an unknown URL produce a 404 that a visitor can read?

## Decision

**1 — No i18n library. The table is the mechanism.**
The stack-harmony rule was run first: no sibling repository under
`~/Projects/` carries `next-intl`, `i18next` or `react-intl`. The only i18n
in the family is `@inlang/paraglide-astro` in `community-calendar/apps/web`,
an Astro application — a different framework and a different problem shape.
What TS-004 D3a and TS-001 D7 actually ask for is a `routeId → { de, en }`
table and a keyed string set; both are typed records:

- `src/lib/routes/routes.ts` — the route translation map, the single source
  for every path, with `href(route, locale)` as the link facade (TS-001 D5);
- `src/lib/i18n/locales.ts` — the language table (TS-001-A11's "single place
  a language is declared");
- `src/lib/i18n/dictionary.ts` — UI strings behind a `Dictionary` interface,
  so a missing key is a type error and a new language is one more object.

No runtime dependency is added, so `stack.allow.json` is unchanged.

**2 — The URL mapping is derived from the table and applied in
`next.config.ts` for M2.**
`src/lib/routes/next-routing.ts` builds the rewrite and redirect rows from
the route table; no path is typed in the config. TS-004 D3's rules 1 and 2
(the redundant `/de/…` prefix redirects, a bare path rewrites onto
`/de/…`) are pure functions of the path and need no request host, so they
run at config level. The host-dependent rules — the landing-only domains,
the apex/`app.*` phasing, the `/:community` forwarding — need the host and
stay for `proxy.ts` in M4.

The same applies to the legacy redirect map (`src/lib/routes/redirect-map.ts`).
TS-011 D1 names `proxy.ts` as its only consumer and rules out config-level
`redirects()`. D1's *substance* is "one legacy URL is known in one place
only", and that place is the table; the config merely reads it, and Next.js
evaluates redirects before every rewrite, which is D1's "step 0, before any
locale rule". Moving the consumer into `proxy.ts` later changes the consumer,
not the table. **Status is 301, not Next.js's default 308** — TS-001 D4,
TS-004-A2 and TS-011 D1 all name 301, so the rows carry `statusCode: 301`.

**3 — `app/global-not-found.tsx` is the 404 surface; the localized
`not-found.tsx` stays for in-tree `notFound()` calls.**
Measured on Next.js 16.3.4, in `next dev` and in `next start`, with and
without a dynamic root segment: a `notFound()` raised inside the route tree
returns the right status and the right metadata, but the HTML document is an
empty `__next_error__` shell — the body travels only in the RSC payload and
the browser leaves the page blank. `global-not-found` is the framework's own
answer for this case and renders a complete document. `[lang]` therefore runs
with `dynamicParams = false` and the tree holds no catch-all, so every
unknown URL is genuinely unmatched and reaches it.

## Consequences

- TS-004 D3a's contract holds in full: one table, three consumers (URL
  mapping, link facade, canonical/hreflang). A component that types a path
  is a review finding, not a style question.
- Adding a language is a row in `LOCALES`, a path per route, and a
  dictionary object — no call site changes (TS-001 D7).
- The 404 body speaks the TLD default on every URL, including an unknown
  `/en/…`, because `global-not-found` sits above the language segment and
  has neither a route parameter nor the request path. A client-side swap
  would make the rendered language depend on something other than the
  server's view of the path, which DEC-038 rules out. Recorded as an open
  point; it resolves when the framework renders an in-tree `notFound()`
  body, at which point `app/[lang]/not-found.tsx` takes over unchanged.
- `next.config.ts` carries `experimental.globalNotFound`. It is the only
  experimental flag in the build and it is load-bearing for DEC-032.
