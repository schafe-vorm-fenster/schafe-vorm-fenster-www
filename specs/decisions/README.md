# Decisions

## Purpose

Decision records for this specification. STRICT rule: executors propose,
decision points decide — a requirement carries `S3` sufficiency only when a
`DEC-###` backs it. Format follows the ADR convention used across the
organisation (`NNN-title` files, status/context/decision/consequences).

Repository-level decisions (content SSOT, audience model) live in
`go-to-market-os/handbook/decisions/` and are referenced, not repeated.

## Index

- [DEC-001 — Product docs are reviewed item by item, then removed](001-product-docs-reviewed-then-removed.md)
- [DEC-002 — Next.js and Vercel are the website stack](002-nextjs-vercel-stack.md)
- [DEC-003 — Domain scope: de, pl, at, international](003-domain-scope.md)
- [DEC-004 — Cookieless analytics as requirement, eTracker as interim](004-cookieless-analytics-etracker-interim.md)
- [DEC-005 — The product's locale model is adopted in full](005-adopt-locale-model.md)
- [DEC-006 — Phase 1 languages: German and English on .de](006-phase-1-languages.md)
- [DEC-007 — Performance budget adopted with INP](007-performance-budget-inp.md)
- [DEC-008 — Extracted product-doc files are deleted](008-delete-extracted-doc-files.md)
- [DEC-009 — Lead capture runs through the envoy web-component widget](009-envoy-lead-widget.md)
- [DEC-010 — Product briefings are booked via Google Calendar appointment links](010-briefing-via-google-calendar.md)
- [DEC-011 — Self-service purchase concludes on invoice](011-purchase-on-invoice.md)
- [DEC-012 — BFSG conformity is targeted; legal texts keep the Google-Docs import](012-bfsg-and-legal-import.md)
- [DEC-013 — No third-party embeds](013-no-third-party-embeds.md)
- [DEC-014 — Spam protection is honeypot plus rate limiting](014-spam-protection-honeypot.md)
- [DEC-015 — Strict security baseline from the start](015-strict-security-baseline.md)
- [DEC-016 — Measure first, experiment later](016-measure-first-experiment-later.md)
- [DEC-017 — Production monitoring uses Vercel-native means](017-vercel-native-monitoring.md)
- [DEC-018 — AI crawlers are allowed; an llms.txt is maintained](018-allow-ai-crawlers-llms-txt.md)
- [DEC-019 — Live data is served through a three-tier resilience chain](019-three-tier-data-resilience.md)
- [DEC-020 — Website content is generated from GTM packages and sourced locally](020-content-architecture.md)
- [DEC-021 — Service integration follows the product's OpenAPI contract pattern](021-api-contracts-via-openapi.md)
- [DEC-022 — The new information architecture is authoritative; there is no news section](022-ia-is-authoritative-no-news.md)
- [DEC-023 — Three-phase relaunch order; STRICT is the specification method](023-three-phases-and-strict.md)
- [DEC-024 — Place search covers all of Germany; an uncovered place is a conversion moment](024-place-search-covers-germany.md)
- [DEC-025 — The website is its own BFF; external API tokens never reach the client](025-bff-no-external-tokens-client.md)
- [DEC-026 — Localized pages render localized content; original artifacts stay original](026-localize-everything-but-artifacts.md)
- [DEC-027 — Legal texts come in DE and EN through the same Google-Docs import](027-legal-multilanguage-same-import.md)
- [DEC-028 — One eTracker account and property across website and app](028-single-etracker-account.md)
- [DEC-029 — App handover uses geo-api community slugs](029-app-handover-via-slugs.md)
- [DEC-030 — The embed demo uses the finished Portalize loader](030-embed-demo-via-portalize-loader.md)
- [DEC-031 — Two-stage deployment model — migration preview now, full pipeline later](031-two-stage-deployment-model.md)
- [DEC-032 — Error pages — 404 converts, 500 stays static, module errors stay invisible](032-error-pages.md)
- [DEC-033 — Skeletons and streaming everywhere, especially for geo-personalized content](033-skeletons-and-streaming.md)
- [DEC-034 — Region page interim — active examples instead of place lists](034-region-interim-active-examples.md)
- [DEC-035 — Domain layout — www is the website, apex serves the calendars until app.*; next.* is the migration preview](035-domain-layout-and-preview.md)
- [DEC-036 — Routes speak in the second person — the dein family](036-dein-route-family.md)
- [DEC-037 — The website never carries a place slug in a path](037-no-place-slugs-on-the-website.md)
- [DEC-038 — Language is determined by the path; suggestion is client-side and one-off](038-language-is-path-determined.md)
- [DEC-039 — Legal content is one long page with anchor navigation](039-legal-as-one-page.md)
- [DEC-040 — Verification architecture — levels on acceptance criteria, IDs everywhere, Gherkin for journeys](040-verification-architecture.md)
- [DEC-041 — Relevance engine — website-owned service, geo hierarchy of the geo-api, segmented not personalised](041-relevance-engine-design.md)
- [DEC-042 — Hub content is referenced by package name, never by repository path](042-reference-packages-by-name.md)
- [DEC-043 — The brand typeface is Inter; Catamaran is retired](043-brand-typeface-changed.md)
