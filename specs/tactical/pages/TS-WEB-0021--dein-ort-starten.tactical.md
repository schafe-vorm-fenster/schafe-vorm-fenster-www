---
artefact: tactical-spec
id: TS-WEB-0021
kind: interaction
status: DRAFT
version: 0.1.0
implements: [FUN-WEB-0047]
sources: [SRC-0001, SRC-0002, SRC-0003, SRC-0014]
decisions: [DEC-0013, DEC-0024, DEC-0029, DEC-0034, DEC-0036, DEC-0037, DEC-0066, DEC-0071, DEC-0083]
---

# TS-WEB-0021 — `/dein-ort/starten`: Start the Calendar in Your Place

## Purpose

The page a visitor reaches when the place search finds **no place at
all** — the last state of the place-search axis (dates → no dates → no
place). It turns that dead end into the founding offer.

Composition TS-WEB-0006 · components, rhythm, ratios, skeletons SRC-0014 ·
routes and BFF TS-WEB-0004 · proof TS-WEB-0005 · live data and place search
TS-WEB-0008 · rendering TS-WEB-0009 · stages TS-WEB-0010 · SEO TS-WEB-0011 · events TS-WEB-0012 ·
content types TS-WEB-0007 — none of it restated. Determined here: the state
boundary (D3), the parameter contract (D4/D5), the no-fake-coverage rule
(D6/D7), the handover (D8).

## Determinations

### D1 — Page manifest [FIXED: SRC-0003 §Start the calendar in my place, via TS-WEB-0006 D1]

`app/[lang]/dein-ort/starten/page.meta.ts`:

| Field | Value |
| --- | --- |
| `focusJob` | publish our dates |
| `primaryConversion` | `register-as-publisher` |
| `equalWeightConversion` | — none |
| `audiences` | `actors` · `municipalities` · `rural-residents` (in this order) |
| `liveModules` | place search (TS-WEB-0008 D7) · nearest active place (TS-WEB-0008 D1 position 3) |
| `proofSlots` | none — SRC-0003 gives this page no proof block; the live example is its credibility carrier |

The focus job is **static**: this page is not the runtime focus-job
change of TS-WEB-0008 D4 — that belongs to `/dein-ort` (TS-WEB-0006 D8).

### D2 — Argument blocks, in order [FIXED: SRC-0003 structure]

Blocks 1, 3 and 4 are TS-WEB-0006 D2; block 1 carries the acknowledgment with
the place's name and the page's only primary treatment. Block 2:

| # | Block | Mechanism (TS-WEB-0006 D7) | Notes |
| --- | --- | --- | --- |
| 2.1 | What it takes: one person, one flyer via WhatsApp, free, permanent | WhatsApp | the permanence promise is content backed by the 2022 commitment (TS-WEB-0006 D10) |
| 2.2 | Live example — the nearest **active** place (D7) | — live module | headed as an example, never as "your place" |
| 2.3 | Who usually starts it: Verein, Feuerwehr, Kirche, Gemeinde | — the scene | a scene, not a feature list, not a role switcher (TS-WEB-0006 D8) |
| 2.4 | Place search, so a visitor who mistyped can search again | — live module | same component, same behaviour as everywhere (TS-WEB-0008 D7) |

### D3 — The boundary: what makes a visitor land here [FIXED: TS-WEB-0008 D7, DEC-0024, DEC-0079]

The classification is made **once, by the BFF, at search time**, and is
not re-derived by any page from the result of a second lookup. The
visitor got here by typing a **name** (TS-WEB-0008 D7) — a name the place
lookup matched to nothing.

| Place lookup (TS-WEB-0008 D7) | events in window | Destination |
| --- | --- | --- |
| ≥ 1 match, dates exist | yes | `/dein-ort?ort=<slug>` |
| ≥ 1 match, no dates | no | `/dein-ort?ort=<slug>`, empty state (TS-WEB-0008 D4) |
| **no match for the typed name** | not asked | **`/dein-ort/starten?ort=<raw query>`** |
| upstream error | — | not a classification: TS-WEB-0008 D5 applies, the visitor stays where she is |

Binding: the two "nothing here" surfaces share no copy string — one is a
place with no *dates*, this one a place with no *entry* (A6); "no match"
is a positive answer from the lookup, so a failure never produces a
founding page; entry without a parameter is legitimate (D4), not an
error. A name that matched nothing is never treated as a mistyping to be
corrected with another kind of input — the page is the answer, not a
retry prompt (FUN-WEB-0047, DEC-0079 §4).

### D4 — The place is a query parameter, and the URL is the whole payload [FIXED: DEC-0037, FUN-WEB-0023; validation PROPOSED]

| Rule | Determination |
| --- | --- |
| Name | `ort`, exactly one value; a repeated parameter takes the first and ignores the rest |
| Content | the **raw search query** for an uncovered place; a geo-api `slug` only in the transitional case of D5 |
| Validation | ≤ 80 characters, Unicode letters, digits, space, `-`, `.`, `'`; anything else → the parameter is dropped and the placeless variant renders (never an error page) [PROPOSED] |
| Echo | rendered as **text only**, escaped, clamped to two display lines (SRC-0014 §Reserved text space). Never interpolated into an `href`, an attribute, `title`, `og:*`, JSON-LD, or a slug |
| Never | a path segment, a subdomain, an app URL component, or an input to TS-WEB-0008 D9 slug building |
| Shareability | the page is a pure function of URL + language — no dependence on referrer, session, cookie, storage or a prior search, so a WhatsApp recipient who never searched sees the identical page (A2) |
| Absent or invalid | the placeless variant: the same blocks, the same CTA, the acknowledgment phrased without a place name, registration without prefill (A3) |

### D5 — Re-resolution, for the link that arrives late [FIXED: DEC-0070]

The link is shared and may be opened weeks later, when the place may be
covered. The route resolves `?ort=` once per request (TS-WEB-0008 D7): still
unresolvable → render this page; **resolves → one 302 to
`/dein-ort?ort=<slug>`**, which decides dates vs empty state (TS-WEB-0008 D4);
upstream error → render this page, never redirect on a failed lookup.
`etcc_*` and the language prefix survive the hop (TS-WEB-0012 D6), and
`/dein-ort` never redirects back, so no loop is constructible (A7).

### D6 — The page never fakes coverage [FIXED: SRC-0003 empty-state rule, FUN-WEB-0024, TS-WEB-0005 D5]

| The searched place MAY appear in | The searched place MUST NOT appear in |
| --- | --- |
| the `h1` and body copy | any live-module heading or row |
| the primary and closing CTA label | any counter, figure or proof element |
| the `?ort=` value on the registration link (D8) | any `app.*` link, `title`, `description`, `og:*`, canonical, JSON-LD |

Metadata is parameter-free by construction (TS-WEB-0011 D5), so the searched
place cannot leak into the indexed surface. Every place name rendered as
**data** comes from a covered place with a date — walked by A4.

### D7 — The live example and its anchor [FIXED: TS-WEB-0008 D1 position 3, DEC-0034; anchor precedence PROPOSED]

| Anchor available | Module heading claim | Selection |
| --- | --- | --- |
| stage-1 geo, county known (TS-WEB-0010 D4) | "so sieht es in \<place\> aus", county named | TS-WEB-0008 position 3, ranked by activity (DEC-0034) |
| stage-1 geo, only state known | example, state named, no proximity claim | same, widened to state |
| stage 0 — no anchor | example, no geographic claim at all | build-time reference place (TS-WEB-0009 D8) |

The searched place is **not** an anchor — it resolved to nothing, so it
has no coordinates (Open points: demand to geo-api). A widened or
anchorless module never claims proximity (TS-WEB-0008 D1).

### D8 — What travels to registration [FIXED: TS-WEB-0008 D9 registration-prefill row, DEC-0029, TS-WEB-0012 D4]

| Aspect | Determination |
| --- | --- |
| Target | `/mitmachen/registrieren?ort=<value>` — our own route, through the route facade (TS-WEB-0004 D3) |
| Payload | the `?ort=` value **verbatim**, URL-encoded. Nothing else: no audience flag, no job hint, no session, no free text |
| Shape | a plain `<a href>` carrying `data-cta="primary"`; it works with JavaScript disabled |
| App boundary | nothing is appended to an `app.*` URL — no prefill contract exists (DEC-0029). No `app.*` href appears on this page at all |
| Campaign | `etcc_*` present on the inbound URL is carried through (TS-WEB-0012 D6) |
| Analytics | **no event fires here**: `register-as-publisher` is emitted as `handover` on `/mitmachen/registrieren` (TS-WEB-0012 D4), and this page adds none of its own (TS-WEB-0012 D7) |
| Out of scope | what `/mitmachen/registrieren` does with the value — TS-WEB-0023 |

### D9 — Tone for the third audience [FIXED: DEC-0071 as amended 2026-09-24]

The resident who searched and found nothing is on a publishing page she
did not ask for. **She is addressed directly, like every reader on every
page** — the site has one form of address and no page opts out of it
(DEC-0066, SRC-0017 CG-008/CG-012, DEC-0071 amendment 2026-09-24). What this
page does not do is make the gap her job: it names who usually starts a
calendar (block 2.3) and lets her recognise someone. No blame, no
scarcity — the missing place is our gap, not her omission. The forwarding
affordance is the URL itself: no share buttons, no share SDK (DEC-0013,
TS-WEB-0013).

**How this still differs from `/dein-ort` state B.** The difference is
what the page *asks for*, not how it addresses the reader:

| | `/dein-ort` state B | `/dein-ort/starten` (this page) |
| --- | --- | --- |
| Situation | the place **is** covered; nothing is entered this moment | the place is **not** covered at all |
| What is missing | dates | the place itself, in our system |
| Whose gap | the calendar exists and is empty — filling it is a small, obvious step | ours: we have not reached this place |
| Address | direct | direct |
| What is asked of the reader | to be the first to publish — the strongest publisher-acquisition moment the site has (SRC-0002) | nothing. The page names who usually starts a calendar and offers the step to whoever recognises herself in it |

Asking a resident who searched for the weekend to publish makes sense
where a calendar is waiting for her. Where there is no calendar at all,
the same request hands a stranger our distribution problem, and spends the
goodwill of someone who only wanted to know what is on. The earlier
"never direct" was the wrong instrument for that distinction: it changed
the voice where only the ask should change.

### D10 — Rendering and indexing [FIXED: TS-WEB-0009 D1/D8, TS-WEB-0010 D8, TS-WEB-0011 D4/D9]

Static shell; `?ort=` resolves outside the cache boundary (TS-WEB-0009 D2) and
the route never becomes a per-request function (TS-WEB-0010 D8). The placeless
variant **is** the prerendered page, complete on its own — that is what
crawlers get. The live example reserves its geometry, does not animate,
and a skeleton older than 2 s resolves to the example-less state (SRC-0014
§Skeletons). Canonical: the parameter-free path. JSON-LD: `WebPage` +
`BreadcrumbList` — no `Event`, no place entity, no `Offer` (TS-WEB-0011 D4).

## Free for the generator

- [FREE] All copy — nothing quoted here is copy (repo rule 4) — and the
  visual design of every block within SRC-0014 and TS-WEB-0002.
- [FREE] Whether the live example renders as event rows or place chips,
  provided SRC-0014's contracts and fixed heights hold.
- [FREE] Whether D5's re-resolution runs in the route handler or the
  proxy, and component and file naming inside the route folder.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-WEB-0021-A1 | static | `page.meta.ts` matches D1 exactly: focus job "publish our dates", `primaryConversion` `register-as-publisher`, audiences in the order `actors`, `municipalities`, `rural-residents`, both live modules declared, no proof slot, no `equalWeightConversion`. |
| TS-WEB-0021-A2 | e2e | Open `/dein-ort/starten?ort=Testdorf` in a fresh profile — no cookies, no referrer, no prior search, JavaScript disabled. The full page renders, the `h1` contains `Testdorf`, and the primary CTA is fully visible without scrolling at 360 × 640 and 1280 × 800. |
| TS-WEB-0021-A3 | e2e | Open `/dein-ort/starten` with no parameter, and with `?ort=` empty, and with `?ort=` 200 characters long. All three render the placeless variant: same blocks, no empty slot, no visible `undefined`/`null`/`{place}` token, CTA present without a prefill value. |
| TS-WEB-0021-A4 | e2e | On `/dein-ort/starten?ort=Testdorf`: every place name inside the live-example module resolves via `/api/places/{slug}/events` to a covered place with ≥ 1 date, and the string `Testdorf` occurs **only** in the `h1`/body copy, the CTA labels, and the registration `href` — not in any module heading or row, counter, proof element, `app.*` link, `<title>`, meta description, `og:*`, `link[rel=canonical]`, or JSON-LD. |
| TS-WEB-0021-A5 | e2e | `?ort=<script>alert(1)</script>` and `?ort="><img src=x onerror=alert(1)>`: no dialog, no script execution, no attribute injection; the value appears only as escaped text or as an encoded query value, and the page renders normally. |
| TS-WEB-0021-A6 | integration | Searching an uncovered place from `/` or `/dein-ort` lands on `/dein-ort/starten?ort=…`; searching a covered place without dates lands on `/dein-ort?ort=<slug>` in the empty state. The visible sentence sets of the two surfaces are disjoint (no shared copy string). |
| TS-WEB-0021-A7 | integration | `?ort=<value that now resolves>` produces exactly one 302 to `/dein-ort?ort=<slug>` with `etcc_cmp`/`etcc_med` and the language prefix preserved; following redirects terminates in ≤ 1 hop. |
| TS-WEB-0021-A8 | integration | With the place-search upstream returning 500 or timing out, the page renders as uncovered: no redirect, no error styling, no warning icon, no retry control (TS-WEB-0008 D5). |
| TS-WEB-0021-A9 | e2e | The primary CTA is an `<a href="/mitmachen/registrieren?ort=…">` carrying `data-cta="primary"`, with the received value URL-encoded and unchanged; it navigates with JavaScript disabled; no `href` anywhere on the page points at an `app.*` host. |
| TS-WEB-0021-A10 | e2e | Exactly one `data-cta="primary"`; the context band names the three non-focus jobs; the last block repeats `register-as-publisher` with the same target as block 1 (TS-WEB-0006 A6/A7). |
| TS-WEB-0021-A11 | static | Canonical is the parameter-free path; title and description come from the page's content frontmatter and contain no runtime value; the JSON-LD graph is `WebPage` + `BreadcrumbList` and contains no `Event` and no place-specific node. |
| TS-WEB-0021-A12 | e2e | With the network log recorded for a full visit including the CTA click, no tracker request carries a conversion-goal name — the goal is emitted on `/mitmachen/registrieren`, not here. |
| TS-WEB-0021-A13 | e2e | At 360 × 640 with the live-module response delayed 2 s, layout shift attributable to the place name and to the example module is 0: the name box reserves two display lines, the module reserves its geometry before content arrives. |
| TS-WEB-0021-A14 | e2e | Walk `/` → search an uncovered place → this page → CTA → registration. Every URL visited is in the TS-WEB-0004 D1 inventory; no path segment ever carries a place name or slug (DEC-0037). |
| TS-WEB-0021-A15 | manual | Tone review against D9 for audience 3: the reader is addressed directly, a resident who cannot publish is not instructed to, the absence of the place is framed as our gap, and no share widget was added. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| FUN-WEB-0047 (uncovered place → `/dein-ort/starten`, "nothing entered in \<place\> yet" plus the founding flow, place as query parameter) | entry boundary D3 · parameter contract D4, D5 · page substance D1, D2, D6, D7 · handover D8 · A2–A9, A14 |

Consumed, discharged elsewhere: FUN-WEB-0023 TS-WEB-0004 D1a · FUN-WEB-0046 TS-WEB-0008
D7 · FUN-WEB-0024 TS-WEB-0005 D5 · FUN-WEB-0049 TS-WEB-0008 D9 · FUN-WEB-0001–009 TS-WEB-0006.

## Open points

- **The IA section this page is written against is a draft (Q-0028,
  jan-henrik).** D2 and D6 follow it literally; a review that changes the
  block list or the empty-state rule invalidates them. DRAFT until Q-0028
  closes.
- **No geo anchor for an uncovered place — new demand to geo-api,
  extending Q-0025/Q-0032 (Q-0051).** D7 falls back to IP geo or a
  build-time example. Can `community/search` return the nearest covered
  community, or at least coordinates, for a name the index does not know?
  A Germany-wide name endpoint would answer this by construction — it
  resolves the place before the page declares it uncovered — which is why
  Q-0025 stays open as the upstream demand even though it blocks nothing
  that ships (DEC-0079 amendment 2026-09-24).
- **Indexing contradiction — SEO/spec owner.** TS-WEB-0011 D9 makes `?ort=`
  place pages indexable with a parameter-free canonical; TS-WEB-0008 D7
  proposes `noindex, follow`. D10 follows TS-WEB-0011; one must be withdrawn.
- ~~**Q-0071 — how far the entry path reaches (jan-henrik).**~~ **Closed
  by the DEC-0079 amendment of 2026-09-24.** The typed name is matched
  against the covered communities (TS-WEB-0008 D7), so a resident of an
  uncovered village gets no suggestion and arrives here with her raw query
  in `?ort=` (D4) — specified behaviour, and the reason covered-only is
  acceptable at all. Resolving her village Germany-wide first, which would
  give this page a real place name and an anchor, stays the target and is
  carried by Q-0025 together with Q-0051.
- **`?ort=` carries a non-slug value into TS-WEB-0023 (its author / app
  team).** Here the parameter is raw user input, not a geo-api slug.
  TS-WEB-0023 must accept and re-validate it, and never build an app URL from
  it (DEC-0029: no prefill contract).
- **D5 needs the `/dein-ort` spec to agree (its author).** A7's no-loop
  guarantee assumes `/dein-ort` never redirects an unresolvable `?ort=`
  back here — asserted until that spec exists.
- **Measurement blind spot (analytics owner / jan-henrik).** Per TS-WEB-0012
  D4 this page emits no event, so "founding page → registration" is
  observable only as page views — accept, or register one event.
