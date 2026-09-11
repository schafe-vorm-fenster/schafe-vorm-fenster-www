# Analytics — TS-012

Cookieless, banner-free measurement (D1), one event per hub conversion goal
(D4), through one module (D2). Nothing outside `src/lib/analytics` calls the
vendor — `boundary.test.ts` is what makes that a build failure, not a
convention.

## What runs today

`getAnalyticsTracker()` always returns the **mock** (`mock-tracker.ts`): it
logs to the console and records nothing — no cookie, no `localStorage`,
`sessionStorage` or IndexedDB write, no network call (plan/guardrails.md's
mock rule). The **real** eTracker adapter (`etracker-tracker.ts`) is written
against D2's loader contract but stays switched off until the eTracker
account and the D4-rule-4 field mapping are confirmed
(`state/open.md` row 12, Q-040). The one injection point is
`NEXT_PUBLIC_ETRACKER_REAL_ADAPTER=true` in `createTracker()`
(`index.ts`) — flipping it, once the confirmation lands, is the entire
hardening step. Nothing else in this module or in a page changes.

## How a page or CTA emits a goal event

1. Look the goal up in the registry (`event-registry.ts`) — it names the
   `stage` and confirms the surface is wired:

   ```ts
   import { conversionEvent } from "@/src/lib/analytics/event-registry";

   const event = conversionEvent("register-as-publisher");
   // event.stage === "handover"
   ```

2. Call `trackConversion` on the shared tracker, from the CTA's own click
   handler — never speculatively, never on render:

   ```tsx
   "use client";

   import { getAnalyticsTracker } from "@/src/lib/analytics";

   export function RegisterCta({ href }: { href: string }) {
     return (
       <a
         href={href}
         onClick={() => {
           // D9: fire-and-forget. Never preventDefault + delay the navigation.
           getAnalyticsTracker().trackConversion("register-as-publisher", "handover");
         }}
       >
         Jetzt registrieren
       </a>
     );
   }
   ```

3. Attributes carry no personal data and no free text (D4 rule 3) — a place
   slug is fine, a form value is not:

   ```ts
   getAnalyticsTracker().trackConversion("save-calendar-to-homescreen", "handover", {
     place: placeSlug,
   });
   ```

4. Fire once per completed trigger (D4 rule 2). A client-side route change
   back to the same CTA must not replay it, and a cancelled action must not
   fire it — gate the call on the same condition that gates the navigation,
   not on a render.

## Campaign attribution (`attribution.ts`, D6)

Read `etcc_cmp`/`etcc_med` off the entry URL and forward them, unchanged,
onto the one outbound link that crosses the measurement boundary (D5) — the
`app.*` handover. Never persist them (that would be the identifier D1
forbids); never let an internal link set them (D6 "who never sets them").

```ts
import { appendCampaignParams, extractCampaignParams } from "@/src/lib/analytics";

const campaign = extractCampaignParams(new URL(request.url).searchParams);
const handoverUrl = appendCampaignParams(baseAppUrl, campaign);
```

The companion canonical rule — a page's canonical strips every query
parameter, `etcc_*` included — is TS-011 D9 and lives in `src/lib/seo`, not
here.

## What is not built here

- **The suggestion banner (WEB-F-069, DEC-038/053).** `proxy.ts` exposes the
  raw `Accept-Language` signal as a `Server-Timing` entry
  (`src/lib/routes/locale-detection.ts`); a client-side, once-per-session UI
  that reads it and turns it into a link is deferred (Q-011) and not part of
  this work package.
- **The eTracker loader script.** `etracker-loader.tsx` exists and is
  documented at its own top, but is not mounted in the root layout while the
  real adapter is disabled (see above) — mounting it is a one-line addition
  once row 12 closes.
- **Field-mapping verification.** D4 rule 4's mapping of `stage` and the
  goal id onto eTracker's concrete event fields is [PROPOSED] in
  `etracker-tracker.ts` until the account confirms it (Q-040).
