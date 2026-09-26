---
id: DEC-0144
title: The instrument names the criterion, and a site-wide sentence is walked site-wide — the meters cite whole identifiers, three sweeps leave the home page, and two divergences are declared instead of assumed
status: DRAFT
date: 2026-09-26
decided_by: the engineering team
---

## Context

T-19 is the alignment sweep: every criterion the decisions of 2026-09-23..25
added or rewrote should have a test named by its full identifier at the level
the criterion itself declares. Measured before any change was made
(`pnpm check:coverage`, `state/coverage.md`), five of the fifteen criteria the
task names were MISSING, two were NAMED ONLY, and one carried an identifier
that belongs to a different criterion. Three separate causes, and only one of
them was a missing test:

1. **A meter that names nothing.** `scripts/check-brand.ts` and
   `scripts/check-stack.ts` prefixed every failure message with a bare
   `A4`/`A19`/`A2`, and the report line pasted `TS-017-` in front of it —
   `TS-017-A19`, which is no identifier this repository defines (DEC-0086 fixes
   the family as `TS-WEB-####-A#`). A `static` criterion is closed by a
   `scripts/check-*.ts` in the `check` chain that **names it**, because a meter
   has no test title to carry the link (`scripts/check-coverage.ts`, verdict
   METERED). So seven criteria these two scripts have enforced since they were
   written read as MISSING.
2. **A site-wide sentence checked on one page.** TS-WEB-0017-A8 says
   *"identical … on every page"*, A9 says *"no page scrolls horizontally"*,
   A12 says *"on every page"*, TS-WEB-0006-A18 says *"every explanatory
   module"*. All four were asserted on `/` — or, for A18, on the three price
   tiers of `/dein-kalender` — and `/` is the page with no place data, no filter
   row, no embed and no form: the least likely page to break any of them.
3. **A title claiming the wrong criterion.**
   `src/lib/analytics/call-sites.test.ts` was titled `TS-WEB-0012-A2`. That
   criterion is `e2e` and is about the visitor's state after a journey — no
   analytics cookie, no storage identifier, no request outside the D7
   collectors — which a scan of source text cannot observe. The scan is real and
   useful; the identifier on it was not.

Two criteria also turned out to disagree with what the site renders, and
neither disagreement is a test author's to settle.

## Decision

### 1. Every meter message carries the whole identifier

`check-brand.ts` and `check-stack.ts` now name `TS-WEB-0017-A4`,
`-A5`, `-A6`, `-A19` and `TS-WEB-0017-A1`, `-A2`, `-A7`, `-A17` in the messages
they fail with, from one constant each, and the report line prints the message
as it is instead of prefixing an invented `TS-017-`. `check-brand.test.ts`
asserts on the new prefix. Nothing about what either script checks changed.

`TS-WEB-0017-A17`'s second clause — *"every icon name used resolves to a Lucide
export"* — is **not** closed by the dependency check, and the docblock says so:
`src/components/icon/icon.tsx` imports each glyph by name from `lucide-react`,
so `pnpm typecheck` is that clause's instrument. A citation that claimed the
whole criterion would have been the same defect in a new place.

### 2. `check-stack.ts` becomes testable, and is tested

It was a straight-line module that read the real repository and called
`process.exit`, so the only way to exercise a rule was to break the
repository — which is how four criteria drifted out of the coverage report
unnoticed. It is now `checkStack(root)`, pure, in the shape `check-brand.ts`
already had, with `scripts/check-stack.test.ts` feeding it fixture trees: one
case per rule, each starting from a green tree and breaking exactly one thing.

One behaviour changed with the refactor, deliberately: a missing
`pnpm-lock.yaml` is reported once, by A2, and A7 no longer also throws while
trying to read it.

### 3. TS-WEB-0013-A4 compares the specification with the code

*"The deployed CSP allowlist equals the D2 host set exactly."*
`scripts/check-csp.ts` compares the policy with `ALLOWLIST`, which **is** the
policy's own table — it compares the policy with itself and cannot see a
divergence from D2. The new `scripts/check-csp-allowlist.test.ts` parses the
`### D2` table out of `specs/tactical/TS-WEB-0013--privacy.tactical.md` and
compares it with `ALLOWLIST`: first-party rows are `'self'`, a row whose "host"
is a same-origin path has no host to allowlist, and a row whose host the table
does not name yet is counted apart. The specification is the input, as
AGENTS.md rule 8 requires.

**Measured, the two sides diverge by three hosts**, and D2's own closing
sentence is what makes that a finding rather than a fact: *"If they diverge, one
of them is wrong."* Which one is the spec owner's call, so the three are
declared in `KNOWN_DIVERGENCES` with their reasons rather than folded silently
into the assertion:

| CSP host with no D2 row | Why it is there |
| --- | --- |
| `portalize.schafe-vorm-fenster.de` | the widget's loader host; D2 names `app.schafe-vorm-fenster.de` for that loader and has no second row |
| `envoy-api.api.schafe-vorm-fenster.de` | D2's envoy row is still UNKNOWN (Q-0022) while the CSP already carries a host |
| `assets.api.schafe-vorm-fenster.de` | the embedded calendar's event images; D3 lists `assets.api.…` as server-side only, so D2 has no client-request row |

The list can only shrink: a fourth extra host fails, a missing host fails, and a
declared divergence that has stopped diverging fails too and asks for its entry
to be deleted. `state/open.md` carries the row.

**And no test title in that file names A4** (§10): a criterion that reads
*"equals … exactly"* is not closed by a case asserting that the difference is
exactly three hosts. The verdict is NAMED ONLY, the id stands in the docblock,
and it moves into the title in the commit that resolves the divergence.

### 4. TS-WEB-0002-A9 is walked, on the two routes that carry every mover

`e2e/reduced-motion.spec.ts` emulates `prefers-reduced-motion: reduce` on `/`
and `/mitmachen` — between them the reveal wrapper, the auto-advancing explain
module, the burger overlay and the back-to-top control, which is the whole
population of moving things — and asserts five facts: every animation the
browser is running animates `opacity` and nothing else (read from
`document.getAnimations()`, after a scroll to the end and back); no sampled
control keeps a durable transition; no reveal wrapper is left *transparent*
instead of still, which is the one way to satisfy "no animation" by accident
(F-3-10); the explain module stands at `data-state="1"` with
`data-advance="static"` for longer than a whole pass, and its step lines still
work; and scrolling is not smoothed.

Next's development overlay is excluded by selector and the file says why: its
button keeps a 250 ms transition of its own — measured — it is not our markup,
and CI runs the same suite against `pnpm start`, where it does not exist. A
criterion about our motion must not be answerable by our toolchain's.

### 5. TS-WEB-0006-A18 is swept over every route, with block 1 identified structurally

`e2e/cta-ladder.spec.ts` reads the module set off the page — `data-mechanism`
for scenes and publishing paths, `data-offering` for price and offer tiers —
and holds every module to "exactly one CTA, on the secondary rung", on both
languages of all twelve routes. Two readings had to be settled to do that, and
both are read off determinations rather than chosen:

- **The unit is the outermost module.** `scene-block`'s own contract says a
  scene that wraps a module adds no CTA, and `/` is built that way: three
  outermost modules, one CTA each, one of them a scene wrapping a publishing
  path. Counting the scene and the path separately would demand two CTAs where
  TS-WEB-0006 D3 asks for one.
- **Block 1 is identified by position, and only block 1's module may hold the
  page's primary.** D3 says an explanatory module's CTA points at *"the deeper
  page's primary conversion"*, while the ladder's primary rung is *"the page's
  own conversion"*. `/mitmachen` composes block 1 out of `scene-block` and
  TS-WEB-0022-A2 requires the page's single primary to be there, so reading A18
  as "no scene may ever contain a primary" would contradict it. The exemption is
  therefore given to the **first `[data-block]`** of the page's own block
  sequence, not to "whatever module happens to contain a primary": the walk
  asserts that the number of primary markers inside modules equals the number in
  block 1 — zero on a page whose primary stands outside every module — and every
  module outside block 1 is measured against A18 even when it holds a primary.
  Exempting any module that contains one would have exempted precisely the
  module that broke the ladder: a price tier swallowing the page's only primary
  would have left the sweep green (QA round 1).

**One divergence is declared.** `/dein-ort/starten` block 2.1 renders a scene
with no CTA at all, and TS-WEB-0021 gives that block none anywhere in its own
determinations — while "exactly one" is not "at most one". The two
specifications disagree about one module on one route; it is declared in
`CTA_FREE_MODULES` with a `state/open.md` row, a second CTA-free module
anywhere fails, and the declaration fails the moment that module gains its CTA.
The two routes that carry the declaration **do not name A18 in their test
title** (§10); the ten others do, because there the walk asserts what A18 says.
A18's VERIFIED verdict predates this task and rests on the tier tests, which
assert the half that holds.

### 6. Three site-wide sweeps leave `/`

- **TS-WEB-0017-A8 and A9** now walk the twelve German paths of the D1
  registry, in one test per route: a load at 360, a resize through 320, 428,
  1280 and 1920 for A9, and then **a fresh load at 428 and at 1280** for A8 —
  the three widths A8 names, each of them loaded at. (Corrected in QA round 2;
  §11. The first version of this bullet claimed resizing was the sharper
  instrument *because* the server cannot see the viewport. That is backwards:
  precisely because the server cannot see the viewport, five responses for one
  route are identical HTML, so two loads can differ only where the client
  decided something **at mount** — and a page resized from 360 keeps its 360
  decision. Reloading is the only reading that sees that class; resizing is
  blind to it by construction.) The resize readings are kept beside the loaded
  ones, because a tree that reorders while the window changes size is also not
  one tree, and that is a reading no reload can produce. What resizing buys is
  breadth and a development server that survives the run (`state/open.md`
  row 281) — thirty-six cold navigations for A8's three widths instead of the
  sixty a full five-width matrix costs — and that, not detection strength, is
  what it is recorded as. The English mirrors are left out for the reason
  `e2e/layout-stability.spec.ts` already records: same components, same
  stylesheets, no different class of defect. At 1920 every `main .container` is
  measured, not the first.
- **TS-WEB-0017-A12** gets a walk of all 24 routes in `e2e/site-header.spec.ts`,
  reading the label and the target out of `src/lib/routes/navigation.ts` and
  `href()` rather than writing either down again — so the case stays true
  through a path change and fails on a hard-coded href, which is A12's second
  clause and what a literal string would have hidden.
- **TS-WEB-0018-A12** gets the integration test its level names:
  `src/lib/live/counters-absent.integration.test.tsx` stubs the stats client
  empty and follows the whole chain — `liveCounters()` answers `undefined`,
  `GET /api/stats` answers 204 with no body, and what the page renders is the
  empty string, with no digit in it. A counted **zero** is the control: it is a
  figure and it does render, so "absent" cannot be satisfied by a module that
  hides real data.

### 7. TS-WEB-0003-A7 is cited where it is measured, and metered where it is closed

The criterion's level is `tool`, so a test title cannot close it — a CI job or a
chain meter can (`scripts/check-coverage.ts`). Both halves are now written:
`e2e/layout-stability.spec.ts` names it in the docblock and in the title of the
per-route CLS case that has been measuring it since it was written, and
`.github/workflows/check.yml` names it on the Playwright step, which is the job
that runs that measurement against the production build. Before this, no file in
the repository mentioned the criterion at all.

### 8. A false identifier is removed rather than moved

`src/lib/analytics/call-sites.test.ts` loses `TS-WEB-0012-A2` from its title.
A2 stays VERIFIED through `e2e/privacy.spec.ts`, which is its real instrument,
so nothing is lost; what goes is a second, false claim of coverage at the wrong
level. The scan is the static half of A5 of TS-WEB-0012 — an `e2e` criterion,
because "emits" is a browser fact — so its titles carry no identifier at all,
and the docblock spells the ids out in prose the way
`scripts/check-coverage.ts` spells out its own, so that a docblock cannot be
read as coverage.

### 9. The coverage gain is written down

`pnpm check:coverage`: MISSING 145 → 136, NAMED ONLY 32 → 30 — eleven criteria
closed (eight out of MISSING, three out of NAMED ONLY) and one, TS-WEB-0013-A4,
moved from MISSING to NAMED ONLY, which is the single number this task raises
(29 → 30, §10). `specs/verification/coverage-budget.json` records all of it and
names every criterion that moved, in both directions, as DEC-0141 rule 2
requires of a gain and its `note` requires of a raise.

### 10. A verdict says what the state is, never what the test wishes (QA round 1)

The review round found two criteria counted as **closed coverage while the
criterion was measurably unmet** — the exact failure this repository had just
spent a round taking back. `scripts/check-csp-allowlist.test.ts` asserted
`expect(extra).toEqual(Object.keys(KNOWN_DIVERGENCES))`, i.e. that A4 of
TS-WEB-0013 is violated by exactly three hosts, under a `describe` title
carrying the identifier — so `pnpm check:coverage` graded A4 VERIFIED and the
budget was lowered counting it. The same shape was reported for A18 of
TS-WEB-0006 through `CTA_FREE_MODULES`.

The rule this task adopts, from `DEC-0142` §9 and the comment
`src/lib/content/validate.test.ts` carries beside it:

**A test title names a criterion only where the test asserts what the criterion
says. Where the test asserts a declared exception to it, the identifier stays in
the file — docblock, comment, the exception's own reason — and the verdict is
NAMED ONLY.** The id in prose (*"A18 of TS-WEB-0006"*) is how the file still
says which criterion it is about without the scan reading it as coverage;
`scripts/check-coverage.ts` writes its own docblock that way for the same
reason.

Applied: A4 lost its title and is NAMED ONLY, the budget carries the raise with
its reason (29 → 30), and the two `/dein-ort/starten` cases of
`e2e/cta-ladder.spec.ts` name A18 in prose while the ten routes where the
criterion holds name it as an identifier. Nothing was weakened and no assertion
was deleted: both files measure exactly what they measured before, and both fail
on any change to either side. What changed is what the ledger claims.

The round found two more instruments claiming more than they measured, and both
are repaired rather than annotated:

- `src/lib/live/counters-absent.integration.test.tsx` re-implemented
  `CountersIsland`'s `undefined` branch inside the test file, one prop short of
  production, so a regression in `app/[lang]/_islands.tsx` could not fail it. It
  now awaits the island itself (`cacheLife`/`cacheTag` stubbed, nothing else),
  and the case about an upstream answering 200 without `totalEvents` runs the
  **real** events-api client over a stubbed transport, so the schema branch its
  comment describes is the one that executes. Verified by mutation: turning the
  island's `return null` into `return <span>0</span>` fails two of the five
  cases.
- Two assertions could not fail — `primaryInModules ≤ primaryCount` in
  `e2e/cta-ladder.spec.ts` (a filtered length against its source length) and a
  comparison of two module constants in `e2e/reduced-motion.spec.ts`. The first
  is replaced by the fact it stood in for (§5); the second is gone, and the
  bookkeeping-key set is handed into the reader instead of written twice, which
  removes the duplication it was guarding.

`TS-WEB-0017-A12`'s route walk also ran at whatever viewport the Playwright
project defaults to while its own reasoning named the phone width; it now runs
at 360 and at 1280, one case each. And the level substitution the walk performs
— an `integration` criterion closed by an e2e title, which
`scripts/check-coverage.ts` does not compare — is `state/open.md` row 282 rather
than a silent bend of the ledger's own rule.

### 11. An instrument may be broadened, never blunted (QA round 2)

The second review round found that §6's three-sweep broadening had cost A8 of
TS-WEB-0017 the one defect class it exists to catch, and that the record argued
for the trade with the reasoning reversed. Both are corrected above and in
`e2e/smoke.spec.ts`'s docblock. The measurement that settles it, taken on the
worktree's own development server: `/mitmachen` loaded at 360 and resized to
1280 renders `data-advance` `1/armed` on all three explain modules, and loaded
at 1280 renders `1/static` — because
`src/components/explain-module/explain-module.tsx` reads
`window.matchMedia(SIDE_BY_SIDE)` once in a mount effect and never listens for
`change`, unlike the header shell. Two different trees, and the resize-only
sweep saw one of them. Visible text order is equal in both today, so no
criterion was violated; the instrument was, and a weakened instrument does not
show up in `state/coverage.md` — A8 was closed before this task, so the ledger
could not have reported it. Hence the rule this round adds beside §10's:

**A sweep that gains routes may not lose the reading the criterion asks for. The
cost of keeping it is a number to report, not a reason to drop it.**

Applied, in the same spirit, to three instruments that asserted less than their
titles promised:

- `e2e/cta-ladder.spec.ts` measured twenty-four routes of which sixteen compose
  no module at all, so sixteen titles read *"every explanatory module … carries
  one secondary CTA"* over an empty list. Each route now asserts **its own
  measured module count** (`MODULE_COUNTS`, measured 2026-09-26), the sixteen
  say *"composes no explanatory module"* in their titles, and the file-level
  four-path guard is gone because every route is now its own guard: a page that
  loses a scene, or a renamed seam, fails on the route it happened on.
- The last case of that file asserts that a **declared exception** is still an
  exception, so under §10's own rule its title now carries the id in prose
  (*"A18 of TS-WEB-0006"*) rather than as the leading identifier. The rule holds
  for the file that writes it down.
- `scripts/check-csp-allowlist.test.ts` promised two facts in one title and
  asserted one: the same-origin-path half of *"no first-party host and no
  same-origin path leaks into the allowlist"* is now a second loop (probe: an
  allowlist entry `https://code.etracker.com/_vercel/speed-insights/beacon`
  fails that case and only that case). And `d2Hosts()` silently dropped any
  token it could not classify — a future `*.example.com` row, or an uppercase
  host, would have landed in no bucket while the comment claimed every row lands
  in exactly one. It now expands the first row's `.pl`/`.at` shorthand into the
  hosts it means and collects anything left over in `unaccounted`, which is
  asserted empty (probe: breaking the shorthand pattern fails the parse case).

## Consequences

- Eleven criteria closed: eight that were already being enforced can now be
  attributed to their instrument, and three that were graded NAMED ONLY are
  graded on a test title or a meter message instead. None of them was closed by
  weakening a sentence — and the one criterion that gained a test without
  gaining a verdict, TS-WEB-0013-A4, is counted as the raise it is (§10).
- Two criteria are now known to disagree with what the site renders —
  TS-WEB-0013-A4 by three CSP hosts, TS-WEB-0006-A18 by one CTA-free scene.
  Both are visible in a declared list that can only shrink, both have a
  `state/open.md` row, and both are the spec owner's to resolve. The sweeps are
  green because the divergences are named, not because they were assumed away —
  and neither divergence is reported as coverage (§10).
- `TS-WEB-0019-A7` was to "stay `fixme` until T-21". It does not: T-21 landed
  with DEC-0140 and `e2e/pages/home.spec.ts` walks the criterion for real. The
  backlog line is satisfied by the dependency having shipped, and nothing was
  re-fixmed.
- `TS-WEB-0027-A13` is closed (`e2e/pages/ueber-uns.spec.ts` for its
  "no conversion event" half, the site-wide TS-WEB-0016-A17 walk for its contact
  rows, which includes `/ueber-uns`) and the backlog's parenthetical describing
  it as the stats-stub criterion does not match its text; the specification wins
  and only TS-WEB-0018-A12 was treated as the stats-stub criterion. What is not
  done is putting A13's own identifier on the contact-row walk:
  `e2e/contact-section.spec.ts` is T-10's file.
- `e2e/smoke.spec.ts` costs thirty-six cold navigations for the twelve routes —
  one load per route per width A8 names, plus a resize walk across all five for
  A9 — rather than the sixty a full route-times-width matrix costs. That is a
  budget, not a claim about detection: sixty navigations against `next dev`
  produced dev-overlay 500s (a truncated-JSON parse inside Next's own dev
  pipeline) that had nothing to do with either criterion, and A8 names three
  widths, not five, so three loads per route is the criterion as written. The
  full suite is green; the flake and its shape are a `state/open.md` row so the
  next author does not rediscover it.
- The local e2e figure is **1040 passed · 7 skipped** of 1047 at this code state
  (`PORT=3261 pnpm e2e`, exit 0, 5.7 m, Playwright managing the server) and was
  1039 of 1046, measured twice, at the commit before this round — the walk at a
  second viewport is the one test added. The 1050 this record's first round
  reported cannot have been either suite. The dev
  server also died outright in one full run — 257 `ERR_CONNECTION_REFUSED` after
  it — which `state/open.md` row 281 now names beside the dev-overlay 500s, so a
  red first run is not read as a regression.
