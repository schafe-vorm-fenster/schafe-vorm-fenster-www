/**
 * `pnpm check:locators` — TS-WEB-0017-A18, the locator repair (Q-0082, DEC-0111).
 *
 * `@leafcutter-strict/method-identifier-and-locator-schema` promises a locator
 * *"so that both resolve years later"* and offers four schemes — a line
 * `#L102`, a page `#P45`, a paragraph `#¶12` and a timestamp `#M45:12`. For a
 * Markdown file under version control none of them is stable: hub PR 510
 * inserted ten lines into `SRC-0003` and every one of the 17 requirement
 * locators into that file pointed at the wrong line the moment it merged, four
 * of them at text the amendment had deleted. Nothing failed, because
 * `check:specs` counts a locator and never reads one.
 *
 * `Q-0082` weighed three ways out and the owner chose the third: **automate the
 * repair rather than change the scheme.** The excerpt is already the recovery
 * key — the method mandates it, and it is what re-resolved all 17 by hand on
 * 2026-09-25 — so this check reads the named line, compares the excerpt as an
 * exact substring, and when that fails searches the rest of the file and says
 * **where the statement moved to** instead of failing blind.
 *
 * ── The two findings are different findings ───────────────────────────────
 *
 *   MOVED  the excerpt is still in the file, at another line. Reparable
 *          without a judgement: the locator takes the line the check prints.
 *   GONE   the excerpt is nowhere in the file. Not reparable here — the
 *          statement was rewritten or deleted, so somebody has to decide
 *          whether the requirement still has a source at all. That is the
 *          `DEM-####` channel of the source-inventory contract, not an edit.
 *
 * ── Honest degradation, and why this can still fail the build ─────────────
 *
 * Two of the three roots a locator can name are **sibling directories, not
 * dependencies**: `go-to-market-os` and `community-calendar` are checked out
 * beside this repository in a workspace and are absent in CI. A check cannot
 * verify what it cannot read, and it must not call that a pass. So every
 * locator lands in exactly one of five tallies and the summary prints all
 * five — `verified`, `moved`, `gone`, `not checked` and `unknown` — rather
 * than a single green line. **"not checked" is not "passed"**, and a reader
 * tells the two apart by the count and by the roots line above it, which names
 * every root and says whether it is present.
 *
 * What gates: `moved` and `gone` — locators the check genuinely read and found
 * wrong. Never `not checked`. In CI that means the hub locators degrade to
 * `not checked` on their own and the in-repository ones are still enforced;
 * locally, with the siblings present, everything is enforced. Nothing is
 * configured to make that happen and nothing can be forgotten.
 *
 * `loc: UNKNOWN` is legitimate and is never a finding: 87 requirements carry
 * it because the source supports no position scheme (64 of them because
 * `SRC-0006` is one line with no line terminators) or names no document at
 * all. DEC-0097 recorded them as defects **of the source**, tracked as
 * demands; reporting them here would report the same gap twice.
 *
 * The three non-line schemes are reported as `not checked` for the same reason
 * as an absent root: a page, a paragraph or a timestamp is not a line, and
 * this check reads lines. No locator uses one today.
 *
 * Exit code of `main()`: number of broken locators (0 = green).
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import * as yaml from "js-yaml";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Where a locator path can resolve, in precedence order. Derived from the
 * repository's position rather than written out: the workspace root is this
 * repository's parent, because `go-to-market-os/…` and `community-calendar/…`
 * are named relative to it, and the package root is the install tree, because
 * `@schafe-vorm-fenster/offerings/…` is a published subpath. No absolute path
 * on one laptop appears anywhere.
 */
export interface LocatorRoot {
  readonly name: string;
  readonly path: string;
  /** Said in the report when the root is absent, so the reader knows why. */
  readonly absentBecause: string;
}

export function locatorRoots(root: string = ROOT): LocatorRoot[] {
  return [
    {
      name: "repository",
      path: root,
      absentBecause: "this repository is not readable — which cannot happen",
    },
    {
      name: "workspace siblings",
      path: dirname(root),
      absentBecause:
        "go-to-market-os and community-calendar are sibling checkouts, not dependencies; they are absent in CI",
    },
    {
      name: "packages",
      path: join(root, "node_modules"),
      absentBecause: "dependencies are not installed",
    },
  ];
}

/**
 * The four locator schemes of
 * `@leafcutter-strict/method-identifier-and-locator-schema`, read off its prose
 * and the `extraction-result` contract rather than off the contract's escaped
 * `pattern` string. Only `L` names a line, which is the only one a file read
 * can resolve.
 */
const LOCATOR_SCHEMES = [
  { kind: "line", test: /^L\d+$/, resolvable: true },
  { kind: "page", test: /^P\d+$/, resolvable: false },
  { kind: "paragraph", test: /^¶\d+$/, resolvable: false },
  { kind: "timestamp", test: /^M\d+:\d+$/, resolvable: false },
] as const;

export type Outcome =
  | "verified"
  | "moved"
  | "gone"
  | "not-checked"
  | "unknown";

export interface LocatorFinding {
  /** Repository-relative file that carries the triple. */
  readonly artefact: string;
  readonly id: string;
  readonly sourceId: string;
  readonly loc: string;
  readonly outcome: Outcome;
  /** One sentence for the report — what was found, and what to do with it. */
  readonly message: string;
}

export interface LocatorResult {
  readonly findings: LocatorFinding[];
  readonly tally: Record<Outcome, number>;
  readonly roots: { readonly root: LocatorRoot; readonly present: boolean }[];
  readonly artefactsScanned: number;
}

const SKIP_DIRECTORIES = new Set(["node_modules", ".next", ".git", ".vercel"]);

function walk(directory: string): string[] {
  let entries: string[];
  try {
    entries = readdirSync(directory);
  } catch {
    return [];
  }
  return entries.flatMap((name) => {
    if (SKIP_DIRECTORIES.has(name)) return [];
    const full = join(directory, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

/** The frontmatter of a Markdown artefact, or `null` if it carries none. */
function frontmatter(raw: string): Record<string, unknown> | null {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return null;
  try {
    const parsed = yaml.load(m[1]);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/**
 * The file a locator path names, or `null` when no root holds it. A path that
 * escapes its root with `..` resolves nowhere: a locator names a document
 * inside one of the three trees and never a place above them.
 */
export function resolveSourceFile(
  path: string,
  roots: readonly LocatorRoot[],
): { file: string; root: LocatorRoot } | null {
  for (const root of roots) {
    const candidate = resolve(root.path, path);
    if (candidate !== root.path && !candidate.startsWith(root.path + sep)) continue;
    try {
      if (statSync(candidate).isFile()) return { file: candidate, root };
    } catch {
      /* not under this root */
    }
  }
  return null;
}

/** Every 1-based line number of `file` whose text contains `excerpt`. */
export function linesContaining(lines: readonly string[], excerpt: string): number[] {
  const found: number[] = [];
  lines.forEach((line, index) => {
    if (line.includes(excerpt)) found.push(index + 1);
  });
  return found;
}

/**
 * Verifies one `{source_id, loc, excerpt}` triple. Pure over its inputs so a
 * test can drive every outcome without a fixture tree for the unreadable and
 * unsupported cases.
 */
export function verifyLocator(
  triple: { sourceId: string; loc: string; excerpt: string },
  roots: readonly LocatorRoot[],
): { outcome: Outcome; message: string } {
  const { loc, excerpt } = triple;

  if (loc === "UNKNOWN")
    return {
      outcome: "unknown",
      message: "loc UNKNOWN — the source supports no position scheme, or names no document (DEC-0097)",
    };

  const parsed = loc.match(/^(.+)#([^#]+)$/);
  if (!parsed)
    return {
      outcome: "gone",
      message: `loc "${loc}" carries no anchor — the locator grammar is <path>#<L|P|¶|M>`,
    };
  const [, path, anchor] = parsed;

  const scheme = LOCATOR_SCHEMES.find((s) => s.test.test(anchor));
  if (!scheme)
    return {
      outcome: "gone",
      message: `anchor "${anchor}" is none of the four schemes the method defines (L·P·¶·M)`,
    };
  if (!scheme.resolvable)
    return {
      outcome: "not-checked",
      message: `NOT CHECKED — a ${scheme.kind} locator is not a line, and this check reads lines`,
    };

  if (typeof excerpt !== "string" || excerpt.length === 0)
    return {
      outcome: "gone",
      message: `no excerpt to recover the position with — the excerpt is the recovery key`,
    };

  const resolved = resolveSourceFile(path, roots);
  if (!resolved)
    return {
      outcome: "not-checked",
      message: `NOT CHECKED — ${path} is under none of the roots (not "passed": the source is not here to read)`,
    };

  const lines = readFileSync(resolved.file, "utf8").split("\n");
  const wanted = Number(anchor.slice(1));
  const named = lines[wanted - 1];

  if (named !== undefined && named.includes(excerpt))
    return { outcome: "verified", message: `verified at ${path}#L${wanted}` };

  const elsewhere = linesContaining(lines, excerpt);
  const where = named === undefined ? `${path} has ${lines.length} line(s)` : `L${wanted} reads something else`;

  if (elsewhere.length > 0)
    return {
      outcome: "moved",
      message:
        `MOVED — ${where}; the statement is now at ` +
        `${elsewhere.map((n) => `${path}#L${n}`).join(", ")}. ` +
        `Repoint the locator; the excerpt is unchanged`,
    };

  return {
    outcome: "gone",
    message:
      `GONE — ${where}, and the excerpt is nowhere in ${path}. ` +
      `The statement was rewritten or deleted, so the citation has no position to move to: ` +
      `decide whether the source still supports it, and raise a demand against the source`,
  };
}

export function checkLocators(root: string = ROOT): LocatorResult {
  const roots = locatorRoots(root);
  const findings: LocatorFinding[] = [];
  const tally: Record<Outcome, number> = {
    verified: 0,
    moved: 0,
    gone: 0,
    "not-checked": 0,
    unknown: 0,
  };
  let artefactsScanned = 0;

  for (const file of walk(join(root, "specs")).filter((f) => f.endsWith(".md"))) {
    const fm = frontmatter(readFileSync(file, "utf8"));
    const source = fm?.source;
    if (!source || typeof source !== "object" || Array.isArray(source)) continue;
    const { source_id: sourceId, loc, excerpt } = source as Record<string, unknown>;
    if (typeof loc !== "string") continue;

    artefactsScanned += 1;
    const { outcome, message } = verifyLocator(
      {
        sourceId: typeof sourceId === "string" ? sourceId : "UNKNOWN",
        loc,
        excerpt: typeof excerpt === "string" ? excerpt : "",
      },
      roots,
    );
    tally[outcome] += 1;
    findings.push({
      artefact: relative(root, file),
      id: typeof fm?.id === "string" ? fm.id : relative(root, file),
      sourceId: typeof sourceId === "string" ? sourceId : "UNKNOWN",
      loc,
      outcome,
      message,
    });
  }

  return {
    findings,
    tally,
    roots: roots.map((r) => ({
      root: r,
      present: (() => {
        try {
          return statSync(r.path).isDirectory();
        } catch {
          return false;
        }
      })(),
    })),
    artefactsScanned,
  };
}

function main(): void {
  const { findings, tally, roots, artefactsScanned } = checkLocators();

  for (const { root, present } of roots)
    console.log(
      `locator roots: ${root.name} ${present ? "✓" : "✗"} ${root.path}` +
        (present ? "" : ` — ${root.absentBecause}`),
    );
  console.log(
    `locator check: ${artefactsScanned} locator(s) · ${tally.verified} verified · ` +
      `${tally.moved} moved · ${tally.gone} gone · ${tally["not-checked"]} NOT CHECKED · ` +
      `${tally.unknown} UNKNOWN (legitimate)`,
  );

  const broken = findings.filter((f) => f.outcome === "moved" || f.outcome === "gone");
  for (const f of findings.filter((f) => f.outcome === "not-checked"))
    console.log(`  ⚠ ${f.id} (${f.sourceId}) ${f.message}`);
  for (const f of broken) console.error(`  ERROR TS-017-A18 ${f.id} (${f.sourceId}) ${f.message}`);

  if (tally["not-checked"] > 0)
    console.log(
      `${tally["not-checked"]} locator(s) were NOT CHECKED — that is not a pass. ` +
        `Run this with the sibling checkouts present to verify them.`,
    );
  console.log(broken.length ? `${broken.length} broken locator(s)` : "no broken locators");
  process.exit(broken.length);
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) main();
