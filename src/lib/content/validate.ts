/**
 * `check:content` — the validation gate of TS-007 D12.
 *
 * One command, every row non-zero on failure, nothing on the list a warning.
 * What runs here is the part of D12 the shipped artifacts and the installed
 * packages can actually carry today; the rows that need Layer C (page
 * compositions) or the full 26-type reshape are named at the bottom of
 * `src/lib/content/README.md` rather than silently skipped.
 *
 * | D12 | Check here | Status |
 * | --- | --- | --- |
 * | 1 schema parse | `schema` | runs |
 * | 3 provenance | `provenance`, `dummy-content` | runs |
 * | 5 facet completeness | `slot-meta` (provenance + status on every slot) | partial |
 * | 7 locale completeness | `locale-completeness` | runs |
 * | 8 harmonisation | `harmonisation` (records, slot set, provenance) | partial |
 * | 9 slot binding | `slot-binding` (unique ids inside a page) | partial |
 * | — TS-017-A14 | `spec-binding` | runs |
 *
 * Rows 2, 4, 6, 10, 11 and 12 are open — see the README.
 */

import { loadPage } from "@/src/lib/content/loader";
import { createHubResolver } from "@/src/lib/content/source-refs";
import { LOCALES } from "@/src/lib/i18n/locales";
import { ROUTE_IDS, ROUTES } from "@/src/lib/routes/routes";

import type { PageContent } from "@/src/lib/content/types";
import type { HubResolver } from "@/src/lib/content/source-refs";
import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";

export interface Finding {
  readonly level: "error" | "warning";
  /** Repository-relative path of the artifact. */
  readonly file: string;
  readonly slot?: string;
  readonly check:
    | "schema"
    | "spec-binding"
    | "slot-meta"
    | "slot-binding"
    | "provenance"
    | "dummy-content"
    | "locale-completeness"
    | "harmonisation";
  readonly message: string;
}

/** Validates one page artifact against TS-007 D5/D6/D11 and TS-017-A14. */
export function checkPage(page: PageContent, resolver: HubResolver): Finding[] {
  const findings: Finding[] = [];
  const at = (finding: Omit<Finding, "file" | "level">, level: Finding["level"] = "error") =>
    findings.push({ level, file: page.file, ...finding });

  if (!page.ok) {
    at({
      check: "schema",
      message:
        page.reason === "page-file-missing"
          ? "the artifact is missing"
          : "the frontmatter does not validate against PageFrontmatterSchema (TS-007 D5/D6)",
    });
    return findings;
  }

  const frontmatter = page.frontmatter!;

  if (frontmatter.page_id !== ROUTES[page.routeId].spec) {
    at({
      check: "spec-binding",
      message: `\`page_id: ${frontmatter.page_id}\` but the route table gives ${page.routeId} the spec ${ROUTES[page.routeId].spec} (TS-017-A14)`,
    });
  }

  if (frontmatter.locale !== page.locale) {
    at({
      check: "schema",
      message: `\`locale: ${frontmatter.locale}\` in the \`${page.locale}\` sibling`,
    });
  }

  for (const ref of frontmatter.derived_from) {
    const result = resolver.resolve(ref);
    if (!result.ok) {
      at({ check: "provenance", message: `page \`derived_from\`: ${result.message}` });
    }
  }

  if (page.slots.length === 0) {
    at({ check: "slot-binding", message: "the artifact carries no slot" });
  }

  for (const invalid of page.invalidSlots) {
    at({
      check: "slot-meta",
      message: `a slot metadata comment does not validate — ${invalid.problems.join("; ")}`,
    });
  }

  const seen = new Set<string>();
  for (const slot of page.slots) {
    if (seen.has(slot.id)) {
      at({ check: "slot-binding", slot: slot.id, message: "duplicate slot id in one page" });
    }
    seen.add(slot.id);

    if (slot.provenance === "generated" && !slot.demo) {
      // A warning, not an error: `generated` says "no hub record behind it",
      // `demo` says "show the Demo-Daten badge". Most generated slots are
      // demo data and must carry both, but a few are editorial choices that
      // are not demo data — the stage-0 reference place, the accessibility
      // statement awaiting counsel. Both are registered in state/open.md,
      // which is what the dummy-content rule actually requires.
      at(
        {
          check: "dummy-content",
          slot: slot.id,
          message:
            "generated but not marked `demo: true` — confirm it needs no `Demo-Daten` badge and carries a state/open.md row (plan/guardrails.md)",
        },
        "warning",
      );
    }

    const claimsASource =
      slot.provenance === "sourced" || slot.provenance === "sourced-empty-by-design";
    const isDummyContent = slot.provenance === "generated" && slot.demo;

    if (slot.derivedFrom.length === 0 && !isDummyContent) {
      // `sourced` claims a source and must name it — that is D6's rule and
      // its reason (no source, no update path). `withheld` and `mixed`
      // legitimately have none for the part that is missing (TS-024 D10,
      // TS-026 D5): reported, not failed.
      //
      // Dummy content is the third case and is exempt [PROPOSED, amends D6]:
      // an invented demo card derives from nothing, and writing
      // `derived_from: [ia]` there would claim the information architecture
      // as its source, which is worse than an honest empty list. Its update
      // path is the state/open.md Dummy-Content row, not a hub record.
      at(
        {
          check: "provenance",
          slot: slot.id,
          message:
            "empty `derived_from`: content that derives from nothing has no update path (TS-007 D6)",
        },
        claimsASource ? "error" : "warning",
      );
    }

    for (const ref of slot.derivedFrom) {
      const result = resolver.resolve(ref);
      if (!result.ok) {
        at({ check: "provenance", slot: slot.id, message: result.message });
      }
    }
  }

  return findings;
}

export interface LocaleSetOptions {
  /**
   * How a missing locale sibling is reported. `error` is TS-007 D8/D12 row 7;
   * `warning` is the interim while a locale is being written.
   */
  readonly missingLocale?: "error" | "warning";
}

/**
 * Locale completeness (D12 row 7) and the must-match column of the
 * harmonisation contract (concept B.4, D12 row 8): same slots, same records,
 * same provenance. Wording, length and sentence count may differ — that is
 * the whole point of generating per locale rather than translating.
 */
export function checkLocaleSet(
  routeId: RouteId,
  pages: Partial<Record<Locale, PageContent>>,
  options: LocaleSetOptions = {},
): Finding[] {
  const findings: Finding[] = [];
  const missingLevel = options.missingLocale ?? "error";

  const [defaultLocale, ...others] = LOCALES;
  const reference = pages[defaultLocale];
  if (!reference?.ok) return findings;

  for (const locale of others) {
    const sibling = pages[locale];
    if (!sibling?.ok) {
      findings.push({
        level: missingLevel,
        file: sibling?.file ?? `${routeId}/${locale}`,
        check: "locale-completeness",
        message: `no valid \`${locale}\` sibling for ${routeId} (TS-007 D8.1)`,
      });
      continue;
    }

    const referenceIds = reference.slots.map((slot) => slot.id);
    const siblingIds = sibling.slots.map((slot) => slot.id);
    const dropped = referenceIds.filter((id) => !siblingIds.includes(id));
    const added = siblingIds.filter((id) => !referenceIds.includes(id));
    if (dropped.length > 0 || added.length > 0) {
      findings.push({
        level: "error",
        file: sibling.file,
        check: "harmonisation",
        message: `slot set differs from \`${defaultLocale}\`${
          dropped.length ? ` — missing ${dropped.join(", ")}` : ""
        }${added.length ? ` — extra ${added.join(", ")}` : ""} (no locale ships fewer blocks, concept B.4)`,
      });
    }

    for (const slot of reference.slots) {
      const twin = sibling.slots.find((candidate) => candidate.id === slot.id);
      if (!twin) continue;
      const left = [...slot.derivedFrom].sort().join(" ");
      const right = [...twin.derivedFrom].sort().join(" ");
      if (left !== right) {
        findings.push({
          level: "error",
          file: sibling.file,
          slot: slot.id,
          check: "harmonisation",
          message: `binds different records than \`${defaultLocale}\`: [${right}] vs [${left}] (concept B.4 must-match)`,
        });
      }
      const leftShape = slot.blocks.map((block) => block.kind).join(",");
      const rightShape = twin.blocks.map((block) => block.kind).join(",");
      if (leftShape !== rightShape) {
        findings.push({
          level: "error",
          file: sibling.file,
          slot: slot.id,
          check: "harmonisation",
          message: `block sequence differs from \`${defaultLocale}\`: [${rightShape}] vs [${leftShape}] — same slots filled, same order (concept B.4); pages address fields by position because the labels are translated`,
        });
      }
      if (twin.provenance !== slot.provenance || twin.demo !== slot.demo) {
        findings.push({
          level: "error",
          file: sibling.file,
          slot: slot.id,
          check: "harmonisation",
          message: `provenance differs from \`${defaultLocale}\`: ${twin.provenance}/${twin.demo} vs ${slot.provenance}/${slot.demo}`,
        });
      }
    }
  }

  return findings;
}

export interface CheckTreeOptions extends LocaleSetOptions {
  readonly contentRoot?: string;
  readonly resolver?: HubResolver;
}

/**
 * The whole tree: every route, every configured locale. Used by
 * `scripts/check-content.ts` and by the integration test.
 */
export async function checkContentTree(
  options: CheckTreeOptions = {},
): Promise<Finding[]> {
  const resolver = options.resolver ?? createHubResolver();
  const findings: Finding[] = [];

  for (const routeId of ROUTE_IDS) {
    const pages: Partial<Record<Locale, PageContent>> = {};
    for (const locale of LOCALES) {
      const page = await loadPage(routeId, locale, {
        ...(options.contentRoot ? { contentRoot: options.contentRoot } : {}),
      });
      pages[locale] = page;
      findings.push(...checkPage(page, resolver));
    }
    findings.push(...checkLocaleSet(routeId, pages, options));
  }

  // Two routes share one artifact (TS-026), so the same file is checked twice.
  const seen = new Set<string>();
  return findings.filter((finding) => {
    const key = `${finding.file}|${finding.slot ?? ""}|${finding.check}|${finding.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
