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
