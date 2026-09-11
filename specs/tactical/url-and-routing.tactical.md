---
artefact: tactical-spec
id: TS-004
profile: system
status: DRAFT
implements: [WEB-F-002, WEB-F-023, WEB-F-029, WEB-F-010, WEB-F-011, WEB-F-012, WEB-F-013, WEB-F-014, WEB-F-015, WEB-F-016, WEB-F-017, WEB-F-018, WEB-F-021, WEB-F-026, WEB-F-027, WEB-F-047, WEB-F-048, WEB-F-067, WEB-F-073, WEB-F-079, WEB-Q-037, WEB-Q-038]
sources: [SRC-003]
decisions: [DEC-002, DEC-024, DEC-025, DEC-032, DEC-035]
---

# TS-004 — URL and Routing Structure

## Purpose

The complete public URL inventory and its realisation as a Next.js
App Router tree — the skeleton the one-shot generation hangs everything
on. Locale *detection* is TS-001; this spec fixes *which URLs exist* and
*how the framework serves them*.

## Determinations

### D1 — Public URL inventory [FIXED: SRC-003, DEC-012, DEC-024, DEC-032]

Bare paths render the TLD-default language; `/en/…` variants exist for
every row on `.de` (phase 1). One row per page; conversions per
`pages.req.md`.

| Path | Page | Req |
| --- | --- | --- |
| `/` | Home | WEB-F-010 |
| `/dein-ort` | know what is on (place as query param, never a path segment) | WEB-F-011, WEB-F-023 |
| `/mitmachen` | publish our dates | WEB-F-012 |
| `/mitmachen/registrieren` | register, handover to app | WEB-F-013 |
| `/dein-ort/starten` | start in my place (uncovered); place as query param | WEB-F-047 |
| `/dein-kalender` | run our own calendar (480 €) | WEB-F-014 |
| `/dein-kalender/bestellen` | order + invoice checkout | WEB-F-015 |
| `/deine-region` + `/deine-region/angebot` | whole region | WEB-F-016 |
| `/ueber-uns` | who is behind it | WEB-F-017 |
| `/ueber-uns/archiv` | proof archive | WEB-F-018 |
| `/rechtliches` | all legal content, one page, anchors `#impressum` · `#datenschutz` · `#barrierefreiheit` | WEB-F-029, WEB-Q-027 |
| `/sitemap.xml` · `/robots.txt` · `/llms.txt` | machine surfaces, per domain | WEB-F-073, WEB-F-079 |

Reserved, not built: `/mitmachen/vor-ort-werben` (Q-005),
`/nutzungsbedingungen` (if the legal import delivers terms).

**Landing-only domains** (`.pl`, `.at`, `sheepoutside.com`, phase 1):
serve `/`, the three legal routes, and the machine surfaces; every other
path 404s. [PROPOSED]

### D1a — Route naming system [FIXED: DEC-036, IA amended]

Two word classes carry every route. **Possessive bases** name what the
visitor gets — the website speaks to the visitor (dein/deine); `mein-…`
is reserved for the logged-in app space. **Verbs** name what the visitor
does.

| Route | Offering / role |
| --- | --- |
| `/dein-ort` + `/dein-ort/starten` | community-calendar: reading · founding |
| `/dein-kalender` + `/bestellen` | portalize-calendar (480 €) |
| `/deine-region` + `/angebot` | portalize-enterprise |
| `/deine-termine` | **reserved** for portalize-website-widget |
| `/mitmachen` + `/registrieren` | publishing entry (stays a verb by rule) |

A bare verb is not a base: the founding page is `/dein-ort/starten`
(start *what*? your place), not `/starten`. **No path ever carries a
place slug** (WEB-F-023, DEC-037) — a place travels as a query
parameter, so no segment can collide with a place name.

Product names never appear in routes or labels (WEB-F-002). SEO landing
pages (WEB-F-074) nest under the bases instead of founding new URL
families.

### D2 — Internal route tree [FIXED: DEC-002; layout PROPOSED]

One tree carries all languages via a `[lang]` segment; public URLs stay
per TS-001 D4 (bare for TLD default) through the rewrite in D3.

```text
proxy.ts                     ← stateless URL mapping only (D3)
app/
├── [lang]/
│   ├── layout.tsx           ← <html lang>, tokens/themes, header, footer, context band slot
│   ├── page.tsx
│   ├── dein-ort/{page.tsx, starten/page.tsx}
│   ├── mitmachen/{page.tsx, registrieren/page.tsx}
│   ├── dein-kalender/{page.tsx, bestellen/page.tsx}
│   ├── deine-region/{page.tsx, angebot/page.tsx}
│   ├── ueber-uns/{page.tsx, archiv/page.tsx}
│   ├── rechtliches/page.tsx   ← one page, anchored sections
│   └── not-found.tsx        ← 404 per DEC-032: place search + jobs band
├── api/…                    ← BFF routes (D5)
├── global-error.tsx         ← 500 per DEC-032: static, minimal
├── sitemap.ts               ← per-domain, language-aware
├── robots.ts                ← AI crawlers allowed
└── llms.txt/route.ts
```

`[lang]` is validated against the domain's language set
(`generateStaticParams` + `dynamicParams = false`); an unsupported code
404s (TS-001 D4).

### D3 — Stateless rewrite in `proxy.ts` [PROPOSED — amends TS-001 D3]

Public → internal mapping, pure function of hostname + path, evaluated
per request:

1. `/{tldDefault}/…` requested literally → 301 to the bare path.
2. Bare path → rewrite (invisible) to `/{tldDefault}/…`.
3. `/{otherSupportedLang}/…` → passes through.
4. Unsupported first segment that looks like a lang code → falls into
   the `[lang]` 404.
5. Landing-only domain, path outside D1's landing set → 404.
6. After the calendars move to `app.*`: apex arrives here via 301 from
   DNS level; `/:community` slugs (svf.li QR, WEB-F-048) forward 302 to
   the place's calendar on `app.*`, `etcc_*` preserved. Until the move:
   rule inactive.

The proxy is a pure function of hostname + path and holds no state. The
binding rules it must not break are stated where they belong, not as a
technology ban: locale is determined by the URL alone (TS-001 D3), and
external APIs are reached server-side only, through the website's own
client endpoints (DEC-025, WEB-Q-037/038).

### D3a — Localized pathnames: one route translation map [FIXED: DEC-036; EN segments PROPOSED]

Public path segments are localized. A single table (`routes.ts`) is the
only source: `routeId → { de: path, en: path, … }`. Three consumers, no
other place knows a path: the proxy (D3) translates inbound public paths
to internal routes; the link facade (TS-001 D5) renders outbound links in
the current language; hreflang/canonical (TS-001 D6) derive from the same
table — that is how language variants know they belong together.
Candidate implementation: `next-intl` localized `pathnames`, or an own
map consumed by proxy + facade; decided at implementation, the contract
above is what binds. Route names themselves are fixed by DEC-036.

Proposed EN segments (de → en):

| de | en |
| --- | --- |
| `/dein-ort` | `/your-place` |
| `/mitmachen` | `/take-part` |
| `/mitmachen/registrieren` | `/take-part/register` |
| `/dein-ort/starten` | `/your-place/start` |
| `/dein-kalender` + `/dein-kalender/bestellen` | `/your-calendar` + `/your-calendar/order` |
| `/deine-region` + `/deine-region/angebot` | `/your-region` + `/your-region/quote` |
| `/ueber-uns` | `/about` |
| `/ueber-uns/archiv` | `/about/archive` |
| `/rechtliches` | `/legal` |

### D4 — Navigation model [FIXED: SRC-003, WEB-F-002/021]

- Header: logo → `/`, the four job labels (Was ist los → `/dein-ort`,
  Termine veröffentlichen → `/mitmachen`, Dein Kalender →
  `/dein-kalender`, Warum wir → `/ueber-uns`), persistent "Kalender"
  button → `/dein-ort`.
- Footer: Kontakt (envoy widget target), Newsletter, and the legal links
  "Impressum" / "Datenschutz" / "Barrierefreiheit" pointing at their
  anchors on `/rechtliches`, language switcher (plain links, TS-001 D5).
- The context band is a component on every page, never a route.
- All internal links go through the route facade (TS-001 D5); no
  hard-coded hrefs.

### D5 — BFF route inventory [FIXED: DEC-025; shapes PROPOSED]

Client-facing, use-case-cut, rate-limited + origin-checked (WEB-Q-038);
each proxies exactly one upstream need, server-side tokens only, cache
TTLs from TS-003 D5:

| Route | Serves | Upstream |
| --- | --- | --- |
| `GET /api/places/search?q=&zip=` | place search (all pages) | geo-api (ZIP today, name via Q-025) |
| `GET /api/places/{slug}/events?window=` | dein-ort live dates, empty-state detection | events-api search |
| `GET /api/nearby?lat=&lng=&radius=` | "this week nearby" | events-api + geo-api |
| `GET /api/region/{county}/examples` | active example places (DEC-034) | events-api (activity signal, Q-015/Q-025) |
| `GET /api/stats` | live counters | events-api `/api/stats` (public) |

envoy widget and Portalize loader talk to their own backends directly —
they are not proxied (their hosts are CSP-allowlisted, TS-003 D4/WEB-Q-030).

### D6 — Rendering per route [FIXED: DEC-019; assignment PROPOSED]

| Routes | Mode |
| --- | --- |
| all D1 content pages | static + ISR (1 h), live modules streamed via Suspense with skeletons (WEB-F-106) |
| `/ueber-uns/archiv` | fully static from build-time `media-echo` fetch (WEB-F-086) |
| `/dein-kalender/bestellen` | static shell; order interaction client-side against D5 routes |
| BFF routes | dynamic, cached per TS-003 D5 |
| 404 | static shell + streamed place search; 500 fully static |

### D7 — Offering → surface map [PROPOSED]

Offerings never define routes (WEB-F-002); every promoted offering has
exactly one primary surface. This map is the contract — later verifiable
against content frontmatter offering references (WEB-F-085):

| Offering | Promotion | Primary surface |
| --- | --- | --- |
| `community-calendar` | promoted | `/dein-ort` (read) · `/mitmachen` (publish) · tier 1 on `/dein-kalender` |
| `portalize-calendar` | promoted | `/dein-kalender` + order flow |
| `portalize-enterprise` | promoted | `/deine-region` |
| `portalize-website-widget` | withheld | none built; `/deine-termine` reserved for launch |
| `local-advertising` | withheld | **none** — DEC-052 §3 narrowed WEB-C-015's "at most one sentence" to no occurrence while the offering is withheld; the guard checks for absence |
| `custom-data-integration` | on-request | mention on the enterprise page |

SEO landing pages (WEB-F-074) attach to this map later instead of
inventing product URLs.

### D8 — Legal anchor registry [FIXED: DEC-039]

`/rechtliches` (EN `/legal`) carries every legal section. **These anchors
are permanent.** Once published they are linked from contracts, invoices,
app screens, printed material and third-party records; changing one
breaks references we do not control. An anchor is never renamed, never
removed — a retired section keeps its anchor with a pointer to its
successor. New sections append.

| Anchor (de) | Anchor (en) | Section | Source |
| --- | --- | --- | --- |
| `#impressum` | `#imprint` | Impressum | `content/legal/imprint.md` |
| `#datenschutz` | `#privacy` | Datenschutzerklärung | `content/legal/privacy-policy.md` |
| `#barrierefreiheit` | `#accessibility` | Barrierefreiheitserklärung (BFSG, WEB-Q-027) | to be written |
| `#nutzungsbedingungen` | `#terms` | Nutzungsbedingungen | `content/legal/terms-of-use.md` |
| `#community-richtlinien` | `#community-guidelines` | Community-Richtlinien | `content/legal/community-guidelines.md` |
| `#auftragsverarbeitung` | `#data-processing` | Auftragsverarbeitung (Q-029) | `content/legal/dpa.md` |

Rules: anchors are lowercase kebab-case, localized like path segments
(D3a), and stable across languages in *meaning* — `/rechtliches#impressum`
and `/legal#imprint` are the same section. The on-page navigation lists
the sections in registry order. Footer links point at
`#impressum`, `#datenschutz`, `#barrierefreiheit` with their conventional
labels (D4).

## Free for the generator

- [FREE] Component/file organisation below the route level (co-location,
  private folders), loading.tsx granularity beyond WEB-F-106.
- [FREE] Exact Suspense boundary placement within a page, within D6.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-004-A1 | integration | Every D1 path responds 200 on `.de`, bare and `/en/…`, correct `<html lang>`. |
| TS-004-A2 | integration | `/de/mitmachen` → 301 `/mitmachen`; `/uk/mitmachen` → 404 (real status). |
| TS-004-A3 | integration | Landing-only domain: `/` and legal routes 200, `/mitmachen` 404. |
| TS-004-A4 | integration | 404 renders place search + jobs band with status 404 and `noindex`; 500 renders without any data dependency. |
| TS-004-A5 | integration | `sitemap.xml`, `robots.txt`, `llms.txt` respond per domain; sitemap lists only that domain's URLs in its languages. |
| TS-004-A6 | e2e | No external API host appears in any client-initiated request except envoy and Portalize (verified via CSP report / network trace). |
| TS-004-A7 | integration | BFF routes return 429 beyond the rate limit and reject foreign origins. |
| TS-004-A8 | e2e | Navigation labels match D4 exactly on every page; every internal link resolves within the D1 inventory. |
| TS-004-A9 | integration | Footer on every page carries contact, newsletter and the three legal links under their conventional labels ("Impressum", "Datenschutz", "Barrierefreiheit"), each resolving to its anchor on `/rechtliches`. |
| TS-004-A10 | static | No route segment in the app tree is a place slug or a place-shaped parameter: the route inventory equals D1 exactly, and no dynamic segment resolves against the place set. A place reaches a page only as a query parameter. |
| TS-004-A11 | integration | Once the calendars have moved to `app.*`: a request to `/{community}` carrying `etcc_cmp`/`etcc_med` redirects to that place's calendar on `app.*` with both parameters intact. Before the move the rule is inactive and the path is served by the apex — the criterion is skipped with a recorded reason, not silently passed. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| WEB-F-002 (nav labels name jobs) | D4 · A8 |
| WEB-F-010 (page route) | D1, D2, D6 · A1 |
| WEB-F-011 (page route) | D1, D2, D6 · A1 |
| WEB-F-012 (page route) | D1, D2, D6 · A1 |
| WEB-F-013 (page route) | D1, D2, D6 · A1 |
| WEB-F-014 (page route) | D1, D2, D6 · A1 |
| WEB-F-015 (page route) | D1, D2, D6 · A1 |
| WEB-F-016 (page route) | D1, D2, D6 · A1 |
| WEB-F-017 (page route) | D1, D2, D6 · A1 |
| WEB-F-018 (page route) | D1, D2, D6 · A1 |
| WEB-F-021 (header/footer inventory) | D4 |
| WEB-F-029 (legal as one anchored page) | D1, D4, D8 |
| WEB-F-026 (404) | D2, D6 · A4 |
| WEB-F-027 (500) | D2, D6 · A4 |
| WEB-F-047 (uncovered-place page route) | D1, D1a, D2 |
| WEB-F-023 (no place slugs in paths) | D1, D1a |
| WEB-F-048 (community-slug forwarding) | D3 rule 6 |
| WEB-F-067 (other domains navigable) | D1 landing set · A3 |
| WEB-F-073 (sitemaps + canonicals) | D1, sitemap.ts · A5 |
| WEB-F-079 (robots + llms.txt) | D1 · A5 |
| WEB-Q-037 (BFF, no client tokens) | D5 · A6 |
| WEB-Q-038 (rate limits + origin checks) | D5 · A7 |
| WEB-F-021 (footer inventory) | D4 · A9 |
| WEB-F-023 (no place slugs in paths) | D1, D1a · A10 |
| WEB-F-048 (community-slug forwarding) | D3 rule 6 · A11 |

## Open points

- D1 landing set, D2 layout, D3
  (incl. the TS-001 D3 amendment), D3a (EN segments), D5
  shapes, D6 assignment, D7 are [PROPOSED]. The two renames
  (`bestellen`, `regionalkalender`) change routes defined in the IA and
  need the IA amendment first (DEC-022).
- `/dein-ort/starten` ships only after the IA amendment is accepted
  (Q-028).
