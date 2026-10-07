import { describe, expect, it } from "vitest";

import { toLiveEventFromSite, toLiveEvent } from "./adapters";

const IMAGE = "https://assets.api.schafe-vorm-fenster.de/api/image?googleDriveId=abc";

describe("DEC-0152: text and image travel with the date", () => {
  it("keeps the public site's description and assets-api image URL", () => {
    const event = toLiveEventFromSite({
      _id: "1",
      summary: "Konzert im Schloss",
      start: "2026-10-12T17:00:00.000Z",
      categories: ["culture-tourism"],
      tags: ["Musik"],
      description: "Kammermusik im Rittersaal, Einlass ab 18 Uhr.",
      imageUrl: IMAGE,
      community: { _id: "geoname.2838887", name: "Schlatkow" },
    });
    expect(event).toMatchObject({ imageUrl: IMAGE, description: "Kammermusik im Rittersaal, Einlass ab 18 Uhr.", communityId: "geoname.2838887" });
  });

  it("keeps the token API's image only where `image.exists` does not deny it", () => {
    const base = { id: "2", summary: "Lesung", start: 1_791_000_000, categories: [], tags: [] };
    expect(toLiveEvent({ ...base, image: IMAGE, "image.exists": true })?.imageUrl).toBe(IMAGE);
    expect(toLiveEvent({ ...base, image: IMAGE, "image.exists": false })?.imageUrl).toBeUndefined();
    expect(toLiveEvent({ ...base, image: "" })?.imageUrl).toBeUndefined();
  });
});
