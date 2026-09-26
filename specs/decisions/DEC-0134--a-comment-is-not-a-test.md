---
id: DEC-0134
title: A comment is not a test — the coverage scan reads prose, so acceptance ids are spelled out, the gap gets a row, and the order flow's consult target is one builder two call sites share
status: DRAFT
date: 2026-09-26
decided_by: the engineering team
---

## Context

T-15's second QA round found one defect that is about the repository's own
instruments rather than about a page.

`scripts/check-specs.ts:1412-1424` builds its `referencedIds` set by raw-scanning
every test file for anything shaped like an acceptance id. It does not parse
TypeScript, so a mention inside a `/* … */` block counts exactly as much as a
test title. W3 — *"N acceptance criteria have no test referencing them"* — is the
only automated signal this repository has for an untested criterion, and the
first T-15 commit silenced it for `TS-WEB-0016-A14` by writing the id twice in
prose: once in `e2e/pages/bestellen.spec.ts`, once in
`src/components/lead-fallback/lead-fallback.test.tsx`. Both comments were honest
about the gap; the scan could not tell. The round's own report then read W3's
drop as evidence, which is how a correctly described gap became a false claim.

Two smaller things needed deciding in the same round: the page's half of the
order flow's consult target was asserted nowhere (the component test supplied
the href it then checked), and `lead-fallback.module.css` had grown a bare
`font-weight: 700` in a repository that takes every value from a token.

## Decision

**1. An acceptance id in a test file's prose is written so the scan cannot read
it: `A14 of TS-WEB-0016`, never `TS-WEB-0016-A14`.** A bare id in a test file is
a claim that this file tests that criterion. Where a comment needs to *name* a
criterion it does not discharge — to say which half is missing, or where the
other half lives — it spells the id out, and says in one clause why. The
alternative considered was teaching `check-specs.ts` to strip comments before
scanning. It is the better fix and it is not this task's file: T-15 owns neither
the script nor the coverage gate that is being built elsewhere. This convention
holds until that gate lands and can then be dropped in one sweep.

**2. A criterion that is half discharged gets a `state/open.md` row, not a
comment.** Row 266 names both A14s, says what is asserted (the fallback's markup,
the page's consult target), what is not (a browser walk of a `degraded` state the
page cannot enter while `state` is hard-coded `mocked`), what the precondition is
(Q-0022, the envoy widget) and who decides. A comment is read by whoever opens
that file; `state/open.md` is the list the owner reads after the run.

**3. The order flow's in-page consult target is one pure builder,
`app/[lang]/dein-kalender/bestellen/consult-exit.ts`, and both call sites read
it.** `consultExitHref(locale, scope)` and `consultExitQuery(scope)` build
`<order route>?orte=…&kreis=…&schritt=<n>#kontakt` through the route facade. The
per-step exit takes the query, step 3's lead-fallback mount takes the href. They
were two hand-assembled copies of one query, which is what let the page's half of
TS-WEB-0025 D8 go unasserted while the component's half was covered twice.

`consult-exit.test.ts` asserts the builder's output at every step and in both
locales, and asserts **by reading `page.tsx`** that both call sites go through it.
A source assertion, because the page is an `async` server component whose data
dependencies a unit test cannot stand up; it is narrow (three literal strings and
one negative) and it fails the moment either call site starts assembling its own
query again. The alternative — rendering the page — needs the place index, the
content loader and the offering package, and would test everything but the one
claim.

**4. `.consult` composes `outbound-link`'s `.inline` class instead of restating
its treatment.** This introduces CSS Modules `composes` to this repository, which
no other module uses. It is preferred over a new weight token (the brand package
ships none, and inventing one here would put a second source of truth beside it)
and over a copied `font-weight: 700` (a bare literal that `check:brand` does not
yet catch — `state/open.md` row 144 — and that would let the fallback's two links
drift apart). Composing also carries `.inline:hover` along, which a copy did not.

**5. A2's asset assertion is asked of every step, and it asks about fonts too.**
`TS-WEB-0025-A2` names "no Google script, iframe **or font**"; the assertion
stood after the per-step loop closed, so it measured only the last step, and it
did not look for a font at all. It is inside the loop now, carries the step's
`query` as its failure message, and matches `link[href*="fonts.g"]` as well.

## Consequences

- `pnpm check:specs` lists `TS-WEB-0016-A14` as untested again — measured:
  `W3 150/428` with it, `149/428` while the two comments stood. The number going
  *up* is the fix.
- `state/open.md` row 266 exists, and DEC-0133's Consequences no longer claim
  `A14` holds. Row 143's mitigation cell was rewritten the way row 153 does it,
  rather than having the resolution appended to its body; it no longer advises
  running a guard that is in the chain, and no longer says "five lines" where the
  row names three violations.
- `app/[lang]/dein-kalender/bestellen/page.tsx` holds no hand-built consult
  query. `consult-exit.test.ts` fails if one comes back.
- `outbound-link.test.tsx` asserts the 48-character bound at the bound: one case
  whose cut lands on a separator (which fails if the dash trim moves back before
  the slice — verified by reverting it), and one showing the collision two
  targets sharing that prefix produce, which is the documented reason `noteId`
  exists.
- The composition resolves in a real Next build, measured against the component
  gallery at `/dev/components`: the consult line's `class` reads
  `lead-fallback-module__…__consult outbound-link-module__…__inline`, so both
  the local class and the composed one land on the element and `.inline:hover`
  reaches it. No permanent test asserts it — the fallback renders in a browser
  only in the gallery, because of row 266's gap.
- `/dein-kalender`'s duplicate marking id is gone, and not by this round's hand:
  T-13 repointed both call sites, so the route's only `OutboundLink` carrying a
  marking is the configuration-repository link.

## Open

- The real fix for finding 1 belongs to `scripts/check-specs.ts`: strip comments
  before scanning, or require the id to sit in a `test()`/`it()` title. Until
  then the spelling convention is a discipline, not a guard — a future round can
  reintroduce the defect by writing a bare id in a comment and nothing will fail.
- No test asserts that a route carries no duplicate DOM id. The duplicate this
  round inherited was found by reading; the next one will be too.
