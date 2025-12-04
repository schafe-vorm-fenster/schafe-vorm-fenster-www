import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#b4cf39", // Hinzugefügte Primärfarbe
      },
      fontFamily: {
        sans: ["var(--font-catamaran)"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
