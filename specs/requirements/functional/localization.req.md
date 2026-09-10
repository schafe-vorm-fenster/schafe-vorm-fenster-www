---
artefact: requirements
area: localization
status: DRAFT
sources: [SRC-006, SRC-007]
decisions: [DEC-003, DEC-005, DEC-006]
---

# Localization and Domains

The locale mechanism is adopted from the proven product model
(`community-calendar/docs/localization-architecture.md`, SRC-007) by
DEC-005. The canonical mechanism documentation stays in that repository.

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| WEB-F-060 | The website shall run one domain per country: `www.schafe-vorm-fenster.de` (de), `owcezaoknem.pl` (pl), `schafvormfenster.at` (at), and `sheepoutside.com` (international, en) — registered, DNS wiring pending. | SRC-006, DEC-003, DEC-035 | S3 |
| WEB-F-061 | The country TLD shall determine the default language; a URL path prefix (`/en/…`) overrides it. | SRC-007, DEC-005 | S3 |
| WEB-F-062 | Locale determination shall be entirely server-side: no middleware state, no cookies, no `Accept-Language` at render time. The URL is the preference. | SRC-007, DEC-005 | S3 |
| WEB-F-063 | Language and country switching shall be plain link navigation (prefix change / TLD change). | SRC-007, DEC-005 | S3 |
| WEB-F-064 | Every internal link shall preserve the current language context; the prefix is emitted only when the language differs from the TLD default. | SRC-007, DEC-005 | S3 |
| WEB-F-065 | A complete hreflang matrix shall link all domain × language combinations. | SRC-007, DEC-005 | S3 |
| WEB-F-066 | Phase 1 ships `.de` in German and English. | SRC-006, DEC-006 | S3 |
| WEB-F-067 | The non-phase-1 domains shall exist and be navigable from launch (at minimum a landing page), so the multi-domain mechanics are proven early. | SRC-006 | S2 |
| WEB-F-068 | Per-country language sets beyond phase 1 (e.g. `.de`: de/en/pl/uk · `.pl`: pl/en/de) are the target picture; exact sets per country: UNKNOWN (Q-010). | SRC-006, DEC-006 | S1 |
| WEB-F-069 | First-visit language/country suggestion — deferred (Q-011). When built it shall be **client-side only**, shown **once** per visitor (sessionStorage), and must never influence server rendering or vary a cached response: pages stay statically cacheable. Path-determined language remains the rule; the suggestion only offers a link. | SRC-007, DEC-038 | S2 |
