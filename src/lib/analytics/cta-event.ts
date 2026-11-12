/**
 * CTA click events — DEC-0218 §3 (issue 194), widening TS-WEB-0012 D4.
 *
 * Every call to action on the site reports one click event, named after the
 * conversion goal it leads towards. The naming scheme, in eTracker's four
 * event fields (`et_UserDefinedEvent(object, category, action, type)`):
 *
 * | Field      | Value                                   | Example                       |
 * | ---------- | --------------------------------------- | ----------------------------- |
 * | `category` | the hub conversion-goal id the CTA serves, `navigation` for a target that serves none, `outbound` for an unclassified external target | `buy-calendar-licence` |
 * | `action`   | always `click`                          | `click`                       |
 * | `object`   | the CTA id: `<target>.<rank>`           | `order.primary`               |
 * | `type`     | the page it was clicked on (`page-view.ts`) | `de/calendar`             |
 *
 * `<target>` is the route id of an internal target, or a fixed key for an
 * external one (`appointment`, `whatsapp`, `phone`, `mail`,
 * `registration-form`, `village-calendar`, `external:<host>`), or
 * `submit:<route>` for a button whose form goes to one of our routes, or
 * `action:<name>` for any other plain `<button>`. `<rank>` is the element's
 * `data-cta` marker (`primary`, `secondary`, `repeat`, `equal-weight`;
 * TS-WEB-0006 D3), `link` for an outbound link that carries none.
 *
 * The click event does not replace the D4 conversion events: those stay one
 * per completed trigger, with `action` = their `stage` (`handover` /
 * `completed`). A click on the briefing link therefore reports both
 * `request-product-briefing / click` and `request-product-briefing /
 * handover` — two rows, told apart by `action`.
 *
 * This module is pure: the one listener that feeds it lives in
 * `etracker-analytics.tsx`, which reads the clicked element into a
 * `CtaElement` and hands the result to the tracker. No component computes or
 * carries an event — the existing `data-cta` / `data-channel` markers and the
 * target are enough, which is what keeps the scheme in one place.
 */

import { CALENDAR_ORIGIN } from "@/src/lib/live/app-handover";
import { BRIEFING_URL } from "@/src/lib/live/briefing";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/src/lib/i18n/locales";
import { routeIdForPath, type RouteId } from "@/src/lib/routes/routes";

import type { PageView } from "./page-view";

/** The action every CTA click reports. */
export const CTA_ACTION = "click";
/** The category of a CTA whose target serves no conversion goal. */
export const NAVIGATION_CATEGORY = "navigation";
/** The category of an external target no rule below recognises. */
export const OUTBOUND_CATEGORY = "outbound";

/**
 * Which conversion goal a page serves — the goal a CTA *to* that page counts
 * towards. Read off the page specs' goal rows (TS-WEB-0019 … TS-WEB-0029) and
 * TS-WEB-0012 D4's surface column; `navigation` where a page carries no
 * conversion goal of its own (about, archive, legal).
 */
export const GOAL_BY_ROUTE: Readonly<Record<RouteId, string>> = {
  home: "save-calendar-to-homescreen",
  place: "save-calendar-to-homescreen",
  placeStart: "register-as-publisher",
  takePart: "register-as-publisher",
  register: "register-as-publisher",
  calendar: "buy-calendar-licence",
  order: "buy-calendar-licence",
  region: "request-licence-quote",
  regionQuote: "request-licence-quote",
  about: NAVIGATION_CATEGORY,
  archive: NAVIGATION_CATEGORY,
  legal: NAVIGATION_CATEGORY,
};

/** What the listener reads off a clicked element. Strings only, no DOM. */
export interface CtaElement {
  readonly tag: "a" | "button";
  /** The raw `href` attribute, as written. */
  readonly href?: string;
  /** `data-cta` — the TS-WEB-0006 D3 rank marker. */
  readonly rank?: string;
  /** `data-channel` — the contact section's channel marker. */
  readonly channel?: string;
  /** `name` or `id` of a plain button — never its label (D4 rule 3: no free text). */
  readonly name?: string;
  /** The `action` attribute of the form a button submits, when it has one. */
  readonly formAction?: string;
}

export interface CtaEvent {
  readonly category: string;
  readonly action: typeof CTA_ACTION;
  readonly object: string;
  readonly type: string;
}

const CONTACT_CHANNELS: Readonly<Record<string, string>> = {
  appointment: "request-product-briefing",
  whatsapp: "make-contact",
  phone: "make-contact",
  mail: "make-contact",
};

const WHATSAPP_HOSTS = new Set(["wa.me", "api.whatsapp.com", "web.whatsapp.com"]);
const BOOKING_HOSTS = new Set(["calendar.app.google", "calendar.google.com", hostOf(BRIEFING_URL)]);
const VILLAGE_CALENDAR_PATH = /^\/[a-z0-9]+(?:-[a-z0-9]+)*\.\d+(?:\/|$)/;
/** `/start`, the registration surface outside `app/[lang]` (TS-WEB-0016 D15). */
const REGISTRATION_SURFACE = "/start";
const SAFE_NAME = /^[a-z][a-z0-9_-]{0,40}$/i;

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
}

interface Target {
  readonly key: string;
  readonly category: string;
}

/** True for a target that leaves the site: another origin, a phone, a mail, an app scheme. */
export function isOutboundHref(href: string | undefined, origin: string): boolean {
  if (!href) return false;
  const raw = href.trim();
  if (/^(tel|mailto|whatsapp):/i.test(raw)) return true;
  try {
    const url = new URL(raw, origin);
    return (url.protocol === "http:" || url.protocol === "https:") && url.origin !== new URL(origin).origin;
  } catch {
    return false;
  }
}

/**
 * Whether a clicked element is a CTA this scheme counts: anything carrying a
 * `data-cta` rank, and every link that leaves the site (the WhatsApp, phone,
 * mail and booking rows, the registration form, the village calendar, an
 * outlet's article). An internal link without a rank — the header menu, the
 * breadcrumb, a link inside running text — is navigation, not a CTA.
 */
export function isTrackedCta(element: CtaElement, origin: string): boolean {
  if (element.rank) return true;
  return element.tag === "a" && isOutboundHref(element.href, origin);
}

/** The public path's language and route — `/en/your-place` → `en`, `place`. */
function internalTarget(pathname: string): Target {
  if (pathname === REGISTRATION_SURFACE) {
    return { key: "start", category: "register-as-publisher" };
  }
  let locale: Locale = DEFAULT_LOCALE;
  let path = pathname;
  for (const candidate of LOCALES) {
    if (candidate === DEFAULT_LOCALE) continue;
    if (pathname === `/${candidate}` || pathname.startsWith(`/${candidate}/`)) {
      locale = candidate;
      path = pathname.slice(candidate.length + 1) || "/";
    }
  }
  const route = routeIdForPath(path, locale);
  if (route) return { key: route, category: GOAL_BY_ROUTE[route] };
  return { key: `path:${pathname}`, category: NAVIGATION_CATEGORY };
}

function externalTarget(raw: string, origin: string): Target {
  if (/^tel:/i.test(raw)) return { key: "phone", category: "make-contact" };
  if (/^mailto:/i.test(raw)) return { key: "mail", category: "make-contact" };
  if (/^whatsapp:/i.test(raw)) return { key: "whatsapp", category: "make-contact" };

  const url = new URL(raw, origin);
  const host = url.host.toLowerCase();
  if (WHATSAPP_HOSTS.has(host)) return { key: "whatsapp", category: "make-contact" };
  if (BOOKING_HOSTS.has(host)) return { key: "appointment", category: "request-product-briefing" };
  if (host === "forms.gle" || (host === "docs.google.com" && url.pathname.startsWith("/forms"))) {
    return { key: "registration-form", category: "register-as-publisher" };
  }
  if (host === hostOf(CALENDAR_ORIGIN) && VILLAGE_CALENDAR_PATH.test(url.pathname)) {
    return { key: "village-calendar", category: "save-calendar-to-homescreen" };
  }
  return { key: `external:${url.hostname}`, category: OUTBOUND_CATEGORY };
}

function target(element: CtaElement, page: PageView, origin: string): Target {
  const channelGoal = element.channel ? CONTACT_CHANNELS[element.channel] : undefined;
  if (element.channel && channelGoal) return { key: element.channel, category: channelGoal };

  const raw = element.href?.trim();
  if (element.tag === "button" || !raw) {
    // A submit whose form goes to one of our routes is named after that
    // route: the home search submits to `/dein-ort`, an order step to the
    // next step. A form whose action is a function has no path to read.
    const action = element.formAction?.trim();
    if (action?.startsWith("/")) {
      const submitted = internalTarget(normalisedPath(new URL(action, `${origin}/`).pathname));
      if (!submitted.key.startsWith("path:")) {
        return { key: `submit:${submitted.key}`, category: submitted.category };
      }
    }
    const name = element.name && SAFE_NAME.test(element.name) ? element.name : "button";
    return {
      key: `action:${name}`,
      category: page.route ? GOAL_BY_ROUTE[page.route] : NAVIGATION_CATEGORY,
    };
  }

  if (isOutboundHref(raw, origin)) return externalTarget(raw, origin);

  // Internal: a path, a query, a hash. A hash alone stays on this page.
  const url = new URL(raw, `${origin}/`);
  if (raw.startsWith("#") || raw.startsWith("?")) {
    return page.route
      ? { key: page.route, category: GOAL_BY_ROUTE[page.route] }
      : { key: "path:#", category: NAVIGATION_CATEGORY };
  }
  return internalTarget(normalisedPath(url.pathname));
}

function normalisedPath(pathname: string): string {
  return pathname.toLowerCase().replace(/(.)\/$/, "$1");
}

/**
 * The click event of one CTA on one page, or `undefined` when the element is
 * not a CTA (`isTrackedCta`). Never throws: a malformed href becomes an
 * `outbound` event rather than an exception in a click handler (D9).
 */
export function ctaEvent(
  element: CtaElement,
  page: PageView,
  origin: string,
): CtaEvent | undefined {
  if (!isTrackedCta(element, origin)) return undefined;
  let resolved: Target;
  try {
    resolved = target(element, page, origin);
  } catch {
    resolved = { key: "external:unparsed", category: OUTBOUND_CATEGORY };
  }
  const rank = element.rank || (element.tag === "a" ? "link" : "button");
  return {
    category: resolved.category,
    action: CTA_ACTION,
    object: `${resolved.key}.${rank}`,
    type: page.pageName,
  };
}
