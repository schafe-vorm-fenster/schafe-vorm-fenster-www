import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { PRICE_TIER_CTA_VARIANT, PRICE_TIERS, PriceTierRow, type PriceTierId } from "./price-tier-row";
import { PriceSection } from "./price-section";

import { offeringPrice } from "@/src/lib/pricing/offerings";

const CTA_TARGET: Record<PriceTierId, "takePart" | "order" | "region"> = {
  "community-calendar": "takePart",
  "portalize-calendar": "order",
  "portalize-enterprise": "region",
};

function row(offeringId: PriceTierId, locale: "de" | "en" = "de") {
  return (
    <PriceTierRow
      checks={[{ text: "one" }, { text: "two" }, { text: "three" }]}
      cta={{ label: `cta ${offeringId}`, to: CTA_TARGET[offeringId] }}
      kicker="kicker"
      key={offeringId}
      locale={locale}
      offeringId={offeringId}
      price={offeringPrice(offeringId, locale)}
      title={`title ${offeringId}`}
    />
  );
}

describe("TS-WEB-0024 D6 / DEC-0082: the CTA weight is derived from the tier, never chosen freely", () => {
  it("orders the three tiers community, portalize-calendar, portalize-enterprise", () => {
    expect(PRICE_TIERS).toEqual(["community-calendar", "portalize-calendar", "portalize-enterprise"]);
  });

  it("is quiet · primary-light · quiet — and never pulse (D3, DEC-0082 B)", () => {
    expect(PRICE_TIER_CTA_VARIANT["community-calendar"]).toBe("quiet");
    expect(PRICE_TIER_CTA_VARIANT["portalize-calendar"]).toBe("primary-light");
    expect(PRICE_TIER_CTA_VARIANT["portalize-enterprise"]).toBe("quiet");
    for (const variant of Object.values(PRICE_TIER_CTA_VARIANT)) {
      expect(variant).not.toBe("pulse");
      expect(variant).not.toBe("secondary");
    }
  });
});

describe("TS-WEB-0024-A8 / TS-WEB-0006-A18: exactly one CTA per tier, on the secondary rung", () => {
  for (const offeringId of PRICE_TIERS) {
    it(`${offeringId}: one link, data-cta secondary, never primary, weight ${PRICE_TIER_CTA_VARIANT[offeringId]}`, () => {
      const html = renderToStaticMarkup(row(offeringId));
      expect(html.match(/<a\b/g)).toHaveLength(1);
      expect(html).not.toContain("<button");
      expect(html.split('data-cta="secondary"')).toHaveLength(2);
      expect(html).not.toContain('data-cta="primary"');
      expect(html).toContain(`data-cta-variant="${PRICE_TIER_CTA_VARIANT[offeringId]}"`);
      expect(html).toContain(`data-offering="${offeringId}"`);
    });
  }

  it("resolves tier 1 to /mitmachen, tier 2 to /dein-kalender/bestellen, tier 3 to /deine-region", () => {
    expect(renderToStaticMarkup(row("community-calendar"))).toContain('href="/mitmachen"');
    expect(renderToStaticMarkup(row("portalize-calendar"))).toContain('href="/dein-kalender/bestellen"');
    expect(renderToStaticMarkup(row("portalize-enterprise"))).toContain('href="/deine-region"');
  });

  it("never carries a data-cta of the primary rung, even when asked", () => {
    // The type forbids it; this guards the runtime default.
    const html = renderToStaticMarkup(
      <PriceTierRow
        checks={[]}
        cta={{ label: "x", to: "order", dataCta: "equal-weight" }}
        kicker="k"
        offeringId="portalize-calendar"
        price={offeringPrice("portalize-calendar")}
        title="t"
      />,
    );
    expect(html).toContain('data-cta="equal-weight"');
    expect(html).not.toContain('data-cta="primary"');
  });
});

describe("TS-WEB-0006 D10 / TS-WEB-0024-A11: the price line", () => {
  it("renders the 480 figure with its qualifier as one paragraph, from the offering import", () => {
    const html = renderToStaticMarkup(row("portalize-calendar"));
    const paragraph = /<p class="[^"]*price[^"]*">(.*?)<\/p>/.exec(html)?.[1] ?? "";
    expect(paragraph.replace(/<[^>]+>/g, "").replace(/ /g, " ")).toBe("480 € / Jahr, zzgl. USt.");
  });

  it("qualifies in the page's language", () => {
    const html = renderToStaticMarkup(row("portalize-calendar", "en"));
    expect(html).toContain("excl. VAT");
    expect(html).not.toContain("zzgl.");
  });

  it("renders the free tier as a permanence statement — no figure, no 0 €", () => {
    const html = renderToStaticMarkup(row("community-calendar"));
    expect(html).toContain("Dauerhaft kostenfrei");
    expect(html).not.toMatch(/\d\s*€/);
  });

  it("renders the enterprise tier on request — no figure, no range, no 'ab'", () => {
    const html = renderToStaticMarkup(row("portalize-enterprise"));
    const text = html.replace(/<[^>]+>/g, " ");
    expect(text).toContain("Auf Anfrage");
    expect(text).not.toMatch(/\d/);
    expect(text).not.toMatch(/\bab\b/);
  });
});

describe("SRC-0014 §Page Rhythm: three rows inside one paper section", () => {
  it("renders one section on paper with the lime-500 band and three rows in order", () => {
    const html = renderToStaticMarkup(
      <PriceSection dataBlock="tiers" framing="framing" headingId="tiers-heading" headline="headline" kicker="kicker">
        {PRICE_TIERS.map((id) => row(id))}
      </PriceSection>,
    );
    expect(html.match(/<section\b/g)).toHaveLength(1);
    expect(html).toContain('data-surface="paper"');
    expect(html).toContain('data-surface="lime-500"');
    expect(html).toContain('aria-labelledby="tiers-heading"');
    expect(html).toContain('id="tiers-heading"');
    const order = [...html.matchAll(/data-offering="([^"]+)"/g)].map((match) => match[1]);
    expect(order).toEqual([...PRICE_TIERS]);
    expect(html.match(/<h2\b/g)).toHaveLength(1);
    expect(html.match(/<h3\b/g)).toHaveLength(3);
  });
});
