import { dictionary } from "@/src/lib/i18n/dictionary";

import { OutboundLink } from "../outbound-link/outbound-link";

import type { RenderableImage } from "@/src/lib/content/images";
import type { Locale } from "@/src/lib/i18n/locales";
import type { ReactNode } from "react";

/**
 * The credit of one inventory photograph, in the one form every photograph
 * shows it behind the © control (owner, 2026-10-29, DEC-0187):
 * `Foto: <title, linked to the source> – <author, licence, source>`, or
 * `Foto: <credit>` where the work has no title. `undefined` where the image
 * carries no credit (a generated stand-in, an empty slot): no control then.
 */
export function imageCredit(image: RenderableImage | undefined, locale: Locale): ReactNode | undefined {
  if (!image?.credit || image.notDepicting) return undefined;
  const lead = dictionary(locale).photoCredit.lead;
  if (!image.creditTitle) return <p>{`${lead}: ${image.credit}`}</p>;
  return (
    <p>
      {lead}:{" "}
      {image.creditUrl ? (
        <OutboundLink href={image.creditUrl} locale={locale} variant="inline">
          {image.creditTitle}
        </OutboundLink>
      ) : (
        image.creditTitle
      )}{" "}
      – {image.credit}
    </p>
  );
}
