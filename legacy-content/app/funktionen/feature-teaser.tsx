import React from "react";
import Image from "next/image";
import ColumnArrangement from "../components/column-arrangement";
import Section from "../components/section";

export interface FeatureTeaser {
  slug: string;
  title: string;
  abstract: string;
  imageName?: string;
  link: string;
}

export interface FeatureTeaserProps {
  teaser: FeatureTeaser;
  color?: "black" | "white";
  alignment?: "left" | "right";
}

const FeatureTeaserComponent: React.FC<FeatureTeaserProps> = ({
  teaser,
  color = "white",
  alignment = "left",
}) => {
  return (
    <Section key={teaser.slug} color={color}>
      <ColumnArrangement adjustment="1:1" alignment={alignment}>
        <div className="space-y-4">
          <h2 className="text-3xl">{teaser.title}</h2>
          <p className="">{teaser.abstract}</p>
          {teaser.link && (
            <a
              href={teaser.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-black py-2 px-4 rounded"
            >
              zur Anleitung
            </a>
          )}
        </div>
        <div>
          {teaser.imageName && (
            <Image
              src={`/img/funktionen/${teaser.imageName}`}
              width={400}
              height={400}
              alt={teaser.title}
            />
          )}
        </div>
      </ColumnArrangement>
    </Section>
  );
};

export default FeatureTeaserComponent;
