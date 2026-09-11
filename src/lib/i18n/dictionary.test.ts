import { describe, expect, it } from "vitest";

import { dictionary } from "@/src/lib/i18n/dictionary";
import {
  DEFAULT_LOCALE,
  HREFLANG,
  HTML_LANG,
  isLocale,
  LOCALES,
  OG_LOCALE,
  PREFIXED_LOCALES,
  resolveLocale,
} from "@/src/lib/i18n/locales";
import { ROUTE_IDS } from "@/src/lib/routes/routes";

/** Every leaf key of a nested string record, as dotted paths. */
function keyPaths(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) return [prefix];
  return Object.entries(value as Record<string, unknown>).flatMap(([k, v]) =>
    keyPaths(v, prefix ? `${prefix}.${k}` : k),
  );
}

describe("TS-001 D7: the dictionary is keyed and complete in every language", () => {
  it("has the same key set in every language", () => {
    const reference = keyPaths(dictionary(DEFAULT_LOCALE)).sort();
    for (const locale of LOCALES)
      expect(keyPaths(dictionary(locale)).sort()).toEqual(reference);
  });

  it("leaves no string empty", () => {
    for (const locale of LOCALES)
      for (const [path, text] of Object.entries(
        flatten(dictionary(locale) as unknown as Record<string, unknown>),
      ))
        expect(text, path).not.toBe("");
  });

  it("names every route of the inventory", () => {
    for (const locale of LOCALES)
      expect(Object.keys(dictionary(locale).pages).sort()).toEqual(
        [...ROUTE_IDS].sort(),
      );
  });

  /**
   * F-2-72: the dictionary used to carry a `descriptionTemplate` that named
   * the run's own work packages and a spec clause, and every page served it
   * as its `<meta name="description">`. The description is content now
   * (`content/pages/**` `seo:`), and both the template and the unused
   * routing-skeleton `placeholder` group are gone — this asserts neither can
   * come back through the dictionary. "Platzhalter" itself stays allowed: it
   * is DEC-068's own visitor-facing marking on an image that depicts nothing
   * real.
   */
  it("carries no internal identifier in any string", () => {
    for (const locale of LOCALES) {
      const text = JSON.stringify(dictionary(locale));
      for (const marker of ["TS-0", "DEC-", "Q-0", "(M2)", "(M3)"]) {
        expect(text, `${locale} / ${marker}`).not.toContain(marker);
      }
    }
  });
});

describe("TS-001-A10/A11: the language table is the single declaration", () => {
  it("ships exactly German and English", () => {
    expect([...LOCALES]).toEqual(["de", "en"]);
    expect(DEFAULT_LOCALE).toBe("de");
    expect([...PREFIXED_LOCALES]).toEqual(["en"]);
  });

  it("declares html lang, og locale and hreflang for every language", () => {
    for (const locale of LOCALES) {
      expect(HTML_LANG[locale]).toBeTruthy();
      expect(OG_LOCALE[locale]).toMatch(/^[a-z]{2}_[A-Z]{2}$/);
      expect(HREFLANG[locale]).toBe(locale);
    }
  });

  it("recognises only the languages of the table", () => {
    expect(isLocale("de")).toBe(true);
    expect(isLocale("uk")).toBe(false);
    expect(resolveLocale("uk")).toBe(DEFAULT_LOCALE);
    expect(resolveLocale(undefined)).toBe(DEFAULT_LOCALE);
    expect(resolveLocale("en")).toBe("en");
  });
});

function flatten(
  value: Record<string, unknown>,
  prefix = "",
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, entry] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof entry === "string") out[path] = entry;
    else if (typeof entry === "object" && entry !== null)
      Object.assign(out, flatten(entry as Record<string, unknown>, path));
  }
  return out;
}
