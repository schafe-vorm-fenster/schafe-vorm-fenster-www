import SectionTitle from "../section-title";

const testimonials = [
  {
    body: "Für dieses Projek sehe ich unsere Landbevölkerung, aber auch mobile Händler als Gewinner. Die ländliche Bevölkerung im ländlichen Bereich kann mit frischen und regionalen Produkten regelmäßig und bequem vor der Haustür versorgt werden, Händler können diese Produkte direkt vermarkten.",
    author: {
      name: "Dr. A. Zschiesche",
      handle: "Bürgermeisterin Groß Kiesow",
    },
  },
  {
    body: "Mit der Digitalen Terminliste für die Dörfer in Vorpommern-Greifswald werden die Fahrtrouten anderer Unternehmen transparenter. Anstatt wie bisher auf gut Glück in die Dörfer zu fahren, könnte man sich dann gemeinsam abstimmen und so das Produktangebot der ländlichen Bevölkerung deutlich verbessern.",
    author: {
      name: "Elisabeth Kurzweg",
      handle: "Bäckerei Kurzweg, Rothenklempenow",
    },
  },
  {
    body: "Über diesen Marketingkanal können wir gezielt in die ländliche Region unsere Sonder- und Tagesangebote und auch kurzfristige Routenänderungen kommunizieren. Das erhöht die Kundenbindung und trägt zur Zufriedenheit unserer Kundschaft bei.",

    author: {
      name: "Höfegemeinschaft Pommern",
      handle: "Rothenklempenow",
    },
  },
  {
    body: "Das Projekt kann überdies nicht nur einen guten Beitrag an der Schnittstelle zwischen Kultur, Vereinsleben und Gemeinden leisten, sondern vor allem auch die angeschlagenen Kleinunternehmen und wirtschaftlichen Akteure in unserer Region einen wertvollen Beitrag zum wirtschaftlichen Wiederaufbau in Folge der Corona-Krise leisten.",
    author: {
      name: "Kulturlandbüro Uecker Randow",
      handle: "Schloss Bröllin",
    },
  },
  {
    body: "Weil mich Ihr Projekt so begeistert und ich die dringende Notwendigkeit Ihres Dienstes in meinem Wohnort sehe, habe ich gleich Kontakt mit Ihnen aufgenommen und Ihnen bei der Daten- und Terminfindung geholfen. Die Zusammenarbeit macht mir Spaß.",
    author: {
      name: "Wolfram Schopenhauer",
      handle: "Mitglied der GV, Stolpe a.d.Peene",
    },
  },
  {
    body: "Der Ansatz der Schafe vorm Fenster UG, nachdem die Termindaten in Selbstverwaltung durch die jeweiligen Akteure und hoher Automatisierung bereitgestellt werden, stellt für uns einen großen Vorteil dar, da sich der Arbeitsaufwand unserer Gemeinde dadurch reduziert.",
    author: {
      name: "Holger Wendt",
      handle: "Bürgermeister in Rubkow",
    },
  },
  {
    body: "Die Platzierung von unserem Fahrplan auf einer Online-Plattform mit einem unmittelbar örtlichen Bezug und in einem breiterem Kontext von Unternehmen und Vereinen, hilft uns die Reichweite unserer Kommunikation zu erhöhen.",
    author: {
      name: "Frank Lettkemann",
      handle: "Geschäftsführer AVG, Anklam",
    },
  },
  {
    body: "Wir haben mit großer Freude vom Projekt „Digitale Terminliste“ erfahren, weil wir selber festgestellt haben, wie unglaublich schwierig und frustrierend es in einem Flächenland ist, sich die Angebote zusammen zu suchen, die man gerade braucht. Sei es ein Anbieter von Bio-Produkten, privaten Unterkünften, kulturelle Veranstaltungen etc.",

    author: {
      name: "Uwe Eichler",
      handle: "Wasserschloss Quilow",
    },
  },
  {
    body: "Unsere Projekte befruchten sich auf konstruktive Weise und wir freuen uns sehr über die Initiative der Digitalisierung auf den Dörfern für eine bessere Sichtbarkeit des Landlebens und der Angebote vor Ort.",
    author: {
      name: "Projekt Landinventur",
      handle: "Thünen-Institut für Regionalentwicklung e.V.",
    },
  },
];

export default function Testimonials() {
  return (
    <>
      <SectionTitle
        title="Testimonilas"
        abstract="Das sagen Nutzer und Kunden über uns."
      />
      <div className="sm:columns-2 lg:columns-3">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.author.handle}
            className="pb-8 sm:inline-block sm:w-full sm:px-4"
          >
            <figure className="rounded-xl bg-gray-200 p-8 text-black">
              <blockquote className="">
                <p>{`“${testimonial.body}”`}</p>
              </blockquote>
              <figcaption className="mt-6 flex items-center text-sm">
                <div>
                  <div className="font-medium text-gray-900">
                    {testimonial.author.name}
                  </div>
                  <div className="text-gray-600">{`${testimonial.author.handle}`}</div>
                </div>
              </figcaption>
            </figure>
          </div>
        ))}
      </div>
    </>
  );
}
