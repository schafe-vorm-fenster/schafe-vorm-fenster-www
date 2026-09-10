---
artefact: tactical-spec
id: TS-013
profile: rule
status: DRAFT
implements: [WEB-Q-023, WEB-Q-024, WEB-Q-025]
sources: [SRC-001, SRC-003, SRC-006, SRC-010, SRC-011]
decisions: [DEC-004, DEC-009, DEC-013, DEC-015, DEC-024, DEC-025, DEC-030, DEC-039]
---

# TS-013 — Data Protection as an Implementation Property

## Purpose

The site *says* it sets no tracking cookies. This spec is what makes the
sentence true and keeps it true: the closed inventory of hosts a visitor's
browser may contact, the rule that governs adding one, and the handling
rule for IP geolocation. Analytics behaviour itself (cookieless mode,
event set, eTracker configuration — WEB-Q-020/021/022/028) belongs to the
analytics spec; this spec only counts eTracker as a request.

## Determinations

### D1 — The claim, and where it is made [FIXED: WEB-Q-023, SRC-001#boundaries, SRC-003]

The absence of tracking is a sales argument, not only a legal posture. It
appears as a data-protection block on `/dein-kalender` (the page that asks
for 480 €) and as the corresponding section on
`/rechtliches#datenschutz` (DEC-039). Both state the same fact.

What the claim asserts — and therefore what the build must not break:

| Asserted | Meaning in the implementation |
| --- | --- |
| no tracking cookies | no cookie set by the site or by any host in D2 that carries a visitor identifier |
| no persistent identifier | no `localStorage` / `sessionStorage` / IndexedDB / ETag-style identifier used for recognition |
| no consent banner | no processing on the page requires consent, so no consent layer exists at all (DEC-013) |
| no third-party trackers | the D2 inventory is the whole set; one external company is in it (eTracker), and it is named |

Under WEB-C-016 the site makes no claim it cannot prove. The claim may
therefore not be worded more strongly than D2 supports — in particular
not "no third-party services at all", because eTracker and the platform
(Vercel) are third parties and are declared as such in the privacy
policy.

### D2 — Client-request inventory: the closed set [FIXED: DEC-015 allowlist, DEC-004, DEC-009, DEC-030; classification PROPOSED]

Every host a visitor's browser may contact while a page of this site is
open. Nothing outside this table is permitted; a request to an unlisted
host is a defect, not a configuration detail.

| Host | Request kind | Introduced by | Party | Note |
| --- | --- | --- | --- | --- |
| `schafe-vorm-fenster.de` (and `.pl`, `.at`, `sheepoutside.com`) | document, CSS, JS, fonts, images, `/api/*` BFF calls | own origin | first party | everything self-hosted per D4 |
| `/_vercel/speed-insights/*` | RUM script + beacon | TS-003 D7 | Vercel (host, processor) | same-origin path, no separate host, cookieless |
| `code.etracker.com` | deferred analytics script and its beacon | DEC-004 | eTracker GmbH, Hamburg — **the only external company in this table** | `data-block-cookies="true"`, config extracted from SRC-010 |
| `app.schafe-vorm-fenster.de` | Portalize loader `…/api/{organizerId}/load.js` and the widget's own calls | DEC-030 | own ecosystem | cookie-freedom is a demand, not yet verified (Q-026) |
| envoy widget host — **UNKNOWN** | web-component script, form submission | DEC-009 | own ecosystem | cannot be allowlisted before the host is named (Q-022) |

**Navigations, not subresource requests** — these load no code into the
page and are not part of the allowlist: handover links to
`app.schafe-vorm-fenster.de` (DEC-029), and outbound links to external
media. Under DEC-013 external media are represented by our own preview
(screenshot, quote from `media-echo/`) plus a link; there is no embedded
player and no click-to-load layer, so no third-party host is contacted
until the visitor leaves the site. What leaks on leaving is governed by
the referrer-policy header (WEB-Q-032, security spec).

**Explicitly absent, and to stay absent**: `fonts.googleapis.com` /
`fonts.gstatic.com`, any script or CSS CDN, map tiles, social buttons and
pixels, video/audio players, captcha services (WEB-Q-035 excludes them),
consent-management platforms, session-replay and heatmap tools.

The CSP allowlist (WEB-Q-030) and this table are the same set seen from
two sides. If they diverge, one of them is wrong.

### D3 — Everything else leaves from the server [FIXED: DEC-025, WEB-Q-037]

Every ecosystem API is called server-side through the site's own BFF
routes (TS-004 D5), so no API host appears in a client request and no
visitor IP reaches an upstream service:

| Reached from the server only | Occasion |
| --- | --- |
| `events.api.…`, `geo.api-v2.…`, `calendar.api.…`, `assets.api.…` (SRC-011) | request-time BFF calls |
| `classify.api.…`, Google Docs legal import (DEC-012), `media-echo` package data | build time only |
| envoy-api | reached by the widget, not by the site (D2) |

Two binding consequences:

1. **The BFF does not forward the client IP.** `x-forwarded-for`,
   `x-real-ip` and equivalents are not passed upstream; a BFF route sends
   only the parameters its use case needs.
2. **Place search never uses `findbyaddress`.** DEC-024 forbids it for
   cost and latency; the privacy reason is the same endpoint's external
   Google Maps lookup, which would carry the visitor's search term to a
   third party through our server. Name search uses the Typesense-backed
   endpoint (Q-025).

Images sourced from `assets.api.…` are served through the site's own
image pipeline, so the asset host does not appear in the browser either.
[PROPOSED]

### D4 — Self-hosting is the default [FIXED: WEB-Q-025, WEB-Q-005, TS-003 D3]

Every static asset ships from our own origin. Fonts are the settled case
and the precedent: the brand typeface is self-hosted as a variable `woff2`
(TS-003 D3) — a performance decision and a privacy decision in the same
move, because a font CDN would hand the visitor's IP to a third party on
every page view. The same rule covers icons, images, stylesheets and
JavaScript libraries: vendored into the build, never linked from a CDN.

### D5 — The rule for additions [FIXED: WEB-Q-025, WEB-Q-031, DEC-013]

A new outbound request is never a code change alone. Candidates are taken
in this order, and a lower rung may only be used once the ones above are
shown not to work:

| Rung | Option | Cost |
| --- | --- | --- |
| 1 | self-host the asset (D4) | build size |
| 2 | proxy it server-side through a BFF route (D3) | a route, a cache TTL |
| 3 | allowlist the third-party host | PR review, CSP change, privacy-policy section |
| — | embed it as a third party | **not available** (DEC-013) |

Rung 3 requires all of: a reviewed PR against the CSP allowlist, never a
wildcard (WEB-Q-031); a named section in the privacy policy on
`/rechtliches#datenschutz` before the host goes live; a row added to D2;
and evidence that the host sets no cookie and no persistent identifier.

**The disqualifier is consent.** If a candidate would make a consent
banner necessary, it is rejected at rung 3 regardless of its merits —
banner-freedom is a requirement (WEB-Q-020) and a published sales
argument (D1), not a preference to be traded against a feature.

### D6 — IP geolocation without storage [FIXED: WEB-Q-024, WEB-F-053/054; mechanism PROPOSED]

Location detection is invisible (WEB-F-053) and must stay unlinkable to a
person:

| Rule | Detail |
| --- | --- |
| where the IP is read | server-side only, from the platform request headers, inside the request that renders the page |
| what it becomes | a county-level geo reference (`county` in the TS-005 D1 hierarchy); finer resolution is not pursued — place level is explicitly out (SRC-006, "spooky") |
| lifetime | the request. The IP is never written to a database, a log line, a cookie, or the HTML payload |
| what reaches the client | only the derived label, never the address it came from |
| cache keys | never contain an IP. Segment keys are `{community, trait, job, isoWeek}` (TS-005 D8) — derived and coarse, so no cache entry is traceable to a visitor |
| upstream | the resolution call carries the IP no further than needed to resolve it (D3 rule 1 otherwise applies) |
| browser geolocation | only after an explicit interaction; the coordinate is used for that request and not persisted |

Mechanism [PROPOSED]: the platform's own geo headers where their
resolution suffices, geo-api resolution otherwise; either way the rules
above bind, and the choice is an implementation detail.

The legal confirmation for this handling is outstanding — see Open points.

## Free for the generator

- [FREE] How the network-trace check (A1) is realised — Playwright route
  interception, a CSP report endpoint, or both — as long as it fails on
  any host outside D2.
- [FREE] Wording, layout and length of the data-protection block on
  `/dein-kalender`; only the claim's scope (D1) is fixed. Copy is written
  in the content phase.
- [FREE] Where the derived geo reference is held during a request
  (context, prop drilling, request-scoped store), within D6.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-013-A1 | e2e | Network trace of every route in TS-004 D1, on every domain: each request host appears in D2. Any other host fails the run. |
| TS-013-A2 | e2e | Full session (home → place search → `/dein-kalender` incl. embed demo → form open → legal page): no cookie carrying an identifier, and `localStorage` / `sessionStorage` / IndexedDB hold no identifier. |
| TS-013-A3 | static | Built output and source contain no external asset URL: no `fonts.googleapis.com`, `fonts.gstatic.com`, or any CDN host; fonts, icons and libraries resolve to own-origin paths. |
| TS-013-A4 | static | The deployed CSP allowlist equals the D2 host set exactly — no wildcard, no extra host, no missing host. |
| TS-013-A5 | integration | BFF routes call upstream without `x-forwarded-for` / `x-real-ip` / any client-IP header; no BFF route calls `findbyaddress`. |
| TS-013-A6 | unit | The geo resolver returns at most county-level, writes nothing, and no returned or cached key contains an IP address. |
| TS-013-A7 | manual | Every host in D2 outside our own origin has a named section in the privacy policy on `/rechtliches#datenschutz`, and the `/dein-kalender` block claims nothing D2 does not support. |
| TS-013-A8 | manual | Review gate: a PR adding an outbound request carries the D5 rung-3 evidence (allowlist diff, privacy-policy section, D2 row, no-cookie evidence) or is rejected. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| WEB-Q-023 (no-cookie claim as trust argument, kept true) | D1, D2, D4 · A1, A2, A3, A7 |
| WEB-Q-024 (IP geolocation without storage) | D6, D3 · A5, A6 |
| WEB-Q-025 (third-party requests reviewed, self-hosting preferred) | D2, D3, D4, D5 · A1, A3, A4, A5, A8 |

## Open points

- **Q-008 — carried, not solved.** The DPIA / legal confirmation that
  IP geolocation without storage is lawful in this form is still
  outstanding (addressee: legal). Three questions need naming answers:
  does resolving and discarding an IP within one request constitute
  processing that needs a DPIA, or does an Art. 30 processing record
  suffice; is the derived county-level reference personal data; and does
  the coarse segment cache key (`{community, trait, job, isoWeek}`) stay
  outside that assessment. Until answered, D6 is the intended handling,
  not a cleared one.
- **Q-022 — the envoy widget host is unknown.** D2 has a row without a
  hostname, so the CSP allowlist cannot be closed and A4 cannot pass.
  The widget contract must also state that the widget sets no cookie and
  no persistent identifier.
- **Q-026 — the Portalize embed is unverified.** Its cookie-freedom is a
  demand, not a result. The embed demo sits on `/dein-kalender`, the same
  page that carries the trust claim (D1): an embed that sets a cookie
  falsifies the claim on the page that makes it. Verification is a launch
  gate for that page.
- **Q-020 — the newsletter system is undecided.** If the chosen sender
  needs a client-side script, it enters D5 at rung 3 and may not ship
  before that review; a sender that would require consent is disqualified
  by D5.
- **eTracker is interim (WEB-Q-021).** It is the only external company in
  D2; replacing it changes the table, the CSP allowlist and the privacy
  policy in one move. Any successor must clear D5 including the consent
  disqualifier.
- D2's classification, D3's image-pipeline rule and D6's mechanism are
  [PROPOSED].
