/**
 * The `?ort=` contract of TS-021 D4 — "the place is a query parameter, and
 * the URL is the whole payload".
 *
 * The value is **raw user input**, not a geo-api slug (TS-021 D4, and the
 * open point TS-023 inherits). Everything the page is allowed to do with it
 * depends on it having passed through here first:
 *
 * | Rule | Determination |
 * | --- | --- |
 * | Name | `ort`, exactly one value; a repeated parameter takes the first |
 * | Content | the raw search query |
 * | Validation | ≤ 80 characters, Unicode letters, digits, space, `-`, `.`, `'` |
 * | Anything else | the parameter is dropped and the placeless variant renders — never an error page |
 *
 * React escapes the value wherever it is rendered as text, and the route
 * facade URL-encodes it on the registration link, so this function's job is
 * not escaping — it is deciding whether a value may be echoed **at all**.
 */

/** The grammar of D4: letters, digits, space, hyphen, full stop, apostrophe. */
const ALLOWED = /^[\p{L}\p{N} .'’-]+$/u;

/** D4's length cap. A longer value is dropped, not truncated. */
export const MAX_PLACE_LENGTH = 80;

/**
 * The place a page may name, or `undefined` for the placeless variant.
 *
 * @param raw the `ort` entry of `searchParams` — a string, an array where
 *   the parameter repeats, or `undefined`
 */
export function readPlaceParameter(
  raw: string | readonly string[] | undefined,
): string | undefined {
  // "A repeated parameter takes the first and ignores the rest."
  const first = Array.isArray(raw) ? raw[0] : (raw as string | undefined);
  if (typeof first !== "string") return undefined;

  const value = first.trim();
  if (value === "" || value.length > MAX_PLACE_LENGTH) return undefined;
  if (!ALLOWED.test(value)) return undefined;

  return value;
}
