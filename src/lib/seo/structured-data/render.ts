/**
 * Emission mechanics — TS-011 D4: "one `<script type=\"application/ld+json\">`
 * graph per page, never injected by client JS." [FREE] per D4's own text.
 *
 * `@graph` combines every node a page emits into the one script tag D4
 * requires, whether that page has one node or several. Escaping follows
 * Next's own guidance (`node_modules/next/dist/docs/01-app/02-guides/json-ld.md`):
 * `JSON.stringify` does not sanitize `<`, so it is replaced with its
 * Unicode escape before the string reaches `dangerouslySetInnerHTML`.
 */

export interface JsonLdGraph {
  readonly "@context": "https://schema.org";
  readonly "@graph": readonly unknown[];
}

/** Drops `undefined` entries (an omitted node, e.g. no FAQ block) before wrapping. */
export function jsonLdGraph(nodes: readonly (unknown | undefined)[]): JsonLdGraph {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter((node): node is object => node !== undefined),
  };
}

export interface JsonLdScriptProps {
  readonly type: "application/ld+json";
  readonly dangerouslySetInnerHTML: { readonly __html: string };
}

export function jsonLdScriptProps(graph: JsonLdGraph): JsonLdScriptProps {
  return {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(graph).replace(/</g, "\\u003c") },
  };
}
