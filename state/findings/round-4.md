# Findings — Round 4 (editorial review)

One persona run so far: `round-4-chaos-editorial-reviewer.md` — a
retroactive capture of the owner's own voice-memo walk of `/` and
`/dein-ort`, logged as this round's first (and, to date, only) session
because the gated process was closed when the walk happened
(`state/status.md`: closed after M1; `DEC-0149` reopens it for this
persona).

Eight findings, **0 critical · 2 high · 3 medium · 3 low**. PM triage
(`DEC-0149`) split them three ways:

- **spec-gap** (F-4-1, F-4-2, F-4-3, F-4-5, F-4-7) — `TS-WEB-0020` gained a
  category column, `A14` and `A15` this round; F-4-1 and F-4-5 need a
  designer's value/pattern before they can become criteria
  (`state/open.md` rows 288, 289); F-4-3 needs the owner's editorial call
  on which quote fits which story (`state/open.md` row 290).
- **drift** (F-4-4) — `TS-WEB-0020` D3/A6 said testimonials would not
  render unverified; they do, by a later, undocumented decision. Recorded
  now: deviation on D3, A6 marked superseded, `DEM-0069` opens the
  clearance debt.
- **upstream** (F-4-6) — traced to source (a temporary instrumentation
  probe, added and reverted this round) rather than guessed at: two real
  `events-api` entries for Rubkow carry a literal placeholder title. Not
  this repository's code; `DEM-0070` raised against the content directly.

F-4-8 turned out not to be new: the kicker half of the "choppy copy"
complaint is `DEC-0148`, already fixed, sitting unmerged in PR #11.

**Round decision:** F-4-2 and F-4-4 fix-now (spec + AC, this round);
F-4-7's AC written this round, its implementation and F-4-6's upstream fix
open-list; F-4-1, F-4-3, F-4-5 open-list, blocked on the owner/a designer;
F-4-8 needs no new work, only PR #11 merged.

Full findings: `round-4-chaos-editorial-reviewer.md`.
