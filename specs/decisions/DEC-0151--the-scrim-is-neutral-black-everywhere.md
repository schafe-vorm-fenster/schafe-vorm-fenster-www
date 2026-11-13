---
id: DEC-0151
title: The scrim is neutral black, finally and everywhere — the tinted scrim leaves the boards, the dead tone prop leaves the code, and check:brand keeps both out
status: accepted
date: 2026-10-07
decided_by: jan-henrik.hempel
---

## Context

Decision 5 (2026-09-23), corrected by DEC-0105 §1, made the scrim over a
photograph neutral black: two gradients from `color.scrim.*`, ceiling 0.72.
It retired the dark-green, `ink`-tinted scrim and the violet variant. The
component followed with DEC-0116. The decision had not reached every artefact
a generator reads, though:

- `concept/v2.0/Style Guide.dc.html` still drew the retired ladder (`ink`
  at 0.55 → 0.20 → 0.86 → 0.96). Its caption described it as the rule.
- `concept/v2.0/UI Varianten.dc.html` drew seven `ink`-tinted and two
  `violet`-tinted scrims.
- The desktop-grid input of 2026-10-07 (DEC-0150) arrived with an
  `ink`-tinted scrim again.
- `photo-surface` and `hero-block` still accepted a `gradient?: "ink" |
  "violet"` prop. It was ignored, but its type invited the request.
- No check looked at the boards. `check:brand` A5 forbids a colour literal in
  code, but a board is HTML outside its walk.

The owner, on 2026-10-07: neutral black is decided, the dark-green tint is
wrong, and it may not appear in any artefact again.

## Decision

1. **Neutral black is the only scrim.** A gradient over a photograph that
   carries `ink` or `violet` is a defect wherever it appears: code, board,
   sketch, or generated page. SRC-0014 §The scrim states this as final.
2. **Design input is imported with its scrim replaced.** A board or sketch
   that arrives with a tinted scrim is adopted for its other content. Its
   scrim is rewritten to the ladder on import, and the guide says so at the
   section that cites it.
3. **The boards are corrected.** All twelve tinted scrims in the four
   `concept/v2.0` boards are now the ladder's two gradients: top band
   `.35 → 0` over 16 %, reading band `0` at 38 %, `.38` at 58 %, `.72` at the
   bottom. Four `ink` pills over photographs take `scrim.38`, the tint of the
   header primitive. The Style Guide caption and one variant description no
   longer describe the retired ladder. Box shadows tinted with `ink` are not
   scrims and are left alone.
4. **The dead prop is removed.** `gradient` is gone from `photo-surface` and
   `hero-block`. No call site passed it, and the typecheck confirms nothing
   depended on it.
5. **`TS-WEB-0017-A22` keeps it out.** `check:brand` scans every gradient in
   `app/`, `src/`, `e2e/`, `scripts/` and `concept/v2.0/*.dc.html`. It fails
   one that names `ink` or `violet`, whether as an alpha colour, as a
   `color-mix()`, or as a token `var()`. The criterion arrived with its
   instrument and its tests (`scripts/check-brand.test.ts`), so the coverage
   backlog does not grow (TS-WEB-0017 D6c).

## Consequences

- SRC-0014 §The scrim, §Layout Grid and *Open decisions* are updated. The
  paragraph that called the component rewrite "owed" now records it as done.
- `concept/v1.0/` is the archived concept stage and is not scanned. It
  carries no tinted gradient today.
- The guard catches the shape a board or a stylesheet writes. A tint
  produced some other way, such as a photograph pre-darkened in green,
  remains a matter for the imagery review (`TS-WEB-0017-A15`).
