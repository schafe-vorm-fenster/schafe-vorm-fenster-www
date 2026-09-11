/**
 * The source adapter (TS-007 D2) — the only module that knows hub package
 * layout, and the only one that opens a hub package at all.
 *
 * Contract: `resolve(sourceRef) → record | fail`, where a `sourceRef` is
 * `<package>@<version>#<record-id>` (TS-007 D6, DEC-042). A version that does
 * not match the installed package fails loudly; an unknown record id fails
 * loudly; nothing paraphrases around a missing record.
 *
 * **Build-time and generation-time only** (TS-007 D3). It is imported by
 * `scripts/check-content.ts` and by tests. `loader.ts`, which is what a page
 * calls, never imports it — request-time content reads stay inside
 * `content/` (TS-007-A12).
 *
 * The consumption interface is `index.json` and nothing else (D1): no module
 * here reads a `.md` file out of a package directory.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { SOURCE_REF_PATTERN } from "@/src/domain/content-frontmatter.schema";

/** A parsed provenance reference. */
export interface SourceRef {
  readonly raw: string;
  /**
   * `record` — one record of one package (the canonical D6 form)
   * `pool`   — a whole package at a version, the pool a selectable slot draws
   *            from; the relevance engine picks the element [PROPOSED]
   * `ia`     — a copy shell with no source record, declared against the
   *            information architecture (D6)
   */
  readonly kind: "record" | "pool" | "ia";
  readonly packageName?: string;
  readonly version?: string;
  readonly recordId?: string;
}

export type HubRecord = Record<string, unknown>;

export type ResolveResult =
  | { readonly ok: true; readonly ref: SourceRef; readonly record: HubRecord | null }
  | {
      readonly ok: false;
      readonly ref: SourceRef | null;
      readonly problem:
        | "malformed"
        | "unknown-package"
        | "no-index"
        | "version-mismatch"
        | "unknown-record";
      readonly message: string;
    };

export interface HubResolver {
  resolve(raw: string): ResolveResult;
  /** Every record id a package ships, for a "did you mean" in the checker. */
  recordIds(packageName: string): readonly string[];
}

/** Parses a reference. Returns `null` for anything that is not one of the three forms. */
export function parseSourceRef(raw: string): SourceRef | null {
  const value = raw.trim();
  if (!SOURCE_REF_PATTERN.test(value)) return null;
  if (value === "ia") return { raw: value, kind: "ia" };

  const hash = value.indexOf("#");
  const address = hash === -1 ? value : value.slice(0, hash);
  const recordId = hash === -1 ? undefined : value.slice(hash + 1);
  const at = address.lastIndexOf("@");
  const packageName = address.slice(0, at);
  const version = address.slice(at + 1);

  return recordId === undefined
    ? { raw: value, kind: "pool", packageName, version }
    : { raw: value, kind: "record", packageName, version, recordId };
}

interface PackageIndex {
  readonly name?: string;
  readonly version?: string;
  readonly files?: readonly {
    readonly path?: string;
    readonly frontmatter?: HubRecord;
  }[];
}

/**
 * The record id of an indexed file. Packages differ: `proof`, `offerings`,
 * `audiences` and `goals` carry `id`, `brand-identity` carries `key`, and
 * `media-echo` carries neither — its entries are addressed by file stem,
 * which is the id `proof`'s own `media_echo[]` uses. [PROPOSED — TS-007 D1
 * fixes `index.json` as the interface but not how an id is spelled in it.]
 */
function recordIdOf(file: { path?: string; frontmatter?: HubRecord }): string | null {
  const frontmatter = file.frontmatter;
  if (!frontmatter) return null;
  const declared = frontmatter.id ?? frontmatter.key;
  if (typeof declared === "string" && declared) return declared;
  if (!file.path) return null;
  const base = file.path.split("/").pop() ?? "";
  const stem = base.replace(/\.[^.]+$/, "").replace(/\.[a-z-]+$/, "");
  return stem || null;
}

/**
 * A resolver over the installed packages. `modulesDir` exists for tests and
 * for the checker; everything else takes the default.
 */
export function createHubResolver(
  options: { readonly modulesDir?: string } = {},
): HubResolver {
  const modulesDir = options.modulesDir ?? join(process.cwd(), "node_modules");
  const indexes = new Map<string, PackageIndex | null>();

  const indexOf = (packageName: string): PackageIndex | null => {
    const cached = indexes.get(packageName);
    if (cached !== undefined) return cached;
    let index: PackageIndex | null = null;
    try {
      index = JSON.parse(
        readFileSync(join(modulesDir, packageName, "index.json"), "utf-8"),
      ) as PackageIndex;
    } catch {
      index = null;
    }
    indexes.set(packageName, index);
    return index;
  };

  const idsOf = (packageName: string): string[] => {
    const index = indexOf(packageName);
    if (!index?.files) return [];
    return index.files
      .map(recordIdOf)
      .filter((id): id is string => Boolean(id));
  };

  return {
    recordIds: idsOf,

    resolve(raw: string): ResolveResult {
      const ref = parseSourceRef(raw);
      if (!ref) {
        return {
          ok: false,
          ref: null,
          problem: "malformed",
          message: `\`${raw}\` is not \`<package>@<version>#<record-id>\`, \`<package>@<version>\` or \`ia\` (TS-007 D6)`,
        };
      }
      if (ref.kind === "ia") return { ok: true, ref, record: null };

      const index = indexOf(ref.packageName!);
      if (!index) {
        return {
          ok: false,
          ref,
          problem: "unknown-package",
          message: `\`${ref.packageName}\` is not installed, or ships no index.json (TS-007 D1)`,
        };
      }
      if (index.version !== ref.version) {
        return {
          ok: false,
          ref,
          problem: "version-mismatch",
          message: `\`${ref.packageName}\` is installed at ${index.version}, the reference names ${ref.version}`,
        };
      }
      if (ref.kind === "pool") return { ok: true, ref, record: null };

      const hit = (index.files ?? []).find(
        (file) => recordIdOf(file) === ref.recordId,
      );
      if (!hit?.frontmatter) {
        return {
          ok: false,
          ref,
          problem: "unknown-record",
          message: `\`${ref.packageName}@${index.version}\` ships no record \`${ref.recordId}\``,
        };
      }
      return { ok: true, ref, record: hit.frontmatter };
    },
  };
}
