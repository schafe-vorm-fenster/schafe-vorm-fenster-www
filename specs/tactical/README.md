# Tactical Specifications

## Purpose

The layer below the requirement shells: one tactical spec per system,
rule set, or page consolidates every requirement that touches it and
resolves it into buildable, verifiable detail. **These are the
generation prompts** — the one-shot website generation reads this layer.

## Provenance tags

Every determination carries one of three tags:

- **[FIXED]** — derivable from a source or decision; binding.
- **[PROPOSED]** — set by this spec because the sources are silent;
  binding once confirmed, until then a proposal awaiting its decision
  point.
- **[FREE]** — explicitly left to the generator. An unmarked gap is a
  defect, not freedom.

## Format

`TS-WEB-####--<area>.tactical.md` — the file is named for the artefact it
holds (DEC-0086) — with frontmatter: `id` (TS-WEB-####), `kind`
(system · procedure · interaction · rule), `implements`
((FUN|NFR|CON)-WEB-#### IDs), `sources`, `decisions`. Sections: Purpose · Determinations ·
Free for the generator · Acceptance criteria · Coverage · Open points.

`kind` carries the four values of the tactical-specification contract in
`@leafcutter-strict/library-schemas`; `pnpm check:specs` reads that set out
of the installed package rather than repeating it. The field was called
`profile` until DEC-0085 — the word was already spent three times over in
this repository (weight profile, tone profile, the `person-profile`
component), so taking the package's name removed a collision as well as a
divergence.

**The unit of a tactical spec is one coherent solution — one buildable
system, one testable rule set, one page — not one requirement.**
Requirements and solutions map N:M; the `implements:` list claims
coverage, and the mandatory **Coverage** section proves it by mapping
every implemented requirement to the determinations and acceptance
criteria that discharge it. A requirement no tactical spec covers is
visible in the RTM; a requirement listed but not discharged is a defect
of the spec.

## Contents

| ID | File | Kind | Implements |
| --- | --- | --- | --- |
| TS-WEB-0001 | `TS-WEB-0001--locale-routing.tactical.md` | system | FUN-WEB-0060–0068 |
| TS-WEB-0002 | `TS-WEB-0002--accessibility.tactical.md` | rule | WCAG 2.2 AA, the eight AAA adoptions, contrast, keyboard and screen reader |
| TS-WEB-0003 | `TS-WEB-0003--performance.tactical.md` | rule | Lighthouse, Core Web Vitals, byte budgets, loading rules, cache lifetimes |
| TS-WEB-0004 | `TS-WEB-0004--url-and-routing.tactical.md` | system | routes, navigation, BFF, error pages |
| TS-WEB-0005 | `TS-WEB-0005--relevance-engine.tactical.md` | system | proof/live scoring, ordering, segmentation |
| TS-WEB-0006 | `TS-WEB-0006--page-composition.tactical.md` | rule | what holds on every page: focus job, context band, closing CTA |
| TS-WEB-0007 | `TS-WEB-0007--content-pipeline.tactical.md` | system | packages in, per-locale markdown out, schema and provenance |
| TS-WEB-0008 | `TS-WEB-0008--live-data.tactical.md` | system | live modules, widening chain, place search, app handover |
| TS-WEB-0009 | `TS-WEB-0009--rendering-and-resilience.tactical.md` | system | static shell, cached islands, three-tier fallback |
| TS-WEB-0010 | `TS-WEB-0010--personalization.tactical.md` | system | stages 0–3, geolocation, entry context |
| TS-WEB-0011 | `TS-WEB-0011--seo.tactical.md` | rule | redirects, semantics, structured data, landing pages |
| TS-WEB-0012 | `TS-WEB-0012--analytics.tactical.md` | system | cookieless measurement, event registry, attribution |
| TS-WEB-0013 | `TS-WEB-0013--privacy.tactical.md` | rule | the closed client-request set and the rule for additions |
| TS-WEB-0014 | `TS-WEB-0014--security.tactical.md` | rule | CSP, headers, dependency scanning, form abuse |
| TS-WEB-0015 | `TS-WEB-0015--delivery-pipeline.tactical.md` | procedure | preview domains, merge gates, rolling promotion |
| TS-WEB-0016 | `TS-WEB-0016--forms-and-leads.tactical.md` | interaction | envoy widget, briefing, order flow, newsletter |
| TS-WEB-0017 | `TS-WEB-0017--technical-foundation.tactical.md` | rule | stack, mobile-first, brand kit, app boundary |
| TS-WEB-0018 | `TS-WEB-0018--scope-boundaries.tactical.md` | rule | what the website is not — gate, guard, review |

## Page specs

One per page, thin: which modules in which order, what data each needs,
and acceptance criteria a QA walker can follow. They bind the system specs
above rather than restating them.

| ID | File | Route |
| --- | --- | --- |
| TS-WEB-0019 | `pages/TS-WEB-0019--home.tactical.md` | `/` |
| TS-WEB-0020 | `pages/TS-WEB-0020--dein-ort.tactical.md` | `/dein-ort` |
| TS-WEB-0021 | `pages/TS-WEB-0021--dein-ort-starten.tactical.md` | `/dein-ort/starten` |
| TS-WEB-0022 | `pages/TS-WEB-0022--mitmachen.tactical.md` | `/mitmachen` |
| TS-WEB-0023 | `pages/TS-WEB-0023--registrieren.tactical.md` | `/mitmachen/registrieren` |
| TS-WEB-0024 | `pages/TS-WEB-0024--dein-kalender.tactical.md` | `/dein-kalender` |
| TS-WEB-0025 | `pages/TS-WEB-0025--bestellen.tactical.md` | `/dein-kalender/bestellen` |
| TS-WEB-0026 | `pages/TS-WEB-0026--deine-region.tactical.md` | `/deine-region` |
| TS-WEB-0027 | `pages/TS-WEB-0027--ueber-uns.tactical.md` | `/ueber-uns` |
| TS-WEB-0028 | `pages/TS-WEB-0028--archiv.tactical.md` | `/ueber-uns/archiv` |
| TS-WEB-0029 | `pages/TS-WEB-0029--rechtliches.tactical.md` | `/rechtliches` |
