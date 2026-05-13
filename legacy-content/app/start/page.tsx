import { Metadata } from "next";
import PageTitle from "../components/page-title";
import Section from "../components/section";

export const metadata: Metadata = {
  title: "Kalender anmelden und Termine veröffentlichen",
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
      <Section color="green">
        <div className="w-full flex justify-center items-center">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSdO5AlaOpDWGwukrIge-qPvXAeiEVMgEwAViC-CmvkWLAjL3g/viewform?embedded=true"
            width="640"
            height="1900"
            className="max-w-full"
          ></iframe>
        </div>
      </Section>
    </>
  );
}
