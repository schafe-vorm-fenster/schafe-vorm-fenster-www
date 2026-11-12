import { readFileSync } from "node:fs";

import * as yaml from "js-yaml";
import { describe, expect, it } from "vitest";

import { contactDisplayValue } from "@/src/lib/contact/contact-channels";
import { pageDescription, pageTitle } from "@/src/lib/routes/metadata";

import { llmsFacts } from "./llms-facts";
import { llmsTxtFor } from "./llms-txt";
import { COMMUNITY_HELP_URL } from "./redirect-map";
import { href, ROUTE_IDS } from "./routes";

/**
 * TS-WEB-0004-A13 — `/llms.txt` in the llmstxt.org shape, with the core facts
 * FUN-WEB-0170 names, every one of them traceable to the hub.
 *
 * The seam is `llmsTxtFor(host)`, the function both the prerendered variant
 * route and the integration suite call. The expected values come from the
 * hub packages themselves (`node_modules/@schafe-vorm-fenster/*`, read at
 * test time) and from the content frontmatter the pages render, never from
 * the module under test, so a price change in the hub or a new meta
 * description on a page fails here before `/llms.txt` contradicts the page.
 */

const DE = "www.schafe-vorm-fenster.de";
const ORIGIN = `https://${DE}`;

function frontmatter(path: string): Record<string, unknown> {
  const match = /^---\n([\s\S]*?)\n---/.exec(readFileSync(path, "utf8"));
  if (!match) throw new Error(`${path}: no frontmatter`);
  return yaml.load(match[1] ?? "") as Record<string, unknown>;
}

const hub = (path: string) => frontmatter(`node_modules/@schafe-vorm-fenster/${path}`);

/** The block between the `>` summary and the first `##` heading. */
function factsBlock(body: string): string[] {
  const lines = body.split("\n");
  const start = lines.findIndex((line) => line.startsWith("> "));
  const end = lines.findIndex((line) => line.startsWith("## "));
  return lines.slice(start + 1, end).filter((line) => line.startsWith("- "));
}

function section(body: string, heading: string): string[] {
  const lines = body.split("\n");
  const start = lines.indexOf(`## ${heading}`);
  if (start < 0) return [];
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => line.startsWith("## "));
  return (end < 0 ? rest : rest.slice(0, end)).filter((line) => line.startsWith("- "));
}

describe("TS-WEB-0004-A13: llms.txt has the llmstxt.org shape", () => {
  const body = llmsTxtFor(DE);
  const lines = body.split("\n");

  it("TS-WEB-0004-A13: opens with the H1, then one `>` summary, then the facts before any H2", () => {
    expect(lines[0]).toBe("# Schafe vorm Fenster");
    expect(lines[1]).toBe("");
    expect(lines[2]).toMatch(/^> \S.{40,}$/);
    expect(lines.filter((line) => line.startsWith("> "))).toHaveLength(1);
    expect(factsBlock(body).length).toBeGreaterThanOrEqual(8);
    // Exactly one H1; everything after the facts is H2-delimited.
    expect(lines.filter((line) => line.startsWith("# "))).toHaveLength(1);
    expect(lines.filter((line) => line.startsWith("### "))).toHaveLength(0);
    // A figure that ends in a full stop is not closed a second time.
    expect(body).not.toMatch(/\.\.(?!\/)/u);
  });

  it("TS-WEB-0004-A13: German is the main language on .de, English is its own section", () => {
    expect(lines).toContain("## Seiten");
    expect(lines).toContain("## Pages in English");
    expect(lines.indexOf("## Seiten")).toBeLessThan(lines.indexOf("## Pages in English"));
    expect(lines[lines.length - 1]).toBe("");
  });

  it("TS-WEB-0004-A13: the last section is `## Optional` with press, legal and help", () => {
    const h2 = lines.filter((line) => line.startsWith("## "));
    expect(h2[h2.length - 1]).toBe("## Optional");
    const optional = section(body, "Optional");
    expect(optional.some((line) => line.includes(`(${ORIGIN}${href("archive", "de")})`))).toBe(true);
    expect(optional.some((line) => line.includes(`(${ORIGIN}${href("legal", "de")})`))).toBe(true);
    expect(optional.some((line) => line.includes(`(${COMMUNITY_HELP_URL})`))).toBe(true);
  });
});

describe("TS-WEB-0004-A13: every page line carries the page's own title and meta description", () => {
  const body = llmsTxtFor(DE);
  const listed = [...section(body, "Seiten"), ...section(body, "Pages in English"), ...section(body, "Optional")];

  for (const locale of ["de", "en"] as const) {
    for (const route of ROUTE_IDS) {
      it(`TS-WEB-0004-A13: ${route}/${locale} is listed once as [title](url): description`, () => {
        const url = `${ORIGIN}${href(route, locale)}`;
        const description = pageDescription(route, locale);
        expect(description, `${route}/${locale} has a meta description`).not.toBe("");
        const matching = listed.filter((line) => line.includes(`](${url})`));
        expect(matching).toEqual([`- [${pageTitle(route, locale)}](${url}): ${description}`]);
      });
    }
  }
});

describe("TS-WEB-0004-A13: the core facts, each read from the hub", () => {
  const facts = factsBlock(llmsTxtFor(DE)).join("\n");

  it("TS-WEB-0004-A13: the three offerings carry the prices the offerings package publishes", () => {
    const free = hub("offerings/community-calendar.offering.md").price as { amount: number };
    const own = hub("offerings/portalize-calendar.offering.md") as {
      price: { amount: number; interval: string; vat: string };
    };
    const region = hub("offerings/portalize-enterprise.offering.md") as {
      price: { amount: number };
      price_status: string;
    };

    expect(free.amount).toBe(0);
    // `\s`: the currency formatter separates figure and sign with a no-break
    // space, exactly as the tier row on `/dein-kalender` does.
    expect(facts).toMatch(/^- Dorfkalender: 0\s€ \(dauerhaft kostenfrei\)/mu);

    expect(own.price).toMatchObject({ amount: 480, interval: "year", vat: "excluded" });
    expect(facts).toMatch(/^- Kalender für die eigene Website: 480\s€ \/ Jahr, zzgl\. USt\./mu);

    expect(region.price_status).toBe("on-request");
    expect(facts).toMatch(/^- Regionalkalender .*: Auf Anfrage/mu);
    // TS-WEB-0026-A4: the internal enterprise figure never reaches a surface.
    expect(facts).not.toContain(String(region.price.amount));
    expect(facts).not.toContain("4.000");
  });

  it("TS-WEB-0004-A13: how dates come in — Google Kalender, WhatsApp, e-mail, a website", () => {
    const publishing = facts.split("\n").find((line) => line.startsWith("- Termine eintragen:"));
    expect(publishing).toBeDefined();
    for (const channel of ["Google Kalender", "WhatsApp", "E-Mail", "Website"]) {
      expect(publishing).toContain(channel);
    }
  });

  it("TS-WEB-0004-A13: provider and founder match the imprint and the people package", () => {
    const imprint = readFileSync("content/legal/imprint.md", "utf8");
    const founder = hub("people/jan-henrik-hempel/jan-henrik-hempel.person.md") as {
      name: string;
      role: string;
    };
    expect(founder.role).toMatch(/^Founder/);
    expect(imprint).toContain(`Geschäftsführer: ${founder.name}`);
    expect(facts).toContain("Schafe vorm Fenster UG (haftungsbeschränkt)");
    expect(facts).toContain("17390 Schmatzin OT Schlatkow");
    expect(facts).toContain(`Gründer und Geschäftsführer: ${founder.name}`);
  });

  it("TS-WEB-0004-A13: the award is the cleared NØRD proof, named as the proof names it", () => {
    const award = hub("proof/noerd-award-2026-smart-community.proof.md") as {
      claim: string;
      usage_rights: string;
      status: string;
    };
    expect(award).toMatchObject({ usage_rights: "cleared", status: "active" });
    expect(award.claim).toContain("NØRD AWARD 2026, Kategorie Smart Community");
    expect(facts).toMatch(/^- Auszeichnung: .*NØRD Award 2026 .*Smart Community/mu);
  });

  it("TS-WEB-0004-A13: region and age are the cleared proofs, inside their wording limits", () => {
    const footprint = hub("proof/regional-footprint.proof.md") as { claim: string; usage_rights: string };
    const since = hub("proof/in-operation-since-2018.proof.md") as {
      claim: string;
      usage_rights: string;
      valid_until: string | Date | null;
    };
    expect(footprint.usage_rights).toBe("cleared");
    expect(footprint.claim).toContain("vier Bundesländern");
    expect(since.usage_rights).toBe("cleared");
    expect(since.claim).toContain("seit 2018 in Betrieb");
    expect(new Date(since.valid_until ?? 0).getTime()).toBeGreaterThan(Date.now());

    const region = facts.split("\n").find((line) => line.startsWith("- Region:"));
    for (const state of ["Mecklenburg-Vorpommern", "Brandenburg", "Niedersachsen", "Baden-Württemberg"]) {
      expect(region).toContain(state);
    }
    expect(facts).toContain("seit 2018 in Betrieb");
    // The proof's own limit: "ununterbrochen" is not documented.
    expect(facts).not.toMatch(/ununterbrochen|Vollbetrieb/u);
  });

  it("TS-WEB-0004-A13: contact is the hub's contact record, languages are the site's locales", () => {
    const contact = facts.split("\n").find((line) => line.startsWith("- Kontakt:"));
    expect(contact).toContain(contactDisplayValue("mail"));
    expect(contact).toContain(contactDisplayValue("phone"));
    expect(contact).toContain("WhatsApp");
    expect(facts).toMatch(/^- Sprachen: Deutsch .*Englisch/mu);
  });

  it("TS-WEB-0004-A13: no product name, no competitor, no internal figure in the facts", () => {
    expect(facts).not.toMatch(/Portalize/u);
  });

  it("TS-WEB-0004-A13: the English facts mirror the German ones line for line", () => {
    // No domain renders the English facts today (side domains carry none), so read the module.
    const en = llmsFacts("en").map((fact) => `- ${fact}`);
    const de = factsBlock(llmsTxtFor(DE));
    expect(en).toHaveLength(de.length);
    expect(en.join("\n")).toMatch(/^- Village calendar \(Dorfkalender\): €0/mu);
    expect(en.join("\n")).toMatch(/€480 \/ year, excl\. VAT/u);
  });
});

describe("TS-WEB-0004-A13: a landing-only domain stays lean", () => {
  for (const host of ["www.schafvormfenster.at", "www.owcezaoknem.pl", "www.sheepoutside.com"]) {
    it(`TS-WEB-0004-A13: ${host} lists only what it serves, and no other domain`, () => {
      const body = llmsTxtFor(host);
      const links = [...body.matchAll(/\]\((https:\/\/[^)]+)\)/gu)].map((match) => match[1]);
      for (const link of links) expect(link).toMatch(new RegExp(`^https://${host.replace(/\./gu, "\\.")}/`, "u"));
      expect(body).not.toContain("/mitmachen");
      expect(body).not.toContain("/dein-kalender");
      expect(body).not.toContain(COMMUNITY_HELP_URL);
      // No facts block on the side domains (owner decision 2026-11-12).
      expect(factsBlock(body)).toEqual([]);
      expect(body.split("\n").filter((line) => line.startsWith("## "))).toEqual([
        expect.stringMatching(/^## (Seiten|Pages)$/u),
        "## Optional",
      ]);
    });
  }
});
