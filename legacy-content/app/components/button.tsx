import React from "react";
import Link from "next/link";
import clsx from "clsx";

interface ButtonProps {
  link: string;
  label: string;
  color: "white" | "black" | "green";
}

export default function Button({ link, label, color }: ButtonProps) {
  return (
    <Link
      href={link}
      className={clsx(
        "inline-flex rounded-md px-3.5 py-2.5  hover:bg-opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        {
          "bg-white text-black focus-visible:outline-white": color === "white",
          "bg-primary text-black focus-visible:outline-green":
            color === "green",
          "bg-black text-white focus-visible:outline-black": color === "black",
        }
      )}
    >
      {label}
    </Link>
  );
}
