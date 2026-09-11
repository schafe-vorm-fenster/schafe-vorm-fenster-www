import { describe, expect, it } from "vitest";

import { faqPageNode } from "@/src/lib/seo/structured-data/faq";

describe("TS-011 D4: FAQPage, only where a visible Q&A block exists", () => {
  it("returns undefined for an empty list — no block, no node", () => {
    expect(faqPageNode([])).toBeUndefined();
  });

  it("maps each item to a Question/Answer pair", () => {
    const node = faqPageNode([{ question: "Was kostet das?", answer: "480 € pro Jahr." }]);
    expect(node?.["@type"]).toBe("FAQPage");
    expect(node?.mainEntity[0]).toEqual({
      "@type": "Question",
      name: "Was kostet das?",
      acceptedAnswer: { "@type": "Answer", text: "480 € pro Jahr." },
    });
  });
});
