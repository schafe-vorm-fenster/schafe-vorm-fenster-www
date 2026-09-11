/**
 * Organization identity fields — TS-011 D4: "every `Organization` field …
 * is read at build time from `content/legal/` (WEB-F-088) — no identity
 * data is written into code or into this spec."
 *
 * `content/legal/imprint.md` is prose (§5 DDG boilerplate), not per-field
 * frontmatter — the content pipeline's structured legal schema has not
 * landed (state/open.md rows 59/60). This is therefore a **targeted parse**
 * of that block's current, fixed wording, [PROPOSED] until a typed
 * frontmatter field set exists: a wording change to `imprint.md` is a
 * parsing risk this module owns alone, not a general markdown-to-data
 * mapping other content can rely on.
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";

export interface OrganizationIdentity {
  readonly legalName: string;
  readonly streetAddress: string;
  readonly postalCode: string;
  readonly addressLocality: string;
  readonly email: string;
  readonly telephone: string;
  readonly registerCourt: string;
  readonly registerNumber: string;
  readonly vatId: string;
}

const IMPRINT_PATH = join("content", "legal", "imprint.md");

let cached: OrganizationIdentity | undefined;

/** Reads and parses `content/legal/imprint.md`, cached for the process. */
export async function organizationIdentity(
  repoRoot: string = process.cwd(),
): Promise<OrganizationIdentity> {
  if (cached) return cached;
  const text = await readFile(join(repoRoot, IMPRINT_PATH), "utf8");
  cached = parseOrganizationIdentity(text);
  return cached;
}

/** Test-only: forces the next `organizationIdentity()` call to re-read. */
export function resetOrganizationIdentityCache(): void {
  cached = undefined;
}

/** The parse, exposed separately so it is testable without the filesystem. */
export function parseOrganizationIdentity(text: string): OrganizationIdentity {
  const lines = text.split("\n").map((line) => line.replace(/\s+$/, ""));
  const sectionStart = lines.findIndex((line) => line.startsWith("## Angaben gemäß"));

  const legalName = (sectionStart >= 0 ? lines[sectionStart + 2] : undefined)?.trim() ?? "";
  const streetAddress = (sectionStart >= 0 ? lines[sectionStart + 3] : undefined)?.trim() ?? "";
  const cityLine = (sectionStart >= 0 ? lines[sectionStart + 4] : undefined)?.trim() ?? "";
  const cityMatch = /^(\d{5})\s+(.+)$/.exec(cityLine);

  return {
    legalName,
    streetAddress,
    postalCode: cityMatch?.[1] ?? "",
    addressLocality: cityMatch?.[2] ?? "",
    email: captureFirst(text, /mailto:([^)]+)/),
    telephone: captureFirst(text, /Telefon:\s*(.+)$/m),
    registerCourt: captureFirst(text, /Registergericht:\s*(.+)$/m),
    registerNumber: captureFirst(text, /Registernummer:\s*(HRB\s*\d+)/),
    vatId: captureFirst(text, /\bDE\d{9}\b/, 0),
  };
}

function captureFirst(text: string, pattern: RegExp, group = 1): string {
  return pattern.exec(text)?.[group]?.trim() ?? "";
}
