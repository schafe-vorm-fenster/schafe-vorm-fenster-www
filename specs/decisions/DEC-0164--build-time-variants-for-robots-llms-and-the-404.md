---
id: DEC-0164
title: robots.txt, llms.txt and the 404 are prerendered once per distinct output at their own paths, and the proxy only chooses which file answers; the 404's status is set by the build adapter
status: accepted
date: 2026-10-13
decided_by: jan-henrik.hempel
---

## Context

After DEC-0163 every page was static, and three surfaces were still rendered
per request because each read a request header (DEC-0163 §2's route table):

1. `/robots.txt` (`app/robots.ts`, TS-WEB-0015 D3) read `host`. It sent no
   `Cache-Control` of its own, so every request reached the server.
2. `/llms.txt` (`app/llms.txt/route.ts`, TS-WEB-0004 D1/A5) read `host`. It sent
   `s-maxage=3600` and ran again on every cache miss.
3. The 404 (`app/global-not-found.tsx`, TS-WEB-0004-A4) read its language from a
   request header the proxy set. Because it was not prerendered it had no
   entry in the per-page CSP hash map and got only the set common to every
   page.

The owner's constraint (2026-10-13): no page or file rendered per request
except the API routes. The owner approved the approach: build-time variants
at their own paths, with the proxy rewriting onto the right one.

None of the three has more outputs than the repository can count:

- robots.txt: "disallow all", plus one body per canonical host
  (`CANONICAL_PUBLIC_HOSTS`, TS-WEB-0001 D1), because the `Sitemap:` line names
  the host. That makes 5.
- llms.txt: one body per domain of the matrix (`DOMAIN_MATRIX`). That makes 4.
- The 404: one document per served language. That makes 2.

## Decisions

1. **Every output is prerendered at its own path** under `/variants/`
   (`src/lib/routes/static-variants.ts`):
   `/variants/robots/{noindex | www-<host>}`, `/variants/llms/www-<host>` and
   `/variants/not-found/{de | en}`. The two text surfaces are GET route
   handlers with `generateStaticParams`. The 404 is a page under its own root
   layout, with no header or navigation, like `global-not-found` before it.
   None of them reads the request. `app/robots.ts` and `app/llms.txt/route.ts`
   are removed.
2. **The proxy chooses the file and renders nothing.** `/robots.txt` goes to
   `noindex` unless `isIndexable(VERCEL_ENV, host)` holds, and to the request
   host's own variant if it does. This is the same predicate, at the same
   moment, that sets `X-Robots-Tag`, so the variant bodies do not depend on
   the build's `VERCEL_ENV`. `/llms.txt` goes to `domainConfigFor(host)`'s
   variant, whose fallback for `localhost` and `*.vercel.app` is `.de`. Every
   unservable URL goes to the 404 of `notFoundLocale(path, tldDefault)`.
   Because each variant has its own path, the CDN cache key differs per
   variant, and no host can be served another host's cached body.
3. **An unknown path under a served language prefix is now unservable too**
   (`/en/anything`). Until now it fell through to `global-not-found`, which
   read the language off the header. The internal `app/[lang]` path of every
   route (for example `/en/dein-ort`) still answers for itself, as it always
   did. `global-not-found` is now static and German. It is reached only by
   what Next's router alone decides is unknown, which is an unknown path under
   a reserved prefix (`/api/…`, `/_next/…`, `/.well-known/…`).
4. **The 404's status is set by the build adapter, not by `notFound()`.**
   Measured: a page that calls `notFound()` during its prerender is stored
   with status 404, but its HTML is Next's `<html id="__next_error__">` shell
   with no rendered body. React's server renderer does not run error
   boundaries, so the shell errors, and Next writes its error document
   (`getErrorRSCPayload` in `next/dist/server/app-render/app-render.js`). With
   JavaScript disabled that page is empty, which is F-2-70 again. A proxy
   rewrite cannot carry a status either, because `next start` drops the
   middleware status on a rewrite (`resolve-routes.js`). So the 404 page
   renders the complete document, and `scripts/csp-adapter.mjs` sets status
   404 on every prerender under `/variants/not-found/`. It sets it in two
   places: the prerender's `.meta`, which `next start` serves, and
   `fallback.initialStatus` of the adapter output, which the platform adapter
   deploys. If there is nothing to mark, the build fails.
5. **The 404 carries its own CSP hashes.** The proxy looks up the hashes of
   the path it rewrote onto, and the 404 variants are prerenders like every
   other page. Next emits the framework 404 (`global-not-found`) as a static
   `/404` file rather than a prerender. The adapter adds it to the map under
   `/_not-found`, and a path no page claims gets that set instead of the bare
   common set. Among such responses it is the only one a browser renders as
   HTML. The 404 has no site header, so it signals hydration with a
   `data-hydrated` wrapper (`app/_not-found/hydration-mark.tsx`).

## Consequences

- Build route table (`pnpm build`, 2026-10-13): every page and every variant
  is `○` or `●`. The remaining `ƒ` entries are the eight `/api/*` handlers and
  the proxy. The `◐` rows (`/[lang]/…`, `/variants/not-found/[lang]`) are the
  fallback shells Cache Components prerenders for parameters outside
  `generateStaticParams`. The proxy never serves them: it routes every such
  path to a 404 variant first.
- Measured on `next start` with Cache-Control `s-maxage=31536000`, which is
  Next's default for a prerender that never revalidates: `/robots.txt` and
  `/llms.txt` return 200 on every host, and an unknown URL returns 404 with
  the complete document in the URL's language, on every host.
  `/api/<unknown>` still returns Next's own `private, no-store` for the
  framework 404. That is a static file, not a render.
- New criteria: TS-WEB-0015-A13 (robots variants) and TS-WEB-0004-A12 (llms
  and 404 variants). TS-WEB-0014-A14's walk now includes the 404 in both
  languages.
- TS-WEB-0004 D2/D6 and TS-WEB-0015 D3 carry an amendment note naming this
  record. DEC-0163 §2's list of remaining dynamic routes is superseded by the
  first bullet above.
