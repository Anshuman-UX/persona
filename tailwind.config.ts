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
        sans: ["var(--font-space-grotesk)", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // Design system tokens
        "bg-base":     "var(--bg-base)",
        "bg-surface":  "var(--bg-surface)",
        "bg-elevated": "var(--bg-elevated)",
        accent:        "var(--accent)",
      },
      boxShadow: {
        "glow-accent": "0 0 60px var(--accent-glow)",
      },
    },
  },
  plugins: [],
};
export default config;

