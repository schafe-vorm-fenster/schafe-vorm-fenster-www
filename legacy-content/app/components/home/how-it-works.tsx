import SectionTitle from "../section-title";
import Button from "../button";
import Image from "next/image";

// Google Kalender
// Dein Termin
// Trage deine Veranstaltung in deinen eigenen Google Kalender ein.

// Automatischer Import von allen Terminen
// Automatischer Import
// Mit deiner Kalender ID importieren wir automatisch deine Termine.

// Dorf QR Code
// Für alle sichtbar
// Deine Veranstaltung ist in deinem Ort und der Umgebung online.

// Alle Funktionen im Überblick
// Jetzt loslegen und Kalender anmelden

// public/img/howitworks/auto.png public/img/howitworks/cal.png public/img/howitworks/qrcode.png

export default function HowItWorks() {
  return (
    <>
      <SectionTitle
        title="So einfach funktioniert's"
        abstract="Dein Termin. Dein Kalender. Dein Dorf."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <Image
            src="/img/howitworks/cal.png"
            alt="Google Kalender"
            className="mb-4 mx-auto"
            height={100}
            width={100}
          />
          <h3 className="font-medium text-xl">Google Kalender</h3>
          <p>
            Trage deine Veranstaltung in deinen eigenen Google Kalender ein.
          </p>
        </div>
        <div className="text-center">
          <Image
            src="/img/howitworks/auto.png"
            alt="Automatischer Import"
            className="mb-4 mx-auto"
            height={100}
            width={100}
          />
          <h3 className="font-medium text-xl">Automatischer Import</h3>
          <p>
            Mit deiner Kalender ID importieren wir automatisch deine Termine.
          </p>
        </div>
        <div className="text-center">
          <Image
            src="/img/howitworks/qrcode.png"
            alt="Dorf QR Code"
            className="mb-4 mx-auto"
            height={100}
            width={100}
          />
          <h3 className="font-medium text-xl">Dorf QR Code</h3>
          <p>Deine Veranstaltung ist in deinem Ort und der Umgebung online.</p>
        </div>
      </div>
      <div className="mt-8 text-center">
        <Button
          link="/start"
          label="Jetzt loslegen und Kalender anmelden"
          color="green"
        />
      </div>
    </>
  );
}
