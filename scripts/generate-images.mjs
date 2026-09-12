#!/usr/bin/env node
/**
 * `pnpm images:generate` — renders the missing imagery of the page artifacts.
 *
 * DEC-068 fills a gap with a marked placeholder rather than leaving a hole.
 * The first placeholder generation (`scripts/make-placeholders.mjs`) answers
 * with a flat hatch; this one answers with a photographic rendition, because
 * a hatch cannot show what a photo section looks like when there is a photo
 * in it, and the run's target is a prototype that can be reviewed and
 * measured. See ADR-077 for the decision and for the guardrails that keep it
 * on the safe side of DEC-068 rule 3 — the badge stays on, no portrait is
 * ever generated, and no proof slot is ever filled by one.
 *
 * What it reads: the `images:` block of every `content/pages/**\/de.md`
 * (`ImageEntrySchema` in `src/domain/content-frontmatter.schema.ts`). What it
 * writes: `public/images/generated/<id>.webp`, plus the rendition's file,
 * size, model, date and prompt hash back into **both** locale files, so the
 * frontmatter entry is the whole provenance record and no sidecar exists.
 *
 * Idempotent: an entry whose `status` is already `generated` or `real` is
 * skipped and the reason is printed. `--force <id>` re-renders exactly one.
 *
 * Usage
 *   pnpm images:generate --dry-run     print the prompts and the cost, call nothing
 *   pnpm images:generate               render every `status: needed` entry
 *   pnpm images:generate --force home-hero
 *   pnpm images:generate --only home   only the page directory `home`
 *
 * Auth: the Vercel AI Gateway with the project's OIDC token. The token is
 * read from `.env.local` — which this script never writes — and refreshed
 * into a scratch file with `vercel env pull` when it is missing or expired.
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { execFileSync } from "node:child_process";

import { config as loadEnv } from "dotenv";
import yaml from "js-yaml";
import sharp from "sharp";

const REPO = join(dirname(new URL(import.meta.url).pathname), "..");
const CONTENT = join(REPO, "content/pages");
const OUT_DIR = join(REPO, "public/images/generated");
const PUBLIC_PREFIX = "/images/generated";

/**
 * The image model. `bfl/flux-pro-1.1` on the Vercel AI Gateway: photographic,
 * fast, and $0.04 per image at the gateway's published price (the `pricing`
 * field of `https://ai-gateway.vercel.sh/v1/models`, read 2026-09-12).
 */
const MODEL = "bfl/flux-pro-1.1";
const PRICE_PER_IMAGE_USD = 0.04;

/**
 * Per ratio: what the model is asked for, and what the file ends up as.
 *
 * `request` is what the model can actually produce — flux wants dimensions in
 * multiples of 32 and caps the long edge at 1440 — and `out` is the exact
 * ratio of `concept/website-design-system.md` § Media ratios, cropped to by
 * sharp afterwards. The box on the page declares that ratio before the image
 * arrives, so a rendition that is a few pixels off would be the one thing
 * that reflows the page after paint.
 *
 * `hero` is the only two-rendition case: the design system makes the hero
 * 8:9 on the phone and 21:9 from 48rem (`app/styles/components.css`), and a
 * 21:9 frame centre-cropped into an 8:9 box loses most of the motif. Base is
 * the phone rendition — mobile-first, TS-017 D2 — and `<id>-wide.webp` is the
 * landscape one the media query swaps in.
 */
const RATIOS = {
  hero: {
    request: "800x896",
    out: { width: 800, height: 900 },
    wide: { request: "1440x608", out: { width: 1400, height: 600 } },
  },
  feature: { request: "1408x1024", out: { width: 1400, height: 1000 } },
  proof: { request: "1440x576", out: { width: 1400, height: 560 } },
  map: { request: "1440x800", out: { width: 1440, height: 810 } },
  portrait: { request: "1152x1440", out: { width: 1152, height: 1440 } },
  square: { request: "1024x1024", out: { width: 1024, height: 1024 } },
};

/**
 * TS-003 D1: every image stays under 100 KB. Quality 80 is the start; a busy
 * motif that misses the budget is re-encoded down the ladder rather than
 * shipped over it, because the budget is the promise and the image is a
 * placeholder either way.
 */
const QUALITY_LADDER = [80, 74, 68, 62, 56, 50];
const MAX_BYTES = 100 * 1024;

/**
 * Pacing. The gateway rate-limits image models on the free tier, and a run of
 * twenty renditions walks straight into it. One call at a time with a pause
 * between them, then an escalating wait on a 429 — the alternative is a half
 * generated set and a script that has to be babysat.
 */
const PACE_MS = 12_000;
const BACKOFF_MS = [30_000, 60_000, 120_000, 240_000, 300_000];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * The guardrails every prompt carries, whatever the brief says.
 *
 * No text and no signage, because rendered lettering is always wrong and a
 * legible sign would name a place the picture is not. No identifiable face,
 * because DEC-068 rule 3 forbids a synthetic person — portraits come from
 * `@schafe-vorm-fenster/people` or they do not exist.
 */
const GUARDRAILS = [
  "Documentary photograph, natural light, realistic, unstaged.",
  "No text, no lettering, no logos, no legible signage, no watermarks.",
  "No identifiable faces; people only from a distance, from behind, or out of focus.",
  "No collage, no illustration, no 3D render, no visible camera effects.",
].join(" ");

const DEFAULT_STYLE =
  "Rural north-east Germany, Mecklenburg-Vorpommern, present day, muted natural colours, available light.";

// ── CLI ──────────────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
const flag = (name) => {
  const index = argv.indexOf(`--${name}`);
  return index === -1 ? undefined : (argv[index + 1] ?? true);
};
const DRY_RUN = argv.includes("--dry-run");
const FORCE = typeof flag("force") === "string" ? flag("force") : undefined;
const ONLY = typeof flag("only") === "string" ? flag("only") : undefined;

// ── The content tree ─────────────────────────────────────────────────────────

/** Every `de.md` under `content/pages`, recursively. */
function pageFiles(dir = CONTENT) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...pageFiles(path));
    else if (entry.name === "de.md") out.push(path);
  }
  return out.sort();
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;

function readFrontmatter(file) {
  const raw = readFileSync(file, "utf8");
  const match = raw.match(FRONTMATTER);
  if (!match) return { raw, data: null, block: null };
  return { raw, data: yaml.load(match[1]), block: match[1] };
}

/**
 * Writes an `images:` list back into a file's frontmatter, leaving every other
 * line of the file byte-identical.
 *
 * The block is replaced as a whole (js-yaml re-emits it), so a comment *inside*
 * the images block does not survive a generation run — everything else does.
 */
function writeImages(file, images) {
  const raw = readFileSync(file, "utf8");
  const match = raw.match(FRONTMATTER);
  if (!match) throw new Error(`${file}: no frontmatter`);
  const block = match[1];
  const rendered = yaml
    .dump({ images }, { lineWidth: 100, noRefs: true, quotingType: '"' })
    .trimEnd();

  const lines = block.split("\n");
  const start = lines.findIndex((line) => line.startsWith("images:"));
  let next;
  if (start === -1) {
    next = lines.length;
  } else {
    next = lines.length;
    for (let i = start + 1; i < lines.length; i += 1) {
      if (/^[A-Za-z_]/.test(lines[i])) {
        next = i;
        break;
      }
    }
  }
  const head = start === -1 ? lines : lines.slice(0, start);
  const tail = start === -1 ? [] : lines.slice(next);
  const updated = [...head, ...rendered.split("\n"), ...tail].join("\n");
  writeFileSync(file, raw.replace(FRONTMATTER, `---\n${updated}\n---`), "utf8");
}

// ── The prompt ───────────────────────────────────────────────────────────────

function buildPrompt(entry) {
  return [entry.brief.trim(), (entry.style ?? DEFAULT_STYLE).trim(), GUARDRAILS]
    .filter(Boolean)
    .join(" ");
}

const promptHash = (prompt) =>
  createHash("sha256").update(prompt).digest("hex").slice(0, 16);

// ── Auth ─────────────────────────────────────────────────────────────────────

function tokenExpiry(token) {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString("utf8"),
    );
    return payload.exp * 1000;
  } catch {
    return 0;
  }
}

/**
 * Puts a usable `VERCEL_OIDC_TOKEN` into the environment.
 *
 * `.env.local` is read, never written: it carries a manually added secret that
 * `vercel env pull` would drop. A missing or expired token is refreshed into a
 * scratch file under the OS temp directory instead (TS-014 / guardrails —
 * credentials never land in a file that reaches the repository).
 */
function ensureToken() {
  loadEnv({ path: join(REPO, ".env.local"), quiet: true });
  const current = process.env.VERCEL_OIDC_TOKEN;
  if (current && tokenExpiry(current) > Date.now() + 60_000) return "env.local";

  const scratch = join(tmpdir(), `svf-oidc-${process.pid}.env`);
  execFileSync("npx", ["vercel", "env", "pull", scratch, "--environment", "development", "--yes"], {
    cwd: REPO,
    stdio: "inherit",
  });
  const pulled = loadEnv({ path: scratch, override: true, quiet: true });
  // The file is a credential the moment it exists, and it exists outside the
  // repository on purpose. It is read once and deleted immediately — the
  // token lives on in this process's environment, and nowhere on disk.
  rmSync(scratch, { force: true });
  if (!pulled.parsed?.VERCEL_OIDC_TOKEN) {
    throw new Error("no VERCEL_OIDC_TOKEN after `vercel env pull`");
  }
  process.env.VERCEL_OIDC_TOKEN = pulled.parsed.VERCEL_OIDC_TOKEN;
  return "vercel env pull (scratch file, deleted)";
}

// ── Rendering ────────────────────────────────────────────────────────────────

/** Model → bytes, cropped to the exact ratio and encoded inside the budget. */
async function render({ generateImage, gateway }, prompt, size, out, file) {
  const result = await generateImage({
    model: gateway.imageModel(MODEL),
    prompt,
    size,
  });
  for (const warning of result.warnings ?? []) {
    if (warning.feature !== "size") console.warn(`    warning: ${warning.feature}`);
  }

  const base = sharp(Buffer.from(result.image.uint8Array)).resize({
    width: out.width,
    height: out.height,
    fit: "cover",
    position: "attention",
  });

  for (const quality of QUALITY_LADDER) {
    const buffer = await base.clone().webp({ quality, effort: 5 }).toBuffer();
    if (buffer.length <= MAX_BYTES || quality === QUALITY_LADDER.at(-1)) {
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, buffer);
      return { bytes: buffer.length, quality, over: buffer.length > MAX_BYTES };
    }
  }
  throw new Error("unreachable");
}

/**
 * One rendition, with the gateway's rate limit treated as weather rather than
 * as an error: wait, try again, and only give up after the ladder is spent.
 */
async function renderWithRetry(ai, prompt, size, out, file, force = false) {
  // A rendition that is already on disk is not paid for twice. The frontmatter
  // is the record of *what* was rendered, the file is the rendition itself;
  // when a run is interrupted (a rate limit, a Ctrl-C) the files that made it
  // are reused and only the missing ones are called for. `--force <id>`
  // overrides, which is the whole point of the flag.
  if (!force && existsFile(file)) {
    const bytes = statSync(file).size;
    console.log(`   reused ${relative(REPO, file)} — ${(bytes / 1024).toFixed(0)} KB, no model call`);
    return { bytes, quality: null, reused: true, over: bytes > MAX_BYTES };
  }
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await render(ai, prompt, size, out, file);
    } catch (error) {
      const message = String(error?.message ?? error);
      const limited = /rate.?limit|429/i.test(message) || error?.type === "rate_limit_exceeded";
      if (!limited || attempt >= BACKOFF_MS.length) throw error;
      const wait = BACKOFF_MS[attempt];
      console.log(`   rate-limited — waiting ${wait / 1000}s (attempt ${attempt + 1})`);
      await sleep(wait);
    }
  }
}

/**
 * The budget pass. A busy motif — fog, foliage, a wall of detail — can miss
 * TS-003 D1's 100 KB even at the bottom of the quality ladder, and the file
 * is already written by then. Rather than pay for the frame again, the file
 * itself is re-encoded and, if that is still not enough, narrowed: a
 * placeholder that is 200 px less wide is a better answer than a placeholder
 * that breaks the page's byte budget.
 *
 * Runs over the whole output directory at the end of every run, and does
 * nothing to a file that is already inside the budget — so it is safe to
 * repeat.
 */
async function fitBudget() {
  const fitted = [];
  /** Public path → the rendition's new intrinsic size, for the write-back. */
  const resized = new Map();
  for (const dir of [OUT_DIR, REAL_DIR]) {
    let entries;
    try {
      entries = readdirSync(dir);
    } catch {
      continue;
    }
    for (const name of entries.filter((file) => file.endsWith(".webp"))) {
      const file = join(dir, name);
      if (statSync(file).size <= MAX_BYTES) continue;
      const source = readFileSync(file);
      const { width } = await sharp(source).metadata();
      let done = false;
      for (const scale of [1, 0.85, 0.7, 0.55]) {
        for (const quality of QUALITY_LADDER) {
          const buffer = await sharp(source)
            .resize({ width: Math.round(width * scale) })
            .webp({ quality, effort: 6 })
            .toBuffer();
          if (buffer.length <= MAX_BYTES) {
            writeFileSync(file, buffer);
            const meta = await sharp(buffer).metadata();
            const prefix = dir === OUT_DIR ? PUBLIC_PREFIX : REAL_PREFIX;
            resized.set(`${prefix}/${name}`, { width: meta.width, height: meta.height });
            fitted.push(
              `${name}: ${(statSync(file).size / 1024).toFixed(0)} KB @ q${quality}` +
                (scale < 1 ? `, ${Math.round(width * scale)} px wide` : ""),
            );
            done = true;
            break;
          }
        }
        if (done) break;
      }
      if (!done) console.warn(`   ${name} stays over the 100 KB budget`);
    }
  }
  if (fitted.length > 0) {
    console.log(`\nre-encoded to fit the 100 KB budget (TS-003 D1):`);
    for (const line of fitted) console.log(`  · ${line}`);
  }

}

/**
 * Makes every entry's recorded size match the file it names.
 *
 * The budget pass may narrow a rendition, and a record that names a file
 * while stating the wrong size is a record that lies — the sizes are read
 * back off disk rather than remembered.
 */
async function syncSizes() {
  for (const file of pageFiles()) {
    for (const locale of ["de", "en"]) {
      const localeFile = join(dirname(file), `${locale}.md`);
      if (!existsFile(localeFile)) continue;
      const { data } = readFrontmatter(localeFile);
      if (!Array.isArray(data?.images)) continue;
      let touched = false;
      const images = [];
      for (const entry of data.images) {
        const next = { ...entry };
        for (const [path, w, h] of [
          [entry.file, "width", "height"],
          [entry.wide_file, "wide_width", "wide_height"],
        ]) {
          if (!path) continue;
          const onDisk = join(REPO, "public", path.replace(/^\//, ""));
          if (!existsFile(onDisk)) continue;
          const meta = await sharp(onDisk).metadata();
          if (next[w] !== meta.width || next[h] !== meta.height) {
            next[w] = meta.width;
            next[h] = meta.height;
            touched = true;
          }
        }
        images.push(next);
      }
      if (touched) {
        writeImages(localeFile, images);
        console.log(`updated ${relative(REPO, localeFile)} — intrinsic size(s)`);
      }
    }
  }
}


// ── Real assets ──────────────────────────────────────────────────────────────

/**
 * `provenance: real` entries are not rendered, they are *placed*: the file is
 * a photograph somebody owns, named in the entry's `source` as
 * `@schafe-vorm-fenster/<pkg>@<version>#<path>`.
 *
 * The hub packages publish the `.asset.md` descriptor but not the binary
 * (`files` in their `package.json`), so the bytes come from the workspace
 * checkout of `go-to-market-os` — the same repository the package is built
 * from, at the path the descriptor names. Until the packages ship their
 * assets, a subpath import cannot resolve; `state/open.md` carries that row.
 */
const HUB_REPO = "/Users/jan-henrik.hempel/Projects/go-to-market-os/packages";
const REAL_DIR = join(REPO, "public/images/real");
const REAL_PREFIX = "/images/real";

const SOURCE_REF = /^@schafe-vorm-fenster\/([a-z-]+)@[\d.]+#(.+?)(?:\s+—.*)?$/s;

function resolveRealSource(source) {
  const match = source?.match(SOURCE_REF);
  if (!match) return null;
  const [, pkg, path] = match;
  // The path comes out of a content file. It names a file inside one hub
  // package and nothing else: a `..` segment would let an inventory entry
  // reach anywhere on the machine and publish what it finds into `public/`.
  if (path.split("/").some((segment) => segment === "..")) return null;
  for (const family of ["identity", "evidence", "market", "operations"]) {
    const candidate = join(HUB_REPO, family, pkg, path.trim());
    if (existsFile(candidate)) return candidate;
  }
  return null;
}

/** Converts one owned photograph into the entry's ratio, inside the budget. */
async function placeReal(entry, from) {
  const spec = RATIOS[entry.ratio];
  const out = spec.out;
  const base = sharp(from).resize({
    width: out.width,
    height: out.height,
    fit: "cover",
    position: "attention",
  });
  const file = join(REAL_DIR, `${entry.id}.webp`);
  for (const quality of QUALITY_LADDER) {
    const buffer = await base.clone().webp({ quality, effort: 5 }).toBuffer();
    if (buffer.length <= MAX_BYTES || quality === QUALITY_LADDER.at(-1)) {
      mkdirSync(REAL_DIR, { recursive: true });
      writeFileSync(file, buffer);
      return {
        file: `${REAL_PREFIX}/${entry.id}.webp`,
        width: out.width,
        height: out.height,
        bytes: buffer.length,
        quality,
      };
    }
  }
  throw new Error("unreachable");
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const files = pageFiles();
  const work = [];
  const real = [];
  const skipped = [];
  const failed = [];

  for (const file of files) {
    const page = relative(CONTENT, dirname(file));
    if (ONLY && page !== ONLY) continue;
    const { data } = readFrontmatter(file);
    const images = Array.isArray(data?.images) ? data.images : [];
    if (images.length === 0) {
      skipped.push(`${page}: no images: block in the frontmatter`);
      continue;
    }
    for (const entry of images) {
      if (entry.provenance === "real") {
        if (entry.file) {
          skipped.push(`${page}/${entry.id}: real, already placed at ${entry.file}`);
          continue;
        }
        // `status` is the clearance decision, and it is the content side's to
        // make: `real` means the asset is cleared for this slot, `needed`
        // means the rights are unverified (or the shot does not exist yet)
        // and the slot keeps the honest "Foto gesucht" hatch. A file lying on
        // a disk is not a clearance, so it is never enough on its own.
        if (entry.status !== "real") {
          skipped.push(
            `${page}/${entry.id}: real but status ${entry.status} — not cleared, stays "Foto gesucht"`,
          );
          continue;
        }
        const from = resolveRealSource(entry.source);
        if (!from) {
          skipped.push(
            `${page}/${entry.id}: real, no cleared asset on disk — stays "Foto gesucht"`,
          );
          continue;
        }
        real.push({ file, page, entry, from });
        continue;
      }
      if (entry.provenance !== "generated") {
        skipped.push(`${page}/${entry.id}: provenance ${entry.provenance} — not ours to render`);
        continue;
      }
      if (entry.status !== "needed" && entry.id !== FORCE) {
        skipped.push(`${page}/${entry.id}: status ${entry.status} — already rendered`);
        continue;
      }
      if (FORCE && entry.id !== FORCE) {
        skipped.push(`${page}/${entry.id}: --force names another entry`);
        continue;
      }
      if (!RATIOS[entry.ratio]) {
        skipped.push(`${page}/${entry.id}: unknown ratio ${entry.ratio}`);
        continue;
      }
      if (!entry.brief) {
        skipped.push(`${page}/${entry.id}: no brief — nothing to prompt with`);
        continue;
      }
      work.push({ file, page, entry });
    }
  }

  const renditions = work.reduce(
    (sum, { entry }) => sum + (entry.ratio === "hero" ? 2 : 1),
    0,
  );

  console.log(`\n${work.length} entr(ies) to render · ${renditions} rendition(s)`);
  console.log(`${real.length} real asset(s) to place (no model call, no cost)`);
  console.log(`model ${MODEL} · estimated cost $${(renditions * PRICE_PER_IMAGE_USD).toFixed(2)}\n`);

  if (skipped.length > 0) {
    console.log(`skipped ${skipped.length}:`);
    for (const line of skipped) console.log(`  · ${line}`);
    console.log("");
  }

  if (work.length === 0 && real.length === 0) {
    if (!DRY_RUN) {
      await fitBudget();
      await syncSizes();
    }
    return;
  }

  if (DRY_RUN) {
    for (const { page, entry, from } of real) {
      console.log(`── ${page}/${entry.id} · real · ${relative(REPO, from)}`);
    }
    for (const { page, entry } of work) {
      const prompt = buildPrompt(entry);
      console.log(`── ${page}/${entry.id} · ratio ${entry.ratio} · slot ${entry.slot}`);
      console.log(`   ${prompt}`);
      console.log(`   hash ${promptHash(prompt)}\n`);
    }
    console.log("--dry-run: nothing was called, nothing was written.\n");
    return;
  }

  /** Per-file patches, applied once per locale file at the end. */
  const patches = new Map();

  const record = (file, id, written) => {
    for (const locale of ["de", "en"]) {
      const localeFile = join(dirname(file), `${locale}.md`);
      if (!existsFile(localeFile)) {
        console.warn(`   no ${locale}.md — the rendition is recorded in de.md only`);
        continue;
      }
      const patch = patches.get(localeFile) ?? new Map();
      patch.set(id, written);
      patches.set(localeFile, patch);
    }
  };

  for (const { file, page, entry, from } of real) {
    const placed = await placeReal(entry, from);
    console.log(`── ${page}/${entry.id} · real · ${relative(REPO, from)}`);
    console.log(
      `   ${placed.file} — ${placed.width}×${placed.height}, ` +
        `${(placed.bytes / 1024).toFixed(0)} KB @ q${placed.quality}`,
    );
    record(file, entry.id, {
      status: "real",
      file: placed.file,
      width: placed.width,
      height: placed.height,
    });
  }

  if (work.length === 0) {
    await flush(patches);
    await fitBudget();
    await syncSizes();
    return;
  }

  const source = ensureToken();
  console.log(`OIDC token from ${source}\n`);
  const ai = await import("ai");
  const today = new Date().toISOString().slice(0, 10);

  for (const { file, page, entry } of work) {
    const prompt = buildPrompt(entry);
    const spec = RATIOS[entry.ratio];
    console.log(`── ${page}/${entry.id} · ${entry.ratio}`);

    const written = {
      status: "generated",
      model: MODEL,
      generated_at: today,
      prompt_hash: promptHash(prompt),
    };

    const target = join(OUT_DIR, `${entry.id}.webp`);
    let base;
    try {
      base = await renderWithRetry(ai, prompt, spec.request, spec.out, target, entry.id === FORCE);
    } catch (error) {
      failed.push(`${page}/${entry.id}: ${String(error?.message ?? error).split("\n")[0]}`);
      console.log(`   failed — ${String(error?.message ?? error).split("\n")[0]}`);
      continue;
    }
    if (!base.reused) {
      console.log(
        `   ${PUBLIC_PREFIX}/${entry.id}.webp — ${spec.out.width}×${spec.out.height}, ` +
          `${(base.bytes / 1024).toFixed(0)} KB @ q${base.quality}${base.over ? " ⚠ over budget" : ""}`,
      );
    }
    written.file = `${PUBLIC_PREFIX}/${entry.id}.webp`;
    written.width = spec.out.width;
    written.height = spec.out.height;

    if (spec.wide) {
      if (!base.reused) await sleep(PACE_MS);
      const wideTarget = join(OUT_DIR, `${entry.id}-wide.webp`);
      let wide;
      try {
        wide = await renderWithRetry(
          ai,
          prompt,
          spec.wide.request,
          spec.wide.out,
          wideTarget,
          entry.id === FORCE,
        );
      } catch (error) {
        failed.push(`${page}/${entry.id} (wide): ${String(error?.message ?? error).split("\n")[0]}`);
        console.log(`   wide failed — the entry keeps status needed`);
        continue;
      }
      if (!wide.reused) {
        console.log(
          `   ${PUBLIC_PREFIX}/${entry.id}-wide.webp — ${spec.wide.out.width}×${spec.wide.out.height}, ` +
            `${(wide.bytes / 1024).toFixed(0)} KB @ q${wide.quality}${wide.over ? " ⚠ over budget" : ""}`,
        );
      }
      written.wide_file = `${PUBLIC_PREFIX}/${entry.id}-wide.webp`;
      written.wide_width = spec.wide.out.width;
      written.wide_height = spec.wide.out.height;
    }

    // Both locales carry the same inventory; only the generated facts are
    // written across, so the English `alt` and `caption` stay English.
    record(file, entry.id, written);
    // Flushed per entry, not at the end: a rate limit half-way through a run
    // must not throw away the renditions already paid for.
    await flush(patches);
    patches.clear();
    if (!base.reused) await sleep(PACE_MS);
  }

  await flush(patches);
  await fitBudget();
  await syncSizes();

  if (failed.length > 0) {
    console.log(`\n${failed.length} rendition(s) failed — the entries keep \`status: needed\`:`);
    for (const line of failed) console.log(`  · ${line}`);
  }

  console.log(
    `\ndone — ${renditions} rendition(s), about $${(renditions * PRICE_PER_IMAGE_USD).toFixed(2)}.\n` +
      "Every one of them is a placeholder: marked in the page, listed in state/open.md, " +
      "and to be replaced by real photography.\n",
  );
}

/** Writes every collected patch into its locale file, one rewrite per file. */
async function flush(patches) {
  for (const [file, patch] of patches) {
    const { data } = readFrontmatter(file);
    const images = (data?.images ?? []).map((entry) =>
      patch.has(entry.id) ? { ...entry, ...patch.get(entry.id) } : entry,
    );
    writeImages(file, images);
    console.log(`updated ${relative(REPO, file)} — ${patch.size} entr(ies)`);
  }
}

function existsFile(path) {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

await main();
