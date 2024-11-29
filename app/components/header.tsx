"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainMenu } from "./navigation";

export default function Header() {
  const path = usePathname();
  return (
    <header className={path === "/" ? "bg-primary" : "bg-white"}>
      <nav>
        <ul className="flex justify-center list-none p-0">
          {mainMenu.map((item) => (
            <li key={item.name} className="mx-2 my-4">
              <Link
                href={item.href}
                className={`block text-sm text-black px-0 py-1 mx-2 ${
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
