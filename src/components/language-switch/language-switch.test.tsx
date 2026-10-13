import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { HREFLANG, LOCALES } from "@/src/lib/i18n/locales";
import { href } from "@/src/lib/routes/routes";

import { LanguageSwitch } from "./language-switch";

/**
 * TS-WEB-0001 D5 as amended by DEC-0158: the switch is a segmented control —
 * one link per language, each to the equivalent page (TS-WEB-0001-A7), the
 * current one marked by `aria-current="page"` (TS-WEB-0001-A12).
 */
describe("language-switch — one link per language, the same page, the current one marked", () => {
  for (const current of LOCALES) {
    const html = renderToStaticMarkup(<LanguageSwitch current={current} route="takePart" />);
    const links = html.match(/<a\b[^>]*>/g) ?? [];

    it(`TS-WEB-0001-A12: on a ${current} page renders one link per language, in the table's order`, () => {
      expect(links).toHaveLength(LOCALES.length);
      LOCALES.forEach((locale, index) => {
        const link = links[index]!;
        expect(link).toContain(`href="${href("takePart", locale)}"`);
        expect(link).toMatch(new RegExp(`hreflang="${HREFLANG[locale]}"`, "i"));
        expect(link).toContain(`lang="${locale}"`);
      });
    });

    it(`TS-WEB-0001-A12: on a ${current} page exactly the ${current} link carries aria-current="page"`, () => {
      const marked = links.filter((link) => link.includes('aria-current="page"'));
      expect(marked).toHaveLength(1);
      expect(marked[0]).toContain(`lang="${current}"`);
      expect(marked[0]).toContain(`href="${href("takePart", current)}"`);
    });
  }

  it("names each language in itself", () => {
    const html = renderToStaticMarkup(<LanguageSwitch current="de" route="home" />);
    expect(html).toContain(">Deutsch</a>");
    expect(html).toContain(">English</a>");
  });

  it("is a nav named after the footer's language label", () => {
    const html = renderToStaticMarkup(<LanguageSwitch current="de" route="home" />);
    expect(html).toMatch(/<nav[^>]*aria-label="Sprache"/);
  });

  it("carries no invitation sentence and no placeholder marking any more", () => {
    const html = renderToStaticMarkup(<LanguageSwitch current="de" route="home" />);
    expect(html).not.toContain("Read this page in English");
    expect(html).not.toContain("data-demo");
  });
});
