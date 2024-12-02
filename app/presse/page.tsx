import fs from "fs";
import path from "path";
import matter from "gray-matter";
import PressTeaserComponent, { PressTeaser } from "./press-teaser";
import PageTitle from "../components/page-title";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Medienberichte und Presse - Schafe vorm Fenster",
  description:
    "Hier findest du alle Medienberichte und Pressemitteilungen zu Schafe vorm Fenster. Erfahre mehr über die digitale Terminliste für die Dörfer in Vorpommern-Greifswald.",
  keywords: [
    "Schafe vorm Fenster",
    "digitale Terminliste",
    "Veranstaltungen",
    "Dorfleben",
    "Termine",
  ],
};

export default function Presse() {
  const files = fs.readdirSync(path.join("app/presse/content"));

  const pressTeaserList: PressTeaser[] = files.map((filename) => {
    const markdownWithMeta = fs.readFileSync(
      path.join("app/presse/content", filename),
      "utf-8"
    );
    const frontmatter = matter(markdownWithMeta);
    const pressTeaser: PressTeaser = {
      slug: filename.replace(".md", ""),
      title: frontmatter.data.title,
      abstract: frontmatter.data.abstract,
      date: new Date(frontmatter.data.date),
      link: frontmatter.data.link,
      author: frontmatter.data.author,
      categories: frontmatter.data.categories,
      imageName: frontmatter.data.image,
    };

    return pressTeaser;
  });

  pressTeaserList.sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <>
      <Script
        id="_etValues"
        type="text/javascript"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var et_pagename: 'Presse';
            var et_areas: 'About';
          `,
        }}
      />
      <PageTitle text="Medienberichte im Überblick" />
      {pressTeaserList.map((teaser, index) => (
        <PressTeaserComponent
          key={teaser.slug}
          teaser={teaser}
          color={index % 2 === 0 ? "white" : "black"}
        />
      ))}
    </>
  );
}
