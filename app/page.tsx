import { Metadata } from "next";
import Section from "./components/section";
import Facts from "./components/home/facts";
import Testimonials from "./components/home/testimonials";
import Image from "next/image";
import Intro from "./components/home/intro";
import CommunitiesCarousel from "./components/home/communities";
import Team from "./components/home/team";
import HowItWorks from "./components/home/how-it-works";
import Partners from "./components/home/partners";

export const metadata: Metadata = {
  title:
    "Im Dorf ist was los, nur du weißt noch nichts davon? - Schafe vorm Fenster",
  description:
    "Erfahre was wann wo in deinem Dorf los ist - einfach per Smartphone. Dafür entsteht hier eine Digitale Terminliste für die Dörfer in Vorpommern-Greifswald.",
  keywords: [
    "Schafe vorm Fenster",
    "digitale Terminliste",
    "Veranstaltungen",
    "Dorfleben",
    "Termine",
  ],
};

export default function Home() {
  return (
    <>
      <Section color="green">
        <Intro />
      </Section>
      <Section color="black">
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
        <h1 className="text-5xl font-medium text-center">
          aus Schlatkow für ganz Vorpommer-Greifswald <br />
          und darüber hinaus
        </h1>
      </Section>
      <Section color="white">
        <HowItWorks />
      </Section>
      <CommunitiesCarousel />
      <Section color="white">
        <Facts />
      </Section>
      <Section color="black">
        <Testimonials />
      </Section>
      <Section color="white">
        <Partners />
      </Section>
      <Section color="black">
        <Team />
      </Section>
    </>
  );
}
