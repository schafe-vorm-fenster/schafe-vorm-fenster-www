import Link from "next/link";

import { linkHref, type LinkOptions } from "./href";

import type { RouteId } from "@/src/lib/routes/routes";
import type { AnchorHTMLAttributes, ReactNode } from "react";

import styles from "./route-link.module.css";

export interface RouteLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "lang">,
    LinkOptions {
  /** The route id from `src/lib/routes/routes.ts` — never a path. */
  readonly to: RouteId;
  /** Mark the link as the current page, non-colour-only (TS-002). */
  readonly current?: boolean;
  /** `false` drops the link treatment, for links wrapped in a control. */
  readonly styled?: boolean;
  /** The conversion marker the analytics registry reads (TS-006 D3). */
  readonly "data-cta"?: string;
  readonly children: ReactNode;
}

/**
 * 15 `route-link` [PROPOSED] — the link facade's component half (TS-001 D5,
 * TS-004 D3a).
 *
 * Structure: takes a route id plus params and emits the language-correct
 * path through `href()`. No component holds a literal internal `href`, and
 * the route table lives in `src/lib/routes/` — this component consumes it.
 * States: none — it renders no data.
 * Inherits: link treatment (`lime-800` on light), never CTA treatment unless
 * wrapped in `button`.
 * Space: inline.
 * A11y: the link text names its destination; `aria-current="page"` plus a
 * thicker underline marks the current page — never colour alone.
 */
export function RouteLink({
  to,
  locale,
  query,
  hash,
  current = false,
  styled = true,
  className,
  children,
  ...rest
}: RouteLinkProps) {
  const classes = [styled ? styles.link : styles.bare, className]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      aria-current={current ? "page" : undefined}
      className={classes}
      data-current={current ? "true" : undefined}
      href={linkHref(to, { locale, query, hash })}
      {...rest}
    >
      {children}
    </Link>
  );
}
