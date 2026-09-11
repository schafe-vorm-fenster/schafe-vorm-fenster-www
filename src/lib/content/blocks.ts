/**
 * A slot body as typed blocks (TS-007 "[FREE] Markdown body conventions
 * below the frontmatter where no schema field governs the text").
 *
 * The pipeline does not hand pages an HTML string. Components take content
 * as typed props (`src/components/README.md`), the security baseline has no
 * room for `dangerouslySetInnerHTML` (TS-013), and the authored bodies are
 * not prose documents but labelled values:
 *
 *     **Headline:** Was ist bei dir los?
 *
 * Four shapes cover all 172 shipped slots — field, paragraph, list, table —
 * so this is a reader for the conventions the artifacts actually use, not a
 * markdown engine. No dependency is added for it (ADR-074): nothing in the
 * sibling repositories carries a markdown parser, and a parser would only
 * produce the HTML string we must not render.
 */

import type { ContentBlock } from "@/src/lib/content/types";

/**
 * `**Label:** value` — the labelled-value line. The colon is what makes it
 * one: a bold sentence opening a paragraph (`**Die Rechtstexte …**`) is
 * emphasis, not a field, and reading it as one would invent a label out of a
 * sentence.
 */
const FIELD = /^\*\*([^*]+?)\*\*(:?)\s*(.*)$/;
const BULLET = /^[-*]\s+(.+)$/;
const ORDERED = /^\d+[.)]\s+(.+)$/;
const TABLE_DIVIDER = /^\|[\s:|-]+\|$/;

/** The field labels that carry a call to action, in both locales. */
const CTA_LABEL = /^(cta|call to action|button|cta-label|cta label)/i;

/**
 * Inline markdown a component cannot use: the bold markers around an
 * emphasised phrase. Everything else — backticks, `{place}` slots, quotation
 * marks — stays exactly as authored.
 */
function plain(text: string): string {
  return text.replace(/\*\*/g, "").trim();
}

function cells(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map(plain);
}

/**
 * Parses the markdown below a slot's metadata comment.
 * Never throws: anything it cannot classify stays a paragraph.
 */
export function parseBlocks(body: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const lines = body.replace(/\r\n/g, "\n").split("\n");

  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let table: string[][] | null = null;

  const flushParagraph = () => {
    const text = plain(paragraph.join(" "));
    if (text) blocks.push({ kind: "paragraph", text });
    paragraph = [];
  };
  const flushList = () => {
    if (list && list.items.length > 0) {
      blocks.push({ kind: "list", ordered: list.ordered, items: list.items });
    }
    list = null;
  };
  const flushTable = () => {
    if (table && table.length > 0) {
      const [head, ...rows] = table;
      blocks.push({ kind: "table", head, rows });
    }
    table = null;
  };
  const flushAll = () => {
    flushParagraph();
    flushList();
    flushTable();
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line === "") {
      flushAll();
      continue;
    }

    if (line.startsWith("|")) {
      flushParagraph();
      flushList();
      if (TABLE_DIVIDER.test(line)) continue;
      table = table ?? [];
      table.push(cells(line));
      continue;
    }
    flushTable();

    const field = FIELD.exec(line);
    const label = field?.[1].trim() ?? "";
    if (field && (label.endsWith(":") || field[2] === ":")) {
      flushAll();
      blocks.push({
        kind: "field",
        label: label.replace(/:$/, "").trim(),
        value: plain(field[3]),
      });
      continue;
    }

    const bullet = BULLET.exec(line);
    const ordered = ORDERED.exec(line);
    if (bullet || ordered) {
      flushParagraph();
      const isOrdered = Boolean(ordered);
      if (list && list.ordered !== isOrdered) flushList();
      list = list ?? { ordered: isOrdered, items: [] };
      list.items.push(plain((bullet ?? ordered)![1]));
      continue;
    }
    flushList();

    paragraph.push(line);
  }

  flushAll();
  return blocks;
}

/** The `**Label:** value` blocks by label — the fast path for a component. */
export function fieldsOf(blocks: readonly ContentBlock[]): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const block of blocks) {
    if (block.kind === "field" && !(block.label in fields)) {
      fields[block.label] = block.value;
    }
  }
  return fields;
}

/**
 * The n-th `**Label:** value` of a slot, counted from zero.
 *
 * The reliable accessor across locales: the artifacts translate their field
 * labels (`Sucheingabe (Placeholder)` / `Search input (placeholder)`), so
 * `fields["…"]` only works where the label happens to be the same word in
 * both. Order is what harmonisation guarantees and `check:content` enforces
 * — a locale that ships a different block sequence fails the gate.
 */
export function fieldAt(
  blocks: readonly ContentBlock[],
  index: number,
): string | undefined {
  const fields = blocks.filter((block) => block.kind === "field");
  return fields[index]?.value;
}

/** The slot's CTA label, where one of its fields is a call to action. */
export function ctaOf(blocks: readonly ContentBlock[]): string | undefined {
  for (const block of blocks) {
    if (block.kind === "field" && CTA_LABEL.test(block.label) && block.value) {
      return block.value;
    }
  }
  return undefined;
}
