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

`<area>.tactical.md` with frontmatter: `id` (TS-###), `profile`
(system · rule · interaction · procedure), `implements` (WEB-* IDs),
`sources`, `decisions`. Sections: Purpose · Determinations ·
Free for the generator · Acceptance criteria · Coverage · Open points.

**The unit of a tactical spec is one coherent solution — one buildable
system, one testable rule set, one page — not one requirement.**
Requirements and solutions map N:M; the `implements:` list claims
coverage, and the mandatory **Coverage** section proves it by mapping
every implemented requirement to the determinations and acceptance
criteria that discharge it. A requirement no tactical spec covers is
visible in the RTM; a requirement listed but not discharged is a defect
of the spec.

## Contents

| ID | File | Profile | Implements |
| --- | --- | --- | --- |
| TS-001 | `locale-routing.tactical.md` | system | WEB-F-060–069 |
| TS-002 | `accessibility.tactical.md` | rule | WEB-Q-010–019, 026–027 |
| TS-003 | `performance.tactical.md` | rule | WEB-Q-001–008, WEB-F-105 |
| TS-004 | `url-and-routing.tactical.md` | system | routes, navigation, BFF, error pages |
| TS-005 | `relevance-engine.tactical.md` | system | proof/live scoring, ordering, segmentation |
| TS-006 | `page-composition.tactical.md` | rule | what holds on every page: focus job, context band, closing CTA |
| TS-007 | `content-pipeline.tactical.md` | system | packages in, per-locale markdown out, schema and provenance |
| TS-008 | `live-data.tactical.md` | system | live modules, widening chain, place search, app handover |
| TS-009 | `rendering-and-resilience.tactical.md` | system | static shell, cached islands, three-tier fallback |
| TS-010 | `personalization.tactical.md` | system | stages 0–3, geolocation, entry context |
| TS-011 | `seo.tactical.md` | rule | redirects, semantics, structured data, landing pages |
| TS-012 | `analytics.tactical.md` | system | cookieless measurement, event registry, attribution |
| TS-013 | `privacy.tactical.md` | rule | the closed client-request set and the rule for additions |
| TS-014 | `security.tactical.md` | rule | CSP, headers, dependency scanning, form abuse |
| TS-015 | `delivery-pipeline.tactical.md` | procedure | preview domains, merge gates, rolling promotion |
| TS-016 | `forms-and-leads.tactical.md` | interaction | envoy widget, briefing, order flow, newsletter |
| TS-017 | `technical-foundation.tactical.md` | rule | stack, mobile-first, brand kit, app boundary |
| TS-018 | `scope-boundaries.tactical.md` | rule | what the website is not — gate, guard, review |

## Page specs

One per page, thin: which modules in which order, what data each needs,
and acceptance criteria a QA walker can follow. They bind the system specs
above rather than restating them.

| ID | File | Route |
| --- | --- | --- |
| TS-019 | `pages/home.tactical.md` | `/` |
| TS-020 | `pages/dein-ort.tactical.md` | `/dein-ort` |
| TS-021 | `pages/dein-ort-starten.tactical.md` | `/dein-ort/starten` |
| TS-022 | `pages/mitmachen.tactical.md` | `/mitmachen` |
| TS-023 | `pages/registrieren.tactical.md` | `/mitmachen/registrieren` |
| TS-024 | `pages/dein-kalender.tactical.md` | `/dein-kalender` |
| TS-025 | `pages/bestellen.tactical.md` | `/dein-kalender/bestellen` |
| TS-026 | `pages/deine-region.tactical.md` | `/deine-region` |
| TS-027 | `pages/ueber-uns.tactical.md` | `/ueber-uns` |
| TS-028 | `pages/archiv.tactical.md` | `/ueber-uns/archiv` |
| TS-029 | `pages/rechtliches.tactical.md` | `/rechtliches` |
