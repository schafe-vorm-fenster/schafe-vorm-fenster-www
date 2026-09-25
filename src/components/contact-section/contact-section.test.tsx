import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { CONTACT_SECTION_ID, ContactSection } from "./contact-section";
import {
  CONTACT_CHANNEL_IDS,
  contactChannel,
  contactHref,
  contactResponder,
} from "@/src/lib/contact/contact-channels";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { LOCALES } from "@/src/lib/i18n/locales";
import { BRIEFING_RECIPIENT } from "@/src/lib/live/briefing";

/**
 * The component half of TS-WEB-0016-A15, A17, A23 and TS-WEB-0006-A17, read
 * off the static markup the server renders. The browser half — the clicks
 * and the events they fire through the mock tracker, on every route — is the
 * layout mount's (`e2e/contact-section.spec.ts`, T-10).
 */

function render(locale: (typeof LOCALES)[number], route: "home" | "calendar" = "home"): string {
  return renderToStaticMarkup(<ContactSection locale={locale} route={route} />);
}

/** The `<a … data-cta="…">` elements, in DOM order, with their attributes and inner HTML. */
function actionRows(html: string): { attrs: string; inner: string }[] {
  return [...html.matchAll(/<a\b([^>]*\bdata-cta="[^"]*"[^>]*)>([\s\S]*?)<\/a>/g)].map((m) => ({
    attrs: m[1]!,
    inner: m[2]!,
  }));
}

function attr(attrs: string, name: string): string | undefined {
  return new RegExp(`\\b${name}="([^"]*)"`).exec(attrs)?.[1];
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

describe("TS-WEB-0016-A15: exactly four action rows, in D13 order, one scheme each", () => {
  for (const locale of LOCALES) {
    it(`renders four rows on ${locale}: appointment URL, wa.me, tel:, mailto:`, () => {
      const rows = actionRows(render(locale));
      expect(rows).toHaveLength(4);
      expect(rows.map((row) => attr(row.attrs, "data-channel"))).toEqual([...CONTACT_CHANNEL_IDS]);
      expect(rows.map((row) => attr(row.attrs, "href"))).toEqual(
        CONTACT_CHANNEL_IDS.map((channel) => contactHref(channel)),
      );
      expect(attr(rows[0]!.attrs, "href")).toMatch(/^https:\/\//);
      expect(attr(rows[1]!.attrs, "href")).toMatch(/^https:\/\/wa\.me\/\d+$/);
      expect(attr(rows[2]!.attrs, "href")).toMatch(/^tel:\+\d+$/);
      expect(attr(rows[3]!.attrs, "href")).toMatch(/^mailto:[^?]+$/);
    });
  }

  it("keeps rows 2 and 3 separate although they resolve to the same number", () => {
    expect(contactChannel("whatsapp").address).toBe(contactChannel("phone").address);
    const rows = actionRows(render("de"));
    expect(rows.filter((row) => attr(row.attrs, "data-channel") === "whatsapp")).toHaveLength(1);
    expect(rows.filter((row) => attr(row.attrs, "data-channel") === "phone")).toHaveLength(1);
  });

  it("A19/A20 (D14 §6): no row carries a prefilled text, subject or body", () => {
    for (const row of actionRows(render("de"))) {
      expect(attr(row.attrs, "href")).not.toMatch(/[?&](text|subject|body)=/);
    }
  });
});

describe("TS-WEB-0006-A17 / DEC-0082 B: filled is a weight, never a rank", () => {
  for (const locale of LOCALES) {
    it(`every row is data-cta="secondary" and nothing inside is primary (${locale})`, () => {
      const html = render(locale);
      for (const row of actionRows(html)) expect(attr(row.attrs, "data-cta")).toBe("secondary");
      expect(html).not.toContain('data-cta="primary"');
    });
  }
});

describe("TS-WEB-0016-A17: the trackers around each row", () => {
  it("row 1 sits inside a tracker per goal, rows 2–4 inside one for make-contact only", () => {
    const html = render("de", "calendar");
    const trackers = [...html.matchAll(/data-conversion-tracker="([a-z-]+)"/g)].map((m) => m[1]);
    expect(trackers.filter((id) => id === "make-contact")).toHaveLength(4);
    expect(trackers.filter((id) => id === "request-product-briefing")).toHaveLength(1);
    expect(new Set(trackers).size).toBe(2);

    // The briefing tracker wraps the appointment row and no other.
    const briefingAt = html.indexOf('data-conversion-tracker="request-product-briefing"');
    const appointmentAt = html.indexOf('data-channel="appointment"');
    const whatsappAt = html.indexOf('data-channel="whatsapp"');
    expect(briefingAt).toBeGreaterThan(-1);
    expect(briefingAt).toBeLessThan(appointmentAt);
    expect(appointmentAt).toBeLessThan(whatsappAt);
  });
});

describe("TS-WEB-0016-A23 / D16: the outbound marking on row 1", () => {
  for (const locale of LOCALES) {
    it(`stands as a separate element after the control, associated, and out of the label (${locale})`, () => {
      const html = render(locale);
      const [row1] = actionRows(html);
      const noteId = attr(row1!.attrs, "aria-describedby");
      expect(noteId).toBeTruthy();

      const note = new RegExp(`<p\\b[^>]*\\bid="${noteId}"[^>]*>([\\s\\S]*?)</p>`).exec(html);
      expect(note, "the marking element exists").not.toBeNull();
      expect(html.indexOf(note![0])).toBeGreaterThan(html.indexOf('data-channel="appointment"'));
      expect(note![0]).not.toMatch(/<(a|button|input)\b/);
      expect(stripTags(note![1]!)).toBe(dictionary(locale).contactSection.outboundNote);

      // The control's own label: the row title and its sub-label, no recipient, no tab talk.
      const label = stripTags(row1!.inner);
      expect(label).toContain(dictionary(locale).contactSection.rows.appointment);
      expect(label).not.toContain(BRIEFING_RECIPIENT);
      expect(label.toLowerCase()).not.toMatch(/\btab\b/);
      expect(row1!.attrs).not.toContain("aria-label");
    });
  }

  it("rows 2–4 carry no marking: they do not leave the site for a third party", () => {
    const rows = actionRows(render("de"));
    for (const row of rows.slice(1)) expect(attr(row.attrs, "aria-describedby")).toBeUndefined();
  });
});

describe("SRC-0014 §Contact section and CG-031: what the section shows", () => {
  it(`carries the id "${CONTACT_SECTION_ID}" in both locales, named by its heading`, () => {
    for (const locale of LOCALES) {
      const html = render(locale);
      expect(html).toContain(`id="${CONTACT_SECTION_ID}"`);
      expect(html).toMatch(/<section\b[^>]*aria-labelledby="kontakt-heading"/);
      expect(html).toMatch(/<h2\b[^>]*id="kontakt-heading"/);
    }
  });

  it("shows the responder's name from the hub record and the 96 px portrait with its cleared alt", () => {
    for (const locale of LOCALES) {
      const html = render(locale);
      expect(html).toContain(contactResponder());
      expect(html).toMatch(/<img\b[^>]*\bwidth="96"[^>]*\bheight="96"/);
      expect(html).toContain(`alt="${dictionary(locale).contactSection.portraitAlt}"`);
    }
  });

  it("rows 2–4 show the value itself as their line — never a response time", () => {
    const rows = actionRows(render("de"));
    expect(stripTags(rows[1]!.inner)).toContain(contactChannel("whatsapp").address);
    expect(stripTags(rows[2]!.inner)).toContain(contactChannel("phone").address);
    expect(stripTags(rows[3]!.inner)).toContain(contactChannel("mail").address);
    for (const row of rows) {
      expect(stripTags(row.inner).toLowerCase()).not.toMatch(/antwort|stunden|heute|reply|hours|today/);
    }
  });

  it("keeps the owner's row titles inside each link's name, hairline rows included", () => {
    for (const locale of LOCALES) {
      const rows = actionRows(render(locale));
      const titles = dictionary(locale).contactSection.rows;
      expect(stripTags(rows[0]!.inner)).toContain(titles.appointment);
      expect(stripTags(rows[1]!.inner)).toContain(titles.whatsapp);
      expect(stripTags(rows[2]!.inner)).toContain(titles.phone);
      expect(stripTags(rows[3]!.inner)).toContain(titles.mail);
    }
  });

  it("CG-031 budgets: title ≤ 40, lead ≤ 100, row title ≤ 24, sub-label ≤ 32", () => {
    for (const locale of LOCALES) {
      const d = dictionary(locale).contactSection;
      expect(d.heading.length).toBeLessThanOrEqual(40);
      expect(d.lead.length).toBeLessThanOrEqual(100);
      for (const title of Object.values(d.rows)) expect(title.length).toBeLessThanOrEqual(24);
      expect(d.appointmentSub.length).toBeLessThanOrEqual(32);
    }
  });

  it("marks itself as carrying placeholder strings (DEC-0113), and the icons are decorative", () => {
    const html = render("de");
    expect(html).toMatch(/<section\b[^>]*data-demo="true"/);
    const svgs = html.match(/<svg\b[^>]*>/g) ?? [];
    expect(svgs.length).toBeGreaterThanOrEqual(6);
    for (const svg of svgs) expect(svg).toContain('aria-hidden="true"');
  });
});
