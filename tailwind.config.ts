import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        heading: ["var(--font-bricolage)", "system-ui", "sans-serif"],
      },
      colors: {
        "bg-base": "var(--bg-base)",
        "bg-dark": "#0a0a0a",
        "bg-surface": "var(--bg-surface)",
        "pastel-yellow": "#fef08a",
        "pastel-blue": "#bfdbfe",
        "pastel-green": "#bbf7d0",
        accent: "var(--accent)",
      },
      boxShadow: {
        "glow-accent": "0 0 60px var(--accent-glow)",
      },
    },
  },
  plugins: [],
};
export default config;

