---
artefact: requirements
area: seo
status: DRAFT
sources: [SRC-006]
---

# SEO

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| WEB-F-070 | Existing entry URLs of the live site shall either remain stable or receive proper (301) redirects to their successors; goal: preserve current search rank. A legacy URL inventory is required (Q-016, from SRC-010). | SRC-006 | S2 |
| WEB-F-071 | Markup shall be strictly semantic: main content in `main`/`article`, secondary content explicitly demoted to `aside`, navigation in `nav`; heading hierarchy sound. | SRC-006 | S2 |
| WEB-F-072 | Everything structured shall be marked up structured: JSON-LD metadata wherever applicable, plus HTML microdata/microformats (exact vocabulary set: to be defined in the tactical spec). | SRC-006 | S2 |
| WEB-F-073 | Canonical tags and per-domain, language-aware XML sitemaps shall be provided site-wide, coordinated with the hreflang matrix (WEB-F-065). | SRC-006, convention | S2 |
| WEB-F-074 | The website shall provide interest-oriented, SEO-optimised landing pages (e.g. county searching for a culture platform; municipality searching for a calendar solution). | SRC-006 | S2 |
| WEB-F-075 | Keyword-oriented landing pages targeting competitor search terms, possibly product-comparison pages, are deferred: legal review first (Q-009). | SRC-006 | S1 |
| WEB-F-076 | Every page shall carry purposeful meta descriptions and titles derived from its page brief. | SRC-006 | S2 |
| WEB-F-077 | Content of lower importance shall be identifiable as such to search engines (aside/secondary semantics), keeping the primary argument dominant per page. | SRC-006 | S2 |
| WEB-F-078 | Every page shall carry complete social sharing metadata (Open Graph, Twitter cards) with a per-page OG image. | convention | S2 |
| WEB-F-079 | AI crawlers shall be explicitly allowed in robots.txt; an `llms.txt` with short description and core facts is maintained. | DEC-018 | S3 |
