import { readFileSync } from "node:fs";

import * as yaml from "js-yaml";
import { describe, expect, it } from "vitest";

import { offeringPrice, publishablePrice, publishedFigure, type OfferingId } from "./offerings";

/**
 * The table in `offerings.ts` is a transcription of the offering packages'
 * frontmatter. This suite holds the transcription against the packages
 * themselves — `node_modules/@schafe-vorm-fenster/offerings/*.offering.md`,
 * read at test time, never at request time (TS-WEB-0007 D3) — so a price
 * change in the hub fails here before a page prints the old figure.
 */

interface OfferingFrontmatter {
  readonly id: string;
  readonly price: {
    readonly amount: number;
    readonly currency: string;
    readonly interval: string;
    readonly vat: string;
  };
  readonly price_status: string;
}

function frontmatterOf(offering: OfferingId): OfferingFrontmatter {
  const source = readFileSync(
    `node_modules/@schafe-vorm-fenster/offerings/${offering}.offering.md`,
    "utf8",
  );
  const match = /^---\n([\s\S]*?)\n---/.exec(source);
  if (!match) throw new Error(`${offering}: no frontmatter`);
  return yaml.load(match[1] ?? "") as OfferingFrontmatter;
}

describe("TS-WEB-0018-A2: publishablePrice is true only for a `price_status: fixed` offering", () => {
  const EXPECTED: Record<OfferingId, boolean> = {
    "community-calendar": true,
    "portalize-calendar": true,
    "portalize-enterprise": false,
    "custom-data-integration": false,
    "local-advertising": false,
    "portalize-website-widget": false,
  };

  for (const [offering, expected] of Object.entries(EXPECTED) as [OfferingId, boolean][]) {
    it(`${offering}: ${expected}`, () => {
      expect(publishablePrice(offering)).toBe(expected);
    });

    it(`${offering}: agrees with the package's own price_status`, () => {
      expect(frontmatterOf(offering).price_status === "fixed").toBe(expected);
    });
  }
});

describe("TS-WEB-0024-A11: the 480 figure is the package's, not a literal of this repository", () => {
  const packaged = frontmatterOf("portalize-calendar");
  const figure = publishedFigure("portalize-calendar");

  it("reads the amount from the offering frontmatter", () => {
    expect(figure.amount).toBe(packaged.price.amount);
  });

  it("reads the currency and the interval from the offering frontmatter", () => {
    expect(figure.currency).toBe(packaged.price.currency);
    expect(figure.interval).toBe(packaged.price.interval);
  });

  it("carries the net qualifier the package declares (`vat: excluded`), per locale", () => {
    expect(packaged.price.vat).toBe("excluded");
    expect(publishedFigure("portalize-calendar", "de").vatNote).toBeTruthy();
    expect(publishedFigure("portalize-calendar", "en").vatNote).toBeTruthy();
    expect(publishedFigure("portalize-calendar", "de").vatNote).not.toBe(
      publishedFigure("portalize-calendar", "en").vatNote,
    );
  });
});

describe("TS-WEB-0006 D10: the free tier is a permanence statement, the enterprise tier a request", () => {
  it("renders community-calendar as `permanent`, which the package prices at 0 forever", () => {
    const packaged = frontmatterOf("community-calendar");
    expect(offeringPrice("community-calendar").display).toBe("permanent");
    expect(packaged.price.amount).toBe(0);
    expect(packaged.price.interval).toBe("forever");
  });

  it("never carries the enterprise figure, whatever the package holds (TS-WEB-0026-A4)", () => {
    expect(offeringPrice("portalize-enterprise")).toEqual({ display: "on-request" });
    expect(() => publishedFigure("portalize-enterprise")).toThrow();
  });

  it("never carries a figure for the add-on (DEC-0107 §3)", () => {
    expect(offeringPrice("custom-data-integration")).toEqual({ display: "on-request" });
    expect(() => publishedFigure("custom-data-integration")).toThrow();
  });

  it("holds the two withheld offerings as `withheld`, without the widget's indicative figure (TS-WEB-0018 D8, A3)", () => {
    for (const offering of ["local-advertising", "portalize-website-widget"] as const) {
      expect(offeringPrice(offering)).toEqual({ display: "withheld" });
      expect(() => publishedFigure(offering)).toThrow();
    }
    expect(frontmatterOf("portalize-website-widget").price.amount).toBe(5);
  });
});
