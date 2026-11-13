import Image from "next/image";
import packageJson from "../../package.json" assert { type: "json" };
import { legalMenu, mainMenu } from "./navigation";

const navigation = {
  main: mainMenu,
};

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <div className="flex justify-center mb-6">
          <Image
            src="/Schafe-vorm-Fenster-UG_Logo_green.svg"
            alt="Logo"
            className="h-12"
            width={50}
            height={50}
          />
        </div>
        <nav
          aria-label="Footer"
          className="-mb-6 flex flex-wrap justify-center gap-x-12 gap-y-3 text-sm/6"
        >
          {navigation.main.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-600 hover:text-gray-900"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* add legalMenu */}
        <nav
          aria-label="Legal"
          className="flex flex-wrap justify-center gap-x-12 gap-y-3 mt-12 text-sm/6"
        >
          {legalMenu.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-600 hover:text-gray-900"
            >
              {item.name}
            </a>
          ))}
        </nav>
        <p className="mt-10 text-center text-sm/6 text-gray-600">
          &copy; {new Date().getFullYear()} {packageJson.author.name}
        </p>
      </div>
    </footer>
  );
}
