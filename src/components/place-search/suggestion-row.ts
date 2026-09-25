/**
 * The row of the suggestion overlay — TS-WEB-0008 D7a's "Ort (Gemeinde)" and its
 * 3–4 row budget, as pure functions the typeahead renders from and a test
 * can pin without a browser.
 */

/** D7a: "3–4 rows … further matches are neither paged nor scrolled". Four is the cap (DEC-0119). */
export const MAX_ROWS = 4;

export interface SuggestionRowInput {
  readonly name: string;
  readonly municipality?: string;
}

/**
 * "Ort (Gemeinde)": the place first, its municipality in brackets, so two
 * villages of one name are told apart. A place whose source carries no
 * municipality is its name alone — never empty brackets.
 */
export function suggestionLabel({ name, municipality }: SuggestionRowInput): string {
  const trimmed = municipality?.trim() ?? "";
  return trimmed.length > 0 ? `${name} (${trimmed})` : name;
}

/**
 * Where the typed string sits inside the place name, so the row can set the
 * matched substring at 700 (SRC-0014 §Place-search result overlay). Plain
 * case-insensitive: a match the index made through diacritic folding, or on
 * the municipality, simply renders the name at 400 — the row is right, only
 * the emphasis is absent.
 */
export function matchSpan(
  name: string,
  query: string,
): { readonly before: string; readonly match: string; readonly after: string } {
  const needle = query.trim().toLowerCase();
  const at = needle.length === 0 ? -1 : name.toLowerCase().indexOf(needle);
  if (at < 0) return { before: name, match: "", after: "" };
  return {
    before: name.slice(0, at),
    match: name.slice(at, at + needle.length),
    after: name.slice(at + needle.length),
  };
}
