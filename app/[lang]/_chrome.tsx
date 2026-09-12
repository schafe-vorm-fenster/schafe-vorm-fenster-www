"use client";

/**
 * The chrome of TS-004 D4 — header, breadcrumb trail, the `main` landmark,
 * footer — **once per document**, owned by `app/[lang]/layout.tsx`.
 *
 * ```
 * skip-link → site-header → (breadcrumb-trail) → main → site-footer
 * ```
 *
 * ### Why the chrome moved out of the page (state/open.md rows 97 and 204)
 *
 * Until now every page rendered its own chrome through `_page-frame.tsx`,
 * because a Next.js layout receives only `children` and its own segment
 * `params` and therefore cannot know which of the twelve routes renders below
 * it — and the header's `aria-current`, the trail, and the footer's language
 * switch (TS-001-A7) all need the route id.
 *
 * With Cache Components on, that is not a seam question any more, it is a
 * defect. The App Router does not unmount the page you navigate away from: it
 * keeps the last three route segments mounted inside hidden React
 * `<Activity>` boundaries so their state and DOM survive a return
 * (`node_modules/next/dist/docs/01-app/02-guides/preserving-ui-state.md`,
 * "Next.js preserves up to 3 routes"; the mechanism is
 * `client/components/layout-router.js` + `bfcache-state-manager.js`, where
 * `MAX_BF_CACHE_ENTRIES` is 3 whenever `cacheComponents` is enabled).
 * Everything a page renders is inside that boundary. So a page that renders
 * the chrome renders a second — and after two clicks a third — `<header>`,
 * `<main id="main">` and `<footer>` into the document, hidden with
 * `display: none !important` but present: two `main` landmarks, a duplicated
 * `id="main"` under the skip link, on every page a visitor reaches by
 * clicking rather than by loading.
 *
 * The layout is the one level **above** those boundaries, so chrome rendered
 * here exists exactly once no matter how the visitor got to the page. The
 * route id it needs comes from `useSelectedLayoutSegments()`, which reads the
 * router tree rather than the request — free at prerender (every `[lang]`
 * value comes from `generateStaticParams`, so nothing suspends), correct in
 * the static HTML a JavaScript-less visitor gets, and updated by the router
 * on every client navigation. That is what makes this a Client Component:
 * during a client navigation the server never re-renders the layout, so
 * anything in the layout that depends on the route has to read it from the
 * router. It renders no data of its own — `heroPhoto` and the footer's
 * newsletter slot arrive server-rendered from the layout.
 *
 * `usePathname()` would have been the wrong hook: the public path is rewritten
 * onto the internal one (TS-004 D3), and the Next.js `usePathname` reference
 * names exactly that pairing as a hydration-mismatch trap. Segments are the
 * internal, German path by construction.
 *
 * What stays with the page: everything **inside** `main`, blocks 3 and 4
 * included (`_page-frame.tsx`).
 */

import { useSelectedLayoutSegments } from "next/navigation";

import { BackToTop } from "@/src/components/back-to-top/back-to-top";
import { BreadcrumbTrail } from "@/src/components/breadcrumb-trail/breadcrumb-trail";
import { EnvoyFormMount } from "@/src/components/envoy-form-mount/envoy-form-mount";
import { SiteFooter } from "@/src/components/site-footer/site-footer";
import { SiteHeader } from "@/src/components/site-header/site-header";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { ROUTES, routeFromSegments, trail } from "@/src/lib/routes/routes";

import type { HeroPhotoByRoute } from "./_chrome-data";
import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";
import type { ReactNode } from "react";

/**
 * The imprint's own contact address (`content/legal/imprint.md`) — the
 * `lead-fallback` behind the mocked envoy widget must reach a real inbox, so
 * this is read from the legal text rather than invented (TS-016 D6).
 */
const CONTACT_EMAIL = "jan@schafe-vorm-fenster.de";

/**
 * `/rechtliches` only (inventory §2.2 #18) — a fixed control, never elsewhere.
 * It was a `PageFrame` prop while the page owned the chrome; it is a property
 * of the route, so the chrome reads it off the route id.
 */
const BACK_TO_TOP_ROUTES: ReadonlySet<RouteId> = new Set<RouteId>(["legal"]);

/**
 * The route a first segment that is not one of the twelve falls back to.
 * `app/[lang]` matches any first segment, so `/gibt-es-nicht` renders the home
 * page's route tree and answers 404 from the page (`_locale.ts`). The chrome
 * around that 404 is the home page's, which is what it was before too.
 */
const FALLBACK_ROUTE: RouteId = "home";

export interface SiteChromeProps {
  readonly locale: Locale;
  /** Resolved on the server for every route at once — see `_chrome-data.ts`. */
  readonly heroPhoto: HeroPhotoByRoute;
  /** The newsletter entry (S5) — server-rendered, handed straight through. */
  readonly newsletter: ReactNode;
  readonly children: ReactNode;
}

export function SiteChrome({
  locale,
  heroPhoto,
  newsletter,
  children,
}: SiteChromeProps) {
  const route = routeFromSegments(useSelectedLayoutSegments()) ?? FALLBACK_ROUTE;
  const d = dictionary(locale);

  /** The five second-level pages carry a visible trail (TS-006 D2, DEC-071). */
  const ancestors = ROUTES[route].parent ? trail(route).slice(0, -1) : [];
  const trailShown = ancestors.length > 0;

  return (
    <>
      {/* Transparent over a hero photograph — but never where a breadcrumb
          trail stands between the header and the hero: there the header is
          not over the photograph at all. */}
      <SiteHeader
        current={route}
        locale={locale}
        overHero={(heroPhoto[route] ?? false) && !trailShown}
      />
      {trailShown ? (
        <div className="container">
          <BreadcrumbTrail
            current={d.pages[route]}
            items={ancestors.map((ancestor) => ({
              to: ancestor,
              label: d.pages[ancestor],
            }))}
            label={d.nav.breadcrumb}
            locale={locale}
          />
        </div>
      ) : null}
      <main id="main">{children}</main>
      <SiteFooter
        contact={
          <EnvoyFormMount
            fallbackEmail={CONTACT_EMAIL}
            kind="contact"
            locale={locale}
            sourceRoute={route}
          />
        }
        locale={locale}
        newsletter={newsletter}
        route={route}
      />
      {BACK_TO_TOP_ROUTES.has(route) ? <BackToTop /> : null}
    </>
  );
}
