import { describe, expect, it } from "vitest";

import { unmarkedPoints } from "./check-reviews";

describe("a review is not closed until every point is a task", () => {
  it("passes a point that names its issue, or a reason", () => {
    const text = "## Seite\n\n---\n\nFehler: Der Button ist weiß auf weiß.\n\nIssue: #28\n\n---\n\nLob: gut so.\n\nKein Task: nur Zustimmung.\n";
    expect(unmarkedPoints(text)).toEqual([]);
  });

  it("fails a point that stays in prose — the 2026-09-22 failure", () => {
    const text = "---\n\nDidaktisch: Warum es heute hakt ist zu früh.\n\n---\n\nFehler: Testtermine.\n\nIssue: #52\n";
    expect(unmarkedPoints(text)).toEqual([{ block: 1, firstLine: "Didaktisch: Warum es heute hakt ist zu früh." }]);
  });

  it("ignores a block of only headings, links and images", () => {
    const text = "## dein-kalender\n\nhttps://example.org/seite\n\n![Bild](bild.png)\n\n[Datei](datei.png)\n";
    expect(unmarkedPoints(text)).toEqual([]);
  });

  it("accepts several issues on one line", () => {
    expect(unmarkedPoints("Text.\n\nIssues: #34, #35\n")).toEqual([]);
  });
});
