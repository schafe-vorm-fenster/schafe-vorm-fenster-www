"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createLead } from "./actions";
import Link from "next/link";
import clsx from "clsx";
import Button from "../components/button";
import SectionTitle from "../components/section-title";

const initialState = {
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className={clsx(
        "inline-flex rounded-md px-3.5 py-2.5 hover:bg-opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        {
          "bg-primary text-white focus-visible:outline-primary": !pending,
          "bg-gray-400 text-gray-700 cursor-not-allowed": pending,
        }
      )}
    >
      Jetzt anmelden
    </button>
  );
}

export function NewLeadForm() {
  // useActionState is available with React 19 (Next.js App Router)
  const [state, formAction] = useActionState(createLead, initialState);

  if (state?.message === "SUCCESS") {
    return (
      <div className="max-w-3xl mx-auto flex flex-col space-y-4">
        <p>
          Vielen Dank für deine Anmeldung. Deine Daten sind gut bei uns
          angekommen. Wir melden uns in Kürze bei dir.
        </p>
        <p>
          Hier kannst du dir schon einmal die Anleitungen ansehen, wie du deine
          Termine in den Kalender eintragen kannst.
        </p>
        <Button link="/hilfe" label="Anleitungen" color="green" />
      </div>
    );
  }

  return (
    <>
      <SectionTitle title="Jetzt anmelden" />
      <form action={formAction} className="max-w-3xl mx-auto">
        <fieldset className="flex flex-col space-y-4 mb-16">
          <legend className="text-4xl font-medium">Deine Daten</legend>
          <p>
            Da wir deine Termine direkt veröffentlichen, ist es wichtig, dass
            wir wissen wer Du bist und wie wir dich erreichen können. So
            verhindern wir auch einen Missbrauch der Dorfterminlisten.
          </p>
          <input
            type="text"
            name="organization"
            placeholder="Name deines Vereins, der Gemeinde, des Unternehmens ..."
            className="w-full p-3 bg-white border-l-4 border-l-[#9db63b] text-black"
            required
          />

          <input
            type="text"
            name="firstname"
            placeholder="Vorname"
            className="w-full p-3 bg-white border-l-4 border-l-[#9db63b] text-black"
            required
          />
          <input
            type="text"
            name="lastname"
            placeholder="Nachname"
            className="w-full p-3 bg-white border-l-4 border-l-[#9db63b] text-black"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Telefonnummer"
            className="w-full p-3 bg-white border-l-4 border-l-[#9db63b] text-black"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="E-Mail-Adresse"
            className="w-full p-3 bg-white border-l-4 border-l-[#9db63b] text-black"
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Anschrift mit Straße und Hausnummer"
            className="w-full p-3 bg-white border-l-4 border-l-[#cbd5e1] text-black"
          />

          <input
            type="text"
            name="zip"
            placeholder="Postleitzahl"
            className="w-full p-3 bg-white border-l-4 border-l-[#cbd5e1] text-black"
          />
          <input
            type="text"
            name="city"
            placeholder="Ort"
            className="w-full p-3 bg-white border-l-4 border-l-[#cbd5e1] col-span-2 text-black"
          />

          <input
            type="text"
            name="website"
            placeholder="Webseite"
            className="w-full p-3 bg-white border-l-4 border-l-[#cbd5e1] text-black"
          />
        </fieldset>

        <fieldset className="flex flex-col space-y-4 mb-16">
          <legend className="text-4xl font-medium">
            Melde deinen Kalender an
          </legend>

          <p className="text-white mb-4">
            Wenn du schon einen oder mehrere öffentliche Google Kalender hast,
            gib hier direkt die IDs an. Dann können wir deine Termine
            unmittelbar veröffentlichen.
            <br />
            <Link
              href="/hilfe/kalender-veroeffentlichen"
              target="_blank"
              className="text-[#64b5f6] hover:underline mb-6 inline-block"
            >
              So findest du deine Kalender ID.
            </Link>
          </p>

          <input
            type="text"
            name="calendarId"
            placeholder="Google Kalender ID"
            className="w-full p-3 bg-white border-l-4 border-l-[#9db63b] text-black"
          />
        </fieldset>

        <fieldset className="flex flex-col space-y-4 mb-16">
          <legend className="text-4xl font-medium">
            Wie hast Du von uns erfahren?
          </legend>
          <p>
            Wir freuen uns, dass du uns gefunden hast. Wir sind gespannt, wie du
            auf uns aufmerksam geworden bist.
          </p>
          <select className="w-full p-3 text-gray-400 text-black" name="source">
            <option value="">Wie bist du auf uns gestoßen?</option>
            <option value="search">Suchmaschine</option>
            <option value="social">Soziale Medien</option>
            <option value="recommendation">Empfehlung</option>
            <option value="other">Sonstiges</option>
          </select>

          <textarea
            placeholder="Anmerkungen und Ergänzungen"
            name="notes"
            className="w-full p-3 bg-white border-l-4 border-l-[#cbd5e1] min-h-[120px] text-black"
          />
        </fieldset>
        <SubmitButton />
        <p aria-live="polite" className="text-black" role="status">
          {state?.message}
        </p>
      </form>
    </>
  );
}
