import PageTitle from "../components/page-title";
import Section from "../components/section";
import { NewLeadForm } from "./form";

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
