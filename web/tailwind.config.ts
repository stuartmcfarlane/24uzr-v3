import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "24uzr": "#0ea5e9",
        "24uzr-disabled": "#bae6fd",
        "24uzr-red": "red",
        "beufort-1": "rgb(134, 163, 171)",
        "beufort-2": "rgb(15,147,167,256)",
        "beufort-3": "rgb(57,163,57,256)",
        "beufort-4": "rgb(200,66,13,256)",
        "beufort-5": "rgb(175,80,136)",
        "beufort-6": "rgb(117,74,147)",
        "beufort-7": "rgb(194,251,119,256)",
        "beufort-8": "rgb(241,255,109,256)",
        "beufort-9": "rgb(256,256,256,256)",
        "beufort-10": "rgb(0,256,256,256)"

      },
    },
  },
  plugins: [],
};
export default config;
