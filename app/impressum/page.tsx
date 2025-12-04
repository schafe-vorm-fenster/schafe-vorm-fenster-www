import { Metadata } from "next";
import Script from "next/script";
import { getLegalContent } from "@/lib/legal-content";
import LegalClient from "./legal-client";

export const metadata: Metadata = {
  title: "Impressum und Datenschutz",
  description: "Schafe vorm Fenster UG",
  keywords: [
    "Schafe vorm Fenster",
    "digitale Terminliste",
    "Veranstaltungen",
    "Dorfleben",
    "Termine",
  ],
};

export default async function Impressum() {
  const sections = await getLegalContent();

  return (
    <>
      <Script
        id="_etValues"
        type="text/javascript"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var et_pagename: 'Impressum und Datenschutz';
            var et_areas: 'About';
          `,
        }}
      />
      <div className="bg-white min-h-screen">
        <LegalClient sections={sections} />
      </div>
    </>
  );
}
