---
id: DEC-0174
title: Every explain-stage graphic is drawn or photographed and the chat carries no header; the context band is a page's only hand-off to another job and stands after the page's own closing block
status: accepted
date: 2026-10-27
decided_by: jan-henrik.hempel
---

## Context

The owner's review of 2026-10-27 (`plan/reviews/2026-10-27/2026-10-27 Review
Termine veröffentlichen und Dein Kalender.md`) raised four points that this
record settles, tracked as issues #88, #89, #92 and #93:

- **#88** — on `/mitmachen`, the first graphic of path 02 *"Euren Kalender
  verbinden"* and path 03 *"Eure Webseite als Quelle"* is an empty grey panel.
  DEC-0161 §3 had drawn the WhatsApp path and said in so many words that *"the
  calendar and website paths keep their grey state-1 panel; they were not part
  of #26"*. The second graphic of both paths still carried the hatched
  screenshot slot of the drafts (`data-placeholder="calendar-settings-
  screenshot"`, `state/open.md` row 222). `/` renders only the WhatsApp path
  (TS-WEB-0019 D3a), whose three states were already drawn or live.
- **#89** — the WhatsApp chat graphic opens with a paper header (the mark and
  *"Schafe vorm Fenster"*). On the module's light ground it is a white strip
  that *"sieht komisch aus"*.
- **#92** — the one-sentence cross-reference to `/dein-kalender` at the end of
  `/mitmachen`'s path slot (*"Wenn eurem Verein oder eurer Gemeinde ein eigener
  Kalender auf der eigenen Website vorschwebt …, ist das ein anderes Angebot"*)
  is *"an dieser Stelle irgendwie Quatsch und optisch nicht hübsch"*; the hand-off
  follows a few sections later in the context band anyway. It stood there
  because TS-WEB-0022 D9 required it — *placement PROPOSED*, and SRC-0003's brief
  for the page names no such link. Issue #50 (review of 2026-10-12) had asked
  only for better wording of the same sentence.
- **#93** — on `/dein-kalender` the closing block *"Euer Kalender läuft, sobald
  der Code auf eurer Seite steht."* belongs before *"Heute mit einem anderen
  Anliegen hier?"*; *"sonst geht der Conversion-Zusammenhang verloren."* The
  order band → closing came from TS-WEB-0006 D2, FUN-WEB-0005 and FUN-WEB-0006,
  which cite SRC-0001 §2 (line 209) and §7 (line 299).

## Decisions

1. **Every state of every path has its graphic; no explain stage ships a
   placeholder panel** (#88). State 1 of path 02 is a date entered in your own
   calendar, as usual — a window with a week grid, a few dates already in it,
   the new one in `lime-500` with its entry card open and a pointer on the save
   pill (`StageCalendarEntry`). State 1 of path 03 is the dates kept on your
   own website, as usual — a browser window with an empty address pill, the
   site's `violet-500` head, a heading and a list of dates, the last being
   typed with a caret (`StageWebsiteDates`). The registration graphic of both
   paths draws **the same source** in its diagonal slot instead of the hatch
   (`StageRegistration` `source="calendar" | "website"`), so the reader sees
   that source being registered; a real screenshot passed as `screenshotSrc`
   still replaces the drawing. Every drawing follows DEC-0161 §3: inline SVG,
   colours from the brand tokens by class, `ink` neutral black, no dark-green
   fill, no lettering — and **nobody's product**: no Google mark, no product
   colours, because the step says "your calendar", whichever one that is. They
   avoid `himbeere` altogether, so the one-pulse-per-screen rule cannot trip on
   two modules a screen apart. They use `meet`, not `slice`, so a stage box the
   calendar state has grown keeps the whole window on the `lime-100` ground.
   `state/open.md` row 222 is closed with this; row 221 had been closed in
   substance by DEC-0161 and is marked so.
2. **The chat graphic carries no header** (#89). The bubbles alone say "a
   chat"; the chat is still ours and still names no messenger. `StageChat`
   keeps its optional `locale` prop so the call sites stay untouched; it reads
   no localized word any more.
3. **The context band is a page's only hand-off to another job** (#92). The
   `verweis` aside and its content line are removed from `/mitmachen`, and the
   rule that put them there goes with them: TS-WEB-0022 D9 now says *no* hand-off
   sentence to `/dein-kalender` in the page body, A13 asserts its absence, and
   SRC-0017 gains **CG-045**, which makes the band the one hand-off on every page.
   A CTA that is a step of the page's own argument — a scene's, a tier's — is
   not a hand-off. The machine half is `TS-WEB-0006-A20`: no top-level block of
   `main` without a heading of its own whose links all point at jobs the band
   offers. **Issue #50 is superseded**: there is no sentence left to reword.
4. **The page's own closing block precedes the context band, and the band is
   the last block in `main`** (#93) — on every `PageFrame` page, not on
   `/dein-kalender` alone, because the reason is not that page's: a conversion
   standing after the hand-off to other jobs loses the argument it closes.
   `PageFrame` renders closing → band. **One exception:** where the closing
   block is the closing search on `ink` (`/`), it stays the last section — a
   search is not a conversion (TS-WEB-0019 D2), and the second `ink` section is
   legal only as the page's last (SRC-0014 §Page Rhythm, DEC-0117,
   `checkRhythm`). The merged pages are unchanged: there the closing anchor is
   inside the band. The block numbers of TS-WEB-0006 D2 stay the blocks' names
   (code and records cite "block 3" for the band, "block 4" for the closing
   CTA); the order is now 1 · 2 · 4 · 3.
   - This **deviates from SRC-0001** §2 (line 209, *"above the closing CTA"*)
     and §7 (line 299, *"with the context band in front of it"*). DEC-0170
     (issue #86) had recorded the deviation for `/dein-ort` alone, as a named
     exception; the `Deviation:` lines on FUN-WEB-0005 and FUN-WEB-0006 and
     **DEM-0073** are widened to the rule (DEC-0104 §2), not duplicated.
   - `/dein-ort`'s closing module before the band (DEC-0170) is the first
     instance of this rule. `PageFrame`'s `closing.beforeBand` flag, which
     DEC-0170 added for that one page, is removed: the order is the frame's
     default now. SRC-0014 §Module rules keeps its bullet and defers to the
     rule.

## Consequences

- SRC-0014 §Explain module (every state drawn, no placeholder panel, no chat
  header), §Context band and §Page Rhythm (closing before band, band last, the
  band the only hand-off); the contract rows `explain-module` and
  `context-band`.
- SRC-0017 CG-045 and its row in `specs/contracts/copy-contract.md` (CG-044 is
  DEC-0170's *one job, one module, one heading*).
- TS-WEB-0006 D2 (the `/dein-ort` exception paragraph becomes its history),
  D5, D6, A6, A7 and the new A20 (A19 is DEC-0170's); TS-WEB-0022 D4 (*Graphics*,
  *Cross-link*), D9, A13 and the new A22; TS-WEB-0024 D2 and A2.
- FUN-WEB-0005 and FUN-WEB-0006 restated, each with its deviation; DEM-0073.
- Tests: `e2e/page-order.spec.ts` (A6/A7 over every route, A20),
  `e2e/explain-stage.spec.ts` (A22 at 390 and 1280 px on `/` and `/mitmachen`
  in both languages), the stage unit tests, and the page rhythm lists, which
  now append `paper` (closing) before `surface` (band).
- `content/pages/mitmachen/{de,en}.md` lose the cross-reference line;
  `state/content-map.md` row 9 of TS-WEB-0022 is retired.
