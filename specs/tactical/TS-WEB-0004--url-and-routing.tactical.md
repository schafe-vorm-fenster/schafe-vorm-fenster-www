---
artefact: tactical-spec
id: TS-WEB-0004
kind: system
status: DRAFT
version: 0.1.0
implements: [FUN-WEB-0002, FUN-WEB-0023, FUN-WEB-0029, FUN-WEB-0010, FUN-WEB-0011, FUN-WEB-0012, FUN-WEB-0013, FUN-WEB-0014, FUN-WEB-0015, FUN-WEB-0016, FUN-WEB-0017, FUN-WEB-0018, FUN-WEB-0021, FUN-WEB-0026, FUN-WEB-0027, FUN-WEB-0047, FUN-WEB-0048, FUN-WEB-0067, FUN-WEB-0073, FUN-WEB-0079, NFR-WEB-0037, NFR-WEB-0038]
sources: [SRC-0003]
decisions: [DEC-0002, DEC-0024, DEC-0025, DEC-0032, DEC-0035]
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-10T13:40:07+02:00"
---

# TS-WEB-0004 — URL and Routing Structure

## Purpose

The complete public URL inventory and its realisation as a Next.js
App Router tree — the skeleton the one-shot generation hangs everything
on. Locale *detection* is TS-WEB-0001; this spec fixes *which URLs exist* and
*how the framework serves them*.

## Determinations

### D1 — Public URL inventory [FIXED: SRC-0003, DEC-0012, DEC-0024, DEC-0032]

Bare paths render the TLD-default language; `/en/…` variants exist for
every row on `.de` (phase 1). One row per page; conversions per the `pages` area of
`../requirements/functional/`.

| Path | Page | Req |
| --- | --- | --- |
| `/` | Home | FUN-WEB-0010 |
| `/dein-ort` | know what is on (place as query param, never a path segment) | FUN-WEB-0011, FUN-WEB-0023 |
| `/mitmachen` | publish our dates | FUN-WEB-0012 |
| `/mitmachen/registrieren` | register, handover to app | FUN-WEB-0013 |
| `/dein-ort/starten` | start in my place (uncovered); place as query param | FUN-WEB-0047 |
| `/dein-kalender` | run our own calendar (480 €) | FUN-WEB-0014 |
| `/dein-kalender/bestellen` | order + invoice checkout | FUN-WEB-0015 |
| `/deine-region` + `/deine-region/angebot` | whole region | FUN-WEB-0016 |
| `/ueber-uns` | who is behind it | FUN-WEB-0017 |
| `/ueber-uns/archiv` | proof archive | FUN-WEB-0018 |
| `/rechtliches` | all legal content, one page, anchors `#impressum` · `#datenschutz` · `#barrierefreiheit` | FUN-WEB-0029, NFR-WEB-0027 |
| `/sitemap.xml` · `/robots.txt` · `/llms.txt` | machine surfaces, per domain | FUN-WEB-0073, FUN-WEB-0079 |
| `/start` | **redirect only, renders nothing** — the lead fallback's target while the envoy widget is undelivered (TS-WEB-0016 D6). Points at the existing Google Form today; the swap to envoy changes this one redirect and no lead surface | FUN-WEB-0093 |

Reserved, not built: `/mitmachen/vor-ort-werben` (Q-0005),
`/nutzungsbedingungen` (if the legal import delivers terms).

`/start` is the only row that is not a page. It exists so that no lead
surface hard-codes a third-party URL: every fallback links to `/start`,
and what `/start` resolves to is one decision in one place. It carries
`noindex` and is absent from the sitemap.

**Landing-only domains** (`.pl`, `.at`, `sheepoutside.com`, phase 1):
serve `/`, the three legal routes, and the machine surfaces; every other
path 404s. [PROPOSED]

### D1a — Route naming system [FIXED: DEC-0036, IA amended]

Two word classes carry every route. **Possessive bases** name what the
visitor gets — the website speaks to the visitor (dein/deine); `mein-…`
is reserved for the logged-in app space. **Verbs** name what the visitor
does.

| Route | Offering / role |
| --- | --- |
| `/dein-ort` + `/dein-ort/starten` | community-calendar: reading · founding |
| `/dein-kalender` + `/bestellen` | portalize-calendar (480 €) |
| `/deine-region` + `/angebot` | portalize-enterprise |
| `/deine-termine` | **reserved, not built** for portalize-website-widget — the name is held so no other plan claims it; it answers 404 until the offering is sellable (DEC-0071) |
| `/mitmachen` + `/registrieren` | publishing entry (stays a verb by rule) |

A bare verb is not a base: the founding page is `/dein-ort/starten`
(start *what*? your place), not `/starten`. **No path ever carries a
place slug** (FUN-WEB-0023, DEC-0037) — a place travels as a query
parameter, so no segment can collide with a place name.

Product names never appear in routes or labels (FUN-WEB-0002). SEO landing
pages (FUN-WEB-0074) nest under the bases instead of founding new URL
families.

### D2 — Internal route tree [FIXED: DEC-0002; layout PROPOSED]

One tree carries all languages via a `[lang]` segment; public URLs stay
per TS-WEB-0001 D4 (bare for TLD default) through the rewrite in D3.

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
│   └── not-found.tsx        ← 404 per DEC-0032: place search + jobs band
├── api/…                    ← BFF routes (D5)
├── global-error.tsx         ← 500 per DEC-0032: static, minimal
├── sitemap.ts               ← per-domain, language-aware
├── robots.ts                ← AI crawlers allowed
└── llms.txt/route.ts
```

`[lang]` is validated against the domain's language set
(`generateStaticParams` + `dynamicParams = false`); an unsupported code
404s (TS-WEB-0001 D4).

### D3 — Stateless rewrite in `proxy.ts` [PROPOSED — amends TS-WEB-0001 D3]

Public → internal mapping, pure function of hostname + path, evaluated
per request:

1. `/{tldDefault}/…` requested literally → 301 to the bare path.
2. Bare path → rewrite (invisible) to `/{tldDefault}/…`.
3. `/{otherSupportedLang}/…` → passes through.
4. Unsupported first segment that looks like a lang code → falls into
   the `[lang]` 404.
5. Landing-only domain, path outside D1's landing set → 404.
6. After the calendars move to `app.*`: apex arrives here via 301 from
   DNS level; `/:community` slugs (svf.li QR, FUN-WEB-0048) forward 302 to
   the place's calendar on `app.*`, `etcc_*` preserved. Until the move:
   rule inactive.

The proxy is a pure function of hostname + path and holds no state. The
binding rules it must not break are stated where they belong, not as a
technology ban: locale is determined by the URL alone (TS-WEB-0001 D3), and
external APIs are reached server-side only, through the website's own
client endpoints (DEC-0025, NFR-WEB-0037/038).

### D3a — Localized pathnames: one route translation map [FIXED: DEC-0036; EN segments PROPOSED]

Public path segments are localized. A single table (`routes.ts`) is the
only source: `routeId → { de: path, en: path, … }`. Three consumers, no
other place knows a path: the proxy (D3) translates inbound public paths
to internal routes; the link facade (TS-WEB-0001 D5) renders outbound links in
the current language; hreflang/canonical (TS-WEB-0001 D6) derive from the same
table — that is how language variants know they belong together.
Candidate implementation: `next-intl` localized `pathnames`, or an own
map consumed by proxy + facade; decided at implementation, the contract
above is what binds. Route names themselves are fixed by DEC-0036.

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

### D4 — Navigation model [FIXED: SRC-0003, FUN-WEB-0002/021]

- Header: logo → `/`, the four job labels (Was ist los → `/dein-ort`,
  Termine veröffentlichen → `/mitmachen`, Dein Kalender →
  `/dein-kalender`, Warum wir → `/ueber-uns`), persistent "Kalender"
  button → `/dein-ort`.
- Footer: Newsletter, the legal links "Impressum" / "Datenschutz" /
  "Barrierefreiheit" pointing at their anchors on `/rechtliches`, and the
  language switcher (plain links, TS-WEB-0001 D5). **No contact entry**: the
  contact section stands immediately above the footer on every page and is
  the site's one contact surface (DEC-0081, TS-WEB-0006 D2). The three legal
  labels are conventional landmarks bound to the anchor registry (D8), not
  copy a spec is stating (DEC-0083 §4).
- The context band and the contact section are components on every page, never routes.
- All internal links go through the route facade (TS-WEB-0001 D5); no
  hard-coded hrefs.

### D5 — BFF route inventory [FIXED: DEC-0025; shapes PROPOSED]

Client-facing, use-case-cut, rate-limited + origin-checked (NFR-WEB-0038);
each proxies exactly one upstream need, server-side tokens only, cache
TTLs from TS-WEB-0003 D5:

| Route | Serves | Upstream |
| --- | --- | --- |
| `GET /api/places/search?q=` | place search by name (all pages) | the committed covered-community index (TS-WEB-0008 D2/D7) |
| `GET /api/places/search?zip=` | postcode → places, order flow scope step only (TS-WEB-0025 D3) | geo-api `community/search` (zips) |
| `GET /api/places/{slug}/events?window=` | dein-ort live dates, empty-state detection | events-api search |
| `GET /api/nearby?lat=&lng=&radius=` | "this week nearby" | events-api + geo-api |
| `GET /api/region/{county}/examples` | active example places (DEC-0034) | events-api (activity signal, Q-0015/Q-0025) |
| `GET /api/stats` | live counters | events-api `/api/stats` (public) |

envoy widget and Portalize loader talk to their own backends directly —
they are not proxied (their hosts are CSP-allowlisted, TS-WEB-0003 D4/NFR-WEB-0030).

### D6 — Rendering per route [FIXED: DEC-0019; assignment PROPOSED]

| Routes | Mode |
| --- | --- |
| all D1 content pages | static + ISR (1 h), live modules streamed via Suspense with skeletons (FUN-WEB-0106) |
| `/ueber-uns/archiv` | fully static from build-time `media-echo` fetch (FUN-WEB-0086) |
| `/dein-kalender/bestellen` | static shell; order interaction client-side against D5 routes |
| BFF routes | dynamic, cached per TS-WEB-0003 D5 |
| 404 | static shell + streamed place search; 500 fully static |

### D7 — Offering → surface map [FIXED: DEC-0052, DEC-0071]

Offerings never define routes (FUN-WEB-0002); every promoted offering has
exactly one primary surface. This map is the contract — later verifiable
against content frontmatter offering references (FUN-WEB-0085):

| Offering | Promotion | Primary surface |
| --- | --- | --- |
| `community-calendar` | promoted | `/dein-ort` (read) · `/mitmachen` (publish) · tier 1 on `/dein-kalender` |
| `portalize-calendar` | promoted | `/dein-kalender` + order flow |
| `portalize-enterprise` | promoted | `/deine-region` |
| `portalize-website-widget` | withheld | none built; `/deine-termine` is reserved but not built and answers 404 (DEC-0071). Nothing on the site links to it, and it is absent from the sitemap |
| `local-advertising` | withheld | **none** — DEC-0052 §3 narrowed CON-WEB-0015's "at most one sentence" to no occurrence while the offering is withheld; the guard checks for absence |
| `custom-data-integration` | on-request | mention on the enterprise page |

SEO landing pages (FUN-WEB-0074) attach to this map later instead of
inventing product URLs.

### D8 — Legal anchor registry [FIXED: DEC-0039]

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
| `#barrierefreiheit` | `#accessibility` | Barrierefreiheitserklärung (BFSG, NFR-WEB-0027) | to be written |
| `#nutzungsbedingungen` | `#terms` | Nutzungsbedingungen | `content/legal/terms-of-use.md` |
| `#community-richtlinien` | `#community-guidelines` | Community-Richtlinien | `content/legal/community-guidelines.md` |
| `#auftragsverarbeitung` | `#data-processing` | Auftragsverarbeitung (Q-0029) | `content/legal/dpa.md` |

Rules: anchors are lowercase kebab-case, localized like path segments
(D3a), and stable across languages in *meaning* — `/rechtliches#impressum`
and `/legal#imprint` are the same section. The on-page navigation lists
the sections in registry order. Footer links point at
`#impressum`, `#datenschutz`, `#barrierefreiheit` with their conventional
labels (D4).

## Free for the generator

- [FREE] Component/file organisation below the route level (co-location,
  private folders), loading.tsx granularity beyond FUN-WEB-0106.
- [FREE] Exact Suspense boundary placement within a page, within D6.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-WEB-0004-A1 | integration | Every D1 path responds 200 on `.de`, bare and `/en/…`, correct `<html lang>`. |
| TS-WEB-0004-A2 | integration | `/de/mitmachen` → 301 `/mitmachen`; `/uk/mitmachen` → 404 (real status). |
| TS-WEB-0004-A3 | integration | Landing-only domain: `/` and legal routes 200, `/mitmachen` 404. |
| TS-WEB-0004-A4 | integration | 404 renders place search + jobs band with status 404 and `noindex`; 500 renders without any data dependency. |
| TS-WEB-0004-A5 | integration | `sitemap.xml`, `robots.txt`, `llms.txt` respond per domain; sitemap lists only that domain's URLs in its languages. |
| TS-WEB-0004-A6 | e2e | No external API host appears in any client-initiated request except envoy and Portalize (verified via CSP report / network trace). |
| TS-WEB-0004-A7 | integration | BFF routes return 429 beyond the rate limit and reject foreign origins. |
| TS-WEB-0004-A8 | e2e | Navigation labels match D4 exactly on every page; every internal link resolves within the D1 inventory. |
| TS-WEB-0004-A9 | integration | Footer on every page carries newsletter and the three legal links under their conventional labels ("Impressum", "Datenschutz", "Barrierefreiheit"), each resolving to its anchor on `/rechtliches`. The footer carries no contact entry and no form; the contact section renders once, directly above it (TS-WEB-0006-A17). |
| TS-WEB-0004-A10 | static | No route segment in the app tree is a place slug or a place-shaped parameter: the route inventory equals D1 exactly, and no dynamic segment resolves against the place set. A place reaches a page only as a query parameter. |
| TS-WEB-0004-A11 | integration | Once the calendars have moved to `app.*`: a request to `/{community}` carrying `etcc_cmp`/`etcc_med` redirects to that place's calendar on `app.*` with both parameters intact. Before the move the rule is inactive and the path is served by the apex — the criterion is skipped with a recorded reason, not silently passed. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| FUN-WEB-0002 (nav labels name jobs) | D4 · A8 |
| FUN-WEB-0010 (page route) | D1, D2, D6 · A1 |
| FUN-WEB-0011 (page route) | D1, D2, D6 · A1 |
| FUN-WEB-0012 (page route) | D1, D2, D6 · A1 |
| FUN-WEB-0013 (page route) | D1, D2, D6 · A1 |
| FUN-WEB-0014 (page route) | D1, D2, D6 · A1 |
| FUN-WEB-0015 (page route) | D1, D2, D6 · A1 |
| FUN-WEB-0016 (page route) | D1, D2, D6 · A1 |
| FUN-WEB-0017 (page route) | D1, D2, D6 · A1 |
| FUN-WEB-0018 (page route) | D1, D2, D6 · A1 |
| FUN-WEB-0021 (header/footer inventory) | D4 |
| FUN-WEB-0029 (legal as one anchored page) | D1, D4, D8 |
| FUN-WEB-0026 (404) | D2, D6 · A4 |
| FUN-WEB-0027 (500) | D2, D6 · A4 |
| FUN-WEB-0047 (uncovered-place page route) | D1, D1a, D2 |
| FUN-WEB-0023 (no place slugs in paths) | D1, D1a |
| FUN-WEB-0048 (community-slug forwarding) | D3 rule 6 |
| FUN-WEB-0067 (other domains navigable) | D1 landing set · A3 |
| FUN-WEB-0073 (sitemaps + canonicals) | D1, sitemap.ts · A5 |
| FUN-WEB-0079 (robots + llms.txt) | D1 · A5 |
| NFR-WEB-0037 (BFF, no client tokens) | D5 · A6 |
| NFR-WEB-0038 (rate limits + origin checks) | D5 · A7 |
| FUN-WEB-0021 (footer inventory) | D4 · A9 |
| FUN-WEB-0023 (no place slugs in paths) | D1, D1a · A10 |
| FUN-WEB-0048 (community-slug forwarding) | D3 rule 6 · A11 |

## Open points

- D1 landing set, D2 layout, D3
  (incl. the TS-WEB-0001 D3 amendment), D3a (EN segments), D5
  shapes, D6 assignment, D7 are [PROPOSED]. The two renames
  (`bestellen`, `regionalkalender`) change routes defined in the IA and
  need the IA amendment first (DEC-0022).
- `/dein-ort/starten` ships only after the IA amendment is accepted
  (Q-0028).
