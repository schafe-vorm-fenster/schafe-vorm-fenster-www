import React from "react";
import Image from "next/image";
import ColumnArrangement from "../components/column-arrangement";
import Section from "../components/section";

export interface PressTeaser {
  slug: string;
  title: string;
  abstract: string;
  author?: string;
  date: Date;
  categories?: string[];
  imageName?: string;
  link: string;
}

export interface PressTeaserProps {
  teaser: PressTeaser;
  color?: "black" | "white";
}

const PressTeaserComponent: React.FC<PressTeaserProps> = ({
  teaser,

  color = "white",
}) => {
  // format to: MM.YYYY
  const dateStr: string = teaser.date.toLocaleDateString("de-DE", {
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Section key={teaser.slug} color={color}>
      <ColumnArrangement adjustment="1:1" alignment="left">
        <div className="space-y-4">
          <p className="text-sm">
            {dateStr}, {teaser.categories && teaser.categories.join(", ")}
          </p>
          <h2 className="text-3xl">{teaser.title}</h2>
          <p className="">{teaser.abstract}</p>
          {teaser.author && <p className="text-sm">von {teaser.author}</p>}
          {teaser.link && (
            <a
              href={teaser.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-black py-2 px-4 rounded"
            >
              mehr
            </a>
          )}
        </div>
        <div>
          {teaser.imageName && (
            <Image
              src={`/img/presse/${teaser.imageName}`}
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

export default PressTeaserComponent;
