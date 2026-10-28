import Image from "next/image";

import { Badge } from "../badge/badge";
import { isMocked, isPending, type DataStateProps } from "../data-state";
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

/**
 * A voice's logo for the byline — the partner's own mark, from
 * `@schafe-vorm-fenster/partners` (DEC-0183). Never recoloured or cropped:
 * the box takes the mark's own ratio.
 */
export interface ProofCardLogo {
  readonly src: string;
  readonly width: number;
  readonly height: number;
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
  /**
   * The `Beleg` / `Reference` badge. **Omitted where the card already names
   * its source** — polish brief G-7: a badge reading `BELEG` beside a context
   * line reading `Beleg: …` is the same word twice, and six cards carrying it
   * read as one grey block rather than as breadth.
   */
  readonly geo?: GeoBadgeFragment;
  /**
   * How much of the stream's emphasis this card carries (G-7, DEC-0172 §1).
   * Either value switches the card to the stream form: a flat item on the
   * section ground — no fill, a hairline above — with the claim first and a
   * byline (initials well · name · role) under it. `feature` is the one item
   * that opens a stream, its claim at sub-head size; `compact` carries the
   * claim at card size. One emphasis per stream, not seven.
   */
  readonly emphasis?: "feature" | "compact";
  /** Present only where the content type expects an image at all. */
  readonly image?: ProofCardImage;
  /** The voice's logo; it takes the initials well's place in the stream forms. */
  readonly logo?: ProofCardLogo;
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
 * `Mock aktiv` row in `state/open.md` for the press-entry mock (Q-0045). The
 * `image` slot, where present at all, carries its own D-9 states through
 * `media-frame` — an image without cleared usage right becomes the "Foto
 * gesucht" placeholder there, never a text-only card missing the badge.
 * Emphasis: a stream opens with one `feature` card and continues in
 * `compact` rows (G-7) — the default `card` shape is what a stream of one
 * uses.
 * Inherits: `ratio-proof` 5:2; radius 0; the card sits *inside* a colour
 * section, so it never counts as a photo section for the rhythm rule.
 * Space: a fixed card height per stream (the caller's `proof-stream` sets
 * it); the ratio is declared before the image loads.
 * A11y: the quote's attribution is text, not baked into an image.
 */
/**
 * The byline's monogram: the first letter of the first and of the last word
 * that starts with a capital, skipping academic titles ("Dr. A. Zschiesche" →
 * "AZ", "Stiftung Lebendiges Lehre" → "SL"). Decoration only — the name is
 * text beside it, and the well is hidden from assistive technology.
 */
export function initialsOf(name: string): string {
  const words = name
    .split(/[\s·]+/)
    .filter((word) => /^\p{Lu}/u.test(word) && !/^(Dr|Prof)\.?$/.test(word));
  if (words.length === 0) return name.trim().charAt(0).toUpperCase();
  const first = words[0]?.charAt(0) ?? "";
  const last = words.length > 1 ? (words.at(-1)?.charAt(0) ?? "") : "";
  return `${first}${last}`.toUpperCase();
}

export function ProofCard({
  contextLine,
  claim,
  attribution,
  geo,
  emphasis,
  image,
  logo,
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
    <article
      className={[
        styles.card,
        emphasis === "feature" ? styles.feature : undefined,
        emphasis === "compact" ? styles.compact : undefined,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-demo={isMocked(state) ? "true" : undefined}
      data-emphasis={emphasis}
    >
      {image ? (
        <MediaFrame
          alt={image.alt}
          className={styles.image}
          // F-2-33: the card's own badge read `locale`, the frame's did not,
          // so an English proof slot without a cleared asset hatched
          // "Foto gesucht".
          locale={locale}
          notDepicting={image.notDepicting}
          placeholderId={image.placeholderId}
          ratio="proof"
          src={image.src}
        />
      ) : null}
      <div className={styles.body}>
        {emphasis ? (
          /*
           * The stream forms (DEC-0172 §1, SRC-0014 §Proof stream): the words
           * first, then who said or did it — the order of a quote card, so a
           * claim and a quote read alike on every page. The byline is a 40 px
           * initials well (decoration, the icon well's size and fill, never a
           * control) beside the name in mono and the role under it. Where the
           * voice has a logo, the logo takes the well's place at the well's
           * height and its own width (DEC-0183) — decoration as well, because
           * the name stands beside it as text.
           */
          <>
            <p className={styles.claim}>{claim}</p>
            <div className={styles.byline}>
              {logo ? (
                <span aria-hidden="true" className={styles.logo} data-logo>
                  <Image alt="" height={logo.height} src={logo.src} width={logo.width} />
                </span>
              ) : (
                <span aria-hidden="true" className={styles.initials} data-initials>
                  {initialsOf(contextLine)}
                </span>
              )}
              <p className={styles.who}>
                <span className={styles.name}>{contextLine}</span>
                {attribution ? <span className={styles.role}>{attribution}</span> : null}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className={styles.meta}>
              <p className={styles.context}>{contextLine}</p>
              {geo ? <Badge tone="neutral">{geo.label}</Badge> : null}
            </div>
            <p className={styles.claim}>{claim}</p>
            <p className={styles.attribution}>{attribution}</p>
          </>
        )}
        {link ? (
          <div className={styles.link}>
            {link.to ? (
              <RouteLink locale={locale} to={link.to}>
                {link.label}
              </RouteLink>
            ) : link.href ? (
              <OutboundLink href={link.href} locale={locale}>
                {link.label}
              </OutboundLink>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
