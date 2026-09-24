import type { ReactNode } from "react";

import styles from "./proof-stream.module.css";

export interface ProofStreamProps {
  /** Already-composed `proof-card` / `empty-proof-slot` elements, in the
   * relevance engine's order (TS-WEB-0005 D5–D8) — this container never reorders. */
  readonly children: ReactNode;
  /**
   * `grid` — the default card grid. `scroller` — a horizontal set.
   * `rows` — polish brief G-7: one column, the first child a feature card
   * and the rest hairline-separated compact rows, so a stream reads as a
   * track record rather than as one grey block of identical cards.
   */
  readonly layout?: "grid" | "scroller" | "rows";
  readonly label?: string;
  readonly className?: string;
}

/**
 * 31 `proof-stream` [PROPOSED] — TS-WEB-0005 D5–D8, DEC-0048.
 *
 * Structure: the container around a page's proof cards; the count per page
 * (19 → 5, 22/24/26 → 3, 27 → 7) and the order are the caller's, from the
 * relevance engine — grid or scroller is free here.
 * States: none of its own. An unfilled slot weakens the claim rather than
 * shortening the stream — the caller passes an `empty-proof-slot` in place
 * of a card rather than fewer children, so this container never counts.
 * Inherits: card height fixed per surface (each child's own contract); "no
 * two photo sections in a row" is unaffected because stream images are cards
 * inside one colour section, not sections of their own.
 * Space: the element count is a property of the surface the caller composed,
 * not of this component.
 * A11y: reading order equals DOM order, which equals the engine's order —
 * this container never reorders its children, including an empty slot.
 */
export function ProofStream({ children, layout = "grid", label = "Belege", className }: ProofStreamProps) {
  const layoutClass =
    layout === "scroller" ? styles.scroller : layout === "rows" ? styles.rows : styles.grid;
  return (
    <div
      aria-label={label}
      className={[styles.stream, layoutClass, className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
