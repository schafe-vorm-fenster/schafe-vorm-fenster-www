---
artefact: tactical-spec
id: TS-WEB-0023
kind: interaction
status: DRAFT
implements: [FUN-WEB-0013]
sources: [SRC-0001, SRC-0003, SRC-0008, SRC-0011, SRC-0014]
decisions: [DEC-0009, DEC-0025, DEC-0029, DEC-0035, DEC-0037]
---

# TS-WEB-0023 — Register (`/mitmachen/registrieren`)

## Purpose

The three steps that stand between "we want our dates in the calendar"
and the app: **place · who publishes · which publishing path**, then the
handover. Confirmation, instructions and the first date happen in the
app (SRC-0003 §Register); this page's whole job is to arrive at a correct
place and hand over cleanly.

Referenced, never restated: composition TS-WEB-0006 · components SRC-0014 ·
routes TS-WEB-0004 · place search and handover TS-WEB-0008 · rendering TS-WEB-0009 ·
the envoy boundary TS-WEB-0016 · events TS-WEB-0012 · SEO TS-WEB-0011 · stages TS-WEB-0010.

## Determinations

### D1 — Page manifest [FIXED: SRC-0003 §Register, TS-WEB-0006 D1]

| Field | Value |
| --- | --- |
| `focusJob` | publish our dates |
| `primaryConversion` | `publish-first-event` (SRC-0008) — completed in the app, never fired here (D6) |
| `equalWeightConversion` | none |
| `audiences` | actors (single audience, SRC-0003) |
| `liveModules` | the place search of step 1, and nothing else |
| `proofSlots` | none — the argument was made on `/mitmachen` (TS-WEB-0022) |

Arriving here is already a decision. The page does not re-argue it.

### D2 — The three steps [FIXED: SRC-0003 §Register; step-2 vocabulary UNKNOWN]

| # | Question | Input | Value in the URL | Vocabulary |
| --- | --- | --- | --- | --- |
| 1 | which place | place search (TS-WEB-0008 D7) | geo-api community `slug` | all German communities (SRC-0011) |
| 2 | who publishes | one choice | enum id | **UNKNOWN** — no source defines the list; the app's account model owns it (Open points) |
| 3 | which publishing path | one choice | enum id | exactly three: WhatsApp · connected calendar · own website as source (SRC-0003 `/mitmachen`) |

No step takes a name, address, e-mail or phone number: every
identity-bearing field belongs to the account, and the account is the
app's (D6, D9).

### D3 — A village district counts, not the Gemeinde [FIXED: SRC-0003 §Register, SRC-0011]

| Rule | Detail |
| --- | --- |
| Registered unit | the geo-api **community** (the village / Ortsteil level) — never a municipality, county or state id |
| Disambiguation | a result names the community and carries its municipality only as context; the value taken is the community `slug` |
| Municipality hit | a search that resolves to a municipality with several communities does not advance: the step asks which of them, and registration cannot complete on the municipality |
| Unresolvable input | "not covered" means geo-api returns no community for the input, not that a place is unserved; the step stays unanswered (D5) |
| Echo | the place name comes from the geo-api response, never from raw input (TS-WEB-0008 D4) |

### D4 — Step state without any store [FIXED: DEC-0009 boundary, DEC-0037, NFR-WEB-0020; parameter names PROPOSED]

The website has no session, cookie or client store, so the state travels
in the URL — and only values that may be public go in.

| Rule | Determination |
| --- | --- |
| Where state lives | the query string of the same route: `?ort=<slug>&wer=<enum>&weg=<enum>` [PROPOSED names, consistent with `?ort=` per FUN-WEB-0023] |
| Where it never lives | cookie, `localStorage`, `sessionStorage`, IndexedDB, server session, BFF write route — the BFF stays read-only (TS-WEB-0004 D5) |
| How a step advances | a plain GET navigation to the same route with one more parameter; Back, Forward and reload are the browser's, not ours |
| Which step is shown | **derived** from which answers are present; an explicit `schritt` parameter may only move *backwards* to an already-answered step, never forwards past an unanswered one |
| Reload | every parameter is re-validated server-side on every request (slug via geo-api `community/slug/{slug}`, enums against the registry); an invalid value is dropped and its step re-asked — never an error page |
| Shared link | a third party opening it sees the same three public answers: a place and two choices. That is acceptable **only because** no personal value may enter the URL — which is what D2 fixes |
| Campaign parameters | `etcc_*` present on entry survive every step and the outbound link; the page never sets them itself (TS-WEB-0012 D6) |
| Indexing | every step URL canonicalises to the parameter-free path; the page is indexable, the step URLs are not separate pages (TS-WEB-0011) |

### D5 — Prefilled arrival [FIXED: TS-WEB-0008 D9, DEC-0037]

| Parameter | Arrives from | Validation | On failure |
| --- | --- | --- | --- |
| `ort` | `/dein-ort/starten` (TS-WEB-0021), `/mitmachen` (TS-WEB-0022), the `/dein-ort` empty state (TS-WEB-0008 D4), the 404 place search | geo-api slug lookup | step 1 unanswered; raw value at most escaped inside the search field |
| `weg` | `/mitmachen`'s three publishing paths (TS-WEB-0022) | enum registry | parameter dropped, step 3 asked |
| `wer` | no surface offers it today | enum registry, once it exists | parameter dropped |
| `etcc_*` | external campaign entries | none — passed through untouched | — |
| anything else | — | ignored | never parsed, never rendered |

A prefilled step renders **answered, visible and changeable**, never
skipped: the visitor sees which place she is registering before handover.

### D6 — The handover, and where the website stops [FIXED: SRC-0003, DEC-0029, DEC-0035; target URL UNKNOWN]

| Aspect | Determination |
| --- | --- |
| Trigger | all three steps answered; the page offers exactly one action |
| Target | the app's registration entry, built from one configured value (`APP_HOST` per TS-WEB-0008 D9 plus a registration path). The path is **UNKNOWN** — no contract exists (DEC-0029) |
| Prefill across the boundary | none. DEC-0029: place and publishing path have no prefill contract; nothing is appended to the app URL until the app defines it |
| Honesty rule | because nothing crosses, the page may not claim anything has. No copy may suggest the place is already registered or the account already prepared |
| Link kind | an external link, not a route-facade link (TS-WEB-0008 D9); no slug is ever appended that geo-api did not confirm |
| After the click | nothing. No confirmation, no "check your mail", no instructions, no first-date form, no account state — all of it is the app's (SRC-0003) |
| Measurement | one `register-as-publisher` event, stage `handover`, once per click (TS-WEB-0012 D4). `publish-first-event` is emitted by the app as `completed`; the website never fires it, although it is this page's `primaryConversion` |

### D7 — A flow, not an argument: how TS-WEB-0006 applies here [PROPOSED — TS-WEB-0006 does not settle it]

| TS-WEB-0006 rule | On this page |
| --- | --- |
| D2 block 1, focus block | replaced by the current step; no argument block of its own |
| D2 block 2, argument blocks | **zero**. No scenes, no proof stream, no live module besides the step-1 search |
| D3, one primary CTA | the step's continue button, and on the last state the handover — exactly one `data-cta="primary"` per rendered state, above the fold at both reference viewports |
| D5, context band | rendered **only on step 1**; suppressed on steps 2, 3 and the handover state — a mid-flow exit offer costs the conversion the page exists for |
| D6, closing CTA | the handover *is* the closing CTA; on steps 1 and 2 the conversion is not yet reachable, so no closing block is rendered |

Both suppressions are proposals against a rule TS-WEB-0006 states for every
page, and need a decision point (Open points).

### D8 — Controls and flow accessibility [FIXED: SRC-0014, TS-WEB-0002; step indicator PROPOSED]

| Element | Determination |
| --- | --- |
| Step 1 field | the search-field component: one 56 px pill, `map-pin`, nested 44 px submit (SRC-0014) |
| Step 1 results | tappable chips, ≥ 40 px (SRC-0014) |
| Steps 2 and 3 | a single-choice control; **no component is specified** for it — Q-0044 |
| Continue / handover | primary button, 56 px, with `arrow-right` (SRC-0014) |
| Step indicator | a badge kicker naming the current step and the total, with reserved height so it cannot shift the layout (SRC-0014). Its wording is copy under SRC-0017 CG-023 — this spec states no string (DEC-0083) [PROPOSED] |
| Focus | after each advance, focus moves to the new step's heading; the flow is keyboard-completable |
| No-JS | each step is a `<form method="get">`; typeahead is enhancement only (TS-WEB-0008 D7) |
| Not self-classification | step 2 asks who *publishes* — data the account needs, not a visitor classification. It must not change what any page shows (SRC-0001 §6, TS-WEB-0006 D8) |

### D9 — No form backend, and no envoy widget on this page [FIXED: DEC-0009, DEC-0025, TS-WEB-0016 D1 S7]

Nothing is submitted, so there is no envoy instance here, no POST route,
no server action, and the spam rules of DEC-0014 have no subject. The
only network calls are the read-only BFF routes of TS-WEB-0004 D5.

## Free for the generator

- [FREE] Visual layout of a step and of the step indicator, within D8.
- [FREE] Whether the three steps are one component switching on the
  parsed query or three rendered branches — as long as every advance is
  a real navigation with a shareable URL (D4).
- [FREE] Typeahead mechanics in step 1 above the no-JS floor.
- [FREE] All copy: step questions, option labels, the handover button,
  and what the page says about what the app will ask next (FUN-WEB-0087).

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-WEB-0023-A1 | e2e | `/mitmachen/registrieren` with no parameters shows step 1 with the place search as the first interactive element, no proof block and no other live module, and exactly one `data-cta="primary"`. |
| TS-WEB-0023-A2 | e2e | Answering step 1 with a typed place name that matches puts `ort=<slug>` in the URL and shows step 2; reload keeps step 2 with the place answered and named; browser Back returns to step 1 with the place still answered. |
| TS-WEB-0023-A3 | e2e | The URL after step 2, opened in a fresh private window, shows the same step with the same answers; the devtools Application panel shows no cookie and no `localStorage`/`sessionStorage`/IndexedDB entry set by the page. |
| TS-WEB-0023-A4 | unit | Step derivation: the shown step follows from the answers present; `schritt` pointing forward past an unanswered step is ignored, pointing back to an answered step is honoured; an invalid enum or slug is dropped and its step re-asked. |
| TS-WEB-0023-A5 | integration | `?ort=` with an unknown slug renders step 1 unanswered, no error page, no outbound app link, and the raw value appears nowhere except escaped inside the search field. |
| TS-WEB-0023-A6 | e2e | A search resolving to a municipality with several communities does not advance until one community is chosen; the resulting `ort` value is that community's slug. |
| TS-WEB-0023-A7 | e2e | Following the CTA on `/dein-ort/starten?ort=X` lands on this page with step 1 answered as X, the place visible and changeable, and step 1 not skipped. |
| TS-WEB-0023-A8 | e2e | Step 3 offers exactly three publishing paths — WhatsApp, connected calendar, own website as source — and no further option. |
| TS-WEB-0023-A9 | e2e | With all three steps answered the page offers exactly one action: an external link to the configured app registration URL, with entry `etcc_*` preserved and no unconfirmed slug appended. |
| TS-WEB-0023-A10 | e2e | The handover click fires exactly one `register-as-publisher` event with `stage=handover`; no `publish-first-event` event is fired anywhere on the website. |
| TS-WEB-0023-A11 | e2e | No step and no post-handover state of this page contains a confirmation message, instructions, help content, or a field for an event — walkable by clicking through all three steps. |
| TS-WEB-0023-A12 | static | The route ships no envoy element, no POST route and no server action; every request it makes is a TS-WEB-0004 D5 read route. |
| TS-WEB-0023-A13 | e2e | With JavaScript disabled all three steps can be completed by form submission and the handover link is reachable. |
| TS-WEB-0023-A14 | e2e | Every step URL carries a canonical pointing at the parameter-free `/mitmachen/registrieren`, and the page is indexable. |
| TS-WEB-0023-A15 | e2e | The context band renders on step 1 and is absent on steps 2, 3 and the handover state (records D7 for review). |
| TS-WEB-0023-A16 | tool | axe-core: zero violations on all three steps in all three themes; after each advance focus sits on the new step's heading. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| FUN-WEB-0013 (`/mitmachen/registrieren`: publish our dates, handover to the app) | D1–D9 · A1–A16 |

Consumed, discharged elsewhere: FUN-WEB-0023 / FUN-WEB-0046 / FUN-WEB-0049
(TS-WEB-0008) · NFR-WEB-0020 (TS-WEB-0012 D1) · NFR-WEB-0028 (TS-WEB-0012 D4/D5) ·
FUN-WEB-0090 / FUN-WEB-0092 (TS-WEB-0016) · FUN-WEB-0087 (TS-WEB-0007).

## Open points

- **Demand to the app team, not yet a numbered question:** the
  registration entry URL on `app.*`, plus a prefill contract for place,
  publisher kind and publishing path (DEC-0029). Without the URL the
  handover cannot ship; without the prefill the visitor answers all three
  questions again. Needs an entry in `questions/open-questions.md`.
- **Step 2's vocabulary is UNKNOWN.** No source names who-publishes
  values; the app's account model owns them. D2 fixes the step's shape
  only; step 2 cannot be built before the list exists — app team.
- **TS-WEB-0006 does not settle a flow.** D7 suppresses the context band on
  steps 2–3 and the closing block before the last step, against a rule
  TS-WEB-0006 states for every page. Decision point: jan-henrik.
- **TS-WEB-0008 D1 omits this route** from its place-search surface list
  although step 1 is one. The row belongs there, not here — TS-WEB-0008.
- **Step 1 is the page that needed name search most, and has it.** The
  visitor here types the name of her own village (TS-WEB-0008 D7), and the
  overlay of D7a disambiguates it by municipality — which is what
  A6's several-communities case is about. The scope of that matching was
  Q-0071 and is now settled — the covered communities, with Germany-wide
  finding as the target carried by Q-0025 (DEC-0079 amendment 2026-09-24).
  An unmatched name on this page leads to the founding route like
  everywhere else.
- **Q-0044 leaves steps 2 and 3 without a component.** SRC-0014 specifies
  no single-choice control. Addressee: design.
- **Parameter names are [PROPOSED].** `ort` is fixed (FUN-WEB-0023); `wer`,
  `weg` and the back-only `schritt` rule are new, and `/take-part/register`
  (TS-WEB-0004 D3a) raises whether parameter names localize. Addressee: TS-WEB-0004.
- **Q-0040 leaves the other half of the funnel unproven.** If the app does
  not emit `completed` under the hub goal ids, this page's
  `primaryConversion` has no counterpart anywhere. Addressee: app team.
