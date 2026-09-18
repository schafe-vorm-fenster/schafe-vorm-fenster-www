/**
 * The Portalize embed — TS-008 D6, DEC-030, `state/open.md` row 82.
 *
 * One module knows what the embedded calendar is and how it is addressed, so
 * a page mounts it without knowing either. The three facts it holds:
 *
 *  1. **the loader.** Portalize serves a per-organizer loader at
 *     `{host}/api/{organizerId}/load.js`. It is a classic script that defines
 *     `window.loadWidget` and auto-initialises every element carrying
 *     `data-portalize-widget` **and an `id`**. It then injects
 *     `{host}/dist/widget.es.js` as a module and mounts a `<portalize-widget>`
 *     custom element with an **open shadow root** — no iframe, which is why
 *     the site's `frame-src 'none'` stays untouched.
 *  2. **which calendar.** An organizer id, which is a public identifier: the
 *     `<script src>` of every site that embeds one carries it in the page
 *     source. It is not a credential and is not treated as one.
 *  3. **what the embed may be told.** Everything else — which places, which
 *     categories, the typography, the branding — is **server-side organizer
 *     configuration**, fetched by the loader itself. The page can only set
 *     three `data-*` attributes: branding on/off, the category filter on/off,
 *     and how many weeks ahead to show.
 *
 * The calendar embedded on `/dein-kalender` is a **real, live one**
 * (`SHOWCASE_CALENDAR` below). Its configuration was read from the service's
 * own `GET /api/{organizerId}/config` on 2026-09-18 and is restated here only
 * as documentation — the page copy explains it, and the service remains the
 * source of truth.
 */

import { portalizeHost } from "@/src/clients/hosts";

/**
 * The embedded calendar of `/dein-kalender`.
 *
 * Chosen over the two other live organizers for three reasons that are all
 * about what a visitor sees: its filter is three neighbouring villages plus
 * its own organizer, so it reads as **one place's calendar** rather than a
 * whole region's feed; every event image it carries comes from the
 * ecosystem's own asset host, so the CSP allowlist stays inside Jan's own
 * infrastructure (a region-wide calendar pulls images from municipal sites we
 * would have to allow-list and would rather not); and it is the organizer the
 * service's own production deploy smoke-tests, so it is the one least likely
 * to go quiet.
 */
export const SHOWCASE_CALENDAR = {
  organizerId: "5f3745f3-845d-4bbc-84e3-4d9a00883bf8",
  /** The communities its `filters.communities` names — for the page copy. */
  communities: ["Schlatkow", "Schmatzin", "Wolfradshof"],
  /** `filters.categories: []` upstream — every category, unfiltered. */
  categoriesFiltered: false,
  /** `style.brand.logourl: null` upstream — no branding header. */
  branding: false,
} as const;

/** The loader's default, restated so the page copy and the embed agree. */
export const DEFAULT_WEEKS_AHEAD = 13;

/**
 * The height the page reserves for the mount, before the loader runs.
 *
 * The widget is a normal flow element that grows with its content, so
 * reserving nothing would reflow the page twice (config fetch, then events).
 * A fixed box that the list scrolls inside reserves the space once and
 * shifts nothing — and a calendar excerpt on a marketing page is an example,
 * not the calendar, so a scroll box is also the honest shape for it.
 */
export const EMBED_RESERVED_HEIGHT = "clamp(26rem, 60vh, 34rem)";

export function portalizeLoaderUrl(organizerId: string): string {
  return `${portalizeHost()}/api/${encodeURIComponent(organizerId)}/load.js`;
}
