import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { dictionary } from "@/src/lib/i18n/dictionary";
import { LOCALES } from "@/src/lib/i18n/locales";

/**
 * F-2-74 — `/en/legal` renders six legal documents in German with no notice
 * that this is intentional (gate-2 protocol item 7, TS-007-A11 / TS-029).
 * `state/open.md` row 53 promised the mitigation: the EN page frame "states
 * explicitly, in English, that the six legal sections themselves are
 * provided in German only".
 *
 * The rendered assertion — the sentence stands on `/en/legal` before the
 * first German body and nowhere on `/rechtliches` — lives in
 * `e2e/pages/rechtliches.spec.ts`: the page is a `use cache` server
 * component (`app/[lang]/_content.ts`) and cannot be rendered outside the
 * Next.js runtime. What is checkable here is the contract behind it: the
 * string exists in English only, and the page takes it from the dictionary
 * rather than from a literal of its own (TS-001 D7: "system texts exist per
 * language, keyed, not inline").
 */
describe("F-2-74 / row 53: the German-only notice exists in English only", () => {
  it("is an English sentence that names the language of the sections", () => {
    const notice = dictionary("en").legal.germanOnlyNotice;
    expect(notice).toBeTypeOf("string");
    expect(notice).toMatch(/German only/);
    // Row 53's two exclusions, said out loud rather than implied.
    expect(notice).toMatch(/machine-translate/);
  });

  it("does not exist in German — the German page gains no disclaimer", () => {
    expect(dictionary("de").legal.germanOnlyNotice).toBeNull();
  });

  it("is declared for every language of the table, so a new one cannot forget it", () => {
    for (const locale of LOCALES) {
      expect(dictionary(locale).legal, locale).toHaveProperty("germanOnlyNotice");
    }
  });

  it("is read from the dictionary by the page, not typed into it (TS-001 D7)", () => {
    const source = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");
    expect(source).toContain("dictionary(locale)");
    expect(source).toContain("d.legal");
    expect(source).toContain("germanOnlyNotice");
    expect(source).not.toContain("German only");
  });
});
