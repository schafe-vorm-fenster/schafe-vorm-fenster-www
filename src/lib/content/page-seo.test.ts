import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { beforeAll, describe, expect, it, vi } from "vitest";

import { pageSeo } from "@/src/lib/content/page-seo";

/**
 * TS-011 D5 — the `seo` block of a page artifact is where a route's title and
 * description live. This suite tests the reader at its seam: a content root on
 * disk in, a `{ title, description, provenance }` or `null` out.
 *
 * The failure cases matter as much as the happy one. F-2-72 was a template in
 * code answering for content that did not exist yet; the replacement must not
 * trade that for a route that throws mid-render when an artifact is missing a
 * key (`loader.ts` makes the same promise for slots).
 */

/** A content tree with exactly the artifacts a test needs. */
function contentRootWith(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), "page-seo-"));
  for (const [path, body] of Object.entries(files)) {
    const file = join(root, path);
    mkdirSync(join(file, ".."), { recursive: true });
    writeFileSync(file, body, "utf-8");
  }
  return root;
}

const frontmatter = (seo: string) => `---
id: fixture
page_id: TS-026
route: "/deine-region"
${seo}
content_type: section
status: draft
locale: de
derived_from:
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
provenance: "generated"
---

# Fixture
`;

describe("TS-011 D5: a route's title and description come from its artifact", () => {
  const root = contentRootWith({
    "deine-region/de.md": frontmatter(`seo:
  "/deine-region":
    title: "Kalender für euer ganzes Gebiet"
    description: "Das ganze Kreisgebiet in einem Kalender."
    provenance: generated
  "/deine-region/angebot":
    title: "Angebot für eure Region anfragen"
    description: "Sagt uns, für welches Gebiet der Kalender gelten soll."
    provenance: generated`),
  });

  it("reads the entry of the route that was asked for", () => {
    expect(pageSeo("region", "de", { contentRoot: root })).toEqual({
      title: "Kalender für euer ganzes Gebiet",
      description: "Das ganze Kreisgebiet in einem Kalender.",
      provenance: "generated",
    });
  });

  it("gives two routes that share one artifact two different documents", () => {
    // `/deine-region/angebot` is specified by TS-026 together with
    // `/deine-region` and lives in its file, so the map is keyed per route —
    // two documents to a search engine, two titles (TS-011-A7's uniqueness).
    expect(pageSeo("regionQuote", "de", { contentRoot: root })?.title).toBe(
      "Angebot für eure Region anfragen",
    );
  });

  it("keys on the German route path in the English file too", () => {
    const english = contentRootWith({
      "rechtliches/en.md": frontmatter(`seo:
  "/rechtliches":
    title: "Legal information"
    description: "Imprint, privacy policy, terms of use."
    provenance: generated`),
    });
    // `content/pages/rechtliches/en.md` carries `route: "/legal"`, so the
    // lookup deliberately uses the route table's German path rather than the
    // artifact's own `route` field — the key is locale-free, like a slot id.
    expect(pageSeo("legal", "en", { contentRoot: english })?.title).toBe(
      "Legal information",
    );
  });
});

describe("TS-011 D5: a content gap is a value, never a throw", () => {
  beforeAll(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  it("answers a missing artifact with null", () => {
    expect(pageSeo("home", "de", { contentRoot: "/nowhere/that/exists" })).toBeNull();
  });

  it("answers an artifact with no `seo` block with null", () => {
    const root = contentRootWith({ "home/de.md": frontmatter(`tone_profile: "du-everywhere"`) });
    expect(pageSeo("home", "de", { contentRoot: root })).toBeNull();
  });

  it("answers a `seo` block that does not validate with null", () => {
    const root = contentRootWith({
      "home/de.md": frontmatter(`seo:
  "/":
    title: "Was ist bei dir los?"
    provenance: generated`),
    });
    expect(pageSeo("home", "de", { contentRoot: root })).toBeNull();
  });

  it("answers a route the artifact carries no entry for with null", () => {
    const root = contentRootWith({
      "deine-region/de.md": frontmatter(`seo:
  "/deine-region":
    title: "Kalender für euer ganzes Gebiet"
    description: "Das ganze Kreisgebiet in einem Kalender."
    provenance: generated`),
    });
    expect(pageSeo("region", "de", { contentRoot: root })).not.toBeNull();
    expect(pageSeo("regionQuote", "de", { contentRoot: root })).toBeNull();
  });

  it("rejects an unknown key inside an entry rather than dropping it silently", () => {
    // Same reason `SlotMetaSchema` is strict (F-2-40): a misspelt key that
    // parses is a value nobody can see is missing.
    const root = contentRootWith({
      "home/de.md": frontmatter(`seo:
  "/":
    title: "Was ist bei dir los?"
    descriptionn: "typo"
    provenance: generated`),
    });
    expect(pageSeo("home", "de", { contentRoot: root })).toBeNull();
  });
});
