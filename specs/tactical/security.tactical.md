---
artefact: tactical-spec
id: TS-014
profile: rule
status: DRAFT
implements: [WEB-Q-030, WEB-Q-031, WEB-Q-032, WEB-Q-033, WEB-Q-034, WEB-Q-035, WEB-Q-036]
sources: [SRC-006, SRC-010, SRC-011, SRC-012]
decisions: [DEC-009, DEC-013, DEC-014, DEC-015, DEC-017, DEC-025, DEC-030, DEC-031, DEC-035]
---

# TS-014 — Security Baseline

## Purpose

The security baseline that is binding from the **first** deployment, not
retrofitted: the literal CSP directive set, the literal header values,
what runs in CI, and how forms and BFF routes are protected. DEC-013
(no third-party embeds) is what keeps the allowlist short enough to write
out in full — so this spec writes it out in full. Transport and routing
belong to TS-004; this spec only adds the rules that constrain them.

## Determinations

### D1 — The allowlist: every external host, named [FIXED: WEB-Q-030, DEC-015, DEC-013; hosts PROPOSED]

The complete set. Four external origins, no fifth. Hosts marked
[PROPOSED] are read off the sibling repositories, not confirmed by their
owners.

| Origin | Why it exists | Active directives | Provenance |
| --- | --- | --- | --- |
| `'self'` | the website, its own bundles, its BFF routes (D10), Vercel Speed Insights and Web Analytics (served first-party under `/_vercel/…`) | all | DEC-002, TS-003 D7 |
| `https://code.etracker.com` | eTracker loader `e.js` and its beacon; legacy config `data-secure-code="i9strK"`, `data-block-cookies="true"` | `script-src`, `connect-src`, `img-src` | SRC-010 `legacy-content/app/layout.tsx`, DEC-004/DEC-028 |
| `https://portalize.schafe-vorm-fenster.de` | Portalize loader `/api/{organizerId}/load.js`, web-component mode — the embed demo (WEB-F-043) | `script-src`, `connect-src` | DEC-030, `portalize/DEPLOYMENT.md` |
| `https://envoy-api.api.schafe-vorm-fenster.de` [PROPOSED] | envoy lead widget: its web-component script and its own submission endpoint | `script-src`, `connect-src` | DEC-009; host read from `envoy-api`, widget host unconfirmed (Q-022) |
| `https://app.schafe-vorm-fenster.de` | named by WEB-Q-030; the handover (WEB-F-013, DEC-029) is a plain `GET` navigation, which CSP does not govern | **none today** — reserved slots: `frame-ancestors` (D4) and `form-action` (if the handover ever becomes a POST) | DEC-035, WEB-Q-030 |

**Deliberate non-entries.** Each is an origin someone will otherwise add
by reflex:

| Not in the list | Why not |
| --- | --- |
| `events.api.`, `geo.api.`, `calendar.api.`, `classify.api.` (SRC-011) | the browser never talks to them — the website is its own BFF (DEC-025, TS-004 D5) |
| `assets.api.schafe-vorm-fenster.de` | images pass through the Next image optimizer and are served from `'self'` |
| any font CDN | fonts are self-hosted (WEB-Q-005, TS-003 D3) |
| any player, social or embed host | DEC-013 — own preview plus outbound link, never an embed |
| any error/APM SDK host | DEC-017 (D13) |
| any captcha or challenge host | DEC-014 (D9) |

### D2 — The Content-Security-Policy, written out [FIXED: enforcement DEC-015; directive values PROPOSED]

Production policy. `{NONCE}` per D3.

```text
default-src 'self';
base-uri 'self';
script-src 'self' 'nonce-{NONCE}' 'strict-dynamic' https://code.etracker.com https://portalize.schafe-vorm-fenster.de https://envoy-api.api.schafe-vorm-fenster.de;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https://code.etracker.com;
font-src 'self';
connect-src 'self' https://code.etracker.com https://portalize.schafe-vorm-fenster.de https://envoy-api.api.schafe-vorm-fenster.de;
media-src 'self';
manifest-src 'self';
worker-src 'self';
object-src 'none';
frame-src 'none';
child-src 'none';
form-action 'self';
frame-ancestors 'none';
upgrade-insecure-requests;
report-to csp;
report-uri /api/csp-report
```

Four choices in there are not obvious and a generator gets them wrong by
default:

| Choice | Reason |
| --- | --- |
| `default-src 'self'`, not `'none'` | `'none'` reads stricter but also governs every directive that has no name of its own — prefetch first. Next.js route prefetching is the first casualty, and the failure is silent. Every directive that matters is named explicitly anyway. |
| `'strict-dynamic'` **and** a host allowlist in `script-src` | CSP3 browsers ignore the host list once `'strict-dynamic'` is present — enforcement runs on the nonce, and the three third-party loaders are trusted because *we* render their `<script src>` tags **with the nonce**, which then propagates to what they load. The host list stays as the CSP2 fallback and as the written allowlist WEB-Q-030 asks for. Both halves are required; dropping either breaks a browser class. |
| `style-src 'unsafe-inline'` | the one bounded concession. Next.js inlines critical CSS and both web components style their shadow roots inline. Script injection stays fully locked; CSS-based exfiltration is the residual risk, accepted and flagged. Tightening path: a style nonce, once D3 resolves nonce delivery. |
| `frame-src 'none'` | pins Portalize to web-component mode. DEC-030 chose it; this makes the iframe fallback fail loudly instead of quietly loading a second document. |

### D3 — Per-build hashes, not a nonce [FIXED: DEC-045]

**Decided 2026-09-10:** variant A. `script-src` carries `'self'` plus
per-build `'sha256-…'` hashes; no per-request nonce, so the prerendered
shell of TS-004 D6 is preserved. The build extracts and hashes every
inline script — a new inline block that skips that step breaks the policy
loudly instead of silently weakening it. `'strict-dynamic'` still applies.
The nonce variant below is recorded as the rejected alternative and its
cost is why.

#### The conflict, for the record [superseded by DEC-045]

Next.js emits inline bootstrap scripts (flight payload). Under D2 they
need a nonce or a hash. A per-request nonce cannot live in a body served
from the full-route cache — and TS-004 D6 renders every content page
static + ISR (1 h). The two cannot both be true. Two variants; **Variant
A is proposed**:

| | Variant A — nonce | Variant B — static + hashes |
| --- | --- | --- |
| `script-src` | `'self' 'nonce-{NONCE}' 'strict-dynamic' <D1 hosts>` | `'self' 'sha256-…' … <D1 hosts>` (no `'strict-dynamic'`) |
| Nonce origin | generated in `proxy.ts` per request, passed as `x-nonce`, read by the root layout | none |
| Cost | the HTML shell leaves the full-route cache and renders per request; data and segment caching (TS-003 D5) are untouched | the hash set must be regenerated at every build and differs per page — brittle, and a missed hash is a blank page |
| Risk to | TS-003 D1 (Lighthouse 100 / TTFB) | release reliability |

`proxy.ts` staying "a pure function of hostname + path" (TS-004 D3) is a
statement about *routing* state. A nonce is derived per request and
stored nowhere; it does not make the proxy stateful. Variant A does not
violate that rule.

### D4 — Security headers, header by header [FIXED: WEB-Q-032; values PROPOSED]

| Header | Value | Note |
| --- | --- | --- |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` | **no `preload` at launch** — see Open points; production only |
| `X-Content-Type-Options` | `nosniff` | |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | the app handover carries its slugs in the URL (DEC-029), so origin-only referrer costs nothing |
| `Permissions-Policy` | `accelerometer=(), autoplay=(), browsing-topics=(), camera=(), display-capture=(), encrypted-media=(), fullscreen=(self), geolocation=(self), gyroscope=(), idle-detection=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), serial=(), usb=(), xr-spatial-tracking=()` | `geolocation=(self)` is needed by "this week nearby" (TS-004 D5 `/api/nearby`); `browsing-topics=()` keeps the no-identifier promise (WEB-Q-020) true at the browser level |
| `X-Frame-Options` | `DENY` | legacy companion to `frame-ancestors 'none'`; the two must never disagree |
| `Cross-Origin-Opener-Policy` | `same-origin` | |
| `Cross-Origin-Resource-Policy` | `same-origin` | |
| `Reporting-Endpoints` | `csp="/api/csp-report"` | pairs with `report-to` in D2 |
| `X-Robots-Tag` | `noindex, nofollow` | preview deployments (WEB-C-023) and all BFF routes only — never production pages |
| `Cache-Control` | `no-store` | BFF error and 429 responses only |

**Headers deliberately not set**, so nobody adds them back as an
improvement: `Cross-Origin-Embedder-Policy` (would break both embedded
web components), `X-XSS-Protection` (the legacy auditor is itself an
attack surface; modern browsers ignore it — a deliberate divergence from
the `portalize` prior art), `Expect-CT` (deprecated),
`require-trusted-types-for` (Next.js does not survive it today).

`frame-ancestors` exception: `'none'` until a concrete app-embed need is
named. If one appears, the value becomes
`frame-ancestors 'self' https://app.schafe-vorm-fenster.de` and
`X-Frame-Options` is dropped — a reviewed change under D7, not a config
tweak.

Where they are set: the static set in `next.config.ts` `headers()`,
applied to all routes; the CSP in `proxy.ts` (per-request nonce and
per-environment variance). **A `vercel.json` `headers` block would
silently take precedence over both and is therefore forbidden** — one
source per header, no exceptions.

### D5 — Three environments [FIXED: DEC-070]

| | Production | Preview (`next.*`, branch previews) | Local dev |
| --- | --- | --- | --- |
| CSP | enforced, D2 verbatim | enforced, D2 verbatim | enforced, plus `'unsafe-eval'` in `script-src` and `ws: http://localhost:*` in `connect-src` for HMR |
| HSTS | `max-age=63072000; includeSubDomains` | `max-age=86400; includeSubDomains` | off |
| `X-Robots-Tag` | absent on pages | `noindex, nofollow` (WEB-C-020/023) | — |
| `upgrade-insecure-requests` | on | on | off |

WEB-Q-030 says *enforced*, so report-only is never a substitute. A
`Content-Security-Policy-Report-Only` header may run **alongside** the
enforced one to trial a tightening (e.g. removing
`style-src 'unsafe-inline'`); it never replaces it.

### D6 — Violation reporting stays inside Vercel [PROPOSED — follows DEC-017]

`POST /api/csp-report` accepts `application/csp-report` and
`application/reports+json`, and does exactly one thing: emit a structured
log line that lands in Vercel Runtime Logs (D13). No storage, no
forwarding, no third-party collector — a collector would be the
additional service DEC-017 refuses.

Rules: always answers `204`; body cap 8 KB; `Cache-Control: no-store`;
rate-limited per D10; logs only `violated-directive`, `blocked-uri`,
`effective-directive` and the **path** of `document-uri` — the query
string is stripped, because a place search sits in it (WEB-Q-020).

### D7 — Allowlist change control [FIXED: WEB-Q-031]

- The policy is one typed structure in one module, `lib/security/csp.ts`
  — never a string spread across config files. D1's table and that
  module are the same list; a host in one and not the other is a defect.
- **No wildcard, ever.** Forbidden in a production `script-src` or
  `connect-src`: `*`, any bare scheme (`https:`, `data:`, `blob:`),
  `'unsafe-inline'`, `'unsafe-eval'`. `data:` is permitted in `img-src`
  only. A1 asserts this statically, so the rule fails in CI rather than
  in review.
- Every addition is a PR that touches that module and names the
  requirement or decision that justifies the host. CODEOWNERS review.
- Adding an origin means adding a row to D1 in the same PR, including
  the "why it exists" cell. An entry nobody can explain is removed.

### D8 — HTTPS everywhere [FIXED: WEB-Q-034]

- Vercel terminates TLS and answers plain HTTP with a `308` — a
  permanent redirect; the platform default satisfies WEB-Q-034 and the
  website adds no redirect of its own.
- All hosts are covered: `www` and apex on `schafe-vorm-fenster.de`,
  `app.`, `next.`, plus `owcezaoknem.pl`, `schafvormfenster.at` and
  `sheepoutside.com` once wired (DEC-035, DEC-003).
- `upgrade-insecure-requests` (D2) catches whatever slips through.
- **Every URL the website emits is an absolute `https://` URL** — links,
  canonicals, hreflang, sitemap entries, OG tags, third-party script
  sources. No protocol-relative `//host/…`. The legacy eTracker snippet
  used `//code.etracker.com/code/e.js` (SRC-010); the relaunch writes the
  scheme. A7 is the gate.

### D9 — Form abuse protection: three layers, no captcha [FIXED: DEC-014, WEB-Q-035; parameters PROPOSED]

**No captcha of any kind** — not reCAPTCHA, hCaptcha, Turnstile, an
"invisible" challenge, or a proof-of-work interstitial. This is
structural, not a preference; three separate rules already forbid it:

1. a captcha breaks TS-002 D1 (WCAG 2.2 AA — 1.1.1, 3.3.7) and its
   AAA plain-language stance (TS-002 D2) for exactly the audience this
   site is for;
2. it loads a third-party script and sets identifiers, which
   contradicts WEB-Q-020/023 and DEC-004;
3. its host is not in D1 and would have to be argued through D7 first.

The three layers that replace it:

| Layer | Rule | Parameter |
| --- | --- | --- |
| Honeypot | a field no human is offered: `aria-hidden="true"`, `tabindex="-1"`, `autocomplete="off"`, hidden by CSS (`position:absolute; left:-10000px`), **never** `type="hidden"` — bots fill what is in the DOM, and a hidden input is the one they skip. Filled → the submission is discarded and the **normal success response** is returned. Never a visible error, never a hint. | field name from a plausible pool (`website`, `company_url`, `fax`) [PROPOSED] |
| Timing | the rendered form carries a server-signed timestamp (HMAC, server-side secret) in a hidden field; the client cannot forge it. Too fast or too old → discarded, same silent success. | floor 3 s, ceiling 60 min [PROPOSED] |
| Rate limit | server-side, per D10 | — |

**Ownership.** All lead forms are the envoy widget and the website ships
no form backend (DEC-009, WEB-F-092) — so layers 1 and 2 are implemented
by envoy, not here, and the website must not bolt on a competing layer of
its own. What binds the website: DEC-014 travels with the widget demand
(Q-022), and the website's acceptance still tests it from the outside
(A8, A9) — the same arrangement TS-002 A6 uses for the widget's
accessibility.

### D10 — Rate limiting on the BFF routes [FIXED: WEB-Q-038, DEC-025; limits PROPOSED]

Per client IP, sliding window, on the TS-004 D5 inventory:

| Route | Limit | Beyond |
| --- | --- | --- |
| `GET /api/places/search` | 30 / min | `429` + `Retry-After: 60` |
| `GET /api/places/{slug}/events` | 60 / min | `429` + `Retry-After: 60` |
| `GET /api/nearby` | 30 / min | `429` + `Retry-After: 60` |
| `GET /api/region/{county}/examples` | 30 / min | `429` + `Retry-After: 60` |
| `GET /api/stats` | 60 / min | `429` + `Retry-After: 60` |
| `POST /api/csp-report` | 100 / min | `429`, body discarded |
| any route not listed | 60 / min | `429` |

Mechanism: Vercel Firewall rate-limit rules as the primary control —
platform-native, counts at the edge before the function bills, and adds
no runtime dependency (see Open points for the plan question). Client
identity is the leftmost entry of the Vercel-trusted `x-forwarded-for`.

**Limits sit deliberately high.** Rural connections sit behind carrier
NAT; one IP can be a whole village, or a school class opening
`/dein-ort` together. A limit tuned against a single browser would block
the exact audience this site is built for.

A `429` renders as a component state ("gleich nochmal versuchen"), never
as an error page — the 404/500 surfaces of DEC-032 do not apply here.

### D11 — Origin checks, and what they are actually worth [FIXED: WEB-Q-038; rule PROPOSED]

DEC-025 already says it: for public read data a client token is theatre,
and quota is the real control. The origin check is a **quota-protection
measure against casual hotlinking from foreign pages**, not a security
boundary. Stated plainly so nobody later mistakes it for one.

| Signal | Rule |
| --- | --- |
| `Sec-Fetch-Site: same-origin` / `same-site` | pass |
| `Sec-Fetch-Site: none` (address bar, curl, crawler) | pass — the data is public; no elevation follows |
| `Sec-Fetch-Site: cross-site` with a foreign `Origin` | `403`, `Cache-Control: no-store` |
| `Origin` in the allowed set: the production hosts (D8), this project's `*.vercel.app` previews, `http://localhost:3000` in dev | pass |

**No CORS headers.** BFF routes send no `Access-Control-Allow-Origin` at
all — that, not the `Origin` check, is what stops a foreign page from
reading the responses. A10 asserts the header's absence.

The website has no state-changing client endpoint today (forms belong to
envoy, DEC-009). If one ever appears it requires a same-origin `Origin`
header with no `Sec-Fetch-Site: none` exemption.

### D12 — Dependency scanning in CI [FIXED: WEB-Q-033; shape PROPOSED — SRC-012, DEC-031]

Lives in the `Quality` job of the pipeline modelled on
`classification-api` (WEB-C-021), in the same shape: scan, write to
`reports/security/`, upload as an artifact (14 days).

| Gate | Tool | When | Blocks |
| --- | --- | --- | --- |
| Lockfile audit | `pnpm audit --audit-level=high` | every PR | **yes** — high + critical |
| Dependency / secret scan | `trivy fs --scanners vuln,secret --severity HIGH,CRITICAL --exit-code 1 .` | every PR + push to `main` | **yes** |
| Static analysis | semgrep | every PR | no — advisory, `continue-on-error: true` as in SRC-012 |
| Header + CSP regression | own static test (A1, A2) | every PR | **yes** |
| Dependency updates | Dependabot, ecosystems `npm` + `github-actions`, weekly | continuous | — |
| Secret scanning | GitHub secret scanning with push protection | continuous | push rejected |

"Critical findings block release" (WEB-Q-033) is realised twice: the
`Quality` job is a required check for merge, and the rolling production
promotion (WEB-C-022) does not start when it failed.

A finding that cannot be fixed is suppressed only through a
`.trivyignore` entry carrying a justification and an **expiry date**;
an expired entry fails the job. Never a silent dismissal.

### D13 — Production error observation [FIXED: DEC-017, WEB-Q-036]

| Signal | Vercel-native means |
| --- | --- |
| Unhandled exceptions (functions, RSC, BFF) | Vercel Runtime Logs + Observability → Runtime Errors |
| 4xx / 5xx rate per route | Vercel Observability, with an alert on 5xx |
| Availability | the **existing** external uptime monitoring, unchanged |
| CSP violations | `/api/csp-report` → structured log → Runtime Logs (D6) |
| Web Vitals / p75 regression | Vercel Speed Insights (TS-003 D7) |

Rules:

- **No error SDK.** No Sentry, Datadog, LogRocket or equivalent: its
  script would need a D1 allowlist entry and a privacy review
  (WEB-Q-025), and DEC-017 refuses both.
- **Log discipline.** One structured JSON line per event, through a
  single logging facade. It carries route, status, error name, message
  and a request id. It never carries a request body, a query string, an
  IP address, or an e-mail address — the place someone searched for is
  exactly the identifier WEB-Q-020 promises not to keep. A13 is the gate.
- `global-error.tsx` (TS-004 D2) reports nothing outbound; the 500 page
  stays free of data dependencies.

## Free for the generator

- [FREE] Module layout under `lib/security/`, as long as D7's
  single-source rule holds for the policy itself.
- [FREE] Honeypot field name and the CSS technique that hides it, within
  D9's accessibility guard.
- [FREE] Rate-limiter implementation detail (edge rule vs. route
  handler), as long as D10's limits are observable from outside.
- [FREE] Field names in the D13 log schema, as long as the forbidden
  fields stay out.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-014-A1 | static | `lib/security/csp.ts` contains no `*`, no bare scheme in `script-src`/`connect-src`, no `'unsafe-inline'`/`'unsafe-eval'` in a production script directive; every host in it has a row in D1 and vice versa. |
| TS-014-A2 | integration | Every production response carries the D2 CSP and all D4 headers with exactly the specified values; no `vercel.json` header block exists; `next.*` carries the D5 preview variant plus `X-Robots-Tag: noindex, nofollow`. |
| TS-014-A3 | e2e | With CSP enforced, every page of the TS-004 D1 inventory loads with zero CSP violations — including the Portalize embed demo and the envoy widget, in all three TS-002 D4 themes. |
| TS-014-A4 | e2e | A script injected from a host outside D1 (test fixture) is blocked and produces exactly one report at `/api/csp-report`; the logged `document-uri` carries no query string. |
| TS-014-A5 | tool | securityheaders.com grade A and Mozilla Observatory ≥ 90 on the production origin [PROPOSED thresholds]; csp-evaluator reports no high-severity finding beyond the known `style-src` concession (D2). |
| TS-014-A6 | integration | `http://` on every production host answers `308` to its `https://` equivalent; HSTS present with the D4 `max-age` and without `preload`. |
| TS-014-A7 | static | No `http://` and no protocol-relative `//host/…` resource URL in source, content frontmatter, or config (prose links inside legal texts excluded). |
| TS-014-A8 | e2e | envoy widget: a submission with the honeypot filled, and one submitted faster than D9's floor, both return the normal success state and produce no lead in envoy (verified with the envoy side, Q-022). |
| TS-014-A9 | e2e | No captcha, challenge iframe, or third-party challenge script is present on any page or inside the widget — asserted on both the DOM and the network trace. |
| TS-014-A10 | integration | Each D10 route answers `200` below its limit and `429` with `Retry-After` beyond it; a cross-site `Origin` gets `403`; no BFF response carries an `Access-Control-Allow-Origin` header. |
| TS-014-A11 | tool | CI: a dependency with a known HIGH CVE, injected into the lockfile, fails the `Quality` job, and the production promotion does not start. An expired `.trivyignore` entry fails the job too. |
| TS-014-A12 | manual | Release check: Vercel Runtime Errors, the Observability 5xx panel and the uptime monitor all show the current deployment; no third-party error SDK appears in the bundle or in A3's network trace. |
| TS-014-A13 | static | No call site emits a request body, query string, IP address or e-mail through the logging facade (lint rule over the facade's typed signature). |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| WEB-Q-030 (enforced CSP, explicit allowlist from day one) | D1, D2, D3, D5 · A1, A2, A3, A5 |
| WEB-Q-031 (every allowlist change reviewed, no wildcard) | D1, D7 · A1 |
| WEB-Q-032 (site-wide security headers) | D4, D5 · A2, A5 |
| WEB-Q-033 (dependency scanning in CI, criticals block) | D12 · A11 |
| WEB-Q-034 (HTTPS everywhere, permanent redirect) | D8 · A6, A7 |
| WEB-Q-035 (honeypot + timing + rate limit, no captcha) | D9, D10 · A8, A9 |
| WEB-Q-036 (Vercel-native error and availability observation) | D6, D13 · A4, A12, A13 |

## Open points

- **D3 — nonce or hashes?** Does the HTML shell leave the full-route
  cache so a per-request nonce can be issued (Variant A, proposed), or
  does the site keep static ISR and carry per-build script hashes
  (Variant B)? The answer changes `script-src`, TS-004 D6 and the TS-003
  D1 budget. This is the one determination that blocks generation.
- **D1 — the envoy widget host (Q-022).** The widget is not built.
  Unconfirmed: its script origin (`envoy-api.api.schafe-vorm-fenster.de`
  is read from the repository, not stated by its owner), what it calls at
  runtime, and whether it styles its shadow root inline — the last would
  fix `style-src 'unsafe-inline'` in place. To be answered with the
  DEC-014 conformance question already in Q-022.
- **D1 — Portalize's runtime origins (Q-026).** The loader host is known;
  whether the web component then fetches from `assets.api.` or
  `calendar.api.` is not. Either would add a `connect-src` entry. Same
  question round as the cookie-freedom check.
- **D1 — eTracker's real request surface.** The legacy snippet loads
  `//code.etracker.com/code/e.js`; whether the beacon posts only there or
  also to `www.etracker.de` must be measured on the live legacy site
  before the list is frozen. Guessing costs either broken tracking or a
  needlessly wide allowlist.
- **D4 — HSTS `preload`.** `includeSubDomains` plus `preload` commits
  *every* `schafe-vorm-fenster.de` subdomain — `events.api.`, `geo.api.`,
  `classify.api.`, `assets.api.`, `portalize.`, `app.`, `next.` — to
  HTTPS permanently, and removal from the preload list takes months. Does
  every service owner accept that, and who submits the entry? Until
  answered, D4 ships without `preload`.
- **D10 — which rate limiter?** Vercel Firewall rate-limit rules are
  plan-dependent. If the team's plan does not carry them, the fallback is
  a KV-backed sliding window — a new runtime dependency. Does a KV store
  count as "an additional service" under DEC-017, or only a *tracking*
  service does?
- **D13 — runtime log retention.** Vercel keeps runtime logs for a short,
  plan-dependent window; an error nobody reads inside it is gone. Is that
  acceptable for launch, or does WEB-Q-036 need a log drain — and would a
  drain target itself be the additional service DEC-017 refuses?
- **D4 — the `frame-ancestors` app-embed exception.** WEB-Q-032
  anticipates "app-embed needs"; none is known today. Does
  `app.schafe-vorm-fenster.de` ever embed a website page in an iframe?
  Question to the product side; until answered, `'none'`.
- **D10 — the `429` surface.** DEC-032 defines 404 and 500; a
  rate-limited place search has no defined state. Does the place-search
  component own it, and does that copy belong to TS-004 or here?
