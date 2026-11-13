import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { describe, expect, it } from "vitest";

import { checkCoverage, readAttestations } from "./check-coverage";

/**
 * A throwaway repository of the smallest shape the check needs: one tactical
 * specification with an acceptance-criteria table, the two Vitest configs it
 * reads its runner globs from, a `package.json` with a `check` chain, and
 * whatever test, meter, workflow or attestation the case is about.
 *
 * `git init` plus one commit, because rule 1 compares the working tree with
 * `HEAD` — a case that wants a *new* criterion writes it after the commit.
 */
function repo(files: Record<string, string>, { commit = true } = {}): string {
  const root = mkdtempSync(join(tmpdir(), "coverage-"));
  const base: Record<string, string> = {
    "package.json": JSON.stringify({
      scripts: {
        check: "pnpm check:specs && pnpm check:brand",
        "check:specs": "tsx scripts/check-specs.ts",
        "check:brand": "tsx scripts/check-brand.ts",
      },
    }),
    "vitest.config.mts": `export default { test: { include: ["src/**/*.test.ts"] } }`,
    "scripts/vitest.config.mts": `export default { test: { include: ["scripts/**/*.test.ts"] } }`,
    "specs/verification/coverage-budget.json": JSON.stringify({ max: { "NAMED ONLY": 0, MISSING: 0 } }),
  };
  for (const [path, contents] of Object.entries({ ...base, ...files })) {
    const full = join(root, path);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, contents, "utf8");
  }
  if (commit) {
    // Scrubbed for the same reason the check scrubs it: these tests also run
    // from inside a pre-commit hook, which exports GIT_DIR.
    const env = { ...process.env };
    for (const name of ["GIT_DIR", "GIT_INDEX_FILE", "GIT_WORK_TREE", "GIT_OBJECT_DIRECTORY"]) delete env[name];
    const git = (...args: string[]): void =>
      void execFileSync("git", args, { cwd: root, stdio: "ignore", env });
    git("init", "-q");
    git("config", "user.email", "test@example.invalid");
    git("config", "user.name", "test");
    git("add", "-A");
    git("commit", "-qm", "fixture");
  }
  return root;
}

/** One acceptance-criteria table, as a tactical specification carries it. */
function spec(rows: Array<[string, string, string]>): Record<string, string> {
  return {
    "specs/tactical/TS-WEB-0001--fixture.tactical.md": `# TS-WEB-0001 — fixture

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
${rows.map(([id, level, check]) => `| ${id} | ${level} | ${check} |`).join("\n")}
`,
  };
}

const budget = (max: Record<string, number>): Record<string, string> => ({
  "specs/verification/coverage-budget.json": JSON.stringify({ max }),
});

describe("TS-WEB-0017-A20: a test title is coverage and a comment is not", () => {
  it("counts an id in a test title as VERIFIED", () => {
    const root = repo({
      ...spec([["TS-WEB-0001-A1", "unit", "the thing holds"]]),
      "src/thing.test.ts": `test("TS-WEB-0001-A1: the thing holds", () => {});`,
    });
    const { criteria, errors } = checkCoverage(root);
    expect(criteria[0]).toMatchObject({ id: "TS-WEB-0001-A1", verdict: "VERIFIED" });
    expect(errors).toEqual([]);
  });

  it("counts an id that appears only in a comment as NAMED ONLY, never as coverage", () => {
    // This is the defect the check exists for: on 2026-09-26 two prose
    // mentions in comments took a criterion out of `check:specs` W3.
    const root = repo({
      ...spec([["TS-WEB-0001-A1", "unit", "the thing holds"]]),
      "src/thing.test.ts": `// TS-WEB-0001-A1 is not walked yet — see the open ledger.\ntest("the thing holds", () => {});`,
      ...budget({ "NAMED ONLY": 1, MISSING: 0 }),
    });
    const { criteria } = checkCoverage(root);
    expect(criteria[0].verdict).toBe("NAMED ONLY");
    expect(criteria[0].instrument).toContain("outside any test title");
  });

  it("counts an id nothing mentions as MISSING", () => {
    const root = repo({
      ...spec([["TS-WEB-0001-A1", "unit", "the thing holds"]]),
      ...budget({ "NAMED ONLY": 0, MISSING: 1 }),
    });
    expect(checkCoverage(root).criteria[0].verdict).toBe("MISSING");
  });

  it("reads a describe title and a template literal too", () => {
    const root = repo({
      ...spec([
        ["TS-WEB-0001-A1", "unit", "one"],
        ["TS-WEB-0001-A2", "integration", "two"],
      ]),
      "src/a.test.ts": `describe("TS-WEB-0001-A1: one", () => {});`,
      "src/b.test.ts": "it(`TS-WEB-0001-A2: two`, () => {});",
    });
    expect(checkCoverage(root).criteria.map((c) => c.verdict)).toEqual(["VERIFIED", "VERIFIED"]);
  });
});

describe("TS-WEB-0017-A20: the instrument has to be the one the level names", () => {
  it("does not let a test title verify a `tool` criterion — a CI job is the verdict there", () => {
    const root = repo({
      ...spec([["TS-WEB-0001-A1", "tool", "Lighthouse says so"]]),
      "src/thing.test.ts": `test("TS-WEB-0001-A1: Lighthouse says so", () => {});`,
      ...budget({ "NAMED ONLY": 1, MISSING: 0 }),
    });
    expect(checkCoverage(root).criteria[0].verdict).toBe("NAMED ONLY");
  });

  it("counts a workflow step naming a `tool` criterion as METERED", () => {
    const root = repo({
      ...spec([["TS-WEB-0001-A1", "tool", "Lighthouse says so"]]),
      ".github/workflows/ci.yml": `jobs:\n  audit:\n    steps:\n      - name: "TS-WEB-0001-A1 — Lighthouse budget"\n        run: npx lighthouse-ci`,
    });
    const { criteria, errors } = checkCoverage(root);
    expect(criteria[0]).toMatchObject({ verdict: "METERED" });
    expect(errors).toEqual([]);
  });

  it("counts a chain meter naming a `static` criterion as METERED", () => {
    const root = repo({
      ...spec([["TS-WEB-0001-A1", "static", "the token set holds"]]),
      "scripts/check-brand.ts": `fail("TS-WEB-0001-A1", "the token set does not hold");`,
    });
    expect(checkCoverage(root).criteria[0].verdict).toBe("METERED");
  });

  it("ignores a meter the `check` chain does not run", () => {
    const root = repo({
      ...spec([["TS-WEB-0001-A1", "static", "the token set holds"]]),
      "scripts/check-unwired.ts": `fail("TS-WEB-0001-A1", "never runs");`,
      ...budget({ "NAMED ONLY": 0, MISSING: 1 }),
    });
    expect(checkCoverage(root).criteria[0].verdict).toBe("MISSING");
  });
});

describe("TS-WEB-0017-A20: a manual criterion needs a dated attestation, and it expires", () => {
  const register = (date: string, result = "pass"): Record<string, string> => ({
    "specs/verification/manual-checks.md": `| Criterion | Checked | By | Build | Result | Evidence |
| --- | --- | --- | --- | --- | --- |
| TS-WEB-0001-A1 | ${date} | jan-henrik | abc1234 | ${result} | screenshot |
`,
  });

  it("counts a current row as ATTESTED", () => {
    const root = repo({ ...spec([["TS-WEB-0001-A1", "manual", "a human looked"]]), ...register("2026-09-01") });
    const { criteria, errors } = checkCoverage(root, new Date("2026-09-26T00:00:00Z"));
    expect(criteria[0]).toMatchObject({ verdict: "ATTESTED" });
    expect(errors).toEqual([]);
  });

  it("reopens the criterion once the row is older than ninety days", () => {
    const root = repo({
      ...spec([["TS-WEB-0001-A1", "manual", "a human looked"]]),
      ...register("2026-01-01"),
      ...budget({ "NAMED ONLY": 0, MISSING: 1 }),
    });
    expect(checkCoverage(root, new Date("2026-09-26T00:00:00Z")).criteria[0].verdict).toBe("MISSING");
  });

  it("ignores a row whose result is not a pass", () => {
    const root = repo({
      ...spec([["TS-WEB-0001-A1", "manual", "a human looked"]]),
      ...register("2026-09-20", "fail"),
      ...budget({ "NAMED ONLY": 0, MISSING: 1 }),
    });
    expect(checkCoverage(root, new Date("2026-09-26T00:00:00Z")).criteria[0].verdict).toBe("MISSING");
  });

  it("refuses an attestation for a criterion whose level is not manual", () => {
    const root = repo({
      ...spec([["TS-WEB-0001-A1", "e2e", "the browser does it"]]),
      ...register("2026-09-20"),
      ...budget({ "NAMED ONLY": 0, MISSING: 1 }),
    });
    const { errors } = checkCoverage(root, new Date("2026-09-26T00:00:00Z"));
    expect(errors.join("\n")).toContain("a human statement is not the instrument at that level");
  });

  it("counts the ninetieth day as still valid and the day after as expired", () => {
    // 2026-06-28 + 90 days is 2026-09-26, so that day still holds and the
    // next one does not. The boundary is stated here so a later change to
    // ATTESTATION_DAYS cannot move it silently.
    const root = repo({ ...spec([["TS-WEB-0001-A1", "manual", "x"]]), ...register("2026-06-28") });
    const on = readAttestations(root, new Date("2026-09-26T00:00:00Z")).get("TS-WEB-0001-A1");
    const after = readAttestations(root, new Date("2026-09-27T00:00:00Z")).get("TS-WEB-0001-A1");
    expect(on).toMatchObject({ expires: "2026-09-26", expired: false });
    expect(after?.expired).toBe(true);
  });
});

describe("TS-WEB-0017-A21: rule 1 — a criterion born without an instrument fails", () => {
  it("fails on a criterion this commit adds and nothing verifies", () => {
    const root = repo(spec([["TS-WEB-0001-A1", "unit", "old"]]));
    // Written after the commit, so it is new in the working tree.
    writeFileSync(
      join(root, "specs/tactical/TS-WEB-0001--fixture.tactical.md"),
      `## Acceptance criteria\n\n| ID | Level | Check |\n| --- | --- | --- |\n| TS-WEB-0001-A1 | unit | old |\n| TS-WEB-0001-A2 | unit | brand new |\n`,
      "utf8",
    );
    const { errors } = checkCoverage(root);
    expect(errors.join("\n")).toContain("TS-WEB-0001-A2 is new in this commit and nothing verifies it");
    expect(errors.join("\n")).toContain("a test whose title carries the id");
  });

  it("passes when the new criterion arrives with its test", () => {
    const root = repo({
      ...spec([["TS-WEB-0001-A1", "unit", "old"]]),
      "src/a.test.ts": `test("TS-WEB-0001-A1: old", () => {});`,
    });
    writeFileSync(
      join(root, "specs/tactical/TS-WEB-0001--fixture.tactical.md"),
      `## Acceptance criteria\n\n| ID | Level | Check |\n| --- | --- | --- |\n| TS-WEB-0001-A1 | unit | old |\n| TS-WEB-0001-A2 | unit | brand new |\n`,
      "utf8",
    );
    writeFileSync(join(root, "src/b.test.ts"), `test("TS-WEB-0001-A2: brand new", () => {});`, "utf8");
    expect(checkCoverage(root).errors).toEqual([]);
  });

  it("says NOT CHECKED rather than passing when the tree has no history", () => {
    const root = repo({ ...spec([["TS-WEB-0001-A1", "unit", "x"]]), ...budget({ "NAMED ONLY": 0, MISSING: 1 }) }, { commit: false });
    const { ruleOne } = checkCoverage(root);
    expect(ruleOne).toContain("NOT CHECKED");
    expect(ruleOne).toContain("Not a pass");
  });
});

describe("TS-WEB-0017-A21: rule 2 — the ratchet", () => {
  const two = spec([
    ["TS-WEB-0001-A1", "unit", "one"],
    ["TS-WEB-0001-A2", "unit", "two"],
  ]);

  it("fails when the open count rises above the budget", () => {
    const root = repo({ ...two, ...budget({ "NAMED ONLY": 0, MISSING: 1 }) });
    expect(checkCoverage(root).errors.join("\n")).toContain("MISSING rose from 1 to 2");
  });

  it("fails when it falls, asking for the gain to be recorded", () => {
    const root = repo({
      ...two,
      "src/a.test.ts": `test("TS-WEB-0001-A1: one", () => {});`,
      ...budget({ "NAMED ONLY": 0, MISSING: 2 }),
    });
    const message = checkCoverage(root).errors.join("\n");
    expect(message).toContain("MISSING fell from 2 to 1");
    expect(message).toContain('set "MISSING" to 1');
  });

  it("passes when the tally equals the budget", () => {
    const root = repo({ ...two, ...budget({ "NAMED ONLY": 0, MISSING: 2 }) });
    expect(checkCoverage(root).errors).toEqual([]);
  });

  it("fails when the budget file is absent rather than assuming zero", () => {
    const root = repo(two);
    execFileSync("rm", [join(root, "specs/verification/coverage-budget.json")]);
    expect(checkCoverage(root).errors.join("\n")).toContain("the ratchet has no budget to hold");
  });
});

describe("TS-WEB-0017-A20: the report", () => {
  it("names every open criterion with its level and verdict", () => {
    const root = repo({
      ...spec([
        ["TS-WEB-0001-A1", "unit", "tested"],
        ["TS-WEB-0001-A2", "e2e", "not tested"],
      ]),
      "src/a.test.ts": `test("TS-WEB-0001-A1: tested", () => {});`,
      ...budget({ "NAMED ONLY": 0, MISSING: 1 }),
    });
    checkCoverage(root);
    const report = readFileSync(join(root, "state/coverage.md"), "utf8");
    expect(report).toContain("TS-WEB-0001-A2");
    expect(report).toContain("MISSING");
    expect(report).not.toMatch(/\| TS-WEB-0001-A1 \| unit \| MISSING/);
  });
});
