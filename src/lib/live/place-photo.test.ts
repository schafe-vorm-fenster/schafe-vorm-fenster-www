import { describe, expect, it } from "vitest";

import { usablePhoto } from "./place-photo";

const IMAGE = { src: "https://assets.example.test/api/image?wikimediaCommonsId=Testdorf.jpg", sourceUrl: "https://commons.wikimedia.org/wiki/File:Testdorf.jpg" };

describe("DEC-0167: no licence, no photograph", () => {
  it("keeps a photograph with a licence and an author", () => {
    const answer = usablePhoto("Testdorf.jpg", { licence: "CC BY-SA 4.0", author: "Erika Musterfrau", year: "2019" }, IMAGE);
    expect(answer).toMatchObject({ kind: "photo", photo: { licence: "CC BY-SA 4.0", author: "Erika Musterfrau", src: IMAGE.src } });
  });

  it("drops a photograph without a licence", () => {
    expect(usablePhoto("Testdorf.jpg", { author: "Erika Musterfrau" }, IMAGE)).toEqual({ kind: "none", reason: "no-licence" });
  });

  it("drops an attribution licence without an author to attribute", () => {
    expect(usablePhoto("Testdorf.jpg", { licence: "CC BY 2.0" }, IMAGE)).toEqual({ kind: "none", reason: "no-author" });
  });

  it.each(["CC0", "Public domain", "PD-old"])("keeps %s without an author — it asks for none", (licence) => {
    expect(usablePhoto("Testdorf.jpg", { licence }, IMAGE).kind).toBe("photo");
  });
});
