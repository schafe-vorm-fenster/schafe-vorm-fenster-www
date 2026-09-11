/**
 * Regional content variation — TS-010 D9, WEB-F-056.
 *
 * Keys on **`state`, optionally refined by `county`** — the levels stage 1
 * actually delivers (D4). It is content *selection*, never structure: a
 * variant may change a sentence, an example place or a piece of regional
 * proof; it never adds or removes a section.
 *
 * Two rules the validator enforces, because both are silent failures
 * otherwise: every set carries a neutral variant (which is written to stand on
 * its own, not as a leftover), and no variant addresses a single place — that
 * would be the "spooky" effect at content level.
 */

import type { GeoScope } from "../relevance/types";

export type RegionalKey = "neutral" | { readonly state: string; readonly county?: string };

export interface RegionalVariant<Value> {
  readonly key: RegionalKey;
  readonly value: Value;
}

/** Most specific present wins: county → state → neutral. */
export function selectRegionalVariant<Value>(
  set: readonly RegionalVariant<Value>[],
  viewer: GeoScope,
): Value | null {
  const byCounty =
    viewer.county === null
      ? undefined
      : set.find(
          (variant) =>
            variant.key !== "neutral" &&
            variant.key.county === viewer.county &&
            variant.key.state === viewer.state,
        );
  if (byCounty !== undefined) return byCounty.value;

  const byState =
    viewer.state === null
      ? undefined
      : set.find(
          (variant) =>
            variant.key !== "neutral" &&
            variant.key.county === undefined &&
            variant.key.state === viewer.state,
        );
  if (byState !== undefined) return byState.value;

  return set.find((variant) => variant.key === "neutral")?.value ?? null;
}

/**
 * The build check of TS-010-A9. It lives here so the rule has one
 * implementation; wiring it into `pnpm check` belongs to whoever ships the
 * variant sets as content (`state/open.md`).
 */
export function validateVariantSet<Value>(
  set: readonly RegionalVariant<Value>[],
): readonly string[] {
  const errors: string[] = [];
  if (!set.some((variant) => variant.key === "neutral")) errors.push("the set has no neutral variant");
  if (
    set.some(
      (variant) =>
        variant.key !== "neutral" &&
        Object.keys(variant.key).some((level) => level !== "state" && level !== "county"),
    )
  ) {
    errors.push("a variant is keyed below county level");
  }
  return errors;
}
