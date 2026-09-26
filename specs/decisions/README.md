# Decisions

## Purpose

Decision records for this specification. STRICT rule: executors propose,
decision points decide — a requirement carries `S3` sufficiency only when a
`DEC-####` backs it. The record keeps the ADR sections the organisation uses
(status/context/decision/consequences); the file is named for the artefact it
holds — `DEC-####--<slug>.md` — the way
`@leafcutter-strict/method-identifier-and-locator-schema` requires an artefact
to be resolvable by its identifier (DEC-0086).

Repository-level decisions (content SSOT, audience model) live in
`go-to-market-os/handbook/decisions/` and are referenced, not repeated.

## Two artefacts live here

- **`DEC-####--<slug>.md`** — an ADR: a choice and the reasoning behind it,
  in the organisation's context/decision/consequences sections. 110 of them.
  The citation count that stood here was produced by a one-off script and has
  not been re-derived; a number nobody can reproduce is worse than none.
- **`SDR-<yyyy>-<mmdd>-<nnnn>.yaml`** — a STRICT decision record: the
  execution of one decision point on one subject, with every criterion of that
  decision point, the mode and executor copied off the policy row, the bounds
  evaluated and the subject's evidence sufficiency at the time. Immutable; a
  reversal is a new record naming the old one in `supersedes`.

DEC-0100 argues from the contracts that these are **not the same artefact**
and keeps both. The decisive field is `dp`: it is required and its pattern is
closed at `DP-01…DP-14`, and most decisions recorded here — a stack choice, a
compound split, a copy rule — are none of the fourteen.

**There are no SDRs yet.** No decision point has been executed under
`POL-GRADED-BY-IMPACT` since it was bound, because every artefact has a
dependant and none reaches the low impact level (DEC-0089). `check:specs` E15
anchors a status off `DRAFT` on an SDR, so the register's first row will be
the first status move; E23 validates any record that appears.

## Amending a record

An ADR is amended where a later decision spends one of its reasons, and the
amendment says so — DEC-0085 §6 carries five such rows. An SDR is never
amended. That difference is the difference between the two artefacts.

## Index

- [DEC-0001 — Product docs are reviewed item by item, then removed](DEC-0001--product-docs-reviewed-then-removed.md)
- [DEC-0002 — Next.js and Vercel are the website stack](DEC-0002--nextjs-vercel-stack.md)
- [DEC-0003 — Domain scope: de, pl, at, international](DEC-0003--domain-scope.md)
- [DEC-0004 — Cookieless analytics as requirement, eTracker as interim](DEC-0004--cookieless-analytics-etracker-interim.md)
- [DEC-0005 — The product's locale model is adopted in full](DEC-0005--adopt-locale-model.md)
- [DEC-0006 — Phase 1 languages: German and English on .de](DEC-0006--phase-1-languages.md)
- [DEC-0007 — Performance budget adopted with INP](DEC-0007--performance-budget-inp.md)
- [DEC-0008 — Extracted product-doc files are deleted](DEC-0008--delete-extracted-doc-files.md)
- [DEC-0009 — Lead capture runs through the envoy web-component widget](DEC-0009--envoy-lead-widget.md)
- [DEC-0010 — Product briefings are booked via Google Calendar appointment links](DEC-0010--briefing-via-google-calendar.md)
- [DEC-0011 — Self-service purchase concludes on invoice](DEC-0011--purchase-on-invoice.md)
- [DEC-0012 — BFSG conformity is targeted; legal texts keep the Google-Docs import](DEC-0012--bfsg-and-legal-import.md)
- [DEC-0013 — No third-party embeds](DEC-0013--no-third-party-embeds.md)
- [DEC-0014 — Spam protection is honeypot plus rate limiting](DEC-0014--spam-protection-honeypot.md)
- [DEC-0015 — Strict security baseline from the start](DEC-0015--strict-security-baseline.md)
- [DEC-0016 — Measure first, experiment later](DEC-0016--measure-first-experiment-later.md)
- [DEC-0017 — Production monitoring uses Vercel-native means](DEC-0017--vercel-native-monitoring.md)
- [DEC-0018 — AI crawlers are allowed; an llms.txt is maintained](DEC-0018--allow-ai-crawlers-llms-txt.md)
- [DEC-0019 — Live data is served through a three-tier resilience chain](DEC-0019--three-tier-data-resilience.md)
- [DEC-0020 — Website content is generated from GTM packages and sourced locally](DEC-0020--content-architecture.md)
- [DEC-0021 — Service integration follows the product's OpenAPI contract pattern](DEC-0021--api-contracts-via-openapi.md)
- [DEC-0022 — The new information architecture is authoritative; there is no news section](DEC-0022--ia-is-authoritative-no-news.md)
- [DEC-0023 — Three-phase relaunch order; STRICT is the specification method](DEC-0023--three-phases-and-strict.md)
- [DEC-0024 — Place search covers all of Germany; an uncovered place is a conversion moment](DEC-0024--place-search-covers-germany.md)
- [DEC-0025 — The website is its own BFF; external API tokens never reach the client](DEC-0025--bff-no-external-tokens-client.md)
- [DEC-0026 — Localized pages render localized content; original artifacts stay original](DEC-0026--localize-everything-but-artifacts.md)
- [DEC-0027 — Legal texts come in DE and EN through the same Google-Docs import](DEC-0027--legal-multilanguage-same-import.md)
- [DEC-0028 — One eTracker account and property across website and app](DEC-0028--single-etracker-account.md)
- [DEC-0029 — App handover uses geo-api community slugs](DEC-0029--app-handover-via-slugs.md)
- [DEC-0030 — The embed demo uses the finished Portalize loader](DEC-0030--embed-demo-via-portalize-loader.md)
- [DEC-0031 — Two-stage deployment model — migration preview now, full pipeline later](DEC-0031--two-stage-deployment-model.md)
- [DEC-0032 — Error pages — 404 converts, 500 stays static, module errors stay invisible](DEC-0032--error-pages.md)
- [DEC-0033 — Skeletons and streaming everywhere, especially for geo-personalized content](DEC-0033--skeletons-and-streaming.md)
- [DEC-0034 — Region page interim — active examples instead of place lists](DEC-0034--region-interim-active-examples.md)
- [DEC-0035 — Domain layout — www is the website, apex serves the calendars until app.*; next.* is the migration preview](DEC-0035--domain-layout-and-preview.md)
- [DEC-0036 — Routes speak in the second person — the dein family](DEC-0036--dein-route-family.md)
- [DEC-0037 — The website never carries a place slug in a path](DEC-0037--no-place-slugs-on-the-website.md)
- [DEC-0038 — Language is determined by the path; suggestion is client-side and one-off](DEC-0038--language-is-path-determined.md)
- [DEC-0039 — Legal content is one long page with anchor navigation](DEC-0039--legal-as-one-page.md)
- [DEC-0040 — Verification architecture — levels on acceptance criteria, IDs everywhere, Gherkin for journeys](DEC-0040--verification-architecture.md)
- [DEC-0041 — Relevance engine — website-owned service, geo hierarchy of the geo-api, segmented not personalised](DEC-0041--relevance-engine-design.md)
- [DEC-0042 — Hub content is referenced by package name, never by repository path](DEC-0042--reference-packages-by-name.md)
- [DEC-0043 — The brand typeface is Atkinson Hyperlegible Next; Catamaran is retired](DEC-0043--brand-typeface-changed.md)
- [DEC-0044 — Two brand packages, three levels of use](DEC-0044--brand-packages-three-levels.md)
- [DEC-0045 — The CSP uses per-build hashes; the shell stays static](DEC-0045--csp-per-build-hashes.md)
- [DEC-0046 — The last-good store is the Vercel Runtime Cache](DEC-0046--last-good-in-runtime-cache.md)
- [DEC-0047 — Support articles move to the app; /hilfe redirects there](DEC-0047--support-content-moves-to-the-app.md)
- [DEC-0048 — Stage-0 weights split between time and job; proof counts per surface](DEC-0048--stage-zero-weights-and-proof-counts.md)
- [DEC-0049 — Assessments expire after twelve months or a major version](DEC-0049--assessment-review-trigger.md)
- [DEC-0050 — A package publish dispatches the website content update](DEC-0050--content-update-trigger.md)
- [DEC-0051 — envoy carries newsletter signup and the invoice handover](DEC-0051--envoy-carries-newsletter-and-invoicing.md)
- [DEC-0052 — Page-level answers: product name, promotion material, local advertising, newsletter placement, DPA](DEC-0052--page-level-answers.md)
- [DEC-0053 — One national language plus English per domain; the suggestion ships after launch](DEC-0053--language-scope-and-suggestion.md)
- [DEC-0054 — Visual generation waits for the complete design system](DEC-0054--design-system-blocks-visual-generation.md)
- [DEC-0055 — Segmentation cache cost is observed in production, not gated before launch](DEC-0055--cache-cost-observed-after-launch.md)
- [DEC-0056 — The design system is delivered and binding](DEC-0056--design-system-delivered.md)
- [DEC-0057 — Place-parameter pages are indexable with a parameter-free canonical](DEC-0057--place-parameter-pages-are-indexable.md)
- [DEC-0058 — Service contracts are pinned in the repository and refreshed by script](DEC-0058--service-contracts-pinned.md)
- [DEC-0059 — The home page's focus job is stable; entry context changes emphasis only](DEC-0059--home-focus-job-is-stable.md)
- [DEC-0060 — The licence is priced per organisation; tiers differ by where the calendar runs](DEC-0060--licence-is-per-organisation.md)
- [DEC-0061 — The map view is advertised with its date, not as existing](DEC-0061--map-announced-with-a-date.md)
- [DEC-0062 — The glossary becomes a hub package; Actor is outward, Organizer is internal](DEC-0062--glossary-is-a-hub-package.md)
- [DEC-0063 — Media echo uses the same clearance field as proof](DEC-0063--media-echo-clearance.md)
- [DEC-0064 — The permanence promise gets a proof element; the channels get enumerated](DEC-0064--evidence-for-the-publishing-page.md)
- [DEC-0065 — How the four hardest rules are verified — and where the coverage stops](DEC-0065--verification-of-the-hard-rules.md)
- [DEC-0066 — One register for the whole site — informal du, including the Verwaltung](DEC-0066--one-register-du-everywhere.md)
- [DEC-0067 — Six breakpoints, dense below the tablet — and why the spec's two were wrong](DEC-0067--six-breakpoints-dense-at-the-phone-end.md)
- [DEC-0068 — Every gap is filled with a marked placeholder, never left empty](DEC-0068--placeholders-over-empty-slots.md)
- [DEC-0069 — Answers from the PROPOSED review — price, accessibility, cache, budget, fallback, preview](DEC-0069--eleven-answers-from-the-proposed-review.md)
- [DEC-0070 — Eleven determinations confirmed — the price predicate, its accepted risk, and the low-stakes block](DEC-0070--the-confirmation-block.md)
- [DEC-0071 — The last four — reserved route, breadcrumbs everywhere, no geo in analytics, and one tone split in two](DEC-0071--the-last-four.md)
- [DEC-0072 — The foundation stack follows the sibling repositories, with three deliberate deviations](DEC-0072--the-foundation-stack.md)
- [DEC-0073 — The locale and URL layer: one typed table, no i18n library, and the 404 that actually renders](DEC-0073--locale-and-url-layer.md)
- [DEC-0074 — The content pipeline reads the shipped page artifacts — one file per page, typed blocks, no markdown library](DEC-0074--content-pipeline-reads-the-shipped-artifacts.md)
- [DEC-0075 — The last-good store is the Vercel Runtime Cache, behind one interface](DEC-0075--last-good-store-is-the-vercel-runtime-cache.md)
- [DEC-0076 — @axe-core/playwright is the a11y sweep instrument for TS-WEB-0002-A1 and TS-WEB-0029-A12](DEC-0076--axe-core-playwright-for-a11y-e2e.md)
- [DEC-0077 — Example imagery is model-generated, marked, and produced by a script — with `ai` and `sharp` as build-time tooling](DEC-0077--generated-imagery-pipeline.md)
- [DEC-0078 — A streamed boundary never carries a control that holds what a visitor types — the search field lives in the static shell](DEC-0078--the-search-field-lives-in-the-static-shell.md)
- [DEC-0079 — The place search asks for a place name; a postcode is not offered](DEC-0079--place-search-by-name.md)
- [DEC-0080 — The website carries its own copy guide, bound by a contract](DEC-0080--website-copy-guide-bound-by-a-contract.md)
- [DEC-0081 — The contact section replaces the contact form — one contact surface, and it hosts the booking](DEC-0081--contact-section-replaces-the-contact-form.md)
- [DEC-0082 — One primary conversion per page stands — and the ladder every other CTA sits on](DEC-0082--one-primary-per-page-and-the-cta-ladder.md)
- [DEC-0083 — A spec never carries the words — no verbatim copy, no fixed grammatical form](DEC-0083--no-verbatim-copy-in-a-spec.md)
- [DEC-0084 — The village argument, re-derived — 280 inhabitants, no salesperson clause, and the counter module goes](DEC-0084--the-village-argument-and-the-counter-that-goes.md)
- [DEC-0085 — STRICT is a versioned dependency, not a path — and the checker reads its vocabularies out of the package](DEC-0085--strict-is-a-versioned-dependency.md)
- [DEC-0086 — Identifiers and file names follow the STRICT scheme — `<TYPE>-<DOMAIN>-<NNNN>`, and a file is named for the artefact it holds](DEC-0086--identifiers-and-file-names-follow-strict.md)
- [DEC-0087 — The artefact shape follows STRICT — one requirement per document, the business-rule class, the slot grammar where meaning survives it, and DRAFT until a decision policy exists](DEC-0087--the-artefact-shape-follows-strict.md)
- [DEC-0088 — A decision policy binds this repository — graded by impact, agent at the lowest level inside four bounds, owner everywhere else](DEC-0088--decision-policy-graded-by-impact.md)
- [DEC-0089 — The policy applied — every artefact resolves to the owner, nothing moves off DRAFT, and the impact levels that decided it](DEC-0089--the-policy-applied-nothing-moves-off-draft.md)
- [DEC-0090 — The acceptance criteria keep their verification level — the deviation from the contract is deliberate, recorded, and raised upstream](DEC-0090--acceptance-criteria-keep-the-verification-level.md)
- [DEC-0091 — Provenance is on every record — the model and the hour come from the commit that wrote it, the prompt identity is UNKNOWN and says so](DEC-0091--provenance-on-every-record.md)
- [DEC-0092 — A quality requirement is a measure — the 37 split, measured or reclassified, and not one number invented](DEC-0092--the-quality-class-is-a-measure.md)
- [DEC-0093 — The compounds are split — one modal and one predicate per artefact, and the nine page rows are a shape the method has no form for](DEC-0093--the-compounds-split.md)
- [DEC-0094 — The four buried business rules are their own artefacts — and the one constraint filed as a functional requirement](DEC-0094--the-four-buried-business-rules.md)
- [DEC-0095 — The fit criterion is what already checks the requirement — and UNKNOWN where nothing does](DEC-0095--the-fit-criterion-is-what-already-checks-it.md)
- [DEC-0096 — The test-reference scan is what actually runs — read off the runners, not listed by hand](DEC-0096--the-scan-set-is-what-runs.md)
- [DEC-0097 — Every statement carries the position it rests on — 186 of 273 resolve to a line, and the 87 that cannot say why](DEC-0097--every-statement-carries-its-position.md)
- [DEC-0098 — A source's trust level is the minimum of its six-dimension vector — computed, and fifteen of eighteen were not](DEC-0098--the-trust-level-is-computed.md)
- [DEC-0099 — The conflict and demand registers exist, populated from what already happened — 22 conflicts and 57 demands, none invented](DEC-0099--the-conflict-and-demand-registers.md)
- [DEC-0100 — An ADR and a STRICT decision record are two artefacts — both are kept, and the SDR starts at the next executed decision point](DEC-0100--an-adr-and-an-sdr-are-two-artefacts.md)
- [DEC-0101 — The goal layer references the hub, it does not duplicate it — thirteen GOAL-WEB artefacts, no goal content copied](DEC-0101--the-goal-layer-references-the-hub.md)
- [DEC-0102 — The need layer is read off the sources, never reconstructed — thirty-four needs, every one with a verified line](DEC-0102--the-need-layer-is-read-off-the-sources.md)
- [DEC-0103 — The chain is wired and checked — 222 of 273 requirements answer to a need, and the 51 that do not say why](DEC-0103--the-chain-is-wired-and-checked.md)
- [DEC-0104 — The specification carries the truth — a source is cited, not obeyed, and every deviation from one is recorded](DEC-0104--the-specification-carries-the-truth.md)
- [DEC-0105 — The design layer's five undocumented decisions, recorded — and the scrim's ladder is fixed, not measured](DEC-0105--the-design-layer-decisions.md)
- [DEC-0106 — The product name is an open question again — the website names no product until it closes, and the workaround is still forbidden](DEC-0106--the-product-name-is-open-again.md)
- [DEC-0107 — A standard source publishes free; an individual integration into a system we do not already support is the paid add-on](DEC-0107--the-publishing-path-price-boundary.md)
- [DEC-0108 — The registration embed is isolated with a notice above it — a notice is not consent, the banner-free requirement stands, and the residual legal risk is accepted on one route](DEC-0108--the-registration-embed-is-isolated-with-a-notice.md)
- [DEC-0109 — On `/` only the WhatsApp scene becomes the explain module — the embed and provenance blocks stay scenes, and the module has to work in any of the three trait positions](DEC-0109--the-whatsapp-scene-becomes-the-explain-module.md)
- [DEC-0110 — The scene wraps the explain module — the opener above it, the concrete instance below it, and `/` keeps three scene blocks](DEC-0110--the-scene-wraps-the-explain-module.md)
- [DEC-0111 — The excerpt repairs the locator — a check reads every citation and says where a moved statement went](DEC-0111--the-excerpt-repairs-the-locator.md)
- [DEC-0112 — The method registry needs a credential — the build reads it from the environment, and the claim that it did not was false for nineteen deployments](DEC-0112--the-method-registry-needs-a-credential.md)
- [DEC-0113 — Hub contact values reach the site through a generated file — and the contact section's open choices, recorded](DEC-0113--hub-contact-values-through-a-generated-file.md)
- [DEC-0114 — The explain module's pass is a pure state machine — four ticks, a settled state and a heading state, "once" held in the component instance, and a click or a focus is an interaction while a touch-scroll is not](DEC-0114--the-explain-module-state-machine.md)
- [DEC-0115 — The stage graphics carry no sample of their own — the page passes real rows or a marked sample, the status sits on the event row, and a picture of a control is hidden from assistive technology](DEC-0115--the-stage-graphics-carry-no-sample-of-their-own.md)
- [DEC-0116 — The scrim is composed from the ladder and the header blurs — the choices the photo-surface rewrite had to take, and where the blur's budget condition lives](DEC-0116--the-scrim-is-composed-and-the-header-blurs.md)
- [DEC-0117 — The archive ground is its own colour family, the closing search block is the one further ink section, and the objection block's failures are neutral](DEC-0117--the-archive-ground-is-its-own-family.md)
- [DEC-0118 — The price section is one paper section with a lime band and three rows — the row renders its one CTA itself, the setting row takes its shape from the drafts, and "wird geprüft" is the placeholder badge](DEC-0118--the-price-section-set.md)
- [DEC-0119 — The search takes a name and the overlay shows four rows — the postcode mode leaves the search surfaces, `?zip=` stays for the order flow, and the geolocation control resolves through one `no-store` BFF route](DEC-0119--the-search-takes-a-name-and-the-overlay-shows-four-rows.md)
- [DEC-0120 — The band is a menu with a blurb — the page's slot supplies it, the registry stands in, and the language switch offers only the other language](DEC-0120--the-band-is-a-menu-with-a-blurb.md)
- [DEC-0121 — The fifth origin is the form's host, in `frame-src` alone — `/start` frames it with `?embedded=true`, and the notice above it is a placeholder until the owner words it](DEC-0121--the-fifth-origin-is-the-form-host.md)
- [DEC-0122 — The contact section is chrome and the newsletter waits — the layout mounts the one contact surface on every page, the footer form and its envoy kind are gone, and the newsletter block renders nowhere until a sending system is named](DEC-0122--the-contact-section-is-chrome-and-the-newsletter-waits.md)
- [DEC-0124 — The paths slot is one slot on three grounds — the objection block splits too, the proof slot comes back, and the step lines ship as marked placeholders](DEC-0124--the-paths-slot-is-one-slot-on-three-grounds.md)
- [DEC-0128 — The registration step resolves a name — the `isZip` gate goes, a municipality hit asks which village, the step-1 submit is the page's one primary, and the typed string cannot be canonicalised in the page](DEC-0128--the-registration-step-resolves-a-name.md)
- [DEC-0133 — The booking CTA resolves in-page and the marking leaves the label — `<route>#kontakt` through the route facade, the scope rides along in the order flow, and the disclosure becomes a described `meta` span for every variant](DEC-0133--the-booking-cta-resolves-in-page.md)
