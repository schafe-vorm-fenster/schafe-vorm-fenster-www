/**
 * Entry-context traits — TS-010 D3, stage 2.
 *
 * One request in, **one trait id out** — and the id is the shared constant of
 * `src/lib/relevance/types.ts`, which TS-005 D2 scores against and TS-005 D8
 * uses as a cache-key axis. Two vocabularies would silently produce two
 * segmentations, so there is one.
 *
 * The trait is derived per request and **never persisted**: no cookie, no
 * storage, no server-side session (WEB-Q-020). A visitor who returns from a
 * different entry is a different segment, by design.
 *
 * Precedence follows TS-010 D2 — **stated intent beats inferred intent**:
 * a campaign parameter (the visitor followed a link we printed) outranks a
 * referrer host (the browser told us where she came from).
 */

import type { EntryTrait, FocusJob } from "../relevance/types";
import type { RouteId } from "../routes/routes";

/** `etcc_*` is the house convention (WEB-Q-028); `utm_*` is an accepted alias. */
const MEDIUM_PARAMS = ["etcc_med", "utm_medium"] as const;

const MEDIUM_TRAITS: Record<string, EntryTrait> = {
  print: "print-qr",
  newsletter: "activated",
  social: "social",
};

const SOCIAL_HOSTS = ["instagram.com", "facebook.com", "whatsapp.com", "fb.me", "fb.com", "threads.net"];
const PROFESSIONAL_HOSTS = ["linkedin.com", "lnkd.in"];
const ACTIVATED_HOSTS = ["app.schafe-vorm-fenster.de"];
const SEARCH_HOSTS = [
  "google.com",
  "google.de",
  "bing.com",
  "duckduckgo.com",
  "ecosia.org",
  "startpage.com",
  "search.yahoo.com",
  "qwant.com",
];

/** Our own hosts: a referrer from them is internal navigation, not an entry. */
const OWN_HOSTS = ["schafe-vorm-fenster.de", "schafe-vorm-fenster.com", "localhost"];

/**
 * The press and podcast allowlist. TS-010 D3 requires this list to be
 * **content, not code** — shipped with the content build from `media-echo`, so
 * a new outlet does not need a deployment. Until that build exists it is this
 * seed list, derived from the publishers in `@schafe-vorm-fenster/media-echo`,
 * and every caller may override it. → state/open.md.
 */
export const PRESS_REFERRER_HOSTS: readonly string[] = [
  "nordkurier.de",
  "ndr.de",
  "svz.de",
  "ostsee-zeitung.de",
  "deutschlandfunk.de",
  "zukunftswege-ost.de",
  "bpb.de",
];

export interface EntryContextInput {
  /** `searchParams` of the request — an object, a record or `URLSearchParams`. */
  readonly params?: URLSearchParams | Readonly<Record<string, string | readonly string[] | undefined>>;
  /** The `Referer` header, as it arrived. */
  readonly referrer?: string | null;
  /** The landing route, for the two rows the matrix distinguishes by page. */
  readonly routeId?: RouteId;
  /** The landing page's focus job, for the purchase-intent row. */
  readonly focusJob?: FocusJob;
  /** Overrides `PRESS_REFERRER_HOSTS` once the allowlist ships as content. */
  readonly pressHosts?: readonly string[];
}

function firstValue(
  params: EntryContextInput["params"],
  name: string,
): string | undefined {
  if (params === undefined) return undefined;
  if (params instanceof URLSearchParams) return params.get(name) ?? undefined;
  const value = params[name];
  if (value === undefined) return undefined;
  return Array.isArray(value) ? value[0] : (value as string);
}

/** The registrable host of a referrer, lowercase and without `www.`. */
function hostOf(referrer: string | null | undefined): string | null {
  if (referrer === null || referrer === undefined || referrer.trim() === "") return null;
  try {
    return new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

function matches(host: string, candidates: readonly string[]): boolean {
  return candidates.some((candidate) => host === candidate || host.endsWith(`.${candidate}`));
}

/**
 * The trait of one request. Never throws, and returns `direct` for everything
 * it cannot place — `direct` is the matrix's documented default case, not a
 * degraded one.
 */
export function resolveEntryTrait(input: EntryContextInput): EntryTrait {
  for (const name of MEDIUM_PARAMS) {
    const medium = firstValue(input.params, name)?.trim().toLowerCase();
    if (medium !== undefined && medium in MEDIUM_TRAITS) return MEDIUM_TRAITS[medium];
  }

  const host = hostOf(input.referrer);
  if (host === null) return "direct";

  // The app is a sibling host of our own domain, so it is tested first: a
  // redirect out of the app is an entry, internal navigation is not.
  if (matches(host, ACTIVATED_HOSTS)) return "activated";
  if (matches(host, OWN_HOSTS)) return "direct";

  if (matches(host, PROFESSIONAL_HOSTS)) return "professional";
  if (matches(host, SOCIAL_HOSTS)) return "social";
  if (matches(host, input.pressHosts ?? PRESS_REFERRER_HOSTS)) return "press";

  if (matches(host, SEARCH_HOSTS)) {
    if (input.routeId === "place") return "reader-search";
    if (input.focusJob === "run-our-own-calendar") return "purchase-intent";
    return "direct";
  }

  return "direct";
}
