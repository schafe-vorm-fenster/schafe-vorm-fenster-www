---
id: DEC-0177
title: Every link "to the app" goes to the Schlatkow village calendar until the app has its own domain; the retired app host leaves the code, the CSP and every rendered page
status: accepted
date: 2026-10-28
decided_by: jan-henrik.hempel
---

## Context

DEC-0035 planned the village calendars and the app on
`app.schafe-vorm-fenster.de`, and the code carried that host as `APP_ORIGIN`
in `src/lib/live/app-handover.ts`. DEC-0168 §5 moved the calendar links to the
host that actually serves them (community-site on the apex,
`<slug>.<geonameId>`) and kept `APP_ORIGIN` "for the registration and help
handovers, which are not calendar links".

Measured on 2026-10-27 (DEC-0168) and again on 2026-10-28:

| What | Answer |
| --- | --- |
| `dig app.schafe-vorm-fenster.de` | no record |
| `https://schafe-vorm-fenster.de/schlatkow.2838887` | 200 |
| `https://schafe-vorm-fenster.de/registrieren` | 404 |
| `https://schafe-vorm-fenster.de/hilfe` | 200 |
| `https://schafe-vorm-fenster.de/hilfe/kalender`, `/hilfe/einrichten` (`helpUrl()`'s two mocked paths) | 404 |

So every link still built on `APP_ORIGIN` pointed at a host that does not
resolve. The owner was asked where those links should go. **His answer, on
2026-10-28:** every link that goes "to the app" points to
`https://schafe-vorm-fenster.de/schlatkow.2838887` until the app has its own
domain.

## Decision

1. **One constant.** `APP_URL = "https://schafe-vorm-fenster.de/schlatkow.2838887"`
   in `src/lib/live/app-handover.ts` is the only link "to the app". It is a
   literal, not an environment value: a second source for the same link is
   how the dead host survived in four modules. `appUrl({ campaign })` adds the
   inbound campaign parameters (FUN-WEB-0048) and nothing else; no path is
   appended, because the app's registration entry has no contract (DEC-0029)
   and `/registrieren` on the apex answers 404. `APP_ORIGIN` is gone;
   `src/lib/routes/routes.ts` re-exports `APP_URL` instead.
2. **Registration handover.** The three-step flow's handover
   (`register-flow.tsx`, not rendered since DEC-0176 §5) is `appUrl()`.
   `TS-WEB-0023` D6's target row says so.
3. **Help.** `helpUrl()` answers `APP_URL` for every article. Its two
   per-article paths would answer 404, so `HELP_ARTICLE_MAP` is deleted rather
   than kept as a mock nobody calls (DEC-0047's amendment, `state/open.md`
   row 8). **Not changed:** the legacy `/hilfe` redirect of `redirect-map.ts`.
   It sends to community-site's own help, which answers 200; it is not a link
   to the app and needs no stand-in.
4. **Referrers.** `entry-context.ts` read the app host to classify a referrer
   as `activated` (TS-WEB-0010 D3). `APP_URL` is on our own apex, and a
   referrer from there is internal navigation, so the app-referrer half of
   the row is empty while the app has no host: `APP_HOST` is `undefined`, and
   `activated` comes from the newsletter medium alone.
5. **CSP.** The `app` entry leaves `ALLOWLIST` (`src/lib/security/csp.ts`) and
   `TS-WEB-0014` D1. It was a reserved row active in no directive; nothing
   uses it. The `frame-ancestors` exception now names "the app's own origin"
   without a host. `TS-WEB-0013` D2's Portalize row named the dead host for a
   loader that has always come from `portalize.schafe-vorm-fenster.de`; the
   row now names that host, which resolves one of the three divergences
   `scripts/check-csp-allowlist.test.ts` declared (`state/open.md` row 279:
   two remain).
6. **Guards.** `TS-WEB-0017-A11` (`pnpm check:api-routes`) is amended: the
   retired hostname occurs in the code of no authored module (comments may
   name it as history), and `APP_URL`'s literal occurs in the handover module
   only. The component gallery is no longer excepted; it imports `APP_URL`.
   **`TS-WEB-0017-A33`** is new (`e2e/app-links.spec.ts`): on every route in
   both languages, and on `/dein-ort` with a chosen place, no `href`,
   `action` or `src` names `app.schafe-vorm-fenster.de` after the live modules
   answered. It runs in the full suite (`pnpm e2e`), which DEC-0180 runs on
   demand; it is not added to `e2e:technical`, whose selection is DEC-0180's.
7. **It lapses** when the app moves to its own domain. Then `APP_URL` takes
   that origin (and a registration path, once DEC-0029 has a contract),
   `APP_HOST` takes its hostname, the CSP gets a row only if a directive needs
   one, and this record is superseded.

## Consequences

- Specs naming the dead host as where something runs or is linked are
  amended: `SSD-WEB-0001` scope, `TS-WEB-0008` D9 (an "App links" row),
  `TS-WEB-0010` D3, `TS-WEB-0011` D1, `TS-WEB-0013` D2 and the navigation
  note, `TS-WEB-0014` D1 and D4, `TS-WEB-0017` D4 and A11, `TS-WEB-0023` D6,
  DEC-0168 §5 (a superseded note), DEC-0047 (an amendment), CON-WEB-0030's
  note. Records that only tell history (DEC-0035, DEC-0037, DEC-0144,
  findings and plans) stay as written.
- `CON-WEB-0052` and `FUN-WEB-0131` no longer name the host in their
  statements. Their source, SRC-0001 line 25, still does; both carry a
  `Deviation:` line and **DEM-0076** asks the hub concept to follow.
- Tests that used the dead host as sample data now use `APP_URL` or the
  village calendar address (`attribution`, `link-target`, `entry-context`,
  `entry-handover`, `check-csp`, `dein-ort-starten`).
- No rendered page linked the dead host before this change either (measured
  on the production build at 390, 1280 and 1440 px on the main pages): the
  only live caller, the registration flow, has not rendered since DEC-0176.
  The change is to the code and the specs, and A33 keeps it that way.
