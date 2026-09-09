---
artefact: tactical-spec
id: TS-001
profile: system
status: DRAFT
implements: [WEB-F-060, WEB-F-061, WEB-F-062, WEB-F-063, WEB-F-064, WEB-F-065, WEB-F-066, WEB-F-067, WEB-F-068]
sources: [SRC-006, SRC-007]
decisions: [DEC-003, DEC-005, DEC-006]
---

# TS-001 — Locale Routing

## Purpose

How a request's language and country are determined, how URLs carry the
language, and how domains, links, and hreflang behave. One system, used
by every page.

## Determinations

### D1 — Domain matrix (phase 1) [FIXED: DEC-003, DEC-006]

| Domain | TLD default | Phase 1 state | Languages served |
| --- | --- | --- | --- |
| `www.schafe-vorm-fenster.de` | `de` | full site | `de` (bare), `en` (`/en/…`) |
| `www.owcezaoknem.pl` | `pl` | landing page only | `pl` |
| `www.schafvormfenster.at` | `de` | landing page only | `de` |
| international (TLD open, Q-001) | `en` | landing page only | `en` |
| `*.vercel.app`, `localhost`, unknown | `de` | mirror of `.de` behaviour | as `.de` |

### D2 — Canonical host [PROPOSED]

`www.` is the canonical host on every domain; apex and `http` redirect
301 to `https://www.` No other hostname variants are served.

### D3 — Detection algorithm [FIXED: DEC-005, SRC-007]

Per request, server-side, in this order — nothing else participates:

1. First path segment is a supported language code for this domain
   (e.g. `/en/`) → that language.
2. Otherwise → the domain's TLD default (D1).

No cookies, no session, no `Accept-Language` at render time. The result
sets `<html lang>`, content selection, all API `language` parameters, and
`og:locale`.

### D4 — URL grammar [FIXED: SRC-007]

- The TLD-default language is always **bare** (no prefix):
  `.de/mitmachen`, never `.de/de/mitmachen`.
- Non-default languages carry exactly one prefix segment:
  `.de/en/mitmachen`.
- A path whose first segment is a language code **not** served on this
  domain (D1) returns **404** [PROPOSED — alternative: 301 to bare;
  404 avoids soft-duplicate content].
- `/de/…` on `.de` (redundant prefix) redirects 301 to the bare path
  [PROPOSED].

### D5 — Link propagation [FIXED: SRC-007]

Every internal-link builder takes the current language. It emits the
prefix iff `lang !== tldDefault`. No hard-coded hrefs in components; all
internal links go through the link facade. Language/country switching is
plain `<a>` navigation (no JS requirement).

### D6 — hreflang and canonical (phase 1) [FIXED: DEC-005; matrix PROPOSED]

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

### D7 — System texts [FIXED: DEC-006 scope]

UI strings (navigation, buttons, form labels) exist in `de` and `en` as
part of the website content (WEB-F-082), keyed, not inline. Adding a
language must not require code changes [PROPOSED].

## Free for the generator

- [FREE] The language switcher's visual form and exact footer placement
  (IA fixes: footer).
- [FREE] Internal organisation of the locale module (file layout, helper
  naming), provided D5's single-facade rule holds.

## Acceptance criteria

| # | Check |
| --- | --- |
| A1 | `GET .de/mitmachen` → `de`, `<html lang="de">`, all internal links bare. |
| A2 | `GET .de/en/mitmachen` → `en`, `<html lang="en">`, all internal links prefixed `/en/`. |
| A3 | `GET .de/uk/mitmachen` → 404. `GET .de/de/mitmachen` → 301 `/mitmachen`. |
| A4 | `GET http://schafe-vorm-fenster.de/x` → 301 `https://www.schafe-vorm-fenster.de/x`. |
| A5 | Every full-site page carries the D6 hreflang set + self-canonical. |
| A6 | `GET <preview>.vercel.app/…` behaves exactly like `.de`. |
| A7 | Switching language on any page keeps the visitor on the equivalent page (D5), never the home page. |
| A8 | No `Set-Cookie`, no locale storage anywhere in the response chain. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| WEB-F-060 (one domain per country) | D1 · Q-001 for the intl TLD |
| WEB-F-061 (TLD default, prefix override) | D3, D4 · A1, A2 |
| WEB-F-062 (server-side only, URL is preference) | D3 · A8 |
| WEB-F-063 (switching = link navigation) | D5 · A7 |
| WEB-F-064 (link language propagation) | D5 · A1, A2, A7 |
| WEB-F-065 (hreflang matrix) | D6 · A5 |
| WEB-F-066 (phase 1: de + en on .de) | D1, D7 |
| WEB-F-067 (other domains navigable) | D1 landing rows |
| WEB-F-068 (per-country sets later) | D1 extensible · Q-010 |

WEB-F-069 (suggestion banner) is deliberately **not** implemented here —
open per Q-011; it would extend D3 as an additive client feature.

## Open points

- Q-001 (international TLD) blocks the fourth D1 row's domain name only.
- D2/D4-404/D7-no-code-change are [PROPOSED] and need a confirmation at
  the next decision point.
