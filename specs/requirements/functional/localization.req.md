---
artefact: requirements
area: localization
status: DRAFT
sources: [SRC-0006, SRC-0007]
decisions: [DEC-0003, DEC-0005, DEC-0006]
---

# Localization and Domains

The locale mechanism is adopted from the proven product model
(`community-calendar/docs/localization-architecture.md`, SRC-0007) by
DEC-0005. The canonical mechanism documentation stays in that repository.

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| FUN-WEB-0060 | The website shall run one domain per country: `www.schafe-vorm-fenster.de` (de), `owcezaoknem.pl` (pl), `schafvormfenster.at` (at), and `sheepoutside.com` (international, en) — registered, DNS wiring pending. | SRC-0006, DEC-0003, DEC-0035 | S3 |
| FUN-WEB-0061 | The country TLD shall determine the default language; a URL path prefix (`/en/…`) overrides it. | SRC-0007, DEC-0005 | S3 |
| FUN-WEB-0062 | Locale determination shall be entirely server-side: no middleware state, no cookies, no `Accept-Language` at render time. The URL is the preference. | SRC-0007, DEC-0005 | S3 |
| FUN-WEB-0063 | Language and country switching shall be plain link navigation (prefix change / TLD change). | SRC-0007, DEC-0005 | S3 |
| FUN-WEB-0064 | Every internal link shall preserve the current language context; the prefix is emitted only when the language differs from the TLD default. | SRC-0007, DEC-0005 | S3 |
| FUN-WEB-0065 | A complete hreflang matrix shall link all domain × language combinations. | SRC-0007, DEC-0005 | S3 |
| FUN-WEB-0066 | Phase 1 ships `.de` in German and English. | SRC-0006, DEC-0006 | S3 |
| FUN-WEB-0067 | The non-phase-1 domains shall exist and be navigable from launch (at minimum a landing page), so the multi-domain mechanics are proven early. | SRC-0006 | S2 |
| FUN-WEB-0068 | Per-country language sets beyond phase 1 (e.g. `.de`: de/en/pl/uk · `.pl`: pl/en/de) are the target picture; exact sets per country: UNKNOWN (Q-0010). | SRC-0006, DEC-0006 | S1 |
| FUN-WEB-0069 | First-visit language/country suggestion — deferred (Q-0011). When built it shall be **client-side only**, shown **once** per visitor (sessionStorage), and must never influence server rendering or vary a cached response: pages stay statically cacheable. Path-determined language remains the rule; the suggestion only offers a link. | SRC-0007, DEC-0038 | S2 |
