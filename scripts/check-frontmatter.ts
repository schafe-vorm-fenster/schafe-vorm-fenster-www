import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import * as yaml from "js-yaml";
import {
  NormalizedFrontmatterSchema,
  PressFrontmatterSchema,
  ProductFrontmatterSchema,
  SupportFrontmatterSchema,
} from "../src/domain/content-frontmatter.schema.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, "..", "content");

// Map content folders to the schema that should validate their files.
// Folders not listed here fall through to the NormalizedFrontmatterSchema.
const FOLDER_SCHEMA_MAP: Record<
  string,
  { schema: Zod.ZodType; label: string }
> = {
  press: { schema: PressFrontmatterSchema, label: "PressFrontmatter" },
  support: { schema: SupportFrontmatterSchema, label: "SupportFrontmatter" },
};

// Product files live inside products/ and use an extended schema.
const PRODUCT_FOLDER = "products";

interface Issue {
  file: string;
  errors: string[];
}

function collectMarkdownFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (entry === "README.md") continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...collectMarkdownFiles(full));
    } else if (entry.endsWith(".md")) {
      results.push(full);
    }
  }
  return results;
}

function extractFrontmatter(raw: string): unknown {
  const match = /^---\n([\s\S]*?)\n---/.exec(raw);
  if (!match) return null;
  return yaml.load(match[1]);
}

function folderName(filePath: string): string {
  const rel = relative(CONTENT_DIR, filePath);
  return rel.split("/")[0];
}

const files = collectMarkdownFiles(CONTENT_DIR);
const issues: Issue[] = [];
let checked = 0;

for (const file of files) {
  const raw = readFileSync(file, "utf-8");
  const fm = extractFrontmatter(raw);
  const rel = relative(CONTENT_DIR, file);

  if (fm === null) {
    issues.push({ file: rel, errors: ["No frontmatter found"] });
    checked++;
    continue;
  }

  const folder = folderName(file);
  const mapping = FOLDER_SCHEMA_MAP[folder];

  let result: {
    success: boolean;
    error?: { issues: { message: string; path: (string | number)[] }[] };
  };

  if (mapping) {
    result = mapping.schema.safeParse(fm) as typeof result;
  } else if (folder === PRODUCT_FOLDER) {
    // Try product schema first (superset), fall back to normalized
    const productResult = ProductFrontmatterSchema.safeParse(
      fm,
    ) as typeof result;
    result = productResult.success
      ? productResult
      : (NormalizedFrontmatterSchema.safeParse(fm) as typeof result);
  } else {
    result = NormalizedFrontmatterSchema.safeParse(fm) as typeof result;
  }

  if (!result.success && result.error) {
    issues.push({
      file: rel,
      errors: result.error.issues.map(
        (i) => `${i.path.join(".")}: ${i.message}`,
      ),
    });
  }

  checked++;
}

// Report
console.log(`\nChecked ${checked} content files.\n`);

if (issues.length === 0) {
  console.log("All frontmatter is valid.");
  process.exit(0);
} else {
  console.error(`Found ${issues.length} file(s) with invalid frontmatter:\n`);
  for (const issue of issues) {
    console.error(`  ${issue.file}`);
    for (const err of issue.errors) {
      console.error(`    - ${err}`);
    }
  }
  console.error("");
  process.exit(1);
}
