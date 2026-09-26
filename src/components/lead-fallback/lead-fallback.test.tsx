import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { BRIEFING_URL } from "@/src/lib/live/briefing";

import { LeadFallback } from "./lead-fallback";

/**
 * TS-WEB-0016 D6 / A14 and A23, and DEC-0081 §3 — the static fallback of the
 * two remaining lead surfaces.
 *
 * What these cases reach is the component, not a browser: the `empty`/`degraded`
 * branch that mounts the fallback cannot be entered on either lead surface while
 * `envoy-form-mount` receives a hard-coded `state="mocked"` (Q-0022). That is
 * half of A14 in each of TS-WEB-0016 and TS-WEB-0025, and `state/open.md` row
 * 266 carries the other half rather than a comment claiming it.
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
   * `/dein-kalender/bestellen` step 3 passes the same pair (T-15 review round):
   * A14 of TS-WEB-0016 and A14 of TS-WEB-0025 both name the booking line as
   * part of the fallback, and on that route the in-page target has to carry the
   * flow's own scope and step or it lands on a different screen (TS-WEB-0025
   * D8, DEC-0133 §2). Both ids are spelled out rather than written bare,
   * because `check:specs` (W3) scans test files for bare acceptance ids
   * including their comments, so a prose mention would discharge a criterion
   * this file does not assert — which is what the review round caught.
   *
   * What this case proves is the component's half only: the href it is handed
   * reaches the anchor un-rewritten, `&` escaped as the attribute needs. That
   * the **page** builds such an href is
   * `app/[lang]/dein-kalender/bestellen/consult-exit.test.ts`.
   */
  it("passes an in-page target with a query through to the anchor, un-rewritten", () => {
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
