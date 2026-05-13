import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { google } from "googleapis";
import dotenv from "dotenv";
import { docs_v1 } from "googleapis";

dotenv.config({ path: ".env.local" });

const SCOPES = [
  "https://www.googleapis.com/auth/documents.readonly",
  "https://www.googleapis.com/auth/drive.readonly",
];

const CLIENT_EMAIL = process.env.GOOGLEAPI_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLEAPI_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!CLIENT_EMAIL || !PRIVATE_KEY) {
  console.error(
    "Missing GOOGLEAPI_CLIENT_EMAIL or GOOGLEAPI_PRIVATE_KEY env vars"
  );
  process.exit(1);
}

const auth = new google.auth.JWT({
  email: CLIENT_EMAIL,
  key: PRIVATE_KEY,
  scopes: SCOPES,
});

console.log(`\n🔐 Authenticating as: ${CLIENT_EMAIL}`);
console.log("   (Make sure this email has access to the documents/files)\n");

const docs = google.docs({ version: "v1", auth });
const drive = google.drive({ version: "v3", auth });

interface ImportConfig {
  import: {
    documents?: { id: string; target: string }[];
    files?: { id: string; target: string }[];
  };
}

async function main() {
  const importYamlPath = path.join(process.cwd(), "content/import.yaml");
  if (!fs.existsSync(importYamlPath)) {
    console.error(`File not found: ${importYamlPath}`);
    process.exit(1);
  }

  const fileContents = fs.readFileSync(importYamlPath, "utf8");
  const config = yaml.load(fileContents) as ImportConfig;

  if (config.import.documents) {
    console.log("Processing documents...");
    for (const doc of config.import.documents) {
      await processDocument(doc.id, doc.target);
    }
  }

  if (config.import.files) {
    console.log("Processing files...");
    for (const file of config.import.files) {
      await processFile(file.id, file.target);
    }
  }
}

async function processDocument(id: string, targetPath: string) {
  try {
    console.log(`Fetching document ${id}...`);
    const res = await docs.documents.get({ documentId: id });
    const doc = res.data;
    const markdown = convertDocToMarkdown(doc);

    const outputPath = path.join(process.cwd(), targetPath);

    // Ensure directory exists
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    fs.writeFileSync(outputPath, markdown);
    console.log(`Saved document to ${targetPath}`);
  } catch (error) {
    console.error(`Error processing document ${id}:`, error);
  }
}

async function processFile(id: string, targetPath: string) {
  try {
    console.log(`Fetching file info ${id}...`);
    const fileMetadata = await drive.files.get({
      fileId: id,
      fields: "name, mimeType",
    });
    const originalName = fileMetadata.data.name || "downloaded-file";

    console.log(`Downloading ${originalName} to ${targetPath}...`);
    const res = await drive.files.get(
      { fileId: id, alt: "media" },
      { responseType: "stream" }
    );

    const outputPath = path.join(process.cwd(), targetPath);

    // Ensure directory exists
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    const dest = fs.createWriteStream(outputPath);

    await new Promise<void>((resolve, reject) => {
      res.data
        .on("end", () => {
          console.log(`Saved file to ${targetPath}`);
          resolve();
        })
        .on("error", (err) => {
          console.error("Error downloading file:", err);
          reject(err);
        })
        .pipe(dest);
    });
  } catch (error) {
    console.error(`Error processing file ${id}:`, error);
  }
}

function convertDocToMarkdown(doc: docs_v1.Schema$Document): string {
  let content = "";
  const body = doc.body?.content;
  if (!body) return "";

  for (const element of body) {
    if (element.paragraph) {
      content += processParagraph(element.paragraph);
    } else if (element.table) {
      // Basic table support could be added here
      content += "[Table omitted]\n\n";
    } else if (element.sectionBreak) {
      // Ignore section breaks
    }
  }
  return content.replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

function processParagraph(paragraph: docs_v1.Schema$Paragraph): string {
  let text = "";
  const styleType = paragraph.paragraphStyle?.namedStyleType;

  if (paragraph.elements) {
    for (const element of paragraph.elements) {
      if (element.textRun) {
        text += processTextRun(element.textRun);
      }
    }
  }

  // Handle lists
  if (paragraph.bullet) {
    const listId = paragraph.bullet.listId;
    const nestingLevel = paragraph.bullet.nestingLevel || 0;
    const prefix = "  ".repeat(nestingLevel) + "- ";
    return prefix + text + "\n";
  }

  // Handle headings
  switch (styleType) {
    case "TITLE":
      return "\n# " + text + "\n\n";
    case "SUBTITLE":
      return "\n## " + text + "\n\n";
    case "HEADING_1":
      return "\n# " + text + "\n\n";
    case "HEADING_2":
      return "\n## " + text + "\n\n";
    case "HEADING_3":
      return "\n### " + text + "\n\n";
    case "HEADING_4":
      return "\n#### " + text + "\n\n";
    case "HEADING_5":
      return "\n##### " + text + "\n\n";
    case "HEADING_6":
      return "\n###### " + text + "\n\n";
    default:
      return text + "\n\n";
  }
}

function processTextRun(textRun: docs_v1.Schema$TextRun): string {
  let content = textRun.content || "";
  if (!content) return "";

  // Remove trailing newlines from text runs as we handle them in paragraph
  content = content.replace(/\n$/, "");

  // Replace vertical tabs (soft line breaks) with markdown hard line breaks
  content = content.replace(/\u000b/g, "  \n");

  if (content === "") return "";

  const style = textRun.textStyle;
  if (style) {
    if (style.link?.url) {
      content = `[${content}](${style.link.url})`;
    }
    if (style.bold) {
      content = `**${content}**`;
    }
    if (style.italic) {
      content = `*${content}*`;
    }
    if (style.strikethrough) {
      content = `~~${content}~~`;
    }
    // Note: The Google Docs API v1 Schema$TextStyle does not have a direct 'code' property
    // in the type definition provided by googleapis, although it might be present in the API response.
    // We can check for a monospaced font family if we really need code detection,
    // but for now let's remove this property access to fix the build error.
    /*
    if (style.code) {
      content = `\`${content}\``;
    }
    */
  }
  return content;
}

main().catch(console.error);
