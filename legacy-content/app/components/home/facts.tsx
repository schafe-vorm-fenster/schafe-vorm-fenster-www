import SectionTitle from "../section-title";

const features = [
  {
    name: "800+ ",
    description:
      "Orte in Macklenburg-Vorpommern, Niedersachsen und Brandenburg",
  },
  {
    name: "45.000+",
    description: "aktuelle Termine von Akteuren und Partnern",
  },
  {
    name: "5.000+",
    description: "100% automatische Updates täglich",
  },
  {
    name: "1.800+",
    description: "Zugriffe jeden Monat von Nutzern",
  },
];

export default function Facts() {
  return (
    <>
      <SectionTitle
        title="Zahlen und Fakten"
        abstract="Die Kalender sind derzeit allen Orten in Vorpommern-Greifswald, aber auch in einigen Regionen der Mecklenburger Seenplatte, Nord-Brandenburg und in Niedersachsen verfügbar."
      />
      <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
        {features.map((feature) => (
          <div key={feature.name} className="flex flex-col">
            <dt className="text-4xl text-primary">{feature.name}</dt>
            <dd className="mt-1 flex flex-auto flex-col ">
              <p className="flex-auto">{feature.description}</p>
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
