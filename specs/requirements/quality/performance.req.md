---
artefact: requirements
area: performance
status: DRAFT
sources: [SRC-006, SRC-007]
decisions: [DEC-007]
---

# Performance

Budget adopted from `community-calendar/docs/performance-budget.md`
(SRC-007) by DEC-007, with FID replaced by INP; Lighthouse targets from
the transcript (SRC-006).

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| WEB-Q-001 | Lighthouse scores shall target 100 in all four categories (Performance, Accessibility, Best Practices, SEO), desktop and mobile; 98 is the floor for Performance. | SRC-006, DEC-007 | S3 |
| WEB-Q-002 | Core Web Vitals: LCP < 2.5 s · INP < 200 ms · CLS < 0.1 · FCP < 800 ms · TTFB < 200 ms. | SRC-007, DEC-007 | S3 |
| WEB-Q-003 | Bundle budgets (compressed): initial HTML < 50 KB (incl. critical CSS) · JS total < 100 KB · CSS total < 30 KB · web fonts < 50 KB (woff2, variable) · images < 100 KB each (WebP/AVIF preferred). | SRC-007, DEC-007 | S3 |
| WEB-Q-004 | Critical CSS shall be inlined for above-fold content; non-critical JS deferred. | SRC-007 | S2 |
| WEB-Q-005 | Fonts shall be self-hosted (brand kit woff2), `font-display: swap`, preloaded. | SRC-007, brand kit | S2 |
| WEB-Q-006 | Images below the fold lazy-load; hero images eager-load. | SRC-007 | S2 |
| WEB-Q-007 | Performance shall be enforced in CI (Lighthouse CI) and observed in production via cookieless RUM. | SRC-007 | S2 |
| WEB-Q-009 | Every box that will hold asynchronous content shall declare its ratio or height **before** the content arrives — `aspect-ratio` on the media element, never a fixed pixel height; text that arrives with data reserves its height in line units. Nothing may push the page down after paint. | SRC-014#aspect-ratios-and-reserved-space, DEC-056 | S3 |
| WEB-Q-008 | Reduced-data signals (`Save-Data`, `prefers-reduced-data`) shall be honoured with lighter payloads. | SRC-006 | S2 |

Cache strategy: the product's edge-cache table was **not** adopted
(product-specific page types). Website cache values: UNKNOWN, to be set in
the tactical spec per page type.
