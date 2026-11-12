# Analytics — TS-WEB-0012, DEC-0218

Cookieless, banner-free measurement (D1) through one module (D2): page views
on every page, one event per hub conversion goal (D4), and one click event per
CTA (D4 click layer, DEC-0218). Nothing outside `src/lib/analytics` calls the
vendor — `boundary.test.ts` is what makes that a build failure, not a
convention.

## The switch

`NEXT_PUBLIC_ETRACKER_SECURE_CODE` (`config.ts`) is the only one.

| Variable | Loader | `getAnalyticsTracker()` |
| --- | --- | --- |
| set (code-shaped) | mounted on every page of `app/[lang]` and the 404 | the real adapter (`etracker-tracker.ts`) |
| unset | none, no request | the mock (`mock-tracker.ts`): logs to the console, records nothing |

The value lives in the Vercel project, never in the repository. `/start`
never mounts the loader (TS-WEB-0016 D15).

## Files

| File | Job |
| --- | --- |
| `etracker-analytics.tsx` | the client component the layouts mount: loader, page view per route change, the delegated CTA click listener |
| `etracker-loader.tsx` | the `<script id="_etLoader">` tag; `data-page-changed-detection="off"` because the router hook counts navigations |
| `page-view.ts` | `et_pagename` / `et_areas` from route id and language (`de/calendar/order`, `de/calendar`) |
| `cta-event.ts` | which click is a CTA and what its event is called — the CTA → event table |
| `event-registry.ts` | the D4 conversion goals, one row per hub goal id |
| `tracker.ts` | `getAnalyticsTracker()`, the one factory |
| `etracker-tracker.ts` · `mock-tracker.ts` | the two implementations of `types.ts` |
| `attribution.ts` | `etcc_*` campaign parameters (D6) |

## Event names

| Event | category | action | object | type |
| --- | --- | --- | --- | --- |
| CTA click | goal id the target serves, `navigation`, `outbound` | `click` | `<target>.<rank>` (`order.primary`, `whatsapp.secondary`) | page name |
| conversion | goal id | `handover` / `completed` | attributes (`channel=whatsapp;route=calendar`) or the goal id | page name |

The target → category table is in `cta-event.ts` and TS-WEB-0012 D4.

## A new CTA

Nothing to do: give it its `data-cta` rank (`primary`, `secondary`,
`repeat`, `equal-weight`; TS-WEB-0006 D3) as every CTA already has, and the
listener names its click from the target. An outbound link needs not even
that. A target the table does not know yet becomes `navigation` (internal)
or `outbound` (external) until a row is added to `cta-event.ts`.

## How a page or CTA emits a goal event

The conversion events of D4 are unchanged — one per completed trigger:

```tsx
"use client";

import { getAnalyticsTracker } from "@/src/lib/analytics/tracker";

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

A server component wraps its CTA in `ConversionTracker`
(`src/components/conversion-tracker`) instead. Attributes carry no personal
data and no free text (D4 rule 3). Fire once per completed trigger (rule 2):
gate the call on the same condition that gates the navigation, not on a
render.

## Campaign attribution (`attribution.ts`, D6)

Read `etcc_cmp`/`etcc_med` off the entry URL and forward them, unchanged,
onto the one outbound link that crosses the measurement boundary (D5). Never
persist them; never let an internal link set them.

```ts
import { appendCampaignParams, extractCampaignParams } from "@/src/lib/analytics";

const campaign = extractCampaignParams(new URL(request.url).searchParams);
const handoverUrl = appendCampaignParams(baseAppUrl, campaign);
```

## Open

- **Account check (Q-0040, `state/open.md` row 12):** how the four event
  fields and the page names appear in the eTracker reports.
- **First preview with the real code:** confirm the CSP admits every request
  the account's loader makes, and that it writes no web-storage identifier
  (TS-WEB-0012-A2).
- **The suggestion banner** (FUN-WEB-0168, Q-0011) is not built here.
