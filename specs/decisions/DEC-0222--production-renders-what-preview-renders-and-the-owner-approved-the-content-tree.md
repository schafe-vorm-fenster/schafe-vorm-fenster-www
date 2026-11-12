---
id: DEC-0222
title: Production renders what preview renders, and the owner approved every page and slot the preview shows
status: DRAFT
date: 2026-11-12
decided_by: jan-henrik.hempel
---

## Context

Issue #206 (owner, 2026-11-12). The editorial gate of TS-WEB-0007 D11
(`src/lib/content/lifecycle.ts`) renders only `status: approved` and
`imported` in a production build; a preview renders `draft`, `in-review` and
`approved`. Every one of the 22 page artefacts under `content/pages/**` stood
on `status: draft`, page and slots alike: 192 slot comments and 22 page
frontmatters. A production build of `next-2026` would have rendered no page
copy at all. `state/open.md` row 140 had recorded exactly that, and had left
the flip to "the editorial decision point by a person".

## The owner's decision

Verbatim, issue #206, 2026-11-12
(<https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/206>):

> „Alles, was wir gerade bauen, ist auch textuell und visuell komplett bestätigt. Das muss natürlich alles auf Produktion gehen, wenn wir das mergen. … Wir dürfen auf gar keinen Fall riskieren, dass das, was auf dem Branch ist, nochmal verändert oder schlimmstenfalls sogar reduziert wird, nur weil wir auf Main mergen.“

## Decision

1. **The owner's approval is the editorial decision point of D11.** Every
   page and every slot that `next-2026` renders on 2026-11-12 is approved by
   the owner. All 22 page artefacts (DE and EN) carry `status: approved`,
   `reviewed_by: "Owner (Jan-Henrik Hempel), DEC-0222"` and
   `reviewed_at: "2026-11-12"` in their frontmatter, and all 192 slot
   comments carry `status: approved`. The agent wrote the bits; the decision
   is the owner's, quoted above.
2. **Production renders what preview renders.** `pnpm check:content:production`
   (`check:content --target production`) judges the tree for a production
   build: a page or slot whose status a production build drops is an error.
   It runs in `pnpm check`, so on every commit, and as its own step of
   `.github/workflows/check.yml` on every PR into `next-2026` **and** `main`.
   A PR with `draft` content is red.
3. **New content is committed as `approved` once the owner approves it in its
   PR.** Until then the PR stays red. `in-review` and `draft` remain valid
   lifecycle values for work in progress on a branch; they never reach
   `next-2026`. This supersedes D11's sentence that an agent emits `draft`
   insofar as the agent writes `approved` after the owner's approval in the
   PR, never before it.
4. **The generated slots are approved with the rest.** Seven slots per
   language carry `provenance: generated` and `demo: true` (the dummy-content
   rule of `plan/guardrails.md`); the preview renders them, so the owner's
   approval covers them. Their marking stays as it is.
5. **Out of this decision's scope.** The legal family (`content/legal/**`)
   is read by `legal-loader.ts`, which gates on no status: it renders the
   same in every build and keeps `imported` (D10). The `DRAFT` rule for
   specification artefacts under `specs/` (`POL-GRADED-BY-IMPACT`, DEC-0089,
   `check:specs` E15) is untouched: this decision approves *content*, it moves
   no specification status.

## Consequences

- TS-WEB-0007 D11 names this decision; A14 holds unchanged and is now met
  by the shipped tree rather than only by fixtures.
- `state/open.md` row 140 is closed.
- `CONTRIBUTING.md` (`pnpm check` and Continuous Integration) and `README.md`
  (CI) describe the gate.
- `SDR-2026-1112-0002` records the execution of this decision (DEC-0100).
