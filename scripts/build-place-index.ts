/**
 * Builds `src/generated/snapshots/communities.json` — the covered-community
 * index the place search's **name** lookup reads.
 *
 * Why a committed snapshot rather than a request-time call:
 *
 *  - geo-api has **no name search** (Q-025, state/open.md row 5). Its
 *    `community/search` takes ZIPs and administrative ids, nothing else. So
 *    a typed name has no upstream operation to reach, with or without a token.
 *  - The public village-calendar site solves the same problem the same way:
 *    it fetches every covered community at build time and filters the array
 *    in the browser (`community-site/pages/index.tsx`). Its start page *is*
 *    that index, and reading it needs no credential.
 *  - That index is ~2.2 MB of JSON for ~1760 communities. Fetching it per
 *    request would be absurd; fetching it per build and committing the
 *    result is what makes "type Schlat… and get Schlatkow" a real answer in
 *    an environment with no token at all.
 *
 * Refresh: `pnpm build:place-index`. The file is committed on purpose —
 * the same reason TS-009 D8 commits the tier-3 snapshots: a build that
 * cannot reach the source keeps the previous file.
 *
 * What is **not** in it: postcodes (the public index carries none — ZIP
 * search stays geo-api's, token-gated) and county ids (the index is the
 * three counties the calendar covers, but says so only as a whole).
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { fetchCommunityIndex } from "../src/clients/community-site/client";
import { communitySiteHost } from "../src/clients/hosts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TARGET = join(ROOT, "src", "generated", "snapshots", "communities.json");

/** One row of the index. Field names are the website's, not the source's. */
export interface CommunityIndexEntry {
  readonly name: string;
  readonly slug: string;
  readonly communityId: string;
  readonly lat: number;
  readonly lng: number;
  readonly municipality?: string;
}

export interface CommunityIndexFile {
  readonly builtAt: string;
  readonly source: string;
  readonly count: number;
  readonly communities: readonly CommunityIndexEntry[];
}

async function main(): Promise<void> {
  const host = communitySiteHost();
  // A 2.2 MB document over one call: this is a build step, not a request.
  const raw = await fetchCommunityIndex({ host, timeoutMs: 60_000 });

  const communities = raw
    .flatMap((community): CommunityIndexEntry[] => {
      const point = community.geoLocation?.point;
      const geonameId = community.geoLocation?.identifiers.geonamesId;
      if (point === undefined || geonameId === undefined) return [];
      const slug = community.slug.trim();
      if (slug === "") return [];
      return [
        {
          name: community.name,
          slug,
          communityId: `geoname.${geonameId}`,
          lat: Number(point.lat.toFixed(5)),
          lng: Number(point.lng.toFixed(5)),
          ...(community.municipality?.name ? { municipality: community.municipality.name } : {}),
        },
      ];
    })
    .sort((a, b) => a.name.localeCompare(b.name, "de"));

  if (communities.length < 500) {
    throw new Error(`index looks truncated: ${communities.length} communities`);
  }

  const file: CommunityIndexFile = {
    builtAt: new Date().toISOString(),
    source: `${host}/`,
    count: communities.length,
    communities,
  };

  mkdirSync(dirname(TARGET), { recursive: true });
  writeFileSync(TARGET, `${JSON.stringify(file, null, 0)}\n`, "utf8");
  console.log(`place index: ${communities.length} communities → ${TARGET}`);
}

main().catch((error: unknown) => {
  console.error("place index build failed:", error);
  process.exit(1);
});
