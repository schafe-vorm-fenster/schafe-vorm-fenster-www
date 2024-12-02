import { promises as fs } from "fs";
import matter from "gray-matter";
import PageTitle from "@/app/components/page-title";
import Section from "@/app/components/section";
import markdownit from "markdown-it";
import { Interweave } from "interweave";
import { polyfill } from "interweave-ssr";

polyfill();

export default async function HilfeArtikel({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const filename = "/app/hilfe/content/" + `${slug}.md`;
  const markdownWithMeta = await fs.readFile(process.cwd() + filename, "utf8");
  const { data: frontmatter, content } = matter(markdownWithMeta);
  const md = markdownit();
  const html = md.render(content);

  const ALLOW = [
    "p",
    "strong",
    "em",
    "a",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "img",
    "blockquote",
    "code",
    "pre",
    "hr",
    "br",
    "div",
    "span",
  ];

  return (
    <>
      <PageTitle text="Anleitungen" />
      <Section color="white">
        <h2 className="text-4xl mb-8">{frontmatter.title}</h2>
        <div className="flex flex-col space-y-4">
          <Interweave
            content={html}
            allowList={ALLOW}
            noWrap
            transformOnlyAllowList
          />
        </div>
      </Section>
    </>
  );
}
