---
id: DEC-0187
title: Every photograph shows its credit behind the © control, always in the same form; the credits section only points there
status: accepted
date: 2026-10-29
decided_by: jan-henrik.hempel
---

## Context

DEC-0168 put the credit of place photographs and of a few inventory images
behind a © control in the photograph's corner; the other photographs were
credited only in a list on `/rechtliches#bildnachweise`. That list named single
photos by page and slot, which the owner's review of 2026-10-29 found to make
no sense to a reader ("viel zu viele Einzelnachweise").

## Decision

1. **Every placed photograph carries the © control**, on heroes, story stages,
   media frames and portraits alike. Generated stand-ins and unplaced slots
   carry none.
2. **One form**: `Foto: <title, linked to the source page> – <author, licence,
   source>`, or `Foto: <credit>` where the work has no title. The inventory
   carries it: `credit` (required for every placed `real` or `ai-edited` entry,
   checked by the schema), `credit_title`, `credit_url`. `imageCredit()` renders
   it for every call site.
3. **Where a place photograph covers a stage, its credit stands alone**; the
   stage's own © control gives way.
4. **`/rechtliches#bildnachweise` is short**: it says the credit stands at the
   photo behind the © control, in one form, and keeps only what is not per
   photo (own photographs, place photographs via Wikimedia Commons, AI-edited
   marking, crops). The list of single photographs is gone.

## Consequences

A photograph without a `credit` fails `check:content`. The legal text no
longer mirrors the `images:` blocks. Supersedes the "credit rendered once on
`/rechtliches`" rule of the `licence` field comment and DEC-0168's "only where
the rights holder asks for one".
