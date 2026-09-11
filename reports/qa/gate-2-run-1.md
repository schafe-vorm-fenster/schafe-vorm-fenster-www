# Gate 2 — QA Acceptance Run 1

Scope: `plan/gate-2-scope.md` — structure (TS-004, TS-006, TS-002, TS-001),
the twelve page specs (TS-019–TS-029) in both locales at 360 px and
desktop, content (TS-007 plus the compliance check), the M4 systems
(TS-005, TS-008, TS-009, TS-010, TS-011, TS-012, TS-013, TS-016) and the
TS-014 security sweep. **333 acceptance criteria**, each at the level its
own spec declares (`specs/verification/verification-strategy.md`).

Skills loaded: `webapp-testing` (browser-level criteria, Playwright
1.63 against the run's dev server), `web-design-guidelines` (the a11y/UX
criteria), and for the security sweep `semgrep` (important-only, plan
self-approved — no human in this loop) and `differential-review` over
`7b3624d..HEAD`.

## Environment and evidence commands

| What | Result |
| --- | --- |
| Dev server | `pnpm dev`, port 3100, reused for the whole run |
| Preview | `https://schafe-vorm-fenster-cmijfafo8-schafe-vorm-fenster.vercel.app`, bypass header from `.env.local` |
| `pnpm check` | **exit 0** — 8 static guards, 40 static tests, 704 unit+integration tests (1 skipped), typecheck, lint. `check:content` emits 20 warnings (dummy-content / empty `derived_from`), `check:specs` emits the W3 coverage warning |
| `pnpm e2e` (local) | **263 passed, 16 skipped, 0 failed** |
| `pnpm e2e` (preview, `E2E_BASE_URL`) | **256 passed, 23 skipped, 0 failed** |
| `pnpm build` | **exit 0**; 305 CSP hashes from 435 inline scripts across 39 pages |
| `npx lighthouse` (preview `/`) | accessibility **100** mobile, **100** desktop |
| `semgrep` (important-only, `app/ src/ scripts/`) | 6 findings, **all false positives** — see §Security sweep |
| `differential-review` (`7b3624d..HEAD`) | 487 files, +43 771/−225, 51 commits — one HIGH, four MEDIUM/LOW |

## How each verdict was reached

`scripts/check-specs.ts` reports which criteria a test names (W3): **123
of the 333 in scope are named by no test at all**. Those were decided by
hand this run — by reading the guard or the implementing code for `static`
and `unit`, by `curl` against the dev server for `integration`, in a real
browser for `e2e`, by running the tool for `tool`, and by performing the
documented check for `manual`.

Two warnings about the other 210. First, "the suite is green" is not by
itself a verdict, and three criteria were **overridden to fail despite a
green test naming them** — TS-004-A1, TS-004-A4 and TS-004-A5, where the
tests assert a narrower thing than the criterion says (F-2-31, F-2-55).
Second, sixteen e2e cases are `test.skip`ped with reasons; several of those
reasons read "[M4 — … not built]", and M4 is in scope at this gate, so
those skips were re-examined by hand rather than accepted — which is how
F-2-30 surfaced.

## Verdicts per criterion

### TS-004 — URL and routing

| AC | Level | Verdict | Evidence |
| --- | --- | --- | --- |
| A1 | integration | **fail** | `/start` and `/llms.txt` 404; the tests assert against the route registry, not against D1 → F-2-55 |
| A2 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | integration | **fail** | `/mitmachen` answers 200 on a landing-only Host → F-2-45 |
| A4 | integration | **fail** | 404 carries a developer note as copy and neither place search nor jobs band → F-2-31 |
| A5 | integration | **fail** | `/start` and `/llms.txt` 404; the tests assert against the route registry, not against D1 → F-2-55 |
| A6 | e2e | **pass** | every request across 24 routes + four `?ort=` fixtures went to the origin only. Vacuous: envoy/Portalize/eTracker issue no client request (mocks/off) |
| A7 | integration | **pass** | code read + curl against :3100 |
| A8 | e2e | **fail** | header labels match D4 on every page, but the newsletter consent line links `/en/legal#datenschutz`, an id the English page does not have → F-2-64 |
| A9 | integration | **pass** | code read + curl against :3100 |
| A10 | static | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | integration | **not-testable** | `/{community}` forwarding is not built — skipped with a recorded reason, which the criterion itself prescribes |

### TS-006 — Page composition

| AC | Level | Verdict | Evidence |
| --- | --- | --- | --- |
| A1 | static | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A2 | static | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A4 | e2e | **pass** | `/`, `/dein-ort` and their EN twins at 360 and 1280: the search form is inside the first screen and the only `data-cta="primary"` is its submit button, not a link |
| A5 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | e2e | **fail** | the band is suppressed on registration steps 2-3 → F-2-10, recorded not re-filed |
| A7 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A8 | static | **fail** | generic-claims term list does not exist (spec says so at :317) → F-2-43 |
| A9 | static | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A10 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | static | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A12 | static | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A13 | e2e | **not-testable** | neither page carries the two-working-day wording — it is withheld while C11/Q-022 is unsigned, which is what TS-016-A13 requires; that withholding is itself F-2-57 |
| A14 | manual | **not-testable** | SRC-001's eight-point check is not reachable from this repo → F-2-18 |
| A15 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |

### TS-002 — Accessibility

| AC | Level | Verdict | Evidence |
| --- | --- | --- | --- |
| A1 | tool | **not-testable** | axe is green on 24 routes x 2 viewports, but the light theme only — 2 of 3 declared themes are never swept → F-2-58 |
| A2 | tool | **pass** | Lighthouse accessibility = 100 on mobile and desktop, preview `/` |
| A3 | static | **fail** | no contrast check over the token set exists anywhere → F-2-43 |
| A4 | manual | **not-testable** | chaos:keyboard-only walked the entry points (C-K-3..C-K-8) with no traps; no complete per-release walkthrough of all four jobs exists |
| A5 | manual | **not-testable** | no VoiceOver/NVDA available to this run |
| A6 | tool | **not-testable** | the real envoy widget is undelivered (Q-022); only the mock mount is sweepable |
| A7 | e2e | **pass** | 320x800 on all 24 routes: scrollWidth == clientWidth everywhere (two independent runs) |
| A8 | integration | **pass** | code read + curl against :3100 |
| A9 | e2e | **pass** | `reducedMotion: reduce` on all 24 routes: zero elements with an animation or a non-opacity transition > 50 ms |
| A10 | static | **fail** | own type scale, 11 px + 12 px tokens, literal weights; guard covers colour + family only → F-2-44 |
| A11 | tool | **pass** | axe `image-alt` clean across 24 routes x 2 viewports (`e2e/a11y.spec.ts`) |
| A12 | manual | **pass** | `content/legal/accessibility.md` names self-assessment and claims no audit; the ticket ids in it are F-2-35 |

### TS-001 — Locale routing

| AC | Level | Verdict | Evidence |
| --- | --- | --- | --- |
| A1 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A2 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A5 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A7 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A8 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A10 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | static | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |

### TS-019 — / (home)

| AC | Level | Verdict | Evidence |
| --- | --- | --- | --- |
| A1 | static | **pass** | static read of the guard/manifest; `pnpm check` green |
| A2 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | e2e | **fail** | `/` ignores `?ort=` entirely; all three inputs render the stage-0 anchor → F-2-30 |
| A4 | e2e | **fail** | `/` ignores `?ort=` entirely; all three inputs render the stage-0 anchor → F-2-30 |
| A5 | e2e | **fail** | `/` ignores `?ort=` entirely; all three inputs render the stage-0 anchor → F-2-30 |
| A6 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A7 | e2e | **not-testable** | personalization stage 2 never fires in the running app → F-2-14 |
| A8 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A9 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A10 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A12 | static | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A13 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A14 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A15 | manual | **not-testable** | SRC-001's eight-point check is not reachable from this repo → F-2-18 |

### TS-020 — /dein-ort

| AC | Level | Verdict | Evidence |
| --- | --- | --- | --- |
| A1 | static | **pass** | static read of the guard/manifest; `pnpm check` green |
| A2 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A4 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A5 | static | **fail** | the stories carry no `proof_ref` — the criterion's subject is absent → F-2-43 (TS-005-A15) |
| A6 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A7 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A8 | integration | **not-testable** | emission goes to `createMockTracker()` by decision; two of the wrapped call sites were observed in the markup |
| A9 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A10 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A12 | e2e | **not-testable** | no CLS measurement harness in this run; and with no skeletons (F-2-39) the counter branches do not exist |
| A13 | manual | **not-testable** | no content/tone review record exists for this run |

### TS-021 — /dein-ort/starten

| AC | Level | Verdict | Evidence |
| --- | --- | --- | --- |
| A1 | static | **pass** | static read of the guard/manifest; `pnpm check` green |
| A2 | e2e | **fail** | `/dein-ort/starten` is a dynamic route against TS-021 D10 → F-2-13, recorded not re-filed |
| A3 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A4 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A5 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | integration | **fail** | the uncovered branch is consumed by nothing; searching 99999 renders a covered demo place → F-2-30 |
| A7 | integration | **fail** | `?ort=beispielwalde` answers 200, not 302, and tells a covered place it is uncovered → F-2-49 |
| A8 | integration | **not-testable** | the place-search upstream is a declared mock; an outage keeps the module at tier 1 |
| A9 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A10 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | static | **fail** | title/description come from the placeholder dictionary, not frontmatter; canonical + JSON-LD clauses hold |
| A12 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A13 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A14 | e2e | **fail** | the uncovered branch is consumed by nothing; searching 99999 renders a covered demo place → F-2-30 |
| A15 | manual | **not-testable** | no content/tone review record exists for this run |

### TS-022 — /mitmachen

| AC | Level | Verdict | Evidence |
| --- | --- | --- | --- |
| A1 | static | **pass** | static read of the guard/manifest; `pnpm check` green |
| A2 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A4 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A5 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A7 | unit | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A8 | integration | **not-testable** | neither branch reachable: no candidate list is passed, and events-api is a declared mock |
| A9 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A10 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | e2e | **pass** | closing CTA label, target and goal are identical to the primary; the permanence promise is absent rather than reworded, which the criterion's own second sentence prescribes |
| A12 | static | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A13 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A14 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A15 | integration | **pass** | code read + curl against :3100 |
| A16 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |

### TS-023 — /mitmachen/registrieren

| AC | Level | Verdict | Evidence |
| --- | --- | --- | --- |
| A1 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A2 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | e2e | **pass** | the step-2 URL reopened in a fresh browser context shows the same step with the same answers; no cookie and no storage entry set by the page |
| A4 | unit | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A5 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A7 | e2e | **fail** | the CTA lands on step 2; step 1 is skipped and the place is neither shown nor changeable → F-2-62 |
| A8 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A9 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A10 | e2e | **pass** | exactly one `register-as-publisher` / `stage: handover` on the handover click; no `publish-first-event` anywhere in the sweep |
| A11 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A12 | static | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A13 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A14 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A15 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A16 | tool | **not-testable** | axe sweeps the light theme only and not the flows' later steps or the shadow root → F-2-58 |

### TS-024 — /dein-kalender

| AC | Level | Verdict | Evidence |
| --- | --- | --- | --- |
| A1 | static | **pass** | static read of the guard/manifest; `pnpm check` green |
| A2 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A4 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A5 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A7 | e2e | **not-testable** | cookie/storage half passes (both empty after load), but "with the loader allowed" cannot be exercised — no third-party script request is made at all → F-2-15 |
| A8 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A9 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A10 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | static | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A12 | unit | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A13 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A14 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A15 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A16 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A17 | e2e | **pass** | closing CTA shares label and target with the primary, uses the ink fill not Pulse (rgb(23,29,13) vs rgb(188,28,90)); the band names exactly the three non-focus jobs |
| A18 | static | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A19 | manual | **fail** | `dein-kalender-6-trust` has an empty `derived_from` and ships anyway → F-2-57 |

### TS-025 — /dein-kalender/bestellen

| AC | Level | Verdict | Evidence |
| --- | --- | --- | --- |
| A1 | static | **pass** | static read of the guard/manifest; `pnpm check` green |
| A2 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A4 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A5 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A7 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A8 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A9 | e2e | **pass** | four sentinel-filled invoice fields submitted: no value reached our origin, any log line or any analytics payload. Judged against the envoy order mock |
| A10 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A12 | tool | **not-testable** | axe sweeps the light theme only and not the flows' later steps or the shadow root → F-2-58 |
| A13 | manual | **not-testable** | no screen reader available; the keyboard half was walked at entry-point level only |
| A14 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |

### TS-026 — /deine-region (+ /angebot)

| AC | Level | Verdict | Evidence |
| --- | --- | --- | --- |
| A1 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A2 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A4 | static | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A5 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A7 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A8 | static | **fail** | wording ships in two content files and a second module; no term lint → F-2-43 |
| A9 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A10 | e2e | **fail** | block 3 asserts "Landkreis geoname.900001" at stage 0 — a county named, with a raw internal id → F-2-63 |
| A11 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A12 | e2e | **fail** | the embed demo never requests the Portalize host; the label and blocked-loader clauses pass → F-2-15, recorded not re-filed |
| A13 | e2e | **not-testable** | the envoy widget is a declared mock with no submit handler, so no completed-stage event can fire |
| A14 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A15 | static | **fail** | `liveModules` declares 1 where D1 names 4; no `page.meta.test.ts` → F-2-50 |
| A16 | static | **pass** | static read of the guard/manifest; `pnpm check` green |
| A17 | manual | **fail** | the map claim ships without an owner confirmation → F-2-57 |

### TS-027 — /ueber-uns

| AC | Level | Verdict | Evidence |
| --- | --- | --- | --- |
| A1 | static | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A2 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A4 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A5 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | e2e | **pass** | exactly one empty slot, visible, hatch + label + one sentence, zero images, byte-identical after 5.3 s, present in the accessibility tree, `getAnimations()` empty |
| A7 | integration | **not-testable** | needs two content fixtures; no fixture seam exists. Live half observed 6+1, but `select.ts:80-105` enforces no reservation |
| A8 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A9 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A10 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | e2e | **not-testable** | stage 0 and a fully geo-headed request render identical block order with the empty slot in both, but stage 1 is unreachable in the running app (`GEO_STAGE1_SOURCE` off), so the "only the six filled elements differ" clause cannot be exercised |
| A12 | static | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A13 | integration | **pass** | code read + curl against :3100 |
| A14 | e2e | **pass** | hero 21/9, proof slot 5/2, portrait 4/5 all declared before data; PerformanceObserver over load plus full scroll measured CLS = 0.0048 |
| A15 | manual | **pass** | every photo carries `Nicht motivgenau · Platzhalter`; `Foto gesucht` surfaces present |

### TS-028 — /ueber-uns/archiv

| AC | Level | Verdict | Evidence |
| --- | --- | --- | --- |
| A1 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A2 | static | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A4 | e2e | **fail** | selecting a chip changes the count line to "1 VON 6" but leaves all six rows rendered and visible → F-2-59 |
| A5 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | e2e | **not-testable** | vacuous while F-2-59 is open: no row is ever removed, so there is no surviving subset whose order could differ |
| A7 | integration | **not-testable** | the media-echo pipeline has zero cleared entries (Q-045) |
| A8 | tool | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A9 | e2e | **pass** | JavaScript disabled: all six cleared rows render and are visible; the chip container is absent from the DOM entirely |
| A10 | tool | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A12 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A13 | tool | **not-testable** | no CLS measurement harness in this run; and with no skeletons (F-2-39) the counter branches do not exist |
| A14 | manual | **fail** | no archive row carries an outbound link → F-2-47 |

### TS-029 — /rechtliches

| AC | Level | Verdict | Evidence |
| --- | --- | --- | --- |
| A1 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A2 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A4 | static | **pass** | static read of the guard/manifest; `pnpm check` green |
| A5 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A7 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A8 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A9 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A10 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A12 | tool | **not-testable** | axe is green on 24 routes x 2 viewports, but the light theme only — 2 of 3 declared themes are never swept → F-2-58 |
| A13 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A14 | integration | **fail** | a heading level is skipped inside the imported privacy policy → F-2-19, recorded not re-filed |

### TS-007 — Content pipeline

| AC | Level | Verdict | Evidence |
| --- | --- | --- | --- |
| A1 | unit | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A2 | tool | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | tool | **not-testable** | no clearance check exists to re-validate against — blocked, reported against F-2-18 |
| A4 | integration | **fail** | `check:content` is not a build step; no clearance check exists → F-2-43 |
| A5 | tool | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | unit | **not-testable** | `validate.ts:14` marks facet completeness "partial"; `editorial_weight`/`job_relation` do not exist in the schema — blocked, F-2-18 |
| A7 | unit | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A8 | static | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A9 | unit | **not-testable** | `validate.ts:16` marks harmonisation "partial" — records/slots/provenance only; claims, proof bindings, CTA target, goal and numbers unchecked — F-2-18 |
| A10 | tool | **pass** | ids reconciled against the installed packages in `src/lib/pages/page-meta.test.ts:38-46`. gate-2-scope listed A10 as blocked; the unit check now discharges it |
| A11 | integration | **fail** | no `content/legal/<locale>/`; `/en/legal` renders German bodies → F-2-46 |
| A12 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A13 | tool | **not-testable** | no glossary lint exists — blocked, reported against F-2-18 per gate-2-scope §1.3 |
| A14 | integration | **fail** | all 22 artefacts + the accessibility statement are `draft` and render → F-2-40 |
| A15 | manual | **not-testable** | no bumped package version to dry-run P7 against → F-2-18 |
| A16 | tool | **not-testable** | no segment-independence lint exists — blocked, reported against F-2-18 (F-2-34 is the counter-example) |

### TS-005 — Relevance engine

| AC | Level | Verdict | Evidence |
| --- | --- | --- | --- |
| A1 | unit | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A2 | unit | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | unit | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A4 | unit | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A5 | unit | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | unit | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A7 | unit | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A8 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A9 | integration | **fail** | no `<Suspense>`; `selectProof()` awaited inline in every page body → F-2-39 |
| A10 | e2e | **pass** | every place-bound proof/module named a covered demo place at stage 0 and with all four `?ort=` fixtures; judged against the geo/events mocks |
| A11 | unit | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A12 | unit | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A13 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A14 | unit | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A15 | static | **fail** | no `claims` key, no proof resolution in `validate.ts` → F-2-43 |
| A16 | unit | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |

### TS-008 — Live data

| AC | Level | Verdict | Evidence |
| --- | --- | --- | --- |
| A1 | static | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A2 | unit | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | unit | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A4 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A5 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | e2e | **fail** | primary CTA stays the search submit, position 2 renders empty, and raw markdown backticks leak into the copy → F-2-61 |
| A7 | e2e | **fail** | searching the uncovered ZIP stays on `/dein-ort` and renders another place's calendar → F-2-30 |
| A8 | e2e | **fail** | zero requests to the Portalize host; position 1 absence and the blocked-loader clause hold → F-2-15, recorded not re-filed |
| A9 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A10 | static | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | unit | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A12 | manual | **not-testable** | the Portalize embed is not wired → F-2-15 |
| A13 | tool | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A14 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |

### TS-009 — Rendering and resilience

| AC | Level | Verdict | Evidence |
| --- | --- | --- | --- |
| A1 | static | **pass** | static read of the guard/manifest; `pnpm check` green |
| A2 | tool | **fail** | build manifest: zero `◐` routes, four content routes fully dynamic → F-2-56 |
| A3 | integration | **fail** | zero skeletons in any page's HTML → F-2-39 |
| A4 | unit | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A5 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A7 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A8 | tool | **not-testable** | no CLS measurement harness in this run; and with no skeletons (F-2-39) the counter branches do not exist |
| A9 | integration | **fail** | `moduleSkeleton()` has no call site → F-2-39 |
| A10 | unit | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A12 | tool | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A13 | manual | **not-testable** | no screen reader available; and no skeleton renders anywhere (F-2-39) |

### TS-010 — Personalization

| AC | Level | Verdict | Evidence |
| --- | --- | --- | --- |
| A1 | unit | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A2 | unit | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | unit | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A4 | integration | **pass** | code read + curl against :3100 |
| A5 | integration | **fail** | one `EmptyProofSlot` renders at stage 0 on `/mitmachen` and `/ueber-uns` → F-2-52 (spec collision) |
| A6 | integration | **pass** | code read + curl against :3100 |
| A7 | e2e | **pass** | all 24 routes: no select, no top-level radio group, no tab/dialog role, no "who are you" copy. Registration step 2 is a flow answer, not a site classifier |
| A8 | e2e | **not-testable** | `getCurrentPosition`/`watchPosition` patched before load: zero calls on load and on full scroll (that half passes), but the D5 explicit control is not built, so the prompt and denial clauses have no trigger |
| A9 | tool | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A10 | unit | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | static | **pass** | static read of the guard/manifest; `pnpm check` green |
| A12 | e2e | **pass** | across six walked routes: zero cookies, zero `Set-Cookie`, empty `localStorage`/`sessionStorage`. The D10 session flag is not built, so "the only stored key" is vacuous |
| A13 | e2e | **not-testable** | the language suggestion is not built in phase 1 (TS-010 D10); the criterion says "(when built)" |
| A14 | e2e | **pass** | primary conversion identical at stage 0 and stage 3 on all 12 DE routes; only `/dein-ort/starten` gains `?ort=` on the same target, which TS-022-A14 sanctions |
| A15 | manual | **not-testable** | the geo flag is off (verified), but no Q-008 sign-off record exists in this repo |

### TS-011 — SEO

| AC | Level | Verdict | Evidence |
| --- | --- | --- | --- |
| A1 | static | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A2 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | tool | **fail** | a heading level is skipped inside the privacy policy (F-2-19); no HTML validator run |
| A4 | integration | **fail** | context band is a `section` in `main`, absent on four pages; 1 `<aside>` in total → F-2-41 |
| A5 | tool | **not-testable** | schema.org validator / Rich Results Test not run in this environment |
| A6 | static | **pass** | static read of the guard/manifest; `pnpm check` green |
| A7 | static | **fail** | no title/description length or uniqueness check → F-2-43 |
| A8 | integration | **fail** | no `og:image*`, no `twitter:image`; `twitter:card` = summary → F-2-42 |
| A9 | e2e | **fail** | no page emits `og:image` at all, so the criterion has no subject → F-2-42 |
| A10 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | static | **pass** | static read of the guard/manifest; `pnpm check` green |
| A12 | manual | **not-testable** | no interest landing page exists — the criterion has no subject yet |
| A13 | manual | **not-testable** | post-cutover Search Console observation; nothing is launched |
| A14 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |

### TS-012 — Analytics

| AC | Level | Verdict | Evidence |
| --- | --- | --- | --- |
| A1 | static | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A2 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | static | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A4 | unit | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A5 | e2e | **fail** | `buy-calendar-licence` fires a second time on soft back/forward → F-2-60 |
| A6 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A7 | integration | **pass** | code read + curl against :3100 |
| A8 | tool | **not-testable** | `EtrackerLoader` is never imported and the tracker is the mock adapter (`state/open.md` row 83) |
| A9 | static | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A10 | manual | **not-testable** | `EtrackerLoader` is never imported and the tracker is the mock adapter (`state/open.md` row 83) |
| A11 | static | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |

### TS-013 — Privacy

| AC | Level | Verdict | Evidence |
| --- | --- | --- | --- |
| A1 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A2 | e2e | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | static | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A5 | integration | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |

### TS-016 — Forms and leads

| AC | Level | Verdict | Evidence |
| --- | --- | --- | --- |
| A1 | static | **pass** | static read of the guard/manifest; `pnpm check` green |
| A2 | integration | **fail** | S2's quote mount is missing on `/deine-region` → F-2-48 |
| A3 | e2e | **pass** | five sentinel-filled quote fields submitted: zero external requests, no sentinel in any URL, console line or analytics payload. Judged against the envoy mock, whose fields carry no `name` |
| A4 | static | **not-testable** | the widget contract's published variable set is UNKNOWN (Q-022); no mapping file exists |
| A5 | e2e | **fail** | `/deine-region` and `/deine-region/angebot` paste a second, different placeholder URL → F-2-32 |
| A6 | e2e | **pass** | all four D8 steps walked with the briefing exit visible on each; step 4 shows a copyable snippet, zero payment fields, no payment host in any request or in the CSP |
| A7 | static | **fail** | no archive row renders a preview image or an outbound link → F-2-47 |
| A8 | tool | **not-testable** | axe sweeps the light theme only and not the flows' later steps or the shadow root → F-2-58 |
| A9 | manual | **not-testable** | no screen reader available; the keyboard half was walked at entry-point level only |
| A10 | integration | **fail** | no honeypot, no timing gate, no submit handler at all → F-2-48 |
| A11 | integration | **pass** | code read + curl against :3100 |
| A12 | e2e | **fail** | S2 and S3 fire exactly once and carry no field values; S4 fires twice on soft back/forward → F-2-60 |
| A13 | manual | **fail** | the two-working-day promise ships while C11 is UNKNOWN → F-2-57 |
| A14 | e2e | **not-testable** | there is no widget script to block — the mount is a server-rendered mock, so the fallback branch is unreachable from the browser. The "no empty or permanently loading slot" half passes |

### TS-014 — Security (sweep scope)

| AC | Level | Verdict | Evidence |
| --- | --- | --- | --- |
| A1 | static | **pass** | `scripts/check-csp.ts` runs in `pnpm check` and is green — F-1-2 is discharged; hash-token shape caveat in F-2-36 |
| A2 | integration | **pass** | `e2e/smoke.spec.ts:206-245` asserts every D2 directive; green locally and against the preview. Preview `'unsafe-inline'` = F-2-27, recorded |


## Counts

| | |
| --- | --- |
| **pass** | **234** |
| **fail** | **52** |
| **not-testable** | **47** |
| **total in scope** | 333 |

Of the not-testable verdicts, the largest groups are: criteria whose
subject is a declared mock (envoy, the analytics adapter, events-api and
geo-api reads), criteria needing an instrument this run does not have (a
screen reader, the schema.org validator, a CLS harness), criteria whose
subject does not exist yet (the Portalize embed — F-2-15, personalization
stage 2 — F-2-14, interest landing pages), and the five axe criteria that
demand three themes where the sweep covers one (F-2-58).

## Security sweep (TS-014 scope)

**`semgrep`**, OSS 1.155.0, important-only (`category=security`,
confidence and impact medium-to-high), over `app/ src/ scripts/` — 443
files, 339 of them JS/TS, 11 rulesets. **6 findings, all false positives**:
five are the Apiiro malicious-code heuristics firing on dense regex
punctuation in two markdown readers (`src/lib/content/blocks.ts:27,28`,
`src/lib/content/legal-markdown.ts:39,40`) and on nested arrows in a Vitest
case (`src/lib/live/resilient.test.ts:138`); the sixth is the repo's single
`dangerouslySetInnerHTML` (`src/lib/seo/structured-data/render.ts:33`),
which is Next's prescribed JSON-LD pattern with the `<`→`<` escape and
a regression test guarding it. `p/secrets`, `p/nodejs`, Trail of Bits and
elttam each returned zero over the full scope, including the five BFF
handlers.

Two honest limits on what that scan is worth, both recorded as open points
rather than findings: Semgrep **Pro was unavailable**, so no cross-file
taint analysis ran — the paths from `app/api/*` into `src/clients/*` are
exactly what it would have covered; and **`p/nextjs` contributed zero
rules** for an unauthenticated OSS client (semgrep exit 7), so the
framework-specific checks (server-action exposure, middleware bypass,
unsafe redirect handling) never ran at all.

**`differential-review`** over the milestone diff produced the sweep's only
real result: **F-2-36** (high) — `proxy.ts:83` reaches
`scriptHashes(request.nextUrl.origin)` for any `Host` absent from
`DOMAIN_MATRIX`, and `src/lib/security/csp-hashes.ts:46-52` then fetches
that origin carrying `x-vercel-protection-bypass`; the result is cached
process-wide by a `cached ??=` keyed on nothing, and the returned strings
are interpolated into `script-src` without shape validation. The module is
new, handles a secret, performs a request-derived fetch, and has zero
tests. Reachability was **not** reproduced end to end and the report says
so. **F-2-37** records the dead `report-uri /api/csp-report` pointer, which
is a TS-014 D2 vs TS-017 D4 collision rather than a coding slip.

The chaos personas' XSS hypothesis (C-B-3, C-B-4) does **not** hold and is
dismissed below with its evidence. Their `maxlength` observation does hold
and is F-2-38.

TS-014-A1 now **passes**: `scripts/check-csp.ts` exists and runs inside
`pnpm check`, which discharges F-1-2. TS-014-A2 passes locally and against
the preview (`e2e/smoke.spec.ts` asserts every D2 directive); the preview's
`'unsafe-inline'` branch stays recorded as F-2-27 and is not re-filed.

## Triage of the chaos observations

Each observation below is either a finding or a dismissal with its reason.

| Chaos id | Disposition |
| --- | --- |
| C-B-1, C-B-2 (10 000 chars accepted) | **finding F-2-38** — no input in the tree carries `maxLength`, and two pages skip the 80-char server-side cap as well |
| C-B-3, C-B-4 (`<script>` in fields) | **dismissed, not a defect.** The differential review traced both fields to every sink: the repo's only `dangerouslySetInnerHTML` escapes `<` and is unreachable from request data; canonical/OG strip every query parameter (`src/lib/seo/canonical-params.ts:14-22`); URLs are built with `URLSearchParams`; `place-parameter.ts:22` rejects `<` and `>` outright; and the envoy form has no `action` and no named fields, so nothing is submitted. No reflection path exists. The length half of the observation is F-2-38 |
| C-B-5 (Austrian ZIP 1010 accepted) | **rolled into F-2-30** — the defect is not that a foreign ZIP is accepted but that *nothing* produces the uncovered branch |
| C-B-6 (`/en/dein-ort` 200) | **dismissed as already filed** — F-2-8, recorded not re-filed |
| C-B-7, C-B-8, C-B-9, C-B-10 (uppercase/unknown/long-slug 404, garbage query ignored) | **dismissed** — the persona itself records these as working as designed, and they were re-confirmed |
| C-B-11, C-B-13, C-B-14 (emoji, surrogate pairs, umlauts accepted) | **dismissed** — valid Unicode, correct behaviour |
| C-B-12 (RTL text, no `dir="auto"`) | **dismissed as polish** — nothing echoes the value back, so there is no display path to break; below the medium bar |
| C-B-15 (`%00` literal in an email field) | **dismissed** — the characters are literal, `type="email"` is present, and the field is never submitted (mocked widget). Length is F-2-38 |
| C-B-16, C-B-17, C-B-18 (language switch, submit button present) | **dismissed** — working as designed, re-confirmed locally and on the fresh preview |
| C-H-1 (empty submit blocked by native validation) | **dismissed** — working as specified |
| C-H-2, C-H-4, C-H-5 (agent-browser could not type or match selectors) | **dismissed as tool failure, not product defect.** Recorded as a coverage gap: the hasty-clicker persona's core behaviours (double-submit, reload mid-submit, Back/Forward hammering, two-tab interleaving) were **never executed**, so no verdict about them exists either way. Belongs on the open list as a re-run, not as a finding |
| C-H-3 (language switcher present in footer) | **dismissed** — working as designed |
| C-A-01 (`{county-or-organization}`) | **finding F-2-34** — reproduced locally and on the fresh preview |
| C-A-02, C-A-03 (German form labels and footer on the English quote page) | **finding F-2-33** |
| C-A-04, C-A-05 (form data lost across sessions; registration resumes at step 1) | **dismissed** — TS-023-A2/A3 and TS-025 D8 fix this as the intended behaviour ("the state lives entirely in the URL"; invoice details are deliberately lost), the order page says so in its own copy, and the e2e tests for both pass. The persona's own note calls it intentional |
| C-A-06 (form data lost across a language switch) | **dismissed** — same rule; the route context is correctly preserved, which is what TS-001-A7 asks for |
| C-K-1 (language switch from `/ueber-uns/archiv` lands on `/dein-kalender`) | **dismissed as stale.** Re-checked on both the dev server and the fresh preview: the switch points at `/en/about/archive`, the correct equivalent. The observation was made against the superseded preview `83x6zbys4`. TS-001-A7 **passes** |
| C-K-2 (duplicate `nav` accessible name) | **dismissed as already filed and since fixed** — F-2-3, resolved in `2eeab26` |
| C-K-3 – C-K-8 (archive filter, place search, flow entry points, skip link all keyboard-reachable) | **dismissed** — positive observations, re-confirmed; they are the evidence behind TS-002-A4's partial coverage note |

## Triage of the UAT signals

| UAT observation | Disposition |
| --- | --- |
| Every input produces a confident populated demo place; the "no events" and "not covered" branches were never reached | **finding F-2-30, critical** — confirmed and worse than reported: `/` ignores `?ort=` entirely |
| The 404 body is a developer note and has no place search | **finding F-2-31** |
| Both briefing links answer "Termin nicht gefunden" | **finding F-2-32** — and the real booking link is in the installed hub package |
| German labels and buttons in the English registration and quote flows | **finding F-2-33** |
| "Demo-Daten — … solange Q-020 offen ist" and other internal ids in copy | **finding F-2-35** |
| "Weiter" next to "Absenden" on order step 3 | **finding F-2-51**, with a correction: "Weiter" *does* navigate (verified); the confusion is the inert "Absenden" beside it |
| "1 Orte ausgewählt" | **finding F-2-53** |
| Step 4 promises the code will be emailed | **finding F-2-54** |
| The embed code carries `demo-organizer-bestellen` "without signal" | **partly dismissed** — a `Demo-Daten` badge *does* render next to the snippet, so the mock-labelling guardrail holds; what remains is the false email promise, filed as F-2-54. The `organizerId` mock itself is `state/open.md` row 129, by decision |
| "Heute gegen mit dem Produkt" reads like a dropped word; "…aus dem Landkreis geoname.900001"; "1 Orte" | the raw county id is the same class as F-2-35 and is recorded there; the dropped-word headline is an editorial item for the content workstream, below the finding bar |
| `DEMO-DATEN` on a question about the visitor's own real club made her doubt the form | **dismissed as the guardrail working.** The mock rule requires the badge; the discomfort is the honest cost of shipping a mocked flow. Worth a copy review, not a finding |
| The English handover link ends at `app.schafe-vorm-fenster.de/registrieren` (German segment) | **dismissed** — the app is a separate system outside this repo's scope (`plan/gate-2-scope.md`); recorded as a cross-system note |
| The nav label "WAS IST LOS" does not say "search for your town here" | **dismissed** — TS-004 D4 fixes the navigation labels; changing them is a concept decision, not a defect |

## Out of scope at this gate

Carried verbatim from `plan/gate-2-scope.md` §4; none was swept, each has
its owner.

| AC / area | Owner |
| --- | --- |
| TS-015-A3, A4, A5 (stage-2 CI; GitHub Packages org setting) | Jan (org owner), then M5 |
| TS-015-A7, A8, A10 (canary production deploy, rollback, auto-merge) | after the run (go-live) |
| TS-015-A9 (Lighthouse CI, bundle guard, axe as a pipeline job) | M5 |
| TS-015-A11 (`next.schafe-vorm-fenster.de` serves `next-2026`) | Jan (domains), after the run |
| TS-015-A12 (branch protection contexts, repository secrets) | after the run |
| TS-001-A4 (`.de` apex → `www` 301 against the real domain) | after the run (production domains) |
| TS-001-A9 (every D1 domain over HTTPS in its TLD default language) | after the run |
| TS-013-A4, A6, A7, A8 (deployed CSP allowlist, closed request set) | M5 preview-smoke strand |
| TS-029-A11 (production build fails without an accessibility document) | M5 / CI owner |
| TS-003 (A1–A8), TS-017 (A1–A17) (performance budgets, foundation) | closed at M1; regression at M5 |
| TS-018 (scope boundaries) | M5 |

Consequence for the tool strand: **Lighthouse was not run for TS-003's
budgets**, because TS-003 is out of scope at this gate by the scope
document's own §4. It was run for TS-002-A2, which is in scope, and passes.

## Known deviations recorded, not re-filed

Per `plan/gate-2-scope.md` §1.2 and §1.5: TS-021-A2/D10 → F-2-13;
TS-023-A6 → F-2-5 (now resolved, `2b50928`; the AC passes); TS-026 D3 →
F-2-21; TS-029-A12 → F-2-6 (instrument delivered; the remaining theme gap
is F-2-58); TS-029-A14 → F-2-19; TS-025 D9 vs TS-011 D9 → F-2-23;
TS-006-A6 on registration steps 2–3 → F-2-10; TS-005-A6 unsatisfiable as
written → open row 66, recorded not reworded; TS-007-A3/A6/A13/A16 →
F-2-18; the preview `'unsafe-inline'` branch → F-2-27; F-1-2 → **discharged**
this run.

## Findings raised

35 findings appended to `state/findings/round-2.md` as **F-2-30 … F-2-64**.
Every one carries reproduction steps, the criterion it violates in the
criterion's own words, and the chaos/UAT id it was triaged from where it
has one. No fix was made anywhere in this run.

| Finding | Sev | What | AC(s) |
| --- | --- | --- | --- |
| F-2-30 | **critical** | the uncovered-place branch never fires; any unresolved search answers with a confident demo place | TS-019-A3/A4/A5, TS-021-A6/A14, TS-008-A7 |
| F-2-31 | high | the 404 ships a developer note as copy and has neither place search nor jobs band | TS-004-A4 |
| F-2-32 | high | `request-product-briefing` is a dead link; two pages paste a second placeholder URL | TS-016-A5 |
| F-2-33 | high | the English conversion flows render German UI strings, including the primary buttons | locale/TS-007 (tail of F-2-4) |
| F-2-34 | high | `{county-or-organization}` renders literally in the English quote `h1` | TS-026 quote half |
| F-2-35 | high | internal ids (`Q-020`, `TS-007 D12`, `TS-029 Open Point #1`, `DEC-027`) in visitor copy on every route | content compliance |
| F-2-36 | high | the bypass secret is sent to a Host-controlled origin; the answer is cached process-wide and written into `script-src` unvalidated | TS-014 scope |
| F-2-39 | high | no island renders a skeleton; no `<Suspense>` exists in the tree | TS-005-A9, TS-009-A3/A9 |
| F-2-40 | high | every content artefact is `status: draft` and every one renders | TS-007-A14 |
| F-2-59 | high | the archive filter updates its count but hides no rows | TS-028-A4 |
| F-2-60 | high | `buy-calendar-licence` fires twice on soft back/forward | TS-012-A5, TS-016-A12, TS-025-A11 |
| F-2-61 | high | `/dein-ort`'s empty state switches neither CTA nor position 2, and leaks raw markdown | TS-008-A6 |
| F-2-62 | high | registration skips step 1 from `/dein-ort/starten`; the place is neither shown nor changeable | TS-023-A7 |
| F-2-37 | medium | `report-uri /api/csp-report` names a route that cannot exist (TS-014 D2 vs TS-017 D4) | TS-014 scope |
| F-2-38 | medium | two pages read `?ort=` raw; no input anywhere has a length bound | TS-014 scope |
| F-2-41 | medium | the context band is a `section` in `main`, absent on four pages | TS-011-A4 |
| F-2-42 | medium | no OG image on any page; `twitter:card` is `summary` | TS-011-A8/A9 |
| F-2-43 | medium | six declared build guards do not exist | TS-002-A3, TS-005-A15, TS-006-A8, TS-007-A4, TS-011-A7, TS-026-A8 |
| F-2-44 | medium | the type scale is declared outside the token import and goes to 11 px | TS-002-A10 |
| F-2-45 | medium | the landing-only domain rule is not implemented | TS-004-A3 |
| F-2-46 | medium | `/en/legal` renders German bodies; generation-only frontmatter validates | TS-007-A11 |
| F-2-47 | medium | archive rows carry neither a preview image nor an outbound link | TS-016-A7, TS-028-A14 |
| F-2-48 | medium | S2's quote mount is missing on `/deine-region`; no honeypot, no timing gate | TS-016-A2/A10 |
| F-2-49 | medium | `/dein-ort/starten` never re-resolves and echoes the raw parameter as the place name | TS-021-A7 |
| F-2-50 | medium | `/deine-region`'s manifest declares one live module where D1 names four | TS-026-A15 |
| F-2-51 | medium | order step 3 offers two calls to action, one of them inert | TS-006 D-level |
| F-2-52 | medium | TS-010-A5 and TS-027-A7 contradict each other on the stage-0 empty slot | both |
| F-2-55 | medium | `/start` and `/llms.txt` do not exist; the guarding tests are self-referential | TS-004-A1/A5 |
| F-2-56 | medium | no route is partially prerendered; four content routes are fully dynamic | TS-009-A2 |
| F-2-57 | medium | three claims ship without the confirmation their criteria make a precondition | TS-016-A13, TS-024-A19, TS-026-A17 |
| F-2-58 | medium | the axe sweep covers one of three declared themes | TS-002-A1, TS-029-A12, TS-016-A8, TS-023-A16, TS-025-A12 |
| F-2-63 | medium | `/deine-region` asserts a county at stage 0 and names it `geoname.900001` | TS-026-A10 |
| F-2-64 | medium | the newsletter consent line links `/en/legal#datenschutz`, an anchor that does not exist | TS-004-A8/A9 |
| F-2-53 | low | "1 Orte ausgewählt" — plural form for a count of one | — |
| F-2-54 | low | step 4 promises an email that nothing sends | — |

**1 critical · 12 high · 20 medium · 2 low.**

Three open points raised that are not defects and belong on `state/open.md`:

1. The `semgrep` sweep ran **OSS-only** (no Pro, so no cross-file taint
   analysis) and **`p/nextjs` contributed zero rules**. The Next-specific
   checks never ran; the sweep's clean result should be read with that
   bound. There is also a bug in the skill's own `run-scans.sh` (unquoted
   `--include` globs expand against the caller's CWD), which silently
   excluded all 234 `.ts` files on a first attempt and read as a clean pass.
2. The **hasty-clicker chaos run never executed its core behaviours**
   (double-submit, reload mid-submission, Back/Forward hammering, two-tab
   interleaving) — its own report records a tool failure, not a result.
   F-2-60 was found by QA, not by that persona; the rest of its target
   surface is unswept. It needs a re-run before the gate closes.
3. **No release checklist exists** for the `manual`-level criteria. Twenty
   of the 47 not-testable verdicts are manual criteria with no documented
   check to perform and no instrument in this environment (screen readers,
   the eTracker account, Search Console, a sign-off record).


## Gate recommendation

**Do not close gate 2.** `plan/process.md`'s abort criterion is "no
critical and no high findings open, or three rounds completed". This run
opened **one critical and twelve high** findings, so neither branch is
reached and a fix round is mandatory.

What the numbers say on their own is misleading and worth stating plainly:
234 of 333 criteria pass, `pnpm check`, `pnpm build` and both e2e runs are
green, axe is clean on 24 routes at two viewports, and Lighthouse
accessibility measures 100. The build is in good shape as a build. What
fails is concentrated almost entirely in the **conversion paths**, and it
fails in a way the green suites do not see.

The three things I would put in the next round before anything else:

1. **F-2-30.** This is the gate's blocking defect. A resident who types her
   own postcode into the home search is shown a village she has never heard
   of, with its dates, and told it is hers. The `uncovered` outcome is
   produced by the library and consumed by no page; `/` ignores `?ort=`
   altogether. Two of the five wired conversion goals lose their entry, and
   nothing in the suite fails, because the five e2e cases that would catch
   it are skipped with the annotation "[M4 — … not built]" while M4 is in
   scope.
2. **The conversion-path highs as a block** — F-2-31 (the 404 is a dead
   end), F-2-32 (both briefing links are dead while the real booking URL
   ships in the installed hub package), F-2-33 (English visitors meet
   German primary buttons), F-2-61, F-2-62, F-2-60. Each is cheap
   individually; together they are the difference between a walkable
   prototype and one that stops a visitor at every second turn.
3. **F-2-40 and F-2-35 before any external demo.** Every content artefact
   is `status: draft` with no gate, and internal ticket ids render as
   visitor copy on every route in both languages — including inside the
   accessibility statement, whose own text says it must not be published
   without clearance.

One methodological point for the retest, because it changes how evidence
should be read here. Three criteria were overridden to **fail despite a
green test naming them** (TS-004-A1, A4, A5): the tests assert against the
route registry or against a subset of the criterion's clauses rather than
against the criterion. `check:specs` reports coverage by id, not by clause,
so an id being "covered" is not evidence. I would treat the W3 list as a
floor, not a measure, until the retest.

F-2-36 deserves a decision rather than a queue position. It was not
reproduced end to end — Vercel's edge normally refuses an unrecognised
`Host`, and I could not start a cold second instance to prove it locally —
but three independent defences are absent on a path that carries the
Deployment Protection bypass secret, in a new module with zero tests. It is
cheap to close (an allowlist check before the fetch, a per-origin cache
key, a shape check on the returned tokens) and expensive to be wrong about.

The security sweep otherwise came back clean, and the chaos personas' XSS
hypothesis is dismissed with evidence: no reflection path exists for either
field. Their `maxlength` observation stands and is F-2-38.

