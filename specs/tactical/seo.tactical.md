---
artefact: tactical-spec
id: TS-011
profile: rule
status: DRAFT
implements: [WEB-F-070, WEB-F-071, WEB-F-072, WEB-F-074, WEB-F-075, WEB-F-076, WEB-F-077, WEB-F-078]
sources: [SRC-003, SRC-006, SRC-010]
decisions: [DEC-018, DEC-020, DEC-022, DEC-026, DEC-035, DEC-036, DEC-037]
---

# TS-011 — Findability

## Purpose

How the relaunch keeps the rank the old site earned and makes every new
page legible to search engines and answer engines: the redirect map from
the legacy URLs, the semantic skeleton every page is built on, which
structured-data type sits on which page type, titles, descriptions and
share metadata, and what an SEO landing page may be.

Not here: sitemaps, `robots.txt`, `llms.txt` (TS-004 D1, WEB-F-073 and
WEB-F-079), hreflang and the canonical rule itself (TS-001 D6 — D9 below
only settles the query-parameter case), the URL inventory redirect
targets must hit (TS-004 D1), the legal anchors they may point at
(TS-004 D8), and the inherited `/:community` forwarding (TS-004 D3
rule 6, WEB-F-048).

## Determinations

### D1 — Redirect map: one source, one hop [FIXED: SRC-006 / WEB-F-070]

Every URL the old site exposed either resolves unchanged or answers a
**301** to its successor. The map lives in one generated file
(`redirects.ts`) and is consumed in exactly one place: `proxy.ts`
(TS-004 D3) evaluates it as **step 0**, before any locale rule, so a
legacy URL never passes through the bare-path rewrite first. Next.js
config-level `redirects()` is not used — one legacy URL is known in one
place only.

| Rule | Binding statement |
| --- | --- |
| Status | 301 (permanent). 302 only for the `/:community` forwarding, which is TS-004's. |
| Hops | Exactly one. A target may never itself be a redirect source; chains are resolved at map-build time, not at request time. |
| Query string | Preserved verbatim and appended to the target — `etcc_cmp`, `etcc_med` and every other campaign parameter survive every redirect (WEB-F-048 contract). |
| Fragment | Not touched; the browser carries it. Targets that need an anchor carry it in the map (e.g. `#impressum`, TS-004 D8). |
| Targets | Either a member of the TS-004 D1 inventory or an absolute URL on an owned host (`app.schafe-vorm-fenster.de`). Nothing else. |
| Language | Legacy URLs are German-only; they target the **bare** path, never `/en/…`. |
| No successor | A ranked URL never answers 404. Where no successor exists, it 301s to the nearest topically containing page — the home page only as the last resort. |
| Normalisation | Uppercase paths and trailing slashes 301 to the lowercase, slash-free form before the map is consulted. |
| Retirement | Rows are never deleted. The map is append-only, like the legal anchors (TS-004 D8): links we do not control keep resolving. |

### D2 — Known legacy families [PROPOSED — completion pending Q-016]

Extracted from the route files in `legacy-content/app/` (SRC-010). This
is **not** the inventory: the archive holds route files, not a URL list,
the `/hilfe` article slugs and their markdown were not archived, and no
export of actually-indexed URLs exists. Q-016 closes that gap; until it
does, the rows below are the confirmed floor.

| Legacy path | Was | Proposed target | Note |
| --- | --- | --- | --- |
| `/` | project home | `/` | unchanged |
| `/start` | "Anmelden" — publisher signup | `/mitmachen` | entry intent, not the form; `/mitmachen/registrieren` is one click on |
| `/funktionen` | feature list (10 markdown features) | `/dein-kalender` | the only page that still argues features |
| `/presse` | press page | `/ueber-uns/archiv` | proof archive is its successor (WEB-F-018) |
| `/impressum` | imprint **and** privacy (one page, legacy footer linked both here) | `/rechtliches#impressum` | anchor per TS-004 D8 |
| `/hilfe` | help index | **open** — help lives in the app (WEB-F-021), which has no public help URL contract | see Open points |
| `/hilfe/{slug}` | help articles | **open** — same, per article | slugs not archived (Q-016) |
| apex `/:community` | village calendars | TS-004 D3 rule 6 | not this spec's row |

### D3 — Semantic skeleton and the demotion registry [FIXED: SRC-006 / WEB-F-071, WEB-F-077; ties TS-002 D5]

One skeleton per page: `header > nav` · `main > article` · `aside`\* ·
`footer`. Exactly one `main`, exactly one `h1` (the page's argument
headline), heading levels never skip, every `nav` and every `aside`
carries an accessible name (its own heading or `aria-label`).

Streamed content (WEB-F-106 skeletons) lands **inside the landmark its
final content belongs to** — the landmark structure of a page is
identical before and after hydration.

Demotion is decided per element, not per page. The registry is binding:

| Element | Landmark | Reason |
| --- | --- | --- |
| Page argument, scene, mechanism (WEB-F-008) | `main > article` | the one primary argument |
| Primary conversion CTA (WEB-F-003, WEB-F-006) | inside `article` | must stay dominant |
| Place search on `/` and `/dein-ort` | inside `article` | the job is fulfilled in place (WEB-F-007) |
| Place search anywhere else | `aside` | secondary entry point |
| Live dates / "this week nearby" on `/dein-ort` | inside `article` | there the live data *is* the argument |
| The same modules on every other page | `aside` | illustration of a claim |
| Context band naming the other three jobs (WEB-F-005) | `aside` | offer, not argument |
| Live counters (WEB-F-041) | `aside` | proof beside a claim |
| Media-echo teasers outside `/ueber-uns/archiv` | `aside` | citation of third-party content |
| Archive list on `/ueber-uns/archiv` | `main > article` | there it is the page |
| Teasers for other offerings (TS-004 D7) | `aside` | one page, one offering |
| Header nav, footer nav, legal links, language switcher | `header` / `footer` + `nav` | never inside `main` |

No element is demoted by CSS alone and no `aside` is used for layout: if
it is in an `aside`, it is secondary; if it is secondary, it is in an
`aside`.

### D4 — Structured data: type per page type [PROPOSED]

No source fixes the vocabulary; this selection does. **JSON-LD** carries
entities, server-rendered in the page HTML, one `<script
type="application/ld+json">` graph per page, never injected by client
JS. **Schema.org microdata** (`itemscope`/`itemtype`/`itemprop` — not
microformats2, so both forms share one vocabulary) marks up visible,
repeating DOM structures. The rule that keeps them from contradicting
each other: **one entity, one representation** — an entity described in
JSON-LD is not also described in microdata on the same page.

Emitted types:

| Page | JSON-LD | Microdata |
| --- | --- | --- |
| every page | `WebPage` (`inLanguage`, `isPartOf` → `WebSite`, `primaryImageOfPage`, `description`) | — |
| `/` | `WebSite` + `Organization` (the full node, `@id` = site root) | — |
| second-level pages (`/dein-ort/starten`, `/mitmachen/registrieren`, `/dein-kalender/bestellen`, `/deine-region/angebot`, `/ueber-uns/archiv`) | `BreadcrumbList` | on the visible trail, if the IA adopts one — see Open points |
| `/dein-kalender` | `Service` + `Offer` (`price` 480, `priceCurrency` EUR, `unitCode` ANN, `provider` → `Organization` `@id`) | — |
| `/deine-region` | `Service` **without** any price or `Offer` (WEB-F-020: the region price is not published) | — |
| `/ueber-uns` | `Organization` (reference by `@id`, not a second full node) | — |
| `/ueber-uns/archiv` | — | `ItemList` of `NewsArticle`/`CreativeWork`, each with the **outlet** as `publisher` and `url` to the original — a citation list, never authored content |
| any page with a visible Q&A block | `FAQPage` | alternatively microdata on the block; one of the two, per the one-entity rule |
| `/rechtliches` | `WebPage` only | — |
| 404 / 500 | none | — |

Rules for values: every `Organization` field (legal name, address,
contact, registration) is read at build time from `content/legal/`
(WEB-F-088) — no identity data is written into code or into this spec.
`sameAs` lists only profiles that exist. `inLanguage` and every localized
string come from the page language (TS-001 D3, DEC-026).

Deliberately **not** emitted, each for a reason:

| Type | Why not |
| --- | --- |
| `LocalBusiness` | No premises customers visit and no opening hours. Emitting it would assert something untrue about a software operator that happens to sit in a village. `Organization` is the honest node. |
| `Event` | Event markup belongs to the app's calendar pages. The website shows excerpts of the same dates under a different host; marking them up would put the two in competition for one rich result — exactly the duplication DEC-037 avoids for place pages. |
| `Review` / `AggregateRating` | No rating data exists. Proof is quoted, never scored (WEB-F-036). |
| `Product` | The 480 € licence is a service, not a shippable product; product snippets additionally invite merchant signals the site cannot supply. |
| `SearchAction` (sitelinks searchbox) | The place parameter takes a resolved slug, not free text (WEB-F-023). Revisit only if a free-text search URL is ever introduced. |

`FAQPage` no longer produces rich results for a site of this kind. It is
emitted anyway: it is valid, it makes the answer machine-readable, and
answer engines are an explicit channel (DEC-018).

### D5 — Titles and descriptions [FIXED: SRC-006 / WEB-F-076; patterns PROPOSED]

Both are content, not code: they come from `seo.title` and
`seo.description` in the page's content frontmatter, fields of the Zod
schema (WEB-F-089), generated from the page brief in SRC-003 (WEB-F-081)
and written per language (WEB-F-025, DEC-026). Neither is ever derived at
runtime from body copy or from the `h1`.

| Rule | Value |
| --- | --- |
| Title length | ≤ 60 characters **including** the suffix ` · Schafe vorm Fenster`. If the page title does not fit, the suffix is dropped — the title is never truncated. |
| Title on `/` | Brand first: `Schafe vorm Fenster — <claim>`. |
| Title content | Names the job, not the product; product names stay out (WEB-F-002's rule read for metadata). |
| Description length | 120–158 characters. |
| Description content | The job plus the concrete next step. Generic claims ("einfach", "digital") are not copy (WEB-F-008). |
| Uniqueness | Unique per (path, language). A duplicate, a missing value, or an out-of-range length fails the build. |
| Landing pages | Same contract, no exception (D7). |
| Error pages | Title required, description not (they are `noindex`, D9). |

### D6 — Social sharing metadata [FIXED: convention / WEB-F-078; image system PROPOSED]

Every indexable page emits the complete set. Values derive from D5 and
from TS-001 D6, so title, canonical and `og:url` cannot drift apart.

| Tag | Value |
| --- | --- |
| `og:type` | `website` |
| `og:site_name` | Schafe vorm Fenster |
| `og:title` | `seo.title` without the brand suffix |
| `og:description` | `seo.description` |
| `og:url` | the canonical of the page, absolute (TS-001 D6, D9) |
| `og:locale` | the page language + region (e.g. `de_DE`), from TS-001 D3 |
| `og:locale:alternate` | one per hreflang alternate of the page |
| `og:image` | absolute URL, the page's own image |
| `og:image:width` / `:height` | 1200 / 630 |
| `og:image:alt` | localized, from frontmatter |
| `twitter:card` | `summary_large_image` |
| `twitter:title` / `:description` / `:image` | emitted explicitly, same values — never left to parser fallback |
| `twitter:site` | only if an account exists (Open points) |

Per-page image: generated at build time with `next/og` from the page
frontmatter (title line, brand mark, theme tokens) and stored per
(route, language) — the image carries text, so it is localized like any
other text (DEC-026); artifacts inside it are not. A hand-made image
named in frontmatter overrides the generated one. Format JPEG or PNG
(scrapers do not reliably render AVIF/WebP), ≤ 300 KB — outside the
TS-003 D1 image budget, because the page never loads it. No third-party
image service (DEC-013).

### D7 — Interest-oriented landing pages [PROPOSED — bounded by DEC-037, DEC-036]

A landing page addresses an **interest** — a role with a need — and
never a place. The bounds are hard:

1. No place slug in any path, ever (WEB-F-023, DEC-037). There are no
   `…-<ortsname>` pages, in any phase.
2. A landing page nests under an existing base (TS-004 D1a). It never
   founds a URL family and never introduces a product name into a path
   (WEB-F-002).
3. It carries everything a page carries: one focus job (WEB-F-001), one
   primary conversion (WEB-F-003), the context band (WEB-F-005), its own
   title/description/OG image (D5, D6), self-canonical and the hreflang
   set of TS-001 D6, and a sitemap entry (TS-004).
4. It ships only with substance that stands on its own. Near-duplicate
   pages differing in a keyword are doorway pages — a policy violation
   that would cost the ranking WEB-F-070 exists to protect.
5. It exists in the languages where the demand exists. A German-only
   landing page emits a self-canonical and **no** alternate: hreflang
   pairs real equivalents only (TS-001 D6).
6. New pages enter the IA first (DEC-022), then the specs. None of the
   candidates below is buildable before that amendment.

Candidate set, from the examples in WEB-F-074:

| Path | Interest | Focus job | Conversion |
| --- | --- | --- | --- |
| `/deine-region/landkreis` | county looking for a regional culture/event platform | run our own calendar | `request-licence-quote` |
| `/dein-kalender/gemeinde` | municipality looking for a calendar solution | run our own calendar | `buy-calendar-licence` |
| `/dein-kalender/tourismus` | tourism organisation with a regional date list | run our own calendar | `request-product-briefing` |

### D8 — Competitor-keyword pages: not prepared, not reserved [FIXED: WEB-F-075, Q-009]

Deferred means nothing is built **and** nothing is staged: no routes
reserved, no drafts in the content folder, no sitemap entries, no
competitor name in any title, description, `llms.txt` line, or landing
page. The website names no competitor while Q-009 is open.

The review Q-009 must answer, named so it can actually be asked: whether
comparison pages naming a competitor's mark are permissible under UWG § 6
(vergleichende Werbung) and MarkenG § 14 (use of a third party's mark),
including use of the mark in title and meta description, and whether the
answer differs for organic pages and for paid keywords should those ever
follow.

### D9 — Indexable surface: parameters and noindex [PROPOSED — refines TS-001 D6]

TS-001 D6 sets the canonical to "self, exactly as served". That is
ambiguous for the query parameters this site actually uses, and the
ambiguity would open an unbounded set of indexable URLs. The refinement:

| Surface | Directive |
| --- | --- |
| `/dein-ort?ort=…`, `/dein-ort/starten?ort=…` | indexable; canonical points at the **parameter-free** path |
| Any URL carrying `etcc_*` or other campaign parameters | canonical strips them; the parameters still reach analytics and still survive redirects (D1) |
| 404 and 500 | `noindex, follow`, real status (WEB-F-026, WEB-F-027) |
| `next.*` preview and `*.vercel.app` | `noindex, nofollow` on **every** response, as both `X-Robots-Tag` header and meta tag (DEC-035) |
| Landing-only domains | indexable; self-canonical only (TS-001 D6) |
| `/mitmachen/registrieren`, `/dein-kalender/bestellen`, `/deine-region/angebot` | indexable, no special treatment — they are content pages, not funnels |

Rule of thumb behind the table: a query parameter changes what a page
*shows*, never which page it *is*.

## Free for the generator

- [FREE] Emission mechanics for JSON-LD (Next.js Metadata API, a helper
  module, or explicit script tags) as long as D4's one-entity rule holds
  and the output is server-rendered.
- [FREE] Visual design of the OG image template, within D6's format,
  size and localization constraints.
- [FREE] The wording of titles and descriptions — content phase
  (WEB-F-087), within D5's limits.
- [FREE] Internal file layout and build-time generation of the redirect
  map, provided D1's single-source and single-hop rules hold.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-011-A1 | static | Every URL in the legacy inventory has exactly one map row; no row's target is another row's source (no chains); every internal target is a member of TS-004 D1. |
| TS-011-A2 | integration | Each legacy URL answers 301 in one hop; the target answers 200; `?etcc_cmp=x&etcc_med=y` is present, unmodified, on the target request. |
| TS-011-A3 | tool | Every page: exactly one `main`, exactly one `h1`, no skipped heading level, every `nav` and `aside` named. Zero HTML-validator errors. |
| TS-011-A4 | integration | The D3 registry holds per page: every listed secondary element renders inside an `aside`, every primary element inside `main > article`; the context band is an `aside` on every page. |
| TS-011-A5 | tool | Structured-data validation (schema.org validator + Rich Results Test) reports zero errors per page type, and each page emits exactly the D4 types assigned to it — no more. |
| TS-011-A6 | static | No entity `@id`/`itemtype` appears both as JSON-LD and as microdata on the same page. |
| TS-011-A7 | static | Every (path, language) has a unique non-empty title ≤ 60 chars and a description of 120–158 chars; violations fail the build. |
| TS-011-A8 | integration | Every indexable page emits the complete D6 tag set with absolute URLs; `og:url` equals the canonical; `og:locale` matches `<html lang>`; `og:locale:alternate` matches the hreflang set. |
| TS-011-A9 | e2e | The OG image of every (path, language) responds 200, is 1200×630, within the size budget, and shows text in that language. |
| TS-011-A10 | integration | `/dein-ort?ort=<slug>` and an `etcc_*`-carrying URL emit a parameter-free canonical; a preview host emits `noindex` in both header and meta on every route. |
| TS-011-A11 | static | No route, content file, sitemap entry, metadata field, or `llms.txt` line names a competitor while Q-009 is open. |
| TS-011-A12 | manual | Each interest landing page passes the SRC-001 page-brief compliance check and is reviewed against D7.4 (not a keyword permutation of an existing page) before publication. |
| TS-011-A13 | manual | Post-cutover watch: Search Console shows no rise in 404s on formerly indexed URLs, and the previously best-ranking legacy URLs keep their impressions within the agreed corridor eight weeks after launch. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| WEB-F-070 (stable URLs or 301) | D1, D2, D9 · A1, A2, A13 |
| WEB-F-071 (strictly semantic markup) | D3 · A3, A4 |
| WEB-F-072 (JSON-LD plus microdata) | D4 · A5, A6 |
| WEB-F-074 (interest landing pages) | D7 · A12 |
| WEB-F-075 (competitor keywords deferred) | D8 · A11 |
| WEB-F-076 (purposeful titles + descriptions) | D5 · A7 |
| WEB-F-077 (secondary content identifiable) | D3 demotion registry · A4 |
| WEB-F-078 (OG + Twitter, per-page image) | D6 · A8, A9 |

## Open points

- **Q-016 — legacy URL inventory (carried, not solved).** The archive
  (SRC-010) contains route files, not URLs: `/hilfe` article slugs and
  their markdown are missing, and no export of actually indexed URLs
  exists. D2 is the confirmed floor, not the inventory. Needed:
  a Search Console / server-log export of indexed and linked URLs of the
  live site. Owner: spec work. D2 stays [PROPOSED] until it lands.
- **Q-009 — competitor-keyword pages (carried, not solved).** D8 holds
  the prohibition and names the questions the legal review must answer.
  Owner: legal. WEB-F-075 stays S1 until then.
- **New question: where do `/hilfe` and `/hilfe/{slug}` redirect?** Help
  lives in the app (WEB-F-021), and the app publishes no public help URL
  contract. Without one, ranked help URLs have no successor and D1's
  "no ranked URL answers 404" rule cannot be satisfied. Demand to the app
  team; blocks two rows of D2.
- **New question: does the IA get a visible breadcrumb on second-level
  pages?** D4 assigns `BreadcrumbList` there; a visible trail is a UI
  element the IA does not have, and the IA is authoritative (DEC-022).
  Either the IA is amended or the breadcrumb markup is dropped.
- **New question: do the three D7 landing-page candidates enter the IA?**
  They are buildable only after the IA amendment (DEC-022) and the
  content phase (WEB-F-087).
- **New question: which social profiles exist?** Needed for
  `Organization.sameAs` (D4) and `twitter:site` (D6). Both are omitted
  rather than guessed until answered.
- **Amendment owed to TS-004 D3:** the legacy redirect map is a new
  step 0 in the proxy's evaluation order (D1).
- **Amendment owed to TS-001 D6:** the query-parameter canonical rule of
  D9 refines "self, exactly as served".
- [PROPOSED] and awaiting a decision point: D2, D4, D6's image system,
  D7, D9.
