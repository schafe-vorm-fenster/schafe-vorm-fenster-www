/**
 * Builds `src/generated/contact-channels.json` — the contact section's four
 * channel values, read from the hub record `contact-channels.md` in
 * `@schafe-vorm-fenster/goals` (SRC-0008; TS-WEB-0016 D13 "Where the values
 * come from").
 *
 * Why a committed file rather than a request-time import: the hub packages
 * are devDependencies of the content pipeline, and the loader architecture
 * never opens one at request time (TS-WEB-0007 D3). The same pattern as
 * `scripts/build-place-index.ts` — a build step writes, the site reads the
 * committed result, and a unit test (`src/lib/contact/contact-channels.test.ts`)
 * fails when the committed values differ from the installed record, so a hub
 * release that moves a number cannot pass `pnpm check` unnoticed (DEC-0113).
 *
 * Refresh: `pnpm build:contact-channels`.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { parseContactChannels } from "../src/lib/contact/hub-record";

import type { ContactChannelsFile } from "../src/lib/contact/hub-record";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TARGET = join(ROOT, "src", "generated", "contact-channels.json");

const require = createRequire(import.meta.url);

/** The installed hub package's record and version — resolved, never a hand-typed path. */
export function hubContactChannelsSource(): { readonly markdown: string; readonly source: string } {
  const packageJson = require.resolve("@schafe-vorm-fenster/goals/package.json");
  const { name, version } = JSON.parse(readFileSync(packageJson, "utf8")) as {
    name: string;
    version: string;
  };
  const markdown = readFileSync(join(dirname(packageJson), "contact-channels.md"), "utf8");
  return { markdown, source: `${name}@${version}#contact-channels.md` };
}

function main(): void {
  const { markdown, source } = hubContactChannelsSource();
  const channels = parseContactChannels(markdown);

  const file: ContactChannelsFile = {
    builtAt: new Date().toISOString(),
    source,
    channels,
  };

  mkdirSync(dirname(TARGET), { recursive: true });
  writeFileSync(TARGET, `${JSON.stringify(file, null, 2)}\n`, "utf8");
  console.log(`contact channels: ${channels.length} rows from ${source} → ${TARGET}`);
}

main();
