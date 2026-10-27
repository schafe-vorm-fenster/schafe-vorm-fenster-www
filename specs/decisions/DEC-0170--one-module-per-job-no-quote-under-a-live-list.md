---
id: DEC-0170
title: One module per job, no proof quote under a live list, no two quotes in a row — `/dein-ort`'s homescreen module is its closing block and the context band follows it; the story stage carries no link back up the page
status: accepted
date: 2026-10-27
decided_by: jan-henrik.hempel
---

## Context

The owner's review of 2026-10-27 (`plan/reviews/2026-10-27/`) raised three
points about the module sequence of `/dein-ort`, all visible in state A
(`?ort=<place with dates>`) and in S0, in both languages:

- **Issue #84.** *"Das Zitat ist ja toll, aber warum steht das als Text unter
  den Terminen? Das ergibt gar keinen Sinn. Vor allem kommt dann ein Zitat als
  Referenz direkt im folgenden Block."* The radius story (story 4,
  `#nearby`) ended on Dr. A. Zschiesche's testimonial, rendered as text under
  the nearby rows; the very next block, the story stage, opens on Elisabeth
  Kurzweg's quote. The cause was a rule, not an instance: TS-WEB-0020 D3 gave
  **every** story a testimonial, "aspect → why it matters → live example →
  testimonial", and story 4's live example is a live list (TS-WEB-0008
  position 2), so the rule put a proof quote under a list of dates by
  construction.
- **Issue #85.** The story stage ("Ein Tag im Dorf") carried an onward link,
  "Was heute bei dir los ist", pointing back up at `#focus-block`. *"Den Link
  nach oben … brauchen wir eigentlich nicht."* SRC-0014 §Story stage asked
  for "the onward action and 'Weiter um …'" in the panel.
- **Issue #86.** *"Warum kommt erst ‚So funktioniert es' mit dem Kalender auf
  den Homescreen, dann ‚Heute mit einem anderen Anliegen hier?' und dann wieder
  ‚Auf den Homescreen legen'? … Das erste und dritte Modul gehören zusammen und
  sind inhaltlich dasselbe."* TS-WEB-0020 D4 gave the goal
  `save-calendar-to-homescreen` three call sites — block 1, the homescreen
  block 2c and the closing block 4 — and TS-WEB-0006 D2 put the context band
  between 2c and 4. The closing block's heading "Einmal antippen, und er ist
  da, wo deine Apps sind." and its button "Kalender von {place} auf den
  Homescreen legen" repeated 2c's job and 2c's own link. The review also
  noted the two platforms in two patterns: iPhone as an open list, Android
  behind a native `details` element whose bare `summary` showed the browser's
  focus box (the polish pass had collapsed Android to halve the block's
  height).

`/` was checked against all three points in both languages and in its place
state: it renders no proof quote under a live list (its proof stream is cards,
not `blockquote`), no story stage and no homescreen block, and its closing
search block on `ink` stays the last section after the band (DEC-0117).
Nothing on `/` changes.

## Decisions

1. **No proof quote under a live list.** A story or module whose example is a
   live list (`value-story` with `exampleVariant="module"`) carries no
   testimonial. `ValueStory` does not render one in that variant even when one
   is handed over, so a regenerated page cannot bring it back. `/dein-ort`'s
   radius story loses the Zschiesche quote; its proof-card slot
   `dein-ort-6-story-radius-demo-testimonial` is removed from both locales and
   the manifest's `proofSlots` drops `dein-ort-6-story-radius` (three slots, one
   per stage story). The quote itself is not rewritten or moved elsewhere: the
   record `zschiesche-gross-kiesow` stays in the hub, unused on this page.
2. **No two quotes in a row.** A section that ends on a quote is not followed by
   a section that carries one. With decision 1 the case on `/dein-ort` is gone;
   the rule stands in SRC-0014 §Page Rhythm for every page.
3. **One module per job: the homescreen module is `/dein-ort`'s closing block.**
   The homescreen instructions and the closing block become one module: the
   heading, the iPhone and the Android instructions, exactly **one** control and
   the permanence promise under it. It is rendered by the shared layout as
   block 4 (`PageFrame`, `closing.beforeBand`) and **the context band follows
   it** — the band is then the last block in `main`, still before the contact
   section and the footer. Per state:
   - **State A:** the instructions name the place; the control is the calendar
     handover "Kalender von {place} auf den Homescreen legen", `data-cta="repeat"`
     — the same goal, target and label as block 1's primary.
   - **S0:** the instructions name the showcase community, as every other S0
     example on the page does; the control is the place search, because S0's
     primary is the search and the closing block repeats it (TS-WEB-0006 D6).
   - **State B:** the conversion is `register-as-publisher`, so the block is the
     publishing offer and carries no homescreen instructions for a calendar
     that is still empty. This settles TS-WEB-0020's open point "the homescreen
     block in state B is [PROPOSED]" in the direction the merge forces: a
     closing block has one job. **To be confirmed by the owner** — it is the one
     consequence the review did not state in words.
   The goal keeps **two** call sites outside the live modules' own links: block
   1 (primary) and block 4 (repeat). The nearby module's "Alle Termine im
   Kalender" link is unchanged.
4. **Which heading the merged module keeps.** *"So landet der Kalender auf
   deinem Homescreen"* (`dein-ort-7-homescreen`, EN *"How the calendar lands on
   your home screen"*). It names what the module contains — instructions — and
   "Einmal antippen" is not literally true of a three-step instruction (CG-033).
   The closing heading *"Einmal antippen, und er ist da, wo deine Apps sind."*
   (`dein-ort-8-permanence`, EN *"One tap, and it sits where your apps sit."*)
   is removed from both locales. No new copy was written: the module's CTA label
   is slot 1's existing primary label, its reassurance slot 8's existing line.
5. **Both platforms in one pattern.** A mono platform label over an open
   numbered list, side by side from `xl`, stacked below. `HowtoBlock` loses its
   `collapsed` prop: no platform hides behind a `details` disclosure. The
   module's height on the phone (≈ 760 px at 390 px in S0) stays inside the
   section budget of polish brief G-4.
6. **The story stage carries no onward action.** Its one control is
   "Weiter um …" (pointer shortcut) beside the hour radios. `StoryStage` loses
   its `action` prop; the slot's "Aktion"/"Action" field is removed from both
   locales.

## Rules amended

- `concept/website-design-system.md` (SRC-0014): §Page Rhythm gains the module
  rules — no proof quote under a live list, no two quotes in a row, one module
  per job, and where a page's closing block is its own last module the context
  band comes after it; §Story stage's panel loses the onward action; a
  §Howto block entry fixes the one pattern for both platforms.
- `concept/website-copy-guide.md` (SRC-0017): CG-044 — one job, one heading:
  a module and the closing block never carry two headings for the same job.
- `TS-WEB-0006`: D2 names `/dein-ort` as the one page whose closing block stands
  before the band; D3's ladder states that a page whose conversion has a module
  of its own repeats it **in** that module, never in a second one; D5's
  position row and A6/A7 carry the exception; new **A19**.
- `TS-WEB-0020`: D1 block table, D2 state table, D3 row 4 (no testimonial),
  §stage (no onward action), D4 (two call sites), A2, A6, A7, A10 amended; new
  **A23**–**A26**; the open point on the homescreen block in state B is closed
  by decision 3 (owner to confirm).
- `TS-WEB-0019`: new **A23** — the module rules hold on `/` as well, checked by
  the same test.
- `specs/contracts/design-system-contract.md`: `value-story`, `story-stage` and
  `howto-block` rows.
- `app/[lang]/dein-ort/page.meta.ts`: `proofSlots` three.
- `FUN-WEB-0005` and `FUN-WEB-0006` record the deviation from SRC-0001 §2/§7
  ("the context band sits below the main argument and above the closing CTA")
  for `/dein-ort`; `DEM-0073` asks the source to follow.

## Section order, before → after

`/dein-ort` and `/en/your-place`, S0 and state A:

- before: focus block · place dates (ink) · `#nearby` radius story **with
  quote** · `#story-stage` (with "Was heute bei dir los ist") · `#homescreen`
  (lime-500, own app link, Android collapsed) · context band · `#closing-cta`
  ("Einmal antippen …", same app link)
- after: focus block · place dates (ink) · `#nearby` radius story · `#story-stage`
  · `#closing-cta` = `#homescreen` module (heading, iPhone + Android, one
  control, reassurance) · context band

State B: `… · #story-stage · #other-place · #closing-cta` (publishing offer)
`· context band`.

`/` and `/en`: unchanged.

## Verification

- `e2e/module-rules.spec.ts` — every route in both languages plus `/dein-ort`
  in state A: no visible proof quote after the last live row of a section, no
  section ending on a quote followed by a section with one, the homescreen
  instructions at most once (TS-WEB-0020-A23, TS-WEB-0019-A23, TS-WEB-0006-A19).
- `e2e/pages/dein-ort.spec.ts` — A24 (one pattern, no `details`), A25 (no link
  back up in the stage), A26 (one module, inside `#closing-cta`, before the
  band, one control), the amended order, A6, A7, A8.
- `src/components/value-story/value-story.test.tsx` — no blockquote under a
  live-module example.
