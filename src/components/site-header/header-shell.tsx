"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { MenuToggle } from "./menu-toggle";
import { headerIsSolid, nextMenuState } from "./menu-state";

import type { MenuState } from "./menu-state";
import type { MouseEvent, ReactNode } from "react";

import styles from "./site-header.module.css";

/**
 * `xl` — 64rem, the switch point the burger lives below (TS-017 D2(b)).
 *
 * Jan's round-3 wording says `md`; measured, the four German job labels do not
 * fit an inline row until `xl` (the header's own container scrolls by 262 px
 * at 640 and 126 px at 768). The deviation is recorded in `state/open.md`
 * row 201. It must stay in step with `site-header.module.css`.
 */
const INLINE_NAV = "(min-width: 64rem)";

export interface HeaderShellProps {
  /**
   * This page opens on a hero photograph, so the header lies transparent on
   * it until the hero has scrolled past (Jan's round-3 decision, point 2).
   * A page without one is solid at every scroll position.
   */
  readonly overHero: boolean;
  readonly labels: {
    readonly open: string;
    readonly close: string;
    readonly menu: string;
  };
  /** The bar itself — logo, the inline job labels, the calendar pill. Server-rendered. */
  readonly children: ReactNode;
  /** The overlay's own top-bar brand: the mark, without the wordmark. */
  readonly overlayBrand: ReactNode;
  /** The overlay's content: the four jobs, the calendar entry, the language switch. */
  readonly menu: ReactNode;
  readonly className?: string;
}

const MENU_ID = "site-menu";

/**
 * The one client component of the chrome — TS-004 D4, Jan's round-3 points 2
 * and 3.
 *
 * It owns exactly two runtime facts and nothing else: whether the header has
 * scrolled off its hero photograph, and whether the phone disclosure is open.
 * Everything the header *shows* — the logo, the labels, the calendar pill,
 * the overlay's list — is rendered on the server and handed in as children,
 * so the JavaScript this adds to a page is the state machine and the two
 * observers, not the navigation.
 *
 * The overlay is a native `<dialog>` opened with `showModal()`, which is
 * where the accessibility comes from: the focus trap, the inert background,
 * `Escape`, and the focus restore to the burger are the browser's own
 * implementations rather than ours (`plan/guardrails.md`: nothing hand-rolled
 * that the platform already ships correctly). What is ours is in
 * `menu-state.ts`, tested there.
 *
 * No layout shift: over a hero the header is `position: fixed`, so it takes
 * no space in the flow at any scroll position and turning solid changes only
 * colours. The reserved height is published as `--site-header-height` either
 * way (TS-029 D3).
 */
export function HeaderShell({
  overHero,
  labels,
  children,
  overlayBrand,
  menu,
  className,
}: HeaderShellProps) {
  const headerRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [heroInView, setHeroInView] = useState(true);
  const [menuState, setMenuState] = useState<MenuState>("closed");

  const open = menuState === "open";
  // The server render has no scroll position, so it paints the designed
  // state (transparent over the hero) and the measure below corrects it.
  // Without JavaScript at all the CSS `scripting: none` branch keeps the
  // header solid and in the flow — see `site-header.module.css`.
  const solid = headerIsSolid(overHero, heroInView);

  /**
   * The hero's own bottom edge crossing the header's is the whole trigger.
   *
   * Measured on every scroll rather than watched with an `IntersectionObserver`
   * for one reason: on `/` the hero is rendered twice — once as the Suspense
   * fallback, once by the streamed branch that replaces it (TS-019 D2's place
   * states) — so the element an observer bound to at mount is detached a beat
   * later and stops reporting. Measured live, the query finds whichever hero is
   * currently in the document. The listener is passive and reads one
   * `getBoundingClientRect` per frame the browser already had to lay out.
   */
  useEffect(() => {
    if (!overHero) return;
    const measure = () => {
      const hero = document.querySelector('main [data-hero="true"]');
      const height = headerRef.current?.offsetHeight ?? 0;
      // No hero in the document at all → nothing to lie on, so the solid
      // ground is the safe answer rather than paper text over page content.
      setHeroInView(hero ? hero.getBoundingClientRect().bottom > height : false);
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [overHero]);

  /** The state machine drives the element; the element never drives itself. */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // Jan's round-3 point 3: first focus on the first item, not on the
      // close control `showModal()` would otherwise land on.
      dialog.querySelector<HTMLElement>("[data-menu-first]")?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  /** The background must not scroll under the overlay. */
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  /** Above the switch point the burger is gone, so the overlay must go too. */
  useEffect(() => {
    if (!open) return;
    const query = window.matchMedia(INLINE_NAV);
    const close = () => {
      if (query.matches) setMenuState((state) => nextMenuState(state, "widen"));
    };
    close();
    query.addEventListener("change", close);
    return () => query.removeEventListener("change", close);
  }, [open]);

  const toggle = useCallback(() => {
    setMenuState((state) => nextMenuState(state, "toggle"));
  }, []);

  /** `Escape` and the backdrop both arrive here, as the dialog's own `close`. */
  const onClose = useCallback(() => {
    setMenuState((state) => nextMenuState(state, "escape"));
  }, []);

  /** A followed link leaves the overlay standing over the next page otherwise. */
  const onMenuClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("a[href]")) {
      setMenuState((state) => nextMenuState(state, "navigate"));
    }
  }, []);

  return (
    <header
      className={[styles.header, className].filter(Boolean).join(" ")}
      data-over-hero={overHero ? "true" : undefined}
      data-solid={solid ? "true" : "false"}
      ref={headerRef}
    >
      <div className={`container ${styles.inner}`}>
        {children}
        <MenuToggle
          aria-controls={MENU_ID}
          aria-expanded={open}
          className={styles.burger}
          label={open ? labels.close : labels.open}
          onClick={toggle}
          variant="burger"
        />
      </div>

      <dialog
        aria-label={labels.menu}
        className={styles.dialog}
        id={MENU_ID}
        onClose={onClose}
        ref={dialogRef}
      >
        {/* The overlay repeats the bar it came from, so the control the
            visitor pressed stays where it was and only changes shape. */}
        <div className={`container ${styles.dialogBar}`}>
          {overlayBrand}
          <MenuToggle
            // Not `.burger`: that class is `display: none` from the switch
            // point up, and the overlay's own close control must never
            // inherit that — a modal whose close button is hidden is a trap.
            className={styles.dialogClose}
            label={labels.close}
            onClick={toggle}
            variant="close"
          />
        </div>
        {/* Not a control: this listens for clicks that have *already* been
            dispatched on the real links inside, so that following one closes
            the overlay. Every target is a keyboard-operable `<a>` in its own
            right, and a keyboard activation raises the same click event. */}
        <div className={styles.dialogBody} onClick={onMenuClick}>
          {menu}
        </div>
      </dialog>
    </header>
  );
}
