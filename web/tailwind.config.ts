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
        "beaufort-1": "rgb(134, 163, 171)",
        "beaufort-2": "rgb(15,147,167,256)",
        "beaufort-3": "rgb(57,163,57,256)",
        "beaufort-4": "rgb(200,66,13,256)",
        "beaufort-5": "rgb(175,80,136)",
        "beaufort-6": "rgb(117,74,147)",
        "beaufort-7": "rgb(194,251,119,256)",
        "beaufort-8": "rgb(241,255,109,256)",
        "beaufort-9": "rgb(256,256,256,256)",
        "beaufort-10": "rgb(0,256,256,256)",
        "tws-1": "#1f77b4",
        "tws-2": "#1f77b4",
        "tws-3": "#1f77b4",
        "tws-4": "#1f77b4",
        "tws-5": "#1f77b4",
        "tws-6": "#1f77b4",
        "tws-7": "#ff7f0e",
        "tws-8": "#ff7f0e",
        "tws-9": "#2ca02c",
        "tws-10": "#2ca02c",
        "tws-11": "#d62728",
        "tws-12": "#d62728",
        "tws-13": "#9467bd",
        "tws-14": "#9467bd",
        "tws-15": "#17becf",
        "tws-16": "#17becf",
        "tws-17": "#e377c2",
        "tws-18": "#e377c2",
        "tws-19": "#e377c2",
        "tws-20": "#e377c2",
        "tws-21": "#777",
        "tws-22": "#777",
        "tws-23": "#777",
        "tws-24": "#777",
        "tws-25": "#777",
      },
    },
  },
  "safelist": [
    {
      "pattern": /text-tws/
    }
  ],
  plugins: [],
};
export default config;
