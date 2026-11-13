import { readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { legalAnchor } from "@/src/lib/routes/legal-anchors";
import { legacyRedirects } from "@/src/lib/routes/next-routing";
import {
  LEGACY_HELP_SLUGS,
  LEGACY_LIVE_PATHS,
  LEGACY_REDIRECTS,
  LEGACY_URLS,
  redirectMapViolations,
  resolveLegacyRedirect,
} from "@/src/lib/routes/redirect-map";
import { href } from "@/src/lib/routes/routes";
import { everyD1Path } from "@/src/lib/routes/url-inventory";

describe("TS-WEB-0011-A1: the redirect map — no chains, no duplicates, valid targets", () => {
  it("has no violations", () => {
    expect(redirectMapViolations()).toEqual([]);
  });

  it("carries the TS-WEB-0011 D2 confirmed floor", () => {
    const sources = LEGACY_REDIRECTS.map((row) => row.from);
    expect(sources).toEqual(
      expect.arrayContaining(["/hilfe", "/funktionen", "/presse", "/impressum"]),
    );
  });

  it("/hilfe resolves to community-site, per article (DEC-0146), not app root", () => {
    const row = LEGACY_REDIRECTS.find((r) => r.from === "/hilfe");
    expect(row?.to).toBe("https://schafe-vorm-fenster.de/hilfe");
    expect(row?.wildcard).toBe(true);
    expect(row?.preservePath).toBe(true);
  });

  it("/funktionen resolves to the calendar page, the only one still arguing features", () => {
    const row = LEGACY_REDIRECTS.find((r) => r.from === "/funktionen");
    expect(row?.to).toBe(href("calendar", "de"));
  });

  it("/presse resolves to the proof archive", () => {
    const row = LEGACY_REDIRECTS.find((r) => r.from === "/presse");
    expect(row?.to).toBe(href("archive", "de"));
  });

  it("/impressum resolves to the legal page's imprint anchor (TS-WEB-0004 D8)", () => {
    const row = LEGACY_REDIRECTS.find((r) => r.from === "/impressum");
    expect(row?.to).toBe(`${href("legal", "de")}#${legalAnchor("imprint", "de")}`);
  });

  it("row 40: /start carries no redirect-map row — it stays TS-WEB-0016's live route", () => {
    expect(LEGACY_REDIRECTS.some((row) => row.from === "/start")).toBe(false);
  });

  describe("issues 192 and 193: every legacy URL has exactly one successor", () => {
    const live = new Set(LEGACY_LIVE_PATHS);
    const redirected = LEGACY_URLS.filter((path) => !live.has(path));

    it("inventories the 6 pages and the 36 help articles", () => {
      expect(LEGACY_HELP_SLUGS).toHaveLength(36);
      expect(new Set(LEGACY_HELP_SLUGS).size).toBe(36);
      expect(LEGACY_URLS).toHaveLength(6 + 36);
    });

    it("keeps the help slugs in step with the archived articles", () => {
      const archived = readdirSync(join(process.cwd(), "content", "support"))
        .filter((file) => file.endsWith(".md") && file !== "README.md")
        .map((file) => file.replace(/\.md$/, ""))
        .sort();
      expect([...LEGACY_HELP_SLUGS].sort()).toEqual(archived);
    });

    it("gives every redirected legacy URL a destination", () => {
      for (const path of redirected) {
        expect(resolveLegacyRedirect(path), path).not.toBeNull();
      }
    });

    it("leaves the live paths alone", () => {
      for (const path of LEGACY_LIVE_PATHS) {
        expect(resolveLegacyRedirect(path), path).toBeNull();
      }
    });

    it("sends every help article to the same slug on community-site", () => {
      for (const slug of LEGACY_HELP_SLUGS) {
        expect(resolveLegacyRedirect(`/hilfe/${slug}`)).toBe(
          `https://schafe-vorm-fenster.de/hilfe/${slug}`,
        );
      }
    });

    it("answers in one hop: no destination is itself a legacy URL, no loop", () => {
      const sources = new Set(LEGACY_REDIRECTS.map((row) => row.from));
      for (const path of redirected) {
        const target = resolveLegacyRedirect(path)!;
        // An external target is another site's path, not ours to chain through.
        if (!target.startsWith("/")) continue;
        const targetPath = target.split(/[?#]/)[0]!;
        expect(sources.has(targetPath), `${path} -> ${target}`).toBe(false);
        expect(resolveLegacyRedirect(targetPath), path).toBeNull();
        expect(targetPath).not.toBe(path);
      }
    });

    it("targets either an existing page of the inventory or an owned https URL", () => {
      const inventory = new Set(everyD1Path());
      for (const path of redirected) {
        const target = resolveLegacyRedirect(path)!;
        if (target.startsWith("https://")) {
          expect(new URL(target).hostname).toBe("schafe-vorm-fenster.de");
        } else {
          expect(inventory.has(target.split(/[?#]/)[0]!), `${path} -> ${target}`).toBe(true);
        }
      }
    });

    it("emits a 301 Next.js row per legacy source", () => {
      const rows = legacyRedirects();
      expect(rows.every((row) => row.statusCode === 301)).toBe(true);
      for (const path of redirected.filter((p) => p !== "/hilfe" && !p.startsWith("/hilfe/"))) {
        expect(rows.some((row) => row.source === path), path).toBe(true);
      }
      expect(rows.some((row) => row.source === "/hilfe/:path*")).toBe(true);
    });
  });

  it("detects a chain if one is introduced", () => {
    const withChain = [
      ...LEGACY_REDIRECTS,
      { from: "/alt-a", to: "/alt-b", reason: "test" },
      { from: "/alt-b", to: "/mitmachen", reason: "test" },
    ];
    expect(redirectMapViolations(withChain)).toContain(
      "chain: /alt-a → /alt-b, which redirects again",
    );
  });

  it("detects a duplicate source", () => {
    const withDuplicate = [...LEGACY_REDIRECTS, { ...LEGACY_REDIRECTS[0]! }];
    expect(redirectMapViolations(withDuplicate)).toContain(
      `duplicate source ${LEGACY_REDIRECTS[0]!.from}`,
    );
  });
});
