/**
 * `check:content` — the validation gate of TS-WEB-0007 D12.
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
 * | — TS-WEB-0007 D11/A14 | `lifecycle` (the editorial gate) | runs |
 * | 7 locale completeness | `locale-completeness` | runs |
 * | 8 harmonisation | `harmonisation` (records, slot set, provenance) | partial |
 * | 9 slot binding | `slot-binding` (unique ids inside a page) | partial |
 * | 11 glossary conformance | `avoid-list`, `product-name` | runs |
 * | 13 copy structure | `copy-structure` (CG-005, CG-004, CG-036) | partial |
 * | 14 register | `register` (CG-003, one exemption by route) | partial |
 * | — TS-WEB-0017-A14 | `spec-binding` | runs |
 *
 * Rows 2, 4, 6, 10 and 12 are open, and so are the halves of 13 and 14 that
 * the copy contract leaves to review — see the README.
 */

import { loadPage } from "@/src/lib/content/loader";
import { contentEnvironment, PRODUCTION_STATUSES, rendersIn } from "@/src/lib/content/lifecycle";
import { createHubResolver } from "@/src/lib/content/source-refs";
import { LOCALES } from "@/src/lib/i18n/locales";
import { ROUTE_IDS, ROUTES } from "@/src/lib/routes/routes";

import type { Environment } from "@/src/lib/security/csp";
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
    | "harmonisation"
    | "lifecycle"
    | "avoid-list"
    | "copy-structure"
    | "register"
    | "product-name";
  readonly message: string;
}

/* ---------------------------------------------------------------------------
 * D12 rows 11, 13 and 14 — the copy lint (SRC-0018, DEC-0136)
 *
 * The three rows share one traversal, because they ask the same question of
 * the same strings: *which text on this page is copy, and what is that field
 * for?* Everything below is the machine half of `specs/contracts/copy-
 * contract.md`; the halves that contract assigns to `review` are not here and
 * are named in the README.
 * ------------------------------------------------------------------------ */

/**
 * What a field's label says the field is **for** — the field-role map
 * (DEC-0136).
 *
 * Only one distinction has a rule behind it today: `CG-005` forbids a question
 * mark in a **section title** and allows it in a kicker (*"Was hilft euch
 * das?"*), in a form step's question and in the hero headline, which is
 * `CG-020`'s own shape. A lint that cannot tell a title from a kicker either
 * fails the kickers or passes the titles, so the role is read off the label.
 *
 * The labels are authored German and English (`CG-041`: EN mirrors DE), so the
 * map is a pattern over both rather than a list of eleven pages' labels: a
 * label carrying `Überschrift`, `heading`, `Titel` or `title` as a word is a
 * section title, unless its head names something else the artifacts label with
 * a title word — a quote's source title, a link label, a hero `Headline`.
 */
export type FieldRole = "section-title" | "other";

const TITLE_WORD = /(?:^|[\s(\[\-–—/])(überschrift|heading|titel|title)(?=$|[\s)\]:\-–—/])/i;

/**
 * Heads that carry a title word and are not section titles: the hero headline
 * (`Headline`, `h1` — exempt as CG-020), the kicker, a form step's question,
 * a quote's source title, a link or button label.
 */
const NOT_A_SECTION_TITLE =
  /^(headline|h1|kicker|frage|question|zitat|quote|quelle|source|beleg|proof|link|cta|button|beschriftung|label|sucheingabe|search input)\b/i;

export function fieldRole(label: string): FieldRole {
  const head = label.trim();
  if (NOT_A_SECTION_TITLE.test(head)) return "other";
  return TITLE_WORD.test(head) ? "section-title" : "other";
}

/** One authored string the lint judges, with the field it was authored in. */
export interface CopyText {
  readonly slot: string;
  readonly label: string;
  readonly role: FieldRole;
  readonly kind: "field" | "list item" | "table cell";
  readonly text: string;
}

/**
 * The copy of a page artifact: field values, and the list items and table
 * cells that stand **directly** under a field.
 *
 * What is deliberately not copy (DEC-0136): the `**Label:**` itself — a
 * slot-internal name, not a rendered string, which is why a field may be
 * labelled `Warum es zählt` while the avoid list forbids that wording on the
 * page — and every paragraph, because a paragraph below a slot is the
 * authoring note that says where the copy came from (`content/pages/**`
 * convention). A note quoting a forbidden term to forbid it (`Kein „im Amt" im
 * Benefit-Band`) must not fail the build that its own slot passes, so a list
 * whose nearest preceding block is a paragraph is a note list, not copy.
 */
export function copyOf(page: PageContent): CopyText[] {
  const texts: CopyText[] = [];
  if (!page.ok) return texts;

  for (const slot of page.slots) {
    let field: { readonly label: string; readonly role: FieldRole } | null = null;
    for (const block of slot.blocks) {
      if (block.kind === "field") {
        field = { label: block.label, role: fieldRole(block.label) };
        if (block.value) {
          texts.push({ slot: slot.id, ...field, kind: "field", text: block.value });
        }
        continue;
      }
      if (block.kind === "paragraph") {
        field = null;
        continue;
      }
      if (!field) continue;
      const cells =
        block.kind === "list" ? block.items : [...block.head, ...block.rows.flat()];
      for (const cell of cells) {
        if (!cell) continue;
        texts.push({
          slot: slot.id,
          label: field.label,
          // A list under a title is the title's content, never a second title.
          role: "other",
          kind: block.kind === "list" ? "list item" : "table cell",
          text: cell,
        });
      }
    }
  }

  return texts;
}

/**
 * How a term of the avoid list is matched where the guide's row carries a
 * scope a plain pattern cannot decide.
 *
 * - `standalone-claim` — the term must **be** a whole segment of the field
 *   (*"Einfach · digital · für alle"*), not a word inside a sentence. The
 *   generic-claims row has an empty *use instead* column, and the glossary's
 *   own convention says an empty cell is "a gap on the record, not a licence
 *   to invent one": failing *"mit dem man einfach starten kann"* — the owner's
 *   sentence in DEC-0084 §2 — would force an invention. The adverb stays with
 *   review (`TS-WEB-0006-A16`).
 * - `section-title` — the row says *(as a title)* / *(as a heading)*, and the
 *   same words are allowed in a kicker (`CG-005`).
 * - `sole-addressee` — `CG-036`: `im Amt` fails only where no second
 *   addressee stands beside it (`copy-contract.md` CG-036).
 * - `product-origin` — the row says *(about this product)*; `gebaut` and
 *   `betrieben` are ordinary German words and fail only where the same field
 *   also names the village (DEC-0066 §2, CG-033).
 */
export type AvoidScope =
  | "standalone-claim"
  | "section-title"
  | "sole-addressee"
  | "product-origin";

export interface AvoidTerm {
  /** The rule this row belongs to — `CG-####` or a `GL-####`/`DEC-####`. */
  readonly rule: string;
  readonly pattern: RegExp;
  /** The guide's *use instead* column, where it carries one. */
  readonly instead?: string;
  readonly scope?: AvoidScope;
  /** Routes the term's own row exempts — never a field, never a flag. */
  readonly exemptRoutes?: readonly RouteId[];
}

const CO_ADDRESSEE =
  /\b(Verein|Vereins|Vereine|Vereinen|Stiftung|Stiftungen|Kulturgesellschaft|Volkshochschule|Akteur|Akteure|Akteuren|club|clubs|foundation|actor|actors)\b/i;

const NAMES_THE_VILLAGE = /\b(Dorf|Dorfes|Dörfer|Schlatkow|village)\b/i;

/**
 * `CG-040` — the avoid list, as the lint reads it: the German and English
 * tables of `concept/website-copy-guide.md` §9 plus the **avoid** column of
 * `specs/glossary/glossary.md`. `validate.test.ts` holds the drift test that
 * fails when the glossary grows a term this list does not carry.
 *
 * `Portalize` is on both lists and is **not** here: it is a count, not a
 * hit (`CG-038`, `checkProductName`).
 */
export const AVOID_TERMS: readonly AvoidTerm[] = [
  // — the glossary's avoid column, and the guide's DE/EN tables
  {
    rule: "CG-009",
    pattern: /\bdie Leute\b/i,
    instead: "die Nachbarn · das Nachbardorf · die Neuen · wer hier etwas organisiert",
  },
  {
    rule: "CG-009",
    pattern: /\bthe people\b/i,
    instead: "the neighbours · the next village · the newcomers",
  },
  { rule: "CG-004", pattern: /\bdie Firma\b/i, instead: "Schafe vorm Fenster" },
  { rule: "CG-004", pattern: /\bthe company\b/i, instead: "Schafe vorm Fenster" },
  {
    rule: "CG-036",
    pattern: /\bim Amt\b/i,
    instead: "bei euch, or a second addressee beside it",
    scope: "sole-addressee",
  },
  {
    rule: "CG-036",
    pattern: /\bat the council\b/i,
    instead: "at your end, or a second addressee beside it",
    scope: "sole-addressee",
  },
  {
    rule: "CG-039",
    pattern: /\b(das|dem) Produkt\b/i,
    instead: "euer Kalender · der Dorfkalender",
  },
  {
    rule: "CG-039",
    pattern: /\bthe product\b/i,
    instead: "your calendar · the community calendar",
  },
  {
    // The guide writes `Vereinswebseite`; the artifacts wrote
    // `Vereinswebsite`. One word, one rule (DEC-0136).
    rule: "CG-040",
    pattern: /\bVereinsweb(seite|site)\b/i,
    instead: "eure eigene Website",
  },
  { rule: "CG-040", pattern: /\bclub website\b/i, instead: "your own website" },
  {
    rule: "GL-0012",
    pattern: /\bPostleitzahl(en)?\b/i,
    instead: "Ortsname",
    exemptRoutes: ["order"],
  },
  { rule: "GL-0012", pattern: /\bPLZ\b/, instead: "Ortsname", exemptRoutes: ["order"] },
  {
    rule: "GL-0012",
    pattern: /\bZIP ?codes?\b/i,
    instead: "place name",
    exemptRoutes: ["order"],
  },
  {
    rule: "GL-0012",
    pattern: /\bpost(al )?codes?\b/i,
    instead: "place name",
    exemptRoutes: ["order"],
  },
  { rule: "DEC-0062", pattern: /\bOrganizer[ns]?\b/i, instead: "Akteur · actor" },
  { rule: "CG-018", pattern: /\bWarum das zählt\b/i, instead: "Was hilft euch das?" },
  {
    rule: "CG-018",
    pattern: /\bWhy this matters\b/i,
    instead: "What does this do for you?",
  },
  { rule: "CG-017", pattern: /\bWarum wir\b/i, instead: "Über uns · Wer dahintersteckt" },
  { rule: "CG-017", pattern: /\bWhy us\b/i, instead: "About us · Who is behind it" },
  { rule: "CG-017", pattern: /\bWo das herkommt\b/i, scope: "section-title" },
  {
    rule: "CG-017",
    pattern: /\bWer das schon macht\b/i,
    instead: "Was andere sagen (press proof only)",
  },
  { rule: "CG-005", pattern: /\bWarum es (heute )?hakt\b/i, scope: "section-title" },
  { rule: "CG-035", pattern: /\bPresse- und Auftrittshistorie\b/i },
  { rule: "CG-004", pattern: /\bBeides gibt es\b/i, instead: "write the thing out" },
  { rule: "CG-004", pattern: /\bDieselben Termine\b/i, instead: "write the thing out" },
  { rule: "CG-004", pattern: /\bDer Name der Firma\b/i, instead: "write the thing out" },
  { rule: "CG-016", pattern: /\bGenau so\./i },
  // — CG-033: the origin claim DEC-0066 §2 took off the page
  { rule: "CG-033", pattern: /\bgebaut\b/i, scope: "product-origin" },
  { rule: "CG-033", pattern: /\bbetrieben\b/i, scope: "product-origin" },
  { rule: "CG-033", pattern: /\bbuilt in a village\b/i },
  { rule: "CG-033", pattern: /\boperated from a village\b/i },
  // — the generic claims: a claim, not a word in a sentence
  { rule: "CG-040", pattern: /\beinfach\b/i, scope: "standalone-claim" },
  { rule: "CG-040", pattern: /\bdigital\b/i, scope: "standalone-claim" },
  { rule: "CG-040", pattern: /\bfür alle\b/i, scope: "standalone-claim" },
  { rule: "CG-040", pattern: /\bmodern\b/i, scope: "standalone-claim" },
  { rule: "CG-040", pattern: /\binnovativ\b/i, scope: "standalone-claim" },
  { rule: "CG-040", pattern: /\bsimple\b/i, scope: "standalone-claim" },
  { rule: "CG-040", pattern: /\bfor everyone\b/i, scope: "standalone-claim" },
  { rule: "CG-040", pattern: /\binnovative\b/i, scope: "standalone-claim" },
];

/** Segments of one field: what a reader reads as one claim. */
const SEGMENTS = /[.!?;:·|,\n]+|\s[–—-]\s/;

/** The term this text hits, or `null`. Scope decides what counts as a hit. */
export function avoidHit(term: AvoidTerm, copy: CopyText): string | null {
  if (term.scope === "standalone-claim") {
    for (const segment of copy.text.split(SEGMENTS)) {
      const trimmed = segment.trim();
      const match = term.pattern.exec(trimmed);
      if (match && match[0].length === trimmed.length) return match[0];
    }
    return null;
  }

  const match = term.pattern.exec(copy.text);
  if (!match) return null;
  if (term.scope === "section-title" && copy.role !== "section-title") return null;
  if (term.scope === "sole-addressee" && CO_ADDRESSEE.test(copy.text)) return null;
  if (term.scope === "product-origin" && !NAMES_THE_VILLAGE.test(copy.text)) return null;
  return match[0];
}

/**
 * `CG-003` / D12 row 14 — a formal-register form. Capitalised mid-sentence, or
 * an imperative `<Verb> Sie`.
 *
 * Sentence-initial is the whole difficulty: *"Die Termine oben tippt niemand
 * bei uns ein. **Sie** kommen von den Vereinen"* is the plural pronoun and
 * *"**Ihr** könnt selbst bestimmen"* is the informal plural — both are the
 * register this site writes, both are capitalised because a German sentence
 * begins in upper case. A lint that flags them flags the copy it exists to
 * protect, so position decides: at the start of a sentence, a clause opened by
 * a dash, or inside an opening quotation mark, the form passes.
 */
const FORMAL_FORM = /\b(Sie|Ihnen|Ihre|Ihrem|Ihren|Ihrer|Ihres|Ihr)\b/;
const SENTENCE_START = /(?:^|[.!?:;…]|[„“"»«(\[]|\n|\s[–—-])\s*$/;
const IMPERATIVE_VERB = /(?:^|[.!?…]\s+)([A-ZÄÖÜ][a-zäöüß]{2,}e?n)\s+$/;

export interface RegisterHit {
  readonly form: string;
  /** `Tragt` … no: `Tragen Sie` — the imperative half of the row. */
  readonly imperative: boolean;
}

export function registerHits(text: string): RegisterHit[] {
  const hits: RegisterHit[] = [];
  const scanner = new RegExp(FORMAL_FORM.source, "g");
  let match: RegExpExecArray | null;
  while ((match = scanner.exec(text)) !== null) {
    const before = text.slice(0, match.index);
    if (SENTENCE_START.test(before)) continue;
    hits.push({ form: match[0], imperative: IMPERATIVE_VERB.test(before) });
  }
  return hits;
}

/**
 * The one exemption of D12 row 14, keyed on the route (DEC-0066 amendment
 * 2026-09-24, TS-WEB-0029 D6a/A15).
 *
 * The five legal texts are imported verbatim in the formal register
 * (DEC-0012, DEC-0027), and the exemption is the **whole page**: a page whose
 * headings say `du` over text that says `Sie` reproduces inside one page the
 * seam DEC-0066 exists to prevent. It is a route list here and nowhere else —
 * never a field name, never a flag in a content file — so it cannot spread.
 */
export const REGISTER_EXEMPT_ROUTES: readonly RouteId[] = ["legal"];

/**
 * Rows 11, 13 and 14 over one page artifact. Reports file, field and term
 * (TS-WEB-0007-A13, TS-WEB-0006-A8).
 */
export function checkCopy(page: PageContent): Finding[] {
  if (!page.ok) return [];

  const findings: Finding[] = [];
  const registerExempt = REGISTER_EXEMPT_ROUTES.includes(page.routeId);

  for (const copy of copyOf(page)) {
    const where = `\`${copy.label}\`${copy.kind === "field" ? "" : ` (${copy.kind})`}`;

    // Row 11 — the avoid list.
    for (const term of AVOID_TERMS) {
      if (term.exemptRoutes?.includes(page.routeId)) continue;
      const hit = avoidHit(term, copy);
      if (!hit) continue;
      findings.push({
        level: "error",
        file: page.file,
        slot: copy.slot,
        check: "avoid-list",
        message: `${where}: \`${hit}\` is on the avoid list (${term.rule})${
          term.instead ? ` — use ${term.instead}` : " — the guide names no replacement"
        }`,
      });
    }

    // Row 13 — a section title is a statement (CG-005).
    if (copy.role === "section-title" && copy.text.includes("?")) {
      findings.push({
        level: "error",
        file: page.file,
        slot: copy.slot,
        check: "copy-structure",
        message: `${where}: a section title carries a question mark — a title is a statement, and the question belongs in the kicker above it (CG-005, TS-WEB-0006-A8)`,
      });
    }

    // Row 14 — one register, `du` (CG-003).
    if (!registerExempt) {
      for (const hit of registerHits(copy.text)) {
        findings.push({
          level: "error",
          file: page.file,
          slot: copy.slot,
          check: "register",
          message: `${where}: \`${hit.form}\`${
            hit.imperative ? " in an imperative `<Verb> Sie`" : " mid-sentence"
          } — this site says \`du\`, and \`${ROUTES.legal.path.de}\` is the only exempt route (CG-003, DEC-0066, TS-WEB-0029-A15)`,
        });
      }
    }
  }

  return findings;
}

/** `CG-038` — the product name, and the one field that may carry it. */
export const PRODUCT_NAME = "Portalize";

/**
 * Case-sensitive on purpose: `portalize-calendar` is an offering id in a data
 * cell, not the product name in copy (DEC-0136).
 */
const PRODUCT_NAME_PATTERN = /\bPortalize\b/;

/**
 * The tier slot of `/dein-kalender` — the one place the name is introduced
 * (DEC-0052 §1, FUN-WEB-0132, DEC-0131 §3), at the 480 € tier where the price
 * is read.
 */
export const PRODUCT_NAME_FIELD = { routeId: "calendar", slot: "dein-kalender-4-tiers" } as const;

/**
 * `CG-038` — the name occurs in exactly one field, and that field is the
 * `/dein-kalender` tier slot (TS-WEB-0018-A7).
 *
 * Counted **per locale** (DEC-0136): `copy-contract.md` says "exactly one
 * content field across all locales", and the artifacts are one page in two
 * languages — `CG-041` requires the `en` sibling to mirror the `de` one, so
 * reading the sentence as one per tree would make the mirror the violation.
 * One field per locale is one occurrence per reader, which is what DEC-0052 §1
 * decides.
 */
export function checkProductName(pages: readonly PageContent[]): Finding[] {
  const findings: Finding[] = [];
  const carriers = new Map<Locale, Map<string, { file: string; slot: string; label: string }>>();

  for (const page of pages) {
    for (const copy of copyOf(page)) {
      if (!PRODUCT_NAME_PATTERN.test(copy.text)) continue;

      if (page.routeId !== PRODUCT_NAME_FIELD.routeId || copy.slot !== PRODUCT_NAME_FIELD.slot) {
        findings.push({
          level: "error",
          file: page.file,
          slot: copy.slot,
          check: "product-name",
          message: `\`${copy.label}\`: \`${PRODUCT_NAME}\` outside the \`${PRODUCT_NAME_FIELD.slot}\` slot of \`${ROUTES.calendar.path.de}\` — the name is introduced once, at the tier where the price is read, and is never a heading, a label or a route (CG-038, DEC-0052 §1, FUN-WEB-0132)`,
        });
        continue;
      }

      const perLocale = carriers.get(page.locale) ?? new Map();
      perLocale.set(`${page.file}|${copy.slot}|${copy.label}`, {
        file: page.file,
        slot: copy.slot,
        label: copy.label,
      });
      carriers.set(page.locale, perLocale);
    }
  }

  for (const [locale, fields] of carriers) {
    if (fields.size <= 1) continue;
    const named = [...fields.values()].map((field) => `\`${field.label}\``).join(", ");
    for (const field of fields.values()) {
      findings.push({
        level: "error",
        file: field.file,
        slot: field.slot,
        check: "product-name",
        message: `\`${PRODUCT_NAME}\` stands in ${fields.size} fields of the \`${locale}\` locale (${named}) — the name appears exactly once (CG-038, DEC-0052 §1)`,
      });
    }
  }

  return findings;
}

/** Validates one page artifact against TS-WEB-0007 D5/D6/D11 and TS-WEB-0017-A14. */
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
          : "the frontmatter does not validate against PageFrontmatterSchema (TS-WEB-0007 D5/D6)",
    });
    return findings;
  }

  const frontmatter = page.frontmatter!;

  if (frontmatter.page_id !== ROUTES[page.routeId].spec) {
    at({
      check: "spec-binding",
      message: `\`page_id: ${frontmatter.page_id}\` but the route table gives ${page.routeId} the spec ${ROUTES[page.routeId].spec} (TS-WEB-0017-A14)`,
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
      // `demo` says "mark this module `data-demo` in the markup" — never a
      // word on the page (Jan, 2026-09-18). Most generated slots are
      // demo data and must carry both, but a few are editorial choices that
      // are not demo data — the stage-0 reference place, the accessibility
      // statement awaiting counsel. Both are registered in state/open.md,
      // which is what the dummy-content rule actually requires.
      at(
        {
          check: "dummy-content",
          slot: slot.id,
          message:
            "generated but not marked `demo: true` — confirm it needs no `data-demo` marking and carries a state/open.md row (plan/guardrails.md)",
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
      // legitimately have none for the part that is missing (TS-WEB-0024 D10,
      // TS-WEB-0026 D5): reported, not failed.
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
            "empty `derived_from`: content that derives from nothing has no update path (TS-WEB-0007 D6)",
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

/**
 * TS-WEB-0007 D11 / A14, the editorial gate as a build check (F-2-40).
 *
 * `loader.ts` drops what the *running* build may not render; this asks the
 * production question from wherever `check:content` happens to run, so the
 * answer does not depend on the developer's shell. Severity follows the
 * target: producing a production build, an unapproved artefact is an error
 * ("a production build contains only `status: approved` content"); anywhere
 * else it is the standing list of what is not cleared yet — which is the
 * clearance decision recorded on `state/open.md`, not a defect a developer
 * can fix.
 *
 * The page is reported once; a slot is reported only when it is *more*
 * restricted than its page, so a wholly-draft artefact costs one line and
 * not thirty.
 */
export function checkLifecycle(
  page: PageContent,
  targetEnvironment: Environment,
): Finding[] {
  if (!page.ok) return [];

  const level: Finding["level"] =
    targetEnvironment === "production" ? "error" : "warning";
  const allowed = PRODUCTION_STATUSES.join(" / ");
  const findings: Finding[] = [];

  if (!rendersIn(page.status, "production"))
    findings.push({
      level,
      file: page.file,
      check: "lifecycle",
      message: `\`status: ${page.status}\` — a production build contains only ${allowed} content (TS-WEB-0007 D11, A14); this page renders in preview and reaches no production page`,
    });

  for (const slot of [...page.slots, ...page.gatedSlots.map((id) => ({ id, status: null }))]) {
    const status = "status" in slot && slot.status ? slot.status : null;
    if (!status || rendersIn(status, "production")) continue;
    if (status === page.status) continue;
    findings.push({
      level,
      file: page.file,
      slot: slot.id,
      check: "lifecycle",
      message: `\`status: ${status}\` — a production build contains only ${allowed} content (TS-WEB-0007 D11, A14)`,
    });
  }

  return findings;
}

export interface LocaleSetOptions {
  /**
   * How a missing locale sibling is reported. `error` is TS-WEB-0007 D8/D12 row 7;
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
        message: `no valid \`${locale}\` sibling for ${routeId} (TS-WEB-0007 D8.1)`,
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
  /**
   * Which build the tree is being validated for (TS-WEB-0007 D11). Defaults to
   * this process's own `VERCEL_ENV`. The *loading* always uses `preview`, so
   * the gate can report what production would drop instead of silently not
   * seeing it.
   */
  readonly targetEnvironment?: Environment;
}

/**
 * The whole tree: every route, every configured locale. Used by
 * `scripts/check-content.ts` and by the integration test.
 */
export async function checkContentTree(
  options: CheckTreeOptions = {},
): Promise<Finding[]> {
  const resolver = options.resolver ?? createHubResolver();
  const targetEnvironment = options.targetEnvironment ?? contentEnvironment();
  const findings: Finding[] = [];
  const everyPage: PageContent[] = [];

  for (const routeId of ROUTE_IDS) {
    const pages: Partial<Record<Locale, PageContent>> = {};
    for (const locale of LOCALES) {
      const page = await loadPage(routeId, locale, {
        ...(options.contentRoot ? { contentRoot: options.contentRoot } : {}),
        // Load everything, then judge it — see `checkLifecycle`.
        environment: "preview",
      });
      pages[locale] = page;
      everyPage.push(page);
      findings.push(...checkPage(page, resolver));
      findings.push(...checkLifecycle(page, targetEnvironment));
      findings.push(...checkCopy(page));
    }
    findings.push(...checkLocaleSet(routeId, pages, options));
  }

  // Row 11's count half asks a question of the whole tree, not of one page.
  findings.push(...checkProductName(everyPage));

  // Two routes share one artifact (TS-WEB-0026), so the same file is checked twice.
  const seen = new Set<string>();
  return findings.filter((finding) => {
    const key = `${finding.file}|${finding.slot ?? ""}|${finding.check}|${finding.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
