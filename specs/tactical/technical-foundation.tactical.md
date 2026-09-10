---
artefact: tactical-spec
id: TS-017
profile: rule
status: DRAFT
implements: [WEB-C-001, WEB-C-002, WEB-C-003, WEB-C-004, WEB-C-005, WEB-C-006, WEB-C-007]
sources: [SRC-006, SRC-008, SRC-011, SRC-012]
decisions: [DEC-002, DEC-020, DEC-023, DEC-029, DEC-031, DEC-035]
---

# TS-017 — Technical Foundation

## Purpose

The constraints that bound every other tactical spec: one framework, one
layout law, one brand source, one owner of the calendars, one language
and one package manager, one specification method. Constraints are
givens — this spec adds nothing to them except the form in which they can
be **checked**. Where a constraint cannot be machine-checked, it is
named as such and given a manual criterion with a moment.

Nothing here re-decides what another spec already fixed. Contrast and
type weights are TS-002 D3; font delivery is TS-003 D3; routes, header
and BFF inventory are TS-004; block order and reference viewports are
TS-006. This spec references them.

## Determinations

### D1 — One framework, one host [FIXED: DEC-002, WEB-C-001; deny-set PROPOSED]

Next.js (current major), App Router, server-first rendering (DEC-019 via
TS-003 D4), hosted on Vercel; the existing Vercel project link stays
(DEC-035, DEC-031). "The stack is deliberately not diversified" is made
checkable as a **dependency rule**, not as a habit:

| Rule | Form |
| --- | --- |
| The framework is singular | `next` is the only rendering/routing framework in `dependencies`. A deny-set enumerates the alternatives (other React routers, other meta-frameworks, other component frameworks, a second application server). |
| Every runtime dependency is justified | A register at the repository root (`stack.allow.json`) lists each `dependencies` entry with one line of reason. An entry absent from the register fails; a dependency present in the register but absent from `package.json` is removed. |
| Sibling patterns are intent, not code | DEC-002: a pattern adopted from a sibling repository (`community-calendar`, `classification-api`, SRC-012) is adopted as *intent*. A dependency whose only reason is "the sibling uses it" is not a reason — this is the one part of the rule a script cannot judge, so it is a review moment (A16), not a check. |

The deny-set is [PROPOSED]: no source enumerates forbidden frameworks.
Its content is a list in `stack.allow.json`, changed by a decision, not
by a commit.

### D2 — Mobile-first as a layout law [FIXED: WEB-C-002; numbers PROPOSED]

"Mobile first" is turned into three rules a reviewer can apply and a
build can test. All three are [PROPOSED] in their numbers and yield to
the design system when it lands (Q-023); the *rules* are what binds.

**(a) Direction.** Base styles are the phone styles — the styles that
apply with no media query at all. Every media query is `min-width`.
A `max-width` query is a defect, because it makes the desktop the base
case. Checkable by inspecting the generated CSS (A4).

**(b) Breakpoints.** Exactly two, and no others:

| Name | From | Designed against |
| --- | --- | --- |
| base | 0 | 360 × 640 (TS-006 D3 reference viewport); must survive 320 px (TS-002 A7) |
| `md` | 768 px | tablet portrait |
| `lg` | 1024 px | 1280 × 800 (TS-006 D3 reference viewport) |

**(c) Width is not maximised.** Above `lg` the *content* stops growing;
only the outer margin does. One container measure (proposed: 960 px) and
one text measure (proposed: 68 ch) exist as tokens, and no page defines
its own.

**(d) Tablet and desktop stay close to the mobile layout.** Made
operative as a single-tree rule:

- One component tree serves every viewport. No breakpoint-twinned
  markup: a block rendered for mobile and a second block rendered for
  desktop showing the same content is forbidden.
- A breakpoint may change **only** spacing, type-scale step, image
  aspect, and the column count of a block that declares itself
  multi-column via `data-columns-lg`.
- A breakpoint may **never** change the order of blocks, the presence of
  a block, or its wording. TS-006 D2 fixes the block sequence once, for
  all viewports.

This is what makes A8 possible: if the visible text order at 360 and at
1280 is identical, the layouts are the same layout at two widths.

### D3 — The brand kit is binding: two packages, three levels (DEC-044) [FIXED: WEB-C-003, SRC-008; package identity PROPOSED]

The brand lives in the hub and is **consumed**, never copied. Binding
paths in `go-to-market-os`:

| What | Where |
| --- | --- |
| written identity — usage rules, imagery direction, logo usage | `packages/identity/brand-identity/schafe-vorm-fenster.brand.md` |
| design system — tokens (colour, type scale, roles, dark mode), logos, kit | `packages/identity/brand-design/` |

"Binding" is made checkable as four rules:

1. **No literal ever.** No colour literal (`#rgb`, `rgb(`, `hsl(`,
   `oklch(`) and no `font-family` literal appears anywhere in `app/`,
   `src/` or the stylesheets, except in the single file that imports the
   brand token sheet. Every colour is a token — TS-002 D4 already makes a
   colour outside the token set a build error, in all three themes; this
   rule is the same rule seen from the brand side, not a second one.
2. **No brand asset is committed here.** Logos and typefaces are package
   subpaths, resolved by the bundler. A logo or font file inside this
   repository is a defect: it forks the source of truth.
3. **The version is pinned and visible.** The brand package is an exact
   version in `package.json`; a brand change reaches the website as a
   reviewable version bump, never as a silent drift.
4. **Where brand and accessibility collide, accessibility is already
   settled.** TS-002 D3 fixes the operative rules (the brand colour is
   not a text colour on light ground; the type-weight floor). TS-003 D3
   fixes delivery: one self-hosted variable `woff2`, latin subset,
   preloaded. Neither is restated or amended here.

**Not checkable:** the imagery rules are prose ("rural, grounded,
authentic; not generic startup stock") and no script can judge a
photograph against them. → manual, per release (A15).

**Package identity is [PROPOSED]** and blocked: see Open points. The
repository currently installs `@schafe-vorm-fenster/design-tokens`,
generated from a hub path that no longer exists; the hub now publishes
the authored design system under a different package name.

### D4 — The app owns the calendars; the website borrows their data [FIXED: WEB-C-004, DEC-035, DEC-029]

The village calendars are a product surface at
`app.schafe-vorm-fenster.de` (DEC-035). The website links to them and
renders read-only excerpts of their data; it does not reimplement them.
The boundary, per concern:

| Concern | Website | App |
| --- | --- | --- |
| calendar reading UI (day/week/month, filters, subscription) | never | owns |
| a place's next dates as a read-only excerpt | renders, via the BFF (TS-004 D5) | is the source |
| creating, editing or deleting an event | never — hands over (`/mitmachen/registrieren`) | owns |
| account, login, the logged-in `mein-…` space | never (TS-004 D1a) | owns |
| ICS / feed subscription | links | owns |
| place search | owns (it is a website job, WEB-F-030) | — |

Three rules make the boundary testable:

- **Read-only by construction.** Every website `/api/*` handler exports
  `GET` and nothing else. A `POST`/`PUT`/`PATCH`/`DELETE` handler in the
  website's route tree means the website took over a write the app owns.
  (Lead capture is the envoy widget's own backend, TS-004 D5 — not a
  website route.)
- **One handover module.** Links into the app are built from geo-api
  community slugs (DEC-029) in exactly one module. The app hostname
  appears in that module and nowhere else — no hard-coded app URL.
- **The persistent entry point.** A calendar entry sits in the header on
  every page; its label and target are fixed by TS-004 D4. WEB-C-004
  names a different label — see Open points; this spec does not resolve
  it and does not contradict TS-004.

### D5 — Language, package manager, repository conventions [FIXED: WEB-C-005, existing repo; typecheck PROPOSED]

The conventions are the ones the repository already has; the spec adds
the two that are missing and states all of them as checks.

| Convention | Rule | State |
| --- | --- | --- |
| package manager | pnpm, pinned via `packageManager` in `package.json`. `pnpm-lock.yaml` is the only lockfile; a `package-lock.json` or `yarn.lock` is a defect. | exists |
| private registry | the `@schafe-vorm-fenster` scope resolves to GitHub Packages via `.npmrc`; hub packages (brand, offering model, content raw material per DEC-020) install from there. | exists |
| language | TypeScript throughout — application code, repository scripts, tests. Repository scripts run under `tsx`. | exists |
| type strictness | a root `tsconfig.json` with `strict: true`; `pnpm typecheck` exists and is part of `pnpm check`. | **missing** [PROPOSED] |
| one gate | `pnpm check` is the single entry point for every check. A new check is added *to* it, never run beside it. | exists |
| pre-commit | husky runs `pnpm check`. | exists |
| CI | the pipeline of DEC-031 stage 2, modelled on SRC-012 (typecheck · lint · tests + coverage · knip · jscpd · preview · auto-merge · deploy). | pending |

`pnpm test` is a stub today; it becomes real with the verification
strategy, not with this spec.

### D6 — STRICT is the method; specs precede content [FIXED: DEC-023, WEB-C-006]

The specification method is STRICT
(`/Users/jan-henrik.hempel/LeafcutterOS/leafcutter-strict` — not
reachable from this repository, which is why `specs/README.md` names the
absolute path). Three of its operating principles bind every artefact
here:

| Principle | What it means for a spec in this folder |
| --- | --- |
| Agents propose, decision points decide | every artefact is `status: DRAFT`; a determination is `[FIXED]` only against a source or a DEC, otherwise `[PROPOSED]`. |
| No invention | a value with no source locator is `UNKNOWN` plus the question that resolves it — never a plausible guess. An unmarked gap is a defect, not freedom. |
| Bad input becomes a demand | a detected defect produces a demand addressed to someone, not a silent workaround (this spec emits three — see Open points). |

**The method is machine-checked.** `pnpm check:specs`
(`scripts/check-specs.ts`) is the executable half of WEB-C-006: E1
frontmatter · E2 ID uniqueness · E3 row shape · E4 S3-needs-a-decision ·
E5 reference integrity across WEB/DEC/Q/SRC/TS/GL · E6 `implements` ↔
Coverage symmetry · E7 decision index · E8/E9 acceptance-criterion IDs
and levels · E10 test references, plus W1–W3 for the closure gaps. It
runs in `pnpm check` and in the pre-commit hook (A13).

**"Specs precede content" is the phase order** (DEC-023): concept →
specification → content. Copy is not written while the specification
phase runs. Made checkable [PROPOSED]: every file under `content/`
carries in its frontmatter the tactical spec (`TS-###`) it realises, and
`check-specs.ts` fails a content file whose named spec does not exist
(A14). DEC-020 §5 already requires a machine-readable reference to the
GTM package a content file derives from; this is the same field pattern
for the spec side, and needs the content frontmatter schema
(`src/domain/content-frontmatter.schema.ts`) extended.

## Free for the generator

- [FREE] The CSS technique — utility classes, CSS modules, or plain
  stylesheets — as long as D2(a) and D3.1 hold.
- [FREE] Any component library, provided it introduces no second
  rendering framework (D1) and no second token source (D3).
- [FREE] `tsconfig.json` beyond `strict: true`; lint rule set beyond the
  checks named here.
- [FREE] The internal shape of the app-handover module (D4), as long as
  it is the only place the app hostname occurs.
- [FREE] Naming of the breakpoint tokens, provided the two values of
  D2(b) are the only ones in the generated CSS.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-017-A1 | static | `package.json`: `next` present; no dependency from the D1 deny-set; every `dependencies` entry has a reason line in `stack.allow.json`, and every register entry exists as a dependency. |
| TS-017-A2 | static | `pnpm-lock.yaml` is the only lockfile; `packageManager` pins pnpm; `.npmrc` maps the `@schafe-vorm-fenster` scope to the private registry. |
| TS-017-A3 | static | Root `tsconfig.json` exists with `strict: true`; `pnpm typecheck` is a script, is part of `pnpm check`, and exits 0. |
| TS-017-A4 | static | Generated CSS contains no `@media (max-width: …)`; the only breakpoint values present are D2(b)'s two. |
| TS-017-A5 | static | No colour literal and no `font-family` literal outside the single brand-token import file (`app/`, `src/`, stylesheets). |
| TS-017-A6 | static | No logo, mark, or font file is committed in this repository; every logo reference is a brand-package subpath import. |
| TS-017-A7 | static | The brand package is pinned to an exact version; the lockfile version matches the version recorded in D3. |
| TS-017-A8 | e2e | Visible text order in the rendered DOM is identical at 360 × 640 and 1280 × 800 on every page; no element is visible at one width and absent at the other. |
| TS-017-A9 | e2e | At 1920 px the content container does not exceed the D2(c) measure (only margins grow); at 320 px no page scrolls horizontally (TS-002 A7 is the floor). |
| TS-017-A10 | static | Every website `/api/*` route handler exports `GET` only — no write handler anywhere in the route tree. |
| TS-017-A11 | static | The app hostname occurs in exactly one module (the DEC-029 handover builder); no other file contains it, and no app link is assembled elsewhere. |
| TS-017-A12 | integration | The persistent calendar entry is present in the header on every page and resolves to the target TS-004 D4 fixes. |
| TS-017-A13 | tool | `pnpm check` (frontmatter + `check:specs`) exits 0 — pre-commit hook and CI; zero E-class errors. |
| TS-017-A14 | static | Every file under `content/` names the tactical spec it realises, and that spec exists; a content file naming no spec, or an unknown one, fails. |
| TS-017-A15 | manual | Imagery review: every image shipped is checked against the imagery rules in the brand identity profile — per release, by the brand owner. |
| TS-017-A17 | static | Exactly one icon dependency; every icon name used resolves to a Lucide export. |
| TS-017-A16 | manual | Dependency review: any dependency adopted from a sibling repository is confirmed as framework-neutral intent, not a ported implementation — per PR that changes `package.json`. |

### D7 — One icon set [FIXED: DEC-056, SRC-014#icons]

Lucide, 24 × 24 grid, 2 px stroke, round caps and joins. Monochrome,
inheriting one token colour — never filled, never two-tone, never in a
coloured circle unless that circle is a 44 px control well. Three sizes
only: 24 (buttons, rows, list items), 18 (inside a badge or kicker), 32
(section-leading). A new requirement takes the matching Lucide glyph; no
glyph is drawn by hand and no second family enters the set.

Checkable: exactly one icon dependency in `package.json`, and every icon
name used resolves to a Lucide export.

## Coverage

| Requirement | Discharged by |
| --- | --- |
| WEB-C-001 (Next.js on Vercel, no second framework) | D1, D5 · A1, A2, A16 |
| WEB-C-002 (mobile first; tablet/desktop stay close) | D2 · A4, A8, A9 |
| WEB-C-003 (brand kit binding) | D3 (with TS-002 D3, TS-003 D3) · A5, A6, A7, A15 |
| WEB-C-004 (app owns the calendars) | D4 · A10, A11, A12 |
| WEB-C-005 (TypeScript, pnpm conventions) | D5 · A2, A3, A13 |
| WEB-C-007 (one icon set) | D7 · A17 |
| WEB-C-006 (STRICT; specs precede content) | D6 · A13, A14 |

## Open points

- **The design system is announced, not delivered (Q-023).** D2's
  breakpoints, container measure and text measure are this spec's own
  proposals, made only so that "mobile first" is checkable today. They
  are superseded the moment the design system lands. Questions for
  jan-henrik: *which breakpoints does the design system fix, which
  container and text measure, and does it ship components or tokens
  only?* Until answered, the visual layer of the one-shot generation
  stays blocked — D2's rules (min-width only, one tree, order never
  changes) hold regardless of the numbers.

- **WEB-C-003 points at a path that no longer exists, and names a
  superseded typeface.** The requirement and SRC-008 both cite
  `@schafe-vorm-fenster/brand-design`. The hub has
  since split the identity into `packages/identity/brand-identity/` and
  `packages/identity/brand-design/`, and on 2026-09-09 adopted a new
  colour system and a new typeface — the family WEB-C-003 names
  (Catamaran) is no longer the brand's — resolved by DEC-043, which moves
  the rules to Inter. TS-002 D3 (weight floor, brand
  colour vs. text) and TS-003 D3 (one variable `woff2`) rest on the same
  superseded fact. **Demand** to the brand owner and the spec owner:
  *is the new brand-design package binding for the relaunch, and do
  WEB-C-003, SRC-008, TS-002 D3 and TS-003 D3 get amended to it?* This
  spec does not resolve it — resolving it here would contradict two
  accepted tactical specs. It needs an entry in the question register,
  which this spec does not own.

- **Which brand package is the website's dependency?** The repository
  installs `@schafe-vorm-fenster/design-tokens` (generated, from the
  retired hub path); the hub publishes the authored design system under
  a different name, and a third, older brand package is also present in
  the tree. Question for the brand owner: *which package is binding for
  the website, and who retires the others?* A7 cannot name a version
  until this is answered, and D3's package identity stays [PROPOSED].

- **Header label divergence (D4).** WEB-C-004 specifies a persistent
  header entry labelled "Dorfkalender öffnen"; TS-004 D4 fixes a
  persistent entry with a different label, pointing at the website's own
  place page rather than at the app. Question for the IA owner: *which
  label binds, and does the entry point at the website page or at the
  app once the calendars have moved (DEC-035)?* A12 tests presence and
  the TS-004 target; the label is out of this spec's reach.

- **A3 and A14 are demands, not passing checks.** There is no root
  `tsconfig.json` and no `typecheck` script today, and the content
  frontmatter schema carries no spec reference. Both are repository work
  this spec requires; both fail until done.

- **The STRICT Core Specification is not locally available.** ID scheme,
  requirement-class split and statement grammar are documented project
  conventions awaiting reconciliation against it (`specs/README.md`
  conventions). Until then, `check-specs.ts` is the operative definition
  of WEB-C-006's method half — a repo-local interim its own header marks
  for migration into shared tooling.

- **D1's deny-set and D2's numbers are [PROPOSED];** D3's package
  identity and D5's typecheck row are [PROPOSED]. Everything else in
  this spec is [FIXED] against a source or a decision.
