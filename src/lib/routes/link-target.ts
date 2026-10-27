/**
 * Where a link opens — DEC-0169 (owner review 2026-10-27, issue #82).
 *
 * A link to another origin opens in a **new tab**, always: the village
 * calendar, an outlet's article, Wikimedia Commons, the booking calendar,
 * WhatsApp, the app handover. Before DEC-0169 most of them navigated in the
 * same tab and the website was gone once the visitor followed one.
 *
 * The rule is decided here, from the target alone, so no call site can opt
 * out of it and no call site has to remember it:
 *
 *  - `http:` / `https:` / protocol-relative to an origin other than the
 *    site's own → `target="_blank"` with `rel="noopener noreferrer"`. `wa.me`
 *    is an `https:` URL like any other and opens a tab as well (it hands over
 *    to the app on a phone and shows WhatsApp Web on a desktop).
 *  - `tel:` and `mailto:` → no target. They do not navigate the document;
 *    a `_blank` would only leave an empty tab behind.
 *  - a path, a hash, a query → no target. It is this site.
 *
 * `noreferrer` on top of `noopener`: the site sends no referrer to a third
 * party it hands a visitor to (TS-WEB-0013, privacy by default). Nothing on
 * the receiving side reads it — campaign parameters travel in the URL
 * (TS-WEB-0008 D9), never in the `Referer`.
 */

import { SITE_ORIGIN } from "./routes";

/** The `rel` every new-tab link carries. */
export const NEW_TAB_REL = "noopener noreferrer";

const ABSOLUTE = /^(?:https?:)?\/\//i;

/** `true` for an `http(s)` target on an origin other than the site's own. */
export function isExternalHref(href: string | undefined, siteOrigin: string = SITE_ORIGIN): boolean {
  if (href === undefined || !ABSOLUTE.test(href.trim())) return false;
  try {
    const target = new URL(href.trim(), siteOrigin);
    if (target.protocol !== "http:" && target.protocol !== "https:") return false;
    return target.origin !== new URL(siteOrigin).origin;
  } catch {
    return false;
  }
}

export interface LinkTargetAttributes {
  readonly target?: "_blank";
  readonly rel?: string;
}

/** The `target`/`rel` pair for one link — empty for a link that stays on the site. */
export function linkTarget(href: string | undefined): LinkTargetAttributes {
  return isExternalHref(href) ? { target: "_blank", rel: NEW_TAB_REL } : {};
}
