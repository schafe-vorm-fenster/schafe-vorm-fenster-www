import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { docs_v1, google } from "googleapis";
import dotenv from "dotenv";

const workspaceRoot = findWorkspaceRoot(process.cwd());

dotenv.config({ path: path.join(workspaceRoot, ".env.local") });

const SCOPES = [
  "https://www.googleapis.com/auth/documents.readonly",
  "https://www.googleapis.com/auth/drive.readonly",
];

interface CliOptions {
  configPath: string;
  dryRun: boolean;
}

interface ImportTarget {
  id: string;
  target: string;
  source?: string;
  status?: string;
}

interface GoogleClients {
  docs: ReturnType<typeof google.docs>;
  drive: ReturnType<typeof google.drive>;
}

interface ImportConfig {
  import: {
    documents?: ImportTarget[];
    files?: ImportTarget[];
  };
}

async function main() {
  const options = parseCliOptions(process.argv.slice(2));
  const importYamlPath = resolveWorkspacePath(options.configPath);

  if (!fs.existsSync(importYamlPath)) {
    console.error(`File not found: ${importYamlPath}`);
    process.exit(1);
  }

  console.log(
    `Using import config: ${path.relative(workspaceRoot, importYamlPath)}`,
  );
  if (options.dryRun) {
    console.log(
      "Dry run enabled; no Google Workspace content will be downloaded.",
    );
  }

  const fileContents = fs.readFileSync(importYamlPath, "utf8");
  const config = yaml.load(fileContents) as ImportConfig;
  const clients = options.dryRun ? null : createGoogleClients();

  if (config.import.documents) {
    console.log("Processing documents...");
    for (const doc of config.import.documents) {
      await processDocument(doc, clients, options);
    }
  }

  if (config.import.files) {
    console.log("Processing files...");
    for (const file of config.import.files) {
      await processFile(file, clients, options);
    }
  }
}

async function processDocument(
  target: ImportTarget,
  clients: GoogleClients | null,
  options: CliOptions,
) {
  const source = target.source || getGoogleDocUrl(target.id);

  try {
    if (options.dryRun) {
      logDryRunTarget("document", target.target, source);
      return;
    }

    if (!clients) {
      throw new Error("Google clients are required for document imports");
    }

    console.log(`Fetching document ${target.id}...`);
    const res = await clients.docs.documents.get({ documentId: target.id });
    const doc = res.data;
    const markdown = convertDocToMarkdown(doc);

    writeImportedMarkdown(target, markdown, source);
  } catch (error) {
    console.error(`Error processing document ${target.id}:`, error);
  }
}

async function processFile(
  target: ImportTarget,
  clients: GoogleClients | null,
  options: CliOptions,
) {
  try {
    if (options.dryRun) {
      logDryRunTarget("file", target.target, target.source || target.id);
      return;
    }

    if (!clients) {
      throw new Error("Google clients are required for file imports");
    }

    console.log(`Fetching file info ${target.id}...`);
    const fileMetadata = await clients.drive.files.get({
      fileId: target.id,
      fields: "name, mimeType",
    });
    const originalName = fileMetadata.data.name || "downloaded-file";

    console.log(`Downloading ${originalName} to ${target.target}...`);
    const res = await clients.drive.files.get(
      { fileId: target.id, alt: "media" },
      { responseType: "stream" },
    );

    const outputPath = resolveWorkspacePath(target.target);

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    const dest = fs.createWriteStream(outputPath);

    await new Promise<void>((resolve, reject) => {
      res.data
        .on("end", () => {
          console.log(`Saved file to ${target.target}`);
          resolve();
        })
        .on("error", (err: Error) => {
          console.error("Error downloading file:", err);
          reject(err);
        })
        .pipe(dest);
    });
  } catch (error) {
    console.error(`Error processing file ${target.id}:`, error);
  }
}

function createGoogleClients(): GoogleClients {
  const clientEmail = process.env.GOOGLEAPI_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLEAPI_PRIVATE_KEY?.replaceAll(
    String.raw`\n`,
    "\n",
  );

  if (!clientEmail || !privateKey) {
    console.error(
      "Missing GOOGLEAPI_CLIENT_EMAIL or GOOGLEAPI_PRIVATE_KEY env vars",
    );
    process.exit(1);
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: SCOPES,
  });

  console.log(`\nAuthenticating as: ${clientEmail}`);
  console.log(
    "Make sure this email has access to the Google Workspace files.\n",
  );

  return {
    docs: google.docs({ version: "v1", auth }),
    drive: google.drive({ version: "v3", auth }),
  };
}

function parseCliOptions(argv: string[]): CliOptions {
  const options: CliOptions = {
    configPath: "content/legal/import.yaml",
    dryRun: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--config") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("Missing value for --config");
      }
      options.configPath = value;
      index += 1;
      continue;
    }

    if (arg.startsWith("--config=")) {
      options.configPath = arg.slice("--config=".length);
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function findWorkspaceRoot(startDir: string): string {
  let currentDir = path.resolve(startDir);

  while (true) {
    if (fs.existsSync(path.join(currentDir, "AGENTS.md"))) {
      return currentDir;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      return startDir;
    }

    currentDir = parentDir;
  }
}

function resolveWorkspacePath(targetPath: string): string {
  return path.resolve(workspaceRoot, targetPath);
}

function getGoogleDocUrl(documentId: string): string {
  return `https://docs.google.com/document/d/${documentId}/edit`;
}

function logDryRunTarget(kind: string, targetPath: string, source: string) {
  const mode = fs.existsSync(resolveWorkspacePath(targetPath))
    ? "update"
    : "create";

  console.log(
    `[dry-run] Would ${mode} ${kind} target ${targetPath} from ${source}`,
  );
}

function writeImportedMarkdown(
  target: ImportTarget,
  markdown: string,
  source: string,
) {
  const outputPath = resolveWorkspacePath(target.target);
  const normalizedContent = `${markdown.trim()}\n`;

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  if (path.extname(outputPath) === ".md") {
    const existingContent = fs.existsSync(outputPath)
      ? fs.readFileSync(outputPath, "utf8")
      : "";
    const { data } = parseMarkdownFrontmatter(existingContent);
    const nextData = {
      ...data,
      status: target.status || "imported",
      sources: [source],
    };

    fs.writeFileSync(
      outputPath,
      serializeMarkdownDocument(nextData, normalizedContent),
    );
  } else {
    fs.writeFileSync(outputPath, normalizedContent);
  }

  console.log(`Saved document to ${target.target}`);
}

function parseMarkdownFrontmatter(markdown: string): {
  data: Record<string, unknown>;
} {
  const frontmatterMatch = /^---\n([\s\S]*?)\n---\n?/.exec(markdown);

  if (!frontmatterMatch) {
    return { data: {} };
  }

  const parsed = yaml.load(frontmatterMatch[1]);
  if (!parsed || typeof parsed !== "object") {
    return { data: {} };
  }

  return { data: parsed as Record<string, unknown> };
}

function serializeMarkdownDocument(
  data: Record<string, unknown>,
  markdown: string,
): string {
  const serializedFrontmatter = yaml
    .dump(data, { lineWidth: -1, noRefs: true })
    .trimEnd();

  return `---\n${serializedFrontmatter}\n---\n\n${markdown.trim()}\n`;
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
  content = content.replaceAll(String.fromCodePoint(11), "  \n");

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
  }
  return content;
}

main().catch(console.error);
