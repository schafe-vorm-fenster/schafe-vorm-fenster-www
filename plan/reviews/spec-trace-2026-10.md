# Spec trace — reviews of 2026-10-12 and 2026-10-27

For every issue the two owner reviews raised and that is closed, this file names the pull request that
solved it, the decision record that carries it, the specification sections it changed, and the acceptance
criteria with the tests that check them. The still-open points are listed at the end of each review, so
the whole picture is in one place.

The trace was built on 2026-10-28 from `origin/next-2026` at `ddd20667` and from GitHub, not from memory:
issue comments and labels, merged pull requests into `next-2026` with their merge commits, the diff of each
merge commit (`git diff <merge>^1 <merge>`), `grep` for the issue number, the PR number and the DEC id in
`specs/` and the two local guides, and for every criterion `grep` for its id in the files the runners
actually run (the same scan set as `check:specs` W3: both Vitest configs, `e2e/**/*.spec.ts`, the meters in
the `check` chain).

**CI** follows [DEC-0180](../../specs/decisions/DEC-0180--ci-runs-technical-tests-and-a-smoke-the-full-suite-on-demand.md):
a criterion is *CI* when at least one test naming it runs in `pnpm check` (unit, integration, static
tests, meters) or in `pnpm e2e:technical` / `pnpm e2e:smoke`. *full* means every test naming it lives in a
Playwright spec outside those selections, so it runs only in the on-demand full suite
(`full-e2e.yml` or locally). In the criteria cells, a test without a marker runs in CI; *(full)*,
*(fixme)*, *(superseded)* and *(manual check)* say otherwise.

This file is not a review: `check:reviews` reads only `plan/reviews/<date>/<date> Review …md`.

## Summary

| | Count |
| --- | --- |
| Issues traced (closed) | **51** — 21 from 12.10., 29 from 27.10., 1 follow-up ([#59](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/59)) |
| Issues still open from the two labels | 20 |
| Pull requests that solved them | 19 |
| Decision records carrying them | 20 (DEC-0154 to DEC-0176, except DEC-0157, DEC-0164, DEC-0165) |
| Acceptance criteria traced to these issues | **95** |
| … with a test that runs in CI | 25 |
| … with tests only in the on-demand full suite | **61** |
| … without any test | **3** (`TS-WEB-0023-A13`, `TS-WEB-0027-A11`, `TS-WEB-0027-A7`) |
| … with a test that is `test.fixme` | 1 (`TS-WEB-0024-A22`) |
| … superseded (row kept, nothing to run) | 4 |
| … level `manual`, no attestation yet | 1 (`TS-WEB-0028-A14`) |
| Follow-up PRs without a review issue | 14, with 7 decision records and 12 further criteria |

## Findings

1. **No dangling criterion id.** Every `TS-WEB-####-A#` named in an issue, a PR body, a decision record or a
   spec file is defined in an `## Acceptance criteria` table (510 defined, 0 undefined). Every Q, DEM, CG
   and DEC id in a closing comment exists.
2. **Three criteria have no test at all.**
   `TS-WEB-0023-A13` was amended by DEC-0163 in PR #68 (for [#59](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/59)). Only
   `app/[lang]/mitmachen/registrieren/register-flow.tsx` names it, and that file is not a test.
   `TS-WEB-0027-A7` and `TS-WEB-0027-A11` (no empty slot) were amended by PR #117 (DEC-0175, [#105](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/105)),
   and no test names either one. `pnpm check:coverage` ([state/coverage.md](../../state/coverage.md))
   agrees. Among the 95 traced criteria it lists exactly six as open (MISSING): these three, the two
   superseded rows `TS-WEB-0019-A14` and `TS-WEB-0028-A7`, and the manual `TS-WEB-0028-A14`. It counts every
   other one as VERIFIED or METERED, including the `fixme` case `TS-WEB-0024-A22`, because its test title
   carries the id.
3. **61 of 95 criteria run only in the on-demand full suite.** Since DEC-0180 (PR #122,
   2026-10-28) CI runs `pnpm check`, `e2e:technical` and `e2e:smoke`. The criteria checked by
   `e2e/pages/*` and by the design and rule guards (`module-rules`, `module-designs`, `block-gaps`,
   `cta-visible`, `explain-*`, `embed`, `place-photo`, `photo-credit`, …) are no longer checked on a
   change. For most of the 27.10. issues this is the only instrument. Examples: [#28](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/28)'s comment says
   "A29 passes on every route", and `TS-WEB-0017-A29` now runs only on demand. [#90](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/90)/[#108](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/108)'s
   spacing rule `TS-WEB-0017-A31` (`block-gaps`) also runs only on demand.
4. **One criterion waits behind `test.fixme`:** `TS-WEB-0024-A22` (no test date in the widget). This is
   intended until schafe-vorm-fenster/portalize#144 is deployed. [#97](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/97) stays open for it.
5. **Superseded criteria are still named as evidence.** [#47](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/47)'s comment names `TS-WEB-0022-A18`,
   which is superseded by `TS-WEB-0022-A20` (the trace lists both). `TS-WEB-0019-A14` (by A18),
   `TS-WEB-0020-A6` and `TS-WEB-0028-A7` (by A15) are further superseded rows the trace runs into. They
   are counted separately and not as gaps.
6. **One manual criterion is open:** `TS-WEB-0028-A14` (press links open in a new tab). It is level `manual`, and
   [manual-checks.md](../../specs/verification/manual-checks.md) holds no attestation yet. Its rule is
   machine-checked anyway by `TS-WEB-0016-A24/A25` (`external-links`, CI).
7. **Seven closed issues have no acceptance criterion that names them**: [#26](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/26), [#40](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/40), [#43](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/43), [#50](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/50), [#103](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/103), [#104](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/104), [#106](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/106).
   All of them changed the spec through their PR. [#26](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/26) (drawn WhatsApp graphics) is cited by
   `explain-stage.test`. [#40](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/40) (band wording), [#103](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/103), [#104](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/104) and [#106](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/106)
   (Über uns copy, DEC-0175 §2) are copy changes with no criterion. [#43](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/43) (hero photograph) is carried by
   Q-0092 and the image credits. [#50](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/50) was closed as superseded by #92/PR #115 and has no PR of its own.
8. **No issue was closed without a spec change.** Every solving PR changed at least one file under
   `specs/` or one of the two guides.
9. **Duplicate ids: none now.** 510 criteria, 171 decision records, and the Q, DEM and CG registers are
   all unique. Two older problems remain:
   - CG-044/CG-045 were each assigned twice when PRs #111, #115 and #117 merged in parallel. PR #120
     renumbered DEC-0175's rules to CG-046/CG-047. **[#104](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/104)'s closing comment still cites CG-044 and
     CG-045**, which now name other rules ("one job, one module, one heading" and "the context band is the
     only hand-off"). The trace uses CG-046/CG-047.
   - `DEC-0157` was never assigned (DEC-0156 is followed by DEC-0158), and
     `specs/traceability/identifier-map.md` does not record the gap.
10. **Open issues named by merged PRs.** [#51](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/51) is named by PR #116, which states that "the didactics
    stay with #51". [#52](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/52) and [#97](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/97) are named by PR #114, which fixed the website side only. All
    three are open on purpose. Outside the two labels, [#8](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/8) and [#10](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/10) are still open although PRs
    #9 and #11 into `next-2026` (2026-10-07) fixed them.
11. **The 12.10. intake did not merge into `next-2026` directly.** PR #53 (DEC-0154, DEC-0155,
    Q-0086–Q-0093, `TS-WEB-0017-A28/A29`) merged into `story-stage` and reached `next-2026` with PR #17
    (`fee84fcd`).

## Review of 2026-10-12

Review text, designs and the point-by-point mapping: [2026-10-12/](2026-10-12/),
[spec-impact.md](2026-10-12/spec-impact.md). Intake: PR [#53](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/53) (merge `2b00fc27` into
`story-stage`, carried into `next-2026` by PR #17), decision records
[DEC-0154](../../specs/decisions/DEC-0154--the-review-of-2026-10-12.md) and
[DEC-0155](../../specs/decisions/DEC-0155--ink-is-neutral-black-and-reviews-become-tasks.md), questions
Q-0086 to Q-0093. Tracking issue: [#54](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/54).

### PR [#60](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/60) — Contact section tidied after the owner's design (#41)
Merge commit `3a515611`, merged 2026-10-13. 

| Issue | PR | DEC | Spec sections | Criteria → tests | CI | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [#41](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/41) Kontaktmodul aufgeräumter gestalten (neues Design)<br><sub>Design · übergreifend</sub> | [#60](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/60) `3a515611` | [DEC-0155](../../specs/decisions/DEC-0155--ink-is-neutral-black-and-reviews-become-tasks.md), [DEC-0160](../../specs/decisions/DEC-0160--no-dark-green-fill-and-the-outlined-secondary.md) | design-system-contract `contact-section`; Q-0088; SRC-0014 §Contact section, tidied | `TS-WEB-0017-A29` → cta-visible, language-switch *(full)* | 0/1 CI · 1 full suite only | closed 2026-10-13 |

**Spec changed by PR #60:** SRC-0014 §Contact section, §Contact section, tidied; design-system-contract §1 manifest.

Closing comments:

- #41: „Umgesetzt in #60, gemergt auf next-2026.“

### PR [#61](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/61) — Context band as link cards; closing heading without "Dann" (#39, #40)
Merge commit `b87f1b02`, merged 2026-10-13. Decision record added: [DEC-0156](../../specs/decisions/DEC-0156--a-link-card-is-a-control.md). 

| Issue | PR | DEC | Spec sections | Criteria → tests | CI | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [#39](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/39) Kontextband „Heute mit einem anderen Anliegen hier?“ nach neuem Des…<br><sub>Design · übergreifend</sub> | [#61](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/61) `b87f1b02` | [DEC-0156](../../specs/decisions/DEC-0156--a-link-card-is-a-control.md) | Q-0087 | `TS-WEB-0017-A35` → context-band *(full)*<br>tests citing the issue: context-band | 0/1 CI · 1 full suite only | closed 2026-10-13 |
| [#40](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/40) Kontextband-Aufforderung: „Schau nach, was bei dir los ist.“ statt…<br><sub>Text/Didaktik · übergreifend</sub> | [#61](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/61) `b87f1b02` | [DEC-0156](../../specs/decisions/DEC-0156--a-link-card-is-a-control.md) | — | — | — | closed 2026-10-13<br>⚑ no criterion names it; no spec line cites it |

**Spec changed by PR #61:** SRC-0014 §Context band, §Shape and Space; design-system-contract §1 manifest; TS-WEB-0006 D5; Q-0087.

Closing comments:

- #39: „Umgesetzt in #61 (DEC-0156), gemergt auf next-2026.“
- #40: „Umgesetzt in #61, gemergt auf next-2026.“

### PR [#62](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/62) — Pin brand-design 2.9.0, drop dark-green fills, outline the light-ground secondary (DEC-0160)
Merge commit `6d4b2734`, merged 2026-10-13. Decision record added: [DEC-0160](../../specs/decisions/DEC-0160--no-dark-green-fill-and-the-outlined-secondary.md). 

| Issue | PR | DEC | Spec sections | Criteria → tests | CI | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [#19](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/19) Terminansicht unter dem Foto ist noch dunkelgrün, entschieden war n…<br><sub>Design · Startseite</sub> | [#62](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/62) `6d4b2734` | [DEC-0155](../../specs/decisions/DEC-0155--ink-is-neutral-black-and-reviews-become-tasks.md), [DEC-0160](../../specs/decisions/DEC-0160--no-dark-green-fill-and-the-outlined-secondary.md) | TS-WEB-0020 §Owed by the owner's review of 2026-10-12 (DEC-0154); Q-0090 | `TS-WEB-0017-A28` → check-brand.test, check:brand | CI | closed 2026-10-13 |
| [#28](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/28) Buttons „Jetzt kostenlos anmelden“ und „Flyer per WhatsApp schicken…<br><sub>Design · Startseite · Termine veröffentlichen</sub> | [#62](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/62) `6d4b2734` | [DEC-0155](../../specs/decisions/DEC-0155--ink-is-neutral-black-and-reviews-become-tasks.md), [DEC-0160](../../specs/decisions/DEC-0160--no-dark-green-fill-and-the-outlined-secondary.md), [DEC-0162](../../specs/decisions/DEC-0162--ueber-uns-in-chapters-and-the-two-home-photographs.md) | Q-0091 | `TS-WEB-0017-A29` → cta-visible, language-switch *(full)*<br>tests citing the issue: cta-visible | 0/1 CI · 1 full suite only | closed 2026-10-13 |
| [#57](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/57) Dunkelgrüne Füllungen (lime-700 bis lime-950) als Hintergrund entfe…<br><sub>Design · übergreifend</sub> | [#62](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/62) `6d4b2734` | [DEC-0155](../../specs/decisions/DEC-0155--ink-is-neutral-black-and-reviews-become-tasks.md), [DEC-0160](../../specs/decisions/DEC-0160--no-dark-green-fill-and-the-outlined-secondary.md) | — | `TS-WEB-0017-A30` → check-brand.test, check:brand | CI | closed 2026-10-13 |

**Spec changed by PR #62:** SRC-0014 §Archive — the old world, §Button, §Do Not, §Event-status badge, §Lime — the surface colour, §Neutrals, §Open decisions, §Shape and Space; design-system-contract §2 composition, §What already suffices; TS-WEB-0017 D3; Q-0091.

Closing comments:

- #19: „Fixed in #62 (merged into next-2026): the pin moved to brand-design 2.9.0, where ink is #000000, and the interim override is gone.“
- #28: „Fixed in #62 (DEC-0160, Q-0091): on a light ground the secondary is transparent with a 2 px ink border and an ink label.“
- #57: „Fixed in #62 (DEC-0160): no fill uses lime-700…950 any more.“

### PR [#63](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/63) — Footer on ink with segmented language switch and copyright line (#42)
Merge commit `34b95e4a`, merged 2026-10-13. Decision record added: [DEC-0158](../../specs/decisions/DEC-0158--the-footer-on-ink-and-the-segmented-language-switch.md). 

| Issue | PR | DEC | Spec sections | Criteria → tests | CI | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [#42](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/42) Footer mit Impressum-Links nach neuem Design umsetzen<br><sub>Design · übergreifend</sub> | [#63](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/63) `34b95e4a` | [DEC-0158](../../specs/decisions/DEC-0158--the-footer-on-ink-and-the-segmented-language-switch.md) | TS-WEB-0001 D5; Q-0090 | `TS-WEB-0001-A12` → language-switch, language-switch.test<br>`TS-WEB-0017-A41` → check:contrast, footer, language-switch<br>`TS-WEB-0017-A42` → footer *(full)* (via PR) | 2/3 CI · 1 full suite only | closed 2026-10-13 |

**Spec changed by PR #63:** SRC-0014 §Site footer; design-system-contract §1 manifest; TS-WEB-0001 D5, §Free for the generator.

Closing comments:

- #42: „Umgesetzt in #63 (DEC-0158), gemergt auf next-2026.“

### PR [#64](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/64) — Explain module: no truncation, swipe + arrows, drawn WhatsApp graphics; AI-edited /mitmachen hero
Merge commit `8ffea96c`, merged 2026-10-13. Decision record added: [DEC-0161](../../specs/decisions/DEC-0161--explain-module-never-truncates-swipes-and-draws.md). 

| Issue | PR | DEC | Spec sections | Criteria → tests | CI | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [#26](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/26) WhatsApp-Modul: gute Grafiken statt Platzhalter einbauen (TODO)<br><sub>Design · Startseite</sub> | [#64](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/64) `8ffea96c` | [DEC-0161](../../specs/decisions/DEC-0161--explain-module-never-truncates-swipes-and-draws.md), [DEC-0174](../../specs/decisions/DEC-0174--every-stage-graphic-drawn-and-the-band-closes-the-page.md) | — | — tests citing the issue: explain-stage.test | — | closed 2026-10-13<br>⚑ no criterion names it; no spec line cites it |
| [#27](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/27) WhatsApp-Modul auf Smartphone: horizontal wischen und Pfeil-Buttons…<br><sub>Design · Funktion/Technik · Startseite</sub> | [#64](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/64) `8ffea96c` | [DEC-0161](../../specs/decisions/DEC-0161--explain-module-never-truncates-swipes-and-draws.md) | TS-WEB-0022 §The render form is fixed, and it is the explain module | `TS-WEB-0022-A21` → explain-module *(full)* | 0/1 CI · 1 full suite only | closed 2026-10-13 |
| [#43](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/43) Mitmachen-Bühne: überarbeitetes Foto einsetzen (Qualität, Kontrast,…<br><sub>Design · Termine veröffentlichen</sub> | [#64](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/64) `8ffea96c` | [DEC-0161](../../specs/decisions/DEC-0161--explain-module-never-truncates-swipes-and-draws.md) | Q-0092 | — | — | closed 2026-10-13<br>⚑ no criterion names it |
| [#47](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/47) Erklärmodul „Euren Kalender verbinden“: Texte werden mit „…“ abgesc…<br><sub>Design · Funktion/Technik · Termine veröffentlichen</sub> | [#64](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/64) `8ffea96c` | [DEC-0155](../../specs/decisions/DEC-0155--ink-is-neutral-black-and-reviews-become-tasks.md), [DEC-0161](../../specs/decisions/DEC-0161--explain-module-never-truncates-swipes-and-draws.md) | CG-025 | `TS-WEB-0022-A18` → explain-module *(superseded)*<br>`TS-WEB-0022-A20` → explain-module *(full)*<br>tests citing the issue: explain-module | 0/1 CI · 1 full suite only · 1 superseded | closed 2026-10-13 |

**Spec changed by PR #64:** SRC-0014 §Explain module, §The ladder is fixed, and the motif carries the rest, §Two layouts, and the breakpoint decides which; design-system-contract §1 manifest; TS-WEB-0022 §The render form is fixed, and it is the explain module; Q-0092.

Closing comments:

- #26: „Umgesetzt in #64, gemergt auf next-2026.“
- #27: „Umgesetzt in #64, gemergt auf next-2026.“
- #43: „Umgesetzt in #64, gemergt auf next-2026.“
- #47: „Umgesetzt in #64, gemergt auf next-2026.“

### PR [#66](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/66) — Home stage: compact search, keep it with a place, no counter, hand-off row (#20 #23 #24 #25)
Merge commit `109178e9`, merged 2026-10-13. Decision record added: [DEC-0159](../../specs/decisions/DEC-0159--the-home-stage-is-less-full.md). 

| Issue | PR | DEC | Spec sections | Criteria → tests | CI | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [#20](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/20) Ortsbühne ist zu voll: Hinweistexte weglassen, Standort direkt unte…<br><sub>Text/Didaktik · Design · Startseite</sub> | [#66](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/66) `109178e9` | [DEC-0159](../../specs/decisions/DEC-0159--the-home-stage-is-less-full.md) | TS-WEB-0020 §Owed by the owner's review of 2026-10-12 (DEC-0154); TS-WEB-0019 D2; SRC-0014 §Search field | `TS-WEB-0019-A17` → pages/home *(full)*<br>`TS-WEB-0020-A18` → pages/dein-ort *(full)*<br>tests citing the issue: pages/dein-ort | 0/2 CI · 2 full suite only | closed 2026-10-13 |
| [#23](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/23) Ortsbühne mit gewähltem Ort wirkt langweilig: Suchfeld „Anderen Ort…<br><sub>Design · Startseite</sub> | [#66](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/66) `109178e9` | [DEC-0159](../../specs/decisions/DEC-0159--the-home-stage-is-less-full.md) | TS-WEB-0020 §Owed by the owner's review of 2026-10-12 (DEC-0154); TS-WEB-0019 D2; SRC-0014 §Search field | `TS-WEB-0020-A18` → pages/dein-ort *(full)* | 0/1 CI · 1 full suite only | closed 2026-10-13 |
| [#24](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/24) Termin-Zähler („8.543 Termine“) entfernen<br><sub>Design · Funktion/Technik · Startseite</sub> | [#66](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/66) `109178e9` | [DEC-0159](../../specs/decisions/DEC-0159--the-home-stage-is-less-full.md) | TS-WEB-0019 D1; TS-WEB-0019 D3; TS-WEB-0019 D5 | `TS-WEB-0019-A1` → page.meta.test<br>`TS-WEB-0019-A14` → *(superseded)*<br>`TS-WEB-0019-A18` → pages/home *(full)*<br>tests citing the issue: page.meta.test, pages/home | 1/2 CI · 1 full suite only · 1 superseded | closed 2026-10-13 |
| [#25](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/25) Überleitung „Fehlt deine Veranstaltung? Jetzt selbst eintragen“ pro…<br><sub>Design · Startseite</sub> | [#66](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/66) `109178e9` | [DEC-0159](../../specs/decisions/DEC-0159--the-home-stage-is-less-full.md) | TS-WEB-0019 D3 | `TS-WEB-0019-A19` → pages/home *(full)* | 0/1 CI · 1 full suite only | closed 2026-10-13 |

**Spec changed by PR #66:** SRC-0014 §Search field; TS-WEB-0019 D1, D2, D3, D5, §Free for the generator; TS-WEB-0020 §Owed by the owner's review of 2026-10-12 (DEC-0154).

Closing comments:

- #20: „Umgesetzt in #66 (gemergt in next-2026), Entscheidung DEC-0159.“
- #23: „Umgesetzt in #66 (gemergt in next-2026), Entscheidung DEC-0159.“
- #24: „Umgesetzt in #66 (gemergt in next-2026), Entscheidung DEC-0159.“
- #25: „Umgesetzt in #66 (gemergt in next-2026), Entscheidung DEC-0159.“

### PR [#67](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/67) — Über uns in chapters after the owner's design; web-calendar drawing on the town hall; provenance photo full-bleed (#55, #35, #32)
Merge commit `2643f7a3`, merged 2026-10-13. Decision record added: [DEC-0162](../../specs/decisions/DEC-0162--ueber-uns-in-chapters-and-the-two-home-photographs.md). 

| Issue | PR | DEC | Spec sections | Criteria → tests | CI | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [#32](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/32) Rathaus-Foto: Webseiten-Kalender als Overlay darüberlegen (TODO)<br><sub>Design · Startseite</sub> | [#67](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/67) `2643f7a3` | [DEC-0162](../../specs/decisions/DEC-0162--ueber-uns-in-chapters-and-the-two-home-photographs.md) | SRC-0014 §Web-calendar overlay | `TS-WEB-0019-A20` → pages/home-scene-media *(full)*<br>tests citing the issue: pages/home-scene-media | 0/1 CI · 1 full suite only | closed 2026-10-13 |
| [#35](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/35) „Über uns“-Foto auf Smartphone nicht in voller Breite, sondern am T…<br><sub>Design · Startseite</sub> | [#67](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/67) `2643f7a3` | [DEC-0162](../../specs/decisions/DEC-0162--ueber-uns-in-chapters-and-the-two-home-photographs.md) | TS-WEB-0027 §Owed by the owner's review of 2026-10-12 (DEC-0154) | `TS-WEB-0019-A21` → pages/home-scene-media *(full)* | 0/1 CI · 1 full suite only | closed 2026-10-13 |
| [#55](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/55) Über uns: Darstellung nach neuem Design umbauen (Kapitel, Geschicht…<br><sub>Design · Über uns</sub> | [#67](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/67) `2643f7a3` | [DEC-0154](../../specs/decisions/DEC-0154--the-review-of-2026-10-12.md), [DEC-0162](../../specs/decisions/DEC-0162--ueber-uns-in-chapters-and-the-two-home-photographs.md), [DEC-0166](../../specs/decisions/DEC-0166--the-archive-becomes-the-press-page.md) | TS-WEB-0027 §Owed by the owner's review of 2026-10-12 (DEC-0154) | `TS-WEB-0027-A17` → pages/ueber-uns *(full)* | 0/1 CI · 1 full suite only | closed 2026-10-13 |

**Spec changed by PR #67:** SRC-0014 §Quote card, §Story disclosure, §Web-calendar overlay; design-system-contract §1 manifest; TS-WEB-0003 D2; TS-WEB-0027 D2, D3, D6, §Owed by the owner's review of 2026-10-12 (DEC-0154).

**Further criteria added or amended by PR #67:** `TS-WEB-0027-A2` → page-rhythm.test, pages/ueber-uns; `TS-WEB-0027-A3` → pages/ueber-uns *(full)*; `TS-WEB-0027-A8` → pages/ueber-uns *(full)* — CI: 1/3 CI · 2 full suite only.

Closing comments:

- #32: „Umgesetzt in #67, gemergt auf next-2026.“
- #35: „Umgesetzt in #67, gemergt auf next-2026.“
- #55: „Umgesetzt in #67, gemergt auf next-2026.“

### PR [#76](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/76) — The archive becomes the press page: every media-echo entry as a citation (#56)
Merge commit `6fe678e5`, merged 2026-10-14. Decision record added: [DEC-0166](../../specs/decisions/DEC-0166--the-archive-becomes-the-press-page.md). 

| Issue | PR | DEC | Spec sections | Criteria → tests | CI | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [#56](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/56) Pressematerial: wie bringen wir alles auf die Website? Über uns, ei…<br><sub>Design · Funktion/Technik · Über uns</sub> | [#76](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/76) `6fe678e5` | [DEC-0154](../../specs/decisions/DEC-0154--the-review-of-2026-10-12.md), [DEC-0162](../../specs/decisions/DEC-0162--ueber-uns-in-chapters-and-the-two-home-photographs.md), [DEC-0166](../../specs/decisions/DEC-0166--the-archive-becomes-the-press-page.md) | TS-WEB-0027 §Owed by the owner's review of 2026-10-12 (DEC-0154); TS-WEB-0028 D1; Q-0093 | `TS-WEB-0028-A7` → *(superseded)*<br>`TS-WEB-0028-A15` → media-echo-citations.integration.test<br>`TS-WEB-0028-A16` → pages/archiv *(full)*<br>`TS-WEB-0028-A17` → pages/archiv *(full)*<br>`TS-WEB-0028-A18` → pages/archiv *(full)* (via PR) | 1/4 CI · 3 full suite only · 1 superseded | closed 2026-10-14 |

**Spec changed by PR #76:** SRC-0014 §Site footer; design-system-contract §1 manifest; FUN-WEB-0018; TS-WEB-0004 D4; TS-WEB-0011 D2; TS-WEB-0028 D1, D3, D4, D6, D7, §Open points, §Purpose; Q-0093; DEM-0072.

Closing comments:

- #56: „Erledigt mit #76 (DEC-0166, Q-0093 beantwortet): Das Archiv ist jetzt die Presseseite „Presse und Auszeichnungen“ unter /ueber-uns/archiv.“

### PR [#77](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/77) — feat(place): the stage shows the chosen place's own photograph (#18, DEC-0167)
Merge commit `5c7a5eff`, merged 2026-10-14. Decision record added: [DEC-0167](../../specs/decisions/DEC-0167--the-stage-shows-the-place-photograph-from-geo-api-and-assets-api.md). 

| Issue | PR | DEC | Spec sections | Criteria → tests | CI | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [#18](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/18) Ortsbühne zeigt immer dasselbe Foto statt des Ortes<br><sub>Design · Funktion/Technik · Startseite</sub> | [#77](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/77) `5c7a5eff` | [DEC-0154](../../specs/decisions/DEC-0154--the-review-of-2026-10-12.md), [DEC-0167](../../specs/decisions/DEC-0167--the-stage-shows-the-place-photograph-from-geo-api-and-assets-api.md) | TS-WEB-0020 §Owed by the owner's review of 2026-10-12 (DEC-0154); Q-0089 | `TS-WEB-0019-A22` → active-place, place-photo *(full)*<br>tests citing the issue: place-photo | 0/1 CI · 1 full suite only | closed 2026-10-14 |

**Spec changed by PR #77:** SRC-0014 §The ladder is fixed, and the motif carries the rest; design-system-contract §1 manifest; TS-WEB-0004 D5; TS-WEB-0008 D2; TS-WEB-0020 §Owed by the owner's review of 2026-10-12 (DEC-0154); Q-0089.

**Further criteria added or amended by PR #77:** `TS-WEB-0020-A19` → bff-place-photo.integration.test; `TS-WEB-0020-A20` → place-photo *(full)*; `TS-WEB-0020-A21` → place-photo *(full)*; `TS-WEB-0020-A22` → place-photo *(full)* — CI: 1/4 CI · 3 full suite only.

Closing comments:

- #18: „Erledigt mit #77 (DEC-0167).“

### PR [#115](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/115) — Mitmachen: draw every stage graphic, no chat header, no hand-off sentence; closing block before the context band (#88, #89, #92, #93)
Merge commit `04eb220a`, merged 2026-10-27. Decision record added: [DEC-0174](../../specs/decisions/DEC-0174--every-stage-graphic-drawn-and-the-band-closes-the-page.md). 

| Issue | PR | DEC | Spec sections | Criteria → tests | CI | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [#50](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/50) Überleitung zu „Kalender für eure Website“ sprachlich klar formulieren<br><sub>Text/Didaktik · Termine veröffentlichen</sub> | [#115](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/115) `04eb220a` | [DEC-0174](../../specs/decisions/DEC-0174--every-stage-graphic-drawn-and-the-band-closes-the-page.md) | TS-WEB-0022 D9; CG-045 | — | — | closed 2026-10-27<br>⚑ no criterion names it |

PR #115 solved four 27.10. issues as well; its spec changes and further criteria are listed under the review of 2026-10-27.

Closing comments:

- #50: „Überholt durch #92 / #115 (DEC-0174 §3): Der Satz „Wenn eurem Verein oder eurer Gemeinde ein eigener Kalender … ist das ein anderes Angebot“ ist von `/mitmachen` entfernt, nicht umformuliert.“


### Still open (12.10.)

| Issue | Review | Why open | Spec already carries |
| --- | --- | --- | --- |
| [#21](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/21) Überschrift der Startseite vereinfachen: „Was ist los in deinem Dorf?“ | 12.10. | Copy point, owed (spec-impact.md). No merged PR names it; the headline is still the old one. | — |
| [#22](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/22) Terminauswahl: thematisch divers, Kultur bevorzugen, Seltenes vor Rege | 12.10. | Owed: TS-WEB-0008 lists it as owed (date selection). No merged PR names it. | TS-WEB-0008 §Owed by the owner's review of 2026-10-12 (DEC-0154) |
| [#29](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/29) CTA „Jetzt kostenlos anmelden“ führt nur zur Anmeldung, soll auf die a | 12.10. | Owed: CTA target (TS-WEB-0019/0022). No merged PR names it; "Jetzt kostenlos anmelden" is still in `content/pages/home/de.md`. | — |
| [#30](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/30) Abschnitt „Aus dem Flyer geworden“ entfernen | 12.10. | Copy point, owed. "Aus dem Flyer geworden" is still in `content/pages/home/de.md` and `app/[lang]/page.tsx`. | — |
| [#31](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/31) „Ohne eigenes System“: Text überarbeiten, Hauptbotschaft ist der Kalen | 12.10. | Copy point, owed. "Ohne eigenes System" is still in `content/pages/home/de.md`. | — |
| [#33](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/33) CTA „Kalender bestellen“ ist zu knapp: Zusatz, dass man dort die Detai | 12.10. | Spec changed (CG-026 supporting line per spec-impact.md), copy not yet written. No merged PR names it. | — |
| [#34](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/34) „Über uns“-Abschnitt: Texte nachschärfen (Humanizer, „mitgegründet“, G | 12.10. | Copy point, owed (TS-WEB-0027 owed list). "mitgegründet" is still in `content/pages/ueber-uns/*.md`. | TS-WEB-0027 §Owed by the owner's review of 2026-10-12 (DEC-0154); DEC-0154 |
| [#36](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/36) „Was andere sagen“: Teaser mit je einer Kernaussage und Deeplink in „Ü | 12.10. | Owed (TS-WEB-0027 owed list): teaser with one statement and deep link. No merged PR names it. | TS-WEB-0027 §Owed by the owner's review of 2026-10-12 (DEC-0154); DEC-0166 |
| [#37](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/37) Interne Anweisung „Beleg aus der Region“ steht als Text auf der Seite  | 12.10. | Spec changed (CG-035 per spec-impact.md), content not fixed: "Beleg aus der Region" is still in `content/pages/home/de.md` and `app/[lang]/page.tsx`. | DEC-0155 |
| [#38](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/38) Belegtexte als ganze Sätze formulieren („NØRD Award 2026 gewonnen, Kat | 12.10. | Spec changed, waits for the owner's decision (Q-0086, CG-027). | TS-WEB-0027 §Owed by the owner's review of 2026-10-12 (DEC-0154); Q-0086; DEC-0166 |
| [#44](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/44) Didaktik: erst die Lösung, dann das Problem („Warum es heute hakt“) | 12.10. | Spec changed (CG-042, TS-WEB-0022 D2), the `/mitmachen` copy is not reworked yet. No merged PR names it. | TS-WEB-0022 D2 |
| [#45](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/45) „Wer euren Termin heute nicht mitbekommt“: Texte natürlicher, weniger  | 12.10. | Copy point, owed (CG-009, content `mitmachen/*.md`). No merged PR names it. | — |
| [#46](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/46) Reihenfolge: „Die üblichen Wege“ vor „Wer euren Termin heute nicht mit | 12.10. | Spec changed (TS-WEB-0022 D2), the page order is not changed yet. No merged PR names it. | TS-WEB-0022 D2 |
| [#48](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/48) „In Erprobung (Alpha)“ zu „In Erprobung“ kürzen | 12.10. | Copy point, owed. "In Erprobung (Alpha)" is still in `content/pages/mitmachen/de.md`. | DEC-0154 |
| [#49](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/49) Preis-/Quellen-Hinweis „Bitte nachfragen, geht bisher nur für einige W | 12.10. | Copy point, owed (hub `offerings`). "Bitte nachfragen" is still in `content/pages/mitmachen/de.md`. | — |
| [#51](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/51) /dein-kalender: Abschnitt „Warum es heute hakt“ / „Wer euren Termin he | 12.10. | Spec changed (CG-005/CG-018/CG-042, TS-WEB-0024 D4). PR #116 redesigned the comparison and states "the didactics stay with #51". The copy is still owed. | TS-WEB-0024 D4; DEC-0154; DEC-0172 |
| [#52](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/52) Testtermine („Recurring TEST Event Schlatkow“) herausfiltern | 12.10. | Website side done in PR #114 (DEC-0173 §3, TS-WEB-0008-A20/A21). The embed waits for schafe-vorm-fenster/portalize#144 plus `MATEO_TEST_USER_IDS` on the widget host (issue comment). | TS-WEB-0008 §Owed by the owner's review of 2026-10-12 (DEC-0154); DEC-0154; DEC-0155; DEC-0173 |
| [#54](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/54) Review 12.10.2026: Übersicht aller Punkte | 12.10. | Tracking issue for the 12.10. review (checklist of #18–#56). Stays open while points are open. | — |
| [#58](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/58) Testsetup: abgeschnittenen Text, Dunkelgrün-Füllungen und Bildabweichu | 12.10. | Test setup: three instruments are still open (truncated-text sweep, screenshot baselines, KNOWN-list self-report) per the issue body. | DEC-0155 |

## Review of 2026-10-27

Review text: [2026-10-27/](2026-10-27/) (three files). Intake: PRs [#87](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/87) (`8c2d2bca`),
[#99](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/99) (`22e49ceb`), [#110](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/110) (`f91d4be9`). These brought the review text into the
repository and changed no spec.

### PR [#111](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/111) — dein-ort: one homescreen module before the band, no quote under the dates, no stage up-link (#84, #85, #86)
Merge commit `e2351d92`, merged 2026-10-27. Decision record added: [DEC-0170](../../specs/decisions/DEC-0170--one-module-per-job-no-quote-under-a-live-list.md). 

| Issue | PR | DEC | Spec sections | Criteria → tests | CI | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [#84](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/84) Zitat Dr. A. Zschiesche unter den Terminen entfernen<br><sub>Text/Didaktik · Startseite</sub> | [#111](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/111) `e2351d92` | [DEC-0170](../../specs/decisions/DEC-0170--one-module-per-job-no-quote-under-a-live-list.md) | TS-WEB-0020 D3; SRC-0014 §Module rules; CG-044 | `TS-WEB-0020-A23` → module-rules, pages/dein-ort, value-story.test<br>tests citing the issue: page.meta.test, module-rules, pages/dein-ort, value-story.test | CI | closed 2026-10-27 |
| [#85](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/85) Story-Bühne: Link "Was heute bei dir los ist" entfernen<br><sub>Text/Didaktik · Design · Startseite</sub> | [#111](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/111) `e2351d92` | [DEC-0170](../../specs/decisions/DEC-0170--one-module-per-job-no-quote-under-a-live-list.md) | TS-WEB-0020 D3; SRC-0014 §Story stage | `TS-WEB-0020-A25` → pages/dein-ort *(full)*<br>tests citing the issue: pages/dein-ort | 0/1 CI · 1 full suite only | closed 2026-10-27 |
| [#86](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/86) Homescreen-Anleitung und "Einmal antippen" zusammenführen, Kontextb…<br><sub>Text/Didaktik · Design · Startseite</sub> | [#111](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/111) `e2351d92` | [DEC-0170](../../specs/decisions/DEC-0170--one-module-per-job-no-quote-under-a-live-list.md), [DEC-0174](../../specs/decisions/DEC-0174--every-stage-graphic-drawn-and-the-band-closes-the-page.md) | DEM-0073; TS-WEB-0006 D2; TS-WEB-0020 D1; FUN-WEB-0005; FUN-WEB-0006; SRC-0014 §Module rules; CG-044 | `TS-WEB-0020-A24` → pages/dein-ort *(full)*<br>`TS-WEB-0020-A26` → pages/dein-ort *(full)*<br>tests citing the issue: module-rules, pages/dein-ort | 0/2 CI · 2 full suite only | closed 2026-10-27 |

**Spec changed by PR #111:** SRC-0017 CG-044; SRC-0014 §Module rules, §Story stage; copy-contract §Words; design-system-contract §1 manifest, §2 composition; FUN-WEB-0005; FUN-WEB-0006; TS-WEB-0006 D2, D3, D5; TS-WEB-0020 D1, D2, D3, D4, §Open points; DEM-0073.

**Further criteria added or amended by PR #111:** `TS-WEB-0006-A6` → page-order, pages/dein-ort, pages/deine-region, pages/home, routes; `TS-WEB-0006-A7` → pages/deine-region *(full)*; `TS-WEB-0006-A19` → module-rules *(full)*; `TS-WEB-0019-A23` → module-rules *(full)*; `TS-WEB-0020-A2` → pages/dein-ort *(full)*; `TS-WEB-0020-A6` → pages/dein-ort *(superseded)*; `TS-WEB-0020-A7` → pages/dein-ort *(full)*; `TS-WEB-0020-A8` → pages/dein-ort, pages/home *(full)*; `TS-WEB-0020-A10` → pages/dein-ort *(full)* — CI: 1/8 CI · 7 full suite only · 1 superseded.

Closing comments:

- #84: „Erledigt mit #111 (DEC-0170).“
- #85: „Erledigt mit #111 (DEC-0170).“
- #86: „Erledigt mit #111 (DEC-0170).“

### PR [#112](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/112) — Layout: one owner per level of vertical space — section, content stack, block (DEC-0171, #90, #108)
Merge commit `194f9497`, merged 2026-10-27. Decision record added: [DEC-0171](../../specs/decisions/DEC-0171--one-owner-per-level-of-vertical-space.md). 

| Issue | PR | DEC | Spec sections | Criteria → tests | CI | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [#90](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/90) Fehlender Abstand zwischen Button und Hinweisbox – Architektur-Revi…<br><sub>Design · Funktion/Technik · übergreifend</sub> | [#112](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/112) `194f9497` | [DEC-0171](../../specs/decisions/DEC-0171--one-owner-per-level-of-vertical-space.md) | TS-WEB-0017 D2; SRC-0014 §Who owns which space | `TS-WEB-0017-A31` → block-gaps *(full)*<br>`TS-WEB-0017-A32` → check-brand.test, check:brand | 1/2 CI · 1 full suite only | closed 2026-10-27 |
| [#108](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/108) Fehlende Abstände auf Über uns und Presse (Kapitel 03, Jahresübersc…<br><sub>Design · Funktion/Technik · übergreifend</sub> | [#112](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/112) `194f9497` | [DEC-0171](../../specs/decisions/DEC-0171--one-owner-per-level-of-vertical-space.md), [DEC-0175](../../specs/decisions/DEC-0175--ueber-uns-review-accordion-no-placeholder-one-claim-once.md) | TS-WEB-0017 D2; SRC-0014 §Who owns which space | `TS-WEB-0017-A31` → block-gaps *(full)*<br>`TS-WEB-0017-A32` → check-brand.test, check:brand | 1/2 CI · 1 full suite only | closed 2026-10-27 |

**Spec changed by PR #112:** SRC-0014 §Placement rules from `xl` (Desktop), §Shape and Space, §Who owns which space; design-system-contract §2 composition; TS-WEB-0017 D2.

Closing comments:

- #90: „Behoben mit #112 (DEC-0171), an der Ursache statt am Einzelfall.“
- #108: „Behoben mit #112 zusammen mit #90 (DEC-0171) – dieselbe Ursache, zwei weitere Varianten davon.“

### PR [#113](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/113) — Review 2026-10-27: external links in a new tab, readable place-search hover, nearby list without empty rows (#82, #100, #79, #83)
Merge commit `1eea6759`, merged 2026-10-27. Decision record added: [DEC-0169](../../specs/decisions/DEC-0169--every-link-to-another-origin-opens-a-new-tab.md). 

| Issue | PR | DEC | Spec sections | Criteria → tests | CI | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [#79](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/79) Ortssuche: Hover/aktive Zeile hat zu wenig Kontrast<br><sub>Design · Startseite</sub> | [#113](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/113) `1eea6759` | [DEC-0169](../../specs/decisions/DEC-0169--every-link-to-another-origin-opens-a-new-tab.md) | design-system-contract `place-search-overlay`; TS-WEB-0008 D7a; TS-WEB-0008 §Free for the generator; SRC-0014 §Place-search result overlay | `TS-WEB-0008-A17` → place-search *(full)*<br>tests citing the issue: place-search | 0/1 CI · 1 full suite only | closed 2026-10-27 |
| [#82](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/82) Externe Links (z. B. Dorfkalender) immer in neuem Tab öffnen<br><sub>Funktion/Technik · Startseite</sub> | [#113](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/113) `1eea6759` | [DEC-0169](../../specs/decisions/DEC-0169--every-link-to-another-origin-opens-a-new-tab.md) | TS-WEB-0016 D18; SRC-0014 §Links | `TS-WEB-0016-A24` → external-links, external-links.test, link-target.test<br>`TS-WEB-0016-A25` → external-links, external-links.test<br>tests citing the issue: external-links | CI | closed 2026-10-27 |
| [#83](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/83) Termine in der Nähe: großer Weißraum unter wenigen Terminen<br><sub>Design · Funktion/Technik · Startseite</sub> | [#113](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/113) `1eea6759` | [DEC-0169](../../specs/decisions/DEC-0169--every-link-to-another-origin-opens-a-new-tab.md) | TS-WEB-0008 D3; SRC-0014 §Reserved text space; CG-033 | `TS-WEB-0008-A18` → nearby, public-source.integration.test<br>`TS-WEB-0008-A19` → layout-stability, nearby<br>tests citing the issue: layout-stability | CI | closed 2026-10-27 |
| [#100](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/100) „öffnet neuen Tab“ nirgends als sichtbarer Text – das Icon reicht<br><sub>Text/Didaktik · Design · übergreifend</sub> | [#113](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/113) `1eea6759` | [DEC-0169](../../specs/decisions/DEC-0169--every-link-to-another-origin-opens-a-new-tab.md), [DEC-0175](../../specs/decisions/DEC-0175--ueber-uns-review-accordion-no-placeholder-one-claim-once.md) | TS-WEB-0016 D18; SRC-0014 §Links | `TS-WEB-0016-A24` → external-links, external-links.test, link-target.test | CI | closed 2026-10-27 |

**Spec changed by PR #113:** SRC-0017 CG-033, §Do Not; SRC-0014 §Accessibility, §Button, §Links, §Place-search result overlay, §Reserved text space; design-system-contract §1 manifest; TS-WEB-0008 D1, D3, D7a, §Free for the generator; TS-WEB-0016 D18, D7, D9.

**Further criteria added or amended by PR #113:** `TS-WEB-0028-A14` → *(manual check)* — CI: 0/1 CI · 1 manual.

Closing comments:

- #79: „Erledigt mit #113. Ursache: Die Vorschlagszeile ist ein Link, und die globale Hover-Regel für Links war stärker als die Farbe der Zeile.“
- #82: „Erledigt mit #113 (DEC-0169).“
- #83: „Erledigt mit #113. Es waren beide Ursachen.“
- #100: „Erledigt mit #113 zusammen mit #82.“

### PR [#114](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/114) — Embedded calendar: readable colours, no organizer showcase, test organizers filtered (DEC-0173)
Merge commit `e9c99543`, merged 2026-10-27. Decision record added: [DEC-0173](../../specs/decisions/DEC-0173--the-embedded-calendar-is-readable-names-no-organizer-and-shows-no-test-dates.md). 

| Issue | PR | DEC | Spec sections | Criteria → tests | CI | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [#95](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/95) Dein Kalender: eingebetteter Kalender braucht lesbare Farben und Ko…<br><sub>Design · Funktion/Technik · Dein Kalender</sub> | [#114](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/114) `e9c99543` | [DEC-0173](../../specs/decisions/DEC-0173--the-embedded-calendar-is-readable-names-no-organizer-and-shows-no-test-dates.md) | — | `TS-WEB-0024-A20` → embed *(full)*<br>tests citing the issue: embed | 0/1 CI · 1 full suite only | closed 2026-10-27 |
| [#98](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/98) Dein Kalender: Embed-Titel „Termine von Verein zur Förderung von Ku…<br><sub>Text/Didaktik · Funktion/Technik · Dein Kalender</sub> | [#114](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/114) `e9c99543` | [DEC-0173](../../specs/decisions/DEC-0173--the-embedded-calendar-is-readable-names-no-organizer-and-shows-no-test-dates.md) | — | `TS-WEB-0024-A21` → embed *(full)* | 0/1 CI · 1 full suite only | closed 2026-10-27 |

**Spec changed by PR #114:** SRC-0014 §Embedded calendar; api-contracts §Notes; design-system-contract §2 composition; TS-WEB-0008 D2, D6, §Owed by the owner's review of 2026-10-12 (DEC-0154); TS-WEB-0024 D5.

**Further criteria added or amended by PR #114:** `TS-WEB-0008-A20` → test-organizers.test; `TS-WEB-0008-A21` → embed *(full)*; `TS-WEB-0024-A22` → embed *(fixme)* — CI: 1/3 CI · 1 full suite only · 1 fixme.

Closing comments:

- #95: „Erledigt mit #114 (DEC-0173 §1).“
- #98: „Erledigt mit #114 (DEC-0173 §2).“

### PR [#115](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/115) — Mitmachen: draw every stage graphic, no chat header, no hand-off sentence; closing block before the context band (#88, #89, #92, #93)
Merge commit `04eb220a`, merged 2026-10-27. Decision record added: [DEC-0174](../../specs/decisions/DEC-0174--every-stage-graphic-drawn-and-the-band-closes-the-page.md). 

| Issue | PR | DEC | Spec sections | Criteria → tests | CI | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [#88](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/88) Mitmachen: Bild in Schritt 1 fehlt in den Modulen „Euren Kalender v…<br><sub>Design · Termine veröffentlichen</sub> | [#115](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/115) `04eb220a` | [DEC-0174](../../specs/decisions/DEC-0174--every-stage-graphic-drawn-and-the-band-closes-the-page.md) | TS-WEB-0022 §The render form is fixed, and it is the explain module; SRC-0014 §Two layouts, and the breakpoint decides which | `TS-WEB-0022-A22` → explain-stage *(full)*<br>tests citing the issue: explain-stage, explain-stage.test | 0/1 CI · 1 full suite only | closed 2026-10-27 |
| [#89](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/89) Mitmachen: WhatsApp-Bild (Schritt 2) ohne Chat-Header<br><sub>Design · Termine veröffentlichen</sub> | [#115](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/115) `04eb220a` | [DEC-0174](../../specs/decisions/DEC-0174--every-stage-graphic-drawn-and-the-band-closes-the-page.md) | TS-WEB-0022 §The render form is fixed, and it is the explain module; SRC-0014 §Two layouts, and the breakpoint decides which | `TS-WEB-0022-A22` → explain-stage *(full)*<br>tests citing the issue: explain-stage.test | 0/1 CI · 1 full suite only | closed 2026-10-27 |
| [#92](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/92) Mitmachen: Satz „Wenn eurem Verein oder eurer Gemeinde ein eigener…<br><sub>Text/Didaktik · Termine veröffentlichen</sub> | [#115](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/115) `04eb220a` | [DEC-0174](../../specs/decisions/DEC-0174--every-stage-graphic-drawn-and-the-band-closes-the-page.md) | TS-WEB-0022 D9; SRC-0014 §Page Rhythm; CG-045 | `TS-WEB-0006-A20` → page-order *(full)*<br>`TS-WEB-0022-A13` → pages/mitmachen *(full)*<br>tests citing the issue: page-order, pages/mitmachen | 0/2 CI · 2 full suite only | closed 2026-10-27 |
| [#93](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/93) Dein Kalender: „Euer Kalender läuft, sobald der Code auf eurer Seit…<br><sub>Text/Didaktik · Dein Kalender</sub> | [#115](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/115) `04eb220a` | [DEC-0170](../../specs/decisions/DEC-0170--one-module-per-job-no-quote-under-a-live-list.md), [DEC-0174](../../specs/decisions/DEC-0174--every-stage-graphic-drawn-and-the-band-closes-the-page.md) | DEM-0073; TS-WEB-0006 D2; TS-WEB-0024 D2; FUN-WEB-0005; FUN-WEB-0006; SRC-0014 §Page Rhythm; SRC-0014 §Module rules; TS-WEB-0006 D2/D5/D6 | `TS-WEB-0006-A6` → page-order, pages/dein-ort, pages/deine-region, pages/home, routes<br>`TS-WEB-0006-A7` → pages/deine-region *(full)*<br>`TS-WEB-0024-A2` → pages/dein-kalender *(full)*<br>tests citing the issue: page-order, pages/dein-kalender | 1/3 CI · 2 full suite only | closed 2026-10-27 |

**Spec changed by PR #115:** SRC-0017 CG-045; SRC-0014 §Context band, §Module rules, §Page Rhythm, §Two layouts, and the breakpoint decides which; copy-contract §Counts, §Structure; design-system-contract §1 manifest; FUN-WEB-0005; FUN-WEB-0006; TS-WEB-0006 D2, D5, D6, §Open points; TS-WEB-0020 D1; TS-WEB-0022 D4, D9, §The render form is fixed, and it is the explain module; TS-WEB-0024 D2; TS-WEB-0026 D2; DEM-0073.

**Further criteria added or amended by PR #115:** `TS-WEB-0021-A10` → pages/dein-ort-starten *(full)* — CI: 0/1 CI · 1 full suite only.

Closing comments:

- #88: „Erledigt mit #115 (DEC-0174 §1).“
- #89: „Erledigt mit #115 (DEC-0174 §2): Das Chat-Bild im WhatsApp-Modul hat keinen Header mehr – nur noch Chat-Hintergrund mit den beiden Sprechblasen.“
- #92: „Erledigt mit #115 (DEC-0174 §3).“
- #93: „Erledigt mit #115 (DEC-0174 §4).“

### PR [#116](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/116) — Design the customer proof stream, the comparison, the benefit flow and the trust block (#91, #94, #96)
Merge commit `81b790c0`, merged 2026-10-27. Decision record added: [DEC-0172](../../specs/decisions/DEC-0172--four-modules-get-their-design-and-nothing-looks-like-a-button-that-is-not-one.md). 

| Issue | PR | DEC | Spec sections | Criteria → tests | CI | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [#91](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/91) Modul „Wo es wirklich benutzt wird“ nach dem neuen Design umsetzen<br><sub>Design · übergreifend</sub> | [#116](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/116) `81b790c0` | [DEC-0162](../../specs/decisions/DEC-0162--ueber-uns-in-chapters-and-the-two-home-photographs.md), [DEC-0172](../../specs/decisions/DEC-0172--four-modules-get-their-design-and-nothing-looks-like-a-button-that-is-not-one.md) | TS-WEB-0022 D6; TS-WEB-0024 D10; SRC-0014 §Proof stream; TS-WEB-0024 D9/D10 | `TS-WEB-0022-A23` → module-designs *(full)*<br>`TS-WEB-0024-A25` → module-designs *(full)*<br>`TS-WEB-0024-A26` → module-designs *(full)* | 0/3 CI · 3 full suite only | closed 2026-10-27 |
| [#94](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/94) Dein Kalender: Modul „Wer euren Termin heute nicht mitbekommt“ nach…<br><sub>Design · Dein Kalender</sub> | [#116](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/116) `81b790c0` | [DEC-0172](../../specs/decisions/DEC-0172--four-modules-get-their-design-and-nothing-looks-like-a-button-that-is-not-one.md) | TS-WEB-0024 D4; SRC-0014 §Comparison | `TS-WEB-0024-A23` → comparison-table.test, module-designs | CI | closed 2026-10-27 |
| [#96](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/96) Dein Kalender: Modul „Was drinsteht, bestimmt ihr“ – Buttons gemisc…<br><sub>Design · Dein Kalender</sub> | [#116](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/116) `81b790c0` | [DEC-0172](../../specs/decisions/DEC-0172--four-modules-get-their-design-and-nothing-looks-like-a-button-that-is-not-one.md) | TS-WEB-0024 D12; SRC-0014 §Source-to-target flow; CG-040 | `TS-WEB-0002-A14` → control-styling *(full)* | 0/1 CI · 1 full suite only | closed 2026-10-27 |

**Spec changed by PR #116:** SRC-0017 CG-040; SRC-0014 §Accessibility, §Comparison, §Do Not, §Placement rules from `xl` (Desktop), §Proof stream, §Source-to-target flow, §Trust block; design-system-contract §1 manifest; TS-WEB-0002 D5; TS-WEB-0022 D6; TS-WEB-0024 D10, D12, D2, D4, D9.

**Further criteria added or amended by PR #116:** `TS-WEB-0024-A13` → pages/dein-kalender *(full)*; `TS-WEB-0024-A24` → module-designs *(full)* — CI: 0/2 CI · 2 full suite only.

Closing comments:

- #91: „Erledigt mit #116 (DEC-0172).“
- #94: „Erledigt mit #116 (DEC-0172).“
- #96: „Erledigt mit #116 (DEC-0172).“

### PR [#117](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/117) — Über uns review 2026-10-27: accordion stories, chapter 02 once with its period, no missing-proof placeholder, no orphan year (DEC-0175)
Merge commit `01ab954c`, merged 2026-10-27. Decision record added: [DEC-0175](../../specs/decisions/DEC-0175--ueber-uns-review-accordion-no-placeholder-one-claim-once.md). 

| Issue | PR | DEC | Spec sections | Criteria → tests | CI | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [#102](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/102) Über uns: Story-Karten springen beim Aufklappen – Akkordeon statt R…<br><sub>Design · Funktion/Technik · Über uns</sub> | [#117](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/117) `01ab954c` | [DEC-0175](../../specs/decisions/DEC-0175--ueber-uns-review-accordion-no-placeholder-one-claim-once.md) | TS-WEB-0027 §Free for the generator; TS-WEB-0027 §Done by the owner's review of 2026-10-27 (DEC-0175) | `TS-WEB-0027-A17` → pages/ueber-uns *(full)* | 0/1 CI · 1 full suite only | closed 2026-10-27 |
| [#103](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/103) Über uns: Kapitel 02 „Schmatzin · Bürgermeisteramt“ ausformulieren…<br><sub>Text/Didaktik · Design · Über uns</sub> | [#117](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/117) `01ab954c` | [DEC-0175](../../specs/decisions/DEC-0175--ueber-uns-review-accordion-no-placeholder-one-claim-once.md) | TS-WEB-0027 D3; TS-WEB-0027 §Done by the owner's review of 2026-10-27 (DEC-0175); DEM-0074 | — | — | closed 2026-10-27<br>⚑ no criterion names it |
| [#104](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/104) Über uns: doppelte Bürgermeister-Aussage mit vager Quelle („Nordkur…<br><sub>Text/Didaktik · Über uns</sub> | [#117](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/117) `01ab954c` | [DEC-0175](../../specs/decisions/DEC-0175--ueber-uns-review-accordion-no-placeholder-one-claim-once.md) | TS-WEB-0027 §Done by the owner's review of 2026-10-27 (DEC-0175); CG-046; CG-047 | — | — | closed 2026-10-27<br>⚑ no criterion names it |
| [#105](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/105) Platzhalter „Beleg fehlt“ darf nie auf der Webseite landen<br><sub>Text/Didaktik · Funktion/Technik · übergreifend</sub> | [#117](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/117) `01ab954c` | [DEC-0175](../../specs/decisions/DEC-0175--ueber-uns-review-accordion-no-placeholder-one-claim-once.md) | DEM-0075; TS-WEB-0007 D11; TS-WEB-0005 D5; TS-WEB-0027 D5; TS-WEB-0027 §Done by the owner's review of 2026-10-27 (DEC-0175); FUN-WEB-0017 | `TS-WEB-0007-A19` → no-placeholder *(full)* | 0/1 CI · 1 full suite only | closed 2026-10-27 |
| [#106](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/106) Über uns: Satz mit zweimal „Deshalb“ umformulieren<br><sub>Text/Didaktik · Über uns</sub> | [#117](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/117) `01ab954c` | [DEC-0175](../../specs/decisions/DEC-0175--ueber-uns-review-accordion-no-placeholder-one-claim-once.md) | TS-WEB-0027 §Done by the owner's review of 2026-10-27 (DEC-0175) | — | — | closed 2026-10-27<br>⚑ no criterion names it |
| [#107](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/107) Presse: beim Filtern bleiben leere Jahresblöcke stehen<br><sub>Funktion/Technik · Über uns</sub> | [#117](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/117) `01ab954c` | [DEC-0175](../../specs/decisions/DEC-0175--ueber-uns-review-accordion-no-placeholder-one-claim-once.md) | TS-WEB-0028 D4 | `TS-WEB-0028-A19` → pages/archiv *(full)* | 0/1 CI · 1 full suite only | closed 2026-10-27 |

**Spec changed by PR #117:** SRC-0017 CG-044, CG-045, §Do Not; SRC-0014 §Do Not, §Story disclosure; copy-contract §Counts, §Truth; design-system-contract §1 manifest, §2 composition; FUN-WEB-0017; TS-WEB-0005 D5; TS-WEB-0007 D11; TS-WEB-0022 D3; TS-WEB-0027 D2, D3, D5, §Done by the owner's review of 2026-10-27 (DEC-0175), §Free for the generator, §Open points; TS-WEB-0028 D4, D7; DEM-0074; DEM-0075.

**Further criteria added or amended by PR #117:** `TS-WEB-0022-A6` → pages/mitmachen *(full)*; `TS-WEB-0027-A3` → pages/ueber-uns *(full)*; `TS-WEB-0027-A5` → pages/ueber-uns *(full)*; `TS-WEB-0027-A6` → stream.test; `TS-WEB-0027-A7` → **no test**; `TS-WEB-0027-A11` → **no test** — CI: 1/6 CI · 3 full suite only · 2 no test.

Closing comments:

- #102: „Erledigt mit #117 (DEC-0175 §1).“
- #103: „Erledigt mit #117 (DEC-0175 §2).“
- #104: „Erledigt mit #117 (DEC-0175 §2).“
- #105: „Erledigt mit #117 (DEC-0175 §3).“
- #106: „Erledigt mit #117. Neu: „Deshalb ist der Dorfkalender kostenlos, und das bleibt so.“
- #107: „Erledigt mit #117 (DEC-0175 §5).“

### PR [#118](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/118) — One active place on the client; © credit control everywhere; calendar address slug.geonameId (#80, #78, #101, #81)
Merge commit `a207e7f5`, merged 2026-10-27. Decision record added: [DEC-0168](../../specs/decisions/DEC-0168--one-active-place-on-the-client.md). 

| Issue | PR | DEC | Spec sections | Criteria → tests | CI | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [#78](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/78) Bildnachweis als (c)-Icon mit Tooltip statt Textzeile auf dem Ortsfoto<br><sub>Design · Startseite</sub> | [#118](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/118) `a207e7f5` | [DEC-0167](../../specs/decisions/DEC-0167--the-stage-shows-the-place-photograph-from-geo-api-and-assets-api.md), [DEC-0168](../../specs/decisions/DEC-0168--one-active-place-on-the-client.md), [DEC-0169](../../specs/decisions/DEC-0169--every-link-to-another-origin-opens-a-new-tab.md) | design-system-contract `photo-credit`; TS-WEB-0020 §Owed by the owner's review of 2026-10-12 (DEC-0154); SRC-0014 §The ladder is fixed, and the motif carries the rest | `TS-WEB-0007-A18` → photo-credit *(full)*<br>`TS-WEB-0020-A28` → place-photo *(full)*<br>tests citing the issue: photo-credit, place-photo | 0/2 CI · 2 full suite only | closed 2026-10-27 |
| [#80](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/80) Falsches Ortsfoto je nach Ladezeitpunkt/Geolokalisierung – Architek…<br><sub>Design · Funktion/Technik · Startseite</sub> | [#118](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/118) `a207e7f5` | [DEC-0167](../../specs/decisions/DEC-0167--the-stage-shows-the-place-photograph-from-geo-api-and-assets-api.md), [DEC-0168](../../specs/decisions/DEC-0168--one-active-place-on-the-client.md) | TS-WEB-0020 §Owed by the owner's review of 2026-10-12 (DEC-0154); SRC-0014 §The ladder is fixed, and the motif carries the rest | `TS-WEB-0019-A22` → active-place, place-photo *(full)*<br>`TS-WEB-0020-A27` → active-place, active-place.test<br>tests citing the issue: active-place | 1/2 CI · 1 full suite only | closed 2026-10-27 |
| [#81](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/81) Link zum Dorfkalender: falsche Domain und Slug ohne Geoname-ID<br><sub>Funktion/Technik · Startseite</sub> | [#118](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/118) `a207e7f5` | [DEC-0168](../../specs/decisions/DEC-0168--one-active-place-on-the-client.md), [DEC-0169](../../specs/decisions/DEC-0169--every-link-to-another-origin-opens-a-new-tab.md) | TS-WEB-0008 D9 | `TS-WEB-0008-A11` → app-handover.test<br>tests citing the issue: pages/dein-ort, pages/home, app-handover.test | CI | closed 2026-10-27 |
| [#101](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/101) Über uns: Bildnachweis im Zitatband als ©-Icon mit Tooltip<br><sub>Design · Über uns</sub> | [#118](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/118) `a207e7f5` | [DEC-0168](../../specs/decisions/DEC-0168--one-active-place-on-the-client.md), [DEC-0175](../../specs/decisions/DEC-0175--ueber-uns-review-accordion-no-placeholder-one-claim-once.md) | design-system-contract `photo-credit`; SRC-0014 §The ladder is fixed, and the motif carries the rest | `TS-WEB-0007-A18` → photo-credit *(full)* | 0/1 CI · 1 full suite only | closed 2026-10-27 |

**Spec changed by PR #118:** SRC-0014 §Icons, §Story stage, §The ladder is fixed, and the motif carries the rest; design-system-contract §1 manifest; TS-WEB-0008 D9, §Open points; TS-WEB-0010 D5; TS-WEB-0019 D2; TS-WEB-0020 D2, §Owed by the owner's review of 2026-10-12 (DEC-0154); TS-WEB-0021 D4.

**Further criteria added or amended by PR #118:** `TS-WEB-0020-A7` → pages/dein-ort *(full)*; `TS-WEB-0020-A20` → place-photo *(full)*; `TS-WEB-0020-A22` → place-photo *(full)* — CI: 0/3 CI · 3 full suite only.

Closing comments:

- #78: „Erledigt mit #118: Der Bildnachweis ist jetzt ein kleines ©-Zeichen oben rechts am Foto, in derselben Form wie das KI-Zeichen.“
- #80: „Behoben mit #118 (DEC-0168).“
- #81: „Behoben mit #118: Kalenderlinks werden zentral in `calendarUrl()` gebaut, als `https://schafe-vorm-fenster.de/<slug>.<geonameId>` (z.“
- #101: „Erledigt mit #118, zusammen mit #78: Das ©-Element ist eine allgemeine Komponente (`photo-credit`) und hängt an jedem Foto mit Bildnachweis, auf Fotoflächen wie in Bildrahmen.“

### PR [#119](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/119) — Registrieren: embed the live site's Google Form for the launch (DEC-0176, #109)
Merge commit `f52fb859`, merged 2026-10-27. Decision record added: [DEC-0176](../../specs/decisions/DEC-0176--the-registration-route-embeds-the-google-form-for-launch.md). 

| Issue | PR | DEC | Spec sections | Criteria → tests | CI | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [#109](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/109) Registrieren: Google Formular einbetten wie auf der aktuellen Website<br><sub>Funktion/Technik · Termine veröffentlichen</sub> | [#119](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/119) `f52fb859` | [DEC-0176](../../specs/decisions/DEC-0176--the-registration-route-embeds-the-google-form-for-launch.md) | TS-WEB-0023 §Purpose; TS-WEB-0023 D10 | `TS-WEB-0012-A2` → privacy, start<br>`TS-WEB-0016-A22` → page.test, routes, start<br>`TS-WEB-0023-A12` → pages/registrieren *(full)*<br>`TS-WEB-0023-A17` → pages/registrieren *(full)*<br>`TS-WEB-0023-A18` → pages/registrieren *(full)*<br>`TS-WEB-0023-A19` → pages/registrieren *(full)*<br>`TS-WEB-0023-A20` → pages/registrieren *(full)*<br>`TS-WEB-0023-A21` → csp-hydration<br>`TS-WEB-0023-A22` → pages/registrieren *(full)* (via PR) | 3/9 CI · 6 full suite only | closed 2026-10-27 |

**Spec changed by PR #119:** TS-WEB-0012 D4; TS-WEB-0013 D2; TS-WEB-0014 D1, D2; TS-WEB-0016 D15; TS-WEB-0023 D1, D10, D9, §Purpose.

Closing comments:

- #109: „Erledigt mit #119 (in next-2026 gemergt, DEC-0176).“


### Still open (27.10.)

| Issue | Review | Why open | Spec already carries |
| --- | --- | --- | --- |
| [#97](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/97) Dein Kalender: Embed zeigt Testtermine („Allday TEST Event Schlatkow“) | 27.10. | Same cause as #52: the website side is done in PR #114, the embed waits for portalize#144 and the env variable. `TS-WEB-0024-A22` is `test.fixme` until then. | DEC-0173 |

## Follow-ups

### The CSP issue

### PR [#68](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/68) — Static pages, client-side live data, per-page CSP hashes (#59)
Merge commit `e99601fe`, merged 2026-10-13. Decision record added: [DEC-0163](../../specs/decisions/DEC-0163--static-pages-client-live-data-per-page-csp-hashes.md). 

| Issue | PR | DEC | Spec sections | Criteria → tests | CI | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [#59](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/59) Production build: CSP blocks Next's inline scripts, nothing hydrate…<br><sub>Funktion/Technik</sub> | [#68](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/68) `e99601fe` | [DEC-0163](../../specs/decisions/DEC-0163--static-pages-client-live-data-per-page-csp-hashes.md) | TS-WEB-0014 D3 | `TS-WEB-0014-A14` → csp-hashes.test, csp-hydration, proxy.test<br>`TS-WEB-0019-A11` → explain-module.test, pages/home<br>`TS-WEB-0020-A10` → pages/dein-ort *(full)*<br>`TS-WEB-0021-A2` → pages/dein-ort-starten *(full)*<br>`TS-WEB-0021-A9` → pages/dein-ort-starten *(full)*<br>`TS-WEB-0023-A13` → **no test** (via PR) | 2/6 CI · 3 full suite only · 1 no test | closed 2026-10-13<br>⚑ criterion without a running test |

**Spec changed by PR #68:** TS-WEB-0003 D5; TS-WEB-0004 D5, D6; TS-WEB-0005 D7; TS-WEB-0008 D10; TS-WEB-0009 D1; TS-WEB-0010 D8; TS-WEB-0014 D3, §Open points; TS-WEB-0019 D2, D3a; TS-WEB-0020 D2; TS-WEB-0021 D10, D4, D5; TS-WEB-0023 D4; TS-WEB-0025 D7.

Closing comments:

- #59: „Gelöst in #68, gemergt auf next-2026.“


### Pull requests without a review issue

These PRs were merged into `next-2026` from 2026-10-12 on and close no review issue. Some are follow-ups of
the review work: the DEC-0160 hover amendment, the A43/A44 layout guards, the copy-guide renumbering, and the
owner decisions of 2026-10-28.

| PR | Merge | DEC | Spec sections | Criteria → tests | CI |
| --- | --- | --- | --- | --- | --- |
| [#14](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/14) CI: install private packages with a read:packages token | `8fa43e07` | — | — (no spec file changed) | — | — |
| [#16](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/16) Read the localized description from events-api search | `6f9ad77d` | — | — (no spec file changed) | — | — |
| [#17](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/17) DEC-0153: story stage (board 1a) and the anchored focal point | `fee84fcd` | [DEC-0153](../../specs/decisions/DEC-0153--one-story-stage-and-the-anchored-focal-point.md) | SRC-0014 §Purpose, §Story stage; TS-WEB-0020 D3; *plus everything of PR #53 (the 12.10. intake), which reached next-2026 through this merge* | `TS-WEB-0020-A4` → pages/dein-ort *(full)*<br>`TS-WEB-0020-A10` → pages/dein-ort *(full)*<br>`TS-WEB-0020-A16` → pages/dein-ort *(full)*<br>`TS-WEB-0020-A17` → stage-anchor.test | 1/4 CI · 3 full suite only |
| [#65](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/65) Hover on an ink fill is neutral grey, not text-2 (DEC-0160 amendment) | `d2c41b03` | — | SRC-0014 §Button, §Lime — the surface colour, §Neutrals | — | — |
| [#69](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/69) Prerender robots.txt, llms.txt and the 404 as variants the proxy picks (DEC-0164 | `dfc8c1b1` | [DEC-0164](../../specs/decisions/DEC-0164--build-time-variants-for-robots-llms-and-the-404.md) | TS-WEB-0004 D2, D6; TS-WEB-0014 D3; TS-WEB-0015 D3 | `TS-WEB-0004-A12` → csp-adapter.test, not-found-routing.test, proxy.test, routing.integration.test<br>`TS-WEB-0015-A13` → proxy.test, robots.integration.test | CI |
| [#70](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/70) Fix 20 of the 23 e2e failures on next-2026; three left for the owner | `f5e44e14` | — | — (no spec file changed) | — | — |
| [#71](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/71) Event row category follows row width (A43); flat phone story stage (DEC-0153 ame | `c0710426` | — | SRC-0014 §Event row, §Story stage; design-system-contract §1 manifest | `TS-WEB-0017-A4` → check-brand.test, check:brand<br>`TS-WEB-0017-A43` → event-row *(full)* | 1/2 CI · 1 full suite only |
| [#72](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/72) Story stage copy halved to fit G-4; stage calendar meta on two lines (A43) | `71b77e01` | — | SRC-0014 §Event row, §Explain module; design-system-contract §1 manifest | `TS-WEB-0017-A43` → event-row *(full)* | 0/1 CI · 1 full suite only |
| [#74](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/74) Explain module: the square is a minimum, the calendar picture cuts no row (A44) | `bdbe9796` | — | SRC-0014 §Explain module, §Two layouts, and the breakpoint decides which; design-system-contract §1 manifest | `TS-WEB-0017-A44` → explain-calendar *(full)* | 0/1 CI · 1 full suite only |
| [#75](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/75) Visible sparkles mark on every AI-edited photograph (DEC-0165) | `8be25ae6` | [DEC-0165](../../specs/decisions/DEC-0165--an-ai-edited-photograph-carries-a-visible-mark.md) | SRC-0014 §Icons, §The ladder is fixed, and the motif carries the rest; design-system-contract §1 manifest; TS-WEB-0007 D6 | `TS-WEB-0007-A17` → ai-edited-mark *(full)* | 0/1 CI · 1 full suite only |
| [#120](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/120) Copy guide: renumber DEC-0175's rules to CG-046/CG-047 | `2e5ddb6c` | — | SRC-0017 CG-046, CG-047, §Do Not; copy-contract §Counts, §Truth; TS-WEB-0027 D3 | — | — |
| [#121](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/121) Run the website's functions in fra1, next to their upstreams (DEC-0179) | `a5f70b47` | [DEC-0179](../../specs/decisions/DEC-0179--functions-run-in-fra1-next-to-their-upstreams.md) | — (decision record only) | — | — |
| [#122](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/122) CI: technical e2e per PR, a real smoke on the preview, the full suite on demand  | `b9ff60c7` | [DEC-0180](../../specs/decisions/DEC-0180--ci-runs-technical-tests-and-a-smoke-the-full-suite-on-demand.md) | — (decision record only) | — | — |
| [#123](https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/pull/123) Owner decisions 2026-10-28: app links (DEC-0177), registration copy (DEC-0176 am | `ddd20667` | [DEC-0177](../../specs/decisions/DEC-0177--every-app-link-goes-to-the-schlatkow-calendar-until-the-app-has-its-own-domain.md), [DEC-0178](../../specs/decisions/DEC-0178--the-spacing-scale-per-level-and-tier-and-a-larger-block-gap-from-desktop.md) | SRC-0014 §Shape and Space, §Who owns which space; design-system-contract §2 composition; CON-WEB-0030; CON-WEB-0052; FUN-WEB-0131; ssd/website-relaunch.ssd.md; TS-WEB-0008 D9; TS-WEB-0010 D3; TS-WEB-0011 D1; TS-WEB-0013 D2; TS-WEB-0014 D1, D4, §Open points; TS-WEB-0016 D17; TS-WEB-0017 D4; TS-WEB-0023 D6; DEM-0076 | `TS-WEB-0017-A11` → app-handover.test, check-api-routes.test<br>`TS-WEB-0017-A31` → block-gaps *(full)*<br>`TS-WEB-0017-A32` → check-brand.test, check:brand<br>`TS-WEB-0017-A33` → app-links *(full)*<br>`TS-WEB-0017-A34` → check-brand.test, check:brand | 3/5 CI · 2 full suite only |

## Criteria index

Every criterion this file names, with its spec, its level and every test file that references it.

| Criterion | Spec | Level | Tests | Runs in |
| --- | --- | --- | --- | --- |
| `TS-WEB-0001-A12` | [TS-WEB-0001](../../specs/tactical/TS-WEB-0001--locale-routing.tactical.md) | unit | [language-switch](../../e2e/language-switch.spec.ts), [language-switch.test](../../src/components/language-switch/language-switch.test.tsx) | pnpm check (+ full suite) |
| `TS-WEB-0002-A14` | [TS-WEB-0002](../../specs/tactical/TS-WEB-0002--accessibility.tactical.md) | e2e | [control-styling](../../e2e/control-styling.spec.ts) | full suite only (on demand) |
| `TS-WEB-0004-A12` | [TS-WEB-0004](../../specs/tactical/TS-WEB-0004--url-and-routing.tactical.md) | integration | [proxy.test](../../proxy.test.ts), [csp-adapter.test](../../scripts/csp-adapter.test.ts), [not-found-routing.test](../../src/lib/routes/not-found-routing.test.ts), [routing.integration.test](../../src/lib/routes/routing.integration.test.ts) | pnpm check |
| `TS-WEB-0006-A6` | [TS-WEB-0006](../../specs/tactical/TS-WEB-0006--page-composition.tactical.md) | e2e | [page-order](../../e2e/page-order.spec.ts), [pages/dein-ort](../../e2e/pages/dein-ort.spec.ts), [pages/deine-region](../../e2e/pages/deine-region.spec.ts), [pages/home](../../e2e/pages/home.spec.ts), [routes](../../e2e/routes.spec.ts) | e2e:smoke (+ full suite) |
| `TS-WEB-0006-A7` | [TS-WEB-0006](../../specs/tactical/TS-WEB-0006--page-composition.tactical.md) | e2e | [pages/deine-region](../../e2e/pages/deine-region.spec.ts) | full suite only (on demand) |
| `TS-WEB-0006-A19` | [TS-WEB-0006](../../specs/tactical/TS-WEB-0006--page-composition.tactical.md) | e2e | [module-rules](../../e2e/module-rules.spec.ts) | full suite only (on demand) |
| `TS-WEB-0006-A20` | [TS-WEB-0006](../../specs/tactical/TS-WEB-0006--page-composition.tactical.md) | e2e | [page-order](../../e2e/page-order.spec.ts) | full suite only (on demand) |
| `TS-WEB-0007-A17` | [TS-WEB-0007](../../specs/tactical/TS-WEB-0007--content-pipeline.tactical.md) | e2e | [ai-edited-mark](../../e2e/ai-edited-mark.spec.ts) | full suite only (on demand) |
| `TS-WEB-0007-A18` | [TS-WEB-0007](../../specs/tactical/TS-WEB-0007--content-pipeline.tactical.md) | e2e | [photo-credit](../../e2e/photo-credit.spec.ts) | full suite only (on demand) |
| `TS-WEB-0007-A19` | [TS-WEB-0007](../../specs/tactical/TS-WEB-0007--content-pipeline.tactical.md) | e2e | [no-placeholder](../../e2e/no-placeholder.spec.ts) | full suite only (on demand) |
| `TS-WEB-0008-A11` | [TS-WEB-0008](../../specs/tactical/TS-WEB-0008--live-data.tactical.md) | unit | [app-handover.test](../../src/lib/live/app-handover.test.ts) | pnpm check |
| `TS-WEB-0008-A17` | [TS-WEB-0008](../../specs/tactical/TS-WEB-0008--live-data.tactical.md) | e2e | [place-search](../../e2e/place-search.spec.ts) | full suite only (on demand) |
| `TS-WEB-0008-A18` | [TS-WEB-0008](../../specs/tactical/TS-WEB-0008--live-data.tactical.md) | integration | [nearby](../../e2e/nearby.spec.ts), [public-source.integration.test](../../src/lib/live/public-source.integration.test.ts) | pnpm check (+ full suite) |
| `TS-WEB-0008-A19` | [TS-WEB-0008](../../specs/tactical/TS-WEB-0008--live-data.tactical.md) | e2e | [layout-stability](../../e2e/layout-stability.spec.ts), [nearby](../../e2e/nearby.spec.ts) | e2e:technical (+ full suite) |
| `TS-WEB-0008-A20` | [TS-WEB-0008](../../specs/tactical/TS-WEB-0008--live-data.tactical.md) | unit | [test-organizers.test](../../src/lib/live/test-organizers.test.ts) | pnpm check |
| `TS-WEB-0008-A21` | [TS-WEB-0008](../../specs/tactical/TS-WEB-0008--live-data.tactical.md) | e2e | [embed](../../e2e/embed.spec.ts) | full suite only (on demand) |
| `TS-WEB-0012-A2` | [TS-WEB-0012](../../specs/tactical/TS-WEB-0012--analytics.tactical.md) | e2e | [privacy](../../e2e/privacy.spec.ts), [start](../../e2e/start.spec.ts) | e2e:technical (+ full suite) |
| `TS-WEB-0014-A14` | [TS-WEB-0014](../../specs/tactical/TS-WEB-0014--security.tactical.md) | e2e | [csp-hydration](../../e2e/csp-hydration.spec.ts), [proxy.test](../../proxy.test.ts), [csp-hashes.test](../../src/lib/security/csp-hashes.test.ts) | e2e:smoke + pnpm check |
| `TS-WEB-0015-A13` | [TS-WEB-0015](../../specs/tactical/TS-WEB-0015--delivery-pipeline.tactical.md) | integration | [proxy.test](../../proxy.test.ts), [robots.integration.test](../../src/lib/seo/robots.integration.test.ts) | pnpm check |
| `TS-WEB-0016-A22` | [TS-WEB-0016](../../specs/tactical/TS-WEB-0016--forms-and-leads.tactical.md) | e2e | [page.test](../../app/start/page.test.ts), [routes](../../e2e/routes.spec.ts), [start](../../e2e/start.spec.ts) | e2e:smoke + pnpm check (+ full suite) |
| `TS-WEB-0016-A24` | [TS-WEB-0016](../../specs/tactical/TS-WEB-0016--forms-and-leads.tactical.md) | e2e | [external-links](../../e2e/external-links.spec.ts), [external-links.test](../../scripts/external-links.test.ts), [link-target.test](../../src/lib/routes/link-target.test.ts) | e2e:technical + pnpm check |
| `TS-WEB-0016-A25` | [TS-WEB-0016](../../specs/tactical/TS-WEB-0016--forms-and-leads.tactical.md) | static | [external-links](../../e2e/external-links.spec.ts), [external-links.test](../../scripts/external-links.test.ts) | e2e:technical + pnpm check |
| `TS-WEB-0017-A4` | [TS-WEB-0017](../../specs/tactical/TS-WEB-0017--technical-foundation.tactical.md) | static | [check-brand.test](../../scripts/check-brand.test.ts), [check:brand](../../scripts/check-brand.ts) | pnpm check |
| `TS-WEB-0017-A11` | [TS-WEB-0017](../../specs/tactical/TS-WEB-0017--technical-foundation.tactical.md) | static | [check-api-routes.test](../../scripts/check-api-routes.test.ts), [app-handover.test](../../src/lib/live/app-handover.test.ts) | pnpm check |
| `TS-WEB-0017-A28` | [TS-WEB-0017](../../specs/tactical/TS-WEB-0017--technical-foundation.tactical.md) | static | [check-brand.test](../../scripts/check-brand.test.ts), [check:brand](../../scripts/check-brand.ts) | pnpm check |
| `TS-WEB-0017-A29` | [TS-WEB-0017](../../specs/tactical/TS-WEB-0017--technical-foundation.tactical.md) | e2e | [cta-visible](../../e2e/cta-visible.spec.ts), [language-switch](../../e2e/language-switch.spec.ts) | full suite only (on demand) |
| `TS-WEB-0017-A30` | [TS-WEB-0017](../../specs/tactical/TS-WEB-0017--technical-foundation.tactical.md) | static | [check-brand.test](../../scripts/check-brand.test.ts), [check:brand](../../scripts/check-brand.ts) | pnpm check |
| `TS-WEB-0017-A31` | [TS-WEB-0017](../../specs/tactical/TS-WEB-0017--technical-foundation.tactical.md) | e2e | [block-gaps](../../e2e/block-gaps.spec.ts) | full suite only (on demand) |
| `TS-WEB-0017-A32` | [TS-WEB-0017](../../specs/tactical/TS-WEB-0017--technical-foundation.tactical.md) | static | [check-brand.test](../../scripts/check-brand.test.ts), [check:brand](../../scripts/check-brand.ts) | pnpm check |
| `TS-WEB-0017-A33` | [TS-WEB-0017](../../specs/tactical/TS-WEB-0017--technical-foundation.tactical.md) | e2e | [app-links](../../e2e/app-links.spec.ts) | full suite only (on demand) |
| `TS-WEB-0017-A34` | [TS-WEB-0017](../../specs/tactical/TS-WEB-0017--technical-foundation.tactical.md) | static | [check-brand.test](../../scripts/check-brand.test.ts), [check:brand](../../scripts/check-brand.ts) | pnpm check |
| `TS-WEB-0017-A35` | [TS-WEB-0017](../../specs/tactical/TS-WEB-0017--technical-foundation.tactical.md) | e2e | [context-band](../../e2e/context-band.spec.ts) | full suite only (on demand) |
| `TS-WEB-0017-A41` | [TS-WEB-0017](../../specs/tactical/TS-WEB-0017--technical-foundation.tactical.md) | e2e | [footer](../../e2e/footer.spec.ts), [language-switch](../../e2e/language-switch.spec.ts), [check:contrast](../../scripts/check-contrast.ts) | pnpm check (+ full suite) |
| `TS-WEB-0017-A42` | [TS-WEB-0017](../../specs/tactical/TS-WEB-0017--technical-foundation.tactical.md) | e2e | [footer](../../e2e/footer.spec.ts) | full suite only (on demand) |
| `TS-WEB-0017-A43` | [TS-WEB-0017](../../specs/tactical/TS-WEB-0017--technical-foundation.tactical.md) | e2e | [event-row](../../e2e/event-row.spec.ts) | full suite only (on demand) |
| `TS-WEB-0017-A44` | [TS-WEB-0017](../../specs/tactical/TS-WEB-0017--technical-foundation.tactical.md) | e2e | [explain-calendar](../../e2e/explain-calendar.spec.ts) | full suite only (on demand) |
| `TS-WEB-0019-A1` | [TS-WEB-0019](../../specs/tactical/pages/TS-WEB-0019--home.tactical.md) | static | [page.meta.test](../../app/[lang]/page.meta.test.ts) | pnpm check |
| `TS-WEB-0019-A11` | [TS-WEB-0019](../../specs/tactical/pages/TS-WEB-0019--home.tactical.md) | e2e | [pages/home](../../e2e/pages/home.spec.ts), [explain-module.test](../../src/components/explain-module/explain-module.test.tsx) | pnpm check (+ full suite) |
| `TS-WEB-0019-A14` | [TS-WEB-0019](../../specs/tactical/pages/TS-WEB-0019--home.tactical.md) | e2e | — | superseded, nothing to run |
| `TS-WEB-0019-A17` | [TS-WEB-0019](../../specs/tactical/pages/TS-WEB-0019--home.tactical.md) | e2e | [pages/home](../../e2e/pages/home.spec.ts) | full suite only (on demand) |
| `TS-WEB-0019-A18` | [TS-WEB-0019](../../specs/tactical/pages/TS-WEB-0019--home.tactical.md) | e2e | [pages/home](../../e2e/pages/home.spec.ts) | full suite only (on demand) |
| `TS-WEB-0019-A19` | [TS-WEB-0019](../../specs/tactical/pages/TS-WEB-0019--home.tactical.md) | e2e | [pages/home](../../e2e/pages/home.spec.ts) | full suite only (on demand) |
| `TS-WEB-0019-A20` | [TS-WEB-0019](../../specs/tactical/pages/TS-WEB-0019--home.tactical.md) | e2e | [pages/home-scene-media](../../e2e/pages/home-scene-media.spec.ts) | full suite only (on demand) |
| `TS-WEB-0019-A21` | [TS-WEB-0019](../../specs/tactical/pages/TS-WEB-0019--home.tactical.md) | e2e | [pages/home-scene-media](../../e2e/pages/home-scene-media.spec.ts) | full suite only (on demand) |
| `TS-WEB-0019-A22` | [TS-WEB-0019](../../specs/tactical/pages/TS-WEB-0019--home.tactical.md) | e2e | [active-place](../../e2e/active-place.spec.ts), [place-photo](../../e2e/place-photo.spec.ts) | full suite only (on demand) |
| `TS-WEB-0019-A23` | [TS-WEB-0019](../../specs/tactical/pages/TS-WEB-0019--home.tactical.md) | e2e | [module-rules](../../e2e/module-rules.spec.ts) | full suite only (on demand) |
| `TS-WEB-0020-A2` | [TS-WEB-0020](../../specs/tactical/pages/TS-WEB-0020--dein-ort.tactical.md) | e2e | [pages/dein-ort](../../e2e/pages/dein-ort.spec.ts) | full suite only (on demand) |
| `TS-WEB-0020-A4` | [TS-WEB-0020](../../specs/tactical/pages/TS-WEB-0020--dein-ort.tactical.md) | e2e | [pages/dein-ort](../../e2e/pages/dein-ort.spec.ts) | full suite only (on demand) |
| `TS-WEB-0020-A6` | [TS-WEB-0020](../../specs/tactical/pages/TS-WEB-0020--dein-ort.tactical.md) | e2e | [pages/dein-ort](../../e2e/pages/dein-ort.spec.ts) | superseded, nothing to run |
| `TS-WEB-0020-A7` | [TS-WEB-0020](../../specs/tactical/pages/TS-WEB-0020--dein-ort.tactical.md) | e2e | [pages/dein-ort](../../e2e/pages/dein-ort.spec.ts) | full suite only (on demand) |
| `TS-WEB-0020-A8` | [TS-WEB-0020](../../specs/tactical/pages/TS-WEB-0020--dein-ort.tactical.md) | integration | [pages/dein-ort](../../e2e/pages/dein-ort.spec.ts), [pages/home](../../e2e/pages/home.spec.ts) | full suite only (on demand) |
| `TS-WEB-0020-A10` | [TS-WEB-0020](../../specs/tactical/pages/TS-WEB-0020--dein-ort.tactical.md) | e2e | [pages/dein-ort](../../e2e/pages/dein-ort.spec.ts) | full suite only (on demand) |
| `TS-WEB-0020-A16` | [TS-WEB-0020](../../specs/tactical/pages/TS-WEB-0020--dein-ort.tactical.md) | e2e | [pages/dein-ort](../../e2e/pages/dein-ort.spec.ts) | full suite only (on demand) |
| `TS-WEB-0020-A17` | [TS-WEB-0020](../../specs/tactical/pages/TS-WEB-0020--dein-ort.tactical.md) | unit | [stage-anchor.test](../../src/lib/content/stage-anchor.test.ts) | pnpm check |
| `TS-WEB-0020-A18` | [TS-WEB-0020](../../specs/tactical/pages/TS-WEB-0020--dein-ort.tactical.md) | e2e | [pages/dein-ort](../../e2e/pages/dein-ort.spec.ts) | full suite only (on demand) |
| `TS-WEB-0020-A19` | [TS-WEB-0020](../../specs/tactical/pages/TS-WEB-0020--dein-ort.tactical.md) | integration | [bff-place-photo.integration.test](../../src/lib/live/bff-place-photo.integration.test.ts) | pnpm check |
| `TS-WEB-0020-A20` | [TS-WEB-0020](../../specs/tactical/pages/TS-WEB-0020--dein-ort.tactical.md) | e2e | [place-photo](../../e2e/place-photo.spec.ts) | full suite only (on demand) |
| `TS-WEB-0020-A21` | [TS-WEB-0020](../../specs/tactical/pages/TS-WEB-0020--dein-ort.tactical.md) | e2e | [place-photo](../../e2e/place-photo.spec.ts) | full suite only (on demand) |
| `TS-WEB-0020-A22` | [TS-WEB-0020](../../specs/tactical/pages/TS-WEB-0020--dein-ort.tactical.md) | e2e | [place-photo](../../e2e/place-photo.spec.ts) | full suite only (on demand) |
| `TS-WEB-0020-A23` | [TS-WEB-0020](../../specs/tactical/pages/TS-WEB-0020--dein-ort.tactical.md) | e2e | [module-rules](../../e2e/module-rules.spec.ts), [pages/dein-ort](../../e2e/pages/dein-ort.spec.ts), [value-story.test](../../src/components/value-story/value-story.test.tsx) | pnpm check (+ full suite) |
| `TS-WEB-0020-A24` | [TS-WEB-0020](../../specs/tactical/pages/TS-WEB-0020--dein-ort.tactical.md) | e2e | [pages/dein-ort](../../e2e/pages/dein-ort.spec.ts) | full suite only (on demand) |
| `TS-WEB-0020-A25` | [TS-WEB-0020](../../specs/tactical/pages/TS-WEB-0020--dein-ort.tactical.md) | e2e | [pages/dein-ort](../../e2e/pages/dein-ort.spec.ts) | full suite only (on demand) |
| `TS-WEB-0020-A26` | [TS-WEB-0020](../../specs/tactical/pages/TS-WEB-0020--dein-ort.tactical.md) | e2e | [pages/dein-ort](../../e2e/pages/dein-ort.spec.ts) | full suite only (on demand) |
| `TS-WEB-0020-A27` | [TS-WEB-0020](../../specs/tactical/pages/TS-WEB-0020--dein-ort.tactical.md) | e2e | [active-place](../../e2e/active-place.spec.ts), [active-place.test](../../src/lib/pages/active-place.test.ts) | pnpm check (+ full suite) |
| `TS-WEB-0020-A28` | [TS-WEB-0020](../../specs/tactical/pages/TS-WEB-0020--dein-ort.tactical.md) | e2e | [place-photo](../../e2e/place-photo.spec.ts) | full suite only (on demand) |
| `TS-WEB-0021-A2` | [TS-WEB-0021](../../specs/tactical/pages/TS-WEB-0021--dein-ort-starten.tactical.md) | e2e | [pages/dein-ort-starten](../../e2e/pages/dein-ort-starten.spec.ts) | full suite only (on demand) |
| `TS-WEB-0021-A9` | [TS-WEB-0021](../../specs/tactical/pages/TS-WEB-0021--dein-ort-starten.tactical.md) | e2e | [pages/dein-ort-starten](../../e2e/pages/dein-ort-starten.spec.ts) | full suite only (on demand) |
| `TS-WEB-0021-A10` | [TS-WEB-0021](../../specs/tactical/pages/TS-WEB-0021--dein-ort-starten.tactical.md) | e2e | [pages/dein-ort-starten](../../e2e/pages/dein-ort-starten.spec.ts) | full suite only (on demand) |
| `TS-WEB-0022-A6` | [TS-WEB-0022](../../specs/tactical/pages/TS-WEB-0022--mitmachen.tactical.md) | e2e | [pages/mitmachen](../../e2e/pages/mitmachen.spec.ts) | full suite only (on demand) |
| `TS-WEB-0022-A13` | [TS-WEB-0022](../../specs/tactical/pages/TS-WEB-0022--mitmachen.tactical.md) | e2e | [pages/mitmachen](../../e2e/pages/mitmachen.spec.ts) | full suite only (on demand) |
| `TS-WEB-0022-A18` | [TS-WEB-0022](../../specs/tactical/pages/TS-WEB-0022--mitmachen.tactical.md) | e2e | [explain-module](../../e2e/explain-module.spec.ts) | superseded, nothing to run |
| `TS-WEB-0022-A20` | [TS-WEB-0022](../../specs/tactical/pages/TS-WEB-0022--mitmachen.tactical.md) | e2e | [explain-module](../../e2e/explain-module.spec.ts) | full suite only (on demand) |
| `TS-WEB-0022-A21` | [TS-WEB-0022](../../specs/tactical/pages/TS-WEB-0022--mitmachen.tactical.md) | e2e | [explain-module](../../e2e/explain-module.spec.ts) | full suite only (on demand) |
| `TS-WEB-0022-A22` | [TS-WEB-0022](../../specs/tactical/pages/TS-WEB-0022--mitmachen.tactical.md) | e2e | [explain-stage](../../e2e/explain-stage.spec.ts) | full suite only (on demand) |
| `TS-WEB-0022-A23` | [TS-WEB-0022](../../specs/tactical/pages/TS-WEB-0022--mitmachen.tactical.md) | e2e | [module-designs](../../e2e/module-designs.spec.ts) | full suite only (on demand) |
| `TS-WEB-0023-A12` | [TS-WEB-0023](../../specs/tactical/pages/TS-WEB-0023--registrieren.tactical.md) | static | [pages/registrieren](../../e2e/pages/registrieren.spec.ts) | full suite only (on demand) |
| `TS-WEB-0023-A13` | [TS-WEB-0023](../../specs/tactical/pages/TS-WEB-0023--registrieren.tactical.md) | e2e | **none** | — |
| `TS-WEB-0023-A17` | [TS-WEB-0023](../../specs/tactical/pages/TS-WEB-0023--registrieren.tactical.md) | e2e | [pages/registrieren](../../e2e/pages/registrieren.spec.ts) | full suite only (on demand) |
| `TS-WEB-0023-A18` | [TS-WEB-0023](../../specs/tactical/pages/TS-WEB-0023--registrieren.tactical.md) | e2e | [pages/registrieren](../../e2e/pages/registrieren.spec.ts) | full suite only (on demand) |
| `TS-WEB-0023-A19` | [TS-WEB-0023](../../specs/tactical/pages/TS-WEB-0023--registrieren.tactical.md) | e2e | [pages/registrieren](../../e2e/pages/registrieren.spec.ts) | full suite only (on demand) |
| `TS-WEB-0023-A20` | [TS-WEB-0023](../../specs/tactical/pages/TS-WEB-0023--registrieren.tactical.md) | e2e | [pages/registrieren](../../e2e/pages/registrieren.spec.ts) | full suite only (on demand) |
| `TS-WEB-0023-A21` | [TS-WEB-0023](../../specs/tactical/pages/TS-WEB-0023--registrieren.tactical.md) | e2e | [csp-hydration](../../e2e/csp-hydration.spec.ts) | e2e:smoke |
| `TS-WEB-0023-A22` | [TS-WEB-0023](../../specs/tactical/pages/TS-WEB-0023--registrieren.tactical.md) | e2e | [pages/registrieren](../../e2e/pages/registrieren.spec.ts) | full suite only (on demand) |
| `TS-WEB-0024-A2` | [TS-WEB-0024](../../specs/tactical/pages/TS-WEB-0024--dein-kalender.tactical.md) | e2e | [pages/dein-kalender](../../e2e/pages/dein-kalender.spec.ts) | full suite only (on demand) |
| `TS-WEB-0024-A13` | [TS-WEB-0024](../../specs/tactical/pages/TS-WEB-0024--dein-kalender.tactical.md) | e2e | [pages/dein-kalender](../../e2e/pages/dein-kalender.spec.ts) | full suite only (on demand) |
| `TS-WEB-0024-A20` | [TS-WEB-0024](../../specs/tactical/pages/TS-WEB-0024--dein-kalender.tactical.md) | e2e | [embed](../../e2e/embed.spec.ts) | full suite only (on demand) |
| `TS-WEB-0024-A21` | [TS-WEB-0024](../../specs/tactical/pages/TS-WEB-0024--dein-kalender.tactical.md) | e2e | [embed](../../e2e/embed.spec.ts) | full suite only (on demand) |
| `TS-WEB-0024-A22` | [TS-WEB-0024](../../specs/tactical/pages/TS-WEB-0024--dein-kalender.tactical.md) | e2e | [embed](../../e2e/embed.spec.ts) | fixme — never runs |
| `TS-WEB-0024-A23` | [TS-WEB-0024](../../specs/tactical/pages/TS-WEB-0024--dein-kalender.tactical.md) | e2e | [module-designs](../../e2e/module-designs.spec.ts), [comparison-table.test](../../src/components/comparison-table/comparison-table.test.tsx) | pnpm check (+ full suite) |
| `TS-WEB-0024-A24` | [TS-WEB-0024](../../specs/tactical/pages/TS-WEB-0024--dein-kalender.tactical.md) | e2e | [module-designs](../../e2e/module-designs.spec.ts) | full suite only (on demand) |
| `TS-WEB-0024-A25` | [TS-WEB-0024](../../specs/tactical/pages/TS-WEB-0024--dein-kalender.tactical.md) | e2e | [module-designs](../../e2e/module-designs.spec.ts) | full suite only (on demand) |
| `TS-WEB-0024-A26` | [TS-WEB-0024](../../specs/tactical/pages/TS-WEB-0024--dein-kalender.tactical.md) | e2e | [module-designs](../../e2e/module-designs.spec.ts) | full suite only (on demand) |
| `TS-WEB-0027-A2` | [TS-WEB-0027](../../specs/tactical/pages/TS-WEB-0027--ueber-uns.tactical.md) | e2e | [page-rhythm.test](../../app/[lang]/ueber-uns/page-rhythm.test.ts), [pages/ueber-uns](../../e2e/pages/ueber-uns.spec.ts) | pnpm check (+ full suite) |
| `TS-WEB-0027-A3` | [TS-WEB-0027](../../specs/tactical/pages/TS-WEB-0027--ueber-uns.tactical.md) | e2e | [pages/ueber-uns](../../e2e/pages/ueber-uns.spec.ts) | full suite only (on demand) |
| `TS-WEB-0027-A5` | [TS-WEB-0027](../../specs/tactical/pages/TS-WEB-0027--ueber-uns.tactical.md) | e2e | [pages/ueber-uns](../../e2e/pages/ueber-uns.spec.ts) | full suite only (on demand) |
| `TS-WEB-0027-A6` | [TS-WEB-0027](../../specs/tactical/pages/TS-WEB-0027--ueber-uns.tactical.md) | e2e | [stream.test](../../app/[lang]/ueber-uns/stream.test.ts) | pnpm check |
| `TS-WEB-0027-A7` | [TS-WEB-0027](../../specs/tactical/pages/TS-WEB-0027--ueber-uns.tactical.md) | integration | **none** | — |
| `TS-WEB-0027-A8` | [TS-WEB-0027](../../specs/tactical/pages/TS-WEB-0027--ueber-uns.tactical.md) | e2e | [pages/ueber-uns](../../e2e/pages/ueber-uns.spec.ts) | full suite only (on demand) |
| `TS-WEB-0027-A11` | [TS-WEB-0027](../../specs/tactical/pages/TS-WEB-0027--ueber-uns.tactical.md) | e2e | **none** | — |
| `TS-WEB-0027-A17` | [TS-WEB-0027](../../specs/tactical/pages/TS-WEB-0027--ueber-uns.tactical.md) | e2e | [pages/ueber-uns](../../e2e/pages/ueber-uns.spec.ts) | full suite only (on demand) |
| `TS-WEB-0028-A7` | [TS-WEB-0028](../../specs/tactical/pages/TS-WEB-0028--archiv.tactical.md) | integration | — | superseded, nothing to run |
| `TS-WEB-0028-A14` | [TS-WEB-0028](../../specs/tactical/pages/TS-WEB-0028--archiv.tactical.md) | manual | — | manual check |
| `TS-WEB-0028-A15` | [TS-WEB-0028](../../specs/tactical/pages/TS-WEB-0028--archiv.tactical.md) | integration | [media-echo-citations.integration.test](../../src/lib/content/media-echo-citations.integration.test.ts) | pnpm check |
| `TS-WEB-0028-A16` | [TS-WEB-0028](../../specs/tactical/pages/TS-WEB-0028--archiv.tactical.md) | e2e | [pages/archiv](../../e2e/pages/archiv.spec.ts) | full suite only (on demand) |
| `TS-WEB-0028-A17` | [TS-WEB-0028](../../specs/tactical/pages/TS-WEB-0028--archiv.tactical.md) | e2e | [pages/archiv](../../e2e/pages/archiv.spec.ts) | full suite only (on demand) |
| `TS-WEB-0028-A18` | [TS-WEB-0028](../../specs/tactical/pages/TS-WEB-0028--archiv.tactical.md) | e2e | [pages/archiv](../../e2e/pages/archiv.spec.ts) | full suite only (on demand) |
| `TS-WEB-0028-A19` | [TS-WEB-0028](../../specs/tactical/pages/TS-WEB-0028--archiv.tactical.md) | e2e | [pages/archiv](../../e2e/pages/archiv.spec.ts) | full suite only (on demand) |
