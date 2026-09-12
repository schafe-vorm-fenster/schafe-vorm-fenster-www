# Chaos Round 3 — Boundary Tester

**Source: chaos:boundary-tester**

Testing against: https://schafe-vorm-fenster-5jupiff6w-schafe-vorm-fenster.vercel.app (M5 preview, via `x-vercel-protection-bypass`)

Tools: curl (URL/BFF-level probes) and Playwright (Chromium, headless, `extraHTTPHeaders` carrying the bypass secret) for DOM/form-level probes.

## Session Scope

Re-ran every gate-2 boundary-tester observation (C-B-1…18) against the M5 preview, then probed the areas the run brief calls out as new since gate 2: `?ort=` grammar and its 307 hop, the ASSET_EXTENSIONS-driven 404 split, `/llms.txt`, `/start`, the BFF `/api/*` routes, and form fields at both locales.

Per the persona brief: React escapes output by default, so an accepted `<script>` value is only logged as a defect where reflection into rendered HTML is proven. Every XSS probe below was checked for both execution (a `window.__x` flag) and raw-tag presence in `document.body.innerHTML` — none reflected, so C-B-3/C-B-4 are dismissed below rather than carried forward.

---

## Gate-2 observations re-run

| id | gate-2 finding | M5 result | status |
| --- | --- | --- | --- |
| C-B-1 | Place/PLZ search field accepts 10,000 chars, no `maxlength` | `/`, `/mitmachen/registrieren` PLZ field: `maxlength="80"` enforced; a 10,000-char fill truncates to 80 chars in the DOM | **fixed** |
| C-B-2 | Name field accepts 10,000 chars, no `maxlength` | `/mitmachen/registrieren` and `/deine-region/angebot` Name/E-Mail fields: `maxlength="120"` enforced | **fixed** |
| C-B-3 | XSS payload stored unescaped in place search field | `<script>…</script>` filled into the home/registrieren search field: does not execute, not present raw in `document.body.innerHTML` (React escapes on render; the value only ever lives in the controlled input's `.value`) | **dismissed — no reflection proven** |
| C-B-4 | XSS payload stored unescaped in name field | `<img src=x onerror=…>` filled into the Kontakt-Name field: does not execute, not present raw in `innerHTML` | **dismissed — no reflection proven** |
| C-B-5 | Foreign ZIP "1010" (Austria) accepted without rejection | Still accepted verbatim by the search input; no client-side country check | **reproduces** |
| C-B-6 | `/en/dein-ort` returns 200 instead of 404/redirect (F-2-8) | `curl -I /en/dein-ort` → `HTTP/2 200` | **reproduces** |
| C-B-7 | `/EN/DEIN-ORT` → 404 (working as designed) | `HTTP/2 404` | unchanged |
| C-B-8 | `/en/nonexistent-page` → 404 | `HTTP/2 404`; body now confirmed to render the full `global-not-found` page (`<h1>Seite nicht gefunden</h1>` literally in HTML), not an empty shell | unchanged / confirmed healthy |
| C-B-9 | 500-char slug → 404 | `HTTP/2 404` | unchanged |
| C-B-10 | `?ort=garbage&<script>=alert` query garbage silently ignored, 200 | Now **307** → `/dein-ort/starten?ort=garbage` | **behavior changed** — expected: this is the new DEC-070 `?ort=` re-resolution hop (`place-hop.ts`), not a regression |
| C-B-11 | Emoji in name field accepted | Still accepted | unchanged |
| C-B-12 | RTL Arabic text in name field accepted | Still accepted, no `dir` attribute | unchanged |
| C-B-13 | Surrogate-pair Unicode accepted | Not re-driven this round (no code path touched it); no reason to expect a regression | not retested |
| C-B-14 | Umlauts in multiple positions accepted | Not re-driven this round | not retested |
| C-B-15 | `%00` in email field accepted, `type="email"` present but not strict | `test%00@example.com` still accepted; `checkValidity()` → `true` (HTML5 email pattern treats the literal `%00` text as valid local-part characters) | **reproduces** |
| C-B-16 | DE→EN language switch links to equivalent page | Navigated both `/mitmachen/registrieren` and `/en/take-part/register` directly; both render distinct, correct content | unchanged (not re-driven via the footer link this round) |
| C-B-17 | EN→DE language switch works | Same as above | unchanged |
| C-B-18 | Submit button present and labeled ("Absenden") | Confirmed present on both `/mitmachen/registrieren` and `/deine-region/angebot`; on `/deine-region/angebot` it now visibly triggers native HTML5 `required` validation ("Please fill out this field.") when clicked with empty fields | unchanged / confirmed healthy |

---

## New observations — C3-B-*

### C3-B-1 — 404 for a non-existent asset-extension path serves the empty-shell document (F-2-70 pattern, via a different door)

- **Where:** any path ending in one of `ASSET_EXTENSIONS` (`landing-domain.ts` row ~34) that does not correspond to a real file — reproduced on `/favicon.ico`, `/does-not-exist.js`, `/nope.css`, `/nope.png`, `/robots.txt.map`
- **Steps:** `curl -H "x-vercel-protection-bypass: …" https://…vercel.app/favicon.ico`
- **Observed:** `HTTP/2 404`, `content-type: text/html`, body is `<html id="__next_error__">…` (~11.9 KB) containing only `<link rel=preload>`/`<script>` tags and a React Flight payload; no literal `<h1>` anywhere in the raw HTML. The visible "Seite nicht gefunden" / "Diese Adresse gibt es…" text exists only serialized inside a `self.__next_f.push([...])` script string, not in the rendered DOM.
- **Contrast:** `/dies-gibt-es-nicht`, `/.well-known/does-not-exist`, and `/en/nonexistent-page` all return the full styled page with a literal `<h1>Seite nicht gefunden</h1>` in the HTML — the F-2-70 fix works for those.
- **Why:** `isUnservablePath()` (`not-found-routing.ts`) and `landingDomainBlocks()` both call `isAssetPath()` first and return `false` (i.e. "servable, leave it alone") for anything ending in an asset extension, regardless of whether a matching file actually exists. That path falls through to Next's own 404 handling instead of the `NOT_FOUND_PATH` rewrite that `global-not-found.tsx` renders fully — reproducing exactly the empty-document defect F-2-70 fixed for ordinary unknown paths.
- **Notably:** this project currently ships no `public/favicon.ico` and no `app/icon.*` at all (checked — no `public/` dir, no `app/**/icon*`), so this is not a hypothetical: every browser's automatic `GET /favicon.ico` on every single page load hits this exact bug today.
- **Source:** chaos:boundary-tester

### C3-B-2 — Empty or garbage postcode search on the registration flow gives no feedback

- **Where:** `/mitmachen/registrieren` and `/en/take-part/register`, the "Postleitzahl" / "Postcode" search field (Schritt 1 von 3)
- **Steps:** click "Suchen"/"Search" with the field empty; separately, fill it with 10,000 × "A" (truncated to 80 by the new `maxlength`) and click "Suchen"
- **Observed:** in both cases the page silently re-renders itself with `?ort=` (empty, or the 80-char garbage string) appended to the URL. No validation message, no "not found" state, no visible change at all — `element.validationMessage` is empty (the field carries no `required`), so the browser's native validation never engages either.
- **Contrast:** the same uncovered-value case on the primary flow, `/dein-ort?ort=99999` → 307 → `/dein-ort/starten?ort=99999`, renders a designed empty state ("99999 steht noch nicht im Dorfkalender." + a call to action). The registration widget's own search has no equivalent for either "empty" or "not found".
- **Source:** chaos:boundary-tester

### C3-B-3 — Repeated `?ort=` parameters silently collapse to the first value

- **Where:** `/dein-ort?ort=Berlin&ort=Hamburg&ort=Muenchen`
- **Steps:** `curl -I ".../dein-ort?ort=Berlin&ort=Hamburg&ort=Muenchen"`
- **Observed:** `HTTP/2 307` → `Location: /dein-ort/starten?ort=Berlin` — only the first repeated value survives into the hop; `Hamburg` and `Muenchen` are dropped with no error. `?ort[]=foo&ort[]=bar` (array syntax) and a 10,000-char value both fall through to a plain `200` (grammar drops them per `place-hop.ts`'s own documented behavior) — those are not findings, listed here only as confirmation the grammar holds.
- **Source:** chaos:boundary-tester

### C3-B-4 — The BFF on this preview runs in demo/mock mode

- **Where:** `/api/places/search`, `/api/nearby`, `/api/stats`, `/api/region/*/examples`
- **Observed:** every response envelope carries `"demo":true`. `/api/region/..%2F..%2Fetc%2Fpasswd/examples` (a path-traversal-shaped county value) returns `HTTP 200` with fixture town names (`Beispielgemeinde Musterdorf`, `Beispielwalde`, `Musterbach`, …) rather than an error — the traversal string is treated as an opaque, unmatched county and the endpoint answers with its canned demo set. Not a security issue (no real filesystem/geo-api access happens), but it means none of this round's BFF probing exercised real upstream/geo-api error paths — worth the gate knowing before this is called "tested against live data".
- **Source:** chaos:boundary-tester

### C3-B-5 — `/start` 302-redirects off-site to a Google Form

- **Where:** `GET /start`
- **Observed:** `HTTP/2 302` → `Location: https://docs.google.com/forms/d/e/1FAIpQLSdO5AlaOpDWGwukrIge-qPvXAeiEVMgEwAViC-CmvkWLAjL3g/viewform`
- **Note:** flagging only because a bare, memorable path redirecting to an external, un-branded Google Forms URL is an easy thing to leave behind by accident from an earlier campaign; if intentional, no action needed — but worth a second pair of eyes given `/start` is exactly the kind of URL that ends up on a printed flyer.
- **Source:** chaos:boundary-tester

---

## Clean / no defect (explicitly probed, holds up)

- `?ort=` grammar under junk — 10,000 chars, `%00`, `../` path-traversal-shaped values, unicode/emoji, `ort[]=` array syntax — all fall through to a plain `200` with no hop, no error, no crash (matches `place-hop.ts`'s documented "grammar drops it" behavior).
- `?ort=` hop loop test — walked a real covered value both directions (`/dein-ort/starten?ort=beispielwalde` → `/dein-ort?ort=beispielwalde`, and the reverse with an already-canonical slug fed back into `/starten`) and in every case it settled after exactly one hop; no ping-pong found.
- 404 shape coverage — `.well-known/*`, encoded slashes (`%2F`, `%252F`), double-encoded traversal, 5,000-char paths, uppercase paths — all a clean `404` with no raw stack trace.
- `/llms.txt` — `200`, `text/plain; charset=utf-8`, well-formed Markdown listing.
- BFF error shapes — every 400/404 tried (`q` missing, `q` at 10,000 chars, `lat`/`lng` missing or non-numeric, unauthenticated request) returns a small, single-field JSON body (`{"error":"…"}`), 25–36 bytes, no stack trace, no framework banner. `radius=999999` on `/api/nearby` is clamped to the 15 km default rather than erroring.
- No `500` observed anywhere in this session, curl or browser.
- One incidental console finding: Vercel's own `vercel.live/_next-live/feedback/feedback.js` toolbar script is blocked by this site's CSP (`script-src` has no `https://vercel.live`) — the site's own strict CSP is working as intended, but it means Vercel's live-feedback overlay can't load on this preview; not a site defect, noting in case it surprises whoever is using the preview toolbar.

---

## Session Completion

**Probes run:** 18 gate-2 re-runs + roughly 40 new curl/browser probes (query-grammar junk, hop-loop check, 404 shape matrix, `/llms.txt`, `/start`, 5 BFF routes, form max-length/empty-submit/XSS-reflection checks on both locales).

**Gate-2 items still reproducing:** C-B-5 (foreign ZIP accepted), C-B-6 (`/en/dein-ort` → 200, F-2-8), C-B-15 (`%00` in email accepted). C-B-1 and C-B-2 are fixed (maxlength now enforced at 80/120). C-B-3 and C-B-4 are dismissed — retested for reflection specifically, found none.

**Three most striking new observations:**

1. **C3-B-1** — every browser's automatic `/favicon.ico` request (and any other guessed asset-extension URL that doesn't exist) hits the exact empty-`__next_error__`-shell bug that F-2-70 was written to fix, because the asset-extension exemption skips the fix's rewrite unconditionally, whether or not the file exists.
2. **C3-B-2** — the registration flow's own postcode search has no empty/not-found feedback at all, in sharp contrast to the well-designed empty state on the same value one click away on `/dein-ort`.
3. **C3-B-4** — the whole BFF answers from demo/fixture data on this preview (`"demo":true` on every envelope), so none of this round's `/api/*` probing exercised real upstream error handling — a scope gap the gate should know about, not a defect in itself.

**No raw error/stack trace or 500 encountered** in curl or browser probing this round.
