import { Icon } from "../icon/icon";

import type { Locale } from "@/src/lib/i18n/locales";

import { dictionary } from "@/src/lib/i18n/dictionary";

import styles from "./ai-edited-mark.module.css";

export interface AiEditedMarkProps {
  readonly locale?: Locale;
}

/**
 * `ai-edited-mark` — SRC-0014 §Photo surface, DEC-0165.
 *
 * Structure: a 40 px round well in the photograph's top-right corner, filled
 * with the translucent `scrim-45`, carrying Lucide `sparkles` in `paper` at
 * 24 px. It marks the picture, so it is positioned against the photograph's
 * own box (`photo-surface`, `media-frame`), never inside the text stack.
 * States: none — it exists exactly when the image is `provenance: ai-edited`.
 * Contrast: `paper` over `scrim-45` over a pure-white pixel is
 * 3.2 : 1, and every darker pixel only raises it, so the glyph clears the
 * 3 : 1 non-text floor on any photograph; `e2e/ai-edited-mark.spec.ts`
 * measures it on the rendered pixels as well.
 * A11y: not a control and takes no focus. `role="img"` with the dictionary's
 * `aiEditedMark` as `aria-label` and `title`, so the note reaches a screen
 * reader and a pointer; the glyph inside stays `aria-hidden`.
 */
export function AiEditedMark({ locale = "de" }: AiEditedMarkProps) {
  const label = dictionary(locale).aiEditedMark;

  return (
    <span aria-label={label} className={styles.mark} data-ai-edited-mark="" role="img" title={label}>
      <Icon name="sparkles" />
    </span>
  );
}
