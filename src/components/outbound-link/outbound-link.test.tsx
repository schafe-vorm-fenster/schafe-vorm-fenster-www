import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { OutboundLink, outboundNoteId } from "./outbound-link";

/**
 * TS-WEB-0016-A23 read off the markup — the browser half is
 * `e2e/contact-section.spec.ts` (row 1) and `e2e/pages/deine-region.spec.ts`
 * (the lead fallback's `/start` link).
 *
 * The criterion has four parts, and three of them were false before T-15: the
 * marking sat *inside* the `<a>` — visible in the `inline` variant, behind a
 * `clip-path` in the two control variants — so it was in the control's
 * accessible name, it was not after the control in DOM order, and nothing
 * associated it programmatically (the control variants' visible copy carried
 * `aria-hidden`).
 */

/** The `<a>` element of a rendered link, as one string. */
function anchorOf(html: string): string {
  return /<a\b[^>]*>.*?<\/a>/s.exec(html)?.[0] ?? "";
}

/** Everything the anchor contributes to its accessible name, tags stripped. */
function accessibleName(html: string): string {
  return anchorOf(html)
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

describe("TS-WEB-0016 D16 / A23: the marking is a separate element after the control", () => {
  const rendered = (props: Partial<Parameters<typeof OutboundLink>[0]> = {}) =>
    renderToStaticMarkup(
      <OutboundLink href="https://calendar.app.google/abc" newTab recipient="Google" {...props}>
        Termin buchen
      </OutboundLink>,
    );

  it("keeps the recipient and the new tab out of the control's accessible name", () => {
    for (const variant of ["inline", "secondary", "quiet"] as const) {
      const name = accessibleName(rendered({ variant }));
      expect(name, variant).toBe("Termin buchen");
      expect(name, variant).not.toContain("Google");
      expect(name, variant).not.toMatch(/neuen Tab|new tab/i);
    }
  });

  it("renders the marking after the anchor, outside it, and associates it", () => {
    for (const variant of ["inline", "secondary", "quiet"] as const) {
      const html = rendered({ variant });
      const id = /aria-describedby="([^"]+)"/.exec(html)?.[1];
      expect(id, variant).toBe(outboundNoteId("https://calendar.app.google/abc"));
      const anchorEnd = html.indexOf("</a>");
      const notePosition = html.indexOf(`id="${id}"`);
      expect(notePosition, `${variant}: after the control`).toBeGreaterThan(anchorEnd);
      expect(anchorOf(html), `${variant}: outside the control`).not.toContain(`id="${id}"`);
      // Not a button, not a link, not a consent control — and in the
      // accessibility tree, since `aria-describedby` has to resolve to it.
      const tag = new RegExp(`<span[^>]*id="${id}"[^>]*>`).exec(html)?.[0] ?? "";
      const note = new RegExp(`<span[^>]*id="${id}"[^>]*>(.*?)</span>`, "s").exec(html)?.[1] ?? "";
      expect(note, variant).toContain("Google");
      expect(note, variant).not.toMatch(/<(a|button|input)\b/);
      expect(tag, variant).not.toContain("aria-hidden");
      expect(tag, variant).not.toContain("role=");
    }
  });

  it("prefers the written sentence over the assembled line", () => {
    const html = rendered({ disclosure: "Öffnet Google Kalender in einem neuen Tab." });
    expect(html).toContain("Öffnet Google Kalender in einem neuen Tab.");
    expect(html).not.toContain("Daten gehen an");
    expect(accessibleName(html)).toBe("Termin buchen");
  });

  it("announces in the page's language, not always in German (F-2-4)", () => {
    expect(rendered({ locale: "en" })).toContain("opens new tab · Data goes to Google");
    expect(rendered({ locale: "de" })).toContain("öffnet neuen Tab · Daten gehen an Google");
  });

  it("renders no marking, and no wrapper, where nothing leaves and no tab opens", () => {
    const html = renderToStaticMarkup(
      <OutboundLink href="https://example.org/x" variant="secondary">
        Zur Quelle
      </OutboundLink>,
    );
    expect(html).not.toContain("aria-describedby");
    expect(html.startsWith("<a")).toBe(true);
  });

  it("stacks the marking under an inline control where D16 names the surface", () => {
    const beside = rendered({ variant: "inline" });
    const stacked = rendered({ variant: "inline", markingOwnLine: true });
    // The wrapper's class is the only difference, and it is the stacked one:
    // D16's Position row applies to the lead fallback's `/start` link, which is
    // an `inline` link. The marking is still after the anchor and associated.
    const wrapperOf = (html: string) => /^<span class="([^"]*)"/.exec(html)?.[1] ?? "";
    // A different wrapper class from the beside-the-line one, and the stacked
    // one. That `.stacked` *composes* `.control` — so the two stacked forms
    // cannot drift apart — is not visible here: this transform maps the local
    // name only. Measured in the real build instead, in the SSR chunk's class
    // map: `"stacked": "…__stacked" + " " + "…__control"`.
    expect(wrapperOf(beside)).not.toBe(wrapperOf(stacked));
    expect(wrapperOf(stacked)).toContain("stacked");
    expect(wrapperOf(beside)).not.toContain("stacked");
    // The marking is still after the anchor, associated, and out of the name.
    const id = /aria-describedby="([^"]+)"/.exec(stacked)?.[1] ?? "";
    expect(id).not.toBe("");
    expect(stacked.indexOf(`id="${id}"`)).toBeGreaterThan(stacked.indexOf("</a>"));
    expect(accessibleName(stacked)).toBe("Termin buchen");
  });

  it("takes a caller's id where one page carries two markings for one target", () => {
    const html = rendered({ noteId: "hero-outbound-note" });
    expect(html).toContain('aria-describedby="hero-outbound-note"');
    expect(html).toContain('id="hero-outbound-note"');
  });
});

describe("outboundNoteId", () => {
  it("derives a stable, scheme-free id from the target", () => {
    expect(outboundNoteId("https://calendar.app.google/VG9bZoYVnFcX1W6F8")).toMatch(
      /^outbound-note-calendar-app-google-vg9bzoyvnfcx1w6f8-[0-9a-z]{7}$/,
    );
    expect(outboundNoteId("/start")).toMatch(/^outbound-note-start-[0-9a-z]{7}$/);
    expect(outboundNoteId("mailto:jan@example.de")).toMatch(
      /^outbound-note-jan-example-de-[0-9a-z]{7}$/,
    );
    // Stable: the same target yields the same id on every render, which is what
    // `aria-describedby` needs across the prerender/hydrate boundary.
    expect(outboundNoteId("/start")).toBe(outboundNoteId("/start"));
  });

  it("never yields a bare prefix, even for a target with no word characters", () => {
    expect(outboundNoteId("https://")).toMatch(/^outbound-note-link-[0-9a-z]{7}$/);
  });

  /**
   * The 48-character bound, asserted at the bound — every other case here is
   * far under it, so the trim order and the collision it implies were both
   * unasserted (review round, T-15).
   */
  it("leaves no dash between the 48-character cut and the fingerprint", () => {
    // `calendar-app-google-beratung-vorpommern-vorland-` is exactly 48
    // characters and its last one is the separator: trimming *before* the
    // slice, which is how this read once, keeps that dash in the slug.
    const id = outboundNoteId("https://calendar.app.google/beratung-vorpommern-vorland/termin");
    expect(id).toMatch(
      /^outbound-note-calendar-app-google-beratung-vorpommern-vorland-[0-9a-z]{7}$/,
    );
    expect(id).not.toContain("vorland--");
  });

  it("does not collide for two targets that agree on the first 48 characters", () => {
    // Both slugs are cut to `…beratung-vorpommern-greifswa`, so before the
    // fingerprint these two shared one DOM id and one `aria-describedby`
    // target. Nine of the twelve outbound URLs in the content packages the
    // markings are rendered from are already past the bound, so the pair was
    // one owner-edited archive row away (review round, T-15).
    const anfrage = outboundNoteId(
      "https://calendar.app.google/beratung-vorpommern-greifswald/anfrage",
    );
    const termin = outboundNoteId(
      "https://calendar.app.google/beratung-vorpommern-greifswald/termin",
    );
    expect(anfrage).not.toBe(termin);
    expect(anfrage.startsWith("outbound-note-calendar-app-google-beratung-vorpommern-greifswa-")).toBe(
      true,
    );
    expect(termin.startsWith("outbound-note-calendar-app-google-beratung-vorpommern-greifswa-")).toBe(
      true,
    );
  });
});
