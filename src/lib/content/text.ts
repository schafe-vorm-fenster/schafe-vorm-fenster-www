/**
 * Small, pure text helpers for reading the page artifacts' authored strings
 * (`src/lib/content/blocks.ts` gives typed blocks; these cover two shapes
 * more than one page-implementation work package's pages need).
 */

/**
 * A CTA field sometimes carries its target inline for the content reviewer
 * — `"Angebot anfragen → \`/deine-region/angebot\`"`. The page already knows
 * the target from the route table (TS-004 D3a); this returns the human
 * label only.
 */
export function ctaLabelOnly(value: string | undefined): string | undefined {
  if (!value) return value;
  return value.split(" → ")[0].trim();
}

/**
 * A quote authored as one string, `"„…" — Attribution"` — the ordered-list
 * shape the dummy-content demo additions use throughout (deine-region slot
 * 6, similar elsewhere). Splits on the *last* " — " so an em dash inside the
 * quote itself is not mistaken for the attribution separator.
 */
export function splitQuoteAttribution(value: string): { claim: string; attribution: string } {
  const separator = value.lastIndexOf(" — ");
  if (separator === -1) return { claim: value, attribution: "" };
  return {
    claim: value.slice(0, separator).trim(),
    attribution: value.slice(separator + 3).trim(),
  };
}

/** Replaces `{token}` placeholders the content artifacts leave for runtime data that this page cannot resolve today (no geo anchor, no named organisation) — never a fabricated specific, always a generic, on-voice stand-in. */
export function interpolate(
  value: string | undefined,
  replacements: Readonly<Record<string, string>>,
): string | undefined {
  if (!value) return value;
  return value.replace(/\{([^}]+)\}/g, (match, token: string) => replacements[token] ?? match);
}
