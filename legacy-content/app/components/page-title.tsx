import React from "react";
import Section from "./section";
import Image from "next/image";

interface Headline {
  text: string;
}

const PageTitle: React.FC<Headline> = ({ text }) => {
  return (
    <Section color="white">
      <div className="flex justify-center mb-4">
        <Image
          src="/Schafe-vorm-Fenster-UG_Logo_green.svg"
          alt="Schafe vorm Fenster Logo"
          width={50}
          height={50}
        />
      </div>
      <span className="block text-center font-light text-xs uppercase mb-6 tracking-widest">
        Die digitale Terminliste für dein Dorf
      </span>
      <h1 className="text-5xl font-medium text-center">{text}</h1>
    </Section>
  );
};

export default PageTitle;
