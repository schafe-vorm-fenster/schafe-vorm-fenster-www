import { Metadata } from "next";
import PageTitle from "../components/page-title";
import Section from "../components/section";
import { NewLeadForm } from "./form";

export const metadata: Metadata = {
  title: "Kalender anmelden und Termine veröffentlichen - Schafe vorm Fenster",
  description:
    "Veröffentliche deine Termine direkt aus deinem Kalender heraus in alle relevanten Dörfern. Lege jetzt los und melde deinen ersten Kalender an.",
  keywords: [
    "Schafe vorm Fenster",
    "digitale Terminliste",
    "Veranstaltungen",
    "Dorfleben",
    "Termine",
  ],
};

export default function Start() {
  return (
    <>
      <PageTitle text="Jetzt loslegen. So geht's." />
      <Section color="black">
        <NewLeadForm />
      </Section>
    </>
  );
}
