/**
 * A place's own photograph — DEC-0167, issue #18, SRC-0014 §Photo surface
 * ("A place shows its own photograph").
 *
 * Where the photograph comes from, in the layer's usual order:
 *
 *  1. **geo-api** `community/{geonameId}` → `image` (token): Wikidata P18 as a
 *     Commons `Special:FilePath` URL — the authority;
 *  2. **the public village calendar** (no token): the same P18 image, already
 *     rewritten to an assets-api URL, on the community's own page;
 *  3. nothing — the mock backend has no photograph, so `LIVE_DATA=mock` and an
 *     offline build answer "none" and the page keeps its fallback.
 *
 * Whatever the source, the reference is reduced to a **Commons file name**
 * and its attribution is read from **assets-api** (the image's own `GET`). That
 * is the only place the ecosystem states a licence. The usability rule is
 * `usablePhoto()`: **no licence, no photograph** — and a licence that needs
 * attribution needs an author to attribute. A file that is not on Commons has
 * no stated licence at all and is dropped by the same rule.
 *
 * Three answers, because "has none" and "could not tell" must not be cached
 * alike: `photo`, `none` (a verdict — cacheable), `failed` (an upstream did
 * not answer — this view falls back, the next one asks again).
 */

import { commonsAttribution, commonsFileName, commonsFilePage, commonsImageUrl } from "@/src/clients/assets-api/client";
import { fetchCommunityPage } from "@/src/clients/community-site/client";
import { communityById } from "@/src/clients/geo-api/client";

import { assetsConfig, communitySiteConfig, geoConfig, hasRealBackend } from "./config";
import { communityRouteSlugFor } from "./place-index";
import { resolvePlace } from "./places";

import type { CommonsAttribution } from "@/src/clients/assets-api/client";
import type { Place, PlacePhoto } from "./types";

export type PlacePhotoAnswer =
  | { readonly kind: "photo"; readonly photo: PlacePhoto }
  | { readonly kind: "none"; readonly reason: "no-image" | "not-commons" | "no-licence" | "no-author" }
  | { readonly kind: "failed" };

/** Licences that ask for no attribution — the only ones a photograph may carry without a named author. */
const NO_ATTRIBUTION = /^(?:cc0|public domain|pd\b|pd-)/iu;

/**
 * DEC-0167's rule, as a pure function: a photograph is shown only with a
 * stated licence, and with a stated author unless the licence asks for none.
 */
export function usablePhoto(
  fileName: string,
  attribution: CommonsAttribution,
  image: { readonly src: string; readonly sourceUrl: string },
): PlacePhotoAnswer {
  const { licence, author, year, width, height } = attribution;
  if (licence === undefined || licence === "") return { kind: "none", reason: "no-licence" };
  if ((author === undefined || author === "") && !NO_ATTRIBUTION.test(licence)) {
    return { kind: "none", reason: "no-author" };
  }
  return {
    kind: "photo",
    photo: {
      src: image.src,
      fileName,
      sourceUrl: image.sourceUrl,
      licence,
      ...(author ? { author } : {}),
      ...(year ? { year } : {}),
      ...(width ? { width } : {}),
      ...(height ? { height } : {}),
    },
  };
}

function geonameIdOf(place: Place): number | undefined {
  const id = Number(place.communityId.replace(/^geoname\./u, ""));
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

/** The raw image reference from the first source that answers; `null` = it answered "none". */
async function imageReference(place: Place): Promise<string | null | "failed"> {
  let failed = false;

  const geonameId = geonameIdOf(place);
  if (geonameId !== undefined && hasRealBackend("communityPhoto")) {
    try {
      const community = await communityById(geoConfig(), geonameId);
      if (community !== undefined) return community.image ?? null;
    } catch {
      failed = true; // an unreachable geo-api is not a place without a photograph
    }
  }

  if (hasRealBackend("communityPhotoPublic")) {
    try {
      const { community } = await fetchCommunityPage(communitySiteConfig(), communityRouteSlugFor(place));
      return community.wikimediaCommonsImages?.[0] ?? null;
    } catch {
      failed = true;
    }
  }

  return failed ? "failed" : null;
}

/**
 * The photograph of the place a slug names. `undefined` when the slug is not
 * a covered place (the route answers 404, like position 1's own route).
 */
export async function placePhoto(slug: string): Promise<PlacePhotoAnswer | undefined> {
  const place = await resolvePlace(slug);
  if (place === undefined) return undefined;

  const reference = await imageReference(place);
  if (reference === "failed") return { kind: "failed" };
  if (reference === null || reference.trim() === "") return { kind: "none", reason: "no-image" };

  const fileName = commonsFileName(reference);
  if (fileName === undefined) return { kind: "none", reason: "not-commons" };

  const config = assetsConfig();
  let attribution: CommonsAttribution;
  try {
    attribution = await commonsAttribution(config, fileName);
  } catch {
    return { kind: "failed" };
  }

  return usablePhoto(fileName, attribution, {
    src: commonsImageUrl(config, fileName),
    sourceUrl: commonsFilePage(fileName),
  });
}
