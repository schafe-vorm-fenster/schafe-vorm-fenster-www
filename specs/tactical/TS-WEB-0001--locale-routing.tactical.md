---
artefact: tactical-spec
id: TS-WEB-0001
kind: system
status: DRAFT
implements: [FUN-WEB-0060, FUN-WEB-0061, FUN-WEB-0062, FUN-WEB-0063, FUN-WEB-0064, FUN-WEB-0065, FUN-WEB-0066, FUN-WEB-0067, FUN-WEB-0068]
sources: [SRC-0006, SRC-0007]
decisions: [DEC-0003, DEC-0005, DEC-0006]
---

# TS-WEB-0001 — Locale Routing

## Purpose

How a request's language and country are determined, how URLs carry the
language, and how domains, links, and hreflang behave. One system, used
by every page.

## Determinations

### D1 — Domain matrix (phase 1) [FIXED: DEC-0003, DEC-0006]

| Domain | TLD default | Phase 1 state | Languages served |
| --- | --- | --- | --- |
| `www.schafe-vorm-fenster.de` | `de` | full site | `de` (bare), `en` (`/en/…`) |
| `www.owcezaoknem.pl` | `pl` | landing page only | `pl` |
| `www.schafvormfenster.at` | `de` | landing page only | `de` |
| `www.sheepoutside.com` | `en` | landing page only (DNS wiring pending) | `en` |
| `*.vercel.app`, `localhost`, unknown | `de` | mirror of `.de` behaviour | as `.de` |

### D2 — Canonical host [FIXED: DEC-0035; phasing]

`www.` is the canonical host on every domain; `http` redirects 301 to
`https://www.` **Phasing for the `.de` apex:** it serves the village
calendars until they move to `app.*`; only then does apex 301 to `www.`,
and the website forwards inherited `/:community` paths onward to `app.*`
(FUN-WEB-0048).

### D3 — Detection algorithm [FIXED: DEC-0005, SRC-0007]

Per request, server-side, in this order — nothing else participates:

1. First path segment is a supported language code for this domain
   (e.g. `/en/`) → that language.
2. Otherwise → the domain's TLD default (D1).

The rendered language is a pure function of the URL — no cookies, no
session, no `Accept-Language` at render time. The reason is cacheability:
pages must stay statically cacheable, and a request header that varies
the output would break that. The result sets `<html lang>`, content
selection, all API `language` parameters, and `og:locale`.

### D4 — URL grammar [FIXED: SRC-0007]

- The TLD-default language is always **bare** (no prefix):
  `.de/mitmachen`, never `.de/de/mitmachen`.
- Non-default languages carry exactly one prefix segment:
  `.de/en/mitmachen`.
- A path whose first segment is a language code **not** served on this
  domain (D1) returns **404** [PROPOSED — alternative: 301 to bare;
  404 avoids soft-duplicate content].
- `/de/…` on `.de` (redundant prefix) redirects 301 to the bare path
  [PROPOSED].

### D5 — Link propagation [FIXED: SRC-0007]

Every internal-link builder takes the current language. It emits the
prefix iff `lang !== tldDefault`. No hard-coded hrefs in components; all
internal links go through the link facade. Language/country switching is
plain `<a>` navigation (no JS requirement).

### D6 — hreflang and canonical (phase 1) [FIXED: DEC-0005; matrix PROPOSED]

Every full-site page emits:

```
<link rel="alternate" hreflang="de"        href="https://www.schafe-vorm-fenster.de{bare}" />
<link rel="alternate" hreflang="en"        href="https://www.schafe-vorm-fenster.de/en{bare}" />
<link rel="alternate" hreflang="x-default" href="https://www.schafe-vorm-fenster.de{bare}" />
<link rel="canonical"                      href="{self, exactly as served}" />
```

Landing-only domains emit self-referencing canonical only. The matrix
grows per D1 as domains gain content; cross-domain hreflang starts only
when equivalent pages exist on both domains.

### D7 — System texts [FIXED: DEC-0006 scope]

UI strings (navigation, buttons, form labels) exist in `de` and `en` as
part of the website content (FUN-WEB-0082), keyed, not inline. Adding a
language must not require code changes [PROPOSED].

## Free for the generator

- [FREE] The language switcher's visual form and exact footer placement
  (IA fixes: footer).
- [FREE] Internal organisation of the locale module (file layout, helper
  naming), provided D5's single-facade rule holds.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-WEB-0001-A1 | integration | `GET .de/mitmachen` → `de`, `<html lang="de">`, all internal links bare. |
| TS-WEB-0001-A2 | integration | `GET .de/en/mitmachen` → `en`, `<html lang="en">`, all internal links prefixed `/en/`. |
| TS-WEB-0001-A3 | integration | `GET .de/uk/mitmachen` → 404. `GET .de/de/mitmachen` → 301 `/mitmachen`. |
| TS-WEB-0001-A4 | e2e | `GET http://schafe-vorm-fenster.de/x` → 301 `https://www.schafe-vorm-fenster.de/x`. |
| TS-WEB-0001-A5 | integration | Every full-site page carries the D6 hreflang set + self-canonical. |
| TS-WEB-0001-A6 | integration | `GET <preview>.vercel.app/…` behaves exactly like `.de`. |
| TS-WEB-0001-A7 | e2e | Switching language on any page keeps the visitor on the equivalent page (D5), never the home page. |
| TS-WEB-0001-A8 | integration | No `Set-Cookie`, no locale storage anywhere in the response chain. |
| TS-WEB-0001-A9 | integration | Each domain of D1 resolves over HTTPS and renders in its TLD default language; the international domain is reachable once its DNS is wired (Q-0001 residual). |
| TS-WEB-0001-A10 | integration | `.de` serves German bare and English under `/en/`; no third language is reachable on any domain. |
| TS-WEB-0001-A11 | static | The language table is the single place a language is declared: the set that ships equals phase 1 exactly (de + en on `.de`, the national language elsewhere). **Limitation:** the target picture beyond phase 1 (FUN-WEB-0068) is deliberately not verified — it becomes checkable when a second country gains content. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| FUN-WEB-0060 (one domain per country) | D1 · Q-0001 for the intl TLD |
| FUN-WEB-0061 (TLD default, prefix override) | D3, D4 · A1, A2 |
| FUN-WEB-0062 (server-side only, URL is preference) | D3 · A8 |
| FUN-WEB-0063 (switching = link navigation) | D5 · A7 |
| FUN-WEB-0064 (link language propagation) | D5 · A1, A2, A7 |
| FUN-WEB-0065 (hreflang matrix) | D6 · A5 |
| FUN-WEB-0066 (phase 1: de + en on .de) | D1, D7 |
| FUN-WEB-0067 (other domains navigable) | D1 landing rows |
| FUN-WEB-0068 (per-country sets later) | D1 extensible · Q-0010 |
| FUN-WEB-0060 (one domain per country) | D1 · A9 |
| FUN-WEB-0066 (phase 1: de + en) | D1, D7 · A10 |
| FUN-WEB-0068 (per-country sets, target picture) | D1 · A11, limited by design |

FUN-WEB-0069 (suggestion banner) is deliberately **not** implemented here —
open per Q-0011; it would extend D3 as an additive client feature.

## Open points

- D4-404 and D7-no-code-change are [PROPOSED] and need a confirmation at
  the next decision point.
