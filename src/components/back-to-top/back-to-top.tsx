"use client";

import { useEffect, useState } from "react";

import { Icon } from "../icon/icon";

import styles from "./back-to-top.module.css";

export interface BackToTopProps {
  /** Where it returns to — the `section-nav` of the legal page. */
  readonly targetId?: string;
  readonly label?: string;
  readonly className?: string;
}

/**
 * 18 `back-to-top` [PROPOSED] — TS-029 D4.
 *
 * Structure: one fixed control in the bottom-right corner below the xl
 * switch point, appearing once the visitor is past section one and returning
 * to `section-nav`. It is an `<a>` rather than a `<button>` because what it
 * does is navigate to a fragment — that keeps Cmd-click, middle-click and
 * the browser's own back behaviour intact.
 * States: hidden above xl (in CSS, so no JavaScript decides it) and hidden
 * before the reader has passed one viewport. No overlay, no floating menu.
 * Inherits: the secondary `button` treatment, radius 999, ≥ 44 px.
 * Space: a fixed overlay that never covers a primary CTA — it sits in the
 * corner with the safe-area inset added, and the page reserves nothing for it.
 * A11y: a real link with a text label, keyboard reachable, and the smooth
 * scroll is left to CSS so `prefers-reduced-motion` governs it.
 */
export function BackToTop({
  targetId = "abschnitte",
  label = "Nach oben",
  className,
}: BackToTopProps) {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      className={[styles.control, className].filter(Boolean).join(" ")}
      data-visible={past ? "true" : "false"}
      href={`#${targetId}`}
    >
      <Icon name="arrow-up" size={24} />
      {label}
    </a>
  );
}
