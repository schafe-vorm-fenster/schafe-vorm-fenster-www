/**
 * Renders `legal-markdown.ts` blocks to JSX — TS-029 D2/D6.
 *
 * The one place that turns an imported legal document into elements: no
 * `dangerouslySetInnerHTML` anywhere (TS-013), headings already shifted by
 * the caller (`shiftHeadings`, D6 — the document's own top-level heading
 * demotes with everything else rather than duplicating `legal-section`'s
 * own `h2`), and every heading level 1-6 covered so a document can never
 * accidentally render an invalid tag.
 */

import type { LegalBlock, LegalInline } from "@/src/lib/content/legal-markdown";
import type { Fragment, ReactNode } from "react";

const HEADING_TAG = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

function renderInline(inline: readonly LegalInline[], keyPrefix: string): ReactNode[] {
  return inline.map((node, index) => {
    const key = `${keyPrefix}-${index}`;
    switch (node.kind) {
      case "text":
        return node.value ? <span key={key}>{node.value}</span> : null;
      case "bold":
        return <strong key={key}>{node.value}</strong>;
      case "link":
        return (
          <a href={node.href} key={key} rel="noopener" target="_blank">
            {node.text}
          </a>
        );
      case "break":
        return <br key={key} />;
      default:
        return null;
    }
  });
}

/** Renders one document's blocks, heading levels already shifted (D6). */
export function renderLegalBlocks(blocks: readonly LegalBlock[]): ReactNode {
  return (
    <>
      {blocks.map((block, index) => {
        const key = `block-${index}`;
        if (block.kind === "heading") {
          const Tag = HEADING_TAG[Math.min(5, Math.max(0, block.level - 1))];
          return <Tag key={key}>{block.text}</Tag>;
        }
        if (block.kind === "list") {
          const ListTag = block.ordered ? "ol" : "ul";
          return (
            <ListTag key={key}>
              {block.items.map((item, itemIndex) => (
                <li key={`${key}-${itemIndex}`}>{renderInline(item, `${key}-${itemIndex}`)}</li>
              ))}
            </ListTag>
          );
        }
        return <p key={key}>{renderInline(block.inline, key)}</p>;
      })}
    </>
  );
}

export type { Fragment };
