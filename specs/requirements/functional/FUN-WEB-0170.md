---
artefact: requirement
id: FUN-WEB-0170
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.2.0
area: seo
needs: [NEED-WEB-0006]
source:
  source_id: DEC-0018
  loc: "specs/decisions/DEC-0018--allow-ai-crawlers-llms-txt.md#L12"
  excerpt: "an `llms.txt` carrying the short description and core facts"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0170 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0004-A5 and TS-WEB-0004-A13 — 2 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5.5"
  generated_at: "2026-11-12T19:15:00+01:00"
---

# FUN-WEB-0170

At `/llms.txt`, the website SHALL maintain a short description and its core facts.

## Source

DEC-0018. Issue #202 (owner, 2026-11-12) names the facts and the shape; this
version makes both precise. No new decision record: the shape is the
llmstxt.org format DEC-0018 already chose by naming the file.

## What "core facts" means

Twelve facts, in this order, each one line `Label: value` between the `>`
summary and the first `##` heading. Each is either **derived** — read from the
module the pages read, so `/llms.txt` cannot contradict a page — or
**sourced** — a fact of a hub record, worded for this file, inside the
record's own limits. Nothing else is stated.

| # | Fact | Derived from / sourced in |
| --- | --- | --- |
| 1 | what the Dorfkalender is, readable without login or app | `@schafe-vorm-fenster/offerings#community-calendar` (summary, "What It Is", "Commercial Model") |
| 2 | for whom | `#community-calendar`, `#portalize-calendar`, `#portalize-enterprise` `audience_fit`; `@schafe-vorm-fenster/messaging` positioning, slot 1 |
| 3 | how dates come in: Google Kalender, flyer photo by WhatsApp or e-mail, website import | `#community-calendar`, "For publishers" |
| 4–6 | the three tiers with their prices: Dorfkalender 0 €, own calendar 480 € / Jahr zzgl. USt., Regionalkalender auf Anfrage | derived: `src/lib/pricing/offerings.ts` (`tierPrice`, `publishedFigure`) and `dictionary().price`, the sources of the `/dein-kalender` tier rows; scope sentence from each offering's `summary`. The enterprise figure is never read (TS-WEB-0026-A4) |
| 7 | region: four Länder | `@schafe-vorm-fenster/proof#regional-footprint` (cleared) |
| 8 | in operation since 2018 | `proof#in-operation-since-2018` (cleared; "ununterbrochen" is outside its limit) |
| 9 | provider, seat, founder | derived: `content/legal/imprint.md` via `organizationIdentitySync()`; founder from `@schafe-vorm-fenster/people#jan-henrik-hempel` and the imprint; former mayor from `proof#founder-former-volunteer-mayor` (no end year: the record leaves it open) |
| 10 | award: NØRD Award 2026, Smart Community | `proof#noerd-award-2026-smart-community` (cleared) |
| 11 | contact: e-mail, phone, WhatsApp, video appointment | derived: `src/generated/contact-channels.json` (from `@schafe-vorm-fenster/goals#contact-channels.md`) and `BRIEFING_URL` |
| 12 | languages DE (main) and EN; legal texts German only | derived: `LOCALES`; the English legal page's own note (DEC-0027) |

The summary line reads off `#community-calendar` `summary` and carries
DEC-0018's search phrase "Veranstaltungskalender".

## The rest of the file

- **Page lines** are `- [title](url): description`, where title and
  description are the page's own `<title>` and meta description (TS-WEB-0011 D5).
  Derived, not authored: a page without a description is listed without one,
  never with a stand-in.
- **German is the main language**; English follows as its own section. On a
  domain whose TLD default is English, English leads.
- **`## Optional`** comes last: press archive, legal, community-site's help
  (`COMMUNITY_HELP_URL`, the `/hilfe` redirect's own target), sitemap and
  robots. `/llms.txt` does not list itself.
- **Landing-only domains** list only what they serve (`/` and the legal route,
  both languages, in one section) and no help link; the summary stays, the
  facts block does not. Owner decision 2026-11-12: the side domains (`.at`,
  `.pl`, `sheepoutside.com`) do not go online for now and are considered
  separately later, so their `llms.txt` stays as lean as before #202.
- No product name (CON-WEB-0058) and no competitor (TS-WEB-0011-A11, Q-0009).

`TS-WEB-0004-A13` is the criterion; `src/lib/routes/llms-txt.test.ts` reads the
hub packages at test time, so a record that changes fails the suite before
`/llms.txt` says something the hub no longer does.
