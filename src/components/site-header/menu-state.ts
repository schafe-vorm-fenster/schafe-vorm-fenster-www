/**
 * The phone header's disclosure state, as a pure function.
 *
 * The overlay itself is a native `<dialog>` — the focus trap, the inert
 * background, `Escape` and the focus restore are the browser's, not ours
 * (`header-shell.tsx`). What is *not* the browser's is when the disclosure
 * opens and closes, and that is the part worth testing on its own: the
 * reducer below is the whole of it, and `menu-state.test.ts` is written
 * against it before the component exists.
 *
 * Two of the five events are the ones a hand-rolled menu usually forgets:
 *
 *  - `navigate` — following a link inside the overlay leaves the overlay
 *    standing over the new page unless something closes it. On an App Router
 *    client navigation the dialog element survives the transition, so this
 *    is not theoretical.
 *  - `widen` — the viewport crossing the `md` switch point removes the burger
 *    from the layout. An overlay left open there traps focus inside a control
 *    the visitor can no longer see a way out of.
 */

/** Two states. There is no third — no "closing", no animation state. */
export type MenuState = "closed" | "open";

export type MenuEvent =
  /** The burger, or the overlay's own close control. */
  | "toggle"
  /** `Escape`, or the dialog's `cancel` event. */
  | "escape"
  /** A link inside the overlay was followed. */
  | "navigate"
  /** The viewport reached the `md` switch point, where the burger disappears. */
  | "widen";

/** The disclosure's whole logic. Total, pure, and exhaustive over both types. */
export function nextMenuState(state: MenuState, event: MenuEvent): MenuState {
  switch (event) {
    case "toggle":
      return state === "open" ? "closed" : "open";
    case "escape":
    case "navigate":
    case "widen":
      return "closed";
  }
}

export const isMenuOpen = (state: MenuState): boolean => state === "open";

/**
 * Whether the header paints its own paper ground.
 *
 * `overHero` is the page-level fact (this page opens on a hero photograph, so
 * the header lies transparent on it); `heroInView` is the runtime one. A page
 * without a hero photograph is solid at every scroll position, which is why
 * the first branch ignores the second argument entirely.
 */
export function headerIsSolid(overHero: boolean, heroInView: boolean): boolean {
  return !overHero || !heroInView;
}
