import { describe, expect, it } from "vitest";

import { photoUrl } from "@/src/components/photo-surface/url";

import { attributionFromHeaders, commonsFileName, commonsFilePage, commonsImageUrl, parseCopyright } from "./client";

const HOST = { host: "https://assets.example.test" };

describe("DEC-0167: every Commons reference reduces to its file name", () => {
  it.each([
    ["https://commons.wikimedia.org/wiki/Special:FilePath/Testdorf%20Dorfkirche.jpg", "Testdorf Dorfkirche.jpg"],
    ["https://commons.wikimedia.org/wiki/File:Testdorf_Dorfkirche.jpg", "Testdorf Dorfkirche.jpg"],
    ["https://upload.wikimedia.org/wikipedia/commons/a/ab/Testdorf_Dorfkirche.jpg", "Testdorf Dorfkirche.jpg"],
    [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Testdorf_Dorfkirche.jpg/800px-Testdorf_Dorfkirche.jpg",
      "Testdorf Dorfkirche.jpg",
    ],
    ["https://assets.example.test/api/image?wikimediaCommonsId=Testdorf%20Dorfkirche.jpg", "Testdorf Dorfkirche.jpg"],
  ])("%s", (reference, expected) => {
    expect(commonsFileName(reference)).toBe(expected);
  });

  it("answers nothing for a reference that is not a Commons file", () => {
    expect(commonsFileName("https://example.test/foto.jpg")).toBeUndefined();
    expect(commonsFileName("kein url")).toBeUndefined();
    expect(commonsFileName(null)).toBeUndefined();
    expect(commonsFileName("https://commons.wikimedia.org/wiki/Main_Page")).toBeUndefined();
  });
});

describe("DEC-0167: the image URL survives the surface's CSS url() guard", () => {
  it("percent-encodes spaces, brackets and quotes, so photo-surface never refuses it", () => {
    const src = commonsImageUrl(HOST, "Testdorf (Luftbild) d'Ost.jpg");
    expect(src).toBe("https://assets.example.test/api/image?wikimediaCommonsId=Testdorf%20%28Luftbild%29%20d%27Ost.jpg");
    expect(() => photoUrl(src)).not.toThrow();
  });

  it("links the Commons file page with underscores", () => {
    expect(commonsFilePage("Testdorf Dorfkirche.jpg")).toBe(
      "https://commons.wikimedia.org/wiki/File:Testdorf_Dorfkirche.jpg",
    );
  });
});

describe("DEC-0167: assets-api's attribution headers", () => {
  it("reads licence, author, year and size", () => {
    expect(
      attributionFromHeaders({
        license: "CC BY-SA 4.0",
        copyright: "(C) 2019 Erika Musterfrau",
        "x-image-width": "1000",
        "x-image-height": "555",
      }),
    ).toEqual({ licence: "CC BY-SA 4.0", author: "Erika Musterfrau", year: "2019", width: 1000, height: 555 });
  });

  it("states nothing it was not told", () => {
    expect(attributionFromHeaders({})).toEqual({});
    expect(attributionFromHeaders({ license: "  ", copyright: "" })).toEqual({});
  });

  it.each([
    ["© 2021 Max Mustermann", { author: "Max Mustermann", year: "2021" }],
    ["Max Mustermann", { author: "Max Mustermann" }],
    ["(C) 2020", { year: "2020" }],
  ])("parses %s", (raw, expected) => {
    expect(parseCopyright(raw)).toEqual(expected);
  });
});
