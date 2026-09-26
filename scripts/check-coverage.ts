/**
 * `pnpm check:coverage` — every acceptance criterion, and what actually
 * verifies it.
 *
 * ── The rule is the strategy's own, not this script's ─────────────────────
 *
 * `specs/verification/verification-strategy.md` § *Linking tests to specs*
 * already says it: *"A test names the ID it verifies. That is the entire
 * mechanism."* Every example it gives puts the id in the `describe` or `test`
 * **title**, never in a comment. Its § *Levels* table names the instrument per
 * level — a `scripts/check-*.ts` or an ESLint rule for `static`, Vitest for
 * `unit` and `integration`, Playwright for `e2e`, a CI job for `tool`, a
 * documented human check per release for `manual`. This check enforces that
 * table. It invents nothing.
 *
 * ── Why this exists beside `check:specs` W3 ───────────────────────────────
 *
 * W3 counts a criterion as covered when its identifier appears **anywhere** in
 * a file a runner runs (`check-specs.ts`, the `referencedIds` scan). A comment
 * counts. That is not a theory: on 2026-09-26 a task added two prose mentions
 * of A14 of TS-WEB-0016 to explain that the criterion was *not* yet walked in
 * a browser, and W3 fell from 156 to 155. The criterion the author graded
 * PARTIAL read as covered, by the repository's only automated signal, because
 * somebody wrote its name in a sentence.
 *
 * That is also why the paragraph above writes "A14 of TS-WEB-0016" and not the
 * bare identifier: this file is in the `check` chain, so a bare id here would
 * be scanned like any other — and the verdict it would earn is NAMED ONLY,
 * which is the point. The check caught its own docblock on the first run.
 *
 * So this check does not ask "is the name somewhere". It asks, per criterion:
 * **which instrument, at the level the criterion itself declares, names it?**
 *
 * ── The five verdicts ─────────────────────────────────────────────────────
 *
 *   VERIFIED    A test whose *title* carries the id, in a file a runner runs.
 *               The title, not the body: the runner then prints the id on
 *               every pass and every failure, so the link is visible in the
 *               test output and not only in the source. For `static`, `unit`,
 *               `integration` and `e2e`.
 *   METERED     For `tool` — a `scripts/check-*.ts` that the `check` chain
 *               invokes names the id in the message it fails with. A meter is
 *               the instrument at this level; a test title would be the wrong
 *               place to look.
 *   ATTESTED    For `manual` — a row in
 *               `specs/verification/manual-checks.md` that names the
 *               criterion, the person, the build and the date, and has not
 *               expired. A manual criterion can never be VERIFIED and it is
 *               not therefore exempt: it needs a dated human statement, and
 *               that statement goes stale.
 *   NAMED ONLY  The id appears in a runner file, but in no test title — a
 *               comment, a variable, an annotation. **This is not coverage**
 *               and it is its own verdict rather than being folded into
 *               MISSING, because it is the one that used to read as green.
 *   MISSING     Nothing names it anywhere.
 *
 * ── What gates ───────────────────────────────────────────────────────────
 *
 * Two rules, and the second is the one that ratchets:
 *
 *   1. **A criterion added or amended in this commit must arrive with its
 *      instrument.** No budget, no exception: the set of criteria is read from
 *      the working tree and compared with `git show HEAD:` of the same files,
 *      so a criterion that is new here and is not VERIFIED/METERED/ATTESTED
 *      fails. The backlog cannot grow.
 *   2. **The backlog may only shrink.** `specs/verification/coverage-budget.json`
 *      holds the worst tally this repository is allowed to have, per verdict.
 *      A run that is worse than the budget fails and prints the difference; a
 *      run that is better fails too, with the one-line edit that lowers the
 *      budget, so the improvement is recorded rather than quietly available to
 *      be spent again.
 *
 * Rule 1 is absolute because it is cheap: whoever writes the criterion is the
 * person who knows how to check it. Rule 2 exists because 156 open criteria
 * cannot be closed in one commit, and a warning nobody has to act on is how
 * they got to 156.
 *
 * ── Honest degradation ───────────────────────────────────────────────────
 *
 * `git show` is unavailable in a tree with no history (a fresh export). Rule 1
 * then degrades to "not checked" and says so; rule 2 still holds, because the
 * budget file is in the tree. As with `check:locators`, **"not checked" is
 * never printed as "passed"**.
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

export const budgetFile = (root: string): string => join(root, "specs/verification/coverage-budget.json");
export const manualFile = (root: string): string => join(root, "specs/verification/manual-checks.md");
export const reportFile = (root: string): string => join(root, "state/coverage.md");

/** The six levels of `check:specs` E8, kept in one place here too. */
export const LEVELS = ["static", "unit", "integration", "e2e", "tool", "manual"] as const;
export type Level = (typeof LEVELS)[number];

/** How long a manual attestation counts. After that the criterion reopens. */
const ATTESTATION_DAYS = 90;

export type Verdict = "VERIFIED" | "METERED" | "ATTESTED" | "NAMED ONLY" | "MISSING";

export interface Criterion {
  readonly id: string;
  readonly spec: string;
  readonly level: Level;
  readonly check: string;
  verdict: Verdict;
  instrument: string;
}

const rel = (root: string, file: string): string =>
  file.startsWith(root) ? file.slice(root.length + 1) : file;

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".git") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

// ── The criteria, read off the tactical specifications ────────────────────

/**
 * One row of an `## Acceptance criteria` table: `| id | level | check |`.
 * The table is the spec's own, so this reads the artefact rather than a
 * second list that could drift from it.
 */
export function readCriteria(root: string, fail: (m: string) => void): Criterion[] {
  const out: Criterion[] = [];
  const dir = join(root, "specs/tactical");
  if (!existsSync(dir)) return [];
  const files = walk(dir).filter((f) => f.endsWith(".tactical.md"));
  for (const file of files.sort()) {
    const spec = /\/(TS-WEB-\d+)--/.exec(file)?.[1] ?? rel(root, file);
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const row = /^\|\s*(TS-WEB-\d+-A\d+)\s*\|\s*([a-z0-9]+)\s*\|\s*(.*?)\s*\|\s*$/.exec(line);
      if (!row) continue;
      const [, id, level, check] = row;
      if (!(LEVELS as readonly string[]).includes(level)) {
        fail(`${rel(root, file)}: ${id} declares level "${level}", which is not one of ${LEVELS.join(" | ")}`);
        continue;
      }
      out.push({ id, spec, level: level as Level, check, verdict: "MISSING", instrument: "—" });
    }
  }
  return out;
}

// ── The instruments, read off the runners ─────────────────────────────────

/** `test.include` of a Vitest config, as the config lists it (DEC-0096). */
function vitestInclude(root: string, configFile: string): string[] {
  const raw = readFileSync(join(root, configFile), "utf8");
  const block = /include:\s*\[([\s\S]*?)\]/.exec(raw)?.[1];
  if (!block) throw new Error(`${configFile}: no test.include to read`);
  return [...block.matchAll(/["']([^"']+)["']/g)].map((m) => m[1]);
}

/** The `scripts/*.ts` meters the `check` chain runs, read out of package.json. */
function chainMeters(root: string): string[] {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
    scripts: Record<string, string>;
  };
  return (pkg.scripts.check ?? "")
    .split("&&")
    .map((step) => /^pnpm\s+(check:[\w-]+)$/.exec(step.trim())?.[1])
    .flatMap((name) => {
      const target = name ? /tsx\s+(scripts\/[\w.-]+\.ts)/.exec(pkg.scripts[name] ?? "")?.[1] : undefined;
      return target ? [target] : [];
    });
}

function globToRegExp(glob: string): RegExp {
  const body = glob
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*\//g, "\u0000")
    .replace(/\*/g, "[^/]*")
    .replace(/\u0000/g, "(?:[^/]*/)*");
  return new RegExp(`^${body}$`);
}

function expandGlob(root: string, glob: string): string[] {
  const full = join(root, glob);
  if (!glob.includes("*")) {
    try {
      return statSync(full).isFile() ? [full] : [];
    } catch {
      return [];
    }
  }
  const head = glob.slice(0, glob.indexOf("*"));
  const base = join(root, head.endsWith("/") ? head : dirname(head));
  const match = globToRegExp(glob);
  try {
    return walk(base).filter((f) => match.test(rel(root, f)));
  } catch {
    return [];
  }
}

const ID = /(?<![A-Za-z0-9-])(TS-WEB-\d+-A\d+)(?![0-9A-Za-z-])/g;

/**
 * Titles of `test` / `it` / `describe` calls, and every `test.each` table row
 * title, in one file. Only a title makes the runner print the id, which is
 * what makes a VERIFIED verdict checkable from the outside.
 */
function titlesOf(source: string): string[] {
  const titles: string[] = [];
  for (const m of source.matchAll(
    /\b(?:test|it|describe|scenario)\s*(?:\.\s*\w+\s*(?:\([^)]*\))?\s*)?\(\s*(`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,
  )) {
    titles.push(m[1]);
  }
  return titles;
}

/** A `.feature` file's `Scenario:` lines — the journey runner's titles. */
function featureTitles(source: string): string[] {
  return [...source.matchAll(/^\s*(?:Scenario|Szenario)(?:\s+Outline)?:\s*(.*)$/gm)].map((m) => m[1]);
}

export function classify(root: string, criteria: Criterion[], fail: (m: string) => void): void {
  const byId = new Map(criteria.map((c) => [c.id, c]));

  const globs = [
    ...vitestInclude(root, "vitest.config.mts"),
    ...vitestInclude(root, "scripts/vitest.config.mts"),
    "e2e/**/*.spec.ts",
    "e2e/**/*.spec.tsx",
    "specs/verification/journeys/**/*.feature",
  ];
  const meters = chainMeters(root);

  // 1. Titles of the test runners → VERIFIED. Not for `tool` (a CI job is the
  //    verdict there) and not for `manual` (a human is).
  const seen = new Set<string>();
  const namedSomewhere = new Map<string, string>();
  for (const glob of globs) {
    for (const file of expandGlob(root, glob)) {
      if (seen.has(file)) continue;
      seen.add(file);
      const source = readFileSync(file, "utf8");
      const titles = file.endsWith(".feature") ? featureTitles(source) : titlesOf(source);
      for (const title of titles) {
        for (const m of title.matchAll(ID)) {
          const c = byId.get(m[1]);
          if (!c) continue;
          if (c.level === "tool" || c.level === "manual") continue;
          // `static` may be either: the strategy's table offers "ESLint rule
          // or a `scripts/check-*.ts`", and a Vitest title over a source-level
          // assertion is how this repository writes most of them.
          if (c.verdict !== "VERIFIED") {
            c.verdict = "VERIFIED";
            c.instrument = rel(root, file);
          }
        }
      }
      for (const m of source.matchAll(ID)) {
        if (!namedSomewhere.has(m[1])) namedSomewhere.set(m[1], rel(root, file));
      }
    }
  }

  // 2. The meters and the CI jobs → METERED.
  //
  //    `static`: the strategy's table names a `scripts/check-*.ts` as one of
  //    its two instruments, so a meter in the `check` chain that names the id
  //    is coverage — and unlike a test title, a meter has no title to carry
  //    it, so the id in its failure message is the link.
  //
  //    `tool`: "an external tool is the verdict … CI job". The instrument is a
  //    step in a workflow that names the criterion, or a chain meter that
  //    drives the external tool. A `tool` criterion named nowhere in
  //    `.github/workflows/` has no CI job, whatever a spec says about it.
  const ciFiles = existsSync(join(root, ".github/workflows"))
    ? walk(join(root, ".github/workflows")).filter((f) => /\.ya?ml$/.test(f))
    : [];
  for (const file of [...meters.map((m) => join(root, m)), ...ciFiles]) {
    if (!existsSync(file)) continue;
    const source = readFileSync(file, "utf8");
    const isCi = file.includes(".github/workflows");
    for (const m of source.matchAll(ID)) {
      const c = byId.get(m[1]);
      if (!namedSomewhere.has(m[1])) namedSomewhere.set(m[1], rel(root, file));
      if (!c || c.verdict === "VERIFIED" || c.verdict === "METERED") continue;
      if (c.level === "tool" || (c.level === "static" && !isCi)) {
        c.verdict = "METERED";
        c.instrument = rel(root, file);
      }
    }
  }

  // 3. The manual register → ATTESTED, for `manual` criteria only.
  for (const [id, row] of readAttestations(root)) {
    const c = byId.get(id);
    if (!c) {
      fail(`${rel(root, manualFile(root))}: attests ${id}, which no acceptance-criteria table defines`);
      continue;
    }
    if (c.level !== "manual") {
      fail(
        `${rel(root, manualFile(root))}: attests ${id}, whose level is \`${c.level}\` — a human statement is not the instrument at that level; write the test`,
      );
      continue;
    }
    if (row.expired) continue;
    c.verdict = "ATTESTED";
    c.instrument = `${row.by}, ${row.checked} (expires ${row.expires})`;
  }

  // 4. Whatever is left but named somewhere → NAMED ONLY. This is the verdict
  //    that used to read as coverage.
  for (const c of criteria) {
    if (c.verdict !== "MISSING") continue;
    const where = namedSomewhere.get(c.id);
    if (where) {
      c.verdict = "NAMED ONLY";
      c.instrument = `${where} — outside any test title`;
    }
  }
}

// ── The manual register ───────────────────────────────────────────────────

export interface Attestation {
  readonly by: string;
  readonly checked: string;
  readonly expires: string;
  readonly expired: boolean;
}

/**
 * `| Criterion | Checked | By | Build | Result | Evidence |`, one row per
 * manual check. `Checked` is an ISO date; the row expires
 * ATTESTATION_DAYS after it, because a manual verdict is about a build and
 * the build moves on.
 */
export function readAttestations(root: string, now: Date = new Date()): Map<string, Attestation> {
  const out = new Map<string, Attestation>();
  const file = manualFile(root);
  if (!existsSync(file)) return out;
  const today = new Date(now.toISOString().slice(0, 10));
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const row = /^\|\s*(TS-WEB-\d+-A\d+)\s*\|\s*(\d{4}-\d{2}-\d{2})\s*\|\s*([^|]+?)\s*\|\s*([^|]*?)\s*\|\s*([^|]+?)\s*\|/.exec(line);
    if (!row) continue;
    const [, id, checked, by, , result] = row;
    if (!/^(pass|passed|ok)$/i.test(result.trim())) continue;
    const expiresAt = new Date(checked);
    expiresAt.setDate(expiresAt.getDate() + ATTESTATION_DAYS);
    const expires = expiresAt.toISOString().slice(0, 10);
    out.set(id, { by: by.trim(), checked, expires, expired: expiresAt < today });
  }
  return out;
}

// ── Rule 1: a new criterion arrives with its instrument ───────────────────

/** The criterion ids the previous commit's tactical specs defined. */
export function criteriaAtHead(root: string): Set<string> | undefined {
  // A pre-commit hook exports GIT_DIR, GIT_INDEX_FILE and GIT_WORK_TREE, and
  // they win over `cwd`. Inside the hook that is the same repository, but in a
  // worktree — or in a test over a fixture — it is a different one, and the
  // comparison would silently read the wrong HEAD. So the environment is
  // scrubbed and `cwd` decides, always.
  const env = { ...process.env };
  for (const name of ["GIT_DIR", "GIT_INDEX_FILE", "GIT_WORK_TREE", "GIT_OBJECT_DIRECTORY"]) delete env[name];
  const git = (args: string[]): string => execFileSync("git", args, { cwd: root, encoding: "utf8", env });
  try {
    const files = git(["ls-tree", "-r", "--name-only", "HEAD", "specs/tactical"])
      .split("\n")
      .filter((f) => f.endsWith(".tactical.md"));
    const ids = new Set<string>();
    for (const file of files) {
      const source = git(["show", `HEAD:${file}`]);
      for (const line of source.split("\n")) {
        const row = /^\|\s*(TS-WEB-\d+-A\d+)\s*\|/.exec(line);
        if (row) ids.add(row[1]);
      }
    }
    return ids;
  } catch {
    return undefined; // no history: rule 1 degrades to NOT CHECKED
  }
}
// ── Report and budget ─────────────────────────────────────────────────────

export const VERDICTS: readonly Verdict[] = ["VERIFIED", "METERED", "ATTESTED", "NAMED ONLY", "MISSING"];
export const OPEN: readonly Verdict[] = ["NAMED ONLY", "MISSING"];

export function tally(criteria: Criterion[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const v of VERDICTS) out[v] = criteria.filter((c) => c.verdict === v).length;
  return out;
}

export function writeReport(root: string, criteria: Criterion[], counts: Record<string, number>, ruleOne: string): void {
  const open = criteria.filter((c) => OPEN.includes(c.verdict));
  const perLevel = LEVELS.map((level) => {
    const all = criteria.filter((c) => c.level === level);
    const closed = all.filter((c) => !OPEN.includes(c.verdict)).length;
    return `| ${level} | ${all.length} | ${closed} | ${all.length - closed} | ${all.length ? Math.round((100 * closed) / all.length) : 100} % |`;
  });
  const specs = [...new Set(criteria.map((c) => c.spec))].sort();
  const perSpec = specs.map((spec) => {
    const all = criteria.filter((c) => c.spec === spec);
    const missing = all.filter((c) => OPEN.includes(c.verdict));
    return `| ${spec} | ${all.length} | ${all.length - missing.length} | ${missing.map((c) => c.id.replace(/^TS-WEB-\d+-/, "")).join(" ") || "—"} |`;
  });

  mkdirSync(dirname(reportFile(root)), { recursive: true });
  writeFileSync(
    reportFile(root),
    `<!-- Written by \`pnpm check:coverage\`. Do not edit by hand: the next run overwrites it. -->

# Acceptance-criterion coverage

What verifies each acceptance criterion, at the level the criterion itself
declares. \`pnpm check:coverage\` writes this file; \`scripts/check-coverage.ts\`
says what the five verdicts mean and what gates.

**${criteria.length} criteria · ${criteria.length - open.length} closed · ${open.length} open (${Math.round((100 * (criteria.length - open.length)) / criteria.length)} % closed)**

| Verdict | Count | What it means |
| --- | --- | --- |
| VERIFIED | ${counts.VERIFIED} | a test title in a file a runner runs carries the id |
| METERED | ${counts.METERED} | a \`check:\` meter in the chain, or a CI job, names it (\`static\` and \`tool\`) |
| ATTESTED | ${counts.ATTESTED} | a current row in \`specs/verification/manual-checks.md\` (\`manual\` only) |
| NAMED ONLY | ${counts["NAMED ONLY"]} | the id is in a runner file but in no test title — **not coverage** |
| MISSING | ${counts.MISSING} | nothing names it |

Rule 1 (a new criterion arrives with its instrument): ${ruleOne}

## By level

| Level | Criteria | Closed | Open | Closed |
| --- | --- | --- | --- | --- |
${perLevel.join("\n")}

## By tactical specification

| Spec | Criteria | Closed | Open criteria |
| --- | --- | --- | --- |
${perSpec.join("\n")}

## Every open criterion

| Criterion | Level | Verdict | Where the name appears | Check |
| --- | --- | --- | --- | --- |
${open
  .map(
    (c) =>
      `| ${c.id} | ${c.level} | ${c.verdict} | ${c.instrument} | ${c.check.replace(/\|/g, "\\|").slice(0, 160)}${c.check.length > 160 ? " …" : ""} |`,
  )
  .join("\n")}
`,
    "utf8",
  );
}

// ── Run ───────────────────────────────────────────────────────────────────

// ── The run, as one function so a test can drive it over a fixture ────────

export interface CoverageResult {
  readonly criteria: Criterion[];
  readonly counts: Record<string, number>;
  readonly ruleOne: string;
  readonly errors: readonly string[];
}

/**
 * The whole check over one repository root. Writes the report; returns what
 * the summary prints. `now` is injectable so a test can age an attestation
 * past its expiry without waiting ninety days.
 */
export function checkCoverage(root: string = ROOT, now: Date = new Date()): CoverageResult {
  const errors: string[] = [];
  const fail = (message: string): void => void errors.push(message);

  const criteria = readCriteria(root, fail);
  classify(root, criteria, fail);
  const counts = tally(criteria);

  // Rule 1 — a new criterion arrives with its instrument. No budget.
  const previous = criteriaAtHead(root);
  let ruleOne: string;
  if (previous === undefined) {
    ruleOne =
      "**NOT CHECKED** — no git history in this tree, so a new criterion cannot be told from an old one. Not a pass.";
  } else {
    const born = criteria.filter((c) => !previous.has(c.id));
    const naked = born.filter((c) => OPEN.includes(c.verdict));
    ruleOne = `${born.length} criterion(a) new in this commit, ${naked.length} without an instrument.`;
    for (const c of naked) {
      const wanted =
        c.level === "manual"
          ? `a row in ${rel(root, manualFile(root))}`
          : c.level === "tool"
            ? "a CI job (or a chain meter) that names it"
            : "a test whose title carries the id";
      fail(
        `${c.id} is new in this commit and nothing verifies it (level \`${c.level}\`, verdict ${c.verdict}). ` +
          `Whoever writes a criterion writes its check: ${wanted} — ` +
          `\`specs/verification/verification-strategy.md\` § Levels says which.`,
      );
    }
  }

  // Rule 2 — the ratchet.
  const file = budgetFile(root);
  if (!existsSync(file)) {
    fail(`${rel(root, file)} is missing — the ratchet has no budget to hold. Write it with the current tally.`);
  } else {
    const budget = JSON.parse(readFileSync(file, "utf8")) as { max: Record<string, number> };
    for (const verdict of OPEN) {
      const seen = counts[verdict];
      const max = budget.max[verdict] ?? 0;
      if (seen > max) {
        fail(
          `${verdict} rose from ${max} to ${seen}. The backlog may only shrink: close ${seen - max} criterion(a), ` +
            `or say in a decision record why the budget moves and edit ${rel(root, file)} in the same commit.`,
        );
      } else if (seen < max) {
        fail(
          `${verdict} fell from ${max} to ${seen} — record the gain: set "${verdict}" to ${seen} in ${rel(root, file)}. ` +
            `An unrecorded improvement is budget somebody can spend again without noticing.`,
        );
      }
    }
  }

  writeReport(root, criteria, counts, ruleOne);
  void now;
  return { criteria, counts, ruleOne, errors };
}

function main(): void {
  const { criteria, counts, ruleOne, errors } = checkCoverage();
  const open = counts["NAMED ONLY"] + counts.MISSING;
  const closed = criteria.length - open;

  console.log(
    `coverage check: ${criteria.length} criteria · ${counts.VERIFIED} verified · ${counts.METERED} metered · ` +
      `${counts.ATTESTED} attested · ${counts["NAMED ONLY"]} NAMED ONLY (not coverage) · ${counts.MISSING} missing`,
  );
  console.log(
    `  ${closed}/${criteria.length} closed (${Math.round((100 * closed) / criteria.length)} %) · ` +
      LEVELS.map((level) => {
        const all = criteria.filter((c) => c.level === level);
        const done = all.filter((c) => !OPEN.includes(c.verdict)).length;
        return `${level} ${done}/${all.length}`;
      }).join(" · "),
  );
  console.log(`  rule 1: ${ruleOne.replace(/\*\*/g, "")}`);
  console.log(`  report: ${rel(ROOT, reportFile(ROOT))}`);

  if (errors.length > 0) {
    console.error(`\n${errors.length} error(s):`);
    for (const message of errors) console.error(`  ERROR ${message}`);
    process.exit(1);
  }
  console.log("no errors");
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) main();
