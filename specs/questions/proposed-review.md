---
artefact: question-catalogue
status: DRAFT
date: 2026-09-11
---

# PROPOSED review — the determinations that are still ours to choose

Every determination in a tactical spec carries a provenance tag. `[FIXED: …]`
means a source or a decision settles it. `[PROPOSED]` means **this spec chose
it because the sources were silent** — it is defensible, it is consistent, and
it is not authorised.

Thirty-nine determinations carry the tag; twenty-two are purely PROPOSED. This
catalogue holds them against the sixty-five decisions taken so far and asks
only what those decisions do not answer. Answers become DEC entries, and the
determinations they settle flip to `[FIXED]`.

The register rows are Q-058 … Q-070 in [open-questions.md](open-questions.md).
Q-058 is answered; the twelve below are open.

---

## A. Resolved while this catalogue was being written

### Q-058 — Breakpoints: six, and dense at the phone end **[resolved — DEC-067]**

`brand-design` ships six breakpoint tokens. TS-017 D1(b) had fixed **two**
and, worse, reused the names `md` and `lg` for 768 and 1024 — widths the
token set calls `lg` and `xl`. Writing `md:` against the tokens would have
yielded 640 px where the spec meant 768, silently, with no error anywhere.

The reduction was the spec's mistake, not the token set's excess. The
density below the tablet is the decision:

| Token | px | What it is for |
| --- | --- | --- |
| base | 0 | below `xs`: 320 px phones, the floor TS-002 A7 guards |
| `xs` | 360 | the small-phone reference viewport |
| `sm` | 428 | large phones — where the extra width is actually spent |
| `md` | 640 | phone landscape and the smallest tablets |
| `lg` | 768 | tablet portrait |
| `xl` | 1024 | small desktop |
| `2xl` | 1280 | the desktop reference viewport |

Three of the six sit under 640 px because the primary audience arrives on
a phone, so the phone is the case to *optimise* rather than the case to
survive — and "phone" is not one width. A 360 px handset and a 428 px
handset differ by nearly a fifth of the usable line: enough for a date row
to earn its preview thumbnail, for a counter trio to stop wrapping, for a
label to sit beside its control instead of under it. Collapsing both into
one "mobile" spends that difference on nothing.

What survives unchanged is the single-tree rule: six switch points do not
license six layouts. Density buys tuning, never a second component tree.

Carried through to TS-017 D2, TS-006 D3 (428 × 926 as a third reference
viewport, deliberately not a fold viewport), WEB-C-002, the design-system
contract, and the acceptance regime — A8 and A9 now sample the small range,
because a check that looks only at 360 and 1280 cannot see whether the
dense end does anything at all.

One thing is still owed, and it moved rather than closed: the design system
gives no container width or outer gutter **per breakpoint**. Six are needed,
and the three below 640 px are the ones nothing delivered so far answers.

---

## B. Determinations that bind the content phase

### Q-059 — LCP element per page (TS-003 D2)

The per-page LCP declaration names two photographs that do not exist yet:
`/mitmachen` → a WhatsApp scene image, `/ueber-uns` → a founder photo. Every
other page is text-first. Declaring an image as the LCP element means it is
eager-loaded, it is on the critical path, and the page's LCP budget depends on
it being produced, sized and licensed before launch.

| Option | What it means |
| --- | --- |
| A — keep both image LCPs | Two photographs become launch-blocking assets with a stated aspect and a reserved box. |
| B — text-first everywhere (recommended) | Both pages declare a text LCP; the photographs load below or lazily. No page's performance budget depends on an asset that does not exist. |
| C — keep `/ueber-uns`, drop `/mitmachen` | The founder photo is the one image whose absence would be felt. |

### Q-060 — How a price may reach the page (TS-018 D3)

The spec derives a predicate — `promotion === 'promoted' && price_status === 'fixed'` —
and draws two conclusions the sources do not state:

1. **A price is never a literal in copy.** One component reads the offering
   package and refuses any id the predicate rejects. Typing "480 €" into a text
   is a defect even when the figure is right.
2. **The figures 4000 and 5 ship inside the build** as frontmatter of installed
   packages, so a template mistake can print a price we withhold.

Confirm the predicate, and decide whether conclusion 2 needs a guard of its own
(a build check that no withheld amount appears in rendered output).

### Q-061 — Do we publish a machine-readable price? (TS-011 D4)

`/dein-kalender` would emit JSON-LD `Service` + `Offer` with `price: 480`,
`priceCurrency: EUR`, `unitCode: ANN`. That is a structured price claim that
search engines and assistants may quote out of context — and 480 € is **per
organisation**, however many places it covers. `unitCode: ANN` states the year;
nothing in the markup states the organisation.

| Option | What it means |
| --- | --- |
| A — emit the Offer, add the unit in words (recommended) | Keep the Offer; add `priceSpecification` with a `unitText` naming the organisation, so the scope travels with the figure. |
| B — `Service` without an `Offer` | Same treatment as `/deine-region`. The price stays visible to readers, invisible to machines. |
| C — emit as proposed | Accept that the figure can be quoted without its scope. |

Also open in D4: second-level pages emit `BreadcrumbList` "if the IA adopts a
visible trail". The IA has not said. Visible breadcrumb trail on the five
second-level pages — yes or no?

### Q-062 — The AAA criteria we adopt beyond AA (TS-002 D2)

Four AAA criteria are proposed for this audience: link purpose from link text
alone (no "hier klicken"), visual presentation (≤ 80ch, line-height ≥ 1.5),
reading level (plain language), animation from interactions. Three of the four
bind **every text the content phase writes**, not the implementation.

Confirm the set — and confirm the one that is genuinely costly: reading level.
WCAG 3.1.5 targets lower-secondary reading level, which is stricter than "plain
and warm" and would apply to the legal register too.

---

## C. Additions that cost something

### Q-063 — A BFF route for the order preview (TS-025 D4)

`/dein-kalender/bestellen` would gain a live preview — places in scope, upcoming
dates, up to five next dates — served by a new route
`GET /api/scope/preview?orte=&plz=&kreis=`, debounced 400 ms, one request per
scope change, never a per-place fan-out. It is the only BFF route the order flow
needs, and it adds upstream load to events-api and geo-api that scales with
people *configuring* rather than *ordering*.

| Option | What it means |
| --- | --- |
| A — build it as specified (recommended) | The buyer sees what they are buying; a counter beats a promise. Cost is bounded by the debounce and the scope-key cache. |
| B — counters only, no date rows | One cheaper aggregate call; the preview loses the concreteness that makes it persuasive. |
| C — no preview at launch | The order flow ships without it; the route stays in the spec as a later addition. |

### Q-064 — Generated snapshots in the repository (TS-009 D8)

Tier 3 of the resilience cascade needs a payload that exists before the first
request. The spec generates it at build time into `src/generated/snapshots/`,
and — this is the part that needs your decision — **keeps the previously
committed file when the build fetch fails**, warning rather than failing. That
only works if the snapshots are committed, which means generated JSON in git,
changing on most builds.

| Option | What it means |
| --- | --- |
| A — commit them (recommended) | Tier 3 survives an upstream outage during a build. Cost: noisy diffs on generated files. |
| B — generate fresh, never commit | Clean tree; a build during an outage ships without a tier-3 payload, and the cascade ends at tier 2. |
| C — commit, but fail the build on a failed fetch | No stale snapshots ever, at the price of upstream outages blocking deploys. |

### Q-065 — Is `/deine-termine` reserved at launch? (TS-004 D7)

The offering→surface map reserves `/deine-termine` for the
`portalize-website-widget`, which is `withheld` and has no surface built. A
reserved route that renders nothing is either a 404 that we have promised
ourselves, or a page that must exist.

Reserve the path in the inventory without building it, or leave it out entirely
until the widget is sellable?

### Q-066 — The lead fallback when the envoy widget is late (TS-016 D6)

Delivery of the envoy widget is UNKNOWN, so every lead surface ships a static
fallback: "the contact route of last resort (an email address rendered as a
link)". Two things are unstated.

1. **Which address?** A single generic one, or one per surface?
2. **Rendered how?** A `mailto:` link is scraped within days. Obfuscation that
   needs JS breaks the no-JS case the fallback exists for.

Recommended: one generic address, rendered as plain text plus a `mailto:` link,
accepting the spam — the fallback should disappear when the widget lands, and
an address that survives for months is the wrong thing to optimise.

---

## D. Numbers this spec invented

Each of these is a defensible guess with no source behind it. Confirming them
makes them binding; replacing them costs one line each.

### Q-067 — Cache lifetimes (TS-003 D5)

| Data | Fresh | Serve-stale |
| --- | --- | --- |
| dates per place | 5 min | 24 h |
| active places / map | 1 h | 7 d |
| live counters | 15 min | 24 h, then hidden |
| proof stream per segment | 1 week | until the ISO week turns |
| pages (HTML) | 1 h | until next deploy |

The one worth a second look: **dates per place, 5 minutes**. An event corrected
by an organiser stays wrong on the website for up to five minutes, and stale for
up to 24 hours in an outage. Both are defensible for a weekly rhythm; neither is
decided.

### Q-068 — Context-proximity weights (TS-005 D2)

Every element type gets a proximity to every entry context: starting type 1.0,
named widening type 0.6, anything else 0.3. The shape follows SRC-002's context
matrix; the three numbers do not. The consequence of 0.3 rather than 0.0 is that
an unrelated type can still surface when nothing better exists — deliberate, and
worth confirming.

### Q-069 — The JavaScript budget (TS-003 D1)

Per-route first-load JS ≤ 100 KB hard, ≤ 70 KB target. No source names a figure.
The hard limit becomes a build-failing gate, so it is the number that decides
whether a future library is allowed in.

---

## E. One block to confirm together

### Q-070 — Eight low-stakes determinations

These follow from decisions already taken and have no plausible alternative
worth a page. They are listed so that confirming them is a deliberate act rather
than an omission.

| Spec | Determination | In short |
| --- | --- | --- |
| TS-015 D8 | Canary gate signals | Readiness, journeys, route smoke gate the promotion; canary error logs are reported, never a verdict |
| TS-015 D9 | Spec checker in CI | E1–E10 block the merge; W1–W3 are reported per release, never gated |
| TS-015 D11 | Runner and toolchain | `ubuntu-latest`, Node from `.nvmrc`, pnpm 10.x, frozen lockfile, no custom image |
| TS-014 D5 | Three environments | CSP enforced in all three; HSTS 2 y production / 1 d preview / off locally |
| TS-029 D3/D4 | Anchors and on-page nav | `scroll-margin-top` from the header variable; a server-rendered section nav, sticky ≥ 1024 px |
| TS-028 D4/D7 | Archive filter and rows | Client-side chips over static rows, only types with entries; year spine as the heading outline |
| TS-021 D5 | Late-link re-resolution | A shared `?ort=` link that resolves later 302s to `/dein-ort`; an upstream error never redirects |
| TS-010 D2 | Resolution precedence | Route → entry context → IP → stated place → browser geolocation; later overwrites earlier, no step blocks the response |

---

## What happens to the rest

Seventeen determinations carry `[PROPOSED]` on a sub-clause only — a number
inside an otherwise fixed rule, or a row awaiting an external answer. They are
already tracked by the question they wait on (Q-008, Q-015, Q-019, Q-045, Q-054,
Q-056) and are not repeated here.

One was not a question but a defect: TS-004 D7 still granted
`local-advertising` one sentence on `/dein-kalender` after DEC-052 §3 narrowed
that to no occurrence. Corrected, not asked.
