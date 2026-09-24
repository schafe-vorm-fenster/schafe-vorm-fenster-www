---
artefact: requirements
area: seo
status: DRAFT
sources: [SRC-0006]
---

# SEO

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| FUN-WEB-0070 | Existing entry URLs of the live site shall either remain stable or receive proper (301) redirects to their successors; goal: preserve current search rank. A legacy URL inventory is required (Q-0016, from SRC-0010). | SRC-0006 | S2 |
| FUN-WEB-0071 | Markup shall be strictly semantic: main content in `main`/`article`, secondary content explicitly demoted to `aside`, navigation in `nav`; heading hierarchy sound. | SRC-0006 | S2 |
| FUN-WEB-0072 | Everything structured shall be marked up structured: JSON-LD metadata wherever applicable, plus HTML microdata/microformats (exact vocabulary set: to be defined in the tactical spec). | SRC-0006 | S2 |
| FUN-WEB-0073 | Canonical tags and per-domain, language-aware XML sitemaps shall be provided site-wide, coordinated with the hreflang matrix (FUN-WEB-0065). | SRC-0006, convention | S2 |
| FUN-WEB-0074 | The website shall provide interest-oriented, SEO-optimised landing pages (e.g. county searching for a culture platform; municipality searching for a calendar solution). | SRC-0006 | S2 |
| FUN-WEB-0075 | Keyword-oriented landing pages targeting competitor search terms, possibly product-comparison pages, are deferred: legal review first (Q-0009). | SRC-0006 | S1 |
| FUN-WEB-0076 | Every page shall carry purposeful meta descriptions and titles derived from its page brief. | SRC-0006 | S2 |
| FUN-WEB-0077 | Content of lower importance shall be identifiable as such to search engines (aside/secondary semantics), keeping the primary argument dominant per page. | SRC-0006 | S2 |
| FUN-WEB-0078 | Every page shall carry complete social sharing metadata (Open Graph, Twitter cards) with a per-page OG image. | convention | S2 |
| FUN-WEB-0079 | AI crawlers shall be explicitly allowed in robots.txt; an `llms.txt` with short description and core facts is maintained. | DEC-0018 | S3 |
