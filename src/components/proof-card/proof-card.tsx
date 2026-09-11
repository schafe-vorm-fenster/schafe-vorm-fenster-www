import { Badge } from "../badge/badge";
import { isMocked, isPending, type DataStateProps } from "../data-state";
import { DemoDataBadge } from "../demo-data-badge/demo-data-badge";
import { MediaFrame } from "../media-frame/media-frame";
import { OutboundLink } from "../outbound-link/outbound-link";
import { RouteLink } from "../route-link/route-link";
import { Skeleton } from "../skeleton/skeleton";

import type { GeoBadgeFragment } from "../content-fragments";
import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";

import styles from "./proof-card.module.css";

export interface ProofCardImage {
  readonly src?: string;
  readonly alt: string;
  readonly notDepicting?: boolean;
  readonly placeholderId?: string;
}

export interface ProofCardLink {
  readonly label: string;
  readonly to?: RouteId;
  readonly href?: string;
}

export interface ProofCardProps extends DataStateProps {
  readonly contextLine: string;
  readonly claim: string;
  readonly attribution: string;
  readonly geo: GeoBadgeFragment;
  /** Present only where the content type expects an image at all. */
  readonly image?: ProofCardImage;
  readonly link?: ProofCardLink;
  readonly locale?: Locale;
  readonly className?: string;
}

/**
 * 30 `proof-card` [PROPOSED] — content type 10 `proof-card`.
 *
 * Structure: a context line, the claim, its attribution, a geo badge, an
 * optional image in `media-frame` at `ratio-proof`, and a link.
 * States (D-9, all four): `loading` → `skeleton` at `ratio-proof`; `empty` →
 * nothing — an uncleared proof element does not exist on the page, which is
 * a hard content filter rather than a runtime gap; `degraded` → the card
 * renders what it has, unchanged; `mocked` → `demo-data-badge`, plus a
 * `Mock aktiv` row in `state/open.md` for the press-entry mock (Q-045). The
 * `image` slot, where present at all, carries its own D-9 states through
 * `media-frame` — an image without cleared usage right becomes the "Foto
 * gesucht" placeholder there, never a text-only card missing the badge.
 * Inherits: `ratio-proof` 5:2; radius 0; the card sits *inside* a colour
 * section, so it never counts as a photo section for the rhythm rule.
 * Space: a fixed card height per stream (the caller's `proof-stream` sets
 * it); the ratio is declared before the image loads.
 * A11y: the quote's attribution is text, not baked into an image.
 */
export function ProofCard({
  contextLine,
  claim,
  attribution,
  geo,
  image,
  link,
  state = "ready",
  locale,
  className,
}: ProofCardProps) {
  if (isPending(state)) {
    return <Skeleton className={className} ratio="proof" variant="box" />;
  }
  if (state === "empty") return null;

  return (
    <article className={[styles.card, className].filter(Boolean).join(" ")} data-demo={isMocked(state) ? "true" : undefined}>
      {image ? (
        <MediaFrame
          alt={image.alt}
          className={styles.image}
          notDepicting={image.notDepicting}
          placeholderId={image.placeholderId}
          ratio="proof"
          src={image.src}
        />
      ) : null}
      <div className={styles.body}>
        <div className={styles.meta}>
          <p className={styles.context}>{contextLine}</p>
          <Badge tone="neutral">{geo.label}</Badge>
          {isMocked(state) ? <DemoDataBadge /> : null}
        </div>
        <p className={styles.claim}>{claim}</p>
        <p className={styles.attribution}>{attribution}</p>
        {link ? (
          <div className={styles.link}>
            {link.to ? (
              <RouteLink locale={locale} to={link.to}>
                {link.label}
              </RouteLink>
            ) : link.href ? (
              <OutboundLink href={link.href} newTab>
                {link.label}
              </OutboundLink>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
