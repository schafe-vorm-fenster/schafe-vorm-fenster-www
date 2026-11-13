/**
 * A photograph reaches `photo-surface` as a URL and is placed in a CSS
 * `background-image`, which is the only way the design system's "gradient in
 * the same declaration" rule can be met. A URL that carries a quote, a
 * bracket or a newline could close that declaration and open another, so the
 * value is checked before it is interpolated — not escaped, refused.
 */
const FORBIDDEN = /["'()\\\s]/;

export function photoUrl(src: string): string {
  if (!src || FORBIDDEN.test(src)) {
    throw new Error(
      `photo-surface: unusable image URL (quotes, brackets, backslashes and whitespace are not allowed): ${src}`,
    );
  }
  return `url("${src}")`;
}

/**
 * The motif's focal point as a `background-position` value — `x% y%`, from
 * the inventory's `focal: {x, y}` (DEC-0105 §2). The same rule as the URL:
 * the value is interpolated into a style attribute, so a number that is not
 * a finite percentage is refused, not clamped.
 */
export function focalPosition(focal: { readonly x: number; readonly y: number }): string {
  for (const value of [focal.x, focal.y]) {
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      throw new Error(`photo-surface: a focal point is a percentage pair, 0–100 each: ${JSON.stringify(focal)}`);
    }
  }
  return `${focal.x}% ${focal.y}%`;
}
