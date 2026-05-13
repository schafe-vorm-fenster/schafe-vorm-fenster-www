import fs from "fs";
import path from "path";
import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";

export interface LegalSection {
  id: string;
  title: string;
  content: string;
  subsections: { id: string; title: string }[];
}

const FILES = [
  "impressum.md",
  "datenschutzerklaerung.md",
  "nutzungsrichtlinien.md",
  "nutzungsbedingungen.md",
  "avv.md",
];

export async function getLegalContent(): Promise<LegalSection[]> {
  const contentDir = path.join(process.cwd(), "content");
  const sections: LegalSection[] = [];

  // Maintain a set of used IDs for the entire page generation to ensure uniqueness
  const usedIds = new Set<string>();

  const uniqueSlugify = (s: string) => {
    let slug = s
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    if (!slug) slug = "section";

    let uniqueSlug = slug;
    let counter = 1;
    while (usedIds.has(uniqueSlug)) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
    usedIds.add(uniqueSlug);
    return uniqueSlug;
  };

  const md = new MarkdownIt({
    html: true,
  });

  md.use(anchor, {
    permalink: anchor.permalink.headerLink(),
    slugify: uniqueSlugify,
  });

  for (const filename of FILES) {
    const filePath = path.join(contentDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Parse tokens to extract structure and ensure IDs are generated
    const tokens = md.parse(fileContent, {});

    let title = "";
    let sectionId = "";
    const subsections: { id: string; title: string }[] = [];

    // Find H1 for title and ID
    const h1TokenIdx = tokens.findIndex(
      (t) => t.type === "heading_open" && t.tag === "h1"
    );
    if (h1TokenIdx !== -1) {
      const inlineToken = tokens[h1TokenIdx + 1];
      title =
        inlineToken.children
          ?.filter((t) => t.type === "text" || t.type === "code_inline")
          .map((t) => t.content)
          .join("") || inlineToken.content;

      // The ID is already generated and attached to the token attrs by markdown-it-anchor
      const attrs = tokens[h1TokenIdx].attrs;
      const idAttr = attrs?.find((a) => a[0] === "id");
      if (idAttr) {
        sectionId = idAttr[1];
      } else {
        // Should not happen if plugin works, but fallback
        sectionId = uniqueSlugify(title);
      }
    } else {
      // Fallback if no H1
      title = filename.replace(".md", "");
      sectionId = uniqueSlugify(title);
    }

    // Find H2s for subsections
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === "heading_open" && tokens[i].tag === "h2") {
        const inlineToken = tokens[i + 1];
        const headingTitle =
          inlineToken.children
            ?.filter((t) => t.type === "text" || t.type === "code_inline")
            .map((t) => t.content)
            .join("") || inlineToken.content;

        const attrs = tokens[i].attrs;
        const idAttr = attrs?.find((a) => a[0] === "id");
        const slug = idAttr ? idAttr[1] : uniqueSlugify(headingTitle);

        subsections.push({ id: slug, title: headingTitle });
      }
    }

    // Render HTML using the SAME tokens to ensure consistency
    const htmlContent = md.renderer.render(tokens, md.options, {});

    sections.push({
      id: sectionId,
      title,
      content: htmlContent,
      subsections,
    });
  }

  return sections;
}
