import type { Metadata } from "next";
import "./globals.css";

import { Catamaran } from "next/font/google";
import Header from "./components/header";
import Footer from "./components/footer";
import Head from "next/head";

const catamaran = Catamaran({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-catamaran",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${catamaran.variable} `}>
      <Head>
        <script
          id="_etLoader"
          type="text/javascript"
          data-block-cookies="true"
          data-secure-code="i9strK"
          src="//code.etracker.com/code/e.js"
          async
        ></script>
      </Head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
