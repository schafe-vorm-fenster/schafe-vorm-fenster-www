---
id: DEC-0163
title: Every page is static; live data and query-dependent states load in the browser from this site's own API routes; the CSP carries per-page hashes delivered through the build adapter; the no-JavaScript rule for the place and flow routes is dropped
status: accepted
date: 2026-10-13
decided_by: jan-henrik.hempel
---

## Context

Issue #59: on a production build most pages rendered but did not hydrate — no
typeahead, no conversion events, React error #412, CSP violations in the
console. DEC-0045 fixed the script policy as build-time `sha256` hashes of the
inline scripts, with no nonce, so the shell stays static. Measured on
`pnpm build` + `next start` (2026-10-13), three things put inline scripts in
front of the browser that no hash covered:

1. **A silent cap.** `csp-hashes.ts` capped the site-wide set at 128; the build
   produced ~430. Most hashes were dropped, so most static pages did not
   hydrate. With the cap raised, `/ueber-uns`, `/rechtliches`, `/mitmachen` and
   `/en/about` hydrated — and the header grew to ~24 KB on every response.
2. **Regenerating HTML.** The live islands were `use cache` server components
   with `cacheLife` from TS-WEB-0003 D5 (dates: 5 min). The page's HTML
   regenerated with every new date, Next's inline flight payload changed with
   it, and its hash was in no build-time set: 5½ minutes after start
   `/mitmachen` and `/en/take-part` were broken again.
3. **Per-request routes.** `/` (`?ort=`, and since DEC-0140 a request header),
   `/dein-ort`, `/dein-ort/starten`, `/mitmachen/registrieren` and
   `/dein-kalender/bestellen` read the request on the server and were rendered
   per request — their payload can never be in a build-time set (state/open.md
   row 132).

And a fourth, on Vercel only: the hash file reached the deployed proxy by no
mechanism tried so far (state/open.md rows 31/173), so the preview ran on a
documented `'unsafe-inline'` fallback.

The owner's constraints (2026-10-13): no per-request rendering, no
`'unsafe-inline'` in `script-src`, no nonce.

## Decisions

1. **Live data leaves the HTML.** Every live module — dates per place, nearby,
   active example places, counters, the story examples on `/dein-ort`, the
   flyer row and the stage calendar on `/` and `/mitmachen` — renders its frame
   at the final geometry in the prerendered HTML (title where known, skeleton
   rows reserved at the two-line row height, the onward link where its target
   is known) and fills it in the browser from this site's own `/api/*` routes
   (`src/lib/live/browser.ts`, `app/[lang]/_islands.tsx`). The routes keep the
   upstream calls, the three tiers and the CDN `Cache-Control` of TS-WEB-0003
   D5; the browser's own HTTP cache is bypassed (`no-store`), the CDN's is not.
   Two routes are new: `GET /api/places/resolve?ort=` (TS-WEB-0008 D7's outcome
   and the register flow's lookup, from the same two resolvers the pages ran)
   and `GET /api/places/{slug}/examples` (the story pool, DEC-0152);
   `/api/places/{slug}/events` takes `rows` (1–12). The BFF rate limit rises
   from 60 to 600 requests per minute per bucket, because every page view now
   calls it, and it applies on Vercel deployments (or with
   `BFF_RATE_LIMIT=on`): off a platform every caller shares one `local` bucket,
   and the e2e suite against a local production build tripped it (measured:
   20 × 429 in 650 calls), removing live modules mid-test. No answer removes a module, never an error sentence (TS-WEB-0009 D6).
   Live dates are not indexed content (owner); everything else stays in the
   static HTML.
2. **Every page is static and byte-identical for the life of a deployment.**
   No page reads `searchParams`, `headers()` or `cookies()`; `instant = false`
   is gone from the four flow routes. `?ort=` and the flow steps are read in
   the browser (`src/lib/pages/query-store.tsx`: one `<QuerySync />` in the
   root layout bails out to the client, the islands read a store whose server
   snapshot is `null`, so the prerendered DOM hydrates unchanged). The entry
   trait of `/` (TS-WEB-0019 D3a, DEC-0140) is resolved from `document.referrer`
   and the URL with the same encode/decode pair the proxy used. The repository's
   own content reads use `cacheLife("max")`, which `next.config.ts` redefines to
   never revalidate; the proof selection rotates with the **build's** ISO week
   (TS-WEB-0005 D7). The build **fails** for any page whose prerender
   revalidates (`scripts/csp-adapter.mjs`). Build route table: every page `○`;
   the remaining `ƒ` are the API handlers, `robots.txt`, `llms.txt` and
   `/_not-found` (the 404 surface keeps its request-header language, row 149).
3. **Per-page hashes, delivered inside the build** (amends DEC-0045 and
   TS-WEB-0014 D3). A Next adapter (`adapterPath`) wraps whichever adapter the
   platform brings (Vercel sets `NEXT_ADAPTER_PATH`) and, in `onBuildComplete`,
   hashes each prerendered page's inline scripts into one map — internal path →
   hashes, plus the common set — and adds the file to the proxy function's own
   assets. The proxy reads it from disk and sends a response only its page's
   set: 7–43 hashes, ~2.4 KB of header. A page over the cap (128) fails the
   build; nothing is truncated. No network fetch, no bypass secret, no
   request-derived origin (F-2-36's three guards hold structurally: no origin
   to choose, cache per deployment, every entry shape-checked). Measured on a
   Vercel preview built from this change: per-page hashes in `script-src`, no
   `'unsafe-inline'`, zero CSP violations of the site's own scripts and every
   page hydrated (TS-WEB-0014-A14's walk). The preview's `'unsafe-inline'`
   fallback is therefore removed; preview and production carry the same
   script policy.
4. **The no-JavaScript rule for the place and flow routes is dropped** (owner,
   2026-10-13). Without JavaScript `/dein-ort` is S0 for every `?ort=`,
   `/dein-ort/starten` is the placeless variant, `/mitmachen/registrieren` and
   `/dein-kalender/bestellen` are step 1, and live frames hold their skeletons.
   The proxy's 307 place hop (TS-WEB-0021-A7, `place-hop.ts`) stays: it depends
   only on the URL, and it is not page rendering. Amended or superseded with
   their tests: TS-WEB-0019-A11 (the "no skeleton" clause), TS-WEB-0020-A10
   (the "no unresolved skeleton" clause), TS-WEB-0020 D2's server-side state
   switch, TS-WEB-0021 D10 and A2/A9's JavaScript-less echo,
   TS-WEB-0023 D4's server-side re-validation and A13's JavaScript-less walk,
   and the order flow's JavaScript-less step 3.
5. **New criterion TS-WEB-0014-A14** (e2e, `e2e/csp-hydration.spec.ts`): every
   registry route in both languages loads with zero CSP violations and
   hydrates, against the production build. The site header carries
   `data-hydrated` so every page has a hydration signal.

## Consequences

- TS-WEB-0003 D5 (pages "1 h"), TS-WEB-0004 D5/D6, TS-WEB-0005 D7,
  TS-WEB-0008 D10, TS-WEB-0009 D1–D3, TS-WEB-0010 D8, TS-WEB-0014 D3/D5,
  TS-WEB-0019 D2/D3a, TS-WEB-0020 D2, TS-WEB-0021 D4/D5/D10, TS-WEB-0023 D4/D8
  and TS-WEB-0025 D7 carry an amendment note naming this record.
- `state/open.md` rows 31, 99, 131, 132, 139, 145, 148 and 173 close.
- A live list reserves its rows at the two-line row height
  (`--height-event-row-tall`), so a list of one-line titles leaves a little
  room at its end; the "Stand: …" line and the counter pills are reserved the
  same way. That is the price of a static page with no layout shift
  (`e2e/layout-stability.spec.ts`).
- The proof stream rotates per deployment, not per calendar week, while
  production is deployed less than weekly.
