/**
 * A voice's logo for the proof byline (DEC-0183).
 *
 * The marks come from `@schafe-vorm-fenster/partners` as package subpath
 * imports, the only way a logo enters this repository (TS-WEB-0017-A6); Next
 * emits them under `/_next/static/`. The package's `index.json` supplies each
 * partner's `name` and `aliases`, and a card's context line is matched
 * against those — ignoring case and spacing — because the content artifacts
 * carry the name, not the partner id. A partner without an import here, or a
 * name nothing matches, keeps the initials well.
 *
 * A PNG imported out of `node_modules` arrives as a URL only, without the
 * `StaticImageData` dimensions, so the mark's ratio is read off the file's
 * own header — once, at build time, since the pages are prerendered
 * (DEC-0163) — and the box is sized before the image loads.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import partnersIndex from "@schafe-vorm-fenster/partners/index.json";
import kulturlandbueroUeckerRandow from "@schafe-vorm-fenster/partners/kulturlandbuero-uecker-randow.logo.png";
import noerdDigitalConvention from "@schafe-vorm-fenster/partners/noerd-digital-convention.logo.png";
import stiftungLebendigesLehre from "@schafe-vorm-fenster/partners/stiftung-lebendiges-lehre.logo.png";
import volkshochschuleVorpommernGreifswald from "@schafe-vorm-fenster/partners/volkshochschule-vorpommern-greifswald.logo.png";

import type { ProofCardLogo } from "@/src/components/proof-card/proof-card";
import type { StaticImageData } from "next/image";

interface PartnersIndex {
  readonly files: readonly {
    readonly frontmatter?: {
      readonly id?: string;
      readonly name?: string;
      readonly aliases?: readonly string[];
      readonly status?: string;
    };
  }[];
}

/** The byline's height in CSS pixels (SRC-0014 §Proof stream, the well). */
const HEIGHT = 40;

const PACKAGE_DIR = join(process.cwd(), "node_modules/@schafe-vorm-fenster/partners");

/** Typed as `StaticImageData` by Next; out of `node_modules` it is the URL itself. */
function urlOf(asset: StaticImageData | string): string {
  return typeof asset === "string" ? asset : asset.src;
}

const MARKS: Readonly<Record<string, StaticImageData | string>> = {
  "kulturlandbuero-uecker-randow": kulturlandbueroUeckerRandow,
  "noerd-digital-convention": noerdDigitalConvention,
  "stiftung-lebendiges-lehre": stiftungLebendigesLehre,
  "volkshochschule-vorpommern-greifswald": volkshochschuleVorpommernGreifswald,
};

/** Width over height, from the PNG's IHDR chunk (bytes 16–23, big-endian). */
function ratioOf(id: string): number {
  const header = readFileSync(join(PACKAGE_DIR, `${id}.logo.png`)).subarray(16, 24);
  return header.readUInt32BE(0) / header.readUInt32BE(4);
}

function normalise(name: string): string {
  return name.normalize("NFC").replace(/\s+/g, " ").trim().toLocaleLowerCase("de");
}

const BY_NAME = new Map<string, ProofCardLogo>(
  (partnersIndex as PartnersIndex).files.flatMap(({ frontmatter }) => {
    const asset = frontmatter?.id ? MARKS[frontmatter.id] : undefined;
    if (!asset || !frontmatter?.id || !frontmatter.name || frontmatter.status === "ended") return [];
    const logo = { src: urlOf(asset), width: Math.round(ratioOf(frontmatter.id) * HEIGHT), height: HEIGHT };
    return [frontmatter.name, ...(frontmatter.aliases ?? [])].map((name) => [normalise(name), logo] as const);
  }),
);

/** The logo of the partner a card names, or `undefined` — the card keeps its initials well. */
export function partnerLogo(name: string): ProofCardLogo | undefined {
  return BY_NAME.get(normalise(name));
}
