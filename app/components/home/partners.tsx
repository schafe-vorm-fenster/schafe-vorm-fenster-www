import Image from "next/image";
import SectionTitle from "../section-title";

export default function Partners() {
  return (
    <>
      <SectionTitle
        title="Stark mit unseren Partnern"
        abstract="Was im Dorf los ist, liegt nicht nur an den Einwohnerinnen und Einwohnern. Zusammen mit unseren Partnern sammeln wir relevante Termindaten und stellen sie in den Dorfkalendern bereit."
      />
      <Image
        src="/img/partners/partners.png"
        alt="Unsere Partner"
        className="mx-auto"
        width={800}
        height={400}
      />
    </>
  );
}
