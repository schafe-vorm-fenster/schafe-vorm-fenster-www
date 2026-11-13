import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  StageCalendar,
  StageCalendarEntry,
  StageChat,
  StageFlyerPhoto,
  StageImage,
  StageRegistration,
  StageWebsiteDates,
} from "./explain-stage";

import type { StageEventRow } from "./explain-stage";

import { dictionary } from "@/src/lib/i18n/dictionary";

/**
 * The graphics are pictures of states. What a unit test can hold is the
 * markup contract: what each one says, what it marks, and — above all —
 * what it does not contain. The square box and the fixed height are CSS
 * facts and belong to the stage's e2e (TS-WEB-0022-A19).
 */

/** Three rows in app parity — the page's sample, marked as such below. */
const ROWS: readonly [StageEventRow, StageEventRow, StageEventRow] = [
  {
    date: "2026-06-14T15:00:00+02:00",
    title: "Sommerfest",
    meta: "Sa · 15:00 · Sportplatz",
    category: "fest",
    categoryLabel: "Dorfleben",
    status: "neu",
  },
  {
    date: "2026-06-17T08:30:00+02:00",
    title: "Bäckerwagen",
    meta: "Di · 8:30 · Dorfplatz",
    category: "merchants",
    categoryLabel: "Versorgung",
  },
  {
    date: "2026-06-19T19:30:00+02:00",
    title: "Chorprobe",
    meta: "Do · 19:30 · Kirche",
    category: "culture",
    categoryLabel: "Kultur",
    status: "abgesagt",
  },
];

const FORM_ELEMENTS = [/<form\b/, /<input\b/, /<button\b/, /<select\b/, /<textarea\b/];

describe("explain-stage: four graphics, no form element in any of them (TS-WEB-0006-A17)", () => {
  const all = [
    renderToStaticMarkup(<StageImage alt="" />),
    renderToStaticMarkup(<StageChat locale="de" reply="Danke" time="10:32" />),
    renderToStaticMarkup(<StageCalendar locale="de" place="Rubkow" provenance="sample" rows={ROWS} />),
    renderToStaticMarkup(<StageRegistration address="calendar.google.com/…" locale="de" />),
  ];

  it("renders no form, input, button, select or textarea", () => {
    for (const html of all) {
      for (const element of FORM_ELEMENTS) expect(html).not.toMatch(element);
    }
  });

  it("names its state on the box, one of four", () => {
    expect(all.map((html) => /data-stage="([a-z]+)"/.exec(html)?.[1])).toEqual([
      "image",
      "chat",
      "calendar",
      "registration",
    ]);
  });
});

describe("StageFlyerPhoto: state 1 of the WhatsApp path, drawn (issue #26)", () => {
  it("is an inline SVG in the square box, hidden from assistive technology", () => {
    const html = renderToStaticMarkup(<StageFlyerPhoto />);
    expect(html).toContain('data-stage="flyer-photo"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("<svg");
    expect(html).not.toContain("<img");
    expect(html).not.toContain("data-placeholder");
  });

  it("carries no colour literal — every fill comes from a token class", () => {
    const html = renderToStaticMarkup(<StageFlyerPhoto />);
    expect(html).not.toMatch(/fill="#|fill="rgb|stroke="#/);
  });
});

describe("StageCalendarEntry and StageWebsiteDates: state 1 of paths 2 and 3, drawn (issue #88, DEC-0174)", () => {
  const drawings = [
    ["calendar-entry", renderToStaticMarkup(<StageCalendarEntry />)],
    ["website-dates", renderToStaticMarkup(<StageWebsiteDates />)],
  ] as const;

  it("is an inline SVG in the box, named by its state, hidden from assistive technology", () => {
    for (const [stage, html] of drawings) {
      expect(html).toContain(`data-stage="${stage}"`);
      expect(html).toContain('aria-hidden="true"');
      expect(html).toContain("<svg");
      expect(html).not.toContain("<img");
    }
  });

  it("is no placeholder: no `data-placeholder`, no hatch, no grey media frame", () => {
    for (const [, html] of drawings) {
      expect(html).not.toContain("data-placeholder");
      expect(html).not.toContain('data-stage="image"');
    }
  });

  it("carries no lettering and no colour literal — no product, no logo", () => {
    for (const [, html] of drawings) {
      expect(html).not.toMatch(/<text\b/);
      expect(html).not.toMatch(/fill="#|fill="rgb|stroke="#/);
      expect(html).not.toMatch(/google/i);
    }
  });
});

describe("StageImage: media-frame at the square", () => {
  it("renders the image with its alt when an asset exists", () => {
    const html = renderToStaticMarkup(
      <StageImage alt="Ein Flyer am Schaufenster" src="/images/real/flyer.jpg" unoptimized />,
    );
    expect(html).toContain("<img");
    expect(html).toContain('alt="Ein Flyer am Schaufenster"');
  });

  it("renders media-frame's missing-photo surface, not an image, without one", () => {
    const html = renderToStaticMarkup(<StageImage alt="" />);
    expect(html).not.toContain("<img");
    expect(html).toContain('aria-hidden="true"');
  });
});

describe("StageChat: no header, the drawn flyer, the reply", () => {
  it("carries no chat header — no mark, no brand name over the bubbles (issue #89, DEC-0174 §2)", () => {
    for (const locale of ["de", "en"] as const) {
      const html = renderToStaticMarkup(<StageChat locale={locale} reply="x" time="10:32" />);
      expect(html).not.toContain(dictionary(locale).siteName);
      expect(html).not.toContain("chatHeader");
    }
  });

  it("draws the flyer until a photo exists — an illustration, never a grey hatch (issue #26)", () => {
    const withoutFlyer = renderToStaticMarkup(<StageChat reply="x" time="10:32" />);
    expect(withoutFlyer).toContain("data-flyer-art");
    expect(withoutFlyer).toContain("<svg");
    expect(withoutFlyer).not.toContain("data-placeholder");

    const withFlyer = renderToStaticMarkup(
      <StageChat flyerAlt="Flyer" flyerSrc="/images/real/flyer.jpg" reply="x" time="10:32" />,
    );
    expect(withFlyer).not.toContain("data-placeholder");
    expect(withFlyer).toContain("<img");
  });

  it("carries the page's reply and timestamp, and is a picture, not a chat", () => {
    const html = renderToStaticMarkup(
      <StageChat reply="Danke! Steht drin." time="10:32" />,
    );
    expect(html).toContain("Danke! Steht drin.");
    expect(html).toContain("10:32");
    expect(html).toContain('<div aria-hidden="true"');
  });
});

describe("StageCalendar: three rows in app parity", () => {
  it("renders the place and exactly three event rows with month and category words", () => {
    const html = renderToStaticMarkup(<StageCalendar place="Rubkow" rows={ROWS} />);
    expect(html).toContain("Rubkow");
    expect(html.match(/<article\b/g)?.length).toBe(3);
    // Day numeral **and** month (SRC-0014 §Event row, parity with the app).
    expect(html).toContain(">JUN<");
    expect(html).toContain('dateTime="2026-06-14"');
    // The category as a word, for every row.
    for (const row of ROWS) expect(html).toContain(row.categoryLabel);
  });

  it("carries a status badge beside the category on the rows that have one", () => {
    const html = renderToStaticMarkup(<StageCalendar place="Rubkow" rows={ROWS} />);
    expect(html).toContain('data-status="neu"');
    expect(html).toContain('data-status="abgesagt"');
    // Two rows carry one, the third none — counted on the rows, not the badges.
    expect(html.match(/<article\b[^>]*data-status=/g)?.length).toBe(2);
    expect(html).toContain("Abgesagt");
    // On the ink panel the paper badge has no hairline to take.
    expect(html).not.toContain('data-ground="paper"');
  });

  it("marks a sample panel and its rows, and leaves live rows unmarked (DEC-0115)", () => {
    const sample = renderToStaticMarkup(
      <StageCalendar place="Rubkow" provenance="sample" rows={ROWS} />,
    );
    expect(sample).toContain('data-placeholder="sample-events"');
    expect(sample.match(/data-demo="true"/g)?.length).toBe(3);

    const live = renderToStaticMarkup(<StageCalendar place="Rubkow" rows={ROWS} />);
    expect(live).not.toContain("data-placeholder");
    expect(live).not.toContain("data-demo");
  });
});

describe("StageRegistration: an illustration of a registration, not a form", () => {
  it("draws the label, the address and the pill as spans", () => {
    const html = renderToStaticMarkup(
      <StageRegistration address="calendar.google.com/calendar/ical/…" locale="de" />,
    );
    const words = dictionary("de").explainStage;
    expect(html).toContain(words.addressLabel);
    expect(html).toContain(words.submit);
    expect(html).toContain("calendar.google.com/calendar/ical/…");
    expect(html).toContain('<div aria-hidden="true"');
    expect(html).not.toContain("data-demo");
  });

  it("draws the source behind the card — the calendar or the website, never a hatch (issue #88, DEC-0174 §1)", () => {
    for (const source of ["calendar", "website"] as const) {
      const html = renderToStaticMarkup(<StageRegistration address="x" locale="de" source={source} />);
      expect(html).toContain(`data-source="${source}"`);
      expect(html).toContain("<svg");
      expect(html).not.toContain("data-placeholder");
    }
  });

  it("marks the English card as generated wording", () => {
    const html = renderToStaticMarkup(<StageRegistration address="x" locale="en" />);
    expect(html).toContain('data-demo="true"');
    expect(html).toContain(dictionary("en").explainStage.submit);
  });

  it("shows a real screenshot instead of the drawing where the page passes one", () => {
    const html = renderToStaticMarkup(
      <StageRegistration address="x" screenshotSrc="/images/real/settings.png" />,
    );
    expect(html).not.toContain("data-placeholder");
    expect(html).toContain("<img");
  });
});
