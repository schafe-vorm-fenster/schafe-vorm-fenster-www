import fs from "fs";
import path from "path";

import Link from "next/link";
import PageTitle from "../components/page-title";
import matter from "gray-matter";
import Section from "../components/section";

interface HelpArticleLink {
  title: string;
  category: string;
  slug: string;
}

interface HelpArticleGroup {
  title: string;
  articles: HelpArticleLink[];
}
export default function Hilfe() {
  // read all markdown files from /hilfe/content
  // read only *.md files

  const files = fs.readdirSync(path.join("app/hilfe/content"));
  const onlyMarkdownFiles = files.filter((file) => file.endsWith(".md"));

  const helpArticleList: HelpArticleLink[] = onlyMarkdownFiles.map(
    (filename) => {
      const markdownWithMeta = fs.readFileSync(
        path.join("app/hilfe/content", filename),
        "utf-8"
      );
      const frontmatter = matter(markdownWithMeta);
      const helpArticleLink: HelpArticleLink = {
        slug: filename.replace(".md", ""),
        title: frontmatter.data.title,
        category: frontmatter.data.category,
      };

      return helpArticleLink;
    }
  );

  const helpArticleGroups: HelpArticleGroup[] = helpArticleList.reduce(
    (groups, article) => {
      const group = groups.find((group) => group.title === article.category);

      if (group) {
        group.articles.push(article);
      } else {
        groups.push({
          title: article.category,
          articles: [article],
        });
      }

      return groups;
    },
    [] as HelpArticleGroup[]
  );

  // sort groups as follows: 1: Erste Schritte, 2: Termine optimal anlegen, 3: Nutzen und verbreiten, 4: Daten und offene Daten, 5: Tarife und Preise, 6: Sonstiges
  helpArticleGroups.sort((a, b) => {
    const order = [
      "Erste Schritte",
      "Termine optimal anlegen",
      "Nutzen und verbreiten",
      "Daten und offene Daten",
      "Tarife und Preise",
      "Sonstiges",
    ];

    return order.indexOf(a.title) - order.indexOf(b.title);
  });

  return (
    <>
      <PageTitle text="Hier findest du Antworten auf deine Fragen." />

      <Section color="white">
        {helpArticleGroups.map((group, index) => (
          <div key={index} className="mb-12">
            <h2 className="text-4xl font-medium text-center mb-6">
              {group.title}
            </h2>
            <ul className="space-y-4 text-center">
              {group.articles.map((article, index) => (
                <li key={index} className="text-lg">
                  <Link
                    href={"/hilfe/" + article.slug}
                    className=" hover:underline"
                  >
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Section>
    </>
  );
}
