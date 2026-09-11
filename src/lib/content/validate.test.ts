import { describe, expect, it } from "vitest";

import { parsePage } from "@/src/lib/content/loader";
import { createHubResolver } from "@/src/lib/content/source-refs";
import { checkLifecycle, checkLocaleSet, checkPage } from "@/src/lib/content/validate";

import type { PageContent } from "@/src/lib/content/types";

const resolver = createHubResolver();

// Every fixture below carries an `seo` block because `PageFrontmatterSchema`
// requires one (TS-011 D5, F-2-72): a page artifact without a title and a
// description is a page that cannot be indexed, so it does not validate.
function page(body: string, frontmatterPatch = ""): PageContent {
  return parsePage(
    `---
id: home-de
page_id: TS-019
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

describe("TS-007-A2: the checker resolves every provenance reference", () => {
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

describe("TS-007-A1: the checker validates the page artifact itself", () => {
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
page_id: TS-999
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

describe("TS-007-A5: locale completeness and harmonisation", () => {
  const de = page(
    `## Slot 1

<!-- id: home-1-hero; content_type: hero; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#regional-footprint"]; status: draft -->

**Headline:** Da.`,
  );

  const en = parsePage(
    `---
id: home-de
page_id: TS-019
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
page_id: TS-019
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
page_id: TS-019
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

describe("TS-007-A14 (F-2-40): `check:content` asks the production question", () => {
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
page_id: TS-019
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
