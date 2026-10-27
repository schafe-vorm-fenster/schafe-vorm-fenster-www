import { Icon } from "../icon/icon";
import { MediaFrame } from "../media-frame/media-frame";
import { ConversionTracker, type ConversionBinding } from "../conversion-tracker/conversion-tracker";
import { OutboundLink } from "../outbound-link/outbound-link";

import type { Locale } from "@/src/lib/i18n/locales";
import type { ReactNode } from "react";

import styles from "./howto-block.module.css";

export interface HowtoPlatform {
  readonly steps: readonly string[];
  readonly screenshotSrc?: string;
  readonly screenshotAlt?: string;
  readonly screenshotNotDepicting?: boolean;
}

export interface HowtoBlockProps {
  readonly headline: string;
  readonly ios: HowtoPlatform;
  readonly android: HowtoPlatform;
  /**
   * `{APP_HOST}/{slug}` — the app handover, always an outbound link. Unused
   * where the page hands the block its control through `action`.
   */
  readonly appHref?: string;
  readonly appLinkLabel?: string;
  /**
   * The goal this block's app handover completes (TS-WEB-0012 D4). The block wraps
   * its **own** link, because arming the whole block from outside would fire
   * on any click in the instructions.
   */
  readonly conversion?: ConversionBinding;
  /**
   * The block's one control, where the block **is** the page's closing block
   * (`/dein-ort`, DEC-0170): the closing CTA's repeat of the calendar handover,
   * or in S0 the place search. It replaces the built-in app link, so the
   * block never carries two controls.
   */
  readonly action?: ReactNode;
  readonly id?: string;
  /**
   * The page's language — the screenshot frames badge themselves and read
   * it. Without it `/en/your-place` carried the German placeholder marking
   * (F-2-33).
   */
  readonly locale?: Locale;
  readonly className?: string;
}

/**
 * 38 `howto-block` [PROPOSED] — content type 18 `howto-block`, TS-WEB-0020 D4.
 *
 * Structure: one iOS and one Android instruction side by side, both always
 * rendered, plus the action to `{APP_HOST}/{slug}`. **No branching:** no
 * user-agent sniffing, no `navigator.standalone`, no `beforeinstallprompt` —
 * the component takes both platforms as props and renders both, always.
 * States: a missing screenshot becomes `placeholder-surface` and a
 * non-matching one carries `placeholder-badge`, both through `media-frame`'s
 * own contract. No mock screenshot is ever drawn by this component.
 * Inherits: `smartphone` icon; secondary CTA treatment (the page's primary
 * marker sits in block 1, never here); `ratio-portrait` for the screenshots.
 * Space: the DOM is byte-identical under every user agent, so the box never
 * varies with the visitor's device.
 * A11y: both instructions are readable in linear order — iOS then Android,
 * every time, for every visitor.
 * One pattern for both platforms (DEC-0170, issue #86): a mono label over an
 * open numbered list, side by side. No platform hides behind a `details`
 * disclosure — the collapsed Android of the polish pass rendered as a bare
 * native `summary` with the browser's focus box beside an open iPhone list.
 */
export function HowtoBlock({ headline, ios, android, appHref, appLinkLabel = "Kalender öffnen", action, conversion, id, locale, className }: HowtoBlockProps) {
  const platforms: Array<{ platformId: string; label: string; platform: HowtoPlatform }> = [
    { platformId: "ios", label: "iPhone", platform: ios },
    { platformId: "android", label: "Android", platform: android },
  ];

  return (
    <div className={[styles.block, className].filter(Boolean).join(" ")} id={id}>
      <h2 className={styles.headline}>
        <Icon className={styles.icon} name="smartphone" />
        {headline}
      </h2>
      <div className={styles.platforms}>
        {platforms.map(({ platformId, label, platform }) => {
          const body = (
            <>
              {platform.screenshotSrc !== undefined || platform.screenshotAlt !== undefined ? (
                <MediaFrame
                  alt={platform.screenshotAlt ?? ""}
                  locale={locale}
                  notDepicting={platform.screenshotNotDepicting}
                  ratio="portrait"
                  src={platform.screenshotSrc}
                />
              ) : null}
              <ol className={styles.steps}>
                {platform.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </>
          );

          return (
            <div className={styles.platform} data-platform={platformId} key={platformId}>
              <p className={styles.platformLabel}>{label}</p>
              {body}
            </div>
          );
        })}
      </div>
      {action !== undefined ? (
        <div data-howto-action="">{action}</div>
      ) : appHref === undefined ? null : conversion === undefined ? (
        <OutboundLink className={styles.cta} href={appHref} locale={locale} variant="secondary">
          {appLinkLabel}
        </OutboundLink>
      ) : (
        <ConversionTracker
          attributes={conversion.attributes}
          goalId={conversion.goalId}
          stage={conversion.stage}
        >
          <OutboundLink className={styles.cta} href={appHref} locale={locale} variant="secondary">
            {appLinkLabel}
          </OutboundLink>
        </ConversionTracker>
      )}
    </div>
  );
}
