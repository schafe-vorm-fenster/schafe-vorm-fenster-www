/**
 * The brand material the generated images draw from — read from the brand
 * package on disk, never copied into this repository (TS-WEB-0017-A6).
 *
 * Used by the share-image route and the app-icon route, both of which render
 * at build time (their parameters are enumerated), so the working directory is
 * the repository root and `node_modules` is present. Not for a request-time
 * path.
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";

import tokens from "@schafe-vorm-fenster/brand-design/tokens.json";

const PACKAGES = join(process.cwd(), "node_modules");

/** The sheep mark of the brand package, as a PNG data URI. */
export async function logoDataUri(): Promise<string> {
  const bytes = await readFile(
    join(PACKAGES, "@schafe-vorm-fenster/brand-design/logos/Schafe-vorm-Fenster_Logo_V2.1.png"),
  );
  return `data:image/png;base64,${bytes.toString("base64")}`;
}

/** The brand typeface (DEC-0043), in the `woff` form the image renderer reads. */
export async function brandFonts(): Promise<
  { name: string; data: Buffer; weight: 400 | 800; style: "normal" }[]
> {
  const file = (weight: number) =>
    join(
      PACKAGES,
      `@fontsource/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-${weight}-normal.woff`,
    );
  const [regular, extraBold] = await Promise.all([readFile(file(400)), readFile(file(800))]);
  return [
    { name: "Atkinson Hyperlegible Next", data: regular, weight: 400, style: "normal" },
    { name: "Atkinson Hyperlegible Next", data: extraBold, weight: 800, style: "normal" },
  ];
}

/** The design tokens the generated images use, by role. */
export const imageColors = {
  ground: tokens.color.neutral.paper,
  accent: tokens.color.lime[500],
  ink: tokens.color.neutral.ink,
  secondary: tokens.color.neutral.text2,
  line: tokens.color.neutral.line,
} as const;
