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

/**
 * The sheep mark as a full circle (Q-0095): the package's square SVG clipped to
 * the circle inscribed in its 915 px canvas, corners transparent, fill the
 * package's own paper. Transitional: `@schafe-vorm-fenster/brand-design` carries
 * the round file from the release after go-to-market-os PR 712
 * (`./logo-round.svg`); then this clip is deleted and that file imported.
 */
export async function roundLogoSvg(): Promise<string> {
  const svg = await readFile(
    join(PACKAGES, "@schafe-vorm-fenster/brand-design/logos/Schafe-vorm-Fenster_Logo_V2.1.svg"),
    "utf8",
  );
  const open = svg.indexOf(">", svg.indexOf("<svg")) + 1;
  const close = svg.lastIndexOf("</svg>");
  return (
    svg.slice(0, open) +
    '<clipPath id="round"><circle cx="457.5" cy="457.5" r="457.5"/></clipPath><g clip-path="url(#round)">' +
    svg.slice(open, close) +
    "</g></svg>"
  );
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
