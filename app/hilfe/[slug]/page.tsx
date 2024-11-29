import fs from "fs";
import path from "path";
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
  const markdownWithMeta = fs.readFileSync(
    path.join("app/hilfe/content", `${slug}.md`),
    "utf-8"
  );
  const { data: frontmatter, content } = matter(markdownWithMeta);
  const md = markdownit();
  const html = md.render(content);
  console.log(html);
  // render content by markdown-it

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
