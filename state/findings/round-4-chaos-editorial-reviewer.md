# Chaos Round 4 — Editorial Reviewer

**Source: chaos:editorial-reviewer**

Retroactive capture: the owner's own voice-memo walk of the homepage and
`/dein-ort` (2026-09-27/28), on
`https://schafe-vorm-fenster-1cijaynnp-schafe-vorm-fenster.vercel.app`
(preview `dpl_ABqCq1tGRTKsVyfbqdBMPzMfM4Ex`, built 2026-09-28), captured as
this persona's first round because no playbook was running when the walk
happened — `state/status.md`: the gated process closed after M1, and
everything since has run outside it.

Each finding below was re-verified where possible, either against that
preview (bypass header) or against current `next-2026` locally, not taken
on the transcript's word alone (`measure-dont-claim`).

**Triage legend** (DEC-0149): **spec-gap** — no criterion existed, one is
written now; **drift** — a criterion existed and the shipped/tested
behaviour silently diverged from it; **upstream** — not a defect in this
repository's code.

---

## F-4-1 — Single-column content runs full-bleed at the desktop reference viewport

- Severity: medium
- Source: chaos:editorial-reviewer
- Where: `/` hero (headline, search field), `/dein-ort` hero, both at 1280×800
- Steps: open either route at 1280×800; measure the `h1` and the search
  field's bounding box.
- Expected: a readable single-column measure, independent of the photo
  surface's own full-bleed width.
- Observed: `h1` 1214 px (95 % of the 1280 px viewport), search field
  1091 px. No AC in `TS-WEB-0006` or SRC-0014 bounds single-column content
  width; the desktop reference viewport is only checked for horizontal
  overflow (`TS-WEB-0017-A9`), which this passes while still reading too
  wide.
- Triage: **spec-gap**, needs a design value — `state/open.md` row 288.
- Round decision: open-list (blocked on a designer's content-measure value).

## F-4-2 — A story's live example doesn't share its story's topic

- Severity: high
- Source: chaos:editorial-reviewer
- Where: `/dein-ort?ort=schlatkow`, story 2 ("Die Ratssitzung, bevor sie
  stattfindet")
- Steps: open the route, scroll to the second value story, read its example
  box.
- Expected: `TS-WEB-0020` D3 names what each story's example "asks for" (row
  2: "an official/municipal date").
- Observed: the rendered example is a "Frauensport" event, category
  "Sonstiges"/`neighbouring`, tagged "GEMEINDELEBEN" — neither the
  prose-described topic nor, as measured, even internally consistent
  between its own category id and its own label.
- Triage: **spec-gap** — D3 named the requirement in prose, nothing checked
  it. Fixed: `TS-WEB-0020` D3 gained an explicit category column and `A14`,
  instrumented as `test.fixme` in `e2e/pages/dein-ort.spec.ts` (same
  not-ready pattern `A5` already uses) — the criterion exists and is
  tracked; it will not pass until the render is made to match it.
- Round decision: fix-now (spec + AC written this round; implementation
  against `A14` is the next round's work).

## F-4-3 — A quote's content doesn't fit its story, though its id resolves correctly

- Severity: medium
- Source: chaos:editorial-reviewer
- Where: `/dein-ort?ort=schlatkow`, stories 2 and 4
- Steps: compare each story's quote text against its own aspect.
- Expected: D3's testimonial candidate per story reads as support for that
  story's specific claim.
- Observed: every quote resolves to exactly the proof id D3's own table
  names for its story (`A5`, `A6` both hold) — this is **not** a wrong
  pairing bug. Dr. Zschiesche's quote (reach/distribution) sits under the
  council-meeting story; Holger Wendt's quote (administrative self-service)
  sits under the radius story, where the owner's review reads it as a
  better fit for the council-meeting story instead.
- Triage: **spec-gap**, editorial judgment — no mechanical criterion can
  grade "does this quote's content argue this story's point." `state/open.md`
  row 290.
- Round decision: open-list (owner confirms the swap or names the right
  pairing).

## F-4-4 — Testimonials render despite `usage_rights: unverified`, undocumented against the written criterion

- Severity: high
- Source: chaos:editorial-reviewer
- Where: `/dein-ort?ort=schlatkow`, all four value stories; `TS-WEB-0020`
  D3/A6
- Steps: read `TS-WEB-0020` D3 and A6 as written; open the route; check
  `node_modules/@schafe-vorm-fenster/proof/*.proof.md` for the four
  rendered proof ids' `usage_rights`.
- Expected (as written): "with every testimonial uncleared… no quote
  component… anywhere."
- Observed: all four installed proof records are still `usage_rights:
  unverified`, and all four stories render a full `<blockquote>` with name
  and attribution, none carrying `data-demo`. `e2e/pages/dein-ort.spec.ts`'s
  own comment confirms this is intentional — a later decision shipped them
  pre-clearance — but neither the tactical spec nor a `Deviation:`/DEM
  record followed (DEC-0104's own mechanism, not applied here).
- Triage: **drift**. Fixed this round: `TS-WEB-0020` D3 carries the
  deviation, A6 is marked superseded, `DEM-0069` opens the clearance debt.
- Round decision: fix-now (spec corrected; the clearance itself is
  pre-go-live hardening work, already tracked).

## F-4-5 — Three near-identical sections stack full-weight instead of consolidating

- Severity: low
- Source: chaos:editorial-reviewer
- Where: `/dein-ort?ort=schlatkow`, value stories 1–3
- Steps: scroll through all three stories at any viewport.
- Expected: per the owner's review — rhythm, not repetition; a denser,
  consolidated presentation (slider/score-strip) for a themed set.
- Observed: three full-width, full-weight sections in a row, structurally
  correct per `TS-WEB-0020-A4` (count, alternating grounds) but no pattern
  in SRC-0014 for consolidating a themed set exists to build against.
- Triage: **spec-gap**, needs a design pattern. `state/open.md` row 289.
- Round decision: open-list.

## F-4-6 — The nearby module renders two byte-identical placeholder rows

- Severity: medium
- Source: chaos:editorial-reviewer
- Where: `/dein-ort?ort=schlatkow`, story 4 ("Was in fünfzehn Minuten
  Entfernung passiert"), the "Diese Woche in der Nähe" box
- Steps: open the route; inspect the two rows under the nearby heading.
- Expected: distinct, plausible rows — the mock rule (`plan/guardrails.md`)
  requires a mocked module to show "the full experience," never a hole; a
  real module requires real, distinct content.
- Observed: both rows read "hier könnte dein Termin stehen," same place
  (Rubkow), same date, same time, same (`unknown`) category.
  **Root-caused, not assumed**: a temporary instrumentation probe on
  `nearbyEvents()` (added and reverted the same session) showed
  `tier: "live"`, real event UUIDs — this is genuinely live `events-api`
  data for Rubkow, not this repository's mock fixtures (`DEMO_TITLES` and
  `demo-data.ts`'s own title list were both checked and ruled out first;
  neither contains this string).
- Triage: **upstream**. Not a defect in this repository — `DEM-0070` raised
  against the two events' content directly.
- Round decision: open-list (upstream, not this repo's work).
- Added to `TS-WEB-0020-A15` as the duplicate-row half of the new
  criterion (`test.fixme` in `e2e/pages/dein-ort.spec.ts`, same pattern as
  `A5`), so a future recurrence — same or different upstream cause — fails
  the build rather than waiting for another manual walk.

## F-4-7 — Nearby rows name a place but not its distance

- Severity: low
- Source: chaos:editorial-reviewer
- Where: `/dein-ort?ort=schlatkow`, same module as F-4-6
- Steps: read a nearby row's meta line.
- Expected (owner's review): "Rubkow (10 Minuten von Schlatkow entfernt)" —
  place plus distance from the anchor.
- Observed: place name only ("Rubkow · 05:00"); `TS-WEB-0020-A3` only ever
  required a place name, never a distance.
- Triage: **spec-gap**, concretely specifiable (`haversineKm` is already
  computed for the 15 km cut — the number exists, it is just not surfaced).
  Fixed this round as the other half of `A15`.
- Round decision: open-list (spec written; implementation is the next
  round's work, alongside F-4-6's upstream fix).

## F-4-8 — Kicker/title/body read as separate fragments, not flowing prose

- Severity: low
- Source: chaos:editorial-reviewer
- Where: `/dein-kalender`'s value-story-style modules (the owner's original
  transcript); the kicker half of the same defect reproduces on `/dein-ort`
  today
- Steps: read a section's kicker, title and opening sentence together, as
  one continuous read.
- Expected: one flowing argument.
- Observed, reproduced on the given preview: every value story's kicker
  still reads "WAS HILFT EUCH DAS?" — the generic, repeated phrase
  `DEC-0148` (2026-09-27) already replaced with a per-section topline
  (`Versorgung`, `Gemeindeleben`, `Kultur & Tourismus`, `Was ein Dorf
  braucht`). **Not a new defect**: `DEC-0148`'s fix sits in PR #11
  (`10-fix-repeated-kicker`), open and unmerged as of this round, so the
  preview under review predates it. The **body prose** the owner
  specifically asked to make flow ("Wann der Bäckerwagen kommt und wo er
  hält, ist keine Nebensache…") is already exactly that sentence in the
  live artifact — someone had already implemented that half.
- Triage: not a new finding — an already-fixed defect, not yet deployed.
  Noted here so the round doesn't re-discover it a third time.
- Round decision: none (resolve by merging PR #11, not by new work).

---

## Summary for triage

| # | Severity | Bucket | This round's action |
| --- | --- | --- | --- |
| F-4-1 | medium | spec-gap | `state/open.md` row 288 — needs design |
| F-4-2 | high | spec-gap | `TS-WEB-0020` D3 + `A14` written |
| F-4-3 | medium | spec-gap | `state/open.md` row 290 — needs owner judgment |
| F-4-4 | high | drift | `TS-WEB-0020` D3 deviation + `A6` superseded + `DEM-0069` |
| F-4-5 | low | spec-gap | `state/open.md` row 289 — needs design |
| F-4-6 | medium | upstream | `DEM-0070`; `TS-WEB-0020-A15` (duplicate-row half) |
| F-4-7 | low | spec-gap | `TS-WEB-0020-A15` (distance half) written |
| F-4-8 | low | — | not new; unblocks on merging PR #11 |
