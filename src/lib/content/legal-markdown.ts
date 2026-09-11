/**
 * A minimal markdown reader for `content/legal/*.md` (TS-029 D1–D6).
 *
 * `src/lib/content/blocks.ts` reads the page artifacts' labelled-value
 * convention (`**Label:** value`) — real prose documents (imprint, privacy
 * policy, terms, …) are a different shape: headings, paragraphs, lists,
 * inline bold and the occasional link. No dependency is added for it
 * (ADR-074's reasoning for `blocks.ts` applies unchanged: nothing in the
 * sibling repositories carries a markdown parser, and a parser would only
 * produce the HTML string TS-013's security baseline has no room for via
 * `dangerouslySetInnerHTML`). This is a reader for the conventions the five
 * imported legal documents and the generated accessibility statement
 * actually use — not a general markdown engine.
 *
 * Pure and framework-free on purpose: `legal-section.tsx` (or whatever
 * renders these nodes to JSX) is the only place that needs React.
 */

export type LegalInline =
  | { readonly kind: "text"; readonly value: string }
  | { readonly kind: "bold"; readonly value: string }
  | { readonly kind: "link"; readonly text: string; readonly href: string }
  | { readonly kind: "break" };

export type LegalBlock =
  | { readonly kind: "heading"; readonly level: number; readonly text: string }
  | { readonly kind: "paragraph"; readonly inline: readonly LegalInline[] }
  | {
      readonly kind: "list";
      readonly ordered: boolean;
      readonly items: readonly (readonly LegalInline[])[];
    };

const HEADING = /^(#{1,6})\s+(.+)$/;
const BULLET = /^[-*]\s+(.+)$/;
const ORDERED = /^\d+[.)]\s+(.+)$/;

/** `**bold**` and `[text](href)`, in one left-to-right pass — no nesting. */
const INLINE_TOKEN = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;

/** One line's inline content. A trailing double space is a hard line break. */
function parseInline(line: string): LegalInline[] {
  const hadTrailingBreak = /  $/.test(line);
  const text = line.trimEnd();
  const nodes: LegalInline[] = [];
  let lastIndex = 0;

  INLINE_TOKEN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = INLINE_TOKEN.exec(text))) {
    if (match.index > lastIndex) {
      nodes.push({ kind: "text", value: text.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
      nodes.push({ kind: "bold", value: match[1] });
    } else {
      nodes.push({ kind: "link", text: match[2], href: match[3] });
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) nodes.push({ kind: "text", value: text.slice(lastIndex) });
  if (hadTrailingBreak) nodes.push({ kind: "break" });

  return nodes;
}

/** Joins a paragraph's lines, keeping each line's own hard breaks. */
function paragraphInline(lines: readonly string[]): LegalInline[] {
  const nodes: LegalInline[] = [];
  lines.forEach((line, index) => {
    nodes.push(...parseInline(line));
    const last = nodes[nodes.length - 1];
    if (index < lines.length - 1 && last?.kind !== "break") {
      nodes.push({ kind: "text", value: " " });
    }
  });
  return nodes;
}

/**
 * Parses one legal document's body (frontmatter already removed) into
 * typed blocks. Never throws: an unrecognised line is prose.
 */
export function parseLegalMarkdown(markdown: string): LegalBlock[] {
  const blocks: LegalBlock[] = [];
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");

  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length > 0) blocks.push({ kind: "paragraph", inline: paragraphInline(paragraph) });
    paragraph = [];
  };
  const flushList = () => {
    if (list && list.items.length > 0) {
      blocks.push({
        kind: "list",
        ordered: list.ordered,
        items: list.items.map((item) => parseInline(item)),
      });
    }
    list = null;
  };

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    if (trimmed === "") {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = HEADING.exec(trimmed);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ kind: "heading", level: heading[1].length, text: heading[2].trim() });
      continue;
    }

    const bullet = BULLET.exec(trimmed);
    const ordered = ORDERED.exec(trimmed);
    if (bullet || ordered) {
      flushParagraph();
      const isOrdered = Boolean(ordered);
      if (list && list.ordered !== isOrdered) flushList();
      list = list ?? { ordered: isOrdered, items: [] };
      list.items.push((bullet ?? ordered)![1]);
      continue;
    }
    flushList();

    paragraph.push(rawLine);
  }

  flushParagraph();
  flushList();
  return blocks;
}

/**
 * Shifts every heading level by `shiftBy`, capped at `h6` — TS-029 D6: "the
 * imported document's structure, shifted down so nothing skips", including
 * its own top-level heading, which is demoted rather than rendered a second
 * time beside the registry's own `h2` (`legal-section`'s `title` prop).
 */
export function shiftHeadings(blocks: readonly LegalBlock[], shiftBy: number): LegalBlock[] {
  return blocks.map((block) =>
    block.kind === "heading"
      ? { ...block, level: Math.min(6, block.level + shiftBy) }
      : block,
  );
}
