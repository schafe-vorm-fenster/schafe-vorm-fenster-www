import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { dictionary } from "@/src/lib/i18n/dictionary";
import { LOCALES } from "@/src/lib/i18n/locales";
import { HEADER_JOBS } from "@/src/lib/routes/navigation";

import { BAND_BLURB_MAX, bandBlurbsOf, bandEntries, isBandStatement } from "./context-band";
import { pageFile, parsePage, slot } from "./loader";

import type { Locale } from "@/src/lib/i18n/locales";

/**
 * TS-WEB-0006 D5 with CG-030 (DEC-0120): the band's blurb comes from the
 * page's own `context-band` slot, falls back to the registry, and is
 * measured against CG-030 either way.
 */

function homePage(locale: Locale) {
  const file = pageFile("home", locale);
  const raw = readFileSync(join(process.cwd(), file), "utf-8");
  return parsePage(raw, { routeId: "home", locale, file });
}

const others = HEADER_JOBS.filter((job) => job.label !== "knowWhatIsOn");

describe("isBandStatement — CG-030 as a predicate", () => {
  it("accepts the owner's publish sentence (68 characters, a statement)", () => {
    expect(
      isBandStatement("Wie du einfach Termine per WhatsApp oder Kalender veröffentlichen kannst"),
    ).toBe(true);
  });

  it("rejects a question (CG-005), an empty line and anything over the budget", () => {
    expect(isBandStatement("Du willst wissen, wer den Dorfkalender macht?")).toBe(false);
    expect(isBandStatement("   ")).toBe(false);
    expect(isBandStatement("x".repeat(BAND_BLURB_MAX))).toBe(true);
    expect(isBandStatement("x".repeat(BAND_BLURB_MAX + 1))).toBe(false);
  });
});

describe("bandBlurbsOf — the slot's list items, by route", () => {
  for (const locale of LOCALES) {
    it(`reads the three items of home-10-context-band (${locale}) and resolves their routes`, () => {
      const band = slot(homePage(locale), "home-10-context-band");
      const blurbs = bandBlurbsOf(band, locale);
      expect([...blurbs.keys()].sort()).toEqual(["about", "calendar", "takePart"]);
      for (const blurb of blurbs.values()) {
        expect(blurb).not.toContain("→");
        expect(blurb).not.toContain("`");
        expect(blurb).not.toMatch(/^\*\*/);
      }
    });
  }

  it("reads the German path in the English artifact (the artifacts write `/mitmachen` in both)", () => {
    const band = slot(homePage("en"), "home-10-context-band");
    expect(bandBlurbsOf(band, "en").get("takePart")).toMatch(/^Want to add dates/);
  });

  it("is empty for no slot and for an empty slot", () => {
    expect(bandBlurbsOf(undefined, "de").size).toBe(0);
    expect(bandBlurbsOf(slot(homePage("de"), "no-such-slot"), "de").size).toBe(0);
  });
});

describe("bandEntries — slot first, registry second, CG-030 always", () => {
  it("takes the slot's blurb where the slot has one, and marks a question as demo", () => {
    const band = slot(homePage("de"), "home-10-context-band");
    const entries = bandEntries(others, "de", band);
    expect(entries.map((entry) => entry.route)).toEqual(["takePart", "calendar", "about"]);
    const about = entries.find((entry) => entry.route === "about")!;
    expect(about.blurb).toBe("Du willst wissen, wer den Dorfkalender macht?");
    expect(about.demo).toBe(true);
  });

  it("falls back to the registry where there is no slot", () => {
    const entries = bandEntries(others, "de");
    const publish = entries.find((entry) => entry.route === "takePart")!;
    expect(publish.blurb).toBe(dictionary("de").contextBand.blurbs.publishDates);
    expect(publish.demo).toBe(false);
  });

  it("falls back per job — a slot naming two of three jobs fills the third from the registry", () => {
    const partial = {
      ...slot(homePage("de"), "home-10-context-band"),
      blocks: [
        {
          kind: "list" as const,
          ordered: false,
          items: ["Wer dahintersteckt: Du willst wissen, wer den Dorfkalender macht? → `/ueber-uns`"],
        },
      ],
    };
    const entries = bandEntries(others, "de", partial);
    expect(entries.find((entry) => entry.route === "calendar")!.blurb).toBe(
      dictionary("de").contextBand.blurbs.yourCalendar,
    );
  });

  for (const locale of LOCALES) {
    it(`every registry blurb (${locale}) is within CG-030's budget, statement or not`, () => {
      for (const blurb of Object.values(dictionary(locale).contextBand.blurbs)) {
        expect(blurb.length, blurb).toBeLessThanOrEqual(BAND_BLURB_MAX);
      }
    });
  }
});
