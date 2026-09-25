import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { dictionary } from "@/src/lib/i18n/dictionary";
import { LOCALES } from "@/src/lib/i18n/locales";
import { href } from "@/src/lib/routes/routes";

import { LanguageSwitch } from "./language-switch";

/**
 * TS-WEB-0001 D5 as amended by DEC-0120: the switch renders only the other
 * language as a control, framed as an invitation, and keeps the visitor on
 * the equivalent page (TS-WEB-0001-A7).
 */
describe("language-switch — one control, the other language, the same page", () => {
  for (const current of LOCALES) {
    const other = LOCALES.find((locale) => locale !== current)!;
    const html = renderToStaticMarkup(<LanguageSwitch current={current} route="takePart" />);

    it(`on a ${current} page renders exactly one link, to the ${other} twin of the page`, () => {
      const links = html.match(/<a\b[^>]*>/g) ?? [];
      expect(links).toHaveLength(1);
      expect(links[0]).toContain(`href="${href("takePart", other)}"`);
      expect(links[0]).toMatch(new RegExp(`hreflang="${other}"`, "i"));
      expect(links[0]).toContain(`lang="${other}"`);
    });

    it(`on a ${current} page renders no control for ${current} and no aria-current`, () => {
      expect(html).not.toContain(`href="${href("takePart", current)}"`);
      expect(html).not.toContain("aria-current");
    });

    it(`on a ${current} page frames the control with the ${other} invitation, in ${other}`, () => {
      const words = dictionary(other).languageSwitch;
      expect(html).toContain(words.invitation);
      expect(html).toMatch(new RegExp(`<li[^>]*lang="${other}"`));
      if (words.invitationIsPlaceholder) {
        expect(html).toMatch(/<span[^>]*data-demo="true"[^>]*>/);
      } else {
        expect(html).not.toContain('data-demo="true"');
      }
    });
  }

  it("is a nav named after the footer's language label", () => {
    const html = renderToStaticMarkup(<LanguageSwitch current="de" route="home" />);
    expect(html).toMatch(/<nav[^>]*aria-label="Sprache"/);
  });

  it("the German page's invitation is the owner's sentence, not a placeholder", () => {
    // Review R-home-39, spelling corrected — the one invitation somebody wrote.
    const words = dictionary("en").languageSwitch;
    expect(words.invitation).toBe("Read this page in English:");
    expect(words.invitationIsPlaceholder).toBe(false);
  });
});
