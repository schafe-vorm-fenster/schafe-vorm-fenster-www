import React, { ReactElement } from "react";
import clsx from "clsx";

interface SectionProps {
  children: React.ReactNode;
  color?: "black" | "white" | "green";
}

export function Section(props: SectionProps): ReactElement {
  const { children, color = "white" } = props;
  const sectionClass = clsx({
    "bg-gray-900": color === "black",
    "text-white": color === "black",
    "bg-white": color === "white",
    "text-black": color === "white" || color === "green",
    "bg-primary": color === "green",
    "px-4": true, // default padding for all devices
    "py-8": true, // default padding for all devices
    "lg:py-12": true, // large padding for desktops
    "md:px-8": true, // medium padding for tablets
    "lg:px-20": true, // large padding for desktops
    "xl:px-40": true, // extra large padding for large desktops
  });

  return <section className={sectionClass}>{children}</section>;
}

export default Section;
