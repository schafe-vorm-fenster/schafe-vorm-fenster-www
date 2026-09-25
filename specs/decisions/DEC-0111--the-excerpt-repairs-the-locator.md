---
id: DEC-0111
title: The excerpt repairs the locator — a check reads every citation and says where a moved statement went
status: accepted
date: 2026-09-25
decided_by: jan-henrik.hempel
---

## Context

`DEC-0097` gave every requirement the locator
`@leafcutter-strict/method-identifier-and-locator-schema` asks for — a source
id, a position, and at most 25 words copied from that exact position. The
method's promise for it is that *"both resolve years later"*.

They do not. Hub PR #510 amended
`concept/website-information-architecture.concept.md` on 2026-09-25, inserting
ten lines above line 35 and deleting three passages. **All 17 requirement
locators into that file were wrong the moment it merged**, four of them
pointing at text the amendment had removed. Nothing failed: `check:specs`
counts a locator, it has never read one. The breakage was found by hand,
repaired by hand, and would have recurred at the next edit.

`Q-0082` weighed three ways out and measured the constraint behind them: the
method offers exactly four anchor schemes — line, page, paragraph, timestamp —
and `library-schemas` patterns `loc` at
`^.+#(L\d+|P\d+|¶\d+|M\d+:\d+)$`. There is no section anchor and no content
hash. For a Markdown file under version control **none of the four survives an
edit**, so leaving the scheme alone means a re-resolution run after every hub
edit, and only while somebody remembers the edit happened. Changing the scheme
means an upstream schema change and a demand of `DEM-0015`'s shape — and a
heading anchor is itself only as stable as the heading.

## Decision

**Automate the repair rather than change the scheme.** The excerpt is already
the recovery key: the method mandates it, it costs nothing extra, and it is
what re-resolved all 17 positions by hand.

1. `pnpm check:locators` (`scripts/check-locators.ts`) reads the line each
   `{source_id, loc, excerpt}` triple names and compares the excerpt as an
   exact substring. It is in the `check` chain and therefore in the pre-commit
   hook. `TS-WEB-0017 D6a` is the determination, `TS-WEB-0017-A18` the
   criterion.
2. **A moved statement and a gone one are different findings.** Where the
   excerpt is elsewhere in the same file the check names every line it is now
   on, and the repair is mechanical — repoint the locator, no judgement. Where
   the excerpt is absent the statement was rewritten or deleted, the citation
   has no position to move to, and somebody decides whether the source still
   supports the requirement. That is a `DEM-####`, per the source-inventory
   contract's defect channel, not a repointing.
3. **Honest degradation is part of the decision, not an implementation
   detail.** Two of the three roots are sibling *checkouts*, not dependencies,
   and are absent in CI. The check prints a line per root saying whether it is
   present and five separate tallies, so `NOT CHECKED` can never be read as a
   pass. It gates exactly what it could read: in CI the hub locators degrade to
   `not checked` on their own and the in-repository ones stay enforced. Nothing
   has to be configured and nothing can be forgotten.

## Consequences

- The class of defect that produced the 2026-09-25 repair run now fails at the
  commit that introduces it, on the side that can still fix it cheaply.
- It proved itself on the tree it was written against: four locators into
  `concept/website-design-system.md` had drifted during the same day's edits to
  that guide (`CON-WEB-0055`, `CON-WEB-0057`, `FUN-WEB-0116`, `FUN-WEB-0117`)
  and were repointed by its own output.
- `Q-0082` closes. The scheme is unchanged, so no upstream demand is raised and
  `DEM-0015` is untouched.
- What it does **not** do: it cannot tell a citation that still supports its
  requirement from one that no longer does. An excerpt found at a new line is
  repointed; whether the source still says what the requirement claims is a
  reading, and `DEC-0104 §2` governs it.
- The 87 `UNKNOWN` locators are legitimate (`DEC-0097`) and are counted
  separately rather than reported as findings, so the same gap is not reported
  twice — `W8` already carries it.
