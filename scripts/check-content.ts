/**
 * `pnpm check:content` — the content pipeline gate (TS-007 D12).
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

import { checkContentTree } from "../src/lib/content/validate";

import type { Finding } from "../src/lib/content/validate";

function print(finding: Finding): void {
  const where = finding.slot ? `${finding.file} › ${finding.slot}` : finding.file;
  const line = `  ${where}\n    [${finding.check}] ${finding.message}`;
  if (finding.level === "error") console.error(line);
  else console.warn(line);
}

async function main(): Promise<void> {
  const started = Date.now();
  const missingLocale = process.argv.includes("--warn-missing-locale")
    ? "warning"
    : "error";

  const findings = await checkContentTree({ missingLocale });
  const errors = findings.filter((finding) => finding.level === "error");
  const warnings = findings.filter((finding) => finding.level === "warning");

  console.log(
    `\nChecked the content pipeline in ${Date.now() - started} ms — ${errors.length} error(s), ${warnings.length} warning(s).\n`,
  );

  if (warnings.length > 0) {
    console.warn(`${warnings.length} warning(s):`);
    warnings.forEach(print);
    console.warn("");
  }

  if (errors.length === 0) {
    console.log("Content pipeline is valid (TS-007 D12).");
    return;
  }

  console.error(`Found ${errors.length} error(s):`);
  errors.forEach(print);
  console.error("");
  process.exit(1);
}

void main();
