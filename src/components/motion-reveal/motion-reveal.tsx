"use client";

import { useEffect, useRef } from "react";

import type { ReactNode } from "react";

import styles from "./motion-reveal.module.css";

export interface MotionRevealProps {
  readonly className?: string;
  readonly children: ReactNode;
}

/**
 * 14 `motion-reveal` [PROPOSED] — SRC-014 §Motion.
 *
 * Structure: the wrapper that applies the site's single movement — rise
 * 22 px and fade over 550 ms, `cubic-bezier(.2,.7,.3,1)`, once, on enter.
 * States: disabled entirely under `prefers-reduced-motion: reduce`.
 * Inherits: it *is* the motion rule. Nothing else on this site moves, which
 * is also why skeletons do not animate.
 * Space: transform and opacity only — never height, so it cannot shift the
 * layout, and the compositor can do it without a repaint.
 * A11y: the content is present and readable **before** the animation runs.
 * The element is only armed (made transparent) once it is known to be off
 * screen; an element already in view is marked revealed without animating,
 * so nothing ever flashes and nothing is ever invisible without JavaScript.
 */
export function MotionReveal({ className, children }: MotionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // Already visible on first look: no animation, no flash.
            entry.target.setAttribute("data-revealed", "true");
            observer.disconnect();
          } else if (!entry.target.hasAttribute("data-armed")) {
            entry.target.setAttribute("data-armed", "true");
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={[styles.reveal, className].filter(Boolean).join(" ")} ref={ref}>
      {children}
    </div>
  );
}
