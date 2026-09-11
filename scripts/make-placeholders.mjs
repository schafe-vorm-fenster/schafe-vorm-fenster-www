#!/usr/bin/env node
/**
 * Generates the placeholder image set (DEC-068).
 *
 * A placeholder fills a gap so the site is complete enough to look at,
 * click through and measure while the real material is still being made.
 * It must never be mistakable for the real thing, so every image produced
 * here is flatly graphic: a brand-token colour field, a hatch, the slot
 * label, the aspect ratio, and the word PLATZHALTER.
 *
 * What this script must never produce — DEC-068 rule 3:
 *   no synthetic photograph of a person, no invented village, no invented
 *   outlet, no invented testimonial, no figure that could read as data.
 *   A placeholder may occupy a slot; it may not assert anything.
 *
 * Output is deterministic and committed: a file that must exist on a clean
 * checkout cannot be produced on demand.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";

const TOKENS = JSON.parse(
  readFileSync("node_modules/@schafe-vorm-fenster/brand-design/tokens/svf-tokens.json", "utf8"),
);
const MANIFEST = JSON.parse(readFileSync("placeholders.manifest.json", "utf8"));
const OUT = "src/generated/placeholders";

const c = TOKENS.color;
const TONES = {
  lime:     { field: c.lime[100],     hatch: c.lime[300],     ink: c.lime[900] },
  violet:   { field: c.violet[100],   hatch: c.violet[200],   ink: c.violet[900] },
  himbeere: { field: c.himbeere[100], hatch: c.himbeere[200], ink: c.himbeere[900] },
};

/** Longest edge of every generated image. Enough to be an LCP candidate, small enough to stay cheap. */
const LONG_EDGE = 1600;

function dimensions(aspect) {
  const [w, h] = aspect.split(":").map(Number);
  return w >= h
    ? { w: LONG_EDGE, h: Math.round((LONG_EDGE * h) / w) }
    : { w: Math.round((LONG_EDGE * w) / h), h: LONG_EDGE };
}

function svg({ id, aspect, tone, label }) {
  const { w, h } = dimensions(aspect);
  const t = TONES[tone] ?? TONES.lime;
  const unit = Math.round(Math.min(w, h) / 22);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Platzhalter: ${label}">
  <title>Platzhalter: ${label}</title>
  <desc>Generiertes Platzhalterbild fuer den Slot ${id} (DEC-068). Kein Foto, keine Aussage.</desc>
  <defs>
    <pattern id="h" width="${unit}" height="${unit}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="${unit}" stroke="${t.hatch}" stroke-width="${Math.max(2, unit / 6)}"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="${t.field}"/>
  <rect width="${w}" height="${h}" fill="url(#h)"/>
  <rect x="${unit}" y="${unit}" width="${w - unit * 2}" height="${h - unit * 2}"
        fill="none" stroke="${t.ink}" stroke-width="${Math.max(2, unit / 8)}" stroke-dasharray="${unit} ${unit / 2}" opacity="0.55"/>
  <g fill="${t.ink}" font-family="'Atkinson Hyperlegible Next', system-ui, sans-serif" text-anchor="middle">
    <text x="${w / 2}" y="${h / 2 - unit * 0.35}" font-size="${unit * 1.5}" font-weight="700">${label}</text>
    <text x="${w / 2}" y="${h / 2 + unit * 1.1}" font-size="${unit * 0.8}" opacity="0.75" letter-spacing="${unit * 0.12}">PLATZHALTER · ${aspect}</text>
  </g>
</svg>
`;
}

rmSync(OUT, { recursive: true, force: true });
const index = [];
for (const slot of MANIFEST.slots) {
  if (!TONES[slot.tone]) throw new Error(`unknown tone "${slot.tone}" on slot ${slot.id}`);
  const file = join(OUT, `${slot.id}.svg`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, svg(slot));
  index.push({ ...slot, ...dimensions(slot.aspect), src: `/${file}` });
}
writeFileSync(join(OUT, "index.json"), JSON.stringify({ generatedFrom: "placeholders.manifest.json", slots: index }, null, 2) + "\n");
console.log(`placeholders: ${index.length} slots → ${OUT}`);
for (const s of index) console.log(`  ${s.id.padEnd(28)} ${String(s.w).padStart(4)}×${String(s.h).padEnd(4)} ${s.aspect.padEnd(7)} ${s.note}`);
