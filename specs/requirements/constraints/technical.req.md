---
artefact: requirements
area: technical-constraints
status: DRAFT
sources: [SRC-0006]
decisions: [DEC-0002, DEC-0085]
---

# Technical Constraints

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| CON-WEB-0001 | The website is built with Next.js (current major) and hosted on Vercel. No second framework is introduced — the stack is deliberately not diversified. | SRC-0006, DEC-0002 | S3 |
| CON-WEB-0002 | Mobile first: the primary audience arrives on the phone; mobile UX/UI is fully optimised. Tablet/desktop must work well but stays close to the mobile layout — width is not maximised. Breakpoints come from `@schafe-vorm-fenster/brand-design` (`breakpoint.xs…2xl`); the specs propose none. The scale is dense below the tablet on purpose — three of its six switch points sit under 640 px so that a small phone and a large phone are tuned differently instead of sharing one undifferentiated "mobile" layout. | SRC-0006, SRC-0014, DEC-0056 | S3 |
| CON-WEB-0003 | The brand kit is binding: typography (Atkinson Hyperlegible Next, DEC-0043), tokens, logos and imagery rules from `@schafe-vorm-fenster/brand-design` (tokens, assets) and `@schafe-vorm-fenster/brand-identity` (imagery, tone) per DEC-0044. | SRC-0006, DEC-0043, DEC-0044 | S3 |
| CON-WEB-0004 | The village calendars run on `app.schafe-vorm-fenster.de`; the website links to them ("Dorfkalender öffnen" persistent in the header) and embeds their data, but does not reimplement them. | SRC-0001#purpose, SRC-0003 | S2 |
| CON-WEB-0005 | TypeScript throughout; repository conventions (`pnpm`) follow the existing setup. | existing repo, convention | S1 |
| CON-WEB-0007 | Icons shall come from exactly one set — Lucide, 24 × 24 grid, 2 px stroke, monochrome, inheriting a single token colour, in three sizes (24 · 18 · 32). The website installs the set into its own stack as a dependency and imports glyphs by name; no icon file is committed here, none is drawn by hand, and no second family enters the set. | SRC-0014#icons, DEC-0056 | S3 |
| CON-WEB-0006 | The specification method for this repository is STRICT, installed as the versioned devDependency `@leafcutter-strict/blueprint-complete` and referenced by package name rather than by repository path (DEC-0085); specs precede content. | DEC-0023, DEC-0085 | S3 |
