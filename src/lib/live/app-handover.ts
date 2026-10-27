/**
 * The app handover — TS-WEB-0008 D9, TS-WEB-0017 D4, DEC-0029/DEC-0035, DEC-0168.
 *
 * **The one module that knows where the village calendars are.** Every link
 * from the website into a village calendar is built here, from a resolved
 * place, and the app hostname appears in this file and nowhere else in the
 * tree — `scripts/check-api-routes.ts` (TS-WEB-0017-A11) fails a second
 * occurrence. `src/lib/routes/routes.ts` re-exports `APP_ORIGIN` from here so
 * the `/hilfe` redirect keeps its import and the constant keeps one home.
 *
 * The rules D9 fixes, each one a line below:
 *
 *  - a calendar URL is `{CALENDAR_ORIGIN}/{slug}.{geonameId}` — the village
 *    calendar's own address scheme (community-site: "a village page is
 *    addressed as `<name>.<geonameId>`"), both parts out of one geo-api place,
 *    nothing guessed (issue #81, DEC-0168 §5);
 *  - a slug is **never** string-built from user input and never used before
 *    geo-api confirmed it. An unresolved slug leads to `/dein-ort/starten`,
 *    never to a broken app link;
 *  - campaign parameters present on the inbound request are preserved
 *    (FUN-WEB-0048, TS-WEB-0004 D3 rule 6);
 *  - **no registration prefill.** No contract exists (DEC-0029), so nothing is
 *    appended to the app URL; `?ort=<slug>` goes on our own route instead;
 *  - app links are external links, not route-facade links (TS-WEB-0001 D5 covers
 *    website routes only).
 */

import type { Place } from "./types";

/**
 * Where the village calendars live after the move off the apex (DEC-0035).
 * An environment value, because both hosts must work during the transition —
 * who flips it is `state/open.md`'s question, not this module's.
 */
export const APP_ORIGIN =
  process.env.NEXT_PUBLIC_APP_ORIGIN ?? "https://app.schafe-vorm-fenster.de";

/**
 * Where a village calendar is **today**: community-site on the bare apex, for
 * every domain this website answers on (`.de`, `sheepoutside.com`, `.pl`,
 * `.at` — one calendar deployment, German only). DEC-0035's move to `app.*`
 * has not happened: measured 2026-10-27, `app.schafe-vorm-fenster.de` has no
 * DNS record, while `https://schafe-vorm-fenster.de/lehre.2879378` answers
 * 200. The same origin `redirect-map.ts` uses for help; the same environment
 * value moves both when the calendars move (DEC-0168 §5).
 */
export const CALENDAR_ORIGIN =
  process.env.NEXT_PUBLIC_COMMUNITY_SITE_ORIGIN ?? "https://schafe-vorm-fenster.de";

/** The campaign parameters that survive a handover (FUN-WEB-0048). */
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

/** The two parts of a place a calendar address needs — both from one geo-api answer. */
export type CalendarPlace = Pick<Place, "slug" | "communityId">;

/**
 * The village calendar's path segment: `<slug>.<geonameId>` — `lehre.2879378`.
 * `undefined` when either part is not what geo-api answers (a slug shape, a
 * positive integer id), so a malformed place yields no link rather than a
 * broken one. `place-index.ts` reads community-site's pages by the same key.
 */
export function calendarSlug(place: CalendarPlace): string | undefined {
  const id = place.communityId.replace(/^geoname\./u, "");
  if (!isSlugShaped(place.slug) || !/^[1-9]\d*$/u.test(id)) return undefined;
  return `${place.slug}.${id}`;
}

/**
 * The calendar URL of a **resolved** place. The argument is a place, not a
 * string, precisely so a caller cannot pass raw user input: its slug and its
 * geoname id only ever come out of a geo-api response (or its mock), or out of
 * the configured showcase community.
 */
export function calendarUrl(place: CalendarPlace, options: HandoverOptions = {}): string | undefined {
  const segment = calendarSlug(place);
  if (segment === undefined) return undefined;
  const url = new URL(`/${segment}`, CALENDAR_ORIGIN);
  for (const [name, value] of campaignPairs(options.campaign)) url.searchParams.set(name, value);
  return url.toString();
}

/**
 * The help surface (DEC-0047). Per-article mapping is a demand on the app team
 * (Q-0041, `state/open.md` row 8) — until it lands every article redirects to
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
 * The registration handover — **our own route**, never the app's. DEC-0029
 * leaves the app's prefill contract unwritten, so nothing is appended there.
 */
export function registrationQuery(place: Place | { readonly slug: string } | undefined): Readonly<Record<string, string>> {
  return place ? { ort: place.slug } : {};
}
