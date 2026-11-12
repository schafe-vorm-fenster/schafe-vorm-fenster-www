import type { ElementType, ReactNode } from "react";

import styles from "./section-shell.module.css";

/** The grounds a section may stand on — SRC-0014 §Colour, §Page Rhythm. */
export const SECTION_SURFACES = [
  "paper",
  "surface",
  "surface-2",
  "lime-100",
  "lime-500",
  "ink",
  "violet-500",
  /** The "old world" ground of SRC-0014 §Archive block — problem content only. */
  "archive",
] as const;

export type SectionSurface = (typeof SECTION_SURFACES)[number];

export interface SectionShellProps {
  readonly surface?: SectionSurface;
  /**
   * Optional (DEC-0206, TS-WEB-0006 D12). Set it only where it says what the
   * section's heading does not — a question, a problem framing, a role — and
   * never with a word stem the heading or the intro repeats. Drawn from the
   * site's own vocabulary (`dictionary.ts` → `kickers`). Mono, uppercase, no
   * fill: a label, not a second badge. Kicker, heading and intro are the
   * three text levels a section may stand before its content.
   */
  readonly kicker?: string;
  /** `true` marks the kicker `data-demo="true"`: a stand-in word nobody wrote (DEC-0068, DEC-0120 §5). */
  readonly kickerDemo?: boolean;
  /**
   * A line between the kicker and the section's own heading, from polish
   * brief G-3. Under DEC-0206 a transition is **no text level of its own**:
   * it becomes the section's intro (below the heading) or goes, so a section
   * that sets one stands over the three-level cap `e2e/section-heads.spec.ts`
   * reports (TS-WEB-0006-A21). The prop stays until the page PRs of issue
   * issue 163 have moved its last callers.
   */
  readonly transition?: string;
  /** 26–30 px standard, 20–24 px tight. One value per section. */
  readonly density?: "standard" | "tight";
  readonly id?: string;
  /** The stable `data-block` id a page's own composition sheet names (e.g. TS-WEB-0024 D2). */
  readonly dataBlock?: string;
  /** The id of the heading that names this section, for `aria-labelledby`. */
  readonly labelledBy?: string;
  /** An accessible name where the section carries no heading of its own. */
  readonly label?: string;
  /**
   * `false` lets the child run edge to edge (a photo surface, a full band).
   * The shell's **own** two lines — the kicker and the transition — keep the
   * container either way: "16 px inside the viewport, on every section"
   * (SRC-0014 §Shape and Space) is about text, and a caller that gives up the
   * container does it for its instance, not for the section's label
   * (DEC-0129 §12).
   */
  readonly contained?: boolean;
  readonly as?: ElementType;
  readonly className?: string;
  readonly children: ReactNode;
}

const SURFACE_CLASS: Record<SectionSurface, string> = {
  paper: styles.paper,
  surface: styles.surface,
  "surface-2": styles.surface2,
  "lime-100": styles.lime100,
  "lime-500": styles.lime500,
  ink: styles.ink,
  "violet-500": styles.violet500,
  archive: styles.archive,
};

/**
 * 13 `section-shell` [PROPOSED] — SRC-0014 §Shape and Space, §Page Rhythm.
 *
 * Structure: the one wrapper every block stands in. It takes a surface, a
 * density and, where one earns its place, a `kicker` (optional since
 * DEC-0206; at most three text levels before the content) and a `transition`
 * line (G-3, retiring under DEC-0206). Sections butt
 * directly against each other; spacing never doubles, because only the shell
 * has padding, and the shell also flattens the trailing margin of its last
 * child so a paragraph's own `margin-bottom` cannot add a second padding to
 * the section's.
 * States: none of its own.
 * Inherits: radius 0, no border, no shadow; 16 px horizontal padding;
 * 26–30 px vertical standard, 20–24 px tight — **one value per section,
 * never a padded card inside a padded section**.
 * Space: the vertical rhythm is this component's whole job — padding-block
 * at its edges, and between its blocks the content stack's `--block-gap`
 * (DEC-0171). A block inside it carries no outer margin of its own.
 * A11y: renders a `section` with an accessible name wherever it carries a
 * heading; contrast pairs come from the colour tables only.
 *
 * The rhythm rules the design system states — no two photo sections adjacent,
 * at most two consecutive sections of one colour family, exactly one
 * `himbeere` element per screen, the dark `ink` section once per page as the
 * live-data anchor (plus, at most, one closing search block as the page's last
 * section), the `archive` ground for problem content only — are composition
 * rules. They are checked where the page
 * is composed (`src/components/section-shell/rhythm.ts`), not by a single
 * section that cannot see its neighbours.
 */
export function SectionShell({
  surface = "paper",
  kicker,
  kickerDemo,
  transition,
  density = "standard",
  id,
  dataBlock,
  labelledBy,
  label,
  contained = true,
  as: Element = "section",
  className,
  children,
}: SectionShellProps) {
  const classes = [
    styles.section,
    SURFACE_CLASS[surface],
    density === "tight" ? styles.tight : styles.standard,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // The section's own two lines. They are text, so they keep the 16 px gutter
  // even where the caller gives up the container for its instance: an
  // uncontained section used to put them flush against the viewport edge,
  // which SRC-0014 §Shape and Space forbids (DEC-0129 §12).
  const lede =
    kicker || transition ? (
      <>
        {kicker ? (
          <p className={styles.kicker} data-demo={kickerDemo ? "true" : undefined} data-kicker="">
            {kicker}
          </p>
        ) : null}
        {transition ? <p className={styles.transition}>{transition}</p> : null}
      </>
    ) : null;

  return (
    <Element
      aria-label={label}
      aria-labelledby={labelledBy}
      className={classes}
      data-block={dataBlock}
      data-surface={surface}
      id={id}
    >
      {/* The content stack (DEC-0171): the one owner of the space between
          the section's blocks. `data-stack` is what TS-WEB-0017-A31 walks. */}
      {contained ? (
        <div className="container" data-stack="">
          {lede}
          {children}
        </div>
      ) : (
        <>
          {lede ? (
            <div className={`container ${styles.lede}`} data-stack="">
              {lede}
            </div>
          ) : null}
          {children}
        </>
      )}
    </Element>
  );
}
