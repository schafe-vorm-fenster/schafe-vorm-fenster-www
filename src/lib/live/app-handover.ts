/**
 * The app handover — TS-008 D9, TS-017 D4, DEC-029/DEC-035.
 *
 * **The one module that knows where the app is.** Every link from the website
 * into the village calendars is built here, from a geo-api community slug,
 * and the app hostname appears in this file and nowhere else in the tree —
 * `scripts/check-api-routes.ts` (TS-017-A11) fails a second occurrence.
 * `src/lib/routes/routes.ts` re-exports `APP_ORIGIN` from here so the
 * `/hilfe` redirect keeps its import and the constant keeps one home.
 *
 * The rules D9 fixes, each one a line below:
 *
 *  - a calendar URL is `{APP_ORIGIN}/{slug}` — nothing else, no path guessing;
 *  - a slug is **never** string-built from user input and never used before
 *    geo-api confirmed it. An unresolved slug leads to `/dein-ort/starten`,
 *    never to a broken app link;
 *  - campaign parameters present on the inbound request are preserved
 *    (WEB-F-048, TS-004 D3 rule 6);
 *  - **no registration prefill.** No contract exists (DEC-029), so nothing is
 *    appended to the app URL; `?ort=<slug>` goes on our own route instead;
 *  - app links are external links, not route-facade links (TS-001 D5 covers
 *    website routes only).
 */

import type { Place } from "./types";

/**
 * Where the village calendars live after the move off the apex (DEC-035).
 * An environment value, because both hosts must work during the transition —
 * who flips it is `state/open.md`'s question, not this module's.
 */
export const APP_ORIGIN =
  process.env.NEXT_PUBLIC_APP_ORIGIN ?? "https://app.schafe-vorm-fenster.de";

/** The campaign parameters that survive a handover (WEB-F-048). */
export const CAMPAIGN_PARAMETERS = ["etcc_cmp", "etcc_med", "etcc_par", "etcc_ctv", "etcc_bky", "etcc_bof"] as const;

/** A geo-api slug shape. Defensive only — the slug still has to come from a response. */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isSlugShaped(slug: string): boolean {
  return SLUG.test(slug) && slug.length <= 120;
}

export interface HandoverOptions {
  /** The inbound request's query, so campaign parameters can be carried over. */
  readonly campaign?: Readonly<Record<string, string | undefined>> | URLSearchParams;
}

function campaignPairs(campaign: HandoverOptions["campaign"]): [string, string][] {
  if (campaign === undefined) return [];
  const read = (name: string): string | undefined =>
    campaign instanceof URLSearchParams ? (campaign.get(name) ?? undefined) : campaign[name];
  return CAMPAIGN_PARAMETERS.flatMap((name) => {
    const value = read(name);
    return value ? ([[name, value]] as [string, string][]) : [];
  });
}

/**
 * The calendar URL of a **resolved** place. The argument is a `Place`, not a
 * string, precisely so a caller cannot pass raw user input: a `Place` only
 * ever comes out of a geo-api response (or its mock).
 */
export function calendarUrl(place: Place, options: HandoverOptions = {}): string {
  const url = new URL(`/${place.slug}`, APP_ORIGIN);
  for (const [name, value] of campaignPairs(options.campaign)) url.searchParams.set(name, value);
  return url.toString();
}

/**
 * The same, from a slug that arrived from outside (a link, a QR code). It is
 * accepted only after the caller has had geo-api confirm it — hence the
 * `resolved` flag rather than a bare string.
 */
export function calendarUrlForSlug(
  slug: string,
  { resolved, ...options }: HandoverOptions & { readonly resolved: boolean },
): string | undefined {
  if (!resolved || !isSlugShaped(slug)) return undefined;
  const url = new URL(`/${slug}`, APP_ORIGIN);
  for (const [name, value] of campaignPairs(options.campaign)) url.searchParams.set(name, value);
  return url.toString();
}

/**
 * The help surface (DEC-047). Per-article mapping is a demand on the app team
 * (Q-041, `state/open.md` row 8) — until it lands every article redirects to
 * the app root, which is the honest behaviour rather than a guessed path.
 */
export const HELP_ARTICLE_MAP: Readonly<Record<string, string>> = {
  // `Mock aktiv` — a dummy table, deliberately tiny, so the mechanism is
  // visible and the missing contract is not mistaken for a finished one.
  kalender: "/hilfe/kalender",
  einrichten: "/hilfe/einrichten",
};

export function helpUrl(article?: string): string {
  if (article && Object.hasOwn(HELP_ARTICLE_MAP, article)) {
    return new URL(HELP_ARTICLE_MAP[article]!, APP_ORIGIN).toString();
  }
  return APP_ORIGIN;
}

/** `true` when the help URL is the mocked per-article one (`Demo-Daten` marking). */
export function helpUrlIsMocked(article?: string): boolean {
  return article !== undefined && Object.hasOwn(HELP_ARTICLE_MAP, article);
}

/**
 * The registration handover — **our own route**, never the app's. DEC-029
 * leaves the app's prefill contract unwritten, so nothing is appended there.
 */
export function registrationQuery(place: Place | { readonly slug: string } | undefined): Readonly<Record<string, string>> {
  return place ? { ort: place.slug } : {};
}
