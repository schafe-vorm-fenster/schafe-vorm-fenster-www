import { promises as fs } from "fs";
import matter from "gray-matter";
import PageTitle from "@/app/components/page-title";
import Section from "@/app/components/section";
import markdownit from "markdown-it";
import { Interweave } from "interweave";
import { polyfill } from "interweave-ssr";
import Script from "next/script";

polyfill();

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;
  const filename = "/app/hilfe/content/" + `${slug}.md`;
  const markdownWithMeta = await fs.readFile(process.cwd() + filename, "utf8");
  const { data: frontmatter } = matter(markdownWithMeta);

  return {
    title: {
      template: "%s - Schafe vorm Fenster",
      default: frontmatter.title,
    },
    description: frontmatter.title,
  };
}

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

  const ldJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: frontmatter.title,
        acceptedAnswer: {
          "@type": "Answer",
          text: html,
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="ldJsonFaq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ldJson, null, "\t"),
        }}
      />
      <PageTitle text="Anleitungen" />
      <Section color="white">
        <h2 className="text-4xl mb-8 max-w-2xl w-full mx-auto">
          {frontmatter.title}
        </h2>
        <div className="prose flex flex-col space-y-4 max-w-2xl w-full mx-auto">
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
