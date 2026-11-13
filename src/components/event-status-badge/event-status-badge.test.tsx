import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { EventRow } from "../event-row/event-row";

import { EVENT_STATUSES, EventStatusBadge } from "./event-status-badge";

import { dictionary } from "@/src/lib/i18n/dictionary";

describe("event-status-badge: a status is a word, never colour alone", () => {
  it("renders the dictionary word of every status in both languages", () => {
    for (const status of EVENT_STATUSES) {
      for (const locale of ["de", "en"] as const) {
        const html = renderToStaticMarkup(<EventStatusBadge locale={locale} status={status} />);
        expect(html, `${locale} ${status}`).toContain(dictionary(locale).eventStatus[status]);
        expect(html, `${locale} ${status}`).toContain(`data-status="${status}"`);
      }
    }
  });

  it("marks the English words as generated and the German ones not (DEC-0115)", () => {
    expect(renderToStaticMarkup(<EventStatusBadge locale="de" status="neu" />)).not.toContain(
      "data-demo",
    );
    expect(renderToStaticMarkup(<EventStatusBadge locale="en" status="neu" />)).toContain(
      'data-demo="true"',
    );
    // A content-authored label is somebody's wording, whatever the language.
    expect(
      renderToStaticMarkup(<EventStatusBadge label="Moved" locale="en" status="verschoben" />),
    ).not.toContain("data-demo");
  });

  it("names its ground, so the paper badge can take its hairline on paper only", () => {
    expect(renderToStaticMarkup(<EventStatusBadge status="verschoben" />)).toContain(
      'data-ground="paper"',
    );
    expect(renderToStaticMarkup(<EventStatusBadge ground="ink" status="verschoben" />)).toContain(
      'data-ground="ink"',
    );
  });
});

describe("event-row: a status badge stands beside the category, never instead of it", () => {
  const row = (status?: "neu" | "verschoben" | "abgesagt") =>
    renderToStaticMarkup(
      <EventRow
        category="fest"
        categoryLabel="Dorfleben"
        date="2026-06-14T15:00:00+02:00"
        locale="de"
        meta="Sa · 15:00 · Sportplatz"
        status={status}
        title="Sommerfest"
        tone="dark"
      />,
    );

  it("renders both badges and marks the row", () => {
    const html = row("neu");
    expect(html).toContain("Dorfleben");
    expect(html).toContain('data-status="neu"');
    expect(html).toContain("Neu");
    // On the ink list the badge knows its ground.
    expect(html).toContain('data-ground="ink"');
  });

  it("changes nothing on a row without a status", () => {
    const html = row();
    expect(html).not.toContain("data-status");
    expect(html).not.toContain("data-ground");
  });
});
