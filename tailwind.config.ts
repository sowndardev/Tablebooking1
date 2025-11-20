import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#9c2b2e",
          foreground: "#fff9f3"
        },
        accent: "#f7c873"
      }
    }
  },
  plugins: []
};

export default config;

