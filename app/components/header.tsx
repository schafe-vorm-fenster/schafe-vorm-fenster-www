"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainMenu } from "./navigation";

export default function Header() {
  const path = usePathname();
  return (
    <header className={path === "/" ? "bg-primary" : "bg-white"}>
      <nav className="pb-4 md:pb-0 border-b-2 border-black md:border-0">
        <ul className="flex flex-col md:flex-row justify-center list-none p-0">
          {mainMenu.map((item) => (
            <li key={item.name} className="md:mx-2 md:my-4">
              <Link
                href={item.href}
                className={`inline-block md:block text-sm text-black px-0 py-1 mx-2 ${
                  (item.href !== "/" && path.startsWith(item.href)) ||
                  path === item.href
                    ? "border-b-2 border-black"
                    : ""
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
