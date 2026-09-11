/**
 * `FAQPage` — TS-011 D4: emitted on any page with a visible Q&A block.
 * "No longer produces rich results for a site of this kind. It is emitted
 * anyway: it is valid, it makes the answer machine-readable, and answer
 * engines are an explicit channel (DEC-018)."
 *
 * One-entity rule: a page that emits this must not also mark the same
 * block up as microdata.
 */

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

export interface FAQPageNode {
  readonly "@type": "FAQPage";
  readonly mainEntity: ReadonlyArray<{
    readonly "@type": "Question";
    readonly name: string;
    readonly acceptedAnswer: { readonly "@type": "Answer"; readonly text: string };
  }>;
}

export function faqPageNode(items: readonly FaqItem[]): FAQPageNode | undefined {
  if (items.length === 0) return undefined;
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
