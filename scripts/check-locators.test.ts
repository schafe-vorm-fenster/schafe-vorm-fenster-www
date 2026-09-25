import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  checkLocators,
  linesContaining,
  locatorRoots,
  resolveSourceFile,
  verifyLocator,
} from "./check-locators";

/**
 * A throwaway workspace of the shape the roots expect: a parent directory that
 * stands in for `~/Projects`, a repository inside it, and `node_modules`
 * inside that. Nothing here depends on a committed fixture.
 */
function workspace(files: Record<string, string>): string {
  const parent = mkdtempSync(join(tmpdir(), "locators-"));
  const repo = join(parent, "repo-under-test");
  mkdirSync(join(repo, "specs"), { recursive: true });
  for (const [path, contents] of Object.entries(files)) {
    const full = join(parent, path);
    mkdirSync(join(full, ".."), { recursive: true });
    writeFileSync(full, contents, "utf-8");
  }
  return repo;
}

function artefact(id: string, loc: string, excerpt: string): string {
  return `---\nartefact: requirement\nid: ${id}\nsource:\n  source_id: SRC-0001\n  loc: ${JSON.stringify(loc)}\n  excerpt: ${JSON.stringify(excerpt)}\n---\n\n# ${id}\n`;
}

const ROOTS_OF_NOWHERE = [
  { name: "nowhere", path: join(tmpdir(), "locators-absent-root"), absentBecause: "test" },
];

describe("TS-WEB-0017-A18: the three roots", () => {
  it("derives them from the repository's position, never as an absolute path", () => {
    const roots = locatorRoots("/a/b/repo");
    expect(roots.map((r) => [r.name, r.path])).toEqual([
      ["repository", "/a/b/repo"],
      ["workspace siblings", "/a/b"],
      ["packages", "/a/b/repo/node_modules"],
    ]);
  });

  it("resolves an in-repository path, a sibling path and a package path", () => {
    const repo = workspace({
      "repo-under-test/concept/guide.md": "one\n",
      "sibling-repo/docs/thing.md": "two\n",
      "repo-under-test/node_modules/@scope/pkg/x.md": "three\n",
    });
    const roots = locatorRoots(repo);
    expect(resolveSourceFile("concept/guide.md", roots)?.root.name).toBe("repository");
    expect(resolveSourceFile("sibling-repo/docs/thing.md", roots)?.root.name).toBe("workspace siblings");
    expect(resolveSourceFile("@scope/pkg/x.md", roots)?.root.name).toBe("packages");
  });

  it("refuses a path that climbs out of every root", () => {
    const repo = workspace({ "repo-under-test/concept/guide.md": "one\n" });
    expect(resolveSourceFile("../../../../etc/passwd", locatorRoots(repo))).toBeNull();
  });
});

describe("TS-WEB-0017-A18: the excerpt is the recovery key", () => {
  it("verifies an excerpt that is an exact substring of the named line", () => {
    const repo = workspace({ "repo-under-test/concept/guide.md": "alpha\nbeta gamma\ndelta\n" });
    const { outcome } = verifyLocator(
      { sourceId: "SRC-0001", loc: "concept/guide.md#L2", excerpt: "beta gamma" },
      locatorRoots(repo),
    );
    expect(outcome).toBe("verified");
  });

  it("reports where the statement moved to, rather than failing blind", () => {
    const repo = workspace({ "repo-under-test/concept/guide.md": "x\nx\nx\nbeta gamma\n" });
    const { outcome, message } = verifyLocator(
      { sourceId: "SRC-0001", loc: "concept/guide.md#L2", excerpt: "beta gamma" },
      locatorRoots(repo),
    );
    expect(outcome).toBe("moved");
    expect(message).toContain("concept/guide.md#L4");
  });

  it("separates an irreparable mismatch from a reparable one", () => {
    const repo = workspace({ "repo-under-test/concept/guide.md": "x\ny\nz\n" });
    const { outcome, message } = verifyLocator(
      { sourceId: "SRC-0001", loc: "concept/guide.md#L2", excerpt: "beta gamma" },
      locatorRoots(repo),
    );
    expect(outcome).toBe("gone");
    expect(message).toContain("nowhere in");
    expect(message).not.toContain("MOVED");
  });

  it("treats a locator past the end of the file as the same two cases", () => {
    const repo = workspace({ "repo-under-test/concept/guide.md": "beta gamma\n" });
    expect(
      verifyLocator(
        { sourceId: "SRC-0001", loc: "concept/guide.md#L900", excerpt: "beta gamma" },
        locatorRoots(repo),
      ).outcome,
    ).toBe("moved");
    expect(
      verifyLocator(
        { sourceId: "SRC-0001", loc: "concept/guide.md#L900", excerpt: "not in here" },
        locatorRoots(repo),
      ).outcome,
    ).toBe("gone");
  });

  it("finds every line an excerpt sits on, so an ambiguous repair is visible", () => {
    expect(linesContaining(["a", "beta", "b", "beta"], "beta")).toEqual([2, 4]);
  });
});

describe("TS-WEB-0017-A18: honest degradation", () => {
  it("says NOT CHECKED — not verified — when no root holds the source", () => {
    const { outcome, message } = verifyLocator(
      { sourceId: "SRC-0003", loc: "go-to-market-os/concept/x.md#L12", excerpt: "anything" },
      ROOTS_OF_NOWHERE,
    );
    expect(outcome).toBe("not-checked");
    expect(message).toContain("NOT CHECKED");
    expect(message).toContain('not "passed"');
  });

  it("does not count a NOT CHECKED locator as broken", () => {
    const repo = workspace({
      "repo-under-test/specs/requirements/R.md": artefact(
        "FUN-WEB-0001",
        "go-to-market-os/concept/absent.md#L12",
        "anything",
      ),
    });
    const { tally } = checkLocators(repo);
    expect(tally).toMatchObject({ "not-checked": 1, verified: 0, moved: 0, gone: 0 });
  });

  it("leaves loc UNKNOWN alone — 87 of them are legitimate", () => {
    const { outcome } = verifyLocator(
      { sourceId: "SRC-0006", loc: "UNKNOWN", excerpt: "" },
      ROOTS_OF_NOWHERE,
    );
    expect(outcome).toBe("unknown");
  });

  it("reports a non-line scheme as NOT CHECKED, because this check reads lines", () => {
    for (const anchor of ["P45", "¶12", "M45:12"])
      expect(
        verifyLocator(
          { sourceId: "SRC-0016", loc: `doc.pdf#${anchor}`, excerpt: "x" },
          ROOTS_OF_NOWHERE,
        ).outcome,
      ).toBe("not-checked");
  });

  it("fails a locator whose anchor is none of the four schemes", () => {
    expect(
      verifyLocator(
        { sourceId: "SRC-0001", loc: "doc.md#section-two", excerpt: "x" },
        ROOTS_OF_NOWHERE,
      ).outcome,
    ).toBe("gone");
  });

  it("fails a triple with no excerpt — the excerpt is the recovery key", () => {
    const repo = workspace({ "repo-under-test/concept/guide.md": "beta\n" });
    expect(
      verifyLocator({ sourceId: "SRC-0001", loc: "concept/guide.md#L1", excerpt: "" }, locatorRoots(repo))
        .outcome,
    ).toBe("gone");
  });
});

describe("TS-WEB-0017-A18: the walk", () => {
  it("scans every artefact under specs/ that carries a source triple, and no other", () => {
    const repo = workspace({
      "repo-under-test/concept/guide.md": "beta gamma\n",
      "repo-under-test/specs/requirements/R.md": artefact("FUN-WEB-0001", "concept/guide.md#L1", "beta"),
      "repo-under-test/specs/needs/N.md": artefact("NEED-WEB-0001", "concept/guide.md#L1", "gamma"),
      "repo-under-test/specs/README.md": "# no frontmatter, no triple\n",
    });
    const { artefactsScanned, tally, findings } = checkLocators(repo);
    expect(artefactsScanned).toBe(2);
    expect(tally.verified).toBe(2);
    expect(findings.map((f) => f.id).sort()).toEqual(["FUN-WEB-0001", "NEED-WEB-0001"]);
  });
});
