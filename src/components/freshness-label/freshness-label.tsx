import { Icon } from "../icon/icon";

import { dictionary } from "@/src/lib/i18n/dictionary";
import { OG_LOCALE } from "@/src/lib/i18n/locales";

import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./freshness-label.module.css";

/**
 * The three fallback tiers of TS-008 D5 / TS-009 D4:
 *   fresh     the data is current — no label at all;
 *   stale     a cached answer — "Stand: <time>";
 *   snapshot  a build-time snapshot — no label at all: Jan's decision of
 *             2026-09-18 removed the word "Beispiel"/"Example" from every
 *             rendered page. The tier still reaches the markup, as
 *             `data-demo`/`data-mock` on the module that carries it.
 */
export const FRESHNESS_TIERS = ["fresh", "stale", "snapshot"] as const;
export type FreshnessTier = (typeof FRESHNESS_TIERS)[number];

export interface FreshnessLabelProps {
  readonly tier: FreshnessTier;
  /** Required for `stale`: what the shown data is the state of. */
  readonly updatedAt?: string | Date;
  readonly locale?: Locale;
  /** Word override for `en`. */
  readonly staleLabel?: string;
  readonly className?: string;
}



/**
 * 61 `freshness-label` [PROPOSED] — TS-008 D5, TS-009 D4.
 *
 * Structure: tier 2 renders "Stand: <time>" beside the module's heading.
 * States: absent at tier 1 and at tier 3 — a build-time snapshot is a
 * finished answer to the visitor and is marked only in `data-*`. Never an error sentence, never a warning icon,
 * never a retry control — failures are logged server-side and the visitor
 * sees a dated answer instead of an apology.
 * Inherits: Meta 15 px in `muted`, `clock` at 18 px.
 * Space: it stands in the frame's header row, which reserves the line, so its
 * appearance does not shift the module.
 * A11y: plain text; the time is machine-readable through `<time datetime>`.
 */
export function FreshnessLabel({
  tier,
  updatedAt,
  locale = "de",
  staleLabel,
  className,
}: FreshnessLabelProps) {
  if (tier === "fresh" || tier === "snapshot") return null;

  // The word comes from the dictionary unless the caller names one, so `/en`
  // reads "As of" rather than the German default that `state/open.md` row
  // 101 recorded.
  const words = dictionary(locale).live;
  const stale = staleLabel ?? words.stale;

  const classes = [styles.label, className].filter(Boolean).join(" ");

  const value = typeof updatedAt === "string" ? new Date(updatedAt) : updatedAt;
  if (!value || Number.isNaN(value.getTime())) return null;

  const shown = new Intl.DateTimeFormat(OG_LOCALE[locale].replace("_", "-"), {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Berlin",
  }).format(value);

  return (
    <p className={classes}>
      <Icon name="clock" size={18} />
      {stale}: <time dateTime={value.toISOString()}>{shown}</time>
    </p>
  );
}
