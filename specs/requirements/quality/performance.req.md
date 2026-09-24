---
artefact: requirements
area: performance
status: DRAFT
sources: [SRC-0006, SRC-0007]
decisions: [DEC-0007]
---

# Performance

Budget adopted from `community-calendar/docs/performance-budget.md`
(SRC-0007) by DEC-0007, with FID replaced by INP; Lighthouse targets from
the transcript (SRC-0006).

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| NFR-WEB-0001 | Lighthouse scores shall target 100 in all four categories (Performance, Accessibility, Best Practices, SEO), desktop and mobile; 98 is the floor for Performance. | SRC-0006, DEC-0007 | S3 |
| NFR-WEB-0002 | Core Web Vitals: LCP < 2.5 s · INP < 200 ms · CLS < 0.1 · FCP < 800 ms · TTFB < 200 ms. | SRC-0007, DEC-0007 | S3 |
| NFR-WEB-0003 | Bundle budgets (compressed): initial HTML < 50 KB (incl. critical CSS) · JS total < 100 KB · CSS total < 30 KB · web fonts < 50 KB (woff2, variable) · images < 100 KB each (WebP/AVIF preferred). | SRC-0007, DEC-0007 | S3 |
| NFR-WEB-0004 | Critical CSS shall be inlined for above-fold content; non-critical JS deferred. | SRC-0007 | S2 |
| NFR-WEB-0005 | Fonts shall be self-hosted (brand kit woff2), `font-display: swap`, preloaded. | SRC-0007, brand kit | S2 |
| NFR-WEB-0006 | Images below the fold lazy-load; hero images eager-load. | SRC-0007 | S2 |
| NFR-WEB-0007 | Performance shall be enforced in CI (Lighthouse CI) and observed in production via cookieless RUM. | SRC-0007 | S2 |
| NFR-WEB-0009 | Every box that will hold asynchronous content shall declare its ratio or height **before** the content arrives — `aspect-ratio` on the media element, never a fixed pixel height; text that arrives with data reserves its height in line units. Nothing may push the page down after paint. | SRC-0014#aspect-ratios-and-reserved-space, DEC-0056 | S3 |
| NFR-WEB-0008 | Reduced-data signals (`Save-Data`, `prefers-reduced-data`) shall be honoured with lighter payloads. | SRC-0006 | S2 |

Cache strategy: the product's edge-cache table was **not** adopted
(product-specific page types). Website cache values: UNKNOWN, to be set in
the tactical spec per page type.
