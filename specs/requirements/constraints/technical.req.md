---
artefact: requirements
area: technical-constraints
status: DRAFT
sources: [SRC-006]
decisions: [DEC-002]
---

# Technical Constraints

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| WEB-C-001 | The website is built with Next.js (current major) and hosted on Vercel. No second framework is introduced — the stack is deliberately not diversified. | SRC-006, DEC-002 | S3 |
| WEB-C-002 | Mobile first: the primary audience arrives on the phone; mobile UX/UI is fully optimised. Tablet/desktop must work well but stays close to the mobile layout — width is not maximised. Breakpoints come from `@schafe-vorm-fenster/brand-design` (`breakpoint.xs…2xl`); the specs propose none. | SRC-006, SRC-014, DEC-056 | S3 |
| WEB-C-003 | The brand kit is binding: typography (Inter, DEC-043), colours, logos and imagery rules from `@schafe-vorm-fenster/brand-identity`. | SRC-006, SRC-008 | S2 |
| WEB-C-004 | The village calendars run on `app.schafe-vorm-fenster.de`; the website links to them ("Dorfkalender öffnen" persistent in the header) and embeds their data, but does not reimplement them. | SRC-001#purpose, SRC-003 | S2 |
| WEB-C-005 | TypeScript throughout; repository conventions (`pnpm`) follow the existing setup. | existing repo, convention | S1 |
| WEB-C-007 | Icons shall come from exactly one set — Lucide, 24 × 24 grid, 2 px stroke, monochrome, inheriting a single token colour, in three sizes (24 · 18 · 32). The website installs the set into its own stack as a dependency and imports glyphs by name; no icon file is committed here, none is drawn by hand, and no second family enters the set. | SRC-014#icons, DEC-056 | S3 |
| WEB-C-006 | The specification method for this repository is STRICT (`/Users/jan-henrik.hempel/LeafcutterOS/leafcutter-strict`); specs precede content. | DEC-023 | S3 |
