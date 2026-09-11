import { describe, expect, it } from "vitest";

import { jsonLdGraph, jsonLdScriptProps } from "@/src/lib/seo/structured-data/render";

describe("TS-011 D4: one JSON-LD graph, escaped, per page", () => {
  it("wraps nodes in one @graph under @context, dropping undefined entries", () => {
    const graph = jsonLdGraph([{ "@type": "WebPage" }, undefined, { "@type": "WebSite" }]);
    expect(graph["@context"]).toBe("https://schema.org");
    expect(graph["@graph"]).toEqual([{ "@type": "WebPage" }, { "@type": "WebSite" }]);
  });

  it("escapes < so the payload cannot break out of the script tag", () => {
    const props = jsonLdScriptProps(jsonLdGraph([{ name: "</script><script>alert(1)</script>" }]));
    expect(props.dangerouslySetInnerHTML.__html).not.toContain("</script>");
    // Next's own guidance (json-ld.md) escapes only `<`, not `>` — that is
    // already enough to make the string un-parseable as a closing tag.
    expect(props.dangerouslySetInnerHTML.__html).toContain("\\u003c/script>");
  });

  it("sets the application/ld+json type", () => {
    const props = jsonLdScriptProps(jsonLdGraph([]));
    expect(props.type).toBe("application/ld+json");
  });
});
