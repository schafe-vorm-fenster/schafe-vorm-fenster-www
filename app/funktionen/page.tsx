import fs from "fs";
import path from "path";
import matter from "gray-matter";

import PageTitle from "../components/page-title";
import FeatureTeaserComponent, { FeatureTeaser } from "./feature-teaser";

export default function Funktionen() {
  const files = fs.readdirSync(path.join("app/funktionen/content"));

  const featureTeaserList: FeatureTeaser[] = files.map((filename) => {
    const markdownWithMeta = fs.readFileSync(
      path.join("app/funktionen/content", filename),
      "utf-8"
    );
    const frontmatter = matter(markdownWithMeta);
    const featureTeaser: FeatureTeaser = {
      slug: filename.replace(".md", ""),
      title: frontmatter.data.title,
      abstract: frontmatter.data.abstract,
      link: frontmatter.data.link,
      imageName: frontmatter.data.image,
    };

    return featureTeaser;
  });

  return (
    <>
      <PageTitle text="Alle Funktionen im Überblick" />
      {featureTeaserList.map((teaser, index) => (
        <FeatureTeaserComponent
          key={teaser.slug}
          teaser={teaser}
          color={index % 2 === 0 ? "white" : "black"}
          alignment={index % 2 === 0 ? "left" : "right"}
        />
      ))}
    </>
  );
}