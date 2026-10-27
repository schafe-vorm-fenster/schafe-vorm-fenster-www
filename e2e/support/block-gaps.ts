/**
 * The block-gap measurement — DEC-0171, TS-WEB-0017-A31.
 *
 * **What a block is.** A *content box* is, in `"stacks"` scope (the guard), a
 * section's content stack — the element `section-shell` marks `data-stack`.
 * In `"sections"` scope (the audit, which also sees sections no shell
 * renders) it is every `.container` directly inside a `section` or `aside`,
 * or the section itself where it has none. A *block* is a direct child element of that box that the
 * browser draws: not `display: none`, not absolutely or fixed positioned, and
 * taller than one pixel (a visually-hidden label is not a block). A
 * `display: contents` wrapper is looked through, so a fragment wrapper does
 * not hide its children.
 *
 * **What a gap is.** For two blocks that follow each other in the document and
 * overlap horizontally, the distance from the lower edge of the first to the
 * upper edge of the second. Blocks that stand side by side — the head 1–4 and
 * list 5–12 of a desktop section, a comparison 6 + 6 — have no vertical gap
 * and are not paired.
 *
 * The function is handed to `page.evaluate`, so it is self-contained: no
 * import, no closure over anything outside it.
 */
export interface BlockGap {
  /** The section's `data-block`, id or accessible name, or its tag. */
  readonly section: string;
  readonly from: string;
  readonly to: string;
  /** In CSS px, rounded to a tenth. */
  readonly gap: number;
  /** The first of the two is a section kicker (`data-kicker`), which binds to what it names. */
  readonly afterKicker: boolean;
  /** The second block's computed `margin-top` — what the stack set, unless the block overrode it. */
  readonly marginTop: number;
  /** The first block's computed `margin-bottom` — 0 unless the block brings its own. */
  readonly marginBottom: number;
}

/** A stack's first and last block: neither may push against the section's padding. */
export interface StackEdge {
  readonly section: string;
  readonly first: string;
  readonly firstMarginTop: number;
  readonly last: string;
  readonly lastMarginBottom: number;
}

export type BlockGapScope = "stacks" | "sections";

export function readBlockGaps(scope: BlockGapScope = "stacks"): {
  gaps: BlockGap[];
  edges: StackEdge[];
} {
  const describe = (element: Element): string => {
    const html = element as HTMLElement;
    const attrs = [
      html.dataset?.block ? `[data-block=${html.dataset.block}]` : "",
      element.id ? `#${element.id}` : "",
    ].join("");
    const cls = [...element.classList]
      .slice(0, 2)
      .map((name) => `.${name.replace(/^(.+?)-module__(.+?)__.*$/, "$1/$2")}`)
      .join("");
    const text = (element.textContent ?? "")
      .trim()
      .replace(/\s+/g, " ")
      .slice(0, 32);
    return `${element.tagName.toLowerCase()}${attrs}${cls}${text ? ` "${text}"` : ""}`;
  };

  const sectionName = (section: Element): string => {
    const html = section as HTMLElement;
    return (
      html.dataset?.block ||
      section.id ||
      section.getAttribute("aria-label")?.slice(0, 32) ||
      (section.getAttribute("aria-labelledby")
        ? document
            .getElementById(section.getAttribute("aria-labelledby")!)
            ?.textContent?.slice(0, 32)
        : null) ||
      section.tagName.toLowerCase()
    );
  };

  const blocksOf = (box: Element): Element[] => {
    const out: Element[] = [];
    for (const child of box.children) {
      const style = getComputedStyle(child);
      if (style.display === "contents") {
        out.push(...blocksOf(child));
        continue;
      }
      if (style.display === "none" || style.visibility === "hidden") continue;
      if (style.position === "absolute" || style.position === "fixed") continue;
      const rect = child.getBoundingClientRect();
      if (rect.height <= 1 || rect.width <= 1) continue;
      out.push(child);
    }
    return out;
  };

  const main = document.querySelector("#main") ?? document.body;
  const gaps: BlockGap[] = [];
  const edges: StackEdge[] = [];
  const pairs: { section: Element; box: Element }[] = [];
  if (scope === "stacks") {
    for (const box of main.querySelectorAll("[data-stack]"))
      pairs.push({ section: box.closest("section, aside") ?? box, box });
  } else {
    for (const section of main.querySelectorAll("section, aside")) {
      const containers = [...section.children].filter((child) =>
        child.classList.contains("container"),
      );
      for (const box of containers.length > 0 ? containers : [section])
        pairs.push({ section, box });
    }
  }

  for (const { section, box } of pairs) {
    const blocks = blocksOf(box);
    if (blocks.length > 0) {
      const first = blocks[0];
      const last = blocks[blocks.length - 1];
      edges.push({
        section: sectionName(section),
        first: describe(first),
        firstMarginTop: parseFloat(getComputedStyle(first).marginTop),
        last: describe(last),
        lastMarginBottom: parseFloat(getComputedStyle(last).marginBottom),
      });
    }
    for (let index = 1; index < blocks.length; index += 1) {
      const previous = blocks[index - 1].getBoundingClientRect();
      const next = blocks[index].getBoundingClientRect();
      const overlapX =
        Math.min(previous.right, next.right) -
        Math.max(previous.left, next.left);
      if (overlapX <= 1) continue;
      gaps.push({
        section: sectionName(section),
        from: describe(blocks[index - 1]),
        to: describe(blocks[index]),
        gap: Math.round((next.top - previous.bottom) * 10) / 10,
        afterKicker: blocks[index - 1].hasAttribute("data-kicker"),
        marginTop: parseFloat(getComputedStyle(blocks[index]).marginTop),
        marginBottom: parseFloat(
          getComputedStyle(blocks[index - 1]).marginBottom,
        ),
      });
    }
  }
  return { gaps, edges };
}
