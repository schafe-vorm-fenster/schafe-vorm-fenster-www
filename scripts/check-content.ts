/**
 * `pnpm check:content` — the content pipeline gate (TS-WEB-0007 D12).
 *
 * Reads the eleven page artifacts in every configured locale, validates them
 * against the schema in `src/domain/content-frontmatter.schema.ts`, and
 * resolves every provenance reference against the installed hub packages.
 * Errors exit non-zero with the file, the slot and the record named;
 * warnings are printed and do not fail the run.
 *
 * The rules themselves live in `src/lib/content/validate.ts`, so the same
 * checks run in the unit and integration tests. This file is the runner.
 */

import { contentEnvironment } from "../src/lib/content/lifecycle";
import { checkContentTree } from "../src/lib/content/validate";

import type { Finding } from "../src/lib/content/validate";
import type { Environment } from "../src/lib/security/csp";

const ENVIRONMENTS: readonly Environment[] = ["production", "preview", "development"];

/**
 * `--target <environment>` — which build the tree is judged for (TS-WEB-0007
 * D11). Without it, this process's own `VERCEL_ENV` decides, as before.
 *
 * `pnpm check:content:production` passes `--target production`, and that is
 * the parity gate of issue 206 / DEC-0222: every slot the preview renders
 * must render in production too, so a page or slot whose status a production
 * build drops is an **error** on every `pnpm check` and in CI — not only on a
 * Vercel production build, where it would be too late.
 */
function targetFrom(argv: readonly string[]): Environment {
  const index = argv.findIndex((arg) => arg === "--target" || arg.startsWith("--target="));
  if (index === -1) return contentEnvironment();
  const arg = argv[index]!;
  const value = arg.includes("=") ? arg.slice(arg.indexOf("=") + 1) : argv[index + 1];
  if (!value || !(ENVIRONMENTS as readonly string[]).includes(value)) {
    console.error(
      `--target takes one of ${ENVIRONMENTS.join(", ")}; got ${JSON.stringify(value ?? null)}`,
    );
    process.exit(2);
  }
  return value as Environment;
}

/**
 * Which acceptance criterion a row of D12 discharges — printed with the
 * finding, because a meter has no test title to carry the id
 * (`scripts/check-coverage.ts`: *"the id in its failure message is the link"*).
 *
 * `TS-WEB-0007-A13` declares its level as `tool`: an external tool is the
 * verdict, and this command is that tool for glossary conformance — the avoid
 * list and the product-name count (rows 11). The two other copy rows are
 * verified by test titles in `src/lib/content/validate.test.ts` as well and are
 * named here for the same reason: a reader of a failure should not have to look
 * up which criterion just broke.
 *
 * The former `claim-budget` row (16) is retired: DEC-0154 withdrew `CG-027`'s
 * 70-character budget, and no new number exists (`Q-0086`, DEC-0209 §5).
 */
const CRITERION: Partial<Record<Finding["check"], string>> = {
  "avoid-list": "TS-WEB-0007-A13",
  "product-name": "TS-WEB-0007-A13",
  "copy-structure": "TS-WEB-0006-A8",
  register: "TS-WEB-0029-A15",
  "price-figure": "TS-WEB-0006-A12",
};

function print(finding: Finding): void {
  const where = finding.slot ? `${finding.file} › ${finding.slot}` : finding.file;
  const criterion = CRITERION[finding.check];
  const line =
    `  ${where}\n    [${finding.check}${criterion ? `, ${criterion}` : ""}] ` +
    finding.message;
  if (finding.level === "error") console.error(line);
  else console.warn(line);
}

async function main(): Promise<void> {
  const started = Date.now();
  const missingLocale = process.argv.includes("--warn-missing-locale")
    ? "warning"
    : "error";

  const targetEnvironment = targetFrom(process.argv);

  const findings = await checkContentTree({ missingLocale, targetEnvironment });
  const errors = findings.filter((finding) => finding.level === "error");
  const warnings = findings.filter((finding) => finding.level === "warning");

  console.log(
    `\nChecked the content pipeline for a ${targetEnvironment} build in ${Date.now() - started} ms — ${errors.length} error(s), ${warnings.length} warning(s).\n`,
  );

  if (warnings.length > 0) {
    console.warn(`${warnings.length} warning(s):`);
    warnings.forEach(print);
    console.warn("");
  }

  if (errors.length === 0) {
    console.log(
      "Content pipeline is valid (TS-WEB-0007 D12) — rows 11, 13, 14 and 15 measured: " +
        "TS-WEB-0007-A13 (glossary conformance), TS-WEB-0006-A8 (copy structure), " +
        "TS-WEB-0029-A15 (register) and TS-WEB-0006-A12 (a price is read, never typed).",
    );
    return;
  }

  console.error(`Found ${errors.length} error(s):`);
  errors.forEach(print);
  console.error("");
  process.exit(1);
}

void main();
