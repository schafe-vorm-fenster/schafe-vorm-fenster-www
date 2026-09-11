import { describe, expect, it } from "vitest";

import { checkContentTree } from "@/src/lib/content/validate";
import { CONTENT_PAGE_DIRS, loadPage, slot } from "@/src/lib/content/loader";
import { createHubResolver } from "@/src/lib/content/source-refs";
import { LOCALES } from "@/src/lib/i18n/locales";
import { ROUTE_IDS, ROUTES } from "@/src/lib/routes/routes";

import type { RouteId } from "@/src/lib/routes/routes";

const ROUTE_LIST = ROUTE_IDS as readonly RouteId[];

describe("TS-007-A5: every route of the inventory loads its German page artifact", () => {
  it("loads all eleven German page artifacts without an error", async () => {
    const pages = await Promise.all(
      ROUTE_LIST.map((routeId) => loadPage(routeId, "de")),
    );
    const broken = pages.filter((page) => !page.ok);
    expect(broken.map((page) => `${page.routeId}: ${page.reason}`)).toEqual([]);
    expect(new Set(pages.map((page) => page.file)).size).toBe(
      new Set(Object.values(CONTENT_PAGE_DIRS)).size,
    );
  });

  it("gives every page its slots, and every slot a provenance and a status", async () => {
    for (const routeId of ROUTE_LIST) {
      const page = await loadPage(routeId, "de");
      expect(page.slots.length, `${routeId} has slots`).toBeGreaterThan(0);
      for (const contentSlot of page.slots) {
        expect(contentSlot.provenance, `${routeId}/${contentSlot.id}`).not.toBe(
          "unavailable",
        );
        expect(contentSlot.status).toBe("draft");
        expect(contentSlot.empty).toBe(false);
      }
    }
  });

  it("binds every page to the tactical spec the route table names (TS-017-A14)", async () => {
    for (const routeId of ROUTE_LIST) {
      const page = await loadPage(routeId, "de");
      expect(page.frontmatter?.page_id, routeId).toBe(ROUTES[routeId].spec);
    }
  });

  it("keeps slot ids unique inside a page and locale-free across locales (TS-007 D4)", async () => {
    for (const routeId of ROUTE_LIST) {
      const de = await loadPage(routeId, "de");
      const en = await loadPage(routeId, "en");
      const ids = de.slots.map((s) => s.id);
      expect(new Set(ids).size, routeId).toBe(ids.length);
      if (en.ok) expect(en.slots.map((s) => s.id), routeId).toEqual(ids);
    }
  });

  it("serves every configured locale from a sibling file (TS-007 D8)", async () => {
    for (const locale of LOCALES) {
      for (const routeId of ROUTE_LIST) {
        const page = await loadPage(routeId, locale);
        expect(page.ok, `${routeId}/${locale}: ${page.reason ?? ""}`).toBe(true);
      }
    }
  });
});

describe("TS-007-A2: every `derived_from` of the shipped tree resolves", () => {
  it("resolves every page-level and slot-level reference against the installed packages", async () => {
    const resolver = createHubResolver();
    const unresolved: string[] = [];
    for (const locale of LOCALES) {
      for (const routeId of ROUTE_LIST) {
        const page = await loadPage(routeId, locale);
        const refs = [
          ...(page.frontmatter?.derived_from ?? []),
          ...page.slots.flatMap((s) => s.derivedFrom),
        ];
        for (const ref of refs) {
          const result = resolver.resolve(ref);
          if (!result.ok) unresolved.push(`${page.file}: ${ref} — ${result.problem}`);
        }
      }
    }
    expect(unresolved).toEqual([]);
  });
});

describe("TS-007-A8: no content reference is a repository path", () => {
  it("addresses every source by package name and exact version (DEC-042)", async () => {
    for (const locale of LOCALES) {
      for (const routeId of ROUTE_LIST) {
        const page = await loadPage(routeId, locale);
        for (const ref of page.slots.flatMap((s) => s.derivedFrom)) {
          expect(ref.includes("/packages/"), ref).toBe(false);
          expect(ref.endsWith(".md"), ref).toBe(false);
        }
      }
    }
  });
});

describe("TS-007-A5: `pnpm check:content` is green on the shipped tree", () => {
  it("reports no error-level finding", async () => {
    const findings = await checkContentTree();
    const errors = findings.filter((finding) => finding.level === "error");
    expect(
      errors.map((e) => `${e.file}${e.slot ? `#${e.slot}` : ""} [${e.check}] ${e.message}`),
    ).toEqual([]);
  });
});

describe("TS-007-A1: a page renders its slots as typed content, not as markdown", () => {
  it("hands the home hero its authored fields", async () => {
    const page = await loadPage("home", "de");
    const hero = slot(page, "home-1-search-hero");
    expect(hero.empty).toBe(false);
    expect(hero.contentType).toBe("hero");
    expect(Object.keys(hero.fields).length).toBeGreaterThan(0);
    expect(hero.blocks.some((block) => block.kind === "field")).toBe(true);
  });

  it("marks the prototype's dummy-content slots so the badge can render", async () => {
    const page = await loadPage("archive", "de");
    const demo = page.slots.filter((s) => s.demo);
    expect(demo.length).toBeGreaterThan(0);
    for (const contentSlot of demo) {
      expect(contentSlot.provenance).toBe("generated");
    }
  });
});
