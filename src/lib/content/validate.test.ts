import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { parsePage } from "@/src/lib/content/loader";
import { createHubResolver } from "@/src/lib/content/source-refs";
import {
  AVOID_TERMS,
  checkCopy,
  checkLifecycle,
  checkLocaleSet,
  checkNoteMarker,
  checkPage,
  checkProductName,
  RENDERED_BLOCKS,
  fieldRole,
  REGISTER_EXEMPT_ROUTES,
} from "@/src/lib/content/validate";
import { ROUTES } from "@/src/lib/routes/routes";

import type { PageContent } from "@/src/lib/content/types";
import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";

const resolver = createHubResolver();

// Every fixture below carries an `seo` block because `PageFrontmatterSchema`
// requires one (TS-WEB-0011 D5, F-2-72): a page artifact without a title and a
// description is a page that cannot be indexed, so it does not validate.
function page(body: string, frontmatterPatch = ""): PageContent {
  return parsePage(
    `---
id: home-de
page_id: TS-WEB-0019
route: "/"
seo:
  "/":
    title: "Fixture-Titel"
    description: "Fixture-Beschreibung"
    provenance: generated
content_type: section
status: draft
locale: de
derived_from:
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
provenance: "sourced"
${frontmatterPatch}---

# Startseite

${body}`,
    { routeId: "home", locale: "de", file: "content/pages/home/de.md" },
  );
}

const checks = (findings: { check: string }[]) => findings.map((f) => f.check);

describe("TS-WEB-0007-A2: the checker resolves every provenance reference", () => {
  it("passes a slot whose record exists in the installed package", () => {
    const findings = checkPage(
      page(
        `## Slot 1

<!-- id: home-1-hero; content_type: hero; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#regional-footprint"]; status: draft -->

**Headline:** Da.`,
      ),
      resolver,
    );
    expect(findings.filter((f) => f.level === "error")).toEqual([]);
  });

  it("fails an unresolvable record id, naming file and record", () => {
    const findings = checkPage(
      page(
        `## Slot 1

<!-- id: home-1-hero; content_type: hero; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#no-such-record"]; status: draft -->

**Headline:** Da.`,
      ),
      resolver,
    );
    const error = findings.find((f) => f.check === "provenance");
    expect(error?.level).toBe("error");
    expect(error?.file).toBe("content/pages/home/de.md");
    expect(error?.slot).toBe("home-1-hero");
    expect(error?.message).toContain("no-such-record");
  });

  it("fails a version that does not match the installed package", () => {
    const findings = checkPage(
      page(
        `## Slot 1

<!-- id: home-1-hero; content_type: hero; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.1.0#regional-footprint"]; status: draft -->

**Headline:** Da.`,
      ),
      resolver,
    );
    expect(checks(findings)).toContain("provenance");
  });

  it("fails a sourced slot with an empty `derived_from` — no source, no update path (D6)", () => {
    const findings = checkPage(
      page(
        `## Slot 1

<!-- id: home-1-hero; content_type: hero; provenance: sourced; derived_from: []; status: draft -->

**Headline:** Da.`,
      ),
      resolver,
    );
    expect(checks(findings)).toContain("provenance");
  });

  it("allows an empty `derived_from` on a generated slot, and requires the demo mark", () => {
    const ok = checkPage(
      page(
        `## Slot 1

<!-- id: home-1-demo; content_type: proof-card; provenance: generated; derived_from: []; status: draft; demo: true -->

**Karte:** Beispiel.`,
      ),
      resolver,
    );
    expect(ok.filter((f) => f.level === "error")).toEqual([]);

    const unmarked = checkPage(
      page(
        `## Slot 1

<!-- id: home-1-demo; content_type: proof-card; provenance: generated; derived_from: []; status: draft -->

**Karte:** Beispiel.`,
      ),
      resolver,
    );
    expect(checks(unmarked)).toContain("dummy-content");
  });
});

describe("TS-WEB-0007-A1: the checker validates the page artifact itself", () => {
  it("fails a slot comment that does not parse", () => {
    const findings = checkPage(
      page(
        `## Slot 1

<!-- id: home-1-hero; content_type: carousel; provenance: sourced; derived_from: [ia]; status: draft -->

**Headline:** Da.`,
      ),
      resolver,
    );
    expect(checks(findings)).toContain("slot-meta");
  });

  it("fails a page whose frontmatter does not validate", () => {
    const broken = parsePage("---\nid: x\n---\n", {
      routeId: "home",
      locale: "de",
      file: "content/pages/home/de.md",
    });
    expect(checks(checkPage(broken, resolver))).toContain("schema");
  });

  it("fails a page whose `page_id` is not the spec the route table names", () => {
    const findings = checkPage(
      parsePage(
        `---
id: home-de
page_id: TS-WEB-0999
route: "/"
seo:
  "/":
    title: "Fixture-Titel"
    description: "Fixture-Beschreibung"
    provenance: generated
content_type: section
status: draft
locale: de
derived_from: ["ia"]
generated_by: "p@1.0.0"
generated_at: "2026-09-11"
provenance: "sourced"
---

## Slot 1

<!-- id: home-1-hero; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Headline:** Da.`,
        { routeId: "home", locale: "de", file: "content/pages/home/de.md" },
      ),
      resolver,
    );
    expect(checks(findings)).toContain("spec-binding");
  });

  it("fails a duplicate slot id inside one page", () => {
    const findings = checkPage(
      page(
        `## Slot 1

<!-- id: home-1-hero; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Headline:** Da.

## Slot 1 again

<!-- id: home-1-hero; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Headline:** Auch da.`,
      ),
      resolver,
    );
    expect(checks(findings)).toContain("slot-binding");
  });
});

describe("TS-WEB-0007-A5: locale completeness and harmonisation", () => {
  const de = page(
    `## Slot 1

<!-- id: home-1-hero; content_type: hero; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#regional-footprint"]; status: draft -->

**Headline:** Da.`,
  );

  const en = parsePage(
    `---
id: home-de
page_id: TS-WEB-0019
route: "/"
seo:
  "/":
    title: "Fixture-Titel"
    description: "Fixture-Beschreibung"
    provenance: generated
content_type: section
status: draft
locale: en
derived_from: ["ia"]
generated_by: "p@1.0.0"
generated_at: "2026-09-11"
provenance: "sourced"
---

## Slot 1

<!-- id: home-1-hero; content_type: hero; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#regional-footprint"]; status: draft -->

**Headline:** There.`,
    { routeId: "home", locale: "en", file: "content/pages/home/en.md" },
  );

  it("passes locale siblings that agree on slots and records, and differ in wording", () => {
    expect(checkLocaleSet("home", { de, en })).toEqual([]);
  });

  it("fails a missing locale sibling by default, and warns when asked to", () => {
    const missing = parsePage("", {
      routeId: "home",
      locale: "en",
      file: "content/pages/home/en.md",
    });
    const errors = checkLocaleSet("home", { de, en: missing });
    expect(errors[0]?.level).toBe("error");
    expect(errors[0]?.check).toBe("locale-completeness");

    const warnings = checkLocaleSet(
      "home",
      { de, en: missing },
      { missingLocale: "warning" },
    );
    expect(warnings[0]?.level).toBe("warning");
  });

  it("fails a locale that ships fewer slots (concept B.4 must-match column)", () => {
    const short = parsePage(
      `---
id: home-de
page_id: TS-WEB-0019
route: "/"
seo:
  "/":
    title: "Fixture-Titel"
    description: "Fixture-Beschreibung"
    provenance: generated
content_type: section
status: draft
locale: en
derived_from: ["ia"]
generated_by: "p@1.0.0"
generated_at: "2026-09-11"
provenance: "sourced"
---

# Home
`,
      { routeId: "home", locale: "en", file: "content/pages/home/en.md" },
    );
    expect(checks(checkLocaleSet("home", { de, en: short }))).toContain(
      "harmonisation",
    );
  });

  it("fails locale variants that bind different records", () => {
    const diverged = parsePage(
      `---
id: home-de
page_id: TS-WEB-0019
route: "/"
seo:
  "/":
    title: "Fixture-Titel"
    description: "Fixture-Beschreibung"
    provenance: generated
content_type: section
status: draft
locale: en
derived_from: ["ia"]
generated_by: "p@1.0.0"
generated_at: "2026-09-11"
provenance: "sourced"
---

## Slot 1

<!-- id: home-1-hero; content_type: hero; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#partner-network"]; status: draft -->

**Headline:** There.`,
      { routeId: "home", locale: "en", file: "content/pages/home/en.md" },
    );
    expect(checks(checkLocaleSet("home", { de, en: diverged }))).toContain(
      "harmonisation",
    );
  });
});

describe("TS-WEB-0007-A14 (F-2-40): `check:content` asks the production question", () => {
  const draftPage = page(
    `<!-- id: home-1-search-hero; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Headline:** Was ist bei dir los?
`,
  );

  it("fails a production build on an unapproved artefact", () => {
    const findings = checkLifecycle(draftPage, "production");
    expect(findings).toHaveLength(1);
    expect(findings[0]!.level).toBe("error");
    expect(findings[0]!.check).toBe("lifecycle");
    expect(findings[0]!.message).toContain("draft");
  });

  it("reports the same artefact as a warning anywhere else — clearance is not a developer's fix", () => {
    for (const environment of ["preview", "development"] as const) {
      const findings = checkLifecycle(draftPage, environment);
      expect(findings.map((f) => f.level), environment).toEqual(["warning"]);
    }
  });

  it("says nothing about an approved artefact", () => {
    const approved = parsePage(
      `---
id: home-de
page_id: TS-WEB-0019
route: "/"
seo:
  "/":
    title: "Fixture-Titel"
    description: "Fixture-Beschreibung"
    provenance: generated
content_type: section
status: approved
locale: de
derived_from:
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
provenance: "sourced"
reviewed_by: "a-person"
reviewed_at: "2026-09-11"
---

# Startseite

<!-- id: home-1-search-hero; content_type: hero; provenance: sourced; derived_from: [ia]; status: approved -->

**Headline:** Was ist bei dir los?
`,
      { routeId: "home", locale: "de", file: "content/pages/home/de.md", environment: "production" },
    );
    expect(approved.ok).toBe(true);
    expect(checkLifecycle(approved, "production")).toEqual([]);
  });
});

/* ---------------------------------------------------------------------------
 * D12 rows 11, 13 and 14 — the copy lint (DEC-0136)
 *
 * Every row below has a passing and a failing fixture, because half of this
 * lint is what it must *not* fail: a kicker that asks a question, `Sie` as the
 * plural pronoun at the start of a sentence, `einfach` as an adverb inside the
 * owner's own sentence, an offering id that contains the product name.
 * ------------------------------------------------------------------------ */

/** A fixture bound to any route and locale — the register row keys on it. */
function pageAt(routeId: RouteId, locale: Locale, body: string): PageContent {
  return parsePage(
    `---
id: fixture
page_id: ${ROUTES[routeId].spec}
route: "${ROUTES[routeId].path[locale]}"
seo:
  "${ROUTES[routeId].path[locale]}":
    title: "Fixture-Titel"
    description: "Fixture-Beschreibung"
    provenance: generated
content_type: section
status: draft
locale: ${locale}
derived_from:
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
provenance: "sourced"
---

# Fixture

## Slot 1

<!-- id: fixture-1; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

${body}`,
    { routeId, locale, file: `content/pages/fixture/${locale}.md` },
  );
}

const slotOf = (body: string) => pageAt("home", "de", body);

describe("TS-WEB-0007-A13 / D12 row 11: the avoid list fails the build (CG-040)", () => {
  it("fails an avoid-list term in a field, naming the field, the term and the replacement", () => {
    const findings = checkCopy(slotOf("**Überschrift:** Was die Leute hier brauchen"));
    const error = findings.find((finding) => finding.check === "avoid-list");
    expect(error?.level).toBe("error");
    expect(error?.slot).toBe("fixture-1");
    expect(error?.message).toContain("Überschrift");
    expect(error?.message).toContain("die Leute");
    expect(error?.message).toContain("die Nachbarn");
  });

  it("fails the English mirror of the same term (CG-041)", () => {
    const findings = checkCopy(pageAt("home", "en", "**Heading:** What the people here need"));
    expect(checks(findings)).toContain("avoid-list");
  });

  it("passes a field that uses the replacement instead", () => {
    expect(checkCopy(slotOf("**Überschrift:** Was die Nachbarn hier brauchen"))).toEqual([]);
  });

  it("reads a list item and a table cell under a field", () => {
    const inCopy = checkCopy(
      slotOf(`**Kandidaten:**

- Die Leute aus dem Nachbardorf`),
    );
    expect(checks(inCopy)).toContain("avoid-list");

    const inTable = checkCopy(
      slotOf(`**Vergleich:**

| Spalte | Wert |
| --- | --- |
| Heute | Die Leute rufen an |`),
    );
    expect(checks(inTable)).toContain("avoid-list");
  });

  it("binds a list to its field across the intro paragraph between them (DEC-0142)", () => {
    // `ueber-uns-3-proof-stream`'s shape: the field, a paragraph naming the
    // pool, then the five rendered items. Position used to exempt them.
    const findings = checkCopy(
      slotOf(`**Überschrift:** Was andere sagen

Pool: der volle `+"`proof`"+`-Bestand (31 Einträge). Fünf Plätze sind besetzbar:

1. Die Leute aus dem Nachbardorf haben es zuerst gesehen.`),
    );
    const error = findings.find((finding) => finding.check === "avoid-list");
    expect(error?.slot).toBe("fixture-1");
    expect(error?.message).toContain("Die Leute");
  });

  it("passes a list the slot marked `<!-- note -->`, and nothing else in the slot", () => {
    // A note quoting a forbidden term in order to forbid it. The marker is the
    // exclusion; a paragraph above the list is not (DEC-0142).
    const marked = checkCopy(
      slotOf(`**Überschrift:** Was die Nachbarn hier brauchen

<!-- note: alles ab hier ist Autorennotiz -->

Drei Abweichungen vom Entwurf, alle aus einer Quelle:

- Kein „die Leute" in der Überschrift — CG-009, und das Review sagt es selbst.`),
    );
    expect(marked).toEqual([]);

    const unmarked = checkCopy(
      slotOf(`**Überschrift:** Was die Nachbarn hier brauchen

Drei Abweichungen vom Entwurf, alle aus einer Quelle:

- Kein „die Leute" in der Überschrift — CG-009, und das Review sagt es selbst.`),
    );
    expect(checks(unmarked)).toContain("avoid-list");
  });

  it("marks only what stands below the marker — the copy above it stays copy (DEC-0142)", () => {
    const findings = checkCopy(
      slotOf(`**Kandidaten:**

- Die Leute aus dem Nachbardorf

<!-- note -->

- Kein „die Leute" hier — CG-009.`),
    );
    expect(findings).toHaveLength(1);
    expect(findings[0]?.message).toContain("Kandidaten");
  });

  it("reads a paragraph the page renders, and the marker is the only way out (DEC-0142 §1)", () => {
    // `dein-kalender-3b-embed-config`'s shape: the heading, then the lead
    // paragraph `app/[lang]/dein-kalender/page.tsx:437` renders.
    const rendered = checkCopy(
      slotOf(`**Überschrift:** Was drinsteht, bestimmt ihr

Die Leute kommen, wie sie reinkommen — und landen trotzdem alle auf eurer Vereinswebseite.`),
    );
    expect(checks(rendered)).toEqual(["avoid-list", "avoid-list"]);
    expect(rendered[0]?.message).toContain("(paragraph)");
    expect(rendered[0]?.message).toContain("Überschrift");

    const marked = checkCopy(
      slotOf(`**Überschrift:** Was drinsteht, bestimmt ihr

<!-- note: ab hier bis zum nächsten Feld Autorennotiz -->

Kein „die Leute" im Vorspann — CG-009, und das Review sagt es selbst.`),
    );
    expect(marked).toEqual([]);
  });

  it("reads a paragraph under no field at all, naming its shape instead of a label", () => {
    const findings = checkCopy(slotOf("Die Leute kommen, wie sie reinkommen."));
    expect(findings[0]?.check).toBe("avoid-list");
    expect(findings[0]?.message.startsWith("(paragraph)")).toBe(true);
  });

  it("never reads a paragraph as a second section title — CG-005 stops at the field", () => {
    // A question below `**Überschrift:**` is the lead, not a heading.
    expect(
      checkCopy(
        slotOf(`**Überschrift:** Drei Wege zu eurem Kalender

Wo soll der Kalender stehen? Das entscheidet den Preis.`),
      ),
    ).toEqual([]);
  });

  it("closes a note region at the next field, so a note cannot silence the copy after it (DEC-0142 §1)", () => {
    const findings = checkCopy(
      slotOf(`**Produktname:** Der Kalender heißt Portalize.

<!-- note: ab hier bis zum nächsten Feld Autorennotiz -->

Kein „die Leute" in diesem Absatz — CG-009.

**Stufen-Kicker:** Was die Leute hier brauchen`),
    );
    expect(findings).toHaveLength(1);
    expect(findings[0]?.message).toContain("Stufen-Kicker");
  });

  it("never reads the field label itself — a slot may be labelled `Warum es zählt`", () => {
    expect(checkCopy(slotOf("**Warum es zählt:** Damit euer Termin ankommt"))).toEqual([]);
  });

  it("fails `im Amt` as the only addressee and passes it beside a second one (CG-036)", () => {
    expect(checks(checkCopy(slotOf("**Text:** Bei euch im Amt liegt der Kalender.")))).toContain(
      "avoid-list",
    );
    expect(checkCopy(slotOf("**Text:** Im Amt und im Verein liegt der Kalender."))).toEqual([]);
  });

  it("fails a generic claim that stands alone and passes the same word in a sentence", () => {
    expect(checks(checkCopy(slotOf("**Überschrift:** Einfach · digital · für alle")))).toContain(
      "avoid-list",
    );
    expect(
      checkCopy(slotOf("**Text:** Ein Dorf braucht einen einfachen Weg, und einfach zu starten.")),
    ).toEqual([]);
  });

  it("exempts the order flow's scope step from the postcode row and nothing else (GL-0012)", () => {
    expect(
      checkCopy(pageAt("order", "de", "**Modus:** Postleitzahl: eine PLZ, alle Orte darin")),
    ).toEqual([]);
    expect(checks(checkCopy(pageAt("place", "de", "**Hinweistext:** Gib deine PLZ ein")))).toContain(
      "avoid-list",
    );
  });

  it("carries every avoid term of the glossary's avoid column", () => {
    const glossary = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../../../specs/glossary/glossary.md"),
      "utf-8",
    );
    // `Portalize` is a count, not a hit (CG-038); `search` is emphasis in
    // GL-0012's prose, not a term.
    const notInThisList = new Set(["Portalize", "search"]);
    const inGlossary = new Set<string>();
    for (const line of glossary.split("\n")) {
      if (!line.startsWith("| GL-")) continue;
      const avoid = line.replace(/^\|/, "").split("|")[4];
      if (!avoid) continue;
      for (const match of avoid.matchAll(/\*([^*]+)\*/g)) {
        const term = match[1].trim();
        if (!notInThisList.has(term)) inGlossary.add(term);
      }
    }
    expect(inGlossary.size).toBeGreaterThan(5);
    for (const term of inGlossary) {
      expect(
        AVOID_TERMS.some((entry) => entry.pattern.test(term)),
        `the avoid list does not carry the glossary term "${term}"`,
      ).toBe(true);
    }
  });

  it("carries every avoid term of the guide's own two CG-040 tables", () => {
    // The goal binds the row to "de and en tables, plus the glossary avoid
    // column". The glossary test above covers the third source; these are the
    // two tables of `concept/website-copy-guide.md` §9, so a row added there
    // fails here instead of passing unnoticed.
    const guide = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../../../concept/website-copy-guide.md"),
      "utf-8",
    );
    const section = guide.slice(guide.indexOf("### CG-040"), guide.indexOf("### CG-041"));
    expect(section).toContain("The avoid list fails the build");
    // `Portalize` is a count, not a hit (CG-038, `checkProductName`).
    const notInThisList = new Set(["Portalize"]);
    const inGuide = new Set<string>();
    for (const line of section.split("\n")) {
      if (!line.startsWith("|")) continue;
      const avoid = line.replace(/^\|/, "").split("|")[0]?.trim();
      if (!avoid || avoid === "Avoid" || /^-+$/.test(avoid)) continue;
      for (const raw of avoid.split("·")) {
        // The row's own scope note (*(as a title)*, *(about this product)*) is
        // the scope, not part of the term: `AvoidScope` carries it.
        const term = raw
          .replace(/\*([^*]*)\*/g, "$1")
          .replace(/\([^)]*\)/g, "")
          .trim();
        if (term && !notInThisList.has(term)) inGuide.add(term);
      }
    }
    expect(inGuide.size).toBeGreaterThan(24);
    for (const term of inGuide) {
      expect(
        AVOID_TERMS.some((entry) => entry.pattern.test(term)),
        `the avoid list does not carry the guide's term "${term}"`,
      ).toBe(true);
    }
  });
});

describe("TS-WEB-0006-A8 / D12 row 13: a section title is a statement (CG-005)", () => {
  it("fails a question mark in every section-title-role label", () => {
    for (const label of [
      "Überschrift",
      "Überschrift (ohne Landkreis)",
      "Fragen-Überschrift",
      "Modul-Überschrift",
      "Abschluss-Überschrift",
      "Section title",
      "Heading",
      "Closing heading",
      "Module heading",
    ]) {
      const findings = checkCopy(slotOf(`**${label}:** Wer euren Termin heute nicht mitbekommt?`));
      expect(
        findings.map((finding) => finding.check),
        `\`${label}\` must be read as a section title`,
      ).toContain("copy-structure");
    }
  });

  it("passes a question in a kicker, a form question and the hero headline (CG-020)", () => {
    for (const label of [
      "Kicker",
      "Kicker der unteren Hälfte",
      "Frage",
      "Question",
      "Headline",
      "h1",
    ]) {
      expect(
        checkCopy(slotOf(`**${label}:** Was hilft euch das?`)),
        `\`${label}\` is not a section title`,
      ).toEqual([]);
    }
  });

  it("passes a quote's source title, which carries a title word and is not one", () => {
    expect(checkCopy(slotOf("**Zitat — Quelle (Titel):** Wer baut hier eigentlich?"))).toEqual([]);
  });

  it("asks for the label or the kicker split, never for the words to be dropped", () => {
    // The quiet line under `/dein-ort/starten`'s closing CTA is the polish
    // brief's own wording (page 3, fix 3) and its page renders it as a `<p>`.
    // Read as a title it fails; the repair is the label, and the finding says
    // so, because the first repair taken here was to cut the question.
    const [finding] = checkCopy(slotOf("**Überschrift:** Falsch getippt? Nochmal suchen"));
    expect(finding?.check).toBe("copy-structure");
    expect(finding?.message).toContain("`Kicker` field");
    expect(finding?.message).toContain("relabel it");
    expect(finding?.message).toContain("Never drop the words");
  });

  it("passes the same words under the label the page's own render asks for", () => {
    expect(checkCopy(slotOf("**Frage:** Falsch getippt? Nochmal suchen"))).toEqual([]);
    expect(checkCopy(slotOf("**Question:** Mistyped? Search again"))).toEqual([]);
  });

  it("fails `Warum es hakt` as a title and passes it as a kicker (CG-005)", () => {
    expect(checks(checkCopy(slotOf("**Überschrift:** Warum es heute hakt")))).toContain(
      "avoid-list",
    );
    expect(checkCopy(slotOf("**Kicker:** Warum es heute hakt"))).toEqual([]);
  });
});

describe("TS-WEB-0029-A15 / D12 row 14: one register, one exempt route (CG-003)", () => {
  it("fails a capitalised `Sie` mid-sentence", () => {
    const findings = checkCopy(slotOf("**Text:** Wenn Sie hier etwas eintragen, steht es morgen."));
    const error = findings.find((finding) => finding.check === "register");
    expect(error?.level).toBe("error");
    expect(error?.message).toContain("Sie");
  });

  it("fails `Ihnen` and an imperative `<Verb> Sie`", () => {
    expect(checks(checkCopy(slotOf("**Text:** Der Kalender hilft Ihnen dabei.")))).toContain(
      "register",
    );
    const imperative = checkCopy(slotOf("**Text:** Tragen Sie den Termin ein."));
    expect(imperative[0]?.message).toContain("imperative");
  });

  it("passes `Sie` as the plural pronoun at the start of a sentence, and `Ihr` as the informal plural", () => {
    expect(
      checkCopy(
        slotOf(
          "**Überleitung:** Die Termine tippt niemand bei uns ein. Sie kommen von den Vereinen.",
        ),
      ),
    ).toEqual([]);
    expect(checkCopy(slotOf("**Einstellungs-Überschrift:** Ihr könnt selbst bestimmen"))).toEqual(
      [],
    );
  });

  it("exempts the `legal` route whole, and only that route — the same sentence fails elsewhere", () => {
    const sentence = "**Text:** Wenn Sie Ihre Daten löschen lassen wollen, schreiben Sie uns.";
    expect(checkCopy(pageAt("legal", "de", sentence))).toEqual([]);
    expect(checkCopy(pageAt("legal", "en", sentence))).toEqual([]);
    expect(checks(checkCopy(pageAt("about", "de", sentence)))).toContain("register");
    expect(REGISTER_EXEMPT_ROUTES).toEqual(["legal"]);
  });
});

describe("TS-WEB-0018-A7 / D12 row 11: the product name appears once (CG-038)", () => {
  const tierSlot = (locale: Locale, value: string) =>
    parsePage(
      `---
id: fixture
page_id: ${ROUTES.calendar.spec}
route: "${ROUTES.calendar.path[locale]}"
seo:
  "${ROUTES.calendar.path[locale]}":
    title: "Fixture-Titel"
    description: "Fixture-Beschreibung"
    provenance: generated
content_type: section
status: draft
locale: ${locale}
derived_from:
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
provenance: "sourced"
---

# Fixture

<!-- id: dein-kalender-4-tiers; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

${value}`,
      { routeId: "calendar", locale, file: `content/pages/dein-kalender/${locale}.md` },
    );

  it("passes one field in the tier slot per locale", () => {
    expect(
      checkProductName([
        tierSlot("de", "**Produktname:** Der Kalender unter eurem Namen heißt Portalize."),
        tierSlot("en", "**Product name:** The calendar under your own name is called Portalize."),
      ]),
    ).toEqual([]);
  });

  it("fails a second field of the same locale", () => {
    const findings = checkProductName([
      tierSlot(
        "de",
        `**Produktname:** Der Kalender unter eurem Namen heißt Portalize.

**Stufen-Kicker:** Portalize`,
      ),
    ]);
    expect(findings).toHaveLength(2);
    expect(findings[0]?.check).toBe("product-name");
    expect(findings[0]?.message).toContain("2 fields");
  });

  it("counts occurrences, not carrier fields — twice in the one allowed field fails", () => {
    const findings = checkProductName([
      tierSlot(
        "de",
        "**Produktname:** Der Kalender heißt Portalize, und Portalize bleibt Portalize.",
      ),
    ]);
    expect(findings).toHaveLength(1);
    expect(findings[0]?.check).toBe("product-name");
    expect(findings[0]?.message).toContain("3 times in one field");
  });

  it("fails the name outside the tier slot, naming the slot it belongs to", () => {
    const findings = checkProductName([
      pageAt("home", "de", "**Überschrift:** So funktioniert Portalize"),
    ]);
    expect(findings[0]?.check).toBe("product-name");
    expect(findings[0]?.message).toContain("dein-kalender-4-tiers");
  });

  it("passes an offering id in a data cell — `portalize-calendar` is not the name", () => {
    expect(
      checkProductName([
        tierSlot(
          "de",
          `**Häkchen je Stufe:**

| Stufe | Häkchen |
| --- | --- |
| portalize-calendar | drei Zeilen |`,
        ),
      ]),
    ).toEqual([]);
  });
});

describe("DEC-0136: the field-role map", () => {
  it("reads a title word in any position of the label", () => {
    expect(fieldRole("Überschrift des Wege-Slots")).toBe("section-title");
    expect(fieldRole("Aussage 1 (Überschrift)")).toBe("section-title");
    expect(fieldRole("Statement 1 (heading)")).toBe("section-title");
    expect(fieldRole("Titel des Erklärmoduls")).toBe("section-title");
  });

  it("reads everything else as `other`", () => {
    for (const label of ["Headline", "Aha-Frage", "Link-Label", "CTA-Label (primär)", "Text"]) {
      expect(fieldRole(label), label).toBe("other");
    }
  });
});


describe("DEC-0142 §6: the `<!-- note -->` marker never covers a block a page renders", () => {
  const withSlot = (slotId: string, body: string): PageContent =>
    parsePage(
      `---
id: fixture
page_id: ${ROUTES.home.spec}
route: "/"
seo:
  "/":
    title: "Fixture-Titel"
    description: "Fixture-Beschreibung"
    provenance: generated
content_type: section
status: draft
locale: de
derived_from:
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
provenance: "sourced"
---

# Fixture

<!-- id: ${slotId}; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

${body}`,
      { routeId: "home", locale: "de", file: "content/pages/fixture/de.md" },
    );

  const bodyFor = (kind: "paragraph" | "list" | "table") =>
    kind === "list"
      ? "- Die Nachbarn haben es zuerst gesehen."
      : kind === "table"
        ? `| Titel | Typ |
| --- | --- |
| Abend der Engagierten | Konferenz |`
        : "Das ist der Kalender von Schlatkow.";

  it("refuses the marker above every rendered block the README names", () => {
    for (const site of RENDERED_BLOCKS) {
      const filler = Array.from({ length: site.index }, () => bodyFor(site.kind)).join("\n\n");
      const body = `**Überschrift:** Was drinsteht, bestimmt ihr

${filler ? `${filler}

` : ""}<!-- note: escape hatch probe -->

${bodyFor(site.kind)}`;
      const findings = checkNoteMarker(withSlot(site.slot, body));
      expect(findings.map((finding) => finding.check)).toEqual(["note-marker"]);
      expect(findings[0]?.message).toContain(site.renderedBy);
      expect(findings[0]?.message).toContain(`${site.kind} ${site.index}`);
    }
  });

  it("allows the marker below the rendered blocks — the shipped placement", () => {
    const body = `**Überschrift:** Was drinsteht, bestimmt ihr

Das ist der Kalender von Schlatkow.

Er zeigt genau das, was dort ansteht.

<!-- note: ab hier bis zum nächsten Feld Autorennotiz -->

Zwei Sätze statt fünf Zeilen (Review 2026-09-22).`;
    expect(checkNoteMarker(withSlot("dein-kalender-3b-embed-config", body))).toEqual([]);
  });

  it("says nothing about a slot no page reads by index", () => {
    expect(
      checkNoteMarker(
        withSlot(
          "fixture-1",
          `**Überschrift:** Was drinsteht, bestimmt ihr

<!-- note -->

Kein „die Leute" hier — CG-009.`,
        ),
      ),
    ).toEqual([]);
  });
});
