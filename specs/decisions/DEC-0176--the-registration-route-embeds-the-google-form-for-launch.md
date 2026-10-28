---
id: DEC-0176
title: For the launch, /mitmachen/registrieren embeds the Google Form the live site uses; the three-step flow is kept in the code but not rendered, and its criteria are suspended until the app's registration entry has a contract
status: accepted
date: 2026-10-27
decided_by: jan-henrik.hempel
---

## Context

The owner's review of 2026-10-27, `/mitmachen/registrieren` (issue #109):

> Wir müssen erst mal das Google Formular einbetten, wie es online ist. Das ist
> zwar nicht schön, aber damit können wir online gehen.

`TS-WEB-0023` specifies the route as three questions (place · who publishes ·
publishing path) and a handover to the app's registration entry. That entry
has **no contract** (D6, DEC-0029, DEM-0034): the handover link points at a
path nobody has agreed, and nothing a visitor answers crosses to the app. So
the flow cannot register anybody. The only registration that works is the
Google Form, which the live site embeds on its own `/start` and which this
site already embeds on `/start` (`TS-WEB-0016` D15, DEC-0108, DEC-0121).

`TS-WEB-0023` D9 forbade exactly this ("no embed, no iframe, no third-party
script here"), `TS-WEB-0016` D15 scoped the embed to `/start` alone, and
`TS-WEB-0013` D2 / `TS-WEB-0014` D1 wrote the form host's rows for that one
route. None of them anticipated that the registration route itself would
need the form for the launch.

**Which form.** Measured on 2026-10-27: the live site
<https://www.schafe-vorm-fenster.de> links "/start", and the HTML of
`https://www.schafe-vorm-fenster.de/start` carries one `iframe` with
`src="https://docs.google.com/forms/d/e/1FAIpQLSdO5AlaOpDWGwukrIge-qPvXAeiEVMgEwAViC-CmvkWLAjL3g/viewform?embedded=true"`,
`width="640" height="1900"`. The form id is the one
`src/lib/routes/lead-fallback.ts` holds (`GOOGLE_FORM_URL`), so the route reads
that module and no second URL exists anywhere.

## Decision

1. **The route embeds the form, for the launch.** `/mitmachen/registrieren`
   and `/en/take-part/register` render, inside the site chrome: the heading
   (`pages.register`); the notice of `TS-WEB-0016` D17 with `/start`'s words;
   a link that opens the same form in a new tab; the `iframe` of
   `leadFormEmbedUrl()` (the configured form with Google's own
   `?embedded=true`); then the context band, as on the flow's step 1. It is
   `TS-WEB-0023` **D10**. The route stays indexable and in the sitemap — it is
   a page of the site, not `/start`'s `noindex` side door.

2. **The frame.** It carries a `title` (`start.frameTitle`, the `/start`
   placeholder), is the container's full width up to Google's 640 px card,
   and has a **reserved, fixed height** set in the stylesheet before the form
   arrives, so nothing below it moves when the form paints. The height is
   chosen so the frame shows no scrollbar of its own on any of the form's
   four pages: measured against the live form on 2026-10-27, its tallest page
   ("Deine Daten", eight questions, required-field errors showing) is
   2289 px at a 288 px wide frame, 2159 px at 358 px, 1851 px at 600 px and
   1819 px at 640 px. So **2300 px below the 40rem breakpoint, 1900 px from
   it on** — the latter is the live site's own value. The cost is white space
   under the short pages, which the live site has too. A frame cannot size
   itself to a cross-origin document: Google Forms posts no height message.

3. **The fallback link.** `OutboundLink` (the site's one outbound-link
   component, `TS-WEB-0016` D16), recipient Google, so its marking stands
   under it; it opens a new tab because its target is another origin
   (DEC-0169, `TS-WEB-0016` D18); target `leadFormOpenUrl()` — the framed form
   without `embedded`, derived from the same value so the link and the frame
   cannot name two forms. It stands **above** the frame: a visitor whose
   browser refuses the frame meets it before the empty box.

4. **Measurement — what is tracked, and what cannot be.**
   - `register-as-publisher`, `stage: handover`, with `via: "embedded-form"`,
     **once per page view, on the visitor's first navigation inside the
     form**: a `load` of the frame while the frame holds the focus. The
     initial load never counts — nobody is in the frame — and the rule does
     not depend on when hydration happened.
   - The same event with `via: "new-tab"` on a click of the fallback link.
   - **Not tracked: the submission.** The form is cross-origin and Google
     Forms reports nothing to the host page — no message, no readable URL. A
     load count could guess at "Senden" (the form has four pages), but Back
     reloads the frame too, so a count is not a submission and it is not
     emitted as `completed`. The page view itself is the analytics loader's
     page view, as on every route. `publish-first-event` stays the app's.
   - This is the `TS-WEB-0012` D4 row of the goal, amended; `/start` keeps
     "Measurement: nothing" (`TS-WEB-0016` D15).

5. **The flow is kept, not rendered.** `flow-page.tsx` is the flow's page
   composition as it stood; `register-flow.tsx`, `steps.ts` and
   `resolve-place.ts` stay, and their unit tests still run. Bringing the flow
   back is one import in `page.tsx`. It is **not** reachable under another
   path or parameter: `TS-WEB-0004` D1's inventory is closed, and a hidden
   route would be a page nobody specified. Its e2e walk
   (`e2e/pages/registrieren.spec.ts`, `e2e/registrieren-empty.spec.ts`) is in
   git history at `f91d4be`, the base of this change. Links into the route
   keep their `?ort=`: the page ignores it, the canonical drops it, and no
   prefill of the form is attempted (DEC-0029's "nothing crosses" holds for
   Google as it does for the app).

6. **It lapses** with `TS-WEB-0016` D15's own trigger: when the app's
   registration entry gains a contract (DEC-0029) — then the flow returns and
   the embed goes — or when the envoy widget lands (Q-0022).

## Consequences

- **`TS-WEB-0023`**: D10 is new; D1's `liveModules` row reads "none while D10
  stands"; D2–D8 are suspended, not deleted; D9's "no embed, no iframe" is
  amended by D10; A12 is amended (the frame's navigation is the one request
  that is not a D5 read route). **A17–A22 are new**, each with its test:
  frame src/title/visibility (A17), reserved height and no inner scrollbar
  (A18), notice above the frame (A19), the new-tab fallback link (A20), zero
  CSP violations with the frame loaded (A21), the frame's handover event
  (A22). **A1–A11, A13 and A15 are suspended** with the flow; their rows are
  left as written so they read correctly when the flow returns.
- **`TS-WEB-0016`** D15's scope row and A22 name the second route;
  **`TS-WEB-0013`** D2's form-host row and **`TS-WEB-0014`** D1's `frame-src`
  row say "on `/start` and `/mitmachen/registrieren`"; **`TS-WEB-0012`** D4's
  row of the goal and A2 name the route. No CSP change: `frame-src` already
  names the form host on every document (`src/lib/security/csp.ts`).
- The residual risk `TS-WEB-0016` D15 accepted for `/start` (DEM-0066: a third
  party contacted without the visitor acting, no legal determination that it
  needs no consent) now stands on a second route, and on one that is linked
  from the site's main paths. It is the same risk, accepted by the owner's
  instruction in #109, and DEM-0066 stays open.
- **Coverage budget.** `specs/verification/coverage-budget.json` `MISSING`
  moves **136 → 144**: the eight e2e criteria of the flow whose only
  instrument was its walk — A1, A2, A7, A8, A9, A11, A13, A15 — have no
  rendered page to be tested against while D10 stands, so their tests went
  with the walk. (A3 and A10 were already missing; A4, A5, A6 keep their unit
  and integration instruments, because the code they test is still here.)
  The six new criteria arrive verified.
- `TS-WEB-0006` D1's live-module floor: the route declares none while the
  flow's place search is not rendered — on the exception list beside
  `/dein-kalender/bestellen` (`src/lib/pages/manifests.ts`).
- Placeholder: the fallback link's label (`start.openForm`) is engineer's
  wording, marked `data-demo="true"`, `state/open.md` row 292.

## Amendment 2026-10-28 — the three placeholder strings are written

The owner, asked whether the route's three stand-in strings were his to
write: „musst du das nicht umsetzen?" — yes. They are written from facts
that already exist, against the copy guide (`du`, short words, one fact per
sentence, CG-026 for the label, no dash joins, no AI tells), in German and
its English mirror (CG-041), and the `data-demo` marking leaves the three
elements on `/mitmachen/registrieren`, `/en/take-part/register` and `/start`.

| Key | Before | After |
| --- | --- | --- |
| `start.notice` (de) | „Dieses Anmeldeformular stellt Google bereit. Beim Laden dieser Seite werden Daten an Google übertragen." | „Google stellt das Formular bereit und bekommt beim Laden der Seite deine IP-Adresse und Angaben zu deinem Browser." |
| `start.noticeLink` (de) | „Mehr dazu in den Datenschutzhinweisen." | „Zur Datenschutzerklärung." |
| `start.frameTitle` (de) | „Anmeldeformular bei Google Forms" | unchanged, now final |
| `start.openForm` (de) | „Formular direkt bei Google öffnen" | „Formular direkt öffnen" |
| `start.notice` (en) | "This registration form is provided by Google. Loading this page sends data to Google." | "Google provides the form and receives your IP address and details about your browser when the page loads." |
| `start.noticeLink` (en) | "More in the privacy notice." | "Read the privacy policy." |
| `start.frameTitle` (en) | "Registration form at Google Forms" | "Registration form on Google Forms" |
| `start.openForm` (en) | "Open the form directly at Google" | "Open the form directly" |

**Why these facts and no more.** `TS-WEB-0016` D17 asks for three facts:
whose form it is, that loading contacts that party, where the detail is.
What a cross-origin frame request carries is the visitor's IP address and the
browser's request headers (user agent, language); the frame loads eagerly
with the page (`loading="eager"`). That is what the notice says. It claims
nothing about cookies or about what Google does with the request: that is
unverified (DEM-0066 is open) and a notice states what happens, not a guess.
`content/legal/privacy-policy.md` (imported from the owner's Google Doc) has
**no section on Google Forms**, so the link names the privacy policy and
promises no "more on this"; the missing section is `TS-WEB-0013-A7`'s and
the owner's, recorded in `state/open.md` row 223.

The label drops "bei Google" because the marking under the link already
says „Daten gehen an Google" (`TS-WEB-0016` D16): the recipient once, in
its own line (CG-015, CG-026; 22 characters).

`state/open.md` rows 223, 224 and 292 are closed. The same pass closed
rows 216, 218 and 243, whose content a sourced fact already determined.

