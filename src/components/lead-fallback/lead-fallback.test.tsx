import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { BRIEFING_URL } from "@/src/lib/live/briefing";

import { LeadFallback } from "./lead-fallback";

/**
 * TS-WEB-0016 D6 / A14 and A23, and DEC-0081 §3 — the static fallback of the
 * two remaining lead surfaces.
 *
 * Two facts changed with T-15: the third line is the page's **own contact
 * section**, reached in-page, rather than a second occurrence of the
 * appointment URL (A5), and the three lines are dictionary strings rather than
 * German literals, so the English quote route degrades into English.
 */

const CONSULT = "/deine-region/angebot#kontakt";

describe("lead-fallback", () => {
  it("links `/start`, names Google after the control, and shows the address beside it", () => {
    const html = renderToStaticMarkup(<LeadFallback email="jan@example.de" />);
    expect(html).toContain('href="/start"');
    expect(html).toContain('href="mailto:jan@example.de"');
    expect(html).toContain("Formular öffnen");
    expect(html).toContain("oder per E-Mail:");
    // The marking is associated and sits outside the link (A23).
    const id = /aria-describedby="([^"]+)"/.exec(html)?.[1];
    expect(id).toBeTruthy();
    const anchor = /<a\b[^>]*href="\/start"[^>]*>.*?<\/a>/s.exec(html)?.[0] ?? "";
    expect(anchor).not.toContain("Google");
    expect(html.indexOf(`id="${id}"`)).toBeGreaterThan(html.indexOf("</a>"));
    expect(html).toContain("Daten gehen an Google");
  });

  it("renders no consult line where the surface offers none", () => {
    const html = renderToStaticMarkup(<LeadFallback email="jan@example.de" />);
    expect(html).not.toContain('data-cta="secondary"');
  });

  it("resolves the consult line in-page, at secondary treatment, with no tracker and no marking", () => {
    const html = renderToStaticMarkup(
      <LeadFallback briefingHref={CONSULT} email="jan@example.de" />,
    );
    expect(html).toContain(`href="${CONSULT}"`);
    expect(html).toContain('data-cta="secondary"');
    // A5: the fallback is not a second placement of the appointment URL.
    expect(html).not.toContain(BRIEFING_URL);
    // An in-page target emits nothing (TS-WEB-0016 D7 Measurement).
    expect(html).not.toContain("data-conversion-tracker");
    expect(html).not.toContain('data-cta="primary"');
  });

  it("takes the page's own label over the dictionary default", () => {
    const html = renderToStaticMarkup(
      <LeadFallback
        briefingHref={CONSULT}
        briefingLabel="Lieber erst sprechen? Kennenlerngespräch buchen"
        email="jan@example.de"
      />,
    );
    expect(html).toContain("Lieber erst sprechen? Kennenlerngespräch buchen");
  });

  /**
   * `/dein-kalender/bestellen` step 3 passes the same pair (T-15 review
   * round): TS-WEB-0016-A14 and TS-WEB-0025-A14 both name the booking line as
   * part of the fallback, and on that route the in-page target has to carry
   * the flow's own scope and step or it lands on a different screen
   * (TS-WEB-0025 D8, DEC-0133 §2).
   */
  it("keeps the order flow's scope and step in the in-page target", () => {
    const ORDER_CONSULT = "/dein-kalender/bestellen?orte=schlatkow&schritt=3#kontakt";
    const html = renderToStaticMarkup(
      <LeadFallback
        briefingHref={ORDER_CONSULT}
        briefingLabel="Beratungstermin buchen"
        email="jan@example.de"
      />,
    );
    // `&` is escaped in the attribute, which is what the browser un-escapes.
    expect(html).toContain(`href="${ORDER_CONSULT.replace("&", "&amp;")}"`);
    expect(html).toContain("Beratungstermin buchen");
    expect(html).not.toContain(BRIEFING_URL);
  });

  it("degrades into the page's language, not always into German (F-2-4)", () => {
    const html = renderToStaticMarkup(
      <LeadFallback briefingHref={CONSULT} email="jan@example.de" locale="en" />,
    );
    expect(html).toContain("Open the form");
    expect(html).toContain("or by e-mail:");
    expect(html).toContain("Book an intro call");
    expect(html).toContain("Data goes to Google");
    expect(html).not.toContain("Formular öffnen");
    expect(html).not.toContain("Daten gehen an");
  });
});
