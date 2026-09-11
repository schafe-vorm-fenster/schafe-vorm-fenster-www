/**
 * The demo elements a content artifact carries as a list, turned into the
 * props the block components take.
 *
 * Where a proof pool has no cleared selection yet (Q-014, Q-045), the
 * content playbook wrote the prototype's stand-ins **into the artifact**, as
 * a `demo: true` slot with a numbered list — one line per card:
 *
 *     „Endlich sehen wir …" — Ehrenamtliche Bürgermeisterin, Beispielgemeinde Musterdorf
 *
 * A page must not re-type those sentences, and it must not invent the split
 * between the claim and who says it. This is that split, in one tested
 * function, so every page reads the artifact the same way.
 */

/** The three text parts a `proof-card` renders. */
export interface DemoProofElement {
  /** The card's context line — who or what the claim comes from. */
  readonly contextLine: string;
  /** The claim itself, without its quotation marks. */
  readonly claim: string;
  /** The attribution line under the claim. */
  readonly attribution: string;
}

/** The dash the artifacts separate a claim from its attribution with. */
const ATTRIBUTION_SEPARATOR = " — ";

/** German and English typographic quotation marks, plus the straight pair. */
const QUOTES = /^[„“"«»]+|[”“"«»]+$/g;

/**
 * Splits one authored demo line into claim, context and attribution.
 *
 * - the **last** ` — ` separates the claim from its attribution, so an em
 *   dash inside the sentence stays inside the sentence;
 * - the attribution's first `, ` separates who from where — "Ehrenamtliche
 *   Bürgermeisterin, Beispielgemeinde Musterdorf";
 * - a line with no attribution at all (an award, say) keeps `fallbackContext`
 *   as its context line rather than repeating itself.
 */
export function parseDemoProofElement(
  line: string,
  fallbackContext: string,
): DemoProofElement {
  const separator = line.lastIndexOf(ATTRIBUTION_SEPARATOR);
  const claim = (separator === -1 ? line : line.slice(0, separator))
    .trim()
    .replace(QUOTES, "")
    .trim();
  const rest = separator === -1 ? "" : line.slice(separator + ATTRIBUTION_SEPARATOR.length).trim();

  if (rest === "") {
    return { contextLine: fallbackContext, claim, attribution: fallbackContext };
  }

  const comma = rest.indexOf(", ");
  if (comma === -1) return { contextLine: fallbackContext, claim, attribution: rest };

  return {
    contextLine: rest.slice(0, comma).trim(),
    claim,
    attribution: rest.slice(comma + 2).trim(),
  };
}

/**
 * Fills the named runtime slots of an authored template.
 *
 * The artifacts write `{place}` and `{ort}` rather than a per-place sentence
 * — segment independence, TS-007 D7 — so the page substitutes rather than
 * rewrites. An unknown name is left standing: a visible `{place}` is a
 * content bug that has to be seen, and is far better than a silent gap in a
 * sentence.
 */
export function fillTemplate(
  text: string,
  values: Readonly<Record<string, string | undefined>>,
): string {
  return text.replace(/\{([a-z_]+)\}/gi, (match, name: string) => values[name] ?? match);
}
