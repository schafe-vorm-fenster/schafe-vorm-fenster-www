---
artefact: tactical-spec
id: TS-018
profile: rule
status: DRAFT
implements: [WEB-C-010, WEB-C-011, WEB-C-012, WEB-C-013, WEB-C-014, WEB-C-015, WEB-C-016]
sources: [SRC-001, SRC-003, SRC-009]
decisions: [DEC-020, DEC-022, DEC-036, DEC-040]
---

# TS-018 — Scope Boundaries

## Purpose

What the website is **not**, turned into something a build can fail on.

These seven requirements are negative. "The website does not explain
features" has no passing test the way a redirect has: nothing is emitted,
so nothing can be asserted. This spec therefore does three different
things, and says for every boundary which of the three carries it:

| Class | What it is | Failure mode |
| --- | --- | --- |
| **gate** | a check over data that already exists — hub package fields, content frontmatter, the route table. Deterministic, no judgement. | build fails, no exceptions |
| **guard** | a check over rendered output that catches an escape — a figure, a name, a term that slipped past the gate. Detects the symptom, not the intent. | build fails; false positives resolved by an allow-list entry that must carry a reason |
| **review** | a named human moment with a named question. Everything the machine cannot decide. | reviewer says no; the brief or the PR does not proceed |

The hub documents are referenced, never copied: the boundaries themselves
are SRC-001 "Boundaries", the proof and live-data rules behind WEB-C-016
are SRC-001 §4 and §5, the navigation rule behind WEB-C-014 is SRC-003
"Navigation", and the offering→surface map is TS-004 D7.

## Determinations

### D1 — Boundary register [FIXED: SRC-001#boundaries, SRC-003#navigation]

One row per boundary; the class column is the honest answer to "can this
be caught".

| Req | Boundary | Carried by | Class |
| --- | --- | --- | --- |
| WEB-C-010 | no feature explanation; help lives in the app | D6, D10 | gate (input set, content types) + review (the positive half) |
| WEB-C-011 | prices only for promoted offerings | D2, D3 | gate + guard |
| WEB-C-012 | municipalities and institutions are not separated | D7 | gate (narrow) + review |
| WEB-C-013 | the AI-coaching track does not appear | D4 | gate + guard |
| WEB-C-014 | the product name is never a navigation label | D5 | gate |
| WEB-C-015 | local advertising: at most one sentence while withheld | D8 | gate |
| WEB-C-016 | no claim without cleared proof or live data | D9, D10 | gate (the reference) + review (what counts as a claim) |

Only WEB-C-014 is fully machine-decidable. WEB-C-010 and WEB-C-016 are
mostly editorial; D10 states where the machine stops and who owns the
rest.

### D2 — Offering eligibility gate [FIXED: WEB-C-011, `promotion` field in `@schafe-vorm-fenster/model-offerings`]

Every website content file lists the hub offering ids it touches
(`offerings: []`, WEB-F-085 — ids are referenced, never redefined). Each
id must resolve in the pinned offering package; an unresolvable id is a
build failure. The package's `promotion` field then decides what the
surface may do:

| `promotion` | own page | mention | CTA / conversion goal | price |
| --- | --- | --- | --- | --- |
| `promoted` | yes, per TS-004 D7 | yes | yes | only if `price_status: fixed` (D3) |
| `on-request-only` | no | yes, on the surface TS-004 D7 names | quote/briefing only | never |
| `withheld` | no | only under the D8 budget | never | never |

The offering→surface map is TS-004 D7 and is not repeated here; this
determination is the predicate that map has to satisfy. Offerings never
define routes (WEB-F-002, DEC-036).

### D3 — Publishable price predicate [PROPOSED]

```
publishablePrice(o) = o.promotion === 'promoted' && o.price_status === 'fixed'
```

`promotion` alone is **not** sufficient, and the requirement text does not
say so. Against the package as shipped (`model-offerings` index):

| Offering | promotion | price_status | amount | publishable |
| --- | --- | --- | --- | --- |
| `community-calendar` | promoted | fixed | 0 (free) | yes |
| `portalize-calendar` | promoted | fixed | 480 | yes |
| `portalize-enterprise` | promoted | on-request | 4000 | **no** — "auf Anfrage" |
| `custom-data-integration` | on-request-only | on-request | 0 | no |
| `local-advertising` | withheld | on-request | 0 | no |
| `portalize-website-widget` | withheld | indicative | 5 | no |

Two consequences:

1. **Prices are never literals in copy.** A price is rendered by one
   component reading the offering package; the component refuses any id
   for which `publishablePrice` is false. Copy that types "480 €" by hand
   is a defect even when the figure is right.
2. **The figures 4000 and 5 ship inside the build.** They are frontmatter
   of packages the site installs, so a template mistake can print them.
   The guard is over the built output: every currency token
   (`\d[\d.,]*\s*(€|EUR)`) in rendered HTML must resolve to a
   `publishablePrice` amount or to an allow-listed non-price figure.

### D4 — Foreign-brand exclusion [FIXED for ids: hub `brand:` field; deny-list PROPOSED]

Hub entities carry `brand:`. The rule is one line: **no entity whose
`brand` is not `schafe-vorm-fenster` may be referenced by any website
content file, route, navigation entry, or sitemap URL.** That covers
`offerings/` and `goals/` (both carry the field), which is where the
AI-coaching track lives (`brand: own-the-logic`).

`packages/market/audiences/` carries **no** `brand` field, so the
`tech-leaders` audience is not machine-separable from the hub data. Until
the hub adds the field (open point), the deny-list is a hand-maintained
constant in this repository:

| Kind | Denied ids |
| --- | --- |
| offerings | `agent-os-workshop-coaching`, `ai-coaching-planning-review-supervision`, `ai-software-engineering-bootcamp`, `ki-artefakt-governance-workshop` |
| business goals | `ai-coaching-lead-pipeline`, `ai-coaching-revenue-target-2026` |
| conversion goals | `linkedin-personal-awareness`, `linkedin-company-trust`, `direct-contact-qualified-leads`, `workshop-signup-or-trial` |
| audiences | `tech-leaders` |

The constant is derived, not invented: it is the set of hub ids with
`brand: own-the-logic` plus the one audience that has no brand field. A
check regenerates it from the installed packages and fails when the
derived set and the constant disagree — so a new coaching offering in the
hub breaks the build instead of leaking.

Guard over rendered text, for material that arrives as prose rather than
as an id: the brand name and the offering names of that track
("Own the Logic", "own-the-logic", "Agent OS", "KI-Artefakt-Governance",
"AI Software Engineering Bootcamp"). Deliberately narrow — generic words
("Coaching", "Workshop") are not denied, because they occur legitimately.

### D5 — Product names never reach a route or a label [FIXED: WEB-C-014, WEB-F-002, DEC-036]

Denied surfaces, exhaustively:

| Surface | Source of truth | Rule |
| --- | --- | --- |
| public path segments, all languages | route translation map, TS-004 D3a | no segment matches the product-name list |
| header, footer, context band labels | nav registry, TS-004 D4 | no label matches |
| internal link text | route facade, TS-001 D5 | no link text matches |

Product-name list: `Portalize` and every `name` value of a
`brand: schafe-vorm-fenster` offering in the package
("Portalize Calendar", "Portalize Enterprise", "Portalize Website
Widget"), matched case-insensitively. `Dorfkalender` is **not** on the
list — it is the German marketing word for `community-calendar` and
belongs in copy.

**Exempt, because they are not labels:** the Portalize loader script
origin (DEC-030, WEB-F-043), CSP allowlist entries (TS-003 D4), API URLs
and `data-*` attributes. The boundary is about what a visitor reads as a
name for a destination, not about hostnames.

**Where the name may appear:** the body of `/dein-kalender`, at most
once, at the 480 € tier — the proposal in Q-012, unresolved. Until
Q-012 resolves, the gate enforces the ceiling (≤ 1 occurrence, that one
route only); it does not enforce a floor, so a page without the name also
passes.

### D6 — No feature explanation; help lives in the app [FIXED: SRC-001#boundaries; mechanism PROPOSED]

The gate is about **input sets and content types**, not about sentences.

1. **Two archives are not build input.** `content/support/` (37 support
   articles) and `legacy-content/app/funktionen/` (the ten feature
   articles) are archive per the project rules. No website content file
   may name them in `derived_from`, no route may render them, and the
   content build's input globs must not reach them. Looking something up
   in them stays allowed; deriving website copy from them does not.
2. **No help content type exists.** The website content schema
   (WEB-F-089) has no `support`/FAQ/how-to member. A content type that
   cannot be declared cannot be routed.
3. **No help route.** The route inventory is closed (TS-004 D1); a help
   or FAQ path is not in it, so adding one is visible as a route-table
   diff, not as a content change.
4. **Instructions are a handover, not a page.** Where the visitor needs
   to be told how something works, the website hands over to the app
   (`/mitmachen/registrieren`, TS-004 D1). The app help URL is not yet
   registered anywhere — open point.

What is *not* caught: a page brief that answers "how does the WhatsApp
import work" in four explanatory paragraphs on `/mitmachen` violates
WEB-C-010 and passes every check above. The scene rule (WEB-F-008: one
mechanism, no feature list) is the operative test and it is a human
judgement — D10, review moment 1.

### D7 — One job, never an audience split [FIXED: SRC-001#boundaries, SRC-001#1]

Audiences are a priority list inside a page brief. They are never a
surface: no route, no navigation label, no content id, no slug is keyed
to an audience. The `run our own calendar` job is served by three
surfaces — `/dein-kalender`, `/dein-kalender/bestellen`, `/deine-region`
— separated by **offering scale** (per TS-004 D7), not by who the buyer
is; municipalities and institutions meet the same argument on the same
page (IA page brief "Run our own calendar", audiences 1 and 2 of one
list).

Gate, narrow but real:

| Check | Data |
| --- | --- |
| no path segment, nav label, or content id from the audience vocabulary | `packages/market/audiences/` ids: `municipalities`, `institutions`, `counties`, `companies`, `actors`, `rural-residents`, `tech-leaders` |
| every page brief declares exactly one `focus_job` from the four | SRC-001 §1 |
| no two page briefs with the same `focus_job` split `municipalities` and `institutions` into one each | page-brief frontmatter `audiences: []` |

The third check catches the concrete failure this boundary was written
against — a second "for institutions" page beside the municipal one. It
does not catch a single page that argues differently in two blocks for
the two groups; that is review moment 1.

### D8 — The withheld-mention budget [FIXED: WEB-C-015; size PROPOSED, Q-006]

While `local-advertising` is `promotion: withheld`:

| Rule | Check |
| --- | --- |
| at most one content file references `local-advertising` | count over `offerings: []` |
| it is bound to `/dein-kalender` | that file's route binding |
| the mention lives in one dedicated frontmatter field, `withheld_mention` | schema |
| the field is one sentence: exactly one terminal punctuation mark, ≤ 160 characters | string check |
| it contains no link, no price token, no CTA | pattern check |
| `request-ad-placement` appears in no CTA registry, no form target, no conversion mapping | registry scan |
| no route exists for companies | TS-004 D1 is closed |

The budget is a single constant. If Q-006 resolves to "nothing", the
constant goes to zero, the field leaves the schema, and the same check
enforces the stricter answer with no rewrite.

### D9 — Claim discipline: proof or live, or the claim is weakened [FIXED: SRC-001#4, SRC-001#5, WEB-F-036, WEB-F-041]

WEB-C-016 is an umbrella rule; the mechanics it binds live elsewhere and
are referenced: the cleared-proof hard filter and the scoring are TS-005
(WEB-F-033), the live modules and their empty states are the live-data
requirements, the three-tier fallback with its counter exception is
DEC-019/WEB-F-104.

What this spec adds is the **reference obligation** — the hook a check
can hang on:

1. Every content file carries `claims: []`. Each entry names either
   `proof:` (an id resolving in the hub proof / verified media-echo set)
   or `live:` (a module id from the BFF inventory, TS-004 D5).
2. An entry with neither, an unresolvable id, or a proof whose
   `usage_rights` is not `cleared` fails the build. Absent proof is not
   an error in itself — the empty slot with a weakened claim is the
   prescribed outcome (SRC-001 §4); what fails is a *claim entry* that
   points at nothing.
3. Traction figures are never literals. A counter renders from a live
   response or is absent (WEB-F-041; tier 2 with timestamp permitted,
   tier 3 hides — WEB-F-104).
4. Guard over rendered output: quantity tokens not emitted by a live
   module (`\d{2,}\s*\+?` adjacent to a countable noun) require an
   allow-list entry with a reason. This guard is weak — it catches
   "800+ Orte" and misses "in fast jedem Dorf der Region". It is worth
   having and is not a proof of compliance.

**What no check decides:** whether a given sentence is a claim at all.
That is the boundary's real content and it belongs to review moments 1
and 2.

### D10 — Where enforcement stops [FIXED: DEC-040 level `manual`; moments PROPOSED]

| Boundary | Machine catches | Machine cannot catch | Owned by |
| --- | --- | --- | --- |
| WEB-C-010 | forbidden input sets, help content types, help routes | explanatory prose inside a permitted page | moment 1, moment 2 |
| WEB-C-011 | ineligible ids, non-publishable price figures | a price described in words ("unter 500 Euro") | moment 2 |
| WEB-C-012 | audience-keyed surfaces, a split across briefs | two audience-specific arguments inside one page | moment 1 |
| WEB-C-013 | denied ids and brand terms | a coaching argument written in fresh words | moment 2, moment 3 |
| WEB-C-014 | every label and path surface | — (fully gated) | — |
| WEB-C-015 | count, binding, sentence shape | whether the sentence promises something | moment 2 |
| WEB-C-016 | claim entries that point at nothing | which sentences are claims | moment 1, moment 2 |

Three named moments, each with the same four questions:

| # | Moment | When | Artefact |
| --- | --- | --- | --- |
| 1 | **Page-brief review** | before content is generated for a page | the page brief; the eight-point check of SRC-001 "Compliance Check for a Page Brief" plus the four questions below, recorded on the brief |
| 2 | **Content PR review** | every content pull request, including the automated ones of WEB-F-084 | the diff; a "yes" to any question blocks the merge |
| 3 | **Release checklist** | per release, DEC-040 level `manual` | rendered `de` and `en` pages; plus a re-read of the guard allow-lists for entries that no longer have a reason |

The four boundary questions:

1. Does any block explain how a feature works, instead of showing one
   mechanism (WEB-F-008)?
2. Does any sentence claim something that no proof slot or live module
   backs?
3. Does the page address a segment rather than a job?
4. Does a product name or a foreign-brand term appear where a visitor
   reads it as a label?

## Free for the generator

- [FREE] The wording of the single withheld sentence within D8's budget.
- [FREE] Where inside the `/dein-kalender` body the product name is
  introduced once Q-012 resolves — D5 fixes the surface and the ceiling,
  not the paragraph.
- [FREE] Check implementation: one `scripts/check-boundaries.ts` or
  several, ESLint rule or script, as long as every gate and guard runs in
  `pnpm check` and in CI, and names the AC id it satisfies (DEC-040).
- [FREE] Allow-list file format for guard exceptions; each entry carries a
  reason string, which is what moment 3 re-reads.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-018-A1 | static | Every id in a content file's `offerings: []` resolves in the pinned offering package, and its `promotion` permits the surface it is used on per D2; an unresolvable id or a `withheld` id outside D8's single file fails the build. |
| TS-018-A2 | unit | `publishablePrice` over the shipped package index: true for `community-calendar` and `portalize-calendar`, false for `portalize-enterprise`, `custom-data-integration`, `local-advertising`, `portalize-website-widget`. |
| TS-018-A3 | static | Price guard: every currency token in the built HTML resolves to a `publishablePrice` amount or to a reasoned allow-list entry; `4000`/`4.000 €` and `5 €` in any price position fail. |
| TS-018-A4 | static | No id from the D4 deny-list, and no hub id whose `brand` is not `schafe-vorm-fenster`, appears in any content frontmatter, the route table, the nav registry, or a sitemap URL; the deny-list regenerated from the installed packages equals the committed constant. |
| TS-018-A5 | static | Foreign-brand term guard over the built HTML finds no D4 term; every allow-list entry carries a reason. |
| TS-018-A6 | static | No entry of the route translation map (any language) and no label in the header, footer, or context-band registry matches the D5 product-name list. |
| TS-018-A7 | integration | Header, footer, and context band of every TS-004 D1 route render without a product name in `de` and `en`; `/dein-kalender` is the only route whose body may contain one, at most once. |
| TS-018-A8 | static | Content build input excludes `content/support/**` and `legacy-content/app/funktionen/**`; no content file's `derived_from` points into them; the content schema declares no help/FAQ/how-to type; the route inventory contains no help path. |
| TS-018-A9 | static | No path segment, nav label, or content id equals an audience id; every page brief declares exactly one of the four focus jobs; no two briefs with the same focus job split `municipalities` and `institutions`. |
| TS-018-A10 | static | At most one content file references `local-advertising`, bound to `/dein-kalender`, with a `withheld_mention` of one sentence ≤ 160 characters containing no link, price token, or CTA; `request-ad-placement` appears in no CTA registry or form target. |
| TS-018-A11 | static | Every `claims[]` entry names a resolvable `proof:` with `usage_rights: cleared` or a `live:` module id from the TS-004 D5 inventory; anything else fails the build. |
| TS-018-A12 | integration | With the stats upstream stubbed empty, counter modules are absent from the rendered page and no figure stands in their place (WEB-F-041, WEB-F-104). |
| TS-018-A13 | e2e | Every internal link resolves inside the TS-004 D1 inventory; every help or instruction affordance targets the app host, not a website route. |
| TS-018-A14 | manual | Moment 1 (page-brief review): the SRC-001 eight-point check plus the four boundary questions are answered and recorded on the brief before content generation starts. |
| TS-018-A15 | manual | Moment 2 (content PR review): the four boundary questions are answered for the diff; a "yes" to any of them blocks the merge. |
| TS-018-A16 | manual | Moment 3 (release checklist): rendered `de` and `en` spot check for label and foreign-brand leakage, and a re-read of every guard allow-list entry for a reason that still holds. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| WEB-C-010 (no feature explanation; help in the app) | D6, D10 · A8, A13, A14, A15 |
| WEB-C-011 (prices only for promoted offerings) | D2, D3 · A1, A2, A3 |
| WEB-C-012 (no municipality/institution split) | D7, D10 · A9, A14 |
| WEB-C-013 (AI-coaching track absent) | D4, D10 · A4, A5, A16 |
| WEB-C-014 (product name never a navigation label) | D5 · A6, A7 |
| WEB-C-015 (local advertising: one sentence while withheld) | D2, D8 · A10, A15 |
| WEB-C-016 (no claim without cleared proof or live data) | D9, D10 · A11, A12, A14, A15 |

## Open points

- **Q-012** (where "Portalize" is introduced on the page) blocks the
  permissive half of D5. The gate enforces the ceiling today; the floor —
  whether the name must appear once — waits on the answer.
- **Q-006** (one sentence or nothing for local advertising) sets D8's
  constant. Both answers are enforced by the same check.
- **Not yet in the question register: where does help live?** WEB-C-010
  says "in the app", but no app help URL is registered in any spec, and
  `content/support/README.md` records the source of truth for the 37
  support articles as open. A13 cannot name a target until it is decided.
  Proposed question: *"Which surface serves the support articles after
  the relaunch — app help, a product-doc site, or nowhere — and what is
  its URL?"*
- **Not yet in the question register: `brand:` on hub audiences.**
  `packages/market/audiences/` carries no `brand` field, so `tech-leaders`
  is separable only by a hand-maintained constant (D4). Proposed demand to
  the hub: *"Add `brand:` to `packages/market/audiences/` (and to
  `goals/business-goals/` where absent) so brand exclusion is derivable
  rather than listed."*
- **Frontmatter field names are provisional.** `offerings`, `claims`,
  `withheld_mention`, `derived_from`, `focus_job` are named here because
  the checks need a hook. `content-pipeline.tactical.md` did not exist
  when this was written; when it lands, its names and the Zod schemas of
  WEB-F-089 win and these checks re-target. The obligation — that content
  references hub ids machine-readably (WEB-F-085) — is not provisional.
- **Package-level price stripping.** D3 relies on an output guard because
  the non-publishable figures (4000, 5) ship inside the installed package.
  Open whether the content layer should strip non-publishable prices at
  package-read time, which would make the guard a second line rather than
  the only one.
- **Honest limits.** WEB-C-010's positive half (is this prose an
  explanation?) and WEB-C-016's core (is this sentence a claim?) are not
  machine-decidable and rest on moments 1 and 2. If those moments are not
  actually held, both boundaries are unenforced regardless of what the
  build reports.
- D3, D4 deny-list, D6 mechanism, D8 size, D9 guard, and D10 moments are
  [PROPOSED].
