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

The **third** round added four more, and they are decisions 6 to 9 below: a
determination's Position row that the component only half honoured (D16), a
derived DOM id that could collide on owner-editable content data, an assertion
written into files another task owns, and two tests that restated their
implementation instead of asking its question. Decision 8 is the one that
removes work rather than adding it — the round had taken T-17's deliverable.

Two smaller things needed deciding in the first round: the page's half of the
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
dependencies a unit test cannot stand up. The alternative — rendering the page —
needs the place index, the content loader and the offering package, and would
test everything but the one claim.

What the source assertion reads is **identifiers and an absence**, not
statements: that both builders are imported from `./consult-exit`, that both are
called, that the page contains no `URLSearchParams`, and that no object literal
pairs `schritt` with the current `step`. Its first version matched three whole
statements character for character, and the review round was right that a
rename or a prettier reflow would then have failed a criterion that still held.
The flow's own advance links (`schritt: 3`, `schritt: 4`) are a different target
and the negative leaves them alone.

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

**6. The marking stands on its own line wherever `TS-WEB-0016 D16` applies —
including the `inline` variant.** D16's Position row is unconditional: *"under
the control, never inside its label. A label states the action; a recipient is a
separate fact and belongs on its own line"*, and its "Where it applies" row
names exactly two surfaces — the contact section's first action row and the lead
fallback's link to `/start`. The control variants stacked already; the `/start`
link is the default `inline` variant and put the recipient beside the control,
so one of D16's two named surfaces was still rendering the recipient in the
control's own line. `outbound-link` takes a `markingOwnLine` prop, the lead
fallback passes it, and `.stacked` composes `.control` so the two stacked forms
cannot drift apart.

The prop is a caller's choice rather than the default because D16 does not reach
the other surfaces `outbound-link` serves: an archive row, a quote card and a
proof card are links *inside sentences*, where the marking following in the line
and wrapping under it is the design (`outbound-link.module.css`'s `.marked`).
DEC-0133 §3 argued this question only on the accessible-name half (A23) and
asserted "the span sits in the same line and wraps under it" without reconciling
D16's own-line clause; the spec wins (AGENTS.md rule 8).

**7. The marking's DOM id carries a fingerprint of the whole target, not just a
48-character slug.** `outboundNoteId` derives `outbound-note-<slug>-<fnv1a>`:
the slug stays readable in the DOM, and the FNV-1a hash of the full href, base
36, makes two targets that agree on the first 48 characters distinguishable.
Measured over the two content packages the markings are rendered from
(`@schafe-vorm-fenster/media-echo`, `@schafe-vorm-fenster/proof`): 12 outbound
URLs, 9 of them already past the bound after the scheme is stripped. The
exposed surface is owner-editable content data, not the route table, so
"no such pair exists today" was one archive row away from a duplicate DOM id and
an `aria-describedby` resolving to the wrong sentence. A hash and not a counter
or `useId`, because the id has to be identical on the server and after
hydration; `noteId` stays the caller's override and is no longer a collision
workaround.

**8. `package.json`'s `check` chain and `scripts/check-terms.ts` stay
untouched — they are T-17's.** This round's first commit wired `check:terms`
into the chain and promoted `state/open.md` rows 143 and 152 to RESOLVED on that
basis. Both are reverted: the backlog gives T-17 `package.json (check chain)`
and `scripts/check-terms.ts` as owned files and T-17's goal says verbatim that
"`check:terms` joins the `check` chain", while T-15's grant on A8 is the residue
only (`gallery.tsx`'s response-promise demo and two
`live-modules-and-conversions.test.tsx` fixtures). The `check` line is also one
JSON string that T-01 and T-07 hold as a shared file. A8 is citable without it:
`pnpm check:terms` → `terms check: 515 file(s) scanned for the response-time
wording` / `no errors`. DEC-0133 §6 is rewritten to say the same, and rows 143
and 152 now record the violations as cleared with the chain entry owed to T-17.

**9. F-2-32's "one configured value" is asserted as a static sweep, not as a
copy of the constant.** `e2e/pages/deine-region.spec.ts` compared `BRIEFING_URL`
with the exact expression `src/lib/live/briefing.ts` assigns it, which could only
fail if someone edited that module and forgot the spec — and it pasted the
appointment URL into a second file, which is the duplication F-2-32 exists to
prevent. It now walks every shipped `.ts`/`.tsx` file under `app/` and `src/`,
minus `briefing.ts` itself and minus test files, and fails if any of them
contains the host. Test files are excluded because `outbound-link.test.tsx`
fabricates targets on that host on purpose, to exercise decision 7's derivation.

## Consequences

- `pnpm check:specs` lists `TS-WEB-0016-A14` as untested again — measured:
  `W3 150/428` with it, `149/428` while the two comments stood. The number going
  *up* is the fix.
- `state/open.md` row 266 exists, and DEC-0133's Consequences no longer claim
  `A14` holds. Rows 143 and 152 both carry their update in the **mitigation
  cell**, the way row 153 does it, rather than appended to the body: the three
  violations are cleared, the measurement is the one taken here
  (515 files, not the stale 505 row 152 carried), and the chain entry is named
  as T-17's with "yes" in the open column so the owner sees it is still owed.
- `app/[lang]/dein-kalender/bestellen/page.tsx` holds no hand-built consult
  query. `consult-exit.test.ts` fails if one comes back.
- `outbound-link.test.tsx` asserts the 48-character bound at the bound: one case
  whose cut lands on a separator (which fails if the dash trim moves back before
  the slice — verified by reverting it), and one showing that two targets sharing
  that prefix now get **different** ids. Every derived id changes shape with
  decision 7 (`outbound-note-start-…`); nothing outside the component's own test
  asserted one, measured with
  `grep -rn "outbound-note" --include="*.ts" --include="*.tsx"`.
- The lead fallback's `/start` marking renders under the control, not beside it:
  `outbound-link.test.tsx` asserts the `inline` wrapper with `markingOwnLine`
  carries the stacked class and the plain `inline` one does not, that the
  marking still follows the anchor and stays associated, and that the
  accessible name is untouched either way (11 tests green). That `.stacked`
  *composes* `.control` is invisible to the vitest CSS transform, which maps the
  local name only; measured in the real build instead, in the SSR chunk's class
  map — `"stacked": "…__stacked" + " " + "…__control"` — the same way decision 4's
  composition was measured.
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
- No test asserts that a route carries no duplicate DOM id. Decision 7 removes
  the one derivation that produced them silently, but a page that hard-codes two
  equal `noteId`s or `id`s still passes: the sweep belongs in the site-wide a11y
  walk (`e2e/a11y.spec.ts`), which this task does not own.
- `src/components/gallery.tsx` and `src/components/envoy-form-mount/` are
  **T-10's** files and were edited here: the fallback demo's `briefingHref` is
  built with `linkHref("regionQuote", { hash: CONTACT_SECTION_ID })` instead of a
  typed path (`src/components/README.md`: "No path, no string, no colour is typed
  at a call site"), the `response-promise` demo's comment no longer claims the
  chain entry, and `envoy-form-mount` passes `locale` through to the fallback
  (F-2-4). All three are small and necessary; T-10 is told in the round's report.
