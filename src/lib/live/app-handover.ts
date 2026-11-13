/**
 * The app handover — TS-WEB-0008 D9, TS-WEB-0017 D4, DEC-0029/DEC-0035, DEC-0168,
 * DEC-0177.
 *
 * **The one module that knows where the app and the village calendars are.**
 * Every link from the website into a village calendar is built here, from a
 * resolved place, and every link "to the app" — the registration handover, a
 * help link — is `APP_URL` from here. The app has **no host of its own** today
 * (DEC-0177): `app.schafe-vorm-fenster.de` has no DNS record, so that hostname
 * occurs in no authored module at all, and `APP_URL`'s literal occurs in this
 * file only — `scripts/check-api-routes.ts` (TS-WEB-0017-A11) fails either.
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
 * Where every link "to the app" goes — DEC-0177, the owner's answer of
 * 2026-10-28. The app has no domain of its own: `app.schafe-vorm-fenster.de`
 * (DEC-0035's planned host) has no DNS record, measured 2026-10-27 and again
 * 2026-10-28. Until the app has its own domain, the registration handover and
 * every help link point at the Schlatkow village calendar, which answers 200.
 *
 * One literal, deliberately not an environment value: a second source for the
 * same link is how `app.*` survived in four modules after the host was
 * dropped. It **lapses** when the app moves to its own domain — then this
 * constant takes that origin, `APP_HOST` below takes its hostname, and
 * DEC-0177 is superseded.
 */
export const APP_URL = "https://schafe-vorm-fenster.de/schlatkow.2838887";

/**
 * The app's own hostname, for the one place that reads a referrer rather than
 * building a link (`entry-context.ts`, TS-WEB-0010 D3's `activated` row).
 * `undefined` while the app has no domain of its own (DEC-0177): `APP_URL`'s
 * host is the apex, which is ours, and a referrer from our own host is
 * internal navigation, never an entry from the app.
 */
export const APP_HOST: string | undefined = undefined;

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

/** A URL with the inbound request's campaign parameters carried over. */
function withCampaign(target: string, options: HandoverOptions): string {
  const url = new URL(target);
  for (const [name, value] of campaignPairs(options.campaign)) url.searchParams.set(name, value);
  return url.toString();
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
  return withCampaign(new URL(`/${segment}`, CALENDAR_ORIGIN).toString(), options);
}

/**
 * A link "to the app" — `APP_URL` with the inbound request's campaign
 * parameters (FUN-WEB-0048). The registration handover of the three-step flow
 * (`register-flow.tsx`, kept but not rendered, DEC-0176 §5) reads this; no
 * path is appended, because the app's registration entry has no contract
 * (DEC-0029) and `/registrieren` on the apex answers 404 (DEC-0177).
 */
export function appUrl(options: HandoverOptions = {}): string {
  return withCampaign(APP_URL, options);
}

/**
 * The help surface (DEC-0047). Every article answers `APP_URL` (DEC-0177): the
 * two per-article paths this function used to build (`/hilfe/kalender`,
 * `/hilfe/einrichten`) answer 404 on the apex, measured 2026-10-28, and the app
 * has no host to carry them. The legacy `/hilfe` redirect is a different thing —
 * `redirect-map.ts` sends it to community-site's own help, which answers 200.
 * It takes no article: there is no address an article could change today.
 * Help deep links come back with the app's own domain (DEC-0177 §7).
 */
export function helpUrl(): string {
  return APP_URL;
}

/**
 * The registration handover — **our own route**, never the app's. DEC-0029
 * leaves the app's prefill contract unwritten, so nothing is appended there.
 */
export function registrationQuery(place: Place | { readonly slug: string } | undefined): Readonly<Record<string, string>> {
  return place ? { ort: place.slug } : {};
}
