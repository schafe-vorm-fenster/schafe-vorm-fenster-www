/**
 * The entry-context handover — TS-WEB-0010 D2 step 2, DEC-0140.
 *
 * `resolveEntryTrait()` needs two inputs a page cannot see: the `Referer`
 * header, which only the proxy reads, and the campaign medium, which is in the
 * query string. Until this module existed the trait half of stage 2 could not
 * fire at all — `src/lib/personalization/README.md` said so in the
 * `TS-WEB-0010-A4` row: *"the trait half (stage 2) cannot fire while the proxy
 * hands no `Referer` down"*.
 *
 * This is the hand-down, and it is deliberately **not** "forward the request".
 * What crosses the line is the smallest pair of values the D3 table is a
 * function of:
 *
 *  - `ref` — the referrer's **registrable host**, lowercased and without
 *    `www.`. Never the path and never the query: a referrer URL is somebody
 *    else's page, and its path is the one part of it that can carry what that
 *    visitor was reading. The host is what D3 matches on, so the host is what
 *    travels.
 *  - `med` — the campaign medium, and only when it is one of the three tokens
 *    D3 actually recognises (`print` · `newsletter` · `social`). An
 *    unrecognised medium falls through to the referrer in `resolveEntryTrait`,
 *    so dropping it here changes no outcome and keeps arbitrary query text out
 *    of a request header.
 *
 * There is **no geo field and no IP field**, by construction rather than by
 * discipline (TS-WEB-0010-A11): this module's input type has nowhere to put one.
 * Nothing is persisted either — the value lives for one request, in a header
 * (NFR-WEB-0061 · NFR-WEB-0062).
 *
 * The header is **always set by the proxy**, including to the empty string, so
 * a request that sends `x-svf-entry-context` itself cannot choose its own
 * segment: the proxy's `set()` overwrites it.
 */

import { referrerHostOf } from "./entry-context";

/** The one request header the handover uses. Same convention as `x-svf-not-found-locale`. */
export const ENTRY_CONTEXT_HEADER = "x-svf-entry-context";

/** `etcc_*` is the house convention (CON-WEB-0035 · CON-WEB-0036 · CON-WEB-0037 · NFR-WEB-0064); `utm_*` is an accepted alias. */
const MEDIUM_PARAMS = ["etcc_med", "utm_medium"] as const;

/**
 * The media D3 maps onto a trait. A medium outside this set is not forwarded,
 * because `resolveEntryTrait()` ignores it anyway.
 */
const FORWARDED_MEDIA = ["print", "newsletter", "social"] as const;

/** A hostname as the URL parser produces it: ASCII, punycode for IDN, dots and hyphens. */
const HOST_SHAPE = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/u;
/** RFC 1035's ceiling. A longer "host" is not one, and a header is not a place to find out. */
const HOST_MAX = 253;

export interface EntryHandoverInput {
  /** The `Referer` header, as it arrived. */
  readonly referrer?: string | null;
  /** The request's query string. */
  readonly searchParams?: URLSearchParams;
}

export interface EntryHandover {
  /** The referrer's registrable host, normalised — or `null` for "no entry context". */
  readonly referrerHost: string | null;
  /** One of the three recognised campaign media, or `null`. */
  readonly medium: string | null;
}

function forwardableHost(host: string | null): string | null {
  if (host === null) return null;
  if (host.length > HOST_MAX || !HOST_SHAPE.test(host)) return null;
  return host;
}

function forwardableMedium(value: string | null | undefined): string | null {
  const medium = value?.trim().toLowerCase();
  if (medium === undefined) return null;
  return (FORWARDED_MEDIA as readonly string[]).includes(medium) ? medium : null;
}

/**
 * The header value for one request — a `URLSearchParams` serialisation, so it
 * is ASCII, carries no CR/LF and needs no escaping rule of its own. The empty
 * string means "nothing recognised", which is D3's `direct` row.
 */
export function encodeEntryHandover(input: EntryHandoverInput): string {
  const value = new URLSearchParams();

  const host = forwardableHost(referrerHostOf(input.referrer));
  if (host !== null) value.set("ref", host);

  for (const name of MEDIUM_PARAMS) {
    const medium = forwardableMedium(input.searchParams?.get(name));
    if (medium !== null) {
      value.set("med", medium);
      break;
    }
  }

  return value.toString();
}

/**
 * The two values back out of the header. Never throws: an absent, empty or
 * malformed value is `direct`'s input, which is the documented default case
 * and not a degraded one (TS-WEB-0010 D3).
 */
export function decodeEntryHandover(value: string | null | undefined): EntryHandover {
  if (value === null || value === undefined || value.trim() === "") {
    return { referrerHost: null, medium: null };
  }
  const parsed = new URLSearchParams(value);
  return {
    referrerHost: forwardableHost(referrerHostOf(`https://${parsed.get("ref") ?? ""}`)),
    medium: forwardableMedium(parsed.get("med")),
  };
}
