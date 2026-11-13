/**
 * The static half of DEC-0169 — a link to another origin opens a new tab, and
 * no call site decides that on its own.
 *
 * `src/lib/routes/link-target.ts` reads the target off the href and
 * `src/components/anchor/anchor.tsx` is the one element that applies it. This
 * guard keeps it that way, over every component and page file:
 *
 *  1. A raw `<a>` may stand only where its target provably stays on the site
 *     — a route-facade call (`href(…)`, `linkHref(…)`) or a literal that
 *     starts with `/`, `#`, `?`, `mailto:` or `tel:`. Anything else (a
 *     variable, a prop, an `https:` literal) goes through `<Anchor>`, which is
 *     where the new tab is decided.
 *  2. No file but `anchor.tsx` writes a `target` or a `rel` on a link. A
 *     hand-written `target="_blank"` without the note, or a `rel="noopener"`
 *     without `noreferrer`, is how the policy drifted before it was one.
 *  3. A `next/link` `<Link>` never takes a literal `http(s):` target: it is
 *     the site's own router.
 *
 * The browser half — every rendered `a[href]` to another origin, on every
 * route — is `e2e/external-links.spec.ts` (TS-WEB-0016-A24).
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ANCHOR_FILE = "src/components/anchor/anchor.tsx";

function sourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) return entry === "node_modules" || entry === "generated" ? [] : sourceFiles(path);
    if (!/\.tsx$/.test(entry) || /\.test\.tsx$/.test(entry)) return [];
    return [path];
  });
}

/** Every JSX opening tag of `tag` in a file, braces balanced, with its line. */
export function openingTags(source: string, tag: string): { readonly text: string; readonly line: number }[] {
  const found: { text: string; line: number }[] = [];
  const opener = new RegExp(`<${tag}(?=[\\s>/])`, "g");
  for (const match of source.matchAll(opener)) {
    let depth = 0;
    let index = match.index + match[0].length;
    for (; index < source.length; index += 1) {
      const char = source[index];
      if (char === "{") depth += 1;
      else if (char === "}") depth -= 1;
      else if (char === ">" && depth === 0) break;
    }
    found.push({
      text: source.slice(match.index, index + 1),
      line: source.slice(0, match.index).split("\n").length,
    });
  }
  return found;
}

/** The `href` attribute's value as written: `"…"`, or the expression inside `{…}`. */
export function hrefOf(tag: string): string | undefined {
  const literal = /\shref="([^"]*)"/.exec(tag);
  if (literal) return `"${literal[1]}"`;
  const start = tag.search(/\shref=\{/);
  if (start === -1) return undefined;
  let depth = 0;
  let index = tag.indexOf("{", start);
  const from = index + 1;
  for (; index < tag.length; index += 1) {
    if (tag[index] === "{") depth += 1;
    else if (tag[index] === "}") {
      depth -= 1;
      if (depth === 0) break;
    }
  }
  return tag.slice(from, index).trim();
}

/** A target this site resolves itself — never another origin. */
export function staysOnSite(href: string): boolean {
  if (/^(href|linkHref)\(/.test(href)) return true;
  return /^["'`](\/(?!\/)|#|\?|mailto:|tel:)/.test(href);
}

const FILES = [...sourceFiles(join(ROOT, "src")), ...sourceFiles(join(ROOT, "app"))];

describe("TS-WEB-0016-A25: every link that may leave the site goes through `anchor`, which opens it in a new tab", () => {
  it("finds the files it guards", () => {
    expect(FILES.length).toBeGreaterThan(50);
    expect(FILES.map((file) => relative(ROOT, file))).toContain(ANCHOR_FILE);
  });

  it("leaves a raw <a> only where its target provably stays on the site", () => {
    const offenders = FILES.filter((file) => relative(ROOT, file) !== ANCHOR_FILE).flatMap((file) =>
      openingTags(readFileSync(file, "utf8"), "a").flatMap(({ text, line }) => {
        const href = hrefOf(text);
        return href === undefined || staysOnSite(href) ? [] : [`${relative(ROOT, file)}:${line} href={${href}}`];
      }),
    );
    expect(offenders, "render these through <Anchor> (DEC-0169)").toEqual([]);
  });

  it("writes `target` and `rel` on a link in one file only", () => {
    const offenders = FILES.filter((file) => relative(ROOT, file) !== ANCHOR_FILE).flatMap((file) => {
      const source = readFileSync(file, "utf8");
      return [...openingTags(source, "a"), ...openingTags(source, "Link"), ...openingTags(source, "Anchor")].flatMap(
        ({ text, line }) => (/\s(target|rel)=/.test(text) ? [`${relative(ROOT, file)}:${line}`] : []),
      );
    });
    expect(offenders, "the target is `linkTarget()`'s to decide (DEC-0169)").toEqual([]);
  });

  it("never hands next/link a target on another origin", () => {
    const offenders = FILES.flatMap((file) =>
      openingTags(readFileSync(file, "utf8"), "Link").flatMap(({ text, line }) => {
        const href = hrefOf(text);
        return href !== undefined && /^["'`](https?:)?\/\//.test(href) ? [`${relative(ROOT, file)}:${line}`] : [];
      }),
    );
    expect(offenders).toEqual([]);
  });

  it("recognises the forms it rules on", () => {
    expect(staysOnSite('"/start"')).toBe(true);
    expect(staysOnSite("`#${targetId}`")).toBe(true);
    expect(staysOnSite("`mailto:${email}`")).toBe(true);
    expect(staysOnSite('href("home", locale)')).toBe(true);
    expect(staysOnSite("linkHref(to, { locale })")).toBe(true);
    expect(staysOnSite('"https://example.org"')).toBe(false);
    expect(staysOnSite('"//example.org"')).toBe(false);
    expect(staysOnSite("sourceUrl")).toBe(false);
    expect(hrefOf('<a className={x} href={linkHref(to, { query: { a: 1 } })} id="y">')).toBe(
      "linkHref(to, { query: { a: 1 } })",
    );
    expect(openingTags("<a href={`#${id}`} onClick={() => go()}>x</a>", "a")[0]?.text).toBe(
      "<a href={`#${id}`} onClick={() => go()}>",
    );
  });
});
