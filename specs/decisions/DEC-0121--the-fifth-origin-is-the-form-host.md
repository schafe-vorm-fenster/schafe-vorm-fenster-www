---
id: DEC-0121
title: The fifth origin is the form's host, in `frame-src` alone — `/start` frames it with `?embedded=true`, and the notice above it is a placeholder until the owner words it
status: DRAFT
date: 2026-09-25
decided_by: the engineering team
---

## Context

`DEC-0108` decided that the registration form stays visibly embedded on
`/start` with a notice above it, and `TS-WEB-0016 D15`/`D17` are the
determinations. Both left the implementation with open choices, and one of
them was recorded as a debt: *"the form host has no row in `TS-WEB-0013 D2`
and no entry in the CSP allowlist (`TS-WEB-0014 D1`)"*, so `TS-WEB-0013-A1`
and `-A4` failed on the route rather than merely lacking it. `TS-WEB-0014 D1`
said there was *"no room"* for a fifth origin; `TS-WEB-0004 D1`'s `/start` row
was `kind: redirect`, status 302, in the inventory module and in every test
that walks it; `csp.ts` said `frame-src 'none'`.

Task T-09 of the 2026-09-25 build turned the redirect into the page. This
record holds every choice the specification left open on the way, so that
none of them lives only in a code comment.

## Decision

### 1. The fifth origin is `https://docs.google.com`, in `frame-src` and nowhere else

`ALLOWLIST.googleForms` in `src/lib/security/csp.ts` is the origin of the
form — **the origin, not the form's path.** `TS-WEB-0014 D1` is a table of
origins and `check-csp.ts` matches allowlist entries as whole tokens; a
path-scoped source (`https://docs.google.com/forms/`) would have been tighter
by one directory and would have made the allowlist the second place that
knows the form's URL. The URL stays `src/lib/routes/lead-fallback.ts`'s.

It is active in `frame-src` only. No script, no connection and no image of
that host is loaded by our document, and `csp.test.ts` asserts the host
appears in no other directive. `child-src` stays `'none'`: it is the fallback
for `frame-src` and `worker-src` only where those are absent, and both are
named, so it governs nothing and stays as the floor. The Portalize host is
still no `frame-src` source, so DEC-0030's pin — its iframe fallback fails
loudly — holds unchanged.

The row is written **on both sides at once**, as `TS-WEB-0013 D2` demands
("one set seen from two sides"): `TS-WEB-0014 D1` gains the row and its
"four origins, no fifth" sentence becomes "and a fifth, no sixth";
`TS-WEB-0013 D2` gains the row; `TS-WEB-0014 D2`'s written-out policy and its
choice table take the new `frame-src` line; `TS-WEB-0016 D15`'s CSP row stops
saying "owed". The open point on `TS-WEB-0013` that recorded the debt now
records what remains open instead (§6).

### 2. The `iframe` source is the configured form with `?embedded=true`

`leadFormEmbedUrl()` takes `leadFallbackUrl()` — `LEAD_FALLBACK_URL` when
configured, the built-in `viewform` URL otherwise — and sets `embedded=true`.
That is Google Forms' own parameter, the one its share dialog writes into the
embed snippet: it drops the host page's chrome (Google's header and footer)
so the frame carries the form and nothing else. A `viewform` URL without it
renders inside the frame as a whole Google page.

**Only a URL on the allowlisted origin is framed.** `frame-src` names one
origin, so a configured `LEAD_FALLBACK_URL` anywhere else would be a frame the
browser refuses — an empty box where the registration should be, on the one
route that is the only registration. Such a value falls back to the built-in
form. The swap D15 foresees (envoy, or the app's own registration entry) is a
route change — `/start` becomes a redirect again, or disappears — never a
value that turns this embed into a frame of an unknown host. `leadFallbackUrl`
itself keeps its old open-redirect guard and its old acceptance of any
`https:` URL, so a link surface can still name the canonical `viewform` URL.

### 3. `/start` is a page with its own root layout, German, chrome-less, `noindex` unconditionally

`app/start/` sits outside `app/[lang]` and has no language segment, so it
cannot share the `[lang]` root layout. It gets a small one: `<html lang="de">`,
`body`, the two stylesheets, nothing else. No site header, breadcrumb, footer,
newsletter entry, skip link or analytics loader — the route embeds a third
party and measures nothing (D15), and a chrome-less document is what makes
TS-WEB-0012-A2's "*the form host is the only origin contacted beyond our
own*" true by construction rather than by filtering. German only: the form is
German and the route has no locale to read; the `en` dictionary entries exist
for key parity and never render.

`robots: noindex, nofollow` is set in the page's own metadata in every
environment. The `[lang]` layout adds `robots` only off production, because
those pages are meant to be indexed there; this one never is (`TS-WEB-0004 D1`).
The proxy's `X-Robots-Tag` still covers every non-production response on top.

The page heading is `pages.register` ("Registrieren") and the e-mail line's
lead is `lead-fallback.tsx`'s own "oder per E-Mail:" — both existing wording,
reused verbatim (working rule 4). The e-mail address is the same constant
`app/[lang]/_chrome.tsx:75` reads, row 4 of the hub's `contact-channels.md`;
it moves onto T-01's generated `src/generated/contact-channels.json` (the
owner's default for this build, recorded in T-01's own decision record) when
that lands, together with the chrome's copy.

### 4. The notice's words are placeholders, marked `data-demo="true"`

`D17` fixes the three facts and the link target and says the wording is the
content phase's; DEC-0108 §2 says *"not here"*. Nobody has written it. The
owner's default for this build is that chrome strings nobody wrote ship as
dictionary strings marked `data-demo="true"` with a `state/open.md` row each
— the repository's placeholder convention (DEC-0068, `validate.ts:112-133`)
applied to chrome. So `start.notice` and `start.noticeLink` (rendered as one
paragraph carrying the marking) and `start.frameTitle` (the `iframe`'s
accessible name, the marking on the frame) are placeholders — `state/open.md`
rows 215 and 216 — and the owner's wording replaces them. The placeholder
sentences state the three facts and nothing else. The heading and the
e-mail lead are not placeholders (§3).

The notice is a `<p>` with a `data-block="embed-notice"` hook and one link.
No `role`, no button, no checkbox, no `aria-controls`: `D17` says a notice
that can be clicked is a consent gate with a different label.

### 5. The frame carries no `sandbox`

The form needs scripts, its own origin's storage and form submission to work
at all. A `sandbox` that grants `allow-scripts allow-same-origin allow-forms`
fences nothing that matters and adds a failure mode (a Google-side change to
what the form needs breaks the only registration silently). The isolation
the site relies on is the CSP's `frame-src` and the browser's origin model,
not a sandbox flag. The frame is eager (`loading="eager"`): the visitor came
for the form.

### 6. What "contacted" means in the trace, and what stays open

`e2e/privacy.spec.ts` walks the 24 page rows against the D2 set **minus** the
form host — TS-WEB-0012-A2 is stricter than D2 there ("no request goes to a
host outside the D7 collectors") — and on `/start` asserts that every request
**our document** issues is own-origin and that the one framed navigation goes
to the form host and no other. What the framed document then loads on its own
(fonts, scripts from other Google hosts) is that document's business: outside
the CSP's reach — `frame-src` governs the frame's navigation, not its
subresources — and outside the criterion's clause about *our* requests. The
trace records that the page contacted one third party; it does not audit that
third party's page.

Still open, and not this record's to close: whether Google sets a persistent
identifier inside the frame (DEC-0108 §4, `DEM-0066`), and the host's named
section on `/rechtliches#datenschutz` (`TS-WEB-0013-A7`), which is the legal
import's (`TS-WEB-0029`).

### 7. The inventory row

`/start` is `kind: "page"`, status 200, without a `routeId`, in
`D1_NON_REGISTRY_ROWS` (the constant was `D1_NON_PAGE_ROWS` while the row was
a redirect). `D1Kind` loses `"redirect"` and `D1Row.status` is `200` only —
D1 has no redirect row left. The route walk resolves a page row without a
registry id to `app/<path>/page.tsx`.

## Consequences

- `csp.ts`: `googleForms` in `ALLOWLIST`, `frame-src` names it; `check-csp`
  passes it through the existing D1-host rule; `csp.test.ts`,
  `check-csp.test.ts` and `e2e/smoke.spec.ts` assert the new value.
- `lead-fallback.ts`: `leadFormEmbedUrl()`, `LEAD_FORM_ORIGIN`; the old
  `leadFallbackUrl()` stays.
- `app/start/route.ts` is gone; `app/start/{layout,page}.tsx`,
  `start.module.css`, `page.test.ts` replace it.
- `url-inventory.ts`, its test, `routing.integration.test.ts`,
  `e2e/routes.spec.ts` follow the row; `e2e/start.spec.ts` is TS-WEB-0016-A22
  in the browser; `e2e/privacy.spec.ts` carries the `/start` exception.
- `dictionary.ts` gains `start.*` (four keys, both languages).
- Spec edits, all in STRICT form, no id renumbered: `TS-WEB-0013 D2` (row,
  the eTracker row's "only external company" qualified, the open point),
  `TS-WEB-0014 D1` (sentence and row), `D2` (the `frame-src` line and its
  choice row), `TS-WEB-0016 D15` (the CSP row). Nothing moved off `DRAFT`.
- `state/open.md` rows 215 and 216: the two placeholders.
- Not done here: `TS-WEB-0004 D1`'s prose below the table still says
  *"`/start` is the only row that is not a page"* — T-08 owns that file's
  edits in this build; the sentence is stale and is reported, not touched.
