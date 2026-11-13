import Image from "next/image";
import SectionTitle from "../section-title";

// Jan-Henrik Hempel
// Jan-Henrik Hempel
// Jan ist unser technischer Leiter. Er arbeitet seit über 20 Jahren als Entwickler und Softwarearchitekt. 2008 zog er von Berlin mit seiner Familie nach Schlatkow, gründete 2014 den Kulturverein der Gemeinde Schmatzin mit und ist seit 2019  ehrenamtlicher Bürgermeister.

// +49 156 78204630
// jan@schafe-vorm-fenster.de

// Christian Sauer
// Christian Sauer
// Christian ist unser Projektkoordinator. Er studierte an der Universität der Künste in Berlin und ist seit 2006 freischaffender Künstler und Kurator (christiansauer.com). Zudem arbeitet er seit mehreren Jahren in der IT-Branche in der Projektleitung, der Kundenbetreuung und der Onlineredaktion.

// +49 156 78689704
// christian@schafe-vorm-fenster.de

interface TeamMember {
  name: string;
  abstract: string;
  image: string;
  tel: string;
  email: string;
}

const team: TeamMember[] = [
  {
    name: "Jan-Henrik Hempel",
    abstract:
      "Jan ist unser technischer Leiter. Er arbeitet seit über 20 Jahren als Entwickler und Softwarearchitekt. 2008 zog er von Berlin mit seiner Familie nach Schlatkow, gründete 2014 den Kulturverein der Gemeinde Schmatzin mit und ist seit 2019  ehrenamtlicher Bürgermeister.",
    image: "jan.jpg",
    tel: "+49 156 78204630",
    email: "jan@schafe-vorm-fenster.de",
  },
  {
    name: "Christian Sauer",
    abstract:
      "Christian ist unser Projektkoordinator. Er studierte an der Universität der Künste in Berlin und ist seit 2006 freischaffender Künstler und Kurator (christiansauer.com). Zudem arbeitet er seit mehreren Jahren in der IT-Branche in der Projektleitung, der Kundenbetreuung und der Onlineredaktion.",
    image: "christian.jpg",
    tel: "+49 156 78689704",
    email: "christian@schafe-vorm-fenster.de",
  },
];

export default function Team() {
  return (
    <>
      <SectionTitle
        title="Team"
        abstract='Hallo, wir sind das "Schafe vorm Fenster" Team.'
      />
      <div role="list" className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {team.map((person) => (
          <div key={person.name} className="text-center">
            <Image
              alt=""
              src={"/img/team/" + person.image}
              className="mx-auto size-44 rounded-full"
              width={100}
              height={100}
            />
            <h3 className="mt-8 text-3xl font-medium">{person.name}</h3>
            <p className="mt-8">{person.abstract}</p>
            <p className="mt-8">
              <a href={"tel:" + person.tel} className=" hover:text-gray-500">
                {person.tel}
              </a>
              <br />
              <a
                href={"mailto:" + person.email}
                className="hover:text-gray-500"
              >
                {person.email}
              </a>
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
