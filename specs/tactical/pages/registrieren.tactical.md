---
artefact: tactical-spec
id: TS-023
profile: interaction
status: DRAFT
implements: [WEB-F-013]
sources: [SRC-001, SRC-003, SRC-008, SRC-011, SRC-014]
decisions: [DEC-009, DEC-025, DEC-029, DEC-035, DEC-037]
---

# TS-023 — Register (`/mitmachen/registrieren`)

## Purpose

The three steps that stand between "we want our dates in the calendar"
and the app: **place · who publishes · which publishing path**, then the
handover. Confirmation, instructions and the first date happen in the
app (SRC-003 §Register); this page's whole job is to arrive at a correct
place and hand over cleanly.

Referenced, never restated: composition TS-006 · components SRC-014 ·
routes TS-004 · place search and handover TS-008 · rendering TS-009 ·
the envoy boundary TS-016 · events TS-012 · SEO TS-011 · stages TS-010.

## Determinations

### D1 — Page manifest [FIXED: SRC-003 §Register, TS-006 D1]

| Field | Value |
| --- | --- |
| `focusJob` | publish our dates |
| `primaryConversion` | `publish-first-event` (SRC-008) — completed in the app, never fired here (D6) |
| `equalWeightConversion` | none |
| `audiences` | actors (single audience, SRC-003) |
| `liveModules` | the place search of step 1, and nothing else |
| `proofSlots` | none — the argument was made on `/mitmachen` (TS-022) |

Arriving here is already a decision. The page does not re-argue it.

### D2 — The three steps [FIXED: SRC-003 §Register; step-2 vocabulary UNKNOWN]

| # | Question | Input | Value in the URL | Vocabulary |
| --- | --- | --- | --- | --- |
| 1 | which place | place search (TS-008 D7) | geo-api community `slug` | all German communities (SRC-011) |
| 2 | who publishes | one choice | enum id | **UNKNOWN** — no source defines the list; the app's account model owns it (Open points) |
| 3 | which publishing path | one choice | enum id | exactly three: WhatsApp · connected calendar · own website as source (SRC-003 `/mitmachen`) |

No step takes a name, address, e-mail or phone number: every
identity-bearing field belongs to the account, and the account is the
app's (D6, D9).

### D3 — A village district counts, not the Gemeinde [FIXED: SRC-003 §Register, SRC-011]

| Rule | Detail |
| --- | --- |
| Registered unit | the geo-api **community** (the village / Ortsteil level) — never a municipality, county or state id |
| Disambiguation | a result names the community and carries its municipality only as context; the value taken is the community `slug` |
| Municipality hit | a search that resolves to a municipality with several communities does not advance: the step asks which of them, and registration cannot complete on the municipality |
| Unresolvable input | "not covered" means geo-api returns no community for the input, not that a place is unserved; the step stays unanswered (D5) |
| Echo | the place name comes from the geo-api response, never from raw input (TS-008 D4) |

### D4 — Step state without any store [FIXED: DEC-009 boundary, DEC-037, WEB-Q-020; parameter names PROPOSED]

The website has no session, cookie or client store, so the state travels
in the URL — and only values that may be public go in.

| Rule | Determination |
| --- | --- |
| Where state lives | the query string of the same route: `?ort=<slug>&wer=<enum>&weg=<enum>` [PROPOSED names, consistent with `?ort=` per WEB-F-023] |
| Where it never lives | cookie, `localStorage`, `sessionStorage`, IndexedDB, server session, BFF write route — the BFF stays read-only (TS-004 D5) |
| How a step advances | a plain GET navigation to the same route with one more parameter; Back, Forward and reload are the browser's, not ours |
| Which step is shown | **derived** from which answers are present; an explicit `schritt` parameter may only move *backwards* to an already-answered step, never forwards past an unanswered one |
| Reload | every parameter is re-validated server-side on every request (slug via geo-api `community/slug/{slug}`, enums against the registry); an invalid value is dropped and its step re-asked — never an error page |
| Shared link | a third party opening it sees the same three public answers: a place and two choices. That is acceptable **only because** no personal value may enter the URL — which is what D2 fixes |
| Campaign parameters | `etcc_*` present on entry survive every step and the outbound link; the page never sets them itself (TS-012 D6) |
| Indexing | every step URL canonicalises to the parameter-free path; the page is indexable, the step URLs are not separate pages (TS-011) |

### D5 — Prefilled arrival [FIXED: TS-008 D9, DEC-037]

| Parameter | Arrives from | Validation | On failure |
| --- | --- | --- | --- |
| `ort` | `/dein-ort/starten` (TS-021), `/mitmachen` (TS-022), the `/dein-ort` empty state (TS-008 D4), the 404 place search | geo-api slug lookup | step 1 unanswered; raw value at most escaped inside the search field |
| `weg` | `/mitmachen`'s three publishing paths (TS-022) | enum registry | parameter dropped, step 3 asked |
| `wer` | no surface offers it today | enum registry, once it exists | parameter dropped |
| `etcc_*` | external campaign entries | none — passed through untouched | — |
| anything else | — | ignored | never parsed, never rendered |

A prefilled step renders **answered, visible and changeable**, never
skipped: the visitor sees which place she is registering before handover.

### D6 — The handover, and where the website stops [FIXED: SRC-003, DEC-029, DEC-035; target URL UNKNOWN]

| Aspect | Determination |
| --- | --- |
| Trigger | all three steps answered; the page offers exactly one action |
| Target | the app's registration entry, built from one configured value (`APP_HOST` per TS-008 D9 plus a registration path). The path is **UNKNOWN** — no contract exists (DEC-029) |
| Prefill across the boundary | none. DEC-029: place and publishing path have no prefill contract; nothing is appended to the app URL until the app defines it |
| Honesty rule | because nothing crosses, the page may not claim anything has. No copy may suggest the place is already registered or the account already prepared |
| Link kind | an external link, not a route-facade link (TS-008 D9); no slug is ever appended that geo-api did not confirm |
| After the click | nothing. No confirmation, no "check your mail", no instructions, no first-date form, no account state — all of it is the app's (SRC-003) |
| Measurement | one `register-as-publisher` event, stage `handover`, once per click (TS-012 D4). `publish-first-event` is emitted by the app as `completed`; the website never fires it, although it is this page's `primaryConversion` |

### D7 — A flow, not an argument: how TS-006 applies here [PROPOSED — TS-006 does not settle it]

| TS-006 rule | On this page |
| --- | --- |
| D2 block 1, focus block | replaced by the current step; no argument block of its own |
| D2 block 2, argument blocks | **zero**. No scenes, no proof stream, no live module besides the step-1 search |
| D3, one primary CTA | the step's continue button, and on the last state the handover — exactly one `data-cta="primary"` per rendered state, above the fold at both reference viewports |
| D5, context band | rendered **only on step 1**; suppressed on steps 2, 3 and the handover state — a mid-flow exit offer costs the conversion the page exists for |
| D6, closing CTA | the handover *is* the closing CTA; on steps 1 and 2 the conversion is not yet reachable, so no closing block is rendered |

Both suppressions are proposals against a rule TS-006 states for every
page, and need a decision point (Open points).

### D8 — Controls and flow accessibility [FIXED: SRC-014, TS-002; step indicator PROPOSED]

| Element | Determination |
| --- | --- |
| Step 1 field | the search-field component: one 56 px pill, `map-pin`, nested 44 px submit (SRC-014) |
| Step 1 results | tappable chips, ≥ 40 px (SRC-014) |
| Steps 2 and 3 | a single-choice control; **no component is specified** for it — Q-044 |
| Continue / handover | primary button, 56 px, with `arrow-right` (SRC-014) |
| Step indicator | a badge kicker ("Schritt 2 von 3"), reserved height so it cannot shift the layout (SRC-014) [PROPOSED] |
| Focus | after each advance, focus moves to the new step's heading; the flow is keyboard-completable |
| No-JS | each step is a `<form method="get">`; typeahead is enhancement only (TS-008 D7) |
| Not self-classification | step 2 asks who *publishes* — data the account needs, not a visitor classification. It must not change what any page shows (SRC-001 §6, TS-006 D8) |

### D9 — No form backend, and no envoy widget on this page [FIXED: DEC-009, DEC-025, TS-016 D1 S7]

Nothing is submitted, so there is no envoy instance here, no POST route,
no server action, and the spam rules of DEC-014 have no subject. The
only network calls are the read-only BFF routes of TS-004 D5.

## Free for the generator

- [FREE] Visual layout of a step and of the step indicator, within D8.
- [FREE] Whether the three steps are one component switching on the
  parsed query or three rendered branches — as long as every advance is
  a real navigation with a shareable URL (D4).
- [FREE] Typeahead mechanics in step 1 above the no-JS floor.
- [FREE] All copy: step questions, option labels, the handover button,
  and what the page says about what the app will ask next (WEB-F-087).

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-023-A1 | e2e | `/mitmachen/registrieren` with no parameters shows step 1 with the place search as the first interactive element, no proof block and no other live module, and exactly one `data-cta="primary"`. |
| TS-023-A2 | e2e | Answering step 1 with a resolving ZIP puts `ort=<slug>` in the URL and shows step 2; reload keeps step 2 with the place answered and named; browser Back returns to step 1 with the place still answered. |
| TS-023-A3 | e2e | The URL after step 2, opened in a fresh private window, shows the same step with the same answers; the devtools Application panel shows no cookie and no `localStorage`/`sessionStorage`/IndexedDB entry set by the page. |
| TS-023-A4 | unit | Step derivation: the shown step follows from the answers present; `schritt` pointing forward past an unanswered step is ignored, pointing back to an answered step is honoured; an invalid enum or slug is dropped and its step re-asked. |
| TS-023-A5 | integration | `?ort=` with an unknown slug renders step 1 unanswered, no error page, no outbound app link, and the raw value appears nowhere except escaped inside the search field. |
| TS-023-A6 | e2e | A search resolving to a municipality with several communities does not advance until one community is chosen; the resulting `ort` value is that community's slug. |
| TS-023-A7 | e2e | Following the CTA on `/dein-ort/starten?ort=X` lands on this page with step 1 answered as X, the place visible and changeable, and step 1 not skipped. |
| TS-023-A8 | e2e | Step 3 offers exactly three publishing paths — WhatsApp, connected calendar, own website as source — and no further option. |
| TS-023-A9 | e2e | With all three steps answered the page offers exactly one action: an external link to the configured app registration URL, with entry `etcc_*` preserved and no unconfirmed slug appended. |
| TS-023-A10 | e2e | The handover click fires exactly one `register-as-publisher` event with `stage=handover`; no `publish-first-event` event is fired anywhere on the website. |
| TS-023-A11 | e2e | No step and no post-handover state of this page contains a confirmation message, instructions, help content, or a field for an event — walkable by clicking through all three steps. |
| TS-023-A12 | static | The route ships no envoy element, no POST route and no server action; every request it makes is a TS-004 D5 read route. |
| TS-023-A13 | e2e | With JavaScript disabled all three steps can be completed by form submission and the handover link is reachable. |
| TS-023-A14 | e2e | Every step URL carries a canonical pointing at the parameter-free `/mitmachen/registrieren`, and the page is indexable. |
| TS-023-A15 | e2e | The context band renders on step 1 and is absent on steps 2, 3 and the handover state (records D7 for review). |
| TS-023-A16 | tool | axe-core: zero violations on all three steps in all three themes; after each advance focus sits on the new step's heading. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| WEB-F-013 (`/mitmachen/registrieren`: publish our dates, handover to the app) | D1–D9 · A1–A16 |

Consumed, discharged elsewhere: WEB-F-023 / WEB-F-046 / WEB-F-049
(TS-008) · WEB-Q-020 (TS-012 D1) · WEB-Q-028 (TS-012 D4/D5) ·
WEB-F-090 / WEB-F-092 (TS-016) · WEB-F-087 (TS-007).

## Open points

- **Demand to the app team, not yet a numbered question:** the
  registration entry URL on `app.*`, plus a prefill contract for place,
  publisher kind and publishing path (DEC-029). Without the URL the
  handover cannot ship; without the prefill the visitor answers all three
  questions again. Needs an entry in `questions/open-questions.md`.
- **Step 2's vocabulary is UNKNOWN.** No source names who-publishes
  values; the app's account model owns them. D2 fixes the step's shape
  only; step 2 cannot be built before the list exists — app team.
- **TS-006 does not settle a flow.** D7 suppresses the context band on
  steps 2–3 and the closing block before the last step, against a rule
  TS-006 states for every page. Decision point: jan-henrik.
- **TS-008 D1 omits this route** from its place-search surface list
  although step 1 is one. The row belongs there, not here — TS-008.
- **Q-025 bites hardest here.** Until geo-api has name search, step 1
  accepts ZIP only — on the one page whose visitor is most likely to type
  a village name. Addressee: geo-api.
- **Q-044 leaves steps 2 and 3 without a component.** SRC-014 specifies
  no single-choice control. Addressee: design.
- **Parameter names are [PROPOSED].** `ort` is fixed (WEB-F-023); `wer`,
  `weg` and the back-only `schritt` rule are new, and `/take-part/register`
  (TS-004 D3a) raises whether parameter names localize. Addressee: TS-004.
- **Q-040 leaves the other half of the funnel unproven.** If the app does
  not emit `completed` under the hub goal ids, this page's
  `primaryConversion` has no counterpart anywhere. Addressee: app team.
